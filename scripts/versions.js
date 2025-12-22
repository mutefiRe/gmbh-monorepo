const fs = require("fs");
const path = require("path");

function readPackageVersion(packagePath) {
  const json = JSON.parse(fs.readFileSync(packagePath, "utf-8"));
  if (!json.version) {
    throw new Error(`missing version in ${packagePath}`);
  }
  return json.version;
}

function readPrinterVersion() {
  const versionFile = path.join(__dirname, "..", "printer-api", "version", "version.go");
  const content = fs.readFileSync(versionFile, "utf-8");
  const match = content.match(/Version\s*=\s*"([^"]+)"/);
  if (!match) {
    throw new Error("printer-api version constant not found");
  }
  return match[1];
}

function getVersions() {
  return {
    api: readPackageVersion(path.join(__dirname, "..", "api", "package.json")),
    admin: readPackageVersion(path.join(__dirname, "..", "admin", "package.json")),
    waiter: readPackageVersion(path.join(__dirname, "..", "waiter", "package.json")),
    printerApi: readPrinterVersion(),
    fakePrinter: readPackageVersion(path.join(__dirname, "..", "fake-printer", "package.json")),
    updateApi: readPackageVersion(path.join(__dirname, "..", "update-api", "package.json"))
  };
}

if (require.main === module) {
  console.log(JSON.stringify(getVersions(), null, 2));
} else {
  module.exports = { getVersions };
}
