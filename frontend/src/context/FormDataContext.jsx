import React, { createContext, useState } from 'react';

// Create the context
const FormDataContext = createContext();

const initialData = {
  admission_number: '',
  school_name: '',
  department: '',
  program: '',
  name: '',
  father_name: '',
  mother_name: '',
  gender: '',
  address: '',
  city: '',
  state: '',
  pincode: '',
  country: '',
  contact_number_student: '',
  parent_contact_number: '',
  email_id: '',
  email_id_parent: '',
  date_of_birth: '',
  admission_category:'',
  program_type: '',
  aadhar:'',
  ABCID:'',
  entry_type:''
};

const FormDataProvider = ({ children }) => {
  const [data, setData] = useState(initialData);
  

  return (
    <FormDataContext.Provider value={{ data, setData }}>
      {children}
    </FormDataContext.Provider>
  );
};

export { FormDataContext, FormDataProvider , initialData};
