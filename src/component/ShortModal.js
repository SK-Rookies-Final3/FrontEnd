import React, { useState } from 'react';
import './css/ShortModal.css';

function ShortModal({ showModal, videoSrc, onClose }) {
    
    const [videoSize, setVideoSize] = useState({
        width: 360,
        height: 640
    });

    if (!showModal) {
        return null;
    }

    const onZoom = () => {
        setVideoSize({
            width: 540,
            height: 960
        });
    };

    // When closing the modal, reset the video size to default
    const handleClose = () => {
        setVideoSize({
            width: 360,
            height: 640
        });
        onClose(); // Call the parent component's onClose function
    };

    return (
        <div className="modal-overlay" onClick={handleClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="zoom-button" onClick={onZoom}>✚</button>
                <button className="close-button" onClick={handleClose}>X</button>
                <div className="video-container">
                    <iframe
                        className="shorts-video"
                        src={videoSrc}
                        title="Shorts player"
                        width={videoSize.width}
                        height={videoSize.height}
                    ></iframe>
                </div>
            </div>
        </div>
    );
}

export default ShortModal;