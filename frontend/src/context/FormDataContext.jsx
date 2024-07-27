import React, { createContext, useState } from 'react';
import { initialData } from './Constants';

// Create the context
const FormDataContext = createContext();


const FormDataProvider = ({ children }) => {
  const [data, setData] = useState(initialData);
  

  return (
    <FormDataContext.Provider value={{ data, setData }}>
      {children}
    </FormDataContext.Provider>
  );
};

export { FormDataContext, FormDataProvider , initialData};
