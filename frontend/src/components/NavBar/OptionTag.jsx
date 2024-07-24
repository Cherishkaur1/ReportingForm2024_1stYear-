import React from 'react'

export default function OptionTag({name , setOption , selectedOption}) {
  return (
    <div className={selectedOption === name ? 'text-black' :'text-white'} onClick={()=>{setOption(name)}}>{name}</div>
  )
}
