import axios from 'axios'
import Axios from 'axios'
import React, { useContext, useEffect } from 'react'
import { AppContext } from '../App'
import HomePageFeed from './HomePageFeed'
import Page from './Page'
import { CSSTransition } from 'react-transition-group'

function HomeGuest() {
  const { state, dispatch } = useContext(AppContext)
  function handleSubmit(e) {
    e.preventDefault()

    dispatch({ type: 'usernameImmediately', payload: state.username.value })
    dispatch({
      type: 'usernameAfterDelay',
      payload: state.username.value,
      submit: true,
    })
    dispatch({ type: 'emailImmediately', payload: state.email.value })
    dispatch({
      type: 'emailAfterDelay',
      payload: state.email.value,
      submit: true,
    })
    dispatch({ type: 'passwordImmediately', payload: state.password.value })
    dispatch({ type: 'passwordAfterDelay', payload: state.password.value })
    dispatch({ type: 'submitForm' })
  }
  useEffect(() => {
    if (!state.submitCount) return
    const ct = axios.CancelToken.source()
    try {
      ;(async () => {
        const response = await axios.post(
          '/register',
          {
            username: state.username.value,
            email: state.email.value,
            password: state.password.value,
          },
          { cancelToken: ct.token }
        )
        dispatch({ type: 'login', payload: response.data })
        dispatch({
          type: 'addFlashMsg',
          payload: 'Welcome to your new account.',
        })
      })()
    } catch (err) {
      console.log(err.message)
    }
    return () => ct.cancel()
  }, [state.submitCount])

  useEffect(() => {
    if (state.username.value) {
      const id = setTimeout(() => dispatch({ type: 'usernameAfterDelay' }), 800)
      return () => clearTimeout(id)
    }
  }, [state.username.value])
  useEffect(() => {
    if (state.email.value) {
      const id = setTimeout(() => dispatch({ type: 'emailAfterDelay' }), 1500)
      return () => clearTimeout(id)
    }
  }, [state.email.value])
  useEffect(() => {
    if (state.password.value) {
      const id = setTimeout(
        () => dispatch({ type: 'passwordAfterDelay' }),
        1500
      )
      return () => clearTimeout(id)
    }
  }, [state.password.value])
  useEffect(() => {
    const ct = axios.CancelToken.source()
    try {
      if (!state.username.checkCount) return
      ;(async () => {
        const response = await axios.post(
          '/doesUsernameExist',
          { username: state.username.value },
          { cancelToken: ct.token }
        )
        dispatch({ type: 'usernameUniqueResults', payload: response.data })
      })()
    } catch (err) {
      console.log(err.message)
    }
    return () => ct.cancel()
  }, [state.username.checkCount])
  // email unique check
  useEffect(() => {
    const ct = axios.CancelToken.source()
    try {
      if (!state.email.checkCount) return
      ;(async () => {
        const response = await axios.post(
          '/doesEmailExist',
          { email: state.email.value },
          { cancelToken: ct.token }
        )
        dispatch({ type: 'emailUniqueResults', payload: response.data })
      })()
    } catch (err) {
      console.log(err.message)
    }
    return () => ct.cancel()
  }, [state.email.checkCount])
  return !state.loggedIn ? (
    <Page wide={true} title='Welcome!'>
      <div className='row align-items-center'>
        <div className='col-lg-7 py-3 py-md-5'>
          <h1 className='display-3'>Remember Writing?</h1>
          <p className='lead text-muted'>
            Are you sick of short tweets and impersonal &ldquo;shared&rdquo;
            posts that are reminiscent of the late 90&rsquo;s email forwards? We
            believe getting back to actually writing is the key to enjoying the
            internet again.
          </p>
        </div>
        <div className='col-lg-5 pl-lg-5 pb-3 py-lg-5'>
          <form onSubmit={handleSubmit}>
            <div className='form-group'>
              <label htmlFor='username-register' className='text-muted mb-1'>
                <small>Username</small>
              </label>
              <input
                id='username-register'
                name='username'
                className='form-control'
                type='text'
                placeholder='Pick a username'
                autoComplete='off'
                onChange={(e) =>
                  dispatch({
                    type: 'usernameImmediately',
                    payload: e.target.value,
                  })
                }
                onBlur={() =>
                  dispatch({
                    type: 'usernameAfterDelay',
                  })
                }
              />
              <CSSTransition
                in={state.username.hasErrors}
                timeout={330}
                classNames='liveValidateMessage'
                unmountOnExit
              >
                <div className='alert alert-danger small liveValidateMessage'>
                  {state.username.message}
                </div>
              </CSSTransition>
            </div>
            <div className='form-group'>
              <label htmlFor='email-register' className='text-muted mb-1'>
                <small>Email</small>
              </label>
              <input
                id='email-register'
                name='email'
                className='form-control'
                type='text'
                placeholder='you@example.com'
                autoComplete='off'
                onChange={(e) =>
                  dispatch({
                    type: 'emailImmediately',
                    payload: e.target.value,
                  })
                }
              />
              <CSSTransition
                in={state.email.hasErrors}
                timeout={330}
                classNames='liveValidateMessage'
                unmountOnExit
              >
                <div className='alert alert-danger small liveValidateMessage'>
                  {state.email.message}
                </div>
              </CSSTransition>
            </div>
            <div className='form-group'>
              <label htmlFor='password-register' className='text-muted mb-1'>
                <small>Password</small>
              </label>
              <input
                id='password-register'
                name='password'
                className='form-control'
                type='password'
                placeholder='Create a password'
                onChange={(e) =>
                  dispatch({
                    type: 'passwordImmediately',
                    payload: e.target.value,
                  })
                }
              />
              <CSSTransition
                in={state.password.hasErrors}
                timeout={330}
                classNames='liveValidateMessage'
                unmountOnExit
              >
                <div className='alert alert-danger small liveValidateMessage'>
                  {state.password.message}
                </div>
              </CSSTransition>
            </div>
            <button
              type='submit'
              className='py-3 mt-4 btn btn-lg btn-success btn-block'
            >
              Sign up for ComplexApp
            </button>
          </form>
        </div>
      </div>
    </Page>
  ) : (
    <HomePageFeed />
  )
}

export default HomeGuest
