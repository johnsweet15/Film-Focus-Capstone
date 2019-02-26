import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import './App.css';
import Movies from './components/Movies'
import Details from './components/Details'
import { TMDBKey } from './config';

// const APIKey = 'a6793cf9';

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
    this.setState({movie: movie});
    console.log('app state movie: ' + this.state.movie)
  }

  changeToMovie = (id) => {
    axios.get('https://api.themoviedb.org/3/credit/' + id + '?api_key=' + TMDBKey)
    .then((response) => {
      let newMovie = response.data.media;
      newMovie.media_type = response.data.media_type;
      this.setState({movie: newMovie});
      console.log('changetomovie: ' + newMovie)
    })
  }

  changeToActor = (id) => {
    axios.get('https://api.themoviedb.org/3/person/' + id + '?api_key=' + TMDBKey)
    .then((response) => {
      let newActor = response.data;
      newActor.media_type = 'person';
      this.setState({movie: newActor});
      console.log('changetoactor: ' + newActor)
    })
  }

  setSearch = (search) => {
    this.setState({search: search}, console.log('app state movie: ' + this.state.search));
  }

  render() {
    return (
      <div>
        <Redirect to="/home" />
        {/* <Navigation setSearch={this.state.search}/> */}
        { 
          // if no movie is selected, then null -> shows featured or search list
          // else, then not null -> shows details for movie selected (gets movie info from app.js state which gets from setMovie which gets from movies.js lines 100 or 120)
          this.state.movie === null ? 
          <Movies setMovie={this.setMovie} search={this.state.search} /> : 
          <Details movie={this.state.movie} changeToMovie={this.changeToMovie} changeToActor={this.changeToActor}/>
        }
        
      </div>
    );
  }
}

export default App;
