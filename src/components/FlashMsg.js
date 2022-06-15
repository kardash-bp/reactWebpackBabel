import React, { useContext } from 'react'
import { AppContext } from '../App'

const FlashMsg = () => {
  const {
    state: { flashMessages },
  } = useContext(AppContext)
  console.log(flashMessages)
  return (
    <div className='floating-alerts'>
      {/* {flashMessages.map((msg, index) => {
        return (
          <div
            key={index}
            className='alert alert-success text-center floating-alert shadow-sm'
          >
            {msg}
          </div>
        )
      })} */}
    </div>
  )
}

export default FlashMsg
