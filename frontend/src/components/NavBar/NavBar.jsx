import React from 'react'
import logo from '../../assets/images/Ct_logo.png'
import OptionTag from './OptionTag'
export default function NavBar({setOption , selectedOption}) {
  return (
    <div className="p-2 w-full flex items-center justify-between bg-blue-600">
        <div className="flex items-center w-full">
            <img src={logo} alt="CT University Logo" className="w-10 sm:w-[65px] sm:ml-5" />
            {/* <h1 className="text-xl font-bold text-white text-center flex-grow text-[10px] sm:text-[20px]">Admissison Data : 2024</h1> */}
            <div className='flex gap-5 text-[18px]  cursor-pointer font-semibold ml-auto mr-20'>
              <OptionTag name='Reporting Form' selectedOption={selectedOption} setOption={setOption}/>
              <OptionTag name='Insert Data' selectedOption={selectedOption} setOption={setOption}/>
              <OptionTag name='Students Data' selectedOption={selectedOption} setOption={setOption}/>
              <OptionTag name='Update School Data' selectedOption={selectedOption} setOption={setOption}/>
            </div>
        </div>
  </div>
  )
}
