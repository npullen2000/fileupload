import dotenv from "dotenv";
import aws from "aws-sdk";
import jwt_decode from "jwt-decode";
dotenv.config();

const region = "us-east-2";
const bucketName = process.env.AWX_BUCKET_NAME;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

const s3 = new aws.S3({
  region,
  accessKeyId,
  secretAccessKey,
  signatureVersion: "v4",
});

export async function generateUploadURL(file_name, cf_authorization_cookie) {
  const decoded_token = jwt_decode(cf_authorization_cookie);
  const email = decoded_token.email;
  const trim_domain_regex = /(@[a-z0-9A-Z]{1,}.[a-z0-9A-Z]{1,})/g;
  const email_no_domain = email.replace(trim_domain_regex, "");
  const aws_doc_name = `${email_no_domain}__${file_name}`;
  console.log({ file_name: aws_doc_name });

  const params = {
    Bucket: bucketName,
    Key: imageName,
    Expires: 60,
  };

  const uploadURL = await s3.getSignedUrlPromise("putObject", params);
  return uploadURL;
}
