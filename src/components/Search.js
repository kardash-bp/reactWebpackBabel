import axios from 'axios'
import React, { Suspense, useContext, useEffect, useState } from 'react'
import { AppContext } from '../App'
import { debounce } from '../utils/debounce'
import LoadingDots from './LoadingDots'
import Post from './Post'

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
    if (searchTerm === '') return
    const ct = axios.CancelToken.source()
    try {
      async function getData() {
        const response = await axios.post(
          '/search',
          { searchTerm: searchTerm },
          { cancelToken: ct.token }
        )
        if (!response.data) {
          return 'Error'
        }
        setSearchResult(response.data)
      }
      getData()
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
              {searchResult.length > 0 && (
                <div className='list-group-item active'>
                  <strong>Search Results</strong> ({searchResult.length} item
                  {searchResult.length > 1 && 's'} found)
                </div>
              )}

              <Suspense fallback={<LoadingDots />}>
                {searchResult.map((item) => (
                  <Post
                    key={item._id}
                    post={item}
                    onClick={() => dispatch({ type: 'closeSearch' })}
                  />
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
