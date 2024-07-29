import React, { useContext, useState } from 'react'
import InputForm from './InputForm'
import { FormDataContext } from '../context/FormDataContext';
import axios from 'axios'
import { HOST } from '../context/Constants';

export default function CheckRegistrationNumber({setDisplay}) {
    const [visible, setVisible] = useState(false);
    const [regNo , setRegNo] = useState('');
    const { data, setData } = useContext(FormDataContext);
    const [newData , setNewData] = useState(true); // check if the data we are using is new or we have to update it
    const handleCheck = async () => {
        if(regNo.length !== 8){
            alert("Registration nUmber should be 8 digits");
            return;
        }

        // First Check if this we have this data in Existance or not
        try{
            const d = await axios.get(`${HOST}/${regNo}`);
            if(d.status == 200){
                setData(d.data);
                setVisible(true);
                setNewData(false);
                return
            }else{
                console.log("No Data")
            }
        }catch(error){
            console.error("Error while Fetching data from admission Data" ,error);
        }
        // If not check the DataBase we have
        try {
            const d = await axios.get(`${HOST}/checkData/${regNo}`);
            const val = d.data;
            setData(prevState => ({
                ...prevState,
                admission_number: regNo,
                name: val.name || prevState.name,
                father_name: val.father_name || prevState.father_name,
                mother_name: val.mother_name || prevState.mother_name,
                address: val.address || prevState.address,
                city: val.city || prevState.city,
                state: val.state || prevState.state,
                pincode: val.pincode || prevState.pincode,
                country: val.country || prevState.country,
                contact_number_student: val.contact_number_student || prevState.contact_number_student,
                parent_contact_number: val.parent_contact_number || prevState.parent_contact_number,
                email_id: val.email_id || prevState.email_id,
                email_id_parent: val.email_id_parent || prevState.email_id_parent,
                date_of_birth: val.date_of_birth || prevState.date_of_birth,
                aadhar: val.aadhar || prevState.aadhar,
                ABCID: val.ABCID || prevState.ABCID,
                pending: val.pending || prevState.pending
            }));
            setVisible(true);
            setNewData(true);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    
    
    const checkRegDiv=()=>{
        return(
            <div className='w-[350px] px-[50px] h-[200px] bg-gray-100 rounded-xl absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] flex flex-col items-center justify-center gap-5'>
                    <label className="block text-sm font-medium text-gray-700">
                        Registration Number
                    </label>
                    <input onChange={(e)=>setRegNo(e.target.value)}
                    value={regNo}
                    type="number" 
                    className={`block w-full px-3 py-2 border-[2px] rounded-md shadow-sm border-red-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}/>
                    <button
                    onClick={handleCheck}
                    className="items-center px-5 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >Check</button>
            </div>
        )
    }
  return (
    <div>
        {visible ? <InputForm setDisplay={setDisplay} setVisible = {setVisible} newData = {newData} setNewData={setNewData}/> :
            checkRegDiv()
        }
    </div>
  )
}
