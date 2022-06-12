import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import About from './components/About'
import HomeGuest from './components/HomeGuest'
import Terms from './components/Terms'

const domContainer = document.querySelector('#root')
const root = createRoot(domContainer)
root.render(
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<App />}>
        <Route index element={<HomeGuest />} />
        <Route path='about' element={<About />} />
        <Route path='terms' element={<Terms />} />
      </Route>
    </Routes>
  </BrowserRouter>
)
if (module.hot) {
  module.hot.accept()
}
