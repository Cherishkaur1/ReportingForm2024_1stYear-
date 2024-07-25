const csv = require('csv-parser');

// Updated readCSV function to handle CSV data from the request body
exports.readCSV = (csvData) => {
    return new Promise((resolve, reject) => {
        const results = [];
        const readableStream = require('stream').Readable.from([csvData]);

        readableStream
            .pipe(csv({ separator: '|' })) // Specify the pipe separator
            .on('data', (data) => results.push(data))
            .on('end', () => {
                resolve(results);
            })
            .on('error', (err) => {
                reject(err);
            });
    });
};

exports.transformData = (data) =>{

};


const pool = mysql.createPool({
    host: process.env.HOST,
    port: process.env.SQL_PORT,
    user: process.env.USER,
    password: process.env.PASS,
    database: process.env.DATABASE,
    waitForConnections: true,
    connectionLimit: parseInt(process.env.CONNECTION_LIMIT, 100), // Ensure the limit is an integer
    queueLimit: 0
});

const insertData = (data) =>{
    try{
        
    }catch(error){
        console.log("Can't update the data")
    }
}

