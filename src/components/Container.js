import React from 'react'

const Container = (props) => {
  return (
    <div
      className={props.wide ? 'container-xl  py-md-5' : 'container-sm py-md-5 '}
    >
      {props.children}
    </div>
  )
}

export default Container
