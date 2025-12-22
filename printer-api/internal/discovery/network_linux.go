//go:build linux

package discovery

import (
	"bufio"
	"encoding/binary"
	"errors"
	"net"
	"os"
	"strconv"
	"strings"
	"time"

	"escpos-service/internal/model"
)

func DiscoverNetworkPrinters(timeout time.Duration, maxHosts int, ports []int, hostFilter map[byte]struct{}, extraHosts []string) ([]model.PrinterRef, error) {
	found := discoverExtraHosts(timeout, ports, extraHosts)
	seen := map[string]bool{}
	for _, ref := range found {
		seen[model.EncodePrinterRef(ref)] = true
	}

	subnets, err := localIPv4Subnets()
	if err != nil {
		if len(found) > 0 {
			return found, nil
		}
		return nil, err
	}

	for _, sn := range subnets {
		ips := enumerateHosts(sn, maxHosts, hostFilter)
		for _, ip := range ips {
			for _, port := range ports {
				addr := net.JoinHostPort(ip.String(), strconv.Itoa(port))
				c, err := net.DialTimeout("tcp", addr, timeout)
				if err != nil {
					continue
				}
				_ = c.Close()

				mac := macFromProcARP(ip.String())
				ref := model.PrinterRef{Transport: "network", Network: &model.NetworkRef{IP: ip.String(), Port: port, MAC: mac}}
				id := model.EncodePrinterRef(ref)
				if seen[id] {
					continue
				}
				seen[id] = true
				found = append(found, ref)
			}
		}
	}
	return found, nil
}

func localIPv4Subnets() ([]*net.IPNet, error) {
	ifaces, err := net.Interfaces()
	if err != nil {
		return nil, err
	}
	var out []*net.IPNet
	for _, ifc := range ifaces {
		if (ifc.Flags&net.FlagUp) == 0 || (ifc.Flags&net.FlagLoopback) != 0 {
			continue
		}
		addrs, _ := ifc.Addrs()
		for _, a := range addrs {
			ipnet, ok := a.(*net.IPNet)
			if !ok || ipnet.IP == nil {
				continue
			}
			ip4 := ipnet.IP.To4()
			if ip4 == nil {
				continue
			}
			mask := ipnet.Mask
			network := ip4.Mask(mask)
			out = append(out, &net.IPNet{IP: network, Mask: mask})
		}
	}
	if len(out) == 0 {
		return nil, errors.New("no IPv4 subnets found")
	}
	return out, nil
}

func enumerateHosts(sn *net.IPNet, maxHosts int, hostFilter map[byte]struct{}) []net.IP {
	ones, bits := sn.Mask.Size()
	if bits != 32 {
		return nil
	}
	hostCount := 1 << uint(32-ones)
	if hostCount > maxHosts {
		hostCount = maxHosts
	}

	base := binary.BigEndian.Uint32(sn.IP.To4())
	var ips []net.IP
	for i := 1; i < hostCount-1; i++ {
		ip := make(net.IP, 4)
		binary.BigEndian.PutUint32(ip, base+uint32(i))
		if sn.Contains(ip) && hostAllowed(ip, hostFilter) {
			ips = append(ips, ip)
		}
	}
	return ips
}

func hostAllowed(ip net.IP, hostFilter map[byte]struct{}) bool {
	if len(hostFilter) == 0 {
		return true
	}
	ip4 := ip.To4()
	if ip4 == nil {
		return false
	}
	_, ok := hostFilter[ip4[3]]
	return ok
}

func macFromProcARP(ip string) string {
	f, err := os.Open("/proc/net/arp")
	if err != nil {
		return ""
	}
	defer f.Close()

	sc := bufio.NewScanner(f)
	for sc.Scan() {
		fields := strings.Fields(sc.Text())
		if len(fields) >= 4 && fields[0] == ip {
			mac := strings.ToLower(fields[3])
			if mac == "00:00:00:00:00:00" {
				return ""
			}
			return mac
		}
	}
	return ""
}
