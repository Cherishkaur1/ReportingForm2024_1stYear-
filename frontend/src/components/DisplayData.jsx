import React, { useContext } from 'react';
import { FormDataContext } from '../context/FormDataContext';

// Define style constants
const LABEL_STYLE = 'block text-sm font-medium text-gray-700';
const VALUE_STYLE = 'ml-4 text-base text-gray-900';

const DisplayData = ({ setDisplay }) => {
  const { data } = useContext(FormDataContext);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className='p-6 max-w-4xl mx-auto bg-white rounded-xl shadow-md space-y-6 printable'>
      {/* UID Section */}
      {data.UID && (
        <div className='mb-4 p-4 bg-gray-100 border border-gray-200 rounded-md'>
          <h2 className='text-lg font-semibold text-gray-800'>UID:</h2>
          <p className='text-base text-gray-900'>{data.UID}</p>
        </div>
      )}

      <h1 className='text-2xl font-semibold text-gray-900'>Student Admission Data</h1>

      <div className='grid grid-cols-2 gap-6'>
        {/* Column 1 */}
        <div className='space-y-4'>
          <div className='flex items-center'>
            <label className={LABEL_STYLE}>Admission Number:</label>
            <p className={VALUE_STYLE}>{data.admission_number}</p>
          </div>
          <div className='flex items-center'>
            <label className={LABEL_STYLE}>School Name:</label>
            <p className={VALUE_STYLE}>{data.school_name}</p>
          </div>
          <div className='flex items-center'>
            <label className={LABEL_STYLE}>Department:</label>
            <p className={VALUE_STYLE}>{data.department}</p>
          </div>
          <div className='flex items-center'>
            <label className={LABEL_STYLE}>Program:</label>
            <p className={VALUE_STYLE}>{data.program}</p>
          </div>
          <div className='flex items-center'>
            <label className={LABEL_STYLE}>Name:</label>
            <p className={VALUE_STYLE}>{data.name}</p>
          </div>
          <div className='flex items-center'>
            <label className={LABEL_STYLE}>Father's Name:</label>
            <p className={VALUE_STYLE}>{data.father_name}</p>
          </div>
          <div className='flex items-center'>
            <label className={LABEL_STYLE}>Mother's Name:</label>
            <p className={VALUE_STYLE}>{data.mother_name}</p>
          </div>
          <div className='flex items-center'>
            <label className={LABEL_STYLE}>Gender:</label>
            <p className={VALUE_STYLE}>{data.gender}</p>
          </div>
          <div className='flex items-center'>
            <label className={LABEL_STYLE}>Address:</label>
            <p className={VALUE_STYLE}>{data.address}</p>
          </div>
        </div>

        {/* Column 2 */}
        <div className='space-y-4'>
          <div className='flex items-center'>
            <label className={LABEL_STYLE}>City:</label>
            <p className={VALUE_STYLE}>{data.city}</p>
          </div>
          <div className='flex items-center'>
            <label className={LABEL_STYLE}>State:</label>
            <p className={VALUE_STYLE}>{data.state}</p>
          </div>
          <div className='flex items-center'>
            <label className={LABEL_STYLE}>Pincode:</label>
            <p className={VALUE_STYLE}>{data.pincode}</p>
          </div>
          <div className='flex items-center'>
            <label className={LABEL_STYLE}>Country:</label>
            <p className={VALUE_STYLE}>{data.country}</p>
          </div>
          <div className='flex items-center'>
            <label className={LABEL_STYLE}>Contact Number (Student):</label>
            <p className={VALUE_STYLE}>{data.contact_number_student}</p>
          </div>
          <div className='flex items-center'>
            <label className={LABEL_STYLE}>Parent Contact Number:</label>
            <p className={VALUE_STYLE}>{data.parent_contact_number}</p>
          </div>
          <div className='flex items-center'>
            <label className={LABEL_STYLE}>Email ID:</label>
            <p className={VALUE_STYLE}>{data.email_id}</p>
          </div>
          <div className='flex items-center'>
            <label className={LABEL_STYLE}>Parent's Email ID:</label>
            <p className={VALUE_STYLE}>{data.email_id_parent}</p>
          </div>
          <div className='flex items-center'>
            <label className={LABEL_STYLE}>Date of Birth:</label>
            <p className={VALUE_STYLE}>{data.date_of_birth}</p>
          </div>
        </div>
      </div>

      <div className='flex space-x-4'>
        <button
          onClick={() => setDisplay(false)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Back
        </button>
        <button
          onClick={handlePrint}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          Print
        </button>
      </div>
    </div>
  );
};

export default DisplayData;
