import React, { useState, useEffect } from 'react';
import ShortModal from '../ShortModal';
import Swal from 'sweetalert2';
import StarRatings from 'react-star-ratings';
import { FaTrash, FaShoppingCart, FaBox, FaHeart } from 'react-icons/fa';
import '../css/Shop_Detail.css';
import product from '../../img/product.jpg';
import product_d from '../../img/product-d.jpg';
import short from '../../img/shorts.png';

const ShopDetail = () => {
    const [activeTab, setActiveTab] = useState('광고');
    const [showModal, setShowModal] = useState(false);
    const [videoSrc, setVideoSrc] = useState('');
    const [reviews, setReviews] = useState([]);
    const [rating, setRating] = useState(0);
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [description, setDescription] = useState('');
    const [ratingKey, setRatingKey] = useState(Date.now());
    const [averageRating, setAverageRating] = useState(0);
    const [wishlistClicked, setWishlistClicked] = useState(false);
    const [cartClicked, setCartClicked] = useState(false);

    // Size 관련 상태
    const [isSizeActive, setIsSizeActive] = useState(false);
    const [selectedSize, setSelectedSize] = useState("Choose a size");

    // Color 관련 상태
    const [isColorActive, setIsColorActive] = useState(false);
    const [selectedColor, setSelectedColor] = useState("Choose a color");

    // 별점 평균 계산 함수
    const calculateAverageRating = () => {
        if (reviews.length === 0) return 0;
        const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
        return (totalRating / reviews.length).toFixed(1);
    };

    // 리뷰가 업데이트될 때마다 평균 별점 재계산
    useEffect(() => {
        setAverageRating(calculateAverageRating());
    }, [reviews]);

    const handleVideoClick = (url) => {
        setVideoSrc(url);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setVideoSrc('');
    };

    const handleSizeSelectClick = () => {
        setIsSizeActive(!isSizeActive);
        setIsColorActive(false);
    };

    const handleSizeOptionClick = (size) => {
        setSelectedSize(size);
        setIsSizeActive(false);
    };

    const handleColorSelectClick = () => {
        setIsColorActive(!isColorActive);
        setIsSizeActive(false);
    };

    const handleColorOptionClick = (color) => {
        setSelectedColor(color);
        setIsColorActive(false);
    };

    const addWish = () => {
        setWishlistClicked(true);
        setTimeout(() => setWishlistClicked(false), 1500);
    };

    const addCart = () => {
        if (selectedSize === "Choose a size" || selectedColor === "Choose a color") {
            Swal.fire({
                title: '사이즈와 색상을 모두 선택해주세요!',
                text: '상품을 장바구니에 추가하려면 사이즈와 색상을 선택해야 합니다.',
                icon: 'warning',
                confirmButtonText: '확인',
                confirmButtonColor: '#754F23',
                background: '#F0EADC',
                color: '#754F23',
            });
            return;
        }

        setCartClicked(true);
        setTimeout(() => setCartClicked(false), 2000);
    };

    const handleSubmitReview = () => {
        const accessToken = localStorage.getItem('accessToken');

        if (!accessToken) {
            Swal.fire({
                title: '회원만 리뷰 작성 가능합니다',
                confirmButtonText: '확인',
                confirmButtonColor: '#754F23',
                background: '#F0EADC',
                color: '#754F23',
                icon: 'warning',
                iconColor: '#DBC797',
            });
            return;
        }

        if (!(rating > 0 && description)) {
            Swal.fire({
                title: '필드를 작성해주세요!',
                text: '별점, 설명을 입력해 주세요.',
                confirmButtonText: '확인',
                confirmButtonColor: '#754F23',
                background: '#F0EADC',
                color: '#754F23',
                icon: 'warning',
                iconColor: '#DBC797',
            });
            return;
        }

        const newReview = {
            id: Date.now(),
            rating,
            height: height || '미공개 ',
            weight: weight || '미공개 ',
            description,
            userId: 'username',
            date: new Date().toISOString().slice(0, 10),
        };

        setReviews([...reviews, newReview]);

        setRating(0);
        setHeight('');
        setWeight('');
        setDescription('');
        setRatingKey(Date.now());
    };

    const handleDeleteReview = (reviewId) => {
        Swal.fire({
            icon: 'warning',
            title: '정말 삭제하시겠습니까?',
            showCancelButton: true,
            confirmButtonText: '삭제',
            cancelButtonText: '취소',
            confirmButtonColor: '#754F23',
            background: '#F0EADC',
            color: '#754F23',
            iconColor: '#DBC797',
        }).then((result) => {
            if (result.isConfirmed) {
                const updatedReviews = reviews.map((review) =>
                    review.id === reviewId ? { ...review, isDeleting: true } : review
                );
                setReviews(updatedReviews);

                setTimeout(() => {
                    setReviews(reviews.filter((review) => review.id !== reviewId));
                }, 1000);
            }
        });
    };

    const renderContent = () => {
        switch (activeTab) {
            case '광고':
                return (
                    <div>
                        <div className="video-gallery">
                            {[1, 2, 3, 4, 5, 6].map((video, index) => (
                                <div key={index} className="video-item" onClick={() => handleVideoClick('https://www.youtube.com/embed/khHcpvsUdK8')}>
                                    <img src={short} alt={`Reel ${index + 1}`} />
                                </div>
                            ))}
                        </div>
                        <ShortModal showModal={showModal} videoSrc={videoSrc} onClose={handleCloseModal} />
                    </div>
                );
            case '상세정보':
                return (
                    <div>
                        <div className="detail">
                            <div>어쩌고</div>
                            <img src={product_d} alt="Product-d" />
                        </div>
                    </div>
                );
            case '상품리뷰':
                return (
                    <div>
                        <div className="review-form">
                            <div className="review-header">
                                <div className="rating-input">
                                    <StarRatings
                                        key={ratingKey}
                                        rating={rating}
                                        starRatedColor="gold"
                                        starHoverColor="gold"
                                        changeRating={(newRating) => setRating(newRating)}
                                        numberOfStars={5}
                                        name="rating"
                                        starDimension="30px"
                                        starSpacing="5px"
                                    />
                                </div>
                                <div className="user-info">
                                    <input
                                        type="number"
                                        placeholder="키"
                                        value={height}
                                        onChange={(e) => setHeight(e.target.value)}
                                        onInput={(e) => e.target.value = e.target.value.replace(/\D/g, '')}
                                    />
                                    <input
                                        type="number"
                                        placeholder="몸무게"
                                        value={weight}
                                        onChange={(e) => setWeight(e.target.value)}
                                        onInput={(e) => e.target.value = e.target.value.replace(/\D/g, '')}
                                    />
                                </div>
                            </div>
                            <div className="description-input">
                                <textarea
                                    placeholder="설명"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>
                            <div className="submit-button">
                                <button onClick={handleSubmitReview}>
                                    리뷰 작성
                                </button>
                            </div>
                        </div>

                        <div className="review-list">
                            {reviews.map((review) => (
                                <div key={review.id} className={`review-item ${review.isDeleting ? 'fade-out' : ''}`}>
                                    <div className="review-top">
                                        <StarRatings
                                            rating={review.rating}
                                            starRatedColor="gold"
                                            numberOfStars={5}
                                            starDimension="20px"
                                            starSpacing="3px"
                                            name="review-rating"
                                        />
                                    </div>
                                    <div className="review-middle">
                                        <span>{review.height} cm / {review.weight} kg</span>
                                    </div>
                                    <div className="review-description">
                                        <p>{review.description}</p>
                                    </div>
                                    <div className="review-bottom">
                                        <div>
                                            <span>ID: {review.userId} / {review.date}</span>
                                        </div>
                                        {review.userId === 'username' && (
                                            <button className="delete-button" onClick={() => handleDeleteReview(review.id)}>
                                                <FaTrash />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    const Tab = ({ label }) => {
        return (
            <button
                className={activeTab === label ? 'active' : ''}
                onClick={() => setActiveTab(label)}
            >
                {label}
            </button>
        );
    };

    return (
        <div className="shop-detail">
            <div className="product-images">
                <div className='product-image-ani'>
                    <img src={product} alt="Product 1" />
                </div>
                <div className='product-image-ani'>
                    <img src={product} alt="Product 1" />
                </div>
                <div className='product-image-ani'>
                    <img src={product} alt="Product 1" />
                </div>
                {/* <img src={product} alt="Product 1" />
                <img src={product} alt="Product 2" />
                <img src={product} alt="Product 3" /> */}
            </div>

            <div className="product-info">
                <div className="rating">
                    {averageRating}{' '}
                    <StarRatings
                        rating={parseFloat(averageRating)}
                        starRatedColor="gold"
                        numberOfStars={5}
                        starDimension="24px"
                        starSpacing="3px"
                        name="average-rating"
                    />
                </div>

                <div className="price">
                    KRW 216,000
                </div>
            </div>

            {/* Size 선택 드롭다운 */}
            <div className="form-selects-container">
                <div className={`form-select-container ${isSizeActive ? "active" : ""}`}>
                    <div className="form-select" onClick={handleSizeSelectClick}>
                        <div className="form-option-placeholder">
                            {selectedSize}
                        </div>
                    </div>
                    {isSizeActive && (
                        <div className="form-option-wrapper">
                            <div className="form-option-container">
                                {["size 1", "size 2", "size 3"].map((item) => (
                                    <div
                                        key={item}
                                        className={`form-option ${selectedSize === item ? "active" : ""}`}
                                        onClick={() => handleSizeOptionClick(item)}
                                    >
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Color 선택 드롭다운 */}
                <div className={`form-select-container ${isColorActive ? "active" : ""}`}>
                    <div className="form-select" onClick={handleColorSelectClick}>
                        <div className="form-option-placeholder">
                            {selectedColor}
                        </div>
                    </div>
                    {isColorActive && (
                        <div className="form-option-wrapper">
                            <div className="form-option-container">
                                {["color 1", "color 2", "color 3"].map((item) => (
                                    <div
                                        key={item}
                                        className={`form-option ${selectedColor === item ? "active" : ""}`}
                                        onClick={() => handleColorOptionClick(item)}
                                    >
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="wishlist-cart-container">
                <button
                    className={`wishlist-button ${wishlistClicked ? 'clicked' : ''}`}
                    onClick={addWish}>
                    <span className="add-to-wishlist">Add to Wishlist</span>
                    <span className="added">Added</span>
                    <FaHeart className="fa-heart" />
                </button>

                <button
                    className={`cart-button ${cartClicked ? 'clicked' : ''}`}
                    onClick={addCart}>
                    <span className="add-to-cart">Add to cart</span>
                    <span className="added">Added</span>
                    <FaShoppingCart className="shopping-cart" />
                    <FaBox className="fa-box" />
                </button>
            </div>

            <div className="tabs">
                <Tab label="광고" />
                <Tab label="상세정보" />
                <Tab label="상품리뷰" />
            </div>

            <div className="tab-content">
                {renderContent()}
            </div>
        </div>
    );
};

export default ShopDetail;