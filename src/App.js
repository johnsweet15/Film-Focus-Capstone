import React, { Component } from 'react';
// import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
// import axios from 'axios';
import './App.css';
import Movies from './components/Movies'
import Details from './components/Details'

// const APIKey = 'a6793cf9';
// const TMDBKey = 'c794333156e1c095f41f92e128c002df';

class App extends Component {

  state = {
    movie: null
  }

  // get movie from movies.js and set it to app state to pass to details
  setMovie = (movie) => {
    this.setState({movie: movie}, console.log('app state movie: ' + this.state.movie));
  }

  render() {
    return (
      <div>
        { 
          // if no movie is selected, then null -> shows featured or search list
          // else, then not null -> shows details for movie selected (gets movie info from app.js state which gets from setMovie which gets from movies.js lines 100 or 120)
          this.state.movie === null ? <Movies setMovie={this.setMovie} /> : <Details movie={this.state.movie} />
        }
        
      </div>
      
    );
  }
}

export default App;
