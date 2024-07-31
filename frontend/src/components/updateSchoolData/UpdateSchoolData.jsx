import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UpdateSchoolData = () => {
    const [schoolOptions, setSchoolOptions] = useState([]);
    const [departmentOptions, setDepartmentOptions] = useState([]);
    const [programOptions, setProgramOptions] = useState([]);
    
    const [school, setSchool] = useState('');
    const [department, setDepartment] = useState('');
    const [program, setProgram] = useState('');
    
    const fetchSchools = async () => {
        try {
            const response = await axios.get('http://192.168.124.197:1000/SchoolData/getAllSchoolName');
            setSchoolOptions(response.data.map(school => school.school_name));
        } catch (error) {
            console.error('Error fetching schools:', error);
        }
    };

    const fetchDepartments = async (schoolName) => {
        try {
            const response = await axios.get(`http://192.168.124.197:1000/DepratmentData/${encodeURIComponent(schoolName)}`);
            setDepartmentOptions(response.data.map(department => department.department));
        } catch (error) {
            console.error('Error fetching departments:', error);
        }
    };

    const fetchPrograms = async (departmentName) => {
        try {
            const response = await axios.get(`http://192.168.124.197:1000/ProgramData/${encodeURIComponent(departmentName)}`);
            setProgramOptions(response.data.map(program => program.program));
        } catch (error) {
            console.error('Error fetching programs:', error);
        }
    };

    useEffect(() => {
        fetchSchools();
    }, []);

    useEffect(() => {
        if (school) {
            fetchDepartments(school);
        } else {
            setDepartmentOptions([]);
        }
    }, [school]);

    useEffect(() => {
        if (department) {
            fetchPrograms(department);
        } else {
            setProgramOptions([]);
        }
    }, [department]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://192.168.124.197:1000/SchoolData/addSchoolData', { school, department, program });
            alert('Data submitted successfully!');
        } catch (error) {
            console.error('Error submitting data:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="school">School</label>
                <input
                    type="text"
                    id="school"
                    value={school}
                    onChange={(e) => setSchool(e.target.value)}
                    list="school-options"
                />
                <datalist id="school-options">
                    {schoolOptions.map(option => (
                        <option key={option} value={option} />
                    ))}
                </datalist>
            </div>

            <div>
                <label htmlFor="department">Department</label>
                <input
                    type="text"
                    id="department"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    list="department-options"
                />
                <datalist id="department-options">
                    {departmentOptions.map(option => (
                        <option key={option} value={option} />
                    ))}
                </datalist>
            </div>

            <div>
                <label htmlFor="program">Program</label>
                <input
                    type="text"
                    id="program"
                    value={program}
                    onChange={(e) => setProgram(e.target.value)}
                    list="program-options"
                />
                <datalist id="program-options">
                    {programOptions.map(option => (
                        <option key={option} value={option} />
                    ))}
                </datalist>
            </div>

            <button type="submit">Submit</button>
        </form>
    );
};

export default AutoFillForm;
