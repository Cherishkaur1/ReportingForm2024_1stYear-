import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { HOST } from '../../context/Constants';

const AutoFillDiv = () => {

    const [school, setSchool] = useState('');
    const [department, setDepartment] = useState('');
    const [program, setProgram] = useState('');


    const [schoolOptions, setSchoolOptions] = useState([]);
    const [departmentOptions, setDepartmentOptions] = useState([]);
    const [programOptions, setProgramOptions] = useState([]);
        
    
    const fetchSchools = async () => {
        try {
            const response = await axios.get(`${HOST}/SchoolData/getAllSchoolName`);
            setSchoolOptions(response.data);
        } catch (error) {
            console.error('Error fetching schools:', error);
        }
    };

    const fetchDepartments = async (schoolName) => {
        try {
            const response = await axios.get(`${HOST}/DepratmentData/${encodeURIComponent(schoolName)}`);
            setDepartmentOptions(response.data);
        } catch (error) {
            console.error('Error fetching departments:', error);
        }
    };

    const fetchPrograms = async (departmentName) => {
        try {
            const response = await axios.get(`${HOST}/ProgramData/${encodeURIComponent(departmentName)}`);
            setProgramOptions(response.data);
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

    // useEffect(()=>{
    //     console.log(schoolOptions , departmentOptions)
    // })

    const handleSubmit = async () => {
        console.log("LOL")
        if(school == "" || department== "" || program==""){
            alert("Please fill the data properly");
            return;
        }
        try {
            await axios.post(`${HOST}/SchoolData/addSchoolData`, { school, department, program });
            alert('Data submitted successfully!');
        } catch (error) {
            console.error('Error submitting data:', error);
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-6">Add School Data</h1>
            
            <div className="space-y-4">
                <div>
                    <label htmlFor="school" className="block text-lg font-medium text-gray-700">School</label>
                    <input
                        type="text"
                        id="school"
                        value={school}
                        onChange={(e) => setSchool(e.target.value)}
                        list="school-options"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    <datalist id="school-options">
                        {schoolOptions.map(option => (
                            <option key={option} value={option} />
                        ))}
                    </datalist>
                </div>

                <div>
                    <label htmlFor="department" className="block text-lg font-medium text-gray-700">Department</label>
                    <input
                        type="text"
                        id="department"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        list="department-options"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    <datalist id="department-options">
                        {departmentOptions.map(option => (
                            <option key={option} value={option} />
                        ))}
                    </datalist>
                </div>

                <div>
                    <label htmlFor="program" className="block text-lg font-medium text-gray-700">Program</label>
                    <input
                        type="text"
                        id="program"
                        value={program}
                        onChange={(e) => setProgram(e.target.value)}
                        list="program-options"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    <datalist id="program-options">
                        {programOptions.map(option => (
                            <option key={option} value={option} />
                        ))}
                    </datalist>
                </div>

                <button
                    type="button"
                    onClick={handleSubmit}
                    className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                    Submit
                </button>
            </div>
        </div>
    );
};

export default AutoFillDiv;
