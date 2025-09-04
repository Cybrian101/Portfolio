import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import fs from "fs";
import path from "path";

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, purpose } = body;

    // Defines where the Excel file will be stored (project root /data/contacts.xlsx)
    const filePath = path.join(process.cwd(), "data", "contacts.xlsx");

    // Ensures the data directory exists before trying to write to it
    if (!fs.existsSync(path.dirname(filePath))) {
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
    }

    let workbook;
    let worksheet;

    // If the file already exists, it reads the content. Otherwise, it creates a new file.
    if (fs.existsSync(filePath)) {
      workbook = XLSX.readFile(filePath);
      worksheet = workbook.Sheets["Contacts"];
    } else {
      workbook = XLSX.utils.book_new();
      worksheet = XLSX.utils.json_to_sheet([]);
      XLSX.utils.book_append_sheet(workbook, worksheet, "Contacts");
    }

    // Adds the new contact information as a new row in the sheet
    const data = XLSX.utils.sheet_to_json(worksheet);
    data.push({
      Name: name,
      Email: email,
      Purpose: purpose,
      Date: new Date().toLocaleString(),
    });

    const newWorksheet = XLSX.utils.json_to_sheet(data);
    workbook.Sheets["Contacts"] = newWorksheet;

    // Writes the updated data back to the contacts.xlsx file
    XLSX.writeFile(workbook, filePath);

    return NextResponse.json({ message: "Saved to Excel successfully" }, { status: 200 });
  } catch (error) {
    // This will catch any errors during the file writing process
    console.error("Excel save error:", error);
    return NextResponse.json({ error: "Failed to save contact" }, { status: 500 });
  }
}
