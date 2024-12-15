import * as core from "@actions/core";
import uploadDirectory from "./src/upload-directory";

const region = core.getInput("aws-region");
const bucketName = core.getInput("bucket-name");
const buildFolder = core.getInput("build-folder");
const accessKeyId = core.getInput("aws-access-key-id");
const secretAccessKey = core.getInput("aws-secret-access-key");
const addressablesFolder = core.getInput("addressables-folder");

// env variables are not automatically set in the action
process.env.AWS_REGION = region;
process.env.AWS_ACCESS_KEY_ID = accessKeyId;
process.env.AWS_SECRET_ACCESS_KEY = secretAccessKey;

//console.log("wave hand");
console.log(`Region: ${region}`);
console.log(`Bucket Name: ${bucketName}`);
console.log(`Build Folder: ${buildFolder}`);
console.log(`Addressables Folder: ${addressablesFolder}`);

uploadDirectory(bucketName, buildFolder, "test/");
