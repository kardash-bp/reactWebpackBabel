import React, { useEffect, useReducer, createContext, useMemo } from 'react'
import { Outlet } from 'react-router'
import { CSSTransition } from 'react-transition-group'
import Chat from './components/Chat'
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
  followingUsers: [],

  flashMessages: [],
  isSearchOpen: false,
  isChatOpen: false,
  unreadChat: 0,
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
    case 'startFollowing':
      const startArr = [...state.followingUsers, action.payload]
      return { ...state, followingUsers: [...startArr] }
    case 'stopFollowing':
      const stopArr = state.followingUsers.filter(
        (name) => name !== action.payload
      )
      return { ...state, followingUsers: [...stopArr] }
    case 'toggleChat':
      return { ...state, isChatOpen: !state.isChatOpen }
    case 'incrementUnreadChat':
      return { ...state, unreadChat: state.unreadChat + 1 }
    case 'clearUnreadChat':
      return { ...state, unreadChat: 0 }
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
        timeout={500}
        in={state.isSearchOpen}
        classNames='search-overlay'
        unmountOnExit
      >
        <Search />
      </CSSTransition>
      <Chat
        isOpen={state.isChatOpen}
        toggle={() => dispatch({ type: 'toggleChat' })}
        username={state.user.username}
        avatar={state.user.avatar}
        token={state.user.token}
        dispatch={dispatch}
      />
      <Footer />
    </AppContext.Provider>
  )
}

export default App
