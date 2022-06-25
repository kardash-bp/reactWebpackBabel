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
  username: {
    value: '',
    hasErrors: false,
    message: '',
    isUnique: false,
    checkCount: 0,
  },
  email: {
    value: '',
    hasErrors: false,
    message: '',
    isUnique: false,
    checkCount: 0,
  },
  password: {
    value: '',
    hasErrors: false,
    message: '',
  },
  submitCount: 0,
}
const reducer = (state, action) => {
  let userInput
  let emailInput
  let passInput
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
    case 'usernameImmediately':
      userInput = {
        value: action.payload,
        hasErrors: false,
        message: '',
        isUnique: state.username.isUnique,
        checkCount: 0,
      }

      if (userInput.value.length > 30) {
        userInput.hasErrors = true
        userInput.message = 'Username cannot exceed 30 characters.'
      }
      if (userInput.value && !/^([a-zA-Z0-9]+)$/.test(userInput.value)) {
        userInput.hasErrors = true
        userInput.message = 'Username can only contain letters and numbers.'
      }
      return { ...state, username: userInput }
    case 'usernameAfterDelay':
      userInput = { ...state.username }
      if (userInput.value.length < 3) {
        userInput.hasErrors = true
        userInput.message = 'Username must be at least 3 characters.'
      }
      if (!userInput.hasErrors && !action.submit) {
        userInput.checkCount++
      }
      return { ...state, username: userInput }
    case 'usernameUniqueResults':
      userInput = { ...state.username }
      if (action.payload) {
        userInput.hasErrors = true
        userInput.isUnique = false
        userInput.message = 'That username is already taken.'
      } else {
        userInput.isUnique = true
      }
      return { ...state, username: userInput }
    case 'emailImmediately':
      emailInput = {
        value: action.payload,
        hasErrors: false,
        message: '',
        isUnique: state.email.isUnique,
        checkCount: 0,
      }

      return { ...state, email: emailInput }
    case 'emailAfterDelay':
      emailInput = { ...state.email }
      const eFormat =
        /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
      if (!emailInput.value.match(eFormat)) {
        emailInput.hasErrors = true
        emailInput.message = 'You must provide a valid email address.'
      }
      if (!emailInput.hasErrors && !action.submit) {
        emailInput.checkCount++
      }

      return { ...state, email: emailInput }
    case 'emailUniqueResults':
      emailInput = { ...state.email }
      if (action.payload) {
        emailInput.hasErrors = true
        emailInput.isUnique = false
        emailInput.message = 'That email is already being used.'
      } else {
        emailInput.isUnique = true
      }

      return { ...state, email: emailInput }
    case 'passwordImmediately':
      passInput = {
        value: action.payload,
        hasErrors: false,
        message: '',
      }
      return { ...state, password: passInput }
    case 'passwordAfterDelay':
      passInput = { ...state.password }
      if (passInput.value.length < 12 || passInput.value.length > 50) {
        passInput.hasErrors = true
        passInput.message =
          'Password must be between 12 and 30 characters long.'
      }
      return { ...state, password: passInput }
    case 'submitForm':
      if (
        !state.username.hasErrors &&
        state.username.isUnique &&
        !state.email.hasErrors &&
        state.email.isUnique
      ) {
        state.submitCount++
      }
      return state
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
