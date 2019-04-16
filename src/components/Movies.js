import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';
import axios from 'axios';
import Carousel from 'react-bootstrap/Carousel';
const TMDBKey = 'c794333156e1c095f41f92e128c002df';

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

class Movies extends Component {

  constructor(props) {
    super(props);

    this.state = {
      movies: [],
      text: '',
      featuredMovies: [],
      search: this.props.search,
      title: 'Film Focus',
      cast: []
    };
  }

  componentDidMount() {
    var path = this.props.location.pathname.split('/')
    if(path[1].substring(0, 6) === 'search') {
      this.getMovies(decodeURIComponent(path[1].substring(7, path[1].length)))
    }
    else {
      this.getFeaturedMovies()
    }
  }

  componentDidUpdate(prevProps) {
    var path = this.props.location.pathname.split('/')
    // console.log('props: ' + this.props.location.pathname)
    // console.log('prevProps: ' + prevProps.location.pathname)
    if(this.props.location !== prevProps.location) {
      console.log('updating')
      if(path[1].substring(0, 6) === 'search') {
        this.getMovies(decodeURIComponent(path[1].substring(7, path[1].length)))
        this.setState({title: 'Search'})
        // document.getElementById('carousel').style.display('none')
      }
      else {
        this.getFeaturedMovies()
        this.setState({title: 'Featured Movies'})
      }
    }
    else {
      console.log('not updating')
    }
  }

  getFeaturedMovies() {
    axios.get('https://api.themoviedb.org/3/movie/popular?api_key=' + TMDBKey)
      .then((response) => {
        let movies = response.data.results;
 
        this.setState({
          featuredMovies: movies,
          movies: []
        })
      })
  }

  getMovies(searchText) {
    this.setState({title: 'Search'})
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
              movies: movies,
            });
            
          })
      })
      .catch((err) => {
        console.log(err);
    });
  }

  getCast(id) {
    axios.get('https://api.themoviedb.org/3/movie/' + id + '/credits?api_key=' + TMDBKey)
      .then((response) => {
        let cast = response.data.cast;
        // cast.id = id;
        // return cast
        this.setState({cast: cast});
      })
      // return cast
  }

  handleSubmit(event){
    // dont refresh
    event.preventDefault();

    console.log(this.state.text);
    this.getMovies(this.state.text);
  }

  render() {
    let moviePosters = [];

    
    // if(this.state.featuredMovies.length > 0) {
    //   let cast = ''
    //   this.state.featuredMovies.forEach((movie) => {
    //     this.getCast(movie.id)
    //     let castList = this.state.cast.map(person => person.name)
    //   })
    // }
    
    // let cast = []
    // axios.get('https://api.themoviedb.org/3/movie/'+ movieId +'/credits?api_key=' + TMDBKey).then(repsonse => {
    //   cast = repsonse.data.cast
    // })
    // let castList = cast.map((person) => {
    //   return (
    //     <p>{person.name}</p>
    //   )
    // })

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
          // Search results
          <div className="searchResult">
            <Link to={'/details/' + movie.media_type + '/' + movieId + '/' + name.replace('%','percent')} style={{textDecoration: 'none'}} onClick={this.props.setMovie.bind(this, movie)}>
              <img key={poster} src={poster} className="imageResult" alt="poster" />


                { name.length > 50 && 
                    <p className="searchResultTitle">{name.substring(0,50)}...</p> 
                }
    
                { name.length <=50 &&
                  <p className="searchResultTitle">{name}</p>
                }
                {movie.release_date !== undefined &&
                  <div>
                    <p className="searchResultDate">{months[parseInt(movie.release_date.substring(5,7)) - 1] + ' ' + movie.release_date.substring(8) + ', ' + movie.release_date.substring(0,4)}</p>
                  </div>
                }
                <br></br>
                <br></br>
                {/* <p className="searchResultDate">{movie.release_date}</p> <br /> <br /> */}
                <p className="searchResultOverview">{movie.overview}</p>

            </Link>
          </div>
          )
      });
    }
    else {
      moviePosters = this.state.featuredMovies.map(movie => {
        movie.media_type = 'movie';
        let poster = 'https://image.tmdb.org/t/p/w600_and_h900_bestv2' + movie.poster_path;
        let movieId = movie.id;
        let movieTitle = movie.title;
        // console.log(movie);
        return (
          // Featured movies
          <div className="featuredMovieContainer">
            <Link to={'/details/' + movie.media_type + '/' + movieId + '/' + movieTitle} style={{textDecoration: 'none'}} onClick={this.props.setMovie.bind(this, movie)}>
              <img key={poster} src={poster} alt="poster" />

                { movie.title.length > 50 && 
                    <p className="searchResultTitle">{movie.title.substring(0,50)}...</p> 
                }
    
                { movie.title.length <=50 &&
                  <p className="featuredMovieTitle">{movie.title}</p>
                }
                {movie.release_date !== undefined &&
                  <div>
                    <p className="featuredMovieReleaseDate">({months[parseInt(movie.release_date.substring(5,7)) - 1] + ' ' + movie.release_date.substring(8) + ', ' + movie.release_date.substring(0,4)})</p>
                  </div>
                }
                <br></br>
                <br></br>
                <p className="featuredMovieOverview">{movie.overview}</p>
                <p className='featuredMovieOverview'>Credits:</p>
            </Link>
          </div>
        )
      });
    }
    // dynamically generate carousel items based on featured movies list
    var counter = 0
    var featuredCarousel = this.state.featuredMovies.map((movie) => {
      
      counter += 1
      if(counter > 5) {
        return null;
      } 
      else {
        return (
          <Carousel.Item>
            <Link to={'/details/movie/' + movie.id + '/' + movie.title} style={{textDecoration: 'none'}} onClick={this.props.setMovie.bind(this, movie)}>
              <img 
                src={'https://image.tmdb.org/t/p/original/' + movie.backdrop_path }
                className='carouselImage' 
                alt='Movie Poster'
              />
            </Link>
            <Carousel.Caption className='carouselText'>
              <p>{movie.title} <br />
              ({movie.release_date.substring(0,4)})</p>
            </Carousel.Caption>
          </Carousel.Item>
        )
      }
    })

    return (
      <div className='App'>
        <h1 className='header' id='header'>{this.state.title}</h1>

        {this.state.title !== 'Search' && 
          <Carousel className='carouselFeatured' id='carousel'>
            {featuredCarousel}
          </Carousel>
        }
        

        <br></br>
        <div id="wrapper">
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
      </div>
    );
  }
}


export default Movies;