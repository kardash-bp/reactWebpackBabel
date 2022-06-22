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
import Profile from './components/Profile'
import NotFound from './components/NotFound'
import ProfileFollowing from './components/ProfileFollowing'
import ProfileFollowers from './components/ProfileFollowers'
axios.defaults.baseURL = 'http://localhost:8080'
const domContainer = document.querySelector('#root')
const root = createRoot(domContainer)
root.render(
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<App />}>
        <Route path='*' element={<NotFound />} />
        <Route path='about' element={<About />} />
        <Route path='terms' element={<Terms />} />
        <Route path='profile/:username' element={<Profile />} />
        <Route
          path='profile/:username/following'
          element={<ProfileFollowing />}
        />
        <Route
          path='profile/:username/followers'
          element={<ProfileFollowers />}
        />
        <Route path='posts/:postId' element={<ViewSinglePost />} />
        <Route path='create-post' element={<CreatePost />} />
        <Route index element={<HomePage />} />
      </Route>
      <Route path='/404' element={<NotFound />} />
    </Routes>
  </BrowserRouter>
)
if (module.hot) {
  module.hot.accept()
}
