module.exports = {
  secret: process.env.GMBH_SECRET || "oursecret",
  nmap: ['--scan-delay=0.5s', '-p T:9100']
};
