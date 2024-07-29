const mysql = require('mysql2/promise');

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

exports.createAdmission = async (req, res, next) => {
    const {
        admission_number, school_name, department, program, program_type, name,
        father_name, mother_name, gender, address, city, state, pincode,
        country, contact_number_student, parent_contact_number, email_id,
        email_id_parent, date_of_birth, admission_category, aadhar, ABCID,entry_type
    } = req.body;

    try {
        // Fetch the latest UID from admission2024 table
        const [rows] = await pool.query('SELECT MAX(CAST(SUBSTRING(UID, 4) AS UNSIGNED)) AS max_uid FROM admission2024');
        let maxUid = rows[0].max_uid || 2400000; // Starting UID if table is empty
        console.log(rows[0].max_uid, maxUid);
        
        // Generate the next UID
        const nextUid = `CTU${maxUid + 1}`;

        // Insert the new row with the generated UID and current date for registration_date
        const insertQuery = `
            INSERT INTO admission2024 (
                UID, admission_number, admission_category, school_name, department, program, program_type, name,
                father_name, mother_name, gender, address, city, state, pincode,
                country, contact_number_student, parent_contact_number, email_id,
                email_id_parent, aadhar, ABCID, date_of_birth,entry_type , registration_date
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? , ? , ?)
        `;

        let regDate = new Date();
        let y = regDate.getFullYear();
        let m = String(regDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        let d = String(regDate.getDate()).padStart(2, '0');
        regDate = `${d}-${m}-${y}`;
        
        const [result] = await pool.query(insertQuery, [
            nextUid, admission_number, admission_category, school_name, department, program, program_type, name,
            father_name, mother_name, gender, address, city, state, pincode,
            country, contact_number_student, parent_contact_number, email_id,
            email_id_parent, aadhar, ABCID, date_of_birth,entry_type , regDate
        ]);

        res.status(201).json({ message: 'Record created', data: { ...req.body, UID: nextUid } });
    } catch (err) {
        console.error('Error creating record:', err);
        next(err);
    }
};



exports.getAdmission = async (req, res, next) => {
    const { admission_number } = req.params;

    const selectQuery = `SELECT * FROM admission2024 WHERE admission_number = ?`;

    try {
        const [rows] = await pool.query(selectQuery, [admission_number]);
        if (rows.length > 0) {
            res.status(200).json(rows[0]);
        } else {
            res.status(404).json({ message: 'Record not found' });
        }
    } catch (err) {
        console.error('Error reading record:', err);
        next(err);
    }
};


exports.updateAdmission = async (req, res, next) => {
    const { admission_number } = req.params;
    const {
        UID, admission_category, school_name, department, program, program_type, name,
        father_name, mother_name, gender, address, city, state, pincode,
        country, contact_number_student, parent_contact_number, email_id,
        email_id_parent, aadhar, ABCID, date_of_birth, entry_type
    } = req.body;

    const updateQuery = `
        UPDATE admission2024
        SET UID = ?, admission_category = ?, school_name = ?, department = ?, program = ?, program_type = ?, name = ?,
            father_name = ?, mother_name = ?, gender = ?, address = ?, city = ?,
            state = ?, pincode = ?, country = ?, contact_number_student = ?,
            parent_contact_number = ?, email_id = ?, email_id_parent = ?, aadhar = ?, ABCID = ?, date_of_birth = ?, entry_type = ?
        WHERE admission_number = ?
    `;

    try {
        const [result] = await pool.query(updateQuery, [
            UID, admission_category, school_name, department, program, program_type, name,
            father_name, mother_name, gender, address, city, state, pincode,
            country, contact_number_student, parent_contact_number, email_id,
            email_id_parent, aadhar, ABCID, date_of_birth, entry_type, admission_number
        ]);

        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Record updated', result });
        } else {
            res.status(404).json({ message: 'Record not found' });
        }
    } catch (err) {
        console.error('Error updating record:', err);
        next(err);
    }
};


exports.deleteAdmission = async (req, res, next) => {
    const { admission_number } = req.params;

    const deleteQuery = `DELETE FROM admission2024 WHERE admission_number = ?`;

    try {
        const [result] = await pool.query(deleteQuery, [admission_number]);
        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Record deleted' });
        } else {
            res.status(404).json({ message: 'Record not found' });
        }
    } catch (err) {
        console.error('Error deleting record:', err);
        next(err);
    }
};

exports.isAdmissionNumberUnique = async (req, res, next) => {
    const { admission_number } = req.params;

    const checkQuery = `SELECT COUNT(*) AS count FROM admission2024 WHERE admission_number = ?`;

    try {
        const [rows] = await pool.query(checkQuery, [admission_number]);
        const isUnique = rows[0].count === 0;
        res.status(200).json({ isUnique });
    } catch (err) {
        console.error('Error checking admission number uniqueness:', err);
        next(err);
    }
};

// Function to fetch admission data based on filters
exports.getAdmissionData = async (req, res, next) => {
    const { school, program, department, program_type, admission_category, entry_type, reporting_date } = req.query;

    // Function to convert date from yyyy-mm-dd to dd-mm-yyyy
    const formatDate = (dateStr) => {
        if (!dateStr) return null;
        const [year, month, day] = dateStr.split('-');
        return `${day}-${month}-${year}`;
    };

    // Base query
    let query = `SELECT * FROM admission2024`;

    // Array to store conditions and values for the query
    let conditions = [];
    let values = [];

    // Add conditions based on filters
    if (school) {
        conditions.push(`school_name = ?`);
        values.push(school);
    }
    if (program) {
        conditions.push(`program = ?`);
        values.push(program);
    }
    if (department) {
        conditions.push(`department = ?`);
        values.push(department);
    }
    if (program_type) {
        conditions.push(`program_type = ?`);
        values.push(program_type);
    }
    if (admission_category) {
        conditions.push(`admission_category = ?`);
        values.push(admission_category);
    }
    if (entry_type) {
        conditions.push(`entry_type = ?`);
        values.push(entry_type);
    }
    if (reporting_date) {
        // Convert reporting_date format
        const formattedDate = formatDate(reporting_date);
        conditions.push(`registration_date = ?`);
        values.push(formattedDate);
    }

    // If there are conditions, append them to the query
    if (conditions.length > 0) {
        query += ` WHERE ` + conditions.join(' AND ');
    }

    try {
        // Execute the query
        const [rows] = await pool.query(query, values);

        // Return the results as a JSON response
        res.status(200).json(rows);
    } catch (err) {
        console.error('Error fetching admission data:', err);
        next(err);
    }
};
