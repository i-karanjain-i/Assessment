import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Readable } from "stream";

const s3 = new S3Client({});

export const handler = async (event) => {
  console.log("Event:", JSON.stringify(event));
  const bucketName = process.env.BUCKET_NAME;
  const key = event.pathParameters.key;

  try {
    if (event.httpMethod === "POST") {
      // store file content from body
      const body = JSON.parse(event.body);

      await s3.send(
        new PutObjectCommand({
          Bucket: bucketName,
          Key: key,
          Body: body.content, // storing text; for binary you’d need Base64 decode
          ContentType: "text/plain"
        })
      );

      return response(200, { message: "File stored", key });
    }

    if (event.httpMethod === "GET") {
      // fetch file and return signed URL instead of raw bytes
      const command = new GetObjectCommand({
        Bucket: bucketName,
        Key: key
      });

      const signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });

      return response(200, {
        message: "Use the signed URL to fetch file",
        url: signedUrl
      });
    }

    return response(400, { message: "Unsupported method" });
  } catch (err) {
    console.error(err);
    return response(500, { error: err.message });
  }
};

function response(statusCode, body) {
  return {
    statusCode,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  };
}
