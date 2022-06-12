import React, { useEffect } from 'react'
import Container from './Container'

const Page = ({ title, children, wide = false }) => {
  useEffect(() => {
    document.title = `${title} | ComplexApp`
    window.scrollTo(0, 0)
  }, [])
  return <Container wide={wide}>{children}</Container>
}

export default Page
