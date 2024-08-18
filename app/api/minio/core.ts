// app/api/minio/core.ts
import { NextApiRequest, NextApiResponse } from 'next';
import multer from 'multer';
import { s3Client, createBucketIfNotExists } from '@/lib/minio';

const bucketName = process.env.S3_BUCKET_NAME || 'my-bucket';

// Ensure the bucket exists
createBucketIfNotExists(bucketName);

// Configure Multer
const storage = multer.memoryStorage();
const upload = multer({ storage });

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    // Use Multer middleware directly
    return new Promise<void>((resolve, reject) => {
      upload.single('file')(req as any, res as any, async (err) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }

        const file = (req as any).file;
        if (!file) {
          return res.status(400).json({ error: 'No file uploaded' });
        }

        try {
          // Upload file to Minio
          await s3Client.putObject(bucketName, file.originalname, file.buffer);
          const fileUrl = `${process.env.S3_ENDPOINT}/${bucketName}/${file.originalname}`;
          res.status(200).json({ url: fileUrl });
        } catch (error) {
          console.error('Error uploading file to Minio:', error);
          res.status(500).json({ error: 'Failed to upload file' });
        }

        resolve();
      });
    });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default handler;
