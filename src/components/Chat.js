import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import io from 'socket.io-client'
const socket = io('http://localhost:8080')
const Chat = ({ isOpen, toggle, username, avatar, token, dispatch }) => {
  const [chatText, setChatText] = useState('')
  const [chatMsg, setChatMsg] = useState([])
  const chatInput = useRef(null)
  const chatLog = useRef(null)
  useEffect(() => {
    if (isOpen) {
      chatInput.current.focus()
      dispatch({ type: 'clearUnreadChat' })
    }
  }, [isOpen])
  useEffect(() => {
    socket.on('chatFromServer', (message) => {
      setChatMsg((prev) => [...prev, message])
    })
  }, [])
  useEffect(() => {
    // scroll to last message
    chatLog.current.scrollTop = chatLog.current.scrollHeight
    // count unread messages
    if (chatMsg.length && !isOpen) {
      dispatch({ type: 'incrementUnreadChat' })
    }
  }, [chatMsg])
  const handleChange = (e) => {
    setChatText(e.target.value)
  }
  const handleSubmit = (e) => {
    e.preventDefault()
    // send msg to chat server
    socket.emit('chatFromBrowser', { message: chatText, token: token })
    setChatMsg((prev) => [
      ...prev,
      { message: chatText, username: username, avatar: avatar },
    ])
    setChatText('')
    console.log(chatMsg)
  }

  return (
    <div
      id='chat-wrapper'
      className={`chat-wrapper ${
        isOpen && 'chat-wrapper--is-visible'
      } shadow border-top border-left border-right`}
    >
      <div className='chat-title-bar bg-primary'>
        Chat
        <span onClick={toggle} className='chat-title-bar-close'>
          <i className='fas fa-times-circle'></i>
        </span>
      </div>
      <div id='chat' className='chat-log' ref={chatLog}>
        {chatMsg.map((m, index) => {
          if (m.username === username) {
            return (
              <div key={index} className='chat-self'>
                <div className='chat-message'>
                  <div className='chat-message-inner'>{m.message}</div>
                </div>
                <img className='chat-avatar avatar-tiny' src={m.avatar} />
              </div>
            )
          }
          return (
            <div key={index} className='chat-other'>
              <Link to={`/profile/${m.username}`}>
                <img className='avatar-tiny' src={m.avatar} />
              </Link>
              <div className='chat-message'>
                <div className='chat-message-inner'>
                  <Link to={`/profile/${m.username}`}>
                    <strong>
                      {m.username}:{}{' '}
                    </strong>{' '}
                  </Link>{' '}
                  {m.message}
                </div>
              </div>
            </div>
          )
        })}
      </div>
      <form
        onSubmit={handleSubmit}
        id='chatForm'
        className='chat-form border-top'
      >
        <input
          ref={chatInput}
          type='text'
          className='chat-field'
          id='chatField'
          placeholder='Type a message…'
          autoComplete='off'
          onChange={handleChange}
          value={chatText}
        />
      </form>
    </div>
  )
}

export default Chat
