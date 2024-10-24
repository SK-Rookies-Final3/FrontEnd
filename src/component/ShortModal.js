import React from 'react';
import './css/ShortModal.css';

function ShortModal({ showModal, videoSrc, onClose }) {
    if (!showModal) {
        return null;
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="close-button" onClick={onClose}>X</button>
                <div className="video-container">
                    <iframe
                        className="shorts-video"
                        src={videoSrc}
                        title="Shorts player"
                        width="540"
                        height="960"
                    ></iframe>
                </div>
            </div>
        </div>
    );
}

export default ShortModal;