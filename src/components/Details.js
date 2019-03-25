import React, { Component } from 'react';
import axios from 'axios';
import Slider from 'react-slick';
import Videos from "./Videos";
import { ToggleButton, ToggleButtonGroup, ButtonToolbar, FormCheck} from 'react-bootstrap'
import {OMDBKey, TMDBKey, YouTubeKey} from '../config.js'
import { Link } from 'react-router-dom';

// import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

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
      actor: {},
      trailer: '',
      mediaType: this.props.movie.media_type,
      search: this.props.search
    }
    this.clickCast = this.clickCast.bind(this);
    this.clickReviews = this.clickReviews.bind(this);
  }

  componentDidMount() {
    // this.getDetails(this.state.movie);
    var url = this.props.location.pathname.split('/');
    console.log('log: ' + url[3] + ',' + url[2])
    this.getDetailsById(url[3], url[2]);
    console.log(this.props.location)
  }

  componentDidUpdate(prevProps) {
    // if (this.props.movie !== prevProps.movie) {
    //   this.getDetails(this.props.movie);
    // }
    if(this.props.location !== prevProps.location) {
      var url = this.props.location.pathname.split('/');
      console.log('log: ' + url[3] + ',' + url[2])
      if(url[1] === 'home') {
        this.props.setMovie.bind(this, null)
        console.log('home')
      }
      else if(url[1] === 'details') {
        this.getDetailsById(url[3], url[2]);
      }
      else if(url[1].substring(0, 6) === 'search') {
        this.props.setSearch.bind(this, decodeURIComponent(url[1].substring(7, url[1].length)))
        console.log('do something')
      }
      // this.state.movie.updated = undefined;
      // this.forceUpdate();
    }
  }

  getDetailsById(id, mediaType) {
    this.setState({mediaType: mediaType})
    let result = {};
    axios.get('https://api.themoviedb.org/3/' + mediaType + '/' + id + '?api_key=' + TMDBKey)
    .then((response) => {
      result = response.data;

      // add 'updated' attribute to movie object
      // needed to check if state has been updated in render()
      result.updated = true;

      this.setState({movie: result}, this.getRatings(result));
    })

    // get cast
    if(mediaType === 'person') {
      axios.get('https://api.themoviedb.org/3/' + mediaType + '/' + id + '/combined_credits?api_key=' + TMDBKey)
      .then((response) => {
        let cast = response.data.cast;
        cast.id = id;
  
        this.setState({cast: cast});
      })
    }
    else {
      axios.get('https://api.themoviedb.org/3/' + mediaType + '/' + id + '/credits?api_key=' + TMDBKey)
    .then((response) => {
      let cast = response.data.cast;
      cast.id = id;

      this.setState({cast: cast});
    })
    }
    

    //get YouTube search results
    // let title = '';
    // if(this.props.movie.media_type === 'movie') {
    //   title = this.state.movie.title;
    // }
    // else {
    //   title = this.state.movie.name
    // }
    // axios.get('https://www.googleapis.com/youtube/v3/search?q='+ title + ' ' + this.props.movie.media_type + 'review&key=' + YouTubeKey + '&maxResults=5&part=snippet')
    // .then((response) => {
    //   let search = response.data.items;

    //   this.setState({searchResults: search});
    // })

    // get trailer id
    // axios.get('https://api.themoviedb.org/3/' + mediaType + '/' + id + '/videos?api_key=' + TMDBKey)
    // .then((response) => {
    //   let trailer = response.data.results[0].key;

    //   this.setState({trailer: trailer})
    // })
  }

  // getDetails(movie) {
  //   console.log('get details called');
  //   // need to get more details than what is provided in the search return
  //   // in other words, the props object taken from app.js does not have all the data we need
  //   // because tmdb search returns less data than a request for a specific movie
  //   let result = {};
  //   axios.get('https://api.themoviedb.org/3/' + movie.media_type + '/' + movie.id + '?api_key=' + TMDBKey)
  //   .then((response) => {
  //     result = response.data;

  //     // add 'updated' attribute to movie object
  //     // needed to check if state has been updated in render()
  //     result.updated = true;

  //     this.setState({movie: result}, this.getRatings(result));
  //   })

  //   // get cast
  //   if(movie.media_type === 'person') {
  //     axios.get('https://api.themoviedb.org/3/' + movie.media_type + '/' + movie.id + '/combined_credits?api_key=' + TMDBKey)
  //     .then((response) => {
  //       let cast = response.data.cast;
  //       cast.id = movie.id;
  
  //       this.setState({cast: cast});
  //     })
  //   }
  //   else {
  //     axios.get('https://api.themoviedb.org/3/' + movie.media_type + '/' + movie.id + '/credits?api_key=' + TMDBKey)
  //   .then((response) => {
  //     let cast = response.data.cast;
  //     cast.id = movie.id;

  //     this.setState({cast: cast});
  //   })
  //   }
    

  //   //get YouTube search results
  //   // let title = '';
  //   // if(this.props.movie.media_type === 'movie') {
  //   //   title = this.state.movie.title;
  //   // }
  //   // else {
  //   //   title = this.state.movie.name
  //   // }
  //   // axios.get('https://www.googleapis.com/youtube/v3/search?q='+ title + ' ' + this.props.movie.media_type + 'review&key=' + YouTubeKey + '&maxResults=5&part=snippet')
  //   // .then((response) => {
  //   //   let search = response.data.items;

  //   //   this.setState({searchResults: search});
  //   // })

  //   // get trailer id
  //   axios.get('https://api.themoviedb.org/3/' + movie.media_type + '/' + movie.id + '/videos?api_key=' + TMDBKey)
  //   .then((response) => {
  //     let trailer = response.data.results[0].key;

  //     this.setState({trailer: trailer})
  //   })
  // }

  getRatings(movie) {
    // get ratings
    // CURRENTLY BREAKS IF THE MOVIE DOESN'T HAVE RT OR METACRITIC RATINGS
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

  //get YouTube search results
  getReviews(movie) {
    let title = '';
    if(movie.media_type === 'movie') {
      title = movie.title;
    }
    else {
      title = movie.name
    }
    axios.get('https://www.googleapis.com/youtube/v3/search?q='+ title + ' ' + movie.media_type + ' review&key=' + YouTubeKey + '&maxResults=5&part=snippet')
    .then((response) => {
      let search = response.data.items;

      this.setState({searchResults: search});
    })
  }

  // getDetailsByID(id) {
  //   axios.get('https://api.themoviedb.org/3/person/' + id + '?api_key=' + TMDBKey)
  //   .then((response) => {
  //     let result = response.data;
  //     console.log(result.name);
  //     this.setState({actor: result});
  //   })
  // }

  clickCast() {
    this.setState({showReviews: false});
  }
  clickReviews() {
    //if the search results are empty, call youtube api
    if(this.state.searchResults.length === 0) {
      this.getReviews(this.props.movie);
      console.log('getting reviews for the first time');
    }
    this.setState({showReviews: true});
  }

  // changeToMovie(creditId) {
  //   // get media type -> movie or tv
  //   axios.get('https://api.themoviedb.org/3/credit/' + creditId + '?api_key=' + TMDBKey)
  //   .then((response) => {
  //     let mediaType = response.data.media_type;

  //     this.setState({mediaType: mediaType})
  //   })
  // }


  render() {
    let movie = this.state.movie;
    let cast = this.state.cast;
    let ratings = this.state.ratings;
    let actor = this.state.movie;

    console.log(this.state.mediaType)

    // check for updated movie object
    if(movie.updated === undefined) {
      console.log('returned null');
      return null;
    }

    // make sure there is a cast
    if((cast.length === 0 || ratings === undefined) && this.state.mediaType !== 'person' ) {
      return null;
    }

    let releaseDate = '';
    let finishDate = '';

    if(this.state.mediaType === 'movie') {
      releaseDate = movie.release_date;
    }
    else if(this.state.mediaType === 'tv') {
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

    let castList = [];
    let ratingsList = [];
    let creditsList = [];
    if(this.state.mediaType !== 'person') {
      // list of cast members for render
      castList = this.state.cast.map(actor => {
        let poster = 'https://image.tmdb.org/t/p/w600_and_h900_bestv2';
        if(actor.profile_path === null) {
          poster = 'https://www.classicposters.com/images/nopicture.gif';
        }
        else {
          poster = 'https://image.tmdb.org/t/p/w600_and_h900_bestv2' + actor.profile_path;
        }
        return (
          <Link style={{textDecoration: 'none'}} to={'/details/person/' + actor.id + '/' + actor.name} onClick={this.props.changeToActor.bind(this, actor.id)} >
            <div style={{padding: 3}}>
              {/* force height to 15vw for null posters */}
              <img style={{width: '10vw', height:'15vw', alignSelf: 'center'}} src={poster} alt='' />
              <p style={{color: 'white', fontSize: '1.5vh', maxWidth: '10vw'}}>{actor.name}</p>
              <p style={{color: '#d3d3d3', maxWidth: '10vw'}}>{actor.character}</p>
            </div>
          </Link>
          
        )
      })

      // list of ratings for render
      ratingsList = this.state.ratings.map(rating => {
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
        
        let title = '';
        // let year = ''
        // let id = '';
        if(this.state.mediaType === 'movie') {
          title = movie.title;
          // id = movie.imdb_id;
        }
        else {
          title = movie.name;
          // id = movie.id;
        }
        
        return (
          <div style={{display: 'flex', justifyContent: 'center', paddingLeft: 20, alignContent: 'center', flexDirection: 'column'}}>
            {rating.Source === 'IMDB' &&
              <div>
                <a href={'https://www.imdb.com/title/' + movie.imdb_id} target="_blank" rel="noopener noreferrer" style={{textDecoration: 'none'}}>
                  <img alt='' style={{width:'1.5em', height: '1.5em', display: 'block', margin: '0 auto'}} src={require('../icons/imdbStar.png')} />
                  <p style={{color: 'white', display: 'flex', justifyContent: 'center', fontSize: '110%'}}>{'IMDb: ' + rating.Value}</p>
                </a>
              </div>
            }
            {rating.Source === 'Rotten Tomatoes' &&
              <div>
                <a href={'https://www.rottentomatoes.com/m/' + title.replace(':', '').split(' ').join('_')} target="_blank" rel="noopener noreferrer" style={{textDecoration: 'none'}}>
                  <img alt='' style={{width:'1.5em', height: '1.5em', display: 'block', margin: '0 auto'}} src={rtIcon} />
                  <p style={{color: 'white', display: 'flex', justifyContent: 'center', fontSize: '110%'}}>{'RT: ' + rating.Value}</p>
                </a>
              </div>
            }
            {rating.Source === 'Metacritic' &&
              <a href={'https://www.metacritic.com/search/all/' + title + '/results'} target="_blank" rel="noopener noreferrer" style={{textDecoration: 'none'}}>
                <div style={{display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems:'center'}}>
                  <div style={{margin: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: color, color: 'white', width:'1.5em', height: '1.5em', flexDirection: 'column'}}>
                    <p style={{padding: 0, margin: 0, display: 'flex', justifyContent: 'center'}}>{rating.Value.substring(0, rating.Value.indexOf('/'))}</p>
                  </div>
                  <p style={{color: 'white', display: 'flex', justifyContent: 'center', fontSize: '110%'}}>{rating.Source}</p>
                </div>
              </a>
              
            }
            {/* <img style={{width:'1.5vw', height: '1.5vw', display: 'block', margin: '0 auto'}} src={require('../icons/imdbStar.png')} /> */}
          </div>
        )
      })
    }

    else {
      // sort by popularity
      this.state.cast.sort((a, b) => b.popularity - a.popularity);

      // for tv shows sort by number of episodes
      this.state.cast.sort((a, b) => b.episode_count - a.episode_count);


      creditsList = this.state.cast.map((credit) => {
        var episodes = 'episodes';

        let poster = 'https://image.tmdb.org/t/p/w600_and_h900_bestv2' + credit.poster_path;
        var creditTitle = '';
        if(credit.media_type === 'movie') {
          if(credit.title !== undefined) {
            creditTitle = credit.title.replace('%', ' Percent')
          }
        }
        else {
          if(credit.name !== undefined) {
            creditTitle = credit.name.replace('%', ' Percent')
          }
        }

        if(credit.episode_count === 1) {
          episodes = 'episode'
        }
        
        console.log(creditTitle)
        return (
          <Link to={'/details/' + credit.media_type + '/' + credit.id + '/' + creditTitle} onClick={this.props.changeToMovie.bind(this, credit.credit_id)}>
            <div style={{padding: 3, paddingBottom: 50}}>
              {/* force height to 15vw for null posters */}
              <img style={{width: '10vw', height:'15vw', alignSelf: 'center', maxWidth: '10vw'}} src={poster} alt='' />
              { credit.media_type === 'tv' ?
                <p style={{color: 'white', fontSize: '1.6vh', maxWidth: '10vw'}}>{creditTitle + ' (' + credit.episode_count + ' ' + episodes + ')'}</p>:
                <p style={{color: 'white', fontSize: '1.6vh', maxWidth: '10vw'}}>{creditTitle}</p>
              }
              <p style={{color: '#d3d3d3', fontSize: '1.3vh'}}>{credit.character}</p>
            </div>
          </Link>
          
        )
      })
    }
    

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
      adaptiveHeight: true,
      centerMode: true,
      initialSlide: 0
    };

    var castSettings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 4,
      slidesToScroll: 4,
      adaptiveHeight: true,
      initialSlide: 0
    };

    return (
      <div style={{minHeight: '100vh', backgroundColor: '#282c34', maxWidth:'100vw'}}>
        <div style={{textAlign: 'center', color: '#4286f4'}}>
          <h1 style={styles.header}>Details</h1>
        </div>

        <div style={{display: 'flex', flexDirection: 'row', width: '70%'}}>

          <div style={{width: '70%', margin: 'auto', display: 'flex', flexDirection: 'row'}}>

            <div id='poster' style={{display: 'flex', flex: 0.33, padding: 40}}>
              {this.state.mediaType === 'person' ?
                <img style={{maxHeight: 500}} alt='' src={'https://image.tmdb.org/t/p/w600_and_h900_bestv2' + movie.profile_path} /> :
                <img style={{maxHeight: 500}} alt='' src={'https://image.tmdb.org/t/p/w600_and_h900_bestv2' + movie.poster_path} />
              }
            </div>

            {/* DO THIS FOR MOVIES OR TV SHOWS */}
            {this.state.mediaType !== 'person' ?
              <div style={{display: 'flex', flex: 0.67, justifyContent: 'center', padding: 40, flexDirection: 'column'}}>
                <div style={{display: 'flex', flexDirection: 'row'}}>
                  {this.state.mediaType === 'tv' &&
                    // basically check if tv show or movie since tv show uses 'name' and movie uses 'title'
                    <p style={{color: 'white', fontSize: '3vh'}}>{movie.name + ' (' + releaseDate.substring(0,4) + ' - ' + finishDate + ')'}</p>
                  }
                  {this.state.mediaType === 'movie' &&
                    <p style={{color: 'white', fontSize: '3vh'}}>{movie.title + ' (' + releaseDate.substring(0,4) + ')'}</p>
                  }
                  {ratings.length > 0 && this.state.mediaType !== 'person' ?
                    <div style={{display: 'flex', flexDirection: 'row'}}>{ratingsList}</div> :
                    <p style={{color: 'white', padding: 20}}>No ratings yet</p>
                  }
                </div>
                


                {this.state.mediaType === 'movie' &&
                  <div style={{display: 'flex', flexDirection: 'row'}}>
                    <p style={{color: '#d3d3d3', paddingRight: 20}}>{months[parseInt(movie.release_date.substring(5,7)) - 1] + ' ' + movie.release_date.substring(8) + ', ' + movie.release_date.substring(0,4)}</p>
                    <p style={{color: '#d3d3d3', paddingRight: 20}}>{movie.runtime + ' minutes'}</p>
                    <p style={{color: '#d3d3d3', paddingRight: 20}}>{movie.tagline}</p>
                  </div>
                }
                
                {movie.overview.length > 300 ?
                  <p style={{color: 'white', fontSize: '2vh'}}>{movie.overview.substring(0, 300) + '...'}</p> :
                  <p style={{color: 'white', fontSize: '2vh'}}>{movie.overview}</p>
                }
                

                {/* Conditional rendering for Cast/Reviews */}

                <ButtonToolbar>
                  <ToggleButtonGroup type="radio" name="options" defaultValue={1}>
                    <ToggleButton value={1} variant="secondary" onClick={this.clickCast}>Cast</ToggleButton>
                    <ToggleButton value={2} variant="secondary" onClick={this.clickReviews}>Reviews</ToggleButton>
                  </ToggleButtonGroup>
                </ButtonToolbar>

                {this.state.showReviews && 
                  <div style={{width: '100%', padding: 5}}>
                  
                  <div style={{margin: 0, padding: 10, width: '45vw', height: '30vh'}}>
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
                    
                    <div style={{margin: 0, padding: 10, width: '45vw', height: '30vh'}}>
                      {cast.length > 0 && this.state.mediaType !== 'person' &&
                        <Slider {...castSettings}>
                          {castList}
                        </Slider>
                      }
                    </div>
                  </div>
                }
              </div>:
              // DO THIS FOR PEOPLE
              <div style={{display: 'flex', flex: 0.67, justifyContent: 'center', padding: 40, flexDirection: 'column'}}>
                <div style={{display: 'flex', flexDirection: 'row'}}>
                  <p style={{color: 'white', fontSize: '3vh'}}>{actor.name}</p>
                </div>

                {/* <p style={{color: 'white', fontSize: '2vh'}}>{actor.biography}</p> */}
                {actor.biography !== undefined && actor.biography.length > 300 ?
                  <p style={{color: 'white', fontSize: '2vh'}}>{actor.biography.substring(0, 300) + '...'}</p> :
                  <p style={{color: 'white', fontSize: '2vh'}}>{actor.biography}</p>
                }

                <div style={{width: '100%', padding: 5}}>
                  <p style={{color: 'white', fontSize: '3vh'}}>Known For</p>
                  <div style={{margin: 0, padding: 0, width: '45vw', height: '60vh'}}>
                      <Slider {...castSettings} id='slider'>
                        {creditsList}
                      </Slider>
                  </div>
                </div>
              </div>
            }
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