import React, { Component } from 'react';

export default class About extends Component {

  componentDidUpdate(prevProps) {
    var path = this.props.location.pathname.split('/')
    if(path[1].substring(0, 6) === 'search' && prevProps.location !== this.props.location) {
      this.props.setSearch.bind(this, decodeURIComponent(path[1].substring(7, path[1].length)))
    }
  }

  render() {
    return (
      <div className='App'>
        <h1 className='header' id='header'>About</h1>
        <br></br>
        <p style={{color: 'white', fontSize: '2vh', textAlign: 'center'}}>Thanks to <a href='https://www.themoviedb.org/' target="_blank">The Movie DB</a></p>
        <p style={{color: 'white', fontSize: '2vh', textAlign: 'center'}}>[Description of the site]</p>
      </div>
    );
  }
}