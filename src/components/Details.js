import React, { Component } from 'react';
// import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
// import axios from 'axios';

// const APIKey = 'a6793cf9';
// const TMDBKey = 'c794333156e1c095f41f92e128c002df';

class Details extends Component {
  render() {
    return (
      <div className='App'>
        <div className='App-header'>
          <h1 style={styles.main}>Details</h1>
          <p>movie</p>
        </div>
      </div>
    );
  }
}

const styles = {
  main: {
    color: '#4286f4'
  }
}

export default Details;