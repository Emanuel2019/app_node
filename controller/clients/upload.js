const mysql = require("../mysql");
const multer = require("multer");
const XLSX = require("xlsx");
// const Pusher = require("pusher");
const fs = require('fs');
const path = require('path');
const upload=async(req,res,next)=>{
    const filePath = req.file.path;
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

  const insertQuery =
    "INSERT INTO clients (reference, name, address, country, city, phone1, phone2, email1, email2) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

  sheetData.forEach(async (client) => {
    const {
      reference,
      name,
      address,
      country,
      city,
      phone1,
      phone2,
      email1,
      email2,
    } = client;

    try {
      await mysql.execute(insertQuery, [
        reference,
        name,
        address,
        country,
        city,
        phone1,
        phone2,
        email1,
        email2,
      ]);
    } catch (error) {
      console.error("Erro ao inserir cliente:", error);
    }
  });

  fs.unlink(filePath, (err) => {
    if (err) {
      console.error("Erro ao remover o arquivo enviado:", err);
    }
  });

  res.status(200).json({ message: "Arquivo carregado e dados inseridos!" });
}
module.exports = upload;