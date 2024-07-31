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

const school = [
    "School of Engineering and Technology",
    "School of Law",
    "School of Health Science",
    "School of Applied Science",
    "School of Optometry",
    "School of Pharmaceutical Science",
    "School of Management , Hotel Management and Design",
    "School of Arts,Science , Humanities and Physical Education",
    "School of Allied Health Science"
]


const department = {
    "School of Engineering and Technology":[
        "Department of Computer Science Engineering",
        "Department of Mechanical Engineering",
        "Department of Civil Engineering",
        "Department of Computer Application",

    ],
    "School of Law":[
        "School of Law"
    ],
    "School of Health Science":[
        "School of Health Science"
    ],
    "School of Allied Health Science":[
        "School of Allied Health Science"
    ],
    "School of Applied Science":[
        "Department of Sciences",

    ],
    "School of Optometry":[
        "School of Optometry"
    ],
    "School of Pharmaceutical Science":[
        "School of Pharmaceutical Sciences"
    ],
    "School of Management , Hotel Management and Design":[
        "Department of Hotel Management",
        "Department of Design",
        "Department of Management Studies",

    ],
    "School of Arts,Science , Humanities and Physical Education":[
        
        "School of Arts,Science , Humanities and Physical Education"
    ]
}

const program = {
    "Department of Computer Science Engineering":[
        "B.Tech. in CSE - Regular & Lateral",
        "B.Tech. in CSE (AI & DS) - Regular & Lateral",
        "B.Tech. in CSE (CS & FS) - Regular & Lateral",
        "Diploma in Computer Science Engineering- Regular & Lateral",
        "M.Tech. in CSE",
        "M.Tech. in CSE (AI & DS)",
        "M.Tech. in CSE (CS & FS)",
        "M.Tech in CSE (ML & AI)"
    ],
    "Department of Civil Engineering":[
        "B.Tech. in Civil Engineering - Regular & Lateral",
        "Diploma in Civil Engineering- Regular & Lateral",
        "M.Tech in CE (Transportation)",
        "M.Tech in CE (Construction Technology & Management)",
        "M.Tech in CE (Structural Engineering)",
        "M.Tech. in Civil Engineering with Specialization in Geo Technical Engineering"
    ],
    "Department of Mechanical Engineering":[
        "B.Tech. in Mechanical Engineering (Automobile)",
        "B.Tech. in Mechanical Engineering (Robotics)",
        "B.Tech. in Mechanical Engineering (Robotics & Automation)",
        "Diploma in Mechanical Engineering- Regular & Lateral",
        "M.Tech. in ME (Production Engineering)",
        "M.Tech. in ME (Robotics & Automation)"
    ],
    "Department of Computer Application":[
        "BCA (AI & DS) - Regular & Lateral",
        "BCA (CS & FS) - Regular & Lateral",
        "B.Sc. (CS)",
        "MCA",
        "MCA (AI & DS)",
        "MCA (CS & FS)",
        "Diploma in Computer Applications",
        "Advance Diploma in Computer Science",
        "Advance Diploma in Computer Applications"
    ],
    "School of Law":[
        "B.Com LLB",
        "LLB",
        "LLM - 1 Yr. - Corporate",
        "LLM - 1 Yr. - Criminal",
        "LLM - 2 Yr. - Corporate",
        "LLM - 2 Yr. - Criminal"
    ],
    "School of Health Science":[
        "Bachelor of Science (MLT) - Regular & Lateral",
        "Bachelor of Science (OTT) - Regular & Lateral",
        "Bachelor of Science (Honors) AT - Regular & Lateral",
        "Bachelor of Science (NDT)",
        "Bachelor of Science (RIT)",
        "B.Sc. (Hons.) Clinical Psychology",
        "Master of Science (RIT)",
        "Master of Public Health",
        "Master of Science ( Anesthesia Technology)",
        "Master of Science (Operation Theatre Technology)",
        "Master of Science (Public Health)",
        "M.Sc. Clinical Psychology",
        "Post Metric Diploma in MLT"

    ],
    "School of Allied Health Science":[
        "Master of Physiotherapy"
    ],
    "School of Optometry":[
        "Bachelor of Optometry - Regular & Lateral",
        "Master of Optometry"
    ],
    "School of Pharmaceutical Sciences":[
        "Bachelor of Pharmacy - Regular & Lateral",
        "Diploma in Pharmacy",
        "Masters of Pharmacy (Pharmacology)",
        "Masters of Pharmacy (Pharmaceutical Chemistry)",
        "Masters of Pharmacy (Pharmaceutics)",
        "Doctor of Pharmacy",
        "Doctor of Pharmacy - Post Baccalaureate"
    ],
    "Department of Hotel Management":[
        "Diploma in Hotel Management",	
        "Diploma in Food Production",
        "Bachelor of Science (Hotel Management)",
        "Bachelor of Science (ATM) - Regular and Lateral Entry",
        "Bachelor of Hotel Management and Catering Technology - Regular and Lateral Entry",
        "Advanced Diploma in Hotel Management",
        "PG Diploma in Hotel Management and Tourism Management",
        "M.Sc. in Hotel Management and Tourism Management"
    ],
    "Department of Design":[
        "Bachelor of Design (Fashion Design)",
        "Bachelor of Science (Fashion Design)",
        "Bachelor of Fine Arts",
        "Bachelor of Science (Multimedia and Animation)",
        "Diploma in Fashion Design",
        "Diploma in Multimedia and Animation",
        "Advanced Diploma in Fashion Design",
        "Advanced Diploma in Multimedia and Animation",
        "Master of Science (Fashion Design)"

    ],
    "Department of Management Studies":[
        "Diploma in Business Administration",
        "Advanced Diploma in Business Administration",
        "BBA - Regular and Lateral",
        "BBA (Artificial Intelligence)",
        "BBA (Business Analytics)",
        "BBA (Financial Services)",
        "BBA (Digital Marketing)",
        "BBA with Bajaj Fiserv Specialization in E-Commerce",
        "BBA with Bajaj Fiserv Specialization in Human Resource ",
        "BBA with Bajaj Fiserv Specialization in Marketing Management",
        "B.Com",
        "B.Com Hons. - Regular and Lateral",
        "B.Com. (Hons.) with Tally Integrated with IAS Coaching",
        "MBA",
        "MBA International"

    ],
    "School of Arts,Science , Humanities and Physical Education":[
        "Bachelor of Science (IT)",
        "Bachelor of Arts",
        "Bachelor of Arts (Social Work)",
        "B. A Political Science",
        "B.Sc. Hons. Psychology",
        "B. A Hons. Psychology",
        "B. A Hons. Economics",
        "B. A English",
        "B. A (Journalism & Mass Communication)",
        "BPES",
        "Bachelor of Science (Agriculture)",
        "M. A (Sociology)",
        "M.Sc. (Psychology)",
        "M.A (Psychology)"

    ],
}





// Insert Data from Constants
exports.insertData = async () => {
    const insertQuery = `INSERT INTO schoolNameTable (school_name, department, program)
                         VALUES (?, ?, ?)`;

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        for (const schoolName of school) {
            const departments = department[schoolName] || [];
            for (const departmentName of departments) {
                const programs = program[departmentName] || [];
                for (const programName of programs) {
                    await connection.query(insertQuery, [schoolName, departmentName, programName]);
                }
            }
        }

        await connection.commit();
        console.log('Data inserted successfully.');
    } catch (err) {
        await connection.rollback();
        console.error('Error inserting data:', err);
    } finally {
        connection.release();
    }
}


