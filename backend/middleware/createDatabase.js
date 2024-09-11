// connectionPool.js
const mysql = require('mysql2/promise');

// Initialize the connection pool as a singleton
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

const createTable = async () => {
    // Create 'admission2024' table if it doesn't exist
    const createTableQuery = `CREATE TABLE IF NOT EXISTS admission2024(
        UID VARCHAR(20) NOT NULL UNIQUE,
        admission_number VARCHAR(8) NOT NULL PRIMARY KEY,
        admission_category VARCHAR(255) NOT NULL,
        school_name VARCHAR(255) NOT NULL,
        department VARCHAR(255) NOT NULL,
        program VARCHAR(255) NOT NULL,
        program_type VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        father_name VARCHAR(255) NOT NULL,
        mother_name VARCHAR(255) NOT NULL,
        gender VARCHAR(10) NOT NULL,
        address TEXT,
        city VARCHAR(255) NOT NULL,
        state VARCHAR(255) NOT NULL,
        pincode VARCHAR(10) NOT NULL,
        country VARCHAR(255) NOT NULL,
        contact_number_student VARCHAR(15) NOT NULL,
        parent_contact_number VARCHAR(15),
        email_id VARCHAR(255) NOT NULL,
        email_id_parent VARCHAR(255),
        aadhar VARCHAR(255),
        ABCID VARCHAR(255),
        date_of_birth VARCHAR(10) NOT NULL,
        registration_date VARCHAR(10) NOT NULL,
        entry_type VARCHAR(255) NOT NULL,
        status VARCHAR(255) DEFAULT 'still'
    )`;

    const createTableQuery2 = `CREATE TABLE IF NOT EXISTS studentData2024(
        admission_number VARCHAR(8) NOT NULL PRIMARY KEY,
        admission_category VARCHAR(255) ,
        school_name VARCHAR(255) ,
        department VARCHAR(255) ,
        program VARCHAR(255) ,
        program_type VARCHAR(255),
        name VARCHAR(255),
        father_name VARCHAR(255),
        mother_name VARCHAR(255),
        gender VARCHAR(10),
        address TEXT,
        city VARCHAR(255),
        state VARCHAR(255),
        pincode VARCHAR(10),
        country VARCHAR(255),
        contact_number_student VARCHAR(25),
        parent_contact_number VARCHAR(25),
        email_id VARCHAR(255),
        aadhar VARCHAR(255),
        date_of_birth VARCHAR(10),
        pending VARCHAR(1000)
    )`;
    
    const createTableQuery3 = `CREATE TABLE IF NOT EXISTS schoolNameTable(
        school_name VARCHAR(255) NOT NULL,
        department VARCHAR(255) NOT NULL,
        program VARCHAR(255) NOT NULL
    )`;

    try {
        await pool.query(createTableQuery3);
        console.log('Table "schoolNameTable" created or already exists');
    } catch (err) {
        console.error('Error creating table:', err);
    }

    try {
        await pool.query(createTableQuery);
        console.log('Table "admission2024" created or already exists');
    } catch (err) {
        console.error('Error creating table:', err);
    }

    try {
        await pool.query(createTableQuery2);
        console.log('Table "studentData2024" created or already exists');
    } catch (err) {
        console.error('Error creating table:', err);
    }
};


exports.checkConnection = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('Connected to MySQL database');
        connection.release(); // Release the connection back to the pool
        await createTable();
    } catch (err) {
        console.error('Error connecting to MySQL database :', err);
        throw err; // Throw error to terminate application or handle appropriately
    }
};

// Export a function to get a connection from the pool
exports.getConnection = async () => {
    return await pool.getConnection();
};
