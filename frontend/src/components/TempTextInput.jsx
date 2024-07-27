import React, { useEffect, useState } from 'react';
export default function TempTextInput({ label, type, name, value, required, handleFormData, validation , setError , disable = false}) {
    const [errorMsg, setErrorMsg] = useState('');
    const [data, setData] = useState(value);

    const validateInput = (inputValue) => {
        if (!validation) return true; // No validation required

        if (required && inputValue.trim() === '') {
            return `${label} is required`;
        }

        if (validation.equal && inputValue.length !== validation.equal) {
            return `${label} must be equal to ${validation.equal} digits`;
        }

        if (validation.email && !/^\S+@\S+\.\S+$/.test(inputValue)) {
            return `${label} must be a valid email address`;
        }

        return true; // Input is valid
    };

    const changeData = (val) =>{
        //change in case of date
        if(name == "date_of_birth"){
            const [y , m , d ] = val.split("-");
            val = [d,m,y].join("-");
        }
        return val;
    }

    const handleInput = (e) => {
        const val = changeData(e.target.value);
        
        const valid = validateInput(val);
        if(valid !== true){
            setErrorMsg(valid);
            setError({id:name , err:valid})
        }
        else{
            setErrorMsg('');
            setError({id:name , err:''})
        }
        handleFormData({ id: name, value: val });
        setData(val);
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
                {name == "date_of_birth" && <label className='text-green-600 text-[12px]'>     DOB:  {data}</label>}
            </label>
            <input
                disabled = {disable}
                type={type}
                id={name}
                name={name}
                value={changeData(data)}
                onChange={handleInput}
                className={`block w-full px-3 py-2 border ${errorMsg !== true && errorMsg !== '' ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                required={required}
            />
            {errorMsg !== true && showError()}
        </div>
    );
}
