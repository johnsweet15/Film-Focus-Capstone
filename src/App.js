import React, { Component } from 'react';
// import { Route } from 'react-router-dom';
// import axios from 'axios';
import './App.css';
// import Navigation from './components/Navigation'
import Movies from './components/Movies'
import Details from './components/Details'

// const APIKey = 'a6793cf9';
// const TMDBKey = 'c794333156e1c095f41f92e128c002df';

class App extends Component {

  state = {
    movie: null,
    search: ''
  }

  componentDidUpdate() {
    window.onpopstate = (e) => {
      this.setState({movie: null});
    }
  }

  // get movie from movies.js and set it to app state to pass to details
  setMovie = (movie) => {
    this.setState({movie: movie}, console.log('app state movie: ' + this.state.movie));
  }

  setSearch = (search) => {
    this.setState({search: search}, console.log('app state movie: ' + this.state.search));
  }

  render() {
    return (
      <div>
        {/* <Navigation setSearch={this.state.search}/> */}
        { 
          // if no movie is selected, then null -> shows featured or search list
          // else, then not null -> shows details for movie selected (gets movie info from app.js state which gets from setMovie which gets from movies.js lines 100 or 120)
          this.state.movie === null ? <Movies setMovie={this.setMovie} search={this.state.search} /> : <Details movie={this.state.movie} />
        }
        
      </div>
    );
  }
}

export default App;
