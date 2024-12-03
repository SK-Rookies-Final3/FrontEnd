import React, { useState, useEffect } from 'react';
import ShortModal from '../ShortModal';
import ImageModal from './ImageModal';
import Swal from 'sweetalert2';
import StarRatings from 'react-star-ratings';
import { FaTrash, FaShoppingCart, FaBox, FaHeart, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import '../css/Shop_Detail.css';
import short from '../../img/shorts.png';
import { useParams } from "react-router-dom";
import axios from 'axios';

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
    const [wishlistItems, setWishlistItems] = useState([]);
    const [cartClicked, setCartClicked] = useState(false);
    const [images, setImages] = useState([]);
    const [fileKey, setFileKey] = useState(Date.now());
    const [fileNames, setFileNames] = useState([]);
    const [username, setUsername] = useState('');
    const [likedShorts, setLikedShorts] = useState([]);
    const { productCode } = useParams();
    const [product, setProduct] = useState(null);

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

    const fetchReviews = async () => {
        try {

            // 리뷰 API 호출
            const response = await axios.get(
                `${process.env.REACT_APP_API_BASE_URL_APIgateway}/open-api/brand/review/${productCode}`
            );

            // 응답 데이터 확인
            if (response.status === 204 || response.data.length === 0) {
                Swal.fire({
                    title: "리뷰 없음",
                    text: "이 상품에 대한 리뷰가 아직 없습니다.",
                    icon: "info",
                });
                setReviews([]); // 빈 배열 설정
                return;
            }

            const mappedReviews = response.data.map((review) => ({
                ...review,
                reviewId: review.reviewCode,
            }));

            // 리뷰 데이터를 상태로 설정
            setReviews(mappedReviews);

        } catch (error) {
            console.error("Error fetching reviews:", error);
            Swal.fire({
                title: "오류 발생",
                text: "리뷰를 가져오는 중 문제가 발생했습니다.",
                icon: "error",
            });
        }
    };

    // 별점 평균 계산 함수
    const calculateAverageRating = () => {
        if (!Array.isArray(reviews) || reviews.length === 0) {
            console.log("Reviews 배열이 비어 있거나 배열이 아님:", reviews);
            return 0;
        }
    
        // review.starRating을 기준으로 평균 계산
        const totalRating = reviews.reduce((acc, review) => {
            const rating = review.starRating || 0; 
            return acc + rating;
        }, 0);
    
        const average = totalRating / reviews.length;
        return average.toFixed(1);
    };

    const handleWishlistToggle = () => {
        setWishlistClicked(true);
        if (wishlistItems.includes(productCode)) {
            setWishlistItems(wishlistItems.filter(code => code !== productCode));
        } else {
            setWishlistItems([...wishlistItems, productCode]);
        }
        setTimeout(() => {
            setWishlistClicked(false);
        }, 600); 
    };

    const handleLikeClick = (shortCode, event) => {
        event.stopPropagation();
        setLikedShorts((prevLikedShorts) => {
            if (prevLikedShorts.includes(shortCode)) {
                return prevLikedShorts.filter((code) => code !== shortCode);
            } else {
                return [...prevLikedShorts, shortCode];
            }
        });
    };

    useEffect(() => {
        const fetchUsername = async () => {
            const accessToken = sessionStorage.getItem("accessToken");

            if (!accessToken) {
                console.error("Access token is missing.");
                return;
            }

            try {
                const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/user`, {
                    headers: {
                        Authorization: `${accessToken}`
                    }
                });

                if (response.data && response.data.body) {
                    setUsername(response.data.body.username); // API에서 username 가져오기
                } else {
                    console.error("Failed to fetch username: No data found in response.");
                }
            } catch (error) {
                console.error("Error fetching username:", error);
            }
        };

        fetchUsername();
    }, []);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                const response = await fetch(
                    `${process.env.REACT_APP_API_BASE_URL_APIgateway}/open-api/brand/product/${productCode}`
                );
                if (!response.ok) {
                    throw new Error(`Failed to fetch product details: ${response.status}`);
                }
                const data = await response.json();

                setProduct(data);
            } catch (error) {
                console.error('Error fetching product details:', error);
            }
        };
        fetchProductDetails();
    }, [productCode]);

    useEffect(() => {
    }, [product]);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
    
                // 리뷰 API 호출
                const response = await axios.get(
                    `${process.env.REACT_APP_API_BASE_URL_APIgateway}/open-api/brand/review/${productCode}`
                );
    
                // 응답 데이터 확인
                if (response.status === 204 || response.data.length === 0) {
                    Swal.fire({
                        title: "리뷰 없음",
                        text: "이 상품에 대한 리뷰가 아직 없습니다.",
                        icon: "info",
                    });
                    setReviews([]); // 빈 배열 설정
                    return;
                }

                const mappedReviews = response.data.map((review) => ({
                    ...review,
                    reviewId: review.reviewCode,
                }));
    
                // 리뷰 데이터를 상태로 설정
                setReviews(mappedReviews);

            } catch (error) {
                console.error("Error fetching reviews:", error);
                Swal.fire({
                    title: "오류 발생",
                    text: "리뷰를 가져오는 중 문제가 발생했습니다.",
                    icon: "error",
                });
            }
        };
    
        fetchReviews();
    }, [productCode]);
    

    useEffect(() => {
        setAverageRating(() => {
            try {
                const avg = calculateAverageRating();
                return avg;
            } catch (error) {
                console.error("평균 별점 계산 중 오류 발생:", error);
                return 0;
            }
        });
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

    // const addWish = () => {
    //     setIsProductWish(!isProductWish);
    //     setWishlistClicked(true);
    //     setTimeout(() => setWishlistClicked(false), 1500);
    // };

    // const addCart = async () => {
    //     if (selectedSize === "Choose a size" || selectedColor === "Choose a color" || selectedAmount === "Choose a amount") {
    //         Swal.fire({
    //             title: '선택사항을 모두 선택해주세요!',
    //             text: '상품을 장바구니에 추가하려면 모든 선택사항을 선택해야 합니다.',
    //             icon: 'warning',
    //             confirmButtonText: '확인',
    //             confirmButtonColor: '#754F23',
    //             background: '#F0EADC',
    //             color: '#754F23',
    //         });
    //         return;
    //     }

    //     const accessToken = sessionStorage.getItem("accessToken");
    //     if (!accessToken) {
    //         Swal.fire({
    //             title: "로그인이 필요합니다",
    //             text: "장바구니에 추가하려면 로그인이 필요합니다.",
    //             icon: "warning",
    //             confirmButtonText: "확인",
    //             confirmButtonColor: "#754F23",
    //             background: "#F0EADC",
    //             color: "#754F23",
    //         });
    //         return;
    //     }

    //     if (!product) {
    //         Swal.fire({
    //             title: "상품 정보가 로드되지 않았습니다",
    //             text: "잠시 후 다시 시도해주세요.",
    //             icon: "error",
    //             confirmButtonText: "확인",
    //             confirmButtonColor: "#754F23",
    //             background: "#F0EADC",
    //             color: "#754F23",
    //         });
    //         return;
    //     }

    //     // 요청 데이터 구성
    //     const requestData = {
    //         productCode: productCode,
    //         productName: product.name,
    //         price: product.price,
    //         quantity: selectedAmount,
    //         color: selectedColor,
    //         size: selectedSize,
    //         thumbnail: product.thumbnail[0]
    //     };

    //     console.log("Cart Request Data:", requestData);

    //     try {
    //         const response = await axios.post(
    //             `${process.env.REACT_APP_API_BASE_URL_APIgateway}/api/cart/items`,
    //             requestData,
    //             {
    //                 headers: {
    //                     Authorization: accessToken,
    //                     "Content-Type": "application/json",
    //                 },
    //             }
    //         );

    //         console.log("Cart Response:", response.data);

    //         Swal.fire({
    //             title: "장바구니에 추가되었습니다!",
    //             icon: "success",
    //             confirmButtonText: "확인",
    //             confirmButtonColor: "#754F23",
    //             background: "#F0EADC",
    //             color: "#754F23",
    //         });

    //         setCartClicked(true);
    //         setTimeout(() => setCartClicked(false), 2000);
    //     } catch (error) {
    //         console.error("장바구니 추가 오류:", error);
    //         Swal.fire({
    //             title: "장바구니 추가 실패",
    //             text: error.response?.data?.message || "장바구니에 추가하는 중 오류가 발생했습니다.",
    //             icon: "error",
    //             confirmButtonText: "확인",
    //             confirmButtonColor: "#754F23",
    //             background: "#F0EADC",
    //             color: "#754F23",
    //         });
    //     }
    // };

    const addCart = async () => {
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

        const accessToken = sessionStorage.getItem("accessToken");
        if (!accessToken) {
            Swal.fire({
                title: "로그인이 필요합니다",
                text: "장바구니에 추가하려면 로그인이 필요합니다.",
                icon: "warning",
                confirmButtonText: "확인",
                confirmButtonColor: "#754F23",
                background: "#F0EADC",
                color: "#754F23",
            });
            return;
        }

        if (!product) {
            Swal.fire({
                title: "상품 정보가 로드되지 않았습니다",
                text: "잠시 후 다시 시도해주세요.",
                icon: "error",
                confirmButtonText: "확인",
                confirmButtonColor: "#754F23",
                background: "#F0EADC",
                color: "#754F23",
            });
            return;
        }

        // 요청 데이터 구성
        const sizeField = !isNaN(Number(selectedSize))
            ? { shoesSize: selectedSize }
            : { clothesSize: selectedSize };

        const requestData = {
            orderItemList: [
                {
                    productCode: productCode,
                    amount: parseInt(selectedAmount, 10),
                    color: selectedColor,
                    ...sizeField,
                    name: product.name,
                    thumbnail: product.thumbnail[0],
                    price: product.price,
                }
            ]
        };


        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_BASE_URL_APIgateway}/api/order`,
                requestData,
                {
                    headers: {
                        Authorization: accessToken,
                        "Content-Type": "application/json",
                    },
                }
            );

            console.log("Cart Response:", response.data);

            Swal.fire({
                title: "주문이 완료되었습니다!",
                icon: "success",
                confirmButtonText: "확인",
                confirmButtonColor: "#754F23",
                background: "#F0EADC",
                color: "#754F23",
            });

            setCartClicked(true);
            setTimeout(() => setCartClicked(false), 2000);
        } catch (error) {
            console.error("주문 오류:", error);
            Swal.fire({
                title: "주문 오류",
                text: error.response?.data?.message || "주문 오류",
                icon: "error",
                confirmButtonText: "확인",
                confirmButtonColor: "#754F23",
                background: "#F0EADC",
                color: "#754F23",
            });
        }
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

    useEffect(() => {
        const fetchUsername = async () => {
            const accessToken = sessionStorage.getItem("accessToken");
    
            if (!accessToken) {
                console.error("Access token is missing.");
                return;
            }
    
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/user`, {
                    headers: {
                        Authorization: `${accessToken}`
                    }
                });
    
                if (response.data && response.data.body) {
                    setUsername(response.data.body.username); // API에서 username 가져오기
                } else {
                    console.error("Failed to fetch username: No data found in response.");
                }
            } catch (error) {
                console.error("Error fetching username:", error);
            }
        };
    
        fetchUsername();
    }, []);

    const handleSubmitReview = async () => {
        const accessToken = sessionStorage.getItem("accessToken");
        const id = sessionStorage.getItem("id");
    
        if (!accessToken || !id || !username) {
            Swal.fire({
                title: "로그인 정보가 없습니다.",
                text: "다시 로그인해주세요.",
                icon: "error",
            });
            return;
        }
    
        const newReview = {
            starRating: rating,
            height: height || null,
            weight: weight || null,
            content: description,
            color: product.color,
            size: product.category === "신발" ? product.shoesSize : product.clothesSize,
            username: username, 
        };
    
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_BASE_URL_APIgateway}/api/brand/review/${productCode}?userId=${id}`,
                newReview,
                {
                    headers: {
                        Authorization: accessToken,
                        "Content-Type": "application/json",
                    },
                    withCredentials: true,
                }
            );
    
            console.log("리뷰 작성 성공:", response.data);

            await fetchReviews();
            
            setReviews((prevReviews) => [...prevReviews, response.data]);
            setRating(0);
            setHeight("");
            setWeight("");
            setDescription("");
        } catch (error) {
            console.error("리뷰 작성 실패:", error);
            Swal.fire({
                title: "리뷰 작성에 실패했습니다.",
                text: error.response?.data?.message || "다시 시도해주세요.",
                icon: "error",
            });
        }
    };
    
    const handleDeleteReview = async (reviewId) => {
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
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const accessToken = sessionStorage.getItem("accessToken");
    
                    if (!accessToken) {
                        Swal.fire({
                            title: "로그인 정보가 없습니다.",
                            text: "다시 로그인해주세요.",
                            icon: "error",
                        });
                        return;
                    }
                    console.log(`Deleting Review with URL: ${process.env.REACT_APP_API_BASE_URL_APIgateway}/api/brand/review/${reviewId}`);
    
                    // userId 제거 후 백엔드에 삭제 요청
                    const response = await axios.delete(
                        `${process.env.REACT_APP_API_BASE_URL_APIgateway}/api/brand/review/${reviewId}`,
                        {
                            headers: {
                                Authorization: accessToken,
                                "Content-Type": "application/json",
                            },
                            withCredentials: true,
                        }
                    );
    
                    if (response.status === 204) {
                        Swal.fire({
                            title: "리뷰가 삭제되었습니다.",
                            icon: "success",
                            confirmButtonText: "확인",
                            confirmButtonColor: "#754F23",
                            background: "#F0EADC",
                            color: "#754F23",
                        });
    
                        setReviews((prevReviews) => prevReviews.filter((review) => review.reviewCode !== reviewId));
                    }
                } catch (error) {
                    console.error("리뷰 삭제 실패:", error);
                    Swal.fire({
                        title: "리뷰 삭제에 실패했습니다.",
                        text: error.response?.data?.message || "다시 시도해주세요.",
                        icon: "error",
                    });
                }
            }
        });
    };
    

    const handleImageClick = (images, index) => {
        setSelectedImages(images);
        setInitialImageIndex(index);
        setShowImageModal(true);
    };

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
                            {[1, 2, 3, 4, 5, 6].map((video, index) => {
                                const shortCode = `short-${index + 1}`; 
                                return (
                                    <div
                                        key={index}
                                        className="video-item"
                                        onClick={() => handleVideoClick('https://www.youtube.com/embed/khHcpvsUdK8')}
                                    >
                                        <img src={short} alt={`Reel ${index + 1}`} />
                                        <button
                                            className={`button-like ${likedShorts.includes(shortCode) ? 'liked' : ''}`}
                                            onClick={(e) => handleLikeClick(shortCode, e)} // 클릭 시 좋아요 상태 변경
                                            aria-label="Like button"
                                        >
                                            <FaHeart className="fa" />
                                            <span>{likedShorts.includes(shortCode) ? 'Liked' : 'Like'}</span>
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                        <ShortModal showModal={showModal} videoSrc={videoSrc} onClose={handleCloseModal} />
                    </div>
                );
            case '상세정보':
                return (
                    <div className="detail">
                        {/* 이미지 목록 */}
                        <div className="detail-images">
                            {product?.images && product.images.length > 0 ? (
                                product.images.map((image, index) => (
                                    <img
                                        key={index}
                                        src={image}
                                        alt={`Detail Image ${index + 1}`}
                                        className="detail-image"
                                    />
                                ))
                            ) : (
                                <p>상세 이미지가 없습니다.</p>
                            )}
                        </div>
                        {/* 상세 텍스트 */}
                        <div className="detail-text">
                            <p>{product?.textInformation || '상세 정보가 없습니다.'}</p>
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
                                        rating={rating || 0}
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
                                    {Array.isArray(review.images) && review.images.length > 0 ? (
                                        <div className="review-images">
                                            <img
                                                src={review.images[review.currentImageIndex] || review.images[0]} // 안전하게 첫 이미지를 기본으로 표시
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
                                    ): (
                                        <p>이미지가 없습니다.</p>
                                    )}
                                    <div className="review-content">
                                        <div className="review-top">
                                            <StarRatings
                                                rating={review.starRating}
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
                                            <p>{review.content}</p>
                                        </div>
                                        <div className="review-bottom">
                                            <span>ID: {review.username} / {review.reviewDate}</span>
                                        
                                            {review.userId === parseInt(sessionStorage.getItem("id")) && (
                                                <button className="delete-button" onClick={() => {
                                                    handleDeleteReview(review.reviewId);
                                                    }}>
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
            {/* 상품 이미지 */}
            <div className={`product-images ${product?.thumbnail.length === 1 ? 'single' : 'multiple'}`}>
                {product?.thumbnail && product.thumbnail.length > 0 ? (
                    product.thumbnail.map((thumb, index) => (
                        <div key={index} className="product-image-ani">
                            <img
                                src={thumb}
                                alt={`Product Thumbnail ${index + 1}`}
                            />
                        </div>
                    ))
                ) : (
                    <p>썸네일 이미지가 없습니다.</p>
                )}
            </div>

            {/* 상품 정보 */}
            <div className="product-info">
                <h2>{product?.name || '상품 이름'}</h2>
                <div className='product-info2'>
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
                        KRW {product?.price?.toLocaleString() || '0'}
                    </div>
                </div>
            </div>

            {/* 드롭다운 선택 */}
            <div className="form-selects-container">
                {/* 사이즈 선택 드롭다운 */}
                <div className={`form-select-container ${isSizeActive ? "active" : ""}`}>
                    <div className="form-select" onClick={handleSizeSelectClick}>
                        <div className="form-option-placeholder">
                            {selectedSize}
                        </div>
                    </div>
                    {isSizeActive && (
                        <div className="form-option-wrapper">
                            <div className="form-option-container">
                                {product?.category === "신발" && product.shoesSize
                                    ? product.shoesSize.split(',').map((size) => (
                                        <div
                                            key={size}
                                            className={`form-option ${selectedSize === size ? "active" : ""}`}
                                            onClick={() => handleSizeOptionClick(size)}
                                        >
                                            {size}
                                        </div>
                                    ))
                                    : product?.clothesSize &&
                                    product.clothesSize.split(',').map((size) => (
                                        <div
                                            key={size}
                                            className={`form-option ${selectedSize === size ? "active" : ""}`}
                                            onClick={() => handleSizeOptionClick(size)}
                                        >
                                            {size}
                                        </div>
                                    ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* 색깔 선택 드롭다운 */}
                <div className={`form-select-container ${isColorActive ? "active" : ""}`}>
                    <div className="form-select" onClick={handleColorSelectClick}>
                        <div className="form-option-placeholder">
                            {selectedColor}
                        </div>
                    </div>
                    {isColorActive && (
                        <div className="form-option-wrapper">
                            <div className="form-option-container">
                                {product?.color &&
                                    product.color.split(',').map((color) => (
                                        <div
                                            key={color}
                                            className={`form-option ${selectedColor === color ? "active" : ""}`}
                                            onClick={() => handleColorOptionClick(color)}
                                        >
                                            {color}
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
                            {selectedAmount !== "Choose a amount" ? selectedAmount : "Choose a amount"}
                        </div>
                    </div>
                    {isAmountActive && (
                        <div className="form-option-wrapper">
                            <div className="form-option-container">
                                {Array.from({ length: Math.min(product?.stock || 0, 10) }, (_, i) => i + 1).map((amount) => (
                                    <div
                                        key={amount}
                                        className={`form-option ${selectedAmount === amount ? "active" : ""}`}
                                        onClick={() => handleAmountOptionClick(amount)}
                                    >
                                        {amount}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>


            </div>


            <div className="wishlist-cart-container">
                <button
                    className={`wishlist-button ${wishlistClicked ? 'clicked' : ''} ${wishlistItems.includes(productCode) ? 'product-wish' : ''}`}
                    onClick={handleWishlistToggle}
                    aria-pressed={wishlistItems.includes(productCode)}
                    aria-label={wishlistItems.includes(productCode) ? "Remove from Wishlist" : "Add to Wishlist"}
                >
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
