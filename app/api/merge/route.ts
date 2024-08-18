import { NextRequest, NextResponse } from 'next/server';
import { s3Client, createBucketIfNotExists } from '@/lib/minio';
import { PDFDocument } from 'pdf-lib';

const bucketName = 'ws-dev';
createBucketIfNotExists(bucketName);

export async function POST(request: NextRequest) {
  const contentType = request.headers.get('content-type');

  // Step 1: Check Content-Type
  if (!contentType || !(contentType.includes('multipart/form-data') || contentType.includes('application/x-www-form-urlencoded'))) {
    // Step 2: Return an Error for Unsupported Content-Type
    return NextResponse.json({ error: 'Unsupported Content-Type. Please use "multipart/form-data" or "application/x-www-form-urlencoded".' }, { status: 415 });
  }

  try {
    let fileUrls: string[] = [];

    // Handle "multipart/form-data" requests
    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      for (const [key, value] of formData.entries()) {
        if (key.startsWith('fileUrls')) {
          fileUrls.push(value as string);
        }
      }
    }

    // Handle "application/x-www-form-urlencoded" requests
    if (contentType.includes('application/x-www-form-urlencoded')) {
      const requestBody = await request.text();
      const params = new URLSearchParams(requestBody);
      fileUrls = params.getAll('fileUrls');
    }

    // Validate fileUrls
    if (fileUrls.length < 2) {
      return NextResponse.json({ error: 'At least two files required for merging' }, { status: 400 });
    }

    const pdfBuffers: Buffer[] = [];

    for (const url of fileUrls) {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to fetch file from URL: ${url}`);
        }
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        pdfBuffers.push(buffer);
      } catch (error) {
        console.error('Error fetching PDF file:', error);
        return NextResponse.json({ error: `Failed to fetch file from URL: ${url}` }, { status: 500 });
      }
    }

    try {
      const mergedPdfBuffer = await mergePdfs(pdfBuffers);

      const mergedFileName = `uploads/${new Date().getTime()}-merged.pdf`;

      await s3Client.putObject(bucketName, mergedFileName, mergedPdfBuffer);

      const expiresIn = 60 * 60; // 1 hour
      const mergedPdfUrl = await s3Client.presignedGetObject(bucketName, mergedFileName, expiresIn);

      return NextResponse.json({ status: 'success', url: mergedPdfUrl });
    } catch (error) {
      console.error('Error merging PDFs:', error);
      return NextResponse.json({ error: 'Failed to merge PDFs' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

async function mergePdfs(pdfBuffers: Buffer[]): Promise<Buffer> {
  const mergedPdf = await PDFDocument.create();

  for (const pdfBuffer of pdfBuffers) {
    const pdf = await PDFDocument.load(pdfBuffer);
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach((page) => {
      mergedPdf.addPage(page);
    });
  }

  const mergedPdfUint8Array = await mergedPdf.save();
  return Buffer.from(mergedPdfUint8Array);
}
