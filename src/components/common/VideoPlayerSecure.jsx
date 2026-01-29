
import React, { useRef } from 'react';

/**
 * Secure Video Player
 * Standard video player with download controls disabled.
 */
const VideoPlayerSecure = ({ url, poster }) => {
    const videoRef = useRef(null);

    const handleContextMenu = (e) => {
        e.preventDefault();
        return false;
    };

    return (
        <div
            style={{
                width: '100%',
                aspectRatio: '16/9',
                background: '#000',
                borderRadius: '8px',
                overflow: 'hidden',
                position: 'relative'
            }}
            onContextMenu={handleContextMenu}
        >
            <video
                ref={videoRef}
                src={url}
                poster={poster}
                controls
                controlsList="nodownload"
                style={{ width: '100%', height: '100%' }}
                playsInline
            >
                Your browser does not support the video tag.
            </video>
        </div>
    );
};

export default VideoPlayerSecure;
