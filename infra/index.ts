import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

const projectName = "unity-webgl-upload-action-test";
// Create an AWS resource (S3 Bucket)
const bucket = new aws.s3.BucketV2(projectName);
const user = new aws.iam.User(projectName);
const accessKey = new aws.iam.AccessKey(projectName, {
  user: user.name,
});

// policy to allow the user to access the Bucket
const policy = new aws.iam.Policy(projectName, {
  policy: bucket.arn.apply((arn) =>
    JSON.stringify({
      Version: "2012-10-17",
      Statement: [
        {
          Effect: "Allow",
          Action: ["s3:*", "s3:ListBucket"],
          Resource: [arn, `${arn}/*`],
        },
      ],
    }),
  ),
});

// Attach the policy to the User
new aws.iam.UserPolicyAttachment(projectName, {
  user: user.name,
  policyArn: policy.arn,
});

// Export the name of the bucket
export const bucketName = bucket.id;
export const userName = user.name;
export const accessKeyId = accessKey.id;
export const secretAccessKey = accessKey.secret;
