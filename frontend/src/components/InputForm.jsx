import React, { useContext, useEffect, useState } from 'react';
import TempTextInput from './TempTextInput';
import axios from 'axios';
import { FormDataContext, initialData } from '../context/FormDataContext';
import DropDown from './DropDown';
import { HOST } from '../context/Constants';

export default function InputForm({ setDisplay , setVisible , newData , setNewData }) {
  const [error, setError] = useState({});
  const { data, setData } = useContext(FormDataContext);
  const [formData, setFormData] = useState(data);

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

  const areAllValuesEmpty = (obj) => Object.values(obj).every((value) => value === '');

  // useEffect(() => {
  //   console.log(formData);
  // }, [formData]);

  const areAllValuesNonEmpty = (obj) => {
    // console.log(obj);
    const excludeKeys = ['ABCID', 'aadhar', 'email_id_parent', 'parent_contact_number', 'address'];
    return Object.entries(obj).every(([key, value]) => {
      if (excludeKeys.includes(key)) {
        return true;
      }
      return value !== '';
    });
  };

  const noError = () => {
    const nonEmpty = areAllValuesNonEmpty(formData);
    // console.log(formData);
    if (!nonEmpty) {
      alert('Some Input Entry are Empty');
      return false;
    }
    const noError = areAllValuesEmpty(error);
    if (!noError) {
      alert('Registration Number should be 8 Digits \n Mobile Number should be 10 Digits \n Gmail should have @ .com written in them');
      return false;
    }
    return true;
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
    try {
      const resp = await axios.get(`${HOST}/check/${formData.admission_number}`);
      if (!resp.data.isUnique) {
        alert('Registration Number already there');
        setNewData(false);
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
    let v = await checkValid();
    if (v) {
      try {
        const response = await axios.post(`${HOST}/`, formData);
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
    let v = noError();
    if (v) {
      try {
        const response = await axios.put(`${HOST}/${formData.admission_number}`, formData);
        if (response.status === 200) {
          alert('Data Updated');
          setDisplay(true);
        } else {
          alert('Problem while Updating data');
        }
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

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-xl shadow-md space-y-4 relative">
      <h1 className="text-2xl font-semibold">Reporting Form</h1>
      {!newData && <label>UID No : {formData.UID}</label>}
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
            disable
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
            label="Date of Birth"
            type="date"
            name="date_of_birth"
            value={formData.date_of_birth}
            required={true}
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
            setError={handleErrorChange}
            validation={getValidationRules('email_id')}
          />
        </div>
        <div className="col-span-1">
          <TempTextInput
            label="Parent's Contact Number"
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
            setError={handleErrorChange}
            validation={getValidationRules('email_id_parent')}
          />
        </div>

        {/* Row 5 */}
        <div className="col-span-1">
          <TempTextInput
            label="Aadhaar Number"
            type="number"
            name="aadhar"
            value={formData.aadhar}
            handleFormData={handleInputChange}
            setError={handleErrorChange}
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
        <div className="col-span-2">
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
          <DropDown
            label="Country"
            name="country"
            value={formData.country}
            required={true}
            handleFormData={handleInputChange}
            setError={handleErrorChange}
            dependentData={null}
          />
        </div>

        <div className="col-span-1">
          <DropDown
            label="State"
            name="state"
            value={formData.state}
            required={true}
            handleFormData={handleInputChange}
            setError={handleErrorChange}
            dependentData={formData.country}
          />
        </div>
        <div className="col-span-1">
          <TempTextInput
            label="City"
            type="text"
            name="city"
            value={formData.city}
            required={true}
            handleFormData={handleInputChange}
            setError={handleErrorChange}
          />
        </div>

        <div className="col-span-1">
          <TempTextInput
            label="Pincode"
            type="number"
            name="pincode"
            required={true}
            value={formData.pincode}
            handleFormData={handleInputChange}
            setError={handleErrorChange}
          />
        </div>

        
      </div>

      <div className="flex justify-center space-x-4 mt-6">
        {newData ? (
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Submit
          </button>
        ) : (
          <button
            onClick={handleUpdate}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Update
          </button>
        )}
        <button
          onClick={() => setVisible(false)}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
