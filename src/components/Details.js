import React, { Component } from 'react';
import axios from 'axios';
import Slider from 'react-slick';
import Videos from "./Videos";
import { ToggleButton, ToggleButtonGroup, ButtonToolbar } from 'react-bootstrap'

var IMDBIcon = require('../icons/imdbStar.png');
var RTIcon = require('../icons/rt2.png')
// import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

const TMDBKey = 'c794333156e1c095f41f92e128c002df';
const OMDBKey = 'a6793cf9';
const YouTubeKey = 'AIzaSyAgBnpRVJaBeWu2AQmYpvzNxTaBp8_NguM';


class Details extends Component {

  constructor(props) {
    super(props);

    this.state = {
      // set movie to objct passed from movie.js to app.js to here
      // see onClick method on lines 100 and 120 in movies.js that sends data to app.js
      // then get that movie from app.js through props
      movie: this.props.movie,
      cast: [],
      ratings: [],
      searchResults: [],
      showReviews: false,
    }
    this.clickCast = this.clickCast.bind(this);
    this.clickReviews = this.clickReviews.bind(this);
  }

  componentDidMount() {
    this.getDetails(this.state.movie);
  }

  getDetails(movie) {
    // need to get more details than what is provided in the search return
    // in other words, the props object taken from app.js does not have all the data we need
    // because tmdb search returns less data than a request for a specific movie
    let result = {};
    axios.get('https://api.themoviedb.org/3/' + movie.media_type + '/' + movie.id + '?api_key=' + TMDBKey)
    .then((response) => {
      result = response.data;

      // add 'updated' attribute to movie object
      // needed to check if state has been updated in render()
      result.updated = true;

      this.setState({movie: result}, this.getRatings(result));
    })

    // get cast
    axios.get('https://api.themoviedb.org/3/' + movie.media_type + '/' + movie.id + '/credits?api_key=' + TMDBKey)
    .then((response) => {
      let cast = response.data.cast;

      this.setState({cast: cast});
    })

    //get YouTube search results
    axios.get('https://www.googleapis.com/youtube/v3/search?q='+ movie.title + ' movie review&key=' + YouTubeKey + '&maxResults=5&part=snippet')
    .then((response) => {
      let search = response.data.items;

      this.setState({searchResults: search});
    })
  }

  getRatings(movie) {
    // get ratings
    if(movie.imdb_id === undefined) {
      axios.get('http://www.omdbapi.com/?t=' + movie.name + '&apikey=' + OMDBKey)
      .then((response) => {
        let ratings = response.data.Ratings;

        this.setState({ratings: ratings});
      })
    }
    else {
      axios.get('http://www.omdbapi.com/?i=' + movie.imdb_id + '&apikey=' + OMDBKey)
      .then((response) => {
        let ratings = response.data.Ratings;
  
        this.setState({ratings: ratings});
      })
    } 
  }

  clickCast() {
    this.setState({showReviews: false});
  }
  clickReviews() {
    this.setState({showReviews: true});
  }


  render() {
    let movie = this.state.movie;
    let cast = this.state.cast;
    let ratings = this.state.ratings;

    // check for updated movie object
    if(movie.updated === undefined) {
      console.log('returned null');
      return null;
    }

    // make sure there is a cast
    if(cast.length === 0 || ratings === undefined ) {
      return null;
    }

    console.log('cast: ' + cast.length);

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

    // list of cast members for render
    let castList = this.state.cast.map(actor => {
      let poster = 'https://image.tmdb.org/t/p/w600_and_h900_bestv2';
      if(actor.profile_path === null) {
        poster = 'https://www.classicposters.com/images/nopicture.gif';
      }
      else {
        poster = 'https://image.tmdb.org/t/p/w600_and_h900_bestv2' + actor.profile_path;
      }
      return (
        <div style={{padding: 3}}>
          {/* force height to 15vw for null posters */}
          <img style={{width: '10vw', height:'15vw', alignSelf: 'center'}} src={poster} alt='' />
          <p style={{color: 'white', fontSize: '1.5vh'}}>{actor.name}</p>
          <p style={{color: '#d3d3d3'}}>{actor.character}</p>
        </div>
      )
    })

    // list of ratings for render
    let ratingsList = this.state.ratings.map(rating => {
      let rtIcon = require('../icons/rt2.png')
      let score = 0;
      let color = 'green';
      if(rating.Source === 'Internet Movie Database') {
        rating.Source = 'IMDB';
      }
      else if(rating.Source === 'Rotten Tomatoes') {
        score = parseInt(JSON.stringify(rating.Value).replace(/['"]+/g, '').slice(0, -1));
        if(score < 60) {
          rtIcon = require('../icons/rt_rotten.png')
        }
      }
      else if(rating.Source === 'Metacritic') {
        score = parseInt(JSON.stringify(rating.Value).replace(/['"]+/g, '').slice(0, -1));
        if(score >= 60) {
          color = 'green';
        }
        else if (score >= 40) {
          color = '#cccc00';
        }
        else {
          color = 'red';
        }
      }
      
      return (
        <div style={{display: 'flex', justifyContent: 'center', paddingLeft: 20, alignContent: 'center', flexDirection: 'column'}}>
          {rating.Source === 'IMDB' &&
            <div>
              <img style={{width:'1.5vw', height: '1.5vw', display: 'block', margin: '0 auto'}} src={require('../icons/imdbStar.png')} />
              <p style={{color: 'white', display: 'flex', justifyContent: 'center', fontSize: '110%'}}>{'IMDb: ' + rating.Value}</p>
            </div>
          }
          {rating.Source === 'Rotten Tomatoes' &&
            <div>
              <img style={{width:'1.5vw', height: '1.5vw', display: 'block', margin: '0 auto'}} src={rtIcon} />
              <p style={{color: 'white', display: 'flex', justifyContent: 'center', fontSize: '110%'}}>{'RT: ' + rating.Value}</p>
            </div>
          }
          {rating.Source === 'Metacritic' &&
            <div style={{display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems:'center'}}>
              <div style={{margin: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: color, color: 'white', width:'1.5vw', height: '1.5vw', flexDirection: 'column'}}>
                <p style={{padding: 0, margin: 0, display: 'flex', justifyContent: 'center'}}>{rating.Value.substring(0, rating.Value.indexOf('/'))}</p>
              </div>
              <p style={{color: 'white', display: 'flex', justifyContent: 'center', fontSize: '110%'}}>{rating.Source}</p>
            </div>
          }
          {/* <img style={{width:'1.5vw', height: '1.5vw', display: 'block', margin: '0 auto'}} src={require('../icons/imdbStar.png')} /> */}
        </div>
      )
    })

    // list of videos for render
    let resultList = this.state.searchResults.map(result => {
      return (
        <div style={{color: 'white'}}>
          <p style={{color: 'white'}}>{result.snippet.channelTitle}</p>
          <Videos id={result.id.videoId} />
        </div>
      )
    })

    var resultSettings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      adaptiveHeight: true
    };

    var castSettings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 4,
      slidesToScroll: 4,
      adaptiveHeight: true
    };

    return (
      <div style={{minHeight: '100vh', backgroundColor: '#282c34', maxWidth:'100vw'}}>
        <div style={{textAlign: 'center', color: '#4286f4'}}>
          <h1 style={styles.header}>Details</h1>
        </div>

        <div style={{display: 'flex', flexDirection: 'row'}}>

          <div style={{width: '70%', margin: '0 auto', display: 'flex', flexDirection: 'row'}}>

            <div style={{display: 'flex', flex: 0.33, paddingRight: 40}}>
              {this.props.movie.media_type === 'person' ?
                <img alt='' src={'https://image.tmdb.org/t/p/w600_and_h900_bestv2' + movie.profile_path} /> :
                <img style={{maxHeight: 900}} alt='' src={'https://image.tmdb.org/t/p/w600_and_h900_bestv2' + movie.poster_path} />
              }
            </div>

            <div style={{display: 'flex', flex: 0.67, justifyContent: 'center', padding: 40, flexDirection: 'column'}}>
              <div style={{display: 'flex', flexDirection: 'row'}}>
                {this.props.movie.media_type === 'tv' ? 
                  // basically check if tv show or movie since tv show uses 'name' and movie uses 'title
                  <p style={{color: 'white', fontSize: '3vh'}}>{movie.name + ' (' + releaseDate.substring(0,4) + ' - ' + finishDate + ')'}</p> :
                  <p style={{color: 'white', fontSize: '3vh'}}>{movie.title + ' (' + releaseDate.substring(0,4) + ')'}</p>
                }
                {ratings.length > 0 ?
                  <div style={{display: 'flex', flexDirection: 'row'}}>{ratingsList}</div> :
                  <p style={{color: 'white', padding: 20}}>No ratings yet</p>
                }
              </div>
              
              <p style={{color: 'white', fontSize: '2vh'}}>{movie.overview}</p>

              {/* Conditional rendering for Cast/Reviews
                REPLACE WITH BETTER LOOKING BUTTONS EVENTUALLY */}

              <ButtonToolbar>
                  <ToggleButtonGroup type="radio" name="options" defaultValue={1}>
                    <ToggleButton value={1} variant="secondary" onClick={this.clickCast}>Cast</ToggleButton>
                    <ToggleButton value={2} variant="secondary" onClick={this.clickReviews}>Reviews</ToggleButton>
                  </ToggleButtonGroup>
                </ButtonToolbar>

              {this.state.showReviews && 
                <div style={{width: '100%', padding: 5}}>
                <p style={{color: 'white', fontSize: '3vh'}}>Reviews</p>
                <div style={{margin: 0, padding: 0, width: '45vw'}}>
                  {resultList.length > 0 &&
                    <Slider {...resultSettings}>
                      {resultList}
                    </Slider>
                  }
                </div>
              </div>
              }
              {!this.state.showReviews &&
                <div style={{width: '100%', padding: 5}}>
                  <p style={{color: 'white', fontSize: '3vh'}}>Cast</p>
                  <div style={{margin: 0, padding: 0, width: '45vw'}}>
                    {cast.length > 0 && this.props.movie.media_type !== 'person' &&
                      <Slider {...castSettings}>
                        {castList}
                      </Slider>
                    }
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
        <div style={{width: '70%', margin: '0 auto', display: 'flex', flexDirection: 'column'}}>
            <p style={{color: 'white', fontSize: '3vh'}}>Reviews</p>
            <div>
              <Videos />
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
  },

  castImage: {
    width: '10%'
  }
}



export default Details;