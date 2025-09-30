import React, { useState } from "react";
import * as XLSX from "xlsx";
import "./ExcelViewer.css";

const ExcelViewer = () => {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [sheetName, setSheetName] = useState("");

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const workbook = XLSX.read(bstr, { type: "binary" });
      const firstSheetName = workbook.SheetNames[0];
      setSheetName(firstSheetName);
      const worksheet = workbook.Sheets[firstSheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      setColumns(jsonData[0] || []);
      setData(jsonData.slice(1));
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div className="excel-viewer">
      <h2>Excel File Viewer</h2>
      <input type="file" accept=".xlsx,.xls" onChange={handleFileUpload} />
      {sheetName && <h3>Sheet: {sheetName}</h3>}
      {data.length > 0 && (
        <table>
          <thead>
            <tr>
              {columns.map((col, idx) => (
                <th key={idx}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i}>
                {columns.map((_, j) => (
                  <td key={j}>{row[j]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ExcelViewer;
