import React, { useState } from 'react'
import { Outlet } from 'react-router'
import Footer from './components/Footer'
import Header from './components/Header'

const App = () => {
  const [loggedIn, setLoggedIn] = useState(
    Boolean(localStorage.getItem('complexAppToken'))
  )
  return (
    <>
      <Header loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
      <Outlet context={{ loggedIn }} />
      <Footer />
    </>
  )
}

export default App
