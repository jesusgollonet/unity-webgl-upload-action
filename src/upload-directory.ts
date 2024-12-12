import { readFile, readdir } from "fs/promises";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import path from "path";

const s3 = new S3Client({ region: "eu-central-1" });

const mimeTypes = {
  ".js.br": "application/octet-stream",
  ".js.gz": "application/octet-stream",
  ".wasm.br": "application/wasm",
  ".wasm.gz": "application/wasm",
  ".gz": "application/gzip",
  ".br": "application/octet-stream",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".html": "text/html",
  ".js": "application/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".xml": "application/xml",
  ".wasm": "application/wasm",
  ".ico": "image/x-icon",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".otf": "font/otf",
  ".bundle": "application/application/octet-stream",
};

// Function to get MIME type based on file extension
function getContentType(fileName: string) {
  // go through the keys of the mimeTypes object and find the one that matches the file extension
  // longer are first
  const extension: string | undefined = Object.keys(mimeTypes).find((ext) =>
    fileName.endsWith(ext),
  );
  return extension
    ? mimeTypes[extension as keyof typeof mimeTypes]
    : "application/octet-stream";
}

// Function to set Content-Encoding for compressed files
function getContentEncoding(fileName: string): string | null {
  const extension = path.extname(fileName);
  if (extension === ".br") return "br";
  if (extension === ".gz") return "gzip";
  return null;
}

export default async function uploadDirectory(
  s3Bucket: string,
  localPath: string,
  s3PathPrefix = "",
) {
  const files = await readdir(localPath, { withFileTypes: true });
  console.log("files!!");
  console.log(s3Bucket, localPath, s3PathPrefix);

  for (const file of files) {
    const filePath = path.join(localPath, file.name);
    if (file.isDirectory()) {
      await uploadDirectory(s3Bucket, filePath, `${s3PathPrefix}${file.name}/`);
    } else {
      const fileContent = await readFile(filePath);
      console.log("uploading file", file.name);
      await s3.send(
        new PutObjectCommand({
          Bucket: s3Bucket,
          Key: `${s3PathPrefix}${file.name}`,
          Body: fileContent,
          ContentType: getContentType(file.name),
          ContentEncoding: getContentEncoding(file.name) ?? undefined,
        }),
      );
    }
  }
}
