import React, { useState, useEffect } from 'react';

const ShowTable = ({ csvFile }) => {
  const [csvHeaders, setCsvHeaders] = useState([]);
  const [csvData, setCsvData] = useState([]);

  useEffect(() => {
    if (csvFile) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target.result;
        parseCSV(text);
      };
      reader.readAsText(csvFile);
    }
  }, [csvFile]);

  // Function to parse CSV text
  const parseCSV = (csvText) => {
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split('|');
    const data = lines.slice(1).map((line) => {
      const values = line.split('|');
      return headers.reduce((acc, header, index) => {
        acc[header.trim()] = values[index].trim();
        return acc;
      }, {});
    });

    setCsvHeaders(headers);
    setCsvData(data);
  };

  return (
    <div className="table-section">
      {csvData.length > 0 ? (
        <table>
          <thead>
            <tr>
              {csvHeaders.map((header, index) => (
                <th key={index}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {csvData.map((row, index) => (
              <tr key={index}>
                {csvHeaders.map((header, idx) => (
                  <td key={idx}>{row[header]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
};

export default ShowTable;
