import React, { useState, useEffect } from 'react';
const DEFAULT_QUERY = '';
const DEFAULT_PAGE = 0;
const DEFAULT_HPP = '50';

const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';
const PARAM_HPP = 'hitsPerPage=';

function App() {
  const [news, setNews] = useState(null);
  const [searchKey, setSearchKey] = useState(null);
  const [searchTerm, setSearchTerm] = useState(DEFAULT_QUERY);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = event => {
    return setSearchTerm(event.target.value);
  }

  const handleDismiss = id => {
    const { hits, page } = news[searchKey];
    const updatedHits = hits.filter(item => item.objectID !== id);
    setNews({
      ...news,
      [searchKey]: {hits: updatedHits, page},
    });
  }

  const handleSubmit = event => {
    event.preventDefault();
    setSearchKey(searchTerm);
    if (needsToSearchTopStories(searchTerm)) {
      fetchSearchTopStories(searchTerm, DEFAULT_PAGE);
    }
  }

  const needsToSearchTopStories = searchTerm => !news[searchTerm];

  const setSearchTopStories = result => {
    const { hits, page } = result;
    const oldHits = (news && news[searchKey]) ? news[searchKey].hits : [];
    const updatedHits = [ ...oldHits, ...hits ];
    setNews({
      ...result,
      [searchKey]: {hits: updatedHits, page},
    });
    setIsLoading(false);
  }

  const fetchSearchTopStories = (searchTerm, page) => {
    setIsLoading(true);
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
    .then(response => response.json())
    .then(result => {setSearchTopStories(result)})
  }

  useEffect(() => {
    setSearchKey(searchTerm);
    fetchSearchTopStories(searchTerm, DEFAULT_PAGE);
  }, [searchKey]);

  if (!news) { return null; }

  const page = (news && news[searchKey] && news[searchKey].page) || 0;

  const list = (news && news[searchKey] && news[searchKey].hits) || [];

  return (
    <div className="container">
      <h3 className="text-center my-5">Hacker News Clone</h3>
      <div className="row">
        <div className="col"></div>
        <div className="col-8">
          <SearchForm value={searchTerm} onChange={handleChange} onSubmit={handleSubmit} />
          <News newsList={list} onDismiss={handleDismiss} />
          <div className="interactions">
            <ButtonWithLoading isLoading={isLoading} type="submit"
                    className="btn btn-success"
                    onClick={() => fetchSearchTopStories(searchKey, page+1)}>
              More
            </ButtonWithLoading>
          </div>
        </div>
        <div className="col"></div>
      </div>
    </div>
  );
}
function SearchForm({ value, onChange, onSubmit }) {
  return (
    <div className="search">
      <form onSubmit={onSubmit}>
        <fieldset>
          <div className="form-group">
            <input type="text" value={value} onChange={onChange} className="form-control"
                  placeholder="Search Hacker News..." />
          </div>
        </fieldset>
      </form>
    </div>
  );
}

// const search = searchterm => item => {
//   return !searchterm || item.title.toLowerCase().includes(searchterm.toLowerCase());
// }

function News({ newsList, onDismiss }) {
  return (
    <>
      { newsList.map(item =>
        <div key={item.objectID} className="card my-4">
          <div className="card-body">
            <h5 className="card-title"><a href={item.url}>{item.title}</a></h5>
            <h6 className="card-subtitle mb-2 text-muted">{item.author}</h6>
            <span className="card-link">{item.num_comments}</span>
            <span className="card-link">{item.points}</span>
            <Button className="btn btn-sm btn-danger" onClick={() => onDismiss(item.objectID)}>
              <i className="fas fa-trash"></i>
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

function Button({ className, onClick, children }) {
  return (
    <button type="button" className={className} onClick={onClick}>
      {children}
    </button>
  )
}

function Loading() {
  return <div>Loading...</div>
}

const withLoading = Component => ({ isLoading, ...rest }) =>
  isLoading ? <Loading /> : <Component { ...rest } />;

const ButtonWithLoading = withLoading(Button);

export default App;

export { Button, SearchForm,  News };