// server/api/generateCertificate.ts

import { NextApiRequest, NextApiResponse } from "next";
import PDFDocument from "pdfkit";
import QRCode from "qrcode";
import { writeFileSync } from "fs";
import path from "path";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, score, maxScore, userId, quizId } = req.body;

  if (!name || !score || !maxScore || !userId || !quizId) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Generate a QR Code linking to the verification page
  const verificationUrl = `${process.env.BASE_URL}/verify?userId=${userId}&quizId=${quizId}`;
  const qrCodeData = await QRCode.toDataURL(verificationUrl);

  // Create a new PDF document
  const doc = new PDFDocument({ size: "A4" });

  // Define output path (or use streaming if preferred)
  const filePath = path.join(process.cwd(), "public", `certificate-${userId}-${quizId}.pdf`);
  const writeStream = writeFileSync(filePath);

  // Pipe the document to the write stream
  doc.pipe(writeStream);

  // Add certificate content
  doc.fontSize(24).text("Certificate of Achievement", { align: "center" });
  doc.moveDown();

  doc.fontSize(16).text(`This certifies that`, { align: "center" });
  doc.moveDown();

  doc.fontSize(20).text(`${name}`, { align: "center", underline: true });
  doc.moveDown();

  doc.fontSize(16).text(
    `Has successfully completed the quiz with a score of ${score}/${maxScore}.\`,
    { align: "center" }
  );

  doc.moveDown(2);

  // Add QR code
  const qrImageSize = 150;
  doc.image(qrCodeData, doc.page.width / 2 - qrImageSize / 2, doc.y, {
    fit: [qrImageSize, qrImageSize],
    align: "center",
  });

  doc.moveDown(2);
  doc.fontSize(12).text("Scan the QR code to verify this certificate.", {
    align: "center",
  });

  // Footer
  doc.moveDown(2);
  doc.fontSize(10).text(`Issued on: ${new Date().toLocaleDateString()}`, {
    align: "center",
  });

  doc.end();

  // Respond with the file URL
  res.status(200).json({ fileUrl: `/certificate-${userId}-${quizId}.pdf` });
}
