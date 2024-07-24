import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import axios from 'axios'; // Import Axios
import UploadFile from './UploadFile';
import ShowTable from './ShowTable';

const InsertData = () => {


  const [uploadFilePage , setUploadFilePage] = useState(true);
  const [csvFile,setCSVFile] = useState({});

  const handleFile = (data, fileName) => {
    if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const csvData = XLSX.utils.sheet_to_csv(firstSheet, { FS: '|' });
        console.log('CSV Data we are Getting : \n', csvData);
        setUploadFilePage(false);
        setCSVFile(csvData);
        

      // Send CSV data to backend using Axios
    //   axios.post(`${HOST}/addFile`, { 'data' : csvData })
    //     .then(response => {
    //       console.log('Data taken from CSV File :', response.data);
    //       setData(response.data);
    //       setFrontPage(false);
    //       // Handle success response if needed
    //     })
    //     .catch(error => {
    //       console.error('Error uploading file:', error);
    //       // Handle error
    //     });


    } else if (fileName.endsWith('.csv')) {
      // Handle CSV file
      const textDecoder = new TextDecoder('utf-8');
      const decodedData = textDecoder.decode(data);
      console.log(decodedData);

    //   // Send CSV data to backend using Axios
    //   axios.post(`${HOST}/addFile`, { csvData: decodedData })
    //     .then(response => {
    //       // console.log('File uploaded successfully:', response.data);
    //       setData(response.data);
    //       setFrontPage(false);
    //       // Handle success response if needed
    //     })
    //     .catch(error => {
    //       console.error('Error uploading file:', error);
    //       // Handle error
    //     });
    } else {
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
