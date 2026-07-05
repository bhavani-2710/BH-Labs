require("dotenv").config();
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const path = require("path");

cloudinary.config({
  cloud_name: "dzmb718aw",
  api_key: "115896662838791",
  api_secret:"aj5N_R0SogxIBF7kuksJgCHuxLE"
});

const pdfDirectory = path.join(__dirname, "../client/public");

async function uploadPdfs() {
  try {
    const files = fs
      .readdirSync(pdfDirectory)
      .filter((file) => path.extname(file).toLowerCase() === ".pdf");

    if (files.length === 0) {
      console.log("No PDF files found.");
      return;
    }

    for (const file of files) {
      const filePath = path.join(pdfDirectory, file);

      console.log(`Uploading ${file}...`);

      const result = await cloudinary.uploader.upload(filePath, {
        resource_type: "raw", // PDFs should be uploaded as raw files
        folder: "subjects",   // Cloudinary folder name
        public_id: path.parse(file).name,
        overwrite: true,
      });

      console.log(`✅ Uploaded: ${file}`);
      console.log(`result ${JSON.stringify(result, null, 2)}\n`);
    }

    console.log("All PDFs uploaded successfully.");
  } catch (error) {
    console.error("Upload failed:", error);
  }
}

uploadPdfs();