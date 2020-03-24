import React from "react";
import YouTube from "react-youtube";

class Videos extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.id
    };
  }

  render() {
    const opts = {
      height: "300",
      width: "90%",
      playerVars: {
        autoplay: 0
      }
    };

    return (
      <YouTube videoId={this.state.id} opts={opts} onReady={this.onReady} />
    );
  }
  _onReady(event) {
    // access to player in all event handlers via event.target
    event.target.pauseVideo();
  }
}
export default Videos;
