import React from 'react';
import ReactDOM from 'react-dom';
import MarvelServices from './services/MarvelServices';
import App from './components/app/App';
import './style/style.scss';

const marvelService = new MarvelServices();
marvelService.getAllCharacters().then(res => res.data.results.forEach(item => console.log(item.name)));

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

