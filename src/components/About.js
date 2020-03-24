import React, { Component } from "react";

export default class About extends Component {
  componentDidUpdate(prevProps) {
    var path = this.props.location.pathname.split("/");
    if (
      path[1].substring(0, 6) === "search" &&
      prevProps.location !== this.props.location
    ) {
      this.props.setSearch.bind(
        this,
        decodeURIComponent(path[1].substring(7, path[1].length))
      );
    }
  }

  render() {
    return (
      <div className="App">
        <h1 className="header" id="header">
          About
        </h1>
        <br></br>
        <p style={{ color: "white", fontSize: "2vh", textAlign: "center" }}>
          Thanks to{" "}
          <a href="https://www.themoviedb.org/" target="_blank">
            The Movie DB
          </a>
        </p>
        <p style={{ color: "white", fontSize: "2vh", textAlign: "center" }}>
          This website aims to correct some of the flaws of current movie
          databases, while introducing some features that we feel are lacking in
          the current options. We hope it appeals to most movie- goers,
          especially avid movie fans and people who frequently search for
          information about movies – providing relevant information in an
          easy-to-read format.
        </p>
      </div>
    );
  }
}
