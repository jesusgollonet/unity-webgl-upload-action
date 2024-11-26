import core from "@actions/core";

const region = core.getInput("aws-region");
const bucketName = core.getInput("bucket-name");
const buildFolder = core.getInput("build-folder");
const addressablesFolder = core.getInput("addressables-folder");

console.log("wave hand");
console.log(`Region: ${region}`);
console.log(`Bucket Name: ${bucketName}`);
console.log(`Build Folder: ${buildFolder}`);
console.log(`Addressables Folder: ${addressablesFolder}`);
