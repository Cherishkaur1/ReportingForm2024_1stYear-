const csv = require('csv-parser');
const mysql = require('mysql2/promise');

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



const formatDate = (dateString) => {
    if (!dateString) return null;

    // Handle 'DD-MM-YYYY'
    let parts = dateString.split('-');
    if (parts.length === 3) {
        if (parts[0].length === 2 && parts[1].length === 2 && parts[2].length === 4) {
            return `${parts[2]}-${parts[1]}-${parts[0]}`; // Convert to 'YYYY-MM-DD'
        }
        // Handle 'MM-DD-YYYY'
        if (parts[0].length === 2 && parts[1].length === 2 && parts[2].length === 4) {
            return `${parts[2]}-${parts[0]}-${parts[1]}`; // Convert to 'YYYY-MM-DD'
        }
    }

    // Handle 'YYYY-MM-DD' as is
    const isoDate = new Date(dateString);
    if (!isNaN(isoDate.getTime()) && dateString === isoDate.toISOString().split('T')[0]) {
        return dateString;
    }

    return null; // Return null if date is not in the expected formats
};

const formatContactNumber = (contactNumber) => {
    return (contactNumber || '').substring(0, 15);
};

const formatValue = (value, maxLength) => {
    return (value || '').substring(0, maxLength);
};

exports.insertOrUpdateData = async (dataList) => {
    const query = `
        INSERT INTO studentData2024 (
            admission_number, admission_category, school_name, department, program, program_type,
            name, father_name, mother_name, gender, address, city, state, pincode, country,
            contact_number_student, parent_contact_number, email_id, aadhar, date_of_birth, pending
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
            admission_category = VALUES(admission_category),
            school_name = VALUES(school_name),
            department = VALUES(department),
            program = VALUES(program),
            program_type = VALUES(program_type),
            name = VALUES(name),
            father_name = VALUES(father_name),
            mother_name = VALUES(mother_name),
            gender = VALUES(gender),
            address = VALUES(address),
            city = VALUES(city),
            state = VALUES(state),
            pincode = VALUES(pincode),
            country = VALUES(country),
            contact_number_student = VALUES(contact_number_student),
            parent_contact_number = VALUES(parent_contact_number),
            email_id = VALUES(email_id),
            aadhar = VALUES(aadhar),
            date_of_birth = VALUES(date_of_birth),
            pending = VALUES(pending)
    `;

    try {
        for (const row of dataList) {
            // Format each value
            const formattedDateOfBirth = formatDate(row['Date of Birth']);
            const contactNumberStudent = formatContactNumber(row['Student Contact']);
            const parentContactNumber = formatContactNumber(row['Father\'s Contact'] || row['Mother\'s Contact']);

            const values = [
                formatValue(row['REG NO'], 8), // admission_number
                formatValue(row['Admission Category (As per Scholarship Category)'], 255), // admission_category
                formatValue(row['SCHOOL'], 255), // school_name
                formatValue(row['Department'], 255), // department
                formatValue(row['Programme'], 255), // program
                formatValue(row['UG/ PG/ Diploma'], 255), // program_type
                formatValue(row['Student\'s Name'], 255), // name
                formatValue(row['Father Name'], 255), // father_name
                formatValue(row['MOTHER NAME'], 255), // mother_name
                formatValue(row['Gender'], 10), // gender
                formatValue(row['ADDRESS VILL/CITY'], 65535), // address (TEXT type, but capped for safety)
                formatValue(row['Tehsil/Distt (Permanent)'], 255), // city
                formatValue(row['State (Permanent)'], 255), // state
                formatValue(row['PIN CODE (Permanent)'], 10), // pincode
                formatValue(row['Country'], 255), // country
                contactNumberStudent, // contact_number_student
                parentContactNumber, // parent_contact_number
                formatValue(row['Email'], 255), // email_id
                formatValue(row['STUDENT\'S Adhar Card No.'], 255), // aadhar
                formattedDateOfBirth, // date_of_birth
                formatValue(row['PENDING DOCUMENTS'], 1000) // pending
            ];

            await pool.query(query, values);
        }
    } catch (err) {
        console.error('Error inserting or updating data:', err);
    }
};


exports.fetchDataByAdmissionNumber = async (admissionNumber) => {
    const query = `
        SELECT 
            admission_number, admission_category, school_name, department, program, program_type,
            name, father_name, mother_name, gender, address, city, state, pincode, country,
            contact_number_student, parent_contact_number, email_id, aadhar, date_of_birth, pending
        FROM studentData2024
        WHERE admission_number = ?
    `;

    try {
        const [rows] = await pool.query(query, [admissionNumber]);
        if (rows.length === 0) {
            return {};
        }

        // Return the data if found
        return rows[0];
    } catch (err) {
        console.error('Error fetching data:', err);
        throw err;
    }
};

