import React, { Component } from 'react';
import axios from 'axios';
import './App.css';

const APIKey = 'a6793cf9';
const TMDBKey = 'c794333156e1c095f41f92e128c002df';

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      movies: [],
      text: '',
      posters: [],
      featuredMovies: [],
    };
  }

  componentDidMount() {
    this.getFeaturedMovies();
  }

  getFeaturedMovies() {
    axios.get('https://api.themoviedb.org/3/movie/popular?api_key=' + TMDBKey)
      .then((response) => {
        let movies = response.data.results;

        this.setState({
          featuredMovies: movies
        })

        console.log('featured: ' + movies[0].title);
      })
  }

  getMovies(searchText) {
    axios.get('http://www.omdbapi.com?s=' + searchText + '&apikey=' + APIKey)
      .then((response) => {
        console.log('response: ' + response);

        let movies = response.data.Search;

        this.setState({
          movies: movies,
        });

        console.log('movies: ' + movies[0].Title);
        console.log('searchText: ' + searchText);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  handleSubmit(event){
    event.preventDefault();
    console.log(this.state.text);
    this.getMovies(this.state.text);
  }

  showMovies() {
    this.state.movies.forEach(element => {
      this.state.posters.push(element.Poster);
    });
  }

  render() {
    let moviePosters = [];
    if(this.state.movies.length > 0) {
      moviePosters = this.state.movies.map(movie => {
        let poster = movie.Poster;
        if(poster === 'N/A') {
          poster = 'https://www.classicposters.com/images/nopicture.gif'
        }
        return (
          <div style={{display: 'inline-block', float: 'left'}}>
            <img key={poster} src={poster} style={{width: '27vh', height: '41vh', padding: 40}} alt="" />
            <p style={{color: 'white', fontSize: '1.5vh', padding: 10}}>{movie.Title}</p>
          </div>
          )
      });
    }
    else {
      moviePosters = this.state.featuredMovies.map(movie => {
        let poster = 'https://image.tmdb.org/t/p/w600_and_h900_bestv2' + movie.poster_path;
        return (
          <div style={{display: 'inline-block', float: 'left'}}>
            <img key={poster} src={poster} style={{width: '27vh', height: '41vh', padding: 40}} alt="" />
            <p style={{color: 'white', fontSize: '1.5vh', padding: 10}}>{movie.title}</p>
          </div>
        )
      });
    }
    
    return (
      <div className="App">
        <header className="App-header">
          <h1 style={styles.header}>This site is trash lmao</h1>
          <form onSubmit={(event) => this.handleSubmit(event)}>
            <label>
              <input
                id='movieInput'
                type='text'
                placeholder='Search for a movie'
                onChange={(text) => this.setState({text: text.target.value})}
                style={styles.form} />
            </label>
          </form>
          <br></br>
          <br></br>
          {this.state.movies.length > 0 &&
            <div style={{padding: 10, display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center'}}>
              {moviePosters}
            </div>
          }
          {this.state.movies.length === 0 && this.state.featuredMovies.length > 0 &&
            <div style={{padding: 10, display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center'}}>
              {moviePosters}
            </div>
          }
        </header>
      </div>
    );
  }
}

const styles = {
  form: {
    fontSize: 'calc(2px + 1.5vmin)',
    backgroundColor: '#393f4c',
    borderStyle: 'none',
    borderRadius: 5,
    padding: 10,
    color: '#4286f4',
    
  },
  header: {
    color: '#4286f4'
  }
}

export default App;
