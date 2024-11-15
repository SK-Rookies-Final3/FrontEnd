import React, { useState } from 'react';
import '../css/ImageModal.css';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

const ImageModal = ({ showModal, images, initialIndex, onClose }) => {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);

    if (!showModal || images.length === 0) return null;

    const handlePrevClick = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? images.length - 1 : prevIndex - 1
        );
    };

    const handleNextClick = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
    };

    return (
        <div className="image-modal-overlay" onClick={onClose}>
            <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
                {images.length > 1 && (
                    <>
                        <button className="prev-button" onClick={handlePrevClick}>
                            <FaArrowLeft />
                        </button>
                        <button className="next-button" onClick={handleNextClick}>
                            <FaArrowRight />
                        </button>
                    </>
                )}
                <img src={images[currentIndex]} alt={`Review image ${currentIndex + 1}`} className="modal-image" />
                <button className="close-button" onClick={onClose}>X</button>
            </div>
        </div>
    );
};

export default ImageModal;