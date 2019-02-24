import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import axios from 'axios';
import styles from '../App.css';
import { Navbar, Nav, Form, Button, FormControl } from 'react-bootstrap'

// import Details from './Details'
// import constants from './../constants'

// const APIKey = 'a6793cf9';
const TMDBKey = 'c794333156e1c095f41f92e128c002df';

class Movies extends Component {

  constructor(props) {
    super(props);

    this.state = {
      movies: [],
      text: '',
      featuredMovies: []
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
      })
  }

  getMovies(searchText) {
    // get page 1
    axios.get('https://api.themoviedb.org/3/search/multi?&api_key=' + TMDBKey + '&language=en-US&query=' + searchText + '&page=1&include_adult=false')
      .then((response) => {
        let page1 = response.data.results;
        
        // get page 2
        axios.get('https://api.themoviedb.org/3/search/multi?&api_key=' + TMDBKey + '&language=en-US&query=' + searchText + '&page=2&include_adult=false')
          .then((response2) => {
            let page2 = response2.data.results;
            let movies = page1.concat(page2);

            // sort by popularity
            movies.sort((a, b) => b.popularity - a.popularity);

            this.setState({
              // only get 20 movies from search
              movies: movies.slice(0, 20),
            });
            
          })
      })
      .catch((err) => {
        console.log(err);
    });
  }

  handleSubmit(event){
    // dont refresh
    event.preventDefault();

    console.log(this.state.text);
    this.getMovies(this.state.text);
  }

  render() {
    let moviePosters = [];

    if(this.state.movies.length > 0) {
      moviePosters = this.state.movies.map(movie => {
        let poster = 'https://image.tmdb.org/t/p/w600_and_h900_bestv2' + movie.poster_path;
        let movieId = movie.id;
        let name = '';

        if(movie.media_type === "movie") {
          name = movie.title;
        }
        else if(movie.media_type === "tv") {
          name = movie.name;
        }
        else if(movie.media_type === 'person') {
          name = movie.name;
          poster = 'https://image.tmdb.org/t/p/w600_and_h900_bestv2' + movie.profile_path;
        }

        if(movie.poster_path === null || movie.profile_path === null) {
          poster = 'https://www.classicposters.com/images/nopicture.gif'
        }

        console.log('media: ' + movie.media_type)

        return (
            <Router>
              <Link to={'/details/' + movieId + '/' + name} style={{textDecoration: 'none'}} onClick={this.props.setMovie.bind(this, movie)}>
                <img key={poster} src={poster} className="flexChild" alt="" />
                <p style={{color: 'white', fontSize: '1.5vh', padding: 10, maxWidth: '300px', textDecoration: 'none'}}>{name}</p>
              </Link>
            </Router>
          )
      });
    }
    else {
      moviePosters = this.state.featuredMovies.map(movie => {
        movie.media_type = 'movie';
        let poster = 'https://image.tmdb.org/t/p/w600_and_h900_bestv2' + movie.poster_path;
        let movieId = movie.id;
        let movieTitle = movie.title;
        console.log(movie);
        return (
            <Router>
              <div>
                <Link to={'/details/' + movieId + '/' + movieTitle} style={{textDecoration: 'none'}} onClick={this.props.setMovie.bind(this, movie)}>
                  <img key={movieId} src={poster} className="flexChild" alt="poster" />
                  <p style={{color: 'white', fontSize: '1.5vh', padding: 10, maxWidth: '300px', textDecoration: 'none'}}>{movie.title}</p>
                </Link>
                <Route path={'/details/' + movieId + '/' + movieTitle} />
              </div>
            </Router>
        )
      });
    }
    
    return (
      <div className="App">
        <Navbar bg="dark" variant="dark">
          <Navbar.Brand href="#home">Film Focus</Navbar.Brand>
          <Nav className="mr-auto">
            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="#features">About</Nav.Link>
            <Nav.Link href="#pricing">Discussions</Nav.Link>
          </Nav>
          <Form inline onSubmit={(event) => (this.handleSubmit(event))}>
            <FormControl type="text" placeholder="Search" className="mr-sm-2" onChange={(text) => this.setState({text: text.target.value})} />
            <Button variant="outline-info" onClick={(event) => (this.handleSubmit(event))}>Search</Button>
          </Form>
        </Navbar>
        <h1 className="header">This site is trash lmao</h1>
          {/* <form onSubmit={(event) => this.handleSubmit(event)}>
            <label>
              <input
                id='movieInput'
                type='text'
                placeholder='Search for a movie'
                onChange={(text) => this.setState({text: text.target.value})}
                style={styles.form} />
            </label>
          </form> */}
          {this.state.movies.length > 0 &&
            <div className="flexParent">
              {moviePosters}
            </div>
          }
          {this.state.movies.length === 0 && this.state.featuredMovies.length > 0 &&
            <div className="flexParent">
              {moviePosters}
            </div>
          }
      </div>
    );
  }
}

// Moved to external stylesheet
// const styles = {
//   form: {
//     fontSize: 'calc(2px + 1.5vmin)',
//     backgroundColor: '#393f4c',
//     borderStyle: 'none',
//     borderRadius: 5,
//     padding: 10,
//     color: '#4286f4',
    
//   },
//   header: {
//     color: '#4286f4',
//     margin: 30
//   }
// }

export default Movies;