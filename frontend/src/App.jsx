import { useEffect, useState } from 'react'
import InputForm from './components/InputForm'
import NavBar from './components/NavBar/NavBar'
import DisplayData from './components/DisplayData'
import { FormDataProvider } from './context/FormDataContext'
import StudentsData from './components/StudentsData/StudentsData'
import InsertData from './components/insertdata/InsertData'
import CheckRegistrationNumber from './components/CheckRegistrationNumber'
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
        selectedOption === "Students Data" && <StudentsData />
      }
      
    </div>
  )
}

export default App
