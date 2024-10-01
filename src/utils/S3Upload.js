import sanitizedConfig from "../config.js";
import AWS from "aws-sdk";
const s3 = new AWS.S3();



export const uploadFileToS3 = (fileData, fileName, folderName, contentType) => {
    const params = {
      Bucket: sanitizedConfig.S3_BUCKET_NAME,
      Key: `${folderName}/${fileName}`,
      Body: fileData,
      ACL: "public-read",
      ContentType: contentType,
    };
  
    // AWS setup
    AWS.config.update({
      accessKeyId: sanitizedConfig.AWS_ACCESS_KEY_ID,
      secretAccessKey: sanitizedConfig.AWS_SECRET_ACCESS_KEY,
      region: sanitizedConfig.AWS_REGION,
    });
  
    return new Promise((resolve, reject) => {
      s3.upload(params, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data.Location);
        }
      });
    });
  };
  