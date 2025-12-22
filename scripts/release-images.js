const { execSync } = require("child_process");
const path = require("path");
const { getVersions } = require("./versions");

function parseArgs() {
  const args = {};
  const rawArgs = process.argv.slice(2);
  rawArgs.forEach((arg, index) => {
    if (arg === "--tag" && rawArgs[index + 1]) {
      args.tag = rawArgs[index + 1];
    }
  });
  return args;
}

function run(command) {
  console.log(`\n> ${command}`);
  execSync(command, { stdio: "inherit" });
}

function getImageName(registry, repo, image) {
  return `${registry.replace(/\/$/, "")}/${repo.replace(/\/$/, "")}/${image}`;
}

const args = parseArgs();
const releaseTag = args.tag || "latest";
const registry = process.env.DOCKER_REGISTRY || "docker.io";
const repo = process.env.DOCKER_REPO || "gmbh";
const versions = getVersions();
const branch =
  process.env.GITHUB_REF ??
  require("child_process").execSync("git rev-parse --abbrev-ref HEAD").toString().trim();
const canPushLatest = releaseTag !== "latest" || branch === "main";

const services = [
  { name: "api", versionKey: "api", image: "gmbh-api", context: "api", dockerfile: "api/Dockerfile" },
  { name: "printer-api", versionKey: "printerApi", image: "gmbh-printer-api", context: "printer-api", dockerfile: "printer-api/Dockerfile" },
  { name: "fake-printer", versionKey: "fakePrinter", image: "gmbh-fake-printer", context: "fake-printer", dockerfile: "fake-printer/Dockerfile" },
  { name: "admin", versionKey: "admin", image: "gmbh-admin", context: "admin", dockerfile: "admin/Dockerfile" },
  { name: "waiter", versionKey: "waiter", image: "gmbh-waiter", context: "waiter", dockerfile: "waiter/Dockerfile" },
  { name: "update-api", versionKey: "updateApi", image: "gmbh-update-api", context: "update-api", dockerfile: "update-api/Dockerfile" }
];

console.log("Releasing Docker images with versions:", versions);
console.log("Using release tag:", releaseTag);

services.forEach((service) => {
  const version = versions[service.versionKey];
  if (!version) {
    throw new Error(`missing version for ${service.name}`);
  }
  const imageName = getImageName(registry, repo, service.image);
  const buildContext = path.resolve(__dirname, "..", service.context);
  const dockerfile = path.resolve(__dirname, "..", service.dockerfile);
  run(`docker build -f "${dockerfile}" -t "${imageName}:${version}" "${buildContext}"`);
  const shouldPushReleaseTag =
    releaseTag && releaseTag !== version && (releaseTag !== "latest" || canPushLatest);
  if (shouldPushReleaseTag) {
    run(`docker tag "${imageName}:${version}" "${imageName}:${releaseTag}"`);
  }
  run(`docker push "${imageName}:${version}"`);
  if (shouldPushReleaseTag) {
    run(`docker push "${imageName}:${releaseTag}"`);
  } else if (releaseTag === "latest" && branch !== "main" && releaseTag !== version) {
    console.log(`Skipping push/tag of latest for ${service.name} because branch is ${branch}`);
  }
});
