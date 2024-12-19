import * as core from "@actions/core";
import uploadDirectory from "./upload-directory";

const region = core.getInput("aws-region");
const bucketName = core.getInput("bucket-name");
const buildFolder = core.getInput("build-folder");
const accessKeyId = core.getInput("aws-access-key-id");
const secretAccessKey = core.getInput("aws-secret-access-key");
const addressablesFolder = core.getInput("addressables-folder");

console.log("addressables folder", core.getInput("addressables-folder"));
// env variables are not automatically set in the action
process.env.AWS_REGION = region;

process.env.AWS_ACCESS_KEY_ID = accessKeyId;
process.env.AWS_SECRET_ACCESS_KEY = secretAccessKey;

console.log(`Region: ${region}`);
console.log(`Bucket Name: ${bucketName}`);
console.log(`Build Folder: ${buildFolder}`);
console.log(`Addressables Folder: ${addressablesFolder}`);

const uploadActions = [uploadDirectory(bucketName, buildFolder, "build/")];

if (addressablesFolder) {
  uploadActions.push(
    uploadDirectory(bucketName, addressablesFolder, "addressables/"),
  );
}

(async function () {
  await Promise.all(uploadActions);
})();
