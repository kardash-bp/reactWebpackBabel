import React, { useEffect, useReducer, createContext, useMemo } from 'react'
import { Outlet } from 'react-router'
import FlashMsg from './components/FlashMsg'
import Footer from './components/Footer'
import Header from './components/Header'

const initialState = {
  loggedIn: Boolean(localStorage.getItem('complexAppToken')),
  user: {
    token: localStorage.getItem('complexAppToken'),
    username: localStorage.getItem('complexAppUsername'),
    avatar: localStorage.getItem('complexAppAvatar'),
  },
  flashMessages: [],
}
const reducer = (state, action) => {
  switch (action.type) {
    case 'login':
      return { ...state, loggedIn: true, user: action.payload }
    case 'logout':
      return { ...state, loggedIn: false, user: {} }
    case 'addFlashMsg':
      return {
        ...state,
        flashMessages: [action.payload],
      }

    default:
      return state
  }
}
export const AppContext = createContext(null)
const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const value = useMemo(() => ({ state, dispatch }), [state])

  useEffect(() => {
    if (state.loggedIn) {
      localStorage.setItem('complexAppToken', state.user.token)
      localStorage.setItem('complexAppUsername', state.user.username)
      localStorage.setItem('complexAppAvatar', state.user.avatar)
    } else {
      localStorage.removeItem('complexAppToken')
      localStorage.removeItem('complexAppUsername')
      localStorage.removeItem('complexAppAvatar')
    }
  }, [state.loggedIn])
  console.log(state)
  return (
    <AppContext.Provider value={value}>
      <FlashMsg />
      <Header />
      <Outlet />
      <Footer />
    </AppContext.Provider>
  )
}

export default App
