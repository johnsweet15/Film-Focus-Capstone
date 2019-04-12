import React, { Component } from 'react';
import axios from 'axios';
import Slider from 'react-slick';
import Videos from "./Videos";
import { ToggleButton, ToggleButtonGroup, ButtonToolbar, Modal, Button, Carousel } from 'react-bootstrap'
import {OMDBKey, TMDBKey, YouTubeKey} from '../config.js'
import { Link } from 'react-router-dom';
// import { S_IFDIR } from 'constants';

// import io from 'socket.io-client';
 
// let backendHost = 'http://localhost:3001';
// const socket = io(backendHost);

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
      showCast: true,
      actor: {},
      trailers: [],
      mediaType: null,
      search: this.props.search,
      // socket: socket,
      movie_id: '',
      showDescription: false,
      showPoster: false,
      showTrailers: false
    }
    this.clickCast = this.clickCast.bind(this);
    this.clickReviews = this.clickReviews.bind(this);
    this.clickTrailers = this.clickTrailers.bind(this)
    this.clickDescription = this.clickDescription.bind(this);
    this.clickPoster = this.clickPoster.bind(this);
  }

  componentDidMount() {
    // this.getDetails(this.state.movie);
    var url = this.props.location.pathname.split('/');
    console.log('log: ' + url[3] + ',' + url[2])
    this.getDetailsById(url[3], url[2]);
    console.log(this.props.location)

    // this.getReviews(this.props.movie, url[3]);
  }

  componentDidUpdate(prevProps) {
    // if (this.props.movie !== prevProps.movie) {
    //   this.getDetails(this.props.movie);
    // }
    var url = this.props.location.pathname.split('/');
    if(this.props.location !== prevProps.location) {
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
    var url = this.props.location.pathname.split('/');
    this.setState({movie_id: id});

    this.setState({mediaType: mediaType})
    let result = {};
    axios.get('https://api.themoviedb.org/3/' + mediaType + '/' + id + '?api_key=' + TMDBKey)
    .then((response) => {
      result = response.data;

      // add 'updated' attribute to movie object
      // needed to check if state has been updated in render()
      result.updated = true;

      this.setState({movie: result}, this.getRatings(result), this.getReviews(result, url[3]));
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

    // var url = this.props.location.pathname.split('/');

    // this.getReviews(this.state.movie, url[3]);

    this.getTrailerKeys(id)
  }
 
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
  getReviews(movie, id) {

    // SOCKET STUFF HERE, UNCOMMENT TO USE

    // let foundVideos = this.state.socket.emit('requestVideos', id);
    // if (foundVideos.length > 0) {
    //   this.setState({searchResults: foundVideos});
      
    // }

     
    

      let title = '';
      if(this.state.mediaType === 'movie') {
        title = movie.title;
      }
      else {
        title = movie.name
      }
      axios.get('https://www.googleapis.com/youtube/v3/search?q='+ title + ' ' + this.state.mediaType + ' review&key=' + YouTubeKey + '&maxResults=5&part=snippet')
      .then((response) => {
        let search = response.data.items;

        console.log('searchResults: ' + search)

        this.setState({searchResults: search});
      })
  
      // send list of video ids to the server
      // MORE SOCKET STUFF, UNCOMMENT TO USE
      // var r = [this.state.searchResults.map(result => {return result.id.videoId})];
      // this.state.socket.emit('saveToDb', { id: id, video_id_array: r });
  }

  getTrailerKeys(id) {
    axios.get('https://api.themoviedb.org/3/movie/' + id + '/videos?api_key=' + TMDBKey + '&language=en-US')
    .then((response) => { 
      // get trailer objects
      let videos = response.data.results

      let keys = videos
        .filter(video => video.type === 'Trailer')
        .map((video) => video.key)

      this.getTrailers(keys)
    })
  }

  getTrailers(keys) {
    console.log('keys: ' + keys[0])
    axios.get('https://www.googleapis.com/youtube/v3/videos?id=' + keys + '&key=' + YouTubeKey + '&part=snippet')
    .then((response) => {
      let trailers = response.data.items;

      this.setState({trailers: trailers})
    })
  }

  clickCast() {
    this.setState({
      showCast: true,
      showReviews: false,
      showTrailers: false
    });
  }
  clickReviews() {
    //if the search results are empty, call youtube api
    if(this.state.searchResults.length === 0) {
      //this.getReviews(this.props.movie);
      console.log('getting reviews for the first time');
    }
    this.setState({
      showCast: false,
      showReviews: true,
      showTrailers: false
    });
    this.forceUpdate();
  }

  clickTrailers() {
    this.setState({
      showCast: false,
      showReviews: false,
      showTrailers: true
    })
  }

  clickDescription() {
    this.setState({showDescription: !this.state.showDescription})
  }

  clickPoster() {
    this.setState({showPoster: !this.state.showPoster})
  }

  render() {

    let movie = this.state.movie;
    let cast = this.state.cast;
    let ratings = this.state.ratings;
    let actor = this.state.movie;

    if(movie === undefined || movie === null) {
      return null
    }

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
      castList = this.state.cast.map((actor) => {
        let poster = 'https://image.tmdb.org/t/p/w600_and_h900_bestv2';
        if(actor.profile_path === null) {
          poster = 'https://www.classicposters.com/images/nopicture.gif';
        }
        else {
          poster = 'https://image.tmdb.org/t/p/w600_and_h900_bestv2' + actor.profile_path;
        }
        return (
          <div>
            <div style={{display: 'flex', flexDirection: 'row'}}>
              <Link style={{textDecoration: 'none'}} to={'/details/person/' + actor.id + '/' + actor.name} onClick={this.props.changeToActor.bind(this, actor.id)} >
                <div style={{padding: 3}}>
                  {/* force height to 15vw for null posters */}
                  <img style={{width: '8vw', height:'12vw', alignSelf: 'center'}} src={poster} alt='' />
                  <p style={{color: 'white', fontSize: '1.5vh', maxWidth: '10vw'}}>{actor.name}</p>
                  <p style={{color: '#d3d3d3', fontSize: '1.2vh', maxWidth: '10vw'}}>{actor.character}</p>
                </div>
              </Link>
            </div>
          </div>
          
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
          <div className='ratings' style={{display: 'flex', justifyContent: 'center', paddingLeft: 20, alignContent: 'center', flexDirection: 'column'}}>
            {rating.Source === 'IMDB' &&
              <div>
                <a href={'https://www.imdb.com/title/' + movie.imdb_id} target="_blank" rel="noopener noreferrer" style={{textDecoration: 'none'}}>
                  <img id='ratingsIcon' alt='' style={{display: 'block', margin: '0 auto'}} src={require('../icons/imdbStar.png')} />
                  <p style={{color: 'white', display: 'flex', justifyContent: 'center', fontSize: '110%'}}>{'IMDb: ' + rating.Value}</p>
                </a>
              </div>
            }
            {rating.Source === 'Rotten Tomatoes' &&
              <div>
                <a href={'https://www.rottentomatoes.com/m/' + title.replace(':', '').split(' ').join('_')} target="_blank" rel="noopener noreferrer" style={{textDecoration: 'none'}}>
                  <img id='ratingsIcon' alt='' style={{display: 'block', margin: '0 auto'}} src={rtIcon} />
                  <p style={{color: 'white', display: 'flex', justifyContent: 'center', fontSize: '110%'}}>{'RT: ' + rating.Value}</p>
                </a>
              </div>
            }
            {rating.Source === 'Metacritic' &&
              <a href={'https://www.metacritic.com/search/all/' + title + '/results'} target="_blank" rel="noopener noreferrer" style={{textDecoration: 'none'}}>
                <div style={{display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems:'center'}}>
                  <div id='ratingsIcon' style={{margin: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: color, color: 'white', flexDirection: 'column'}}>
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
      this.state.cast.sort((a, b) =>  b.popularity - a.popularity);

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
              <img style={{width: '8vw', height:'12vw', alignSelf: 'center', maxWidth: '10vw'}} src={poster} alt='' />
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
        <div style={{color: 'white', textAlign: 'center'}}>
          <p style={{color: 'white'}}>{result.snippet.channelTitle}</p>
          <div style={{maxHeight: '100px'}}>
            <Videos id={result.id.videoId} />
          </div>
        </div>
      )
    })

    let trailerList = this.state.trailers.map(trailer => {
      return (
        <div style={{color: 'white', textAlign: 'center'}}>
          <p style={{color: 'white'}}>{trailer.snippet.channelTitle}</p>
          <div style={{maxHeight: '100px'}}>
            <Videos id={trailer.id} />
          </div>
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
      dots: false,
      infinite: true,
      speed: 500,
      slidesToShow: 4,
      slidesToScroll: 4,
      adaptiveHeight: true,
      initialSlide: 0
    };

    return (
      <div className='App'>
        <div style={{textAlign: 'center', color: '#4286f4'}}>
          <h1 className='header'>Details</h1>
        </div>

        <div id='wrapper' style={{display: 'flex', flexDirection: 'row'}}>

          <div id='detailsContainer' style={{display: 'flex'}}>

            <div id='detailsPoster' style={{display: 'flex', flex: 0.33}}>
              {this.state.mediaType === 'person' ?
                <img alt='' src={'https://image.tmdb.org/t/p/w600_and_h900_bestv2' + movie.profile_path}  onClick={this.clickPoster} /> :
                <img alt='' src={'https://image.tmdb.org/t/p/w600_and_h900_bestv2' + movie.poster_path} onClick={this.clickPoster} />
              }
            </div>

            {/* DO THIS FOR MOVIES OR TV SHOWS */}
            {this.state.mediaType !== 'person' ?
              <div className='detailsOverview'>
                <div id='ratingsContainer' style={{display: 'flex'}}>
                  {this.state.mediaType === 'tv' &&
                    // basically check if tv show or movie since tv show uses 'name' and movie uses 'title'
                    <p style={{color: 'white', fontSize: '3vh'}}>{movie.name + ' (' + releaseDate.substring(0,4) + ' - ' + finishDate + ')'}</p>
                  }
                  {this.state.mediaType === 'movie' &&
                    <div>
                      <p style={{color: 'white', fontSize: '3vh'}}>{movie.title + ' (' + releaseDate.substring(0,4) + ')'}</p>
                    </div>
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
                  <div>
                    <p id='description' style={{color: 'white'}}>{movie.overview.substring(0, 300) + '... '}<Button onClick={this.clickDescription}>Read more</Button></p>
                  </div> :
                  <p id='description' style={{color: 'white'}}>{movie.overview}</p>
                }
                

                {/* Conditional rendering for Cast/Reviews */}

                <ButtonToolbar>
                  <ToggleButtonGroup type="radio" name="options" defaultValue={1}>
                    <ToggleButton value={1} variant="secondary" onClick={this.clickCast}>Cast</ToggleButton>
                    <ToggleButton value={2} variant="secondary" onClick={this.clickReviews}>Reviews</ToggleButton>
                    <ToggleButton value={3} variant="secondary" onClick={this.clickTrailers}>Trailers</ToggleButton>
                  </ToggleButtonGroup>
                </ButtonToolbar>

                {this.state.showReviews && 
                  <div style={{width: '100%', padding: 5}}>
                  
                  <div id='slider' style={{margin: 0, padding: 10}}>
                    {resultList.length > 0 &&
                      <Slider {...resultSettings}>
                        {resultList}
                      </Slider>
                      // <Carousel>
                      //   {resultList}
                      // </Carousel>
                    }
                  </div>
                </div>
                }
                {this.state.showCast &&
                  <div style={{width: '100%', padding: 5}}>
                    
                    <div id='slider' style={{margin: 0, padding: 10}}>
                      {cast.length > 0 && this.state.mediaType !== 'person' &&
                        <Slider {...castSettings}>
                          {castList}
                        </Slider>
                      }
                    </div>
                  </div>
                }
                {this.state.showTrailers &&
                  <div style={{width: '100%', padding: 5}}>
                    
                    <div id='slider' style={{margin: 0, padding: 10}}>
                      {cast.length > 0 && this.state.mediaType !== 'person' &&
                        <Slider {...resultSettings}>
                          {trailerList}
                        </Slider>
                      }
                    </div>
                  </div>
                }
              </div>:
              // DO THIS FOR PEOPLE
              <div style={{display: 'flex', flex: 0.67, padding: 40, flexDirection: 'column'}}>
                <div style={{display: 'flex', flexDirection: 'row'}}>
                  <p style={{color: 'white', fontSize: '3vh'}}>{actor.name}</p>
                </div>

                {/* <p style={{color: 'white', fontSize: '2vh'}}>{actor.biography}</p> */}
                {actor.biography !== undefined && actor.biography.length > 300 ?
                  <div>
                    <p id='description' style={{color: 'white'}}>{actor.biography.substring(0, 300) + '... '}<Button onClick={this.clickDescription}>Read more</Button></p>
                    
                  </div> :
                  <p id='description' style={{color: 'white'}}>{actor.biography}</p>
                }

                <div style={{width: '100%', padding: 5}}>
                  <p style={{color: 'white', fontSize: '3vh'}}>Known For</p>
                  <div id='slider' style={{margin: 0, padding: 0}}>
                      <Slider {...castSettings} id='slider'>
                        {creditsList}
                      </Slider>
                  </div>
                </div>
              </div>
            }
            {/* <Slider {...resultSettings}>
              {trailerList}
            </Slider> */}
            {/* Description modal */}
            <Modal
              {...this.props}
              size="lg"
              aria-labelledby="contained-modal-title-vcenter"
              centered
              show={this.state.showDescription}
              onHide={this.clickDescription}
            >
              <Modal.Header closeButton style={{backgroundColor: '#393f4c', color: 'white'}}>
                {this.state.mediaType === 'movie' ?
                  <Modal.Title id="contained-modal-title-vcenter">
                    {this.state.movie.title}
                  </Modal.Title>
                  :
                  <Modal.Title id="contained-modal-title-vcenter">
                    {this.state.movie.name}
                  </Modal.Title>
                }
              </Modal.Header>
              <Modal.Body style={{backgroundColor: '#393f4c', color: 'white'}}>
                {this.state.mediaType === 'person' ?
                  <div>
                    <h4>Biography</h4>
                    <p>{this.state.movie.biography}</p>
                  </div>:
                  <div>
                    <h4>Overview</h4>
                    <p>{this.state.movie.overview}</p>
                  </div>
                }
                
              </Modal.Body>
            </Modal>

            {/* Poster modal */}

            <Modal
              {...this.props}
              size="lg"
              aria-labelledby="contained-modal-title-vcenter"
              centered
              show={this.state.showPoster}
              onHide={this.clickPoster}
            >
              <Modal.Header closeButton style={{backgroundColor: '#393f4c', color: 'white'}}>
              </Modal.Header>
              <Modal.Body style={{backgroundColor: '#393f4c', color: 'white', maxHeight: '90vh'}}>
                {this.state.mediaType === 'person' ?
                  <img style={{maxHeight: '80vh', margin: 'auto'}} src={'https://image.tmdb.org/t/p/w600_and_h900_bestv2' + this.state.movie.profile_path} />:
                  <img style={{maxHeight: '80vh', margin: 'auto'}} src={'https://image.tmdb.org/t/p/w600_and_h900_bestv2' + this.state.movie.poster_path} />
                }
                
              </Modal.Body>
            </Modal>
          </div>
        </div>
      </div>
      
    );
  }
}



export default Details;