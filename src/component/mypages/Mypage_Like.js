import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ShortModal from '../ShortModal';
import '../css/Mypage_Form.css';
import '../css/Mypage_Like.css';
import Swal from 'sweetalert2';
import { BsPersonBoundingBox } from "react-icons/bs";
import { FaRegHandPointRight, FaRegHandPointLeft } from "react-icons/fa";
import { MdOutlineWavingHand } from "react-icons/md";
import axios from "axios";
import product from '../../img/product.jpg';
import short from '../../img/shorts.png';

function Sidebar({ handleDeleteAccount, handleLogout }) {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <div className="order_sidebar">
            <ul>
                <li
                    className={location.pathname === '/mypages/orderlist' ? 'active' : ''}
                    onClick={() => navigate('/mypages/orderlist')}
                >
                    주문 조회
                </li>
                <li
                    className={location.pathname === '/mypages/like' ? 'active' : ''}
                    onClick={() => navigate('/mypages/like')}
                >
                    위시 리스트
                </li>
                <li
                    className={location.pathname === '/mypages/question' ? 'active' : ''}
                    onClick={() => navigate('/mypages/question')}
                >
                    1:1 문의
                </li>
                <li
                    className={location.pathname === '/mypages/change' ? 'active' : ''}
                    onClick={() => navigate('/mypages/change')}
                >
                    정보수정
                </li>
                <li onClick={handleLogout}>
                    로그아웃
                </li>
                <li onClick={handleDeleteAccount}>
                    회원 탈퇴
                </li>
            </ul>
        </div>
    );
}

function LikeContainer() {
    const [nickname, setNickname] = useState('');
    const [Id, setId] = useState('');
    const [activeTab, setActiveTab] = useState("상품");
    const [wishlistProducts, setWishlistProducts] = useState([]);
    const [likedShorts, setLikedShorts] = useState([]);
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [videoSrc, setVideoSrc] = useState('');

    useEffect(() => {
        const accessToken = sessionStorage.getItem('accessToken');
        if (accessToken) {
            axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/user`, {
                headers: {
                    Authorization: `${accessToken}`
                }
            })
                .then(response => {
                    if (response.data && response.data.body) {
                        setNickname(response.data.body.nickname);
                        setId(response.data.body.id);
                    }
                })
                .catch(error => {
                    console.log("닉네임을 가져오는 중 오류가 발생했습니다.", error);
                });

            axios.get(`${process.env.REACT_APP_API_BASE_URL_APIgateway}/api/wishlist/products`, {
                headers: {
                    Authorization: accessToken,
                }
            })
                .then(response => {
                    console.log(response.data)
                    if (response.data) {
                        // 중복 제거
                        const uniqueProducts = response.data.filter((product, index, self) =>
                            index === self.findIndex((p) => p.productCode === product.productCode)
                        );
                        setWishlistProducts(uniqueProducts);
                    }
                })
                .catch(error => {
                    console.error("위시리스트를 가져오는 중 오류가 발생했습니다.", error);
                });
        }
    }, []);

    useEffect(() => {
        const fetchLikedShorts = async () => {
            const accessToken = sessionStorage.getItem("accessToken");

            if (!accessToken) {
                console.error("Access token is missing.");
                return;
            }

            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_API_BASE_URL_APIgateway}/api/wishlist/shorts`,
                    {
                        headers: {
                            Authorization: accessToken,
                            "Content-Type": "application/json",
                        },
                    }
                );

                console.log("Response Data:", response.data);

                const likedShortsData = response.data.map((item) => ({
                    id: item.id,
                    shortsCode: item.shortsCode,
                    thumbnailUrl: item.shortsThumbnail,
                    shortsUrl: item.shortsUrl,
                }));

                setLikedShorts(likedShortsData);
            } catch (error) {
                console.error("Error fetching liked shorts:", error);
            }
        };

        fetchLikedShorts();
    }, []);

    const convertToEmbedUrl = (url) => {
        const match = url.match(/(?:\?v=|\/shorts\/)([a-zA-Z0-9_-]{11})/);
        if (match && match[1]) {
            return `https://www.youtube.com/embed/${match[1]}`;
        }
        return url;
    };

    const handleVideoClick = (url) => {
        setVideoSrc(url);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setVideoSrc('');
    };

    const handleLogout = () => {
        Swal.fire({
            title: '정말 로그아웃하시겠습니까?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: '로그아웃',
            cancelButtonText: '취소',
            confirmButtonColor: '#754F23',
            background: '#F0EADC',
            iconColor: '#DBC797'
        }).then((result) => {
            if (result.isConfirmed) {
                sessionStorage.removeItem("accessToken");
                sessionStorage.removeItem("role");
                sessionStorage.removeItem("id");
                console.log("로그아웃되었습니다.");
                navigate('/');
            }
        });
    };

    const handleDeleteAccount = async () => {
        Swal.fire({
            title: '정말 회원 탈퇴하시겠습니까?',
            text: '회원 정보를 복구할 수 없습니다.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: '탈퇴',
            cancelButtonText: '취소',
            confirmButtonColor: '#d33',
            background: '#F0EADC',
            iconColor: '#DBC797'
        }).then(async (result) => {
            if (result.isConfirmed) {
                const token = sessionStorage.getItem('accessToken');
                try {
                    const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/user/exit/${Id}`, {
                        method: 'DELETE',
                        headers: {
                            Authorization: `${token}`,
                        },
                    });

                    if (response.ok) {
                        Swal.fire({
                            icon: 'success',
                            title: '회원 탈퇴 완료',
                            text: '이용해 주셔서 감사합니다.',
                            confirmButtonText: '확인',
                            confirmButtonColor: '#754F23',
                            background: '#F0EADC',
                            color: '#754F23',
                            iconColor: '#DBC797'
                        }).then(() => {
                            sessionStorage.removeItem("accessToken");
                            sessionStorage.removeItem("role");
                            navigate('/');
                        });
                    } else {
                        throw new Error('회원 탈퇴 실패');
                    }
                } catch (error) {
                    console.error("회원 탈퇴 실패:", error);
                    Swal.fire({
                        icon: 'error',
                        title: '회원 탈퇴 실패',
                        text: '문제가 발생했습니다. 다시 시도해주세요.',
                        confirmButtonText: '확인',
                        confirmButtonColor: '#754F23',
                        background: '#F0EADC',
                        color: '#754F23',
                        iconColor: '#DBC797'
                    });
                }
            }
        });
    };

    const handleProductClick = (productCode) => {
        navigate(`/pages/shop/detail/${productCode}`); // 상세 페이지 이동
    };

    return (
        <div className="order-container">
            <Sidebar handleDeleteAccount={handleDeleteAccount} handleLogout={handleLogout} />
            <div className="order-content-area">
                <div className="order-rectangle">
                    <div className="order-circle"><MdOutlineWavingHand size={38} color='#333' /></div>
                    <span className="order-text">{nickname} 님 안녕하세요!</span>
                </div>
                <div className="order-title">
                    <span><FaRegHandPointRight />    ------------------    주문 조회    ------------------    <FaRegHandPointLeft /></span>
                </div>
                <div className="tab-wish-container">
                    <button
                        className={activeTab === "상품" ? "active" : ""}
                        onClick={() => setActiveTab("상품")}
                    >
                        상품
                    </button>
                    <button
                        className={activeTab === "숏폼" ? "active" : ""}
                        onClick={() => setActiveTab("숏폼")}
                    >
                        숏폼
                    </button>
                </div>

                {activeTab === "상품" ? (
                    <div className="product-wish-images">
                        {wishlistProducts.map((product, index) => (
                            <div key={index} className="brand-card">
                                <div className="brand-card-img-top">
                                    <img src={product.productImage} alt={`Product ${product.productCode}`} onClick={() => handleProductClick(product.productCode)} style={{ cursor: 'pointer' }} />
                                </div>
                                <div className="brand-card-body" >

                                <p>{product.productName}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="shorts-wish-images">
                        <div className="video-wish-gallery">
                            {likedShorts.length > 0 &&
                                likedShorts.map((short, index) => (
                                    <div
                                        key={short.id}
                                        className="video-wish-item"
                                        onClick={() => handleVideoClick(convertToEmbedUrl(short.shortsUrl))}
                                    >
                                        <img src={short.thumbnailUrl} alt={`Short ${index + 1}`} />
                                    </div>
                                ))}
                        </div>
                        <ShortModal showModal={showModal} videoSrc={videoSrc} onClose={handleCloseModal} />
                    </div>
                )}
            </div>
        </div >
    );
}

export default LikeContainer;