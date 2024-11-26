import React, { useState, useEffect } from 'react';
import ShortModal from '../ShortModal';
import ImageModal from './ImageModal';
import Swal from 'sweetalert2';
import StarRatings from 'react-star-ratings';
import { FaTrash, FaShoppingCart, FaBox, FaHeart, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import '../css/Shop_Detail.css';
import product from '../../img/product.jpg';
import product_d from '../../img/product-d.jpg';
import short from '../../img/shorts.png';
import { useParams } from "react-router-dom";

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
    const [images, setImages] = useState([]);
    const [fileKey, setFileKey] = useState(Date.now());
    const [fileNames, setFileNames] = useState([]);
    const [nickname, setNickname] = useState('');
    const { productCode } = useParams();

    // ImageModal 상태 관리
    const [showImageModal, setShowImageModal] = useState(false);
    const [selectedImages, setSelectedImages] = useState([]);
    const [initialImageIndex, setInitialImageIndex] = useState(0);
    
    // Size 관련 상태
    const [isSizeActive, setIsSizeActive] = useState(false);
    const [selectedSize, setSelectedSize] = useState("Choose a size");

    // Color 관련 상태
    const [isColorActive, setIsColorActive] = useState(false);
    const [selectedColor, setSelectedColor] = useState("Choose a color");

    // 수량 관련 상태
    const [isAmountActive, setIsAmountActive] = useState(false);
    const [selectedAmount, setSelectedAmount] = useState("Choose a amount");

    // 별점 평균 계산 함수
    const calculateAverageRating = () => {
        if (reviews.length === 0) return 0;
        const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
        return (totalRating / reviews.length).toFixed(1);
    };

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                console.log("Fetching reviews for productCode:", productCode); 
                const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/open-api/brand/review/${productCode}`);
                
                if (!response.ok) {
                    throw new Error(`Failed to fetch reviews: ${response.status}`);
                }
                
                const data = await response.json();
                
                console.log("Fetched reviews successfully:", data); 
                setReviews(data);
            } catch (error) {
                console.error("Error fetching reviews:", error); 
            }
        };
        fetchReviews(); 
    }, [productCode]); 
    


    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            fetch(`${process.env.REACT_APP_API_BASE_URL}/api/user`, {
                headers: {
                    Authorization: `${accessToken}`,
                },
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data && data.body) {
                        setNickname(data.body.nickname);
                    }
                })
                .catch((error) => console.log("닉네임을 가져오는 중 오류가 발생했습니다.", error));
        }
    }, []);

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
        setIsAmountActive(false);
    };

    const handleSizeOptionClick = (size) => {
        setSelectedSize(size);
        setIsSizeActive(false);
    };

    const handleColorSelectClick = () => {
        setIsColorActive(!isColorActive);
        setIsSizeActive(false);
        setIsAmountActive(false);
    };

    const handleColorOptionClick = (color) => {
        setSelectedColor(color);
        setIsColorActive(false);
    };

    const handleAmountSelectClick = () => {
        setIsAmountActive(!isAmountActive);
        setIsColorActive(false);
        setIsSizeActive(false);
    };

    const handleAmountOptionClick = (amount) => {
        setSelectedAmount(amount);
        setIsAmountActive(false);
    };

    const addWish = () => {
        setWishlistClicked(true);
        setTimeout(() => setWishlistClicked(false), 1500);
    };

    const addCart = () => {
        if (selectedSize === "Choose a size" || selectedColor === "Choose a color" || selectedAmount === "Choose a amount") {
            Swal.fire({
                title: '선택사항을 모두 선택해주세요!',
                text: '상품을 장바구니에 추가하려면 모든 선택사항을 선택해야 합니다.',
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

    const handleImageUpload = (e) => {
        const selectedFiles = Array.from(e.target.files);

        if (selectedFiles.length > 3) {
            Swal.fire({
                title: '최대 3개까지 업로드 가능합니다.',
                text: '이미지를 업로드하려면 일부를 제거해주세요.',
                icon: 'warning',
                confirmButtonText: '확인',
                confirmButtonColor: '#754F23',
                background: '#F0EADC',
                color: '#754F23',
            });
            e.target.value = "";
            return;
        }

        const imageUrls = selectedFiles.map((file) => URL.createObjectURL(file));
        setImages(imageUrls);
        setFileNames(selectedFiles.map(file => file.name));
    };

    const handleImageNavigation = (reviewId, direction) => {
        setReviews((prevReviews) =>
            prevReviews.map((review) =>
                review.id === reviewId
                    ? {
                        ...review,
                        currentImageIndex:
                            direction === 'next'
                                ? (review.currentImageIndex + 1) % review.images.length
                                : (review.currentImageIndex - 1 + review.images.length) % review.images.length,
                    }
                    : review
            )
        );
    };

    const handleSubmitReview = async () => {
        const accessToken = localStorage.getItem("accessToken");
    
        if (!accessToken) {
            Swal.fire({
                title: "회원만 리뷰 작성 가능합니다",
                confirmButtonText: "확인",
                confirmButtonColor: "#754F23",
                background: "#F0EADC",
                color: "#754F23",
                icon: "warning",
                iconColor: "#DBC797",
            });
            return;
        }
    
        if (!(rating > 0 && description)) {
            Swal.fire({
                title: "필드를 작성해주세요!",
                text: "별점, 설명을 입력해 주세요.",
                confirmButtonText: "확인",
                confirmButtonColor: "#754F23",
                background: "#F0EADC",
                color: "#754F23",
                icon: "warning",
                iconColor: "#DBC797",
            });
            return;
        }
    
        const newReview = {
            rating,
            height: height || null,
            weight: weight || null,
            description,
            images, 
        };
    
        try {
            console.log("Submitting review data:", newReview); 
            console.log("Product Code from useParams:", productCode);
            const response = await fetch(
                `${process.env.REACT_APP_API_BASE_URL}/api/brand/review/${productCode}?userId=${nickname}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: accessToken,
                    },
                    body: JSON.stringify(newReview),
                }
            );
    
            if (!response.ok) {
                throw new Error("리뷰 작성에 실패했습니다.");
            }
    
            const createdReview = await response.json();
            console.log("Review submitted successfully:", createdReview); 
    
            setReviews((prevReviews) => [...prevReviews, createdReview]);
            setRating(0);
            setHeight("");
            setWeight("");
            setDescription("");
            setRatingKey(Date.now());
            setImages([]);
            setFileKey(Date.now());
            setFileNames([]);
        } catch (error) {
            console.error("리뷰 작성 중 오류:", error); 
        }
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

    // review-image 클릭 시 ImageModal 표시
    const handleImageClick = (images, index) => {
        setSelectedImages(images);
        setInitialImageIndex(index);
        setShowImageModal(true);
    };

    // ImageModal 닫기
    const handleCloseImageModal = () => {
        setShowImageModal(false);
        setSelectedImages([]);
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
                                    <div className="file-input-container">
                                        <div className="file-names">
                                            {fileNames.length > 0
                                                ? fileNames.length > 1
                                                    ? `${fileNames.length}개의 파일 선택됨`
                                                    : fileNames[0]
                                                : "선택된 파일 없음"}
                                        </div>
                                        <label className="file-input-label">
                                            <input
                                                key={fileKey}
                                                type="file"
                                                accept="image/*"
                                                multiple
                                                onChange={handleImageUpload}
                                            />
                                            이미지 첨부
                                        </label>
                                    </div>
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
                                    {review.images.length > 0 && (
                                        <div className="review-images">
                                            <img
                                                src={review.images[review.currentImageIndex]}
                                                alt={`Review image ${review.currentImageIndex + 1}`}
                                                className="review-image"
                                                onClick={() => handleImageClick(review.images, review.currentImageIndex)}
                                            />
                                            {review.images.length > 1 && (
                                                <div className="image-navigation">
                                                    <button onClick={() => handleImageNavigation(review.id, 'prev')}><FaArrowLeft /></button>
                                                    <button onClick={() => handleImageNavigation(review.id, 'next')}><FaArrowRight /></button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    <div className="review-content">
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
                                            <span>ID: {review.userId} / {review.date}</span>
                                            {review.userId === nickname && (
                                                <button className="delete-button" onClick={() => handleDeleteReview(review.id)}>
                                                    <FaTrash />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <ImageModal
                            showModal={showImageModal}
                            images={selectedImages}
                            initialIndex={initialImageIndex}
                            onClose={handleCloseImageModal}
                        />
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

                {/* 수량 선택 드롭다운 */}
                <div className={`form-select-container ${isAmountActive ? "active" : ""}`}>
                    <div className="form-select" onClick={handleAmountSelectClick}>
                        <div className="form-option-placeholder">
                            {selectedAmount}
                        </div>
                    </div>
                    {isAmountActive && (
                        <div className="form-option-wrapper">
                            <div className="form-option-container">
                                {["1", "2", "3"].map((item) => (
                                    <div
                                        key={item}
                                        className={`form-option ${selectedAmount === item ? "active" : ""}`}
                                        onClick={() => handleAmountOptionClick(item)}
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