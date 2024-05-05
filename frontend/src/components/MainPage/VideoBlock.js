import React from 'react';
import YouTube from 'react-youtube';

function VideoBlock() {
    // Define the video IDs for the YouTube videos
    const videoIds = ['EzTxYQmU8OE', 'EzTxYQmU8OE'];

    // Define the options for the YouTube player
    const opts = {
        height: '300rem',
        width: '100%', // Set the width to 100% for responsiveness
        playerVars: {
            autoplay: 0, // Use 1 to autoplay
        },
    };

    // Render the YouTube component for each video ID
    const renderVideos = () => videoIds.map((id) => (
        <div className="col-12 col-lg-6 videoItem" data-aos="fade-up">
            <YouTube videoId={id} opts={opts} />
        </div>
    ));

    return (
        <div className="container-sm main-page-container-block">
            <h2 className="sub-font" data-aos="fade-up" data-aos-delay="1200">Demo Video</h2>
            <div className="row">
                {renderVideos()}
            </div>
        </div>
    );
}

export default VideoBlock;