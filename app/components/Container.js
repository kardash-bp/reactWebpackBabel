import React from 'react'

const Container = (props) => {
  return (
    <div
      className={
        props.wide
          ? 'container  py-md-5'
          : 'container container-narrow py-md-5 '
      }
    >
      {props.children}
    </div>
  )
}

export default Container
