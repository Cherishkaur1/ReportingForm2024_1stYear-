import React, { useContext, useState } from 'react';
import TempTextInput from './TempTextInput';
import axios from 'axios';
import { FormDataContext, initialData } from '../context/FormDataContext';
import DropDown from './DropDown';

export default function InputForm({ setDisplay }) {
  const [error, setError] = useState({});
  const { data, setData } = useContext(FormDataContext);
  // State to hold form data
  const [formData, setFormData] = useState(data);

  // Function to get validation rules based on field name
  const getValidationRules = (fieldName) => {
    switch (fieldName) {
      case 'email_id':
      case 'email_id_parent':
        return { email: true };
      case 'admission_number':
        return { equal: 8 };
      case 'contact_number_student':
      case 'parent_contact_number':
        return { equal: 10 };
      default:
        return {};
    }
  };

  const areAllValuesEmpty = (obj) => {
    return Object.values(obj).every((value) => value === '');
  };

  const areAllValuesNonEmpty = (obj) => {
    // Define keys to exclude from the non-empty check
    const excludeKeys = ['ABCID', 'aadhar', 'email_id_parent', 'parent_contact_number', 'address'];
  
    // Iterate over the object values and keys
    return Object.entries(obj).every(([key, value]) => {
      // If the key is in the exclude list, ignore it
      if (excludeKeys.includes(key)) {
        return true; // Ignore this field for the check
      }
      // Check if the value is not empty for other fields
      return value !== '';
    });
  };

  const checkValid = async () => {
    const nonEmpty = areAllValuesNonEmpty(formData);
    if (!nonEmpty) {
      alert('Some Input Entry are Empty');
      return false;
    }
    const noError = areAllValuesEmpty(error);
    if (!noError) {
      alert('Registration Number should be 8 Digits \n Mobile Number should be 10 Digits \n Gmail should have @ .com written in them');
      return false;
    }
    // check Registration if it is unique Number
    try {
      const resp = await axios.get(`http://192.168.124.197:1000/check/${formData.admission_number}`);
      if (!resp.data.isUnique) {
        alert('Registration Number already there');
        return false;
      }
      return true;
    } catch (err) {
      alert('Server Error');
      console.error('Error submitting form:', error);
      return false;
    }
  };

  const handleSubmit = async () => {
    console.log(formData);
    let v = await checkValid();
    if (v) {
      try {
        const response = await axios.post('http://192.168.124.197:1000/', formData);
        setData(response.data.data);
        setDisplay(true);
      } catch (error) {
        alert('Server Error');
        console.error('Error submitting form:', error);
      }
    } else {
      alert('Data not uploaded');
    }
  };

  const handleUpdate = async () => {
    console.log(formData);
    let v = await checkValid();
    if (v) {
      try {
        const response = await axios.put('http://192.168.124.197:1000/', formData);
        setData(response.data.data);
        setDisplay(true);
      } catch (error) {
        alert('Server Error');
        console.error('Error Updating Data:', error);
      }
    } else {
      alert('Data not Updated');
    }
  };

  const handleInputChange = ({ id, value }) => {
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  const handleErrorChange = ({ id, err }) => {
    setError({
      ...error,
      [id]: err,
    });
  };

  const handleClear = () => {
    setFormData(initialData);
    setData(initialData);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h1 className="text-2xl font-semibold">Reporting Form</h1>
      <div className="grid grid-cols-4 gap-4"> {/* Adjusted grid to 4 columns with appropriate spacing */}

        {/* Row 1 */}
        <div className="col-span-1">
          <TempTextInput
            label="Admission Number"
            type="number"
            name="admission_number"
            value={formData.admission_number}
            required
            handleFormData={handleInputChange}
            validation={getValidationRules('admission_number')}
            setError={handleErrorChange}
          />
        </div>
        <div className="col-span-1">
          <DropDown
            label="Admission Category"
            name="admission_category"
            value={formData.admission_category}
            required={true}
            handleFormData={handleInputChange}
            setError={handleErrorChange}
            dependentData={null}
          />
        </div>
        <div className="col-span-1">
          <DropDown
            label="Admission Type"
            name="entry_type"
            value={formData.entry_type}
            required={true}
            handleFormData={handleInputChange}
            setError={handleErrorChange}
            dependentData={null}
          />
        </div>
        <div className="col-span-1">
          <TempTextInput
            label="ABC ID"
            type="text"
            name="ABCID"
            value={formData.ABCID}
            handleFormData={handleInputChange}
            setError={handleErrorChange}
          />
        </div>

        {/* Row 2 */}
        <div className="col-span-1">
          <DropDown
            label="School Name"
            name="school_name"
            value={formData.school_name}
            required={true}
            handleFormData={handleInputChange}
            setError={handleErrorChange}
            dependentData={null}
          />
        </div>
        <div className="col-span-1">
          <DropDown
            label="Department"
            name="department"
            value={formData.department}
            required={true}
            handleFormData={handleInputChange}
            setError={handleErrorChange}
            dependentData={formData.school_name}
          />
        </div>
        <div className="col-span-1">
          <DropDown
            label="Program"
            name="program"
            value={formData.program}
            required={true}
            handleFormData={handleInputChange}
            setError={handleErrorChange}
            dependentData={formData.department}
          />
        </div>
        <div className="col-span-1">
          <DropDown
            label="Program Type"
            name="program_type"
            value={formData.program_type}
            required={true}
            handleFormData={handleInputChange}
            setError={handleErrorChange}
            dependentData={null}
          />
        </div>

        {/* Row 3 */}
        <div className="col-span-1">
          <TempTextInput
            label="Name"
            type="text"
            name="name"
            value={formData.name}
            handleFormData={handleInputChange}
            required
            setError={handleErrorChange}
          />
        </div>
        <div className="col-span-1">
          <TempTextInput
            label="Father's Name"
            type="text"
            name="father_name"
            value={formData.father_name}
            handleFormData={handleInputChange}
            required
            setError={handleErrorChange}
          />
        </div>
        <div className="col-span-1">
          <TempTextInput
            label="Mother's Name"
            type="text"
            name="mother_name"
            value={formData.mother_name}
            handleFormData={handleInputChange}
            required
            setError={handleErrorChange}
          />
        </div>
        <div className="col-span-1">
          <DropDown
            label="Gender"
            name="gender"
            value={formData.gender}
            required={true}
            handleFormData={handleInputChange}
            setError={handleErrorChange}
            dependentData={null}
          />
        </div>

        {/* Row 4 */}
        <div className="col-span-1">
          <TempTextInput
            label="Contact Number (Student)"
            type="number"
            name="contact_number_student"
            value={formData.contact_number_student}
            handleFormData={handleInputChange}
            required
            setError={handleErrorChange}
            validation={getValidationRules('contact_number_student')}
          />
        </div>
        <div className="col-span-1">
          <TempTextInput
            label="Email ID"
            type="email"
            name="email_id"
            value={formData.email_id}
            handleFormData={handleInputChange}
            required
            validation={getValidationRules('email_id')}
            setError={handleErrorChange}
          />
        </div>
        <div className="col-span-1">
          <TempTextInput
            label="Parent Contact Number"
            type="number"
            name="parent_contact_number"
            value={formData.parent_contact_number}
            handleFormData={handleInputChange}
            setError={handleErrorChange}
            validation={getValidationRules('parent_contact_number')}
          />
        </div>
        <div className="col-span-1">
          <TempTextInput
            label="Parent's Email ID"
            type="email"
            name="email_id_parent"
            value={formData.email_id_parent}
            handleFormData={handleInputChange}
            validation={getValidationRules('email_id_parent')}
            setError={handleErrorChange}
          />
        </div>

        {/* Row 5 */}
        <div className="col-span-1">
          <TempTextInput
            label="Aadhar No."
            type="number"
            name="aadhar"
            value={formData.aadhar}
            handleFormData={handleInputChange}
            setError={handleErrorChange}
          />
        </div>
        <div className="col-span-3">
          <TempTextInput
            label="Address"
            type="text"
            name="address"
            value={formData.address}
            handleFormData={handleInputChange}
            setError={handleErrorChange}
          />
        </div>

        {/* Row 6 */}
        <div className="col-span-1">
          <TempTextInput
            label="Country"
            type="text"
            name="country"
            value={formData.country}
            handleFormData={handleInputChange}
            required
            setError={handleErrorChange}
          />
        </div>
        <div className="col-span-1">
          <TempTextInput
            label="State"
            type="text"
            name="state"
            value={formData.state}
            handleFormData={handleInputChange}
            required
            setError={handleErrorChange}
          />
        </div>
        <div className="col-span-1">
          <TempTextInput
            label="City"
            type="text"
            name="city"
            value={formData.city}
            handleFormData={handleInputChange}
            required
            setError={handleErrorChange}
          />
        </div>
        <div className="col-span-1">
          <TempTextInput
            label="Pincode"
            type="number"
            name="pincode"
            value={formData.pincode}
            handleFormData={handleInputChange}
            required
            validation={getValidationRules('pincode')}
            setError={handleErrorChange}
          />
        </div>
      </div>

      {/* Submit button */}
      <div className="flex justify-end mt-4">
        <button
          type="button"
          onClick={handleSubmit}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Submit
        </button>
      </div>
    </div>
  );
}
