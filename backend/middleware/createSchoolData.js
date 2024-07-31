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


exports.insertSchoolName = async(req,res,next) => {
    const {school , department , program} = req.body;
    const insertQuery = `INSERT INTO schoolNameTable (school_name, department, program)
                         VALUES (?, ?, ?)`;

    try {
        const [result] = await pool.query(insertQuery, [school, department, program]);
        res.status(200).send('Data inserted successfully:');
        return result;
    } catch (err) {
        console.error('Error inserting data:', err);
        throw err;
    }
    
}

exports.getAllSchool = async(req,res,next) => {
    const insertQuery = `SELECT DISTINCT school_name FROM schoolNameTable`;
    try {
        const [result] = await pool.query(insertQuery);
        const data = [];
        result.map((obj) =>(
            data.push(obj.school_name)
        ));
        res.status(200).send(data);
    } catch (err) {
        console.error('Error inserting data:', err);
        throw err;
    }
}

exports.getDepartmentBySchool = async (req, res, next) => {
    const school = req.params.school_name;

    // Use a parameterized query to avoid SQL injection
    const insertQuery = `SELECT DISTINCT department FROM schoolNameTable WHERE school_name = ?`;

    try {
        // Execute the query with the parameter
        const [result] = await pool.query(insertQuery, [school]);
        const data = [];
        result.map((obj) =>(
            data.push(obj.department)
        ));
        res.status(200).send(data);
    } catch (err) {
        console.error('Error querying data:', err);
        res.status(500).send('Internal Server Error');
    }
}

exports.getProgramByDepartment = async (req, res, next) => {
    const department = req.params.department;

    // Use a parameterized query to avoid SQL injection
    const insertQuery = `SELECT DISTINCT program FROM schoolNameTable WHERE department = ?`;

    try {
        // Execute the query with the parameter
        const [result] = await pool.query(insertQuery, [department]);
        const data = [];
        result.map((obj) =>(
            data.push(obj.program)
        ));
        res.status(200).send(data);
    } catch (err) {
        console.error('Error querying data:', err);
        res.status(500).send('Internal Server Error');
    }
}


