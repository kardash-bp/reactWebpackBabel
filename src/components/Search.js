import axios from 'axios'
import React, { Suspense, useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AppContext } from '../App'
import { debounce } from '../utils/debounce'
import { formatDate } from '../utils/formatDate'
import LoadingDots from './LoadingDots'

const Search = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResult, setSearchResult] = useState([])
  const { dispatch } = useContext(AppContext)
  useEffect(() => {
    document.addEventListener('keyup', handleKeyPress)

    return () => {
      document.removeEventListener('keyup', handleKeyPress)
    }
  }, [])
  useEffect(() => {
    const ct = axios.CancelToken.source()
    try {
      if (searchTerm === '') return
      ;(async () => {
        const response = await axios.post(
          '/search',
          { searchTerm: searchTerm },
          { cancelToken: ct.token }
        )
        setSearchResult(response.data)
      })()
    } catch (err) {
      console.log(err.message)
    }
    return () => ct.cancel()
  }, [searchTerm])
  function handleKeyPress(e) {
    if (e.code === 'Escape') {
      dispatch({ type: 'closeSearch' })
    }
  }
  function handleChange(e) {
    setSearchTerm(e.target.value.trim())
  }
  const dbChange = debounce(handleChange)
  return (
    <div className='search-overlay'>
      <div className='search-overlay-top shadow-sm'>
        <div className='container container--narrow'>
          <label htmlFor='live-search-field' className='search-overlay-icon'>
            <i className='fas fa-search'></i>
          </label>
          <input
            autoFocus
            type='text'
            autoComplete='off'
            id='live-search-field'
            className='live-search-field'
            placeholder='What are you interested in?'
            onChange={dbChange}
          />
          <span
            onClick={() => dispatch({ type: 'closeSearch' })}
            className='close-live-search'
          >
            <i className='fas fa-times-circle'></i>
          </span>
        </div>
      </div>

      <div className='search-overlay-bottom'>
        <div className='container container--narrow py-3'>
          <div className='live-search-results live-search-results--visible'>
            <div className='list-group shadow-sm'>
              {searchResult.length > 1 && (
                <div className='list-group-item active'>
                  <strong>Search Results</strong> ({searchResult.length} item
                  {searchResult.length > 1 && 's'} found)
                </div>
              )}

              <Suspense fallback={<LoadingDots />}>
                {searchResult.map((item) => (
                  <Link
                    to={`/posts/${item._id}`}
                    key={item._id}
                    className='list-group-item list-group-item-action'
                    onClick={() => dispatch({ type: 'closeSearch' })}
                  >
                    <img className='avatar-tiny' src={item.author.avatar} />{' '}
                    <strong>{item.title}</strong>{' '}
                    <span className='text-muted small'>
                      by {item.author.username} on{' '}
                      {formatDate(item.createdDate)}{' '}
                    </span>
                  </Link>
                ))}
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Search
