import React, { Component } from 'react';
import axios from 'axios';
// import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

const TMDBKey = 'c794333156e1c095f41f92e128c002df';

class Details extends Component {

  constructor(props) {
    super(props);

    this.state = {
      // set movie to objct passed from movie.js to app.js to here
      // see onClick method on lines 100 and 120 in movies.js that sends data to app.js
      // then get that movie from app.js through props
      movie: this.props.movie,
    }

  }

  componentDidMount() {
    this.getDetails(this.state.movie);
  }

  getDetails(movie) {
    // need to get more details than what is provided in the search return
    // in other words, the props object taken from app.js does not have all the data we need
    // because tmdb search returns less data than a request for a specific movie
    axios.get('https://api.themoviedb.org/3/' + movie.media_type + '/' + movie.id + '?api_key=' + TMDBKey)
    .then((response) => {
      let movie = response.data;

      // add 'updated' attribute to movie object
      // needed to check if state has been updated in render()
      movie.updated = true;

      this.setState({
        movie: movie
      })
      
    })
  }

  render() {
    let movie = this.state.movie;

    // check for updated movie object
    if(movie.updated === undefined) {
      console.log('returned null');
      return null;
    }

    console.log('details movie: ' + this.state.movie.in_production);
    let releaseDate = '';
    let finishDate = '';

    if(this.props.movie.media_type === 'movie') {
      releaseDate = movie.release_date;
    }
    else if(this.props.movie.media_type === 'tv') {
      // just get year
      releaseDate = movie.first_air_date.substring(0,4);

      // check if tv show is still running
      if(movie.in_production === true) {
        finishDate = 'Present';
      }
      else {
        finishDate = movie.last_air_date.substring(0,4);
      }
    }
    
    return (
      <div style={{minHeight: '100vh', backgroundColor: '#282c34'}}>
        <div style={{textAlign: 'center', color: '#4286f4'}}>
          <h1 style={styles.header}>Details</h1>
        </div>

        <div style={{display: 'flex', flexDirection: 'row'}}>

          <div style={{width: '70%', margin: '0 auto', display: 'flex', flexDirection: 'row'}}>

            <div style={{display: 'flex', flex: 0.33, padding: 40}}>
              <img alt='' src={'https://image.tmdb.org/t/p/w600_and_h900_bestv2' + movie.poster_path} />
            </div>

            <div style={{display: 'flex', flex: 0.67, justifyContent: 'center', padding: 40, flexDirection: 'column'}}>
              {this.props.movie.media_type === 'tv' ? 
                // basically check if tv show or movie since tv show uses 'name' and movie uses 'title
                <p style={{color: 'white', fontSize: '3vh'}}>{movie.name + ' (' + releaseDate.substring(0,4) + ' - ' + finishDate + ')'}</p> :
                <p style={{color: 'white', fontSize: '3vh'}}>{movie.title + ' (' + releaseDate.substring(0,4) + ')'}</p>
              }
              <p style={{color: 'white', fontSize: '2vh'}}>{movie.overview}</p>
            </div>

          </div>
          
        </div>
    
      </div>
    );
  }
}

const styles = {
  main: {
    color: '#4286f4'
  },

  header: {
    backgroundColor: '#282c34',
    fontSize: '5vh',
    margin: 0,
    padding: 40
  }
}

export default Details;