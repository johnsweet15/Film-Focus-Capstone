import React, { Component } from 'react';
import { Redirect, Route } from 'react-router-dom';
import axios from 'axios';
import './App.css';
import Movies from './components/Movies'
import Details from './components/Details'
import Navigation from './components/Navigation'
import { TMDBKey } from './config';

// const APIKey = 'a6793cf9';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      movie: null,
      search: '',
      showMovies: true,
      showSearch: false
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
    var path = this.props.location.pathname.split('/')
    console.log('path ' + path[1].substring(0,6))
    if(path[1] === 'home' && prevProps.location !== this.props.location) {
      this.setState({
        showMovies: true,
        showSearch: false
      })
      // console.log('search: ' + this.state.search)
    }
    else if(path[1].substring(0, 6) === 'search' && prevProps.location !== this.props.location) {
      // this.setState({
      //   showMovies: false,
      //   showSearch: true
      // })
      this.setSearch(decodeURIComponent(path[1].substring(7, path[1].length)))
    }
    else if(path[1] === 'details' && prevProps.location !== this.props.location) {
      this.setState({
        showMovies: false,
        showSearch: false
      })
    }
  }


  // get movie from movies.js and set it to app state to pass to details
  setMovie = (movie) => {
    this.setState({
      movie: movie,
      showMovies: false,
      showSearch: false
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
        showMovies: false,
        showSearch: false
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
        showMovies: false,
        showSearch: false
      });
      console.log('changetoactor: ' + newActor)
    })
  }

  setSearch = (search) => {
    this.setState({
      search: search,
      showMovies: false,
      showSearch: true
    })
    console.log('app state search: ' + this.state.search)
  }

  render() {
    return (
      <div>
        <Redirect to="/home" />
        {/* <Navigation setSearch={this.setSearch}/> */}
        {/* <Navigation setSearch={this.state.search}/> */}
        { 
          // if no movie is selected, then null -> shows featured or search list
          // else, then not null -> shows details for movie selected (gets movie info from app.js state which gets from setMovie which gets from movies.js lines 100 or 120)
          <Route path='/' render={(props) => this.state.showMovies === true || this.state.showSearch === true ?
            <div>
              <Navigation {...props} setSearch={this.setSearch} />
              <Movies {...props} setMovie={this.setMovie} search={this.state.search} showSearch={this.state.showSearch} />
            </div>
             :
            <div>
              <Navigation {...props} setSearch={this.setSearch} />
              <Details {...props} movie={this.state.movie} changeToMovie={this.changeToMovie} changeToActor={this.changeToActor} setMovie={this.setMovie} search={this.state.search} showSearch={this.state.showSearch} setSearch={this.setSearch} />
            </div>
          } />
        }
        
      </div>
    );
  }
}



export default App;
