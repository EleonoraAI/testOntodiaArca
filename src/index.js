import * as React from 'react';

import ReactDOM from 'react-dom';
import { createStore } from 'redux';

import reportWebVitals from './reportWebVitals';
import reducer from './store/reducer';
import {Provider} from 'react-redux';
import App from './App';


const store = createStore(reducer);
ReactDOM.render(
  <React.Fragment>
    <Provider store= {store}>
    <App/></Provider>
  </React.Fragment>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
