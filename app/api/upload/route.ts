import { NextRequest, NextResponse } from 'next/server';
import { s3Client, createBucketIfNotExists } from '@/lib/minio';

const bucketName = 'ws-dev';
createBucketIfNotExists(bucketName);

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type');
    
    console.log("ASU ! : ",contentType);
    
    if (!contentType || !contentType.includes('multipart/form-data')) {
      return NextResponse.json({ error: 'Unsupported Content-Type. Please use "multipart/form-data".' }, { status: 415 });
    }

    const formData = await request.formData();
    const files = formData.getAll('file') as File[];

    if (files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 });
    }

    const urls: string[] = [];
    const fileNames: string[] = [];

    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const fileName = `uploads/${Date.now()}-${file.name}`;
      
      try {
        await s3Client.putObject(bucketName, fileName, buffer);
      } catch (error) {
        console.error('Error uploading to MinIO:', error);
        return NextResponse.json({ error: 'Failed to upload file to MinIO' }, { status: 500 });
      }

      try {
        const expiresIn = 60 * 60; // 1 hour
        const url = await s3Client.presignedGetObject(bucketName, fileName, expiresIn);
        
        urls.push(url);
        fileNames.push(file.name);
      } catch (error) {
        console.error('Error generating presigned URL:', error);
        return NextResponse.json({ error: 'Failed to generate presigned URL' }, { status: 500 });
      }
    }

    return NextResponse.json({ status: 'success', urls, fileNames });
  } catch (error) {
    console.error('Error processing upload request:', error);
    return NextResponse.json({ error: 'Failed to process the request' }, { status: 500 });
  }
}
