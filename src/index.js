import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import About from './components/About'
import HomePage from './components/HomePage'
import Terms from './components/Terms'
import CreatePost from './components/CreatePost'
import axios from 'axios'
import ViewSinglePost from './components/ViewSinglePost'
import Posts from './components/Posts'
axios.defaults.baseURL = 'http://localhost:8080'
const domContainer = document.querySelector('#root')
const root = createRoot(domContainer)
root.render(
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<App />}>
        <Route path='about' element={<About />} />
        <Route path='terms' element={<Terms />} />
        <Route path='posts' element={<Posts />} />
        <Route path=':postId' element={<ViewSinglePost />} />
        <Route path='create-post' element={<CreatePost />} />
        <Route index element={<HomePage />} />
      </Route>
    </Routes>
  </BrowserRouter>
)
if (module.hot) {
  module.hot.accept()
}
