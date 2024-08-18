import * as Minio from 'minio'

interface S3Config {
  endPoint: string
  port: number
  accessKey: string
  secretKey: string
  useSSL: boolean
}

// Create a new Minio client with the S3 endpoint, access key, and secret key
const s3Config: S3Config = {
  endPoint: process.env.S3_ENDPOINT || 'localhost',
  port: process.env.S3_PORT ? Number(process.env.S3_PORT) : 9000,
  accessKey: process.env.S3_ACCESS_KEY || 'YOUR_ACCESS_KEY',
  secretKey: process.env.S3_SECRET_KEY || 'YOUR_SECRET_KEY',
  useSSL: process.env.S3_USE_SSL === 'true',
}

export const s3Client = new Minio.Client(s3Config)

export async function createBucketIfNotExists(bucketName: string) {
  try {
    const bucketExists = await s3Client.bucketExists(bucketName)
    if (!bucketExists) {
      const bucket = await s3Client.makeBucket(bucketName);
      console.log("Creating Bucket Success!");
    }
  } catch (error) {
    console.error('Error checking or creating bucket:', error)
    throw error
  }
}

export async function generatePresignedUrl(bucketName: string, fileName: string, expiresIn: number): Promise<string> {
  try {
    const url = await s3Client.presignedGetObject(bucketName, fileName, expiresIn);
    console.log("URL : ",url);
    return url;
  } catch (error) {
    console.error('Error generating pre-signed URL:', error);
    throw error;
  }
}
