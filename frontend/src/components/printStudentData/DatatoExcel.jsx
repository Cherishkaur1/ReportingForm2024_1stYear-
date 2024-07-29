import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export const exportToExcel = (data, header) => {

  let fileName =  'data of '+ data.length +' Students'+ header.reporting_date +'.xlsx'; 
  // Convert JSON data to worksheet
  const worksheet = XLSX.utils.json_to_sheet(data);

  // Create a new workbook and add the worksheet to it
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

  // Generate Excel file
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

  // Create a Blob and save it using file-saver
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, fileName);
};