import React, { useEffect, useState } from 'react';
import { school, department, program , gender,admission_category , program_type,entry_type } from '../context/Constants'; // Adjust the import path as needed

export default function DropDown({ label, name, value, required, handleFormData, setError, dependentData }) {
    const [errorMsg, setErrorMsg] = useState('');
    const [data, setData] = useState(value);
    const [options, setOptions] = useState([]);
    
    useEffect(()=>{
        if (name === 'school_name') {
            setOptions(school);          
        }
        if(name === 'department' && dependentData !== ""){
            setOptions(department[dependentData]);
        }
        if(name === 'program' && dependentData !== ""){
            setOptions((program[dependentData]));
        }
        if(name == 'gender'){
            setOptions(gender);
        }
        if(name == 'admission_category'){
            setOptions(admission_category);
        }
        if(name == 'program_type'){
            setOptions(program_type);
        }
        if(name == 'entry_type'){
            setOptions(entry_type)
        }
    },[dependentData]);

    const validateInput = (inputValue) => {
        if (required && inputValue.trim() === '') {
            return `${label} is required`;
        }
        return true; // Input is valid
    };

    const handleSelect = (e) => {
        const val = e.target.value;
        const valid = validateInput(val);
        if (valid !== true) {
            setErrorMsg(valid);
            setError({ id: name, err: valid });
        } else {
            setErrorMsg('');
            setError({ id: name, err: '' });
            handleFormData({ id: name, value: val });
            setData(val);
        }
    };

    const showError = () => {
        if (errorMsg !== '') {
            return <p className="text-red-500 text-sm">{errorMsg}</p>;
        }
        return null;
    };

    return (
        <div className="space-y-1 mb-2 mr-3">
            <label htmlFor={name} className="block text-sm font-medium text-gray-700">
                {label}
                {required && <span className="text-red-500">*</span>}
            </label>
            <select
                id={name}
                name={name}
                value={data}
                onChange={handleSelect}
                className={`block w-full px-3 py-2 border ${errorMsg !== true && errorMsg !== '' ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                required={required}
            >
                <option value="">-- Select {label} --</option>
                {options.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>
            {errorMsg !== true && showError()}
        </div>
    );
}
