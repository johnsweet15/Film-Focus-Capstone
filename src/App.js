import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
// import axios from 'axios';
import './App.css';
import Movies from './components/Movies'

// const APIKey = 'a6793cf9';
// const TMDBKey = 'c794333156e1c095f41f92e128c002df';

class App extends Component {

  render() {
    return (
      <Movies/>
    );
  }
}

export default App;
