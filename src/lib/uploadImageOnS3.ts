export function uploadImage(file): Promise<string> {
  const params = {
    Body: file.buffer,
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: process.env.S3_ACCESS_KEY,
  };

  return this.s3
    .putObject(params)
    .promise()
    .then(() => process.env.S3_ACCESS_KEY, (err) => err);
}
