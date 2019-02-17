import React from 'react';
import YouTube from 'react-youtube';

class Videos extends React.Component {

    render() {
        const opts = {
            height: '390',
            width: '640',
            playerVars: {
                autoplay: 0
            }
        };

        return (
            <YouTube
            videoId="DTHTjgSuJ4M"
            opts={opts}
            onReady={this.onReady}
            />
        );

    }
    _onReady(event) {
        // access to player in all event handlers via event.target
        event.target.pauseVideo();
      }

}
export default Videos;