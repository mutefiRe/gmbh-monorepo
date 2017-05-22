module.exports = {
  secret: process.env.GMBH_SECRET || "oursecret",
  nmap: ['--scan-delay=1s', '-p T:9100']
};
