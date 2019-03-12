import React, { Component } from 'react';
import { Redirect, Route } from 'react-router-dom';
import axios from 'axios';
import './App.css';
import Movies from './components/Movies'
import Details from './components/Details'
import { TMDBKey } from './config';

// const APIKey = 'a6793cf9';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      movie: null,
      search: '',
      showMovies: true
    }
  }

  // componentDidMount() {
  //   var path = this.props.location.pathname.split('/')
  //   if(path[1] === 'home') {
  //     this.setState({showMovies: true})
  //   }
  //   else {
  //     this.setState({showMovies: false})
  //     if(path[2] === 'movie') {
  //       this.changeToMovie.bind(this, path[3])
  //     }
  //     else if(path[2] === 'person') {
  //       this.changeToActor.bind(this, path[3])
  //     }
  //   }
  // }

  componentDidUpdate(prevProps) {
    // window.onpopstate = () => {
    //   this.setState({movie: null})
    // }
    if(this.props.location.pathname.split('/')[1] === 'home' && prevProps.location !== this.props.location) {
      this.setState({showMovies: true})
    }
    else if(prevProps.location !== this.props.location) {
      this.setState({showMovies: false})
    }
  }


  // get movie from movies.js and set it to app state to pass to details
  setMovie = (movie) => {
    this.setState({
      movie: movie,
      showMovies: false
    });
    
    console.log('app state movie: ' + this.state.movie)
  }

  changeToMovie = (id) => {
    axios.get('https://api.themoviedb.org/3/credit/' + id + '?api_key=' + TMDBKey)
    .then((response) => {
      let newMovie = response.data.media;
      newMovie.media_type = response.data.media_type;
      this.setState({
        movie: newMovie,
        showMovies: false
      });
      console.log('changetomovie: ' + newMovie)
    })
  }

  changeToActor = (id) => {
    axios.get('https://api.themoviedb.org/3/person/' + id + '?api_key=' + TMDBKey)
    .then((response) => {
      let newActor = response.data;
      newActor.media_type = 'person';
      this.setState({
        movie: newActor,
        showMovies: false
      });
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
          <Route path='/' render={(props) => this.state.showMovies === true ?
            <Movies {...props} setMovie={this.setMovie} search={this.state.search} /> :
            <Details {...props} movie={this.state.movie} changeToMovie={this.changeToMovie} changeToActor={this.changeToActor} setMovie={this.setMovie} />
          } />
        }
        
      </div>
    );
  }
}



export default App;
