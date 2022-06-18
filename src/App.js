import React, { useEffect, useReducer, createContext, useMemo } from 'react'
import { Outlet } from 'react-router'
import { CSSTransition } from 'react-transition-group'
import FlashMsg from './components/FlashMsg'
import Footer from './components/Footer'
import Header from './components/Header'
import Search from './components/Search'

const initialState = {
  loggedIn: Boolean(localStorage.getItem('complexAppToken')),
  user: {
    token: localStorage.getItem('complexAppToken'),
    username: localStorage.getItem('complexAppUsername'),
    avatar: localStorage.getItem('complexAppAvatar'),
  },
  flashMessages: [],
  isSearchOpen: false,
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
    case 'openSearch':
      return { ...state, isSearchOpen: true }
    case 'closeSearch':
      return { ...state, isSearchOpen: false }

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
  return (
    <AppContext.Provider value={value}>
      <FlashMsg />
      <Header />
      <Outlet />
      <CSSTransition
        timeout={330}
        in={state.isSearchOpen}
        classNames='search-overlay'
        unmountOnExit
      >
        <Search />
      </CSSTransition>
      <Footer />
    </AppContext.Provider>
  )
}

export default App
