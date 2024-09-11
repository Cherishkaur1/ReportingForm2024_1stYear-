import { useEffect, useState } from 'react'
import InputForm from './components/InputForm'
import NavBar from './components/NavBar/NavBar'
import DisplayData from './components/DisplayData'
import InsertData from './components/insertdata/InsertData'
import CheckRegistrationNumber from './components/CheckRegistrationNumber'
import AdmissionFilter from './components/printStudentData/AdmissionFilter'
import UpdateSchoolData from './components/updateSchoolData/UpdateSchoolData'
function App() {
  const [display,setDisplay] = useState(false);
  const [selectedOption,setSelectedOption] = useState('Reporting Form')

  

  useEffect(()=>{
    console.log(selectedOption);
  },[selectedOption])

  return (
    <div className='w-[100vw] h-[100vh]'>
      <NavBar setOption = {setSelectedOption} selectedOption={selectedOption}/>

      {/* <AdmissionForm /> */}
      {selectedOption === 'Reporting Form' && <>
          {display ? <DisplayData setDisplay={setDisplay}/> : <CheckRegistrationNumber setDisplay={setDisplay}/>}
      </>}

      {/* Update Data */}
      {
        selectedOption === 'Insert Data' &&  <InsertData />
      }

      {/* Students Data */}
      {
        selectedOption === "Students Data" && <AdmissionFilter />
      }
      {
        selectedOption === "Update School Data" && <UpdateSchoolData />
      }
      
    </div>
  )
}

export default App
