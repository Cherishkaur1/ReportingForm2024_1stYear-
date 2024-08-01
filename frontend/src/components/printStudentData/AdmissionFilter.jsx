import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { admission_category, entry_type, HOST, program_type } from '../../context/Constants';
import { exportToExcel } from './DatatoExcel';

function sortByUIDDescending(data) {
  return data.sort((a, b) => {
      // Extract UID values
      const uidA = a.UID;
      const uidB = b.UID;
      
      // Compare the UID values in descending order
      if (uidA < uidB) {
          return 1; // Move b before a
      }
      if (uidA > uidB) {
          return -1; // Move a before b
      }
      return 0; // Keep the order unchanged
  });
}

const AdmissionFilter = () => {
  // State to hold filter values
  const [filters, setFilters] = useState({
    school: '',
    program: '',
    department: '',
    program_type: '',
    admission_category: '',
    entry_type: '',
    reporting_date: '' // Single date filter for reporting date
  });

  // State to hold fetched data
  const [data, setData] = useState([]);

  // State to hold loading and error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

    const fetchDepartments = async () => {
        try {
            const response = await axios.get(`${HOST}/DepratmentData/${encodeURIComponent(filters.school)}`);
            setDepartmentOptions(response.data);
        } catch (error) {
            console.error('Error fetching departments:', error);
        }
    };

    const fetchPrograms = async () => {
        try {
            const response = await axios.get(`${HOST}/ProgramData/${encodeURIComponent(filters.department)}`);
            setProgramOptions(response.data);
        } catch (error) {
            console.error('Error fetching programs:', error);
        }
    };

  // Function to fetch data based on filters
  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${HOST}/getData/getAdmissionData`, { params: filters });
      const val = response.data;
      setData(sortByUIDDescending(val));
    } catch (err) {
      setError('Error fetching data');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when filters change
  useEffect(() => {
    fetchSchools();
}, []);

useEffect(() => {
    if (filters.school) {
        fetchDepartments();
    } else {
        setDepartmentOptions([]);
    }

    if (filters.department) {
      fetchPrograms();
  } else {
      setProgramOptions([]);
  }

  fetchData();

}, [filters]);


  // Handle filter changes
  const handleChange = (e) => {
    if(e.target.name == "school"){
      setFilters({...filters , department:"" , program:""});
    }
    if(e.target.name == "department" && e.target.value == ""){
      setFilters({...filters ,program:""});
    }
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  // Handle exporting data to Excel
  const handleExport = () => {
    exportToExcel(data, filters);
  };

  return (
    <div className="p-4 w-full mx-auto">
      <h1 className="text-2xl font-bold mb-4">Admission Data Filter</h1>

      <div className="flex flex-wrap gap-4 mb-6">
        {[
          { name: 'school', label: 'School', options: schoolOptions },
          { name: 'department', label: 'Department', options: departmentOptions },
          { name: 'program', label: 'Program', options: programOptions },
          { name: 'program_type', label: 'Program Type', options: program_type },
          { name: 'admission_category', label: 'Admission Category', options: admission_category },
          { name: 'entry_type', label: 'Entry Type', options: entry_type }
        ].map(({ name, label, options }) => (
          <div key={name} className="flex-1 min-w-[150px]">
            <label className="block text-sm text-gray-700 text-[19px]">
              {label}:
              <select
                name={name}
                value={filters[name]}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
              >
                <option value="">Select {label}</option>
                {options && options.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </label>
          </div>
        ))}

        {/* Reporting Date Filter */}
        <div className="flex-1 min-w-[150px]">
          <label className="block text-sm text-gray-700 text-[19px]">
            Reporting Date:
            <input
              type="date"
              name="reporting_date"
              value={filters.reporting_date}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
            />
          </label>
        </div>
      </div>

      <div>
        <button
          onClick={handleExport}
          className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Export to Excel
        </button>
        <label className='ml-[40%] font-semibold'>Total Number of Studetns : <label className='font-bold text-red-600 text-[20px]'>{data.length}</label></label>
      </div>

      <div>
        {loading && <p className="text-blue-500">Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {data.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 bg-white shadow-md rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  {[
                    'UID', 'Admission Number', 'Admission Category', 'School Name', 'Department', 'Program',
                    'Program Type', 'Name', 'Father\'s Name', 'Mother\'s Name', 'Gender', 'Address', 'City',
                    'State', 'Pincode', 'Country', 'Contact Number (Student)', 'Parent Contact Number',
                    'Email ID', 'Email ID (Parent)', 'Aadhar', 'ABCID', 'Date of Birth', 'Registration Date',
                    'Entry Type'
                  ].map(header => (
                    <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.map((item) => (
                  <tr key={item.admission_number}>
                    <td className="px-6 py-4 whitespace-nowrap">{item.UID}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.admission_number}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.admission_category}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.school_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.department}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.program}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.program_type}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.father_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.mother_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.gender}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.address}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.city}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.state}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.pincode}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.country}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.contact_number_student}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.parent_contact_number}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.email_id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.email_id_parent}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.aadhar}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.ABCID}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.date_of_birth}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.registration_date}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.entry_type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdmissionFilter;
