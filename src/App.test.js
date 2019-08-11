import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import App, { SearchForm, Button, News } from './App';

describe('App', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<App />, div);
    // ReactDOM.unmountComponentAtNode(div);
  });

  test('snapshots', () => {
    const component = renderer.create(<App />);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

describe('Search', () => {
  it('renders', () => {
    const div = document.createElement('div');
    ReactDOM.render(<SearchForm />, div);
  });

  test('snapshots', () => {
    const component = renderer.create(<SearchForm />);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

describe('Button', () => {
  it('renders', () => {
    const div = document.createElement('div');
    ReactDOM.render(<SearchForm />, div)
  });

  test('snapshots', () => {
    let tree = renderer.create(<SearchForm />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});

describe('News', () => {

  const props = {
    newsList: [
      { title: '1', author: '1', num_comments: 1, points: 2, objectID: 'y' },
      { title: '2', author: '2', num_comments: 1, points: 2, objectID: 'z' },
    ],
  };

  it('renders', () => {
    const div = document.createElement('div');
    ReactDOM.render(<News { ... props } />, div);
  });

  test('snapshots', () => {
    let tree = renderer.create(<News { ...props } />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});