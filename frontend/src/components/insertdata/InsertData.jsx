import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import axios from 'axios'; // Import Axios
import UploadFile from './UploadFile';
import ShowTable from './ShowTable';
import { HOST } from '../../context/Constants';


const InsertData = () => {


  const [uploadFilePage , setUploadFilePage] = useState(true);
  const [csvFile,setCSVFile] = useState({});

  const handleFile = (data, fileName) => {
    if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const csvData = XLSX.utils.sheet_to_csv(firstSheet, { FS: '|' });
        

      // Send CSV data to backend using Axios
      axios.post(`${HOST}/addData`, { 'data' : csvData })
        .then(response => {
          alert("Data Updated")
        })
        .catch(error => {
          console.error('Error uploading file:', error);
          // Handle error
        });


    }else {
      console.error('Unsupported file type');
      return;
    }
  };

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {uploadFilePage ? <UploadFile handleFile = {handleFile}/> : <ShowTable csvFile={csvFile}/>}
    </div>
  );
};

export default InsertData;
