import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ShortModal from './ShortModal';
import leftImage from '../logo/404logo.png';
import rightImage from '../logo/made_404logo.png';
import personImage from '../img/person.png'
import short from '../img/shorts.png'
import product from '../img/product.jpg'
import './css/Home.css'
import { VscArrowRight } from "react-icons/vsc";


function Bottom() {
    return (
        <div className="bottom">
            <img src={leftImage} alt='Left' className='bottom-image' />
            <img src={rightImage} alt='Right' className='bottom-image-r' />
        </div>
    );
}

function Home() {

    const [showModal, setShowModal] = useState(false);
    const [videoSrc, setVideoSrc] = useState('');

    const handleVideoClick = (url) => {
        setVideoSrc(url);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setVideoSrc('');
    };

    const navigate = useNavigate();

    const handleViewAllClick = () => {
        navigate('/pages/shop');
    };

    return (
        <div className='home-container'>
            <div className='home_top-container'>
                <div className="text-container">
                    <h1 className="main-title">Crafting Elegance<br />One Story at a Time</h1>
                    <p className="sub-title">우아함과 이야기의 결합을 통해 브랜드의 세련된 감성을 전달합니다</p>
                    <p className="sub-title">
                        저희는 단순히 제품을 제공하는 것이 아니라, <strong>고객의 삶에 우아함과 의미를 더하는 특별한 경험을 만들어갑니다.</strong><br />
                        각 제품은 하나의 이야기처럼 정성껏 제작되었으며, 고객이 이를 통해 자신만의 이야기를 표현하고
                        새로운 순간을 만들어갈 수 있도록 돕는 것이 저희의 철학입니다.
                    </p>
                </div>
                <div className="image-container">
                    <div className="image-container2" />
                    <img src={personImage} alt="Person" className="person-image" />
                </div>
            </div>

            {/* Short Form */}
            <div className="form-container">
                <h2 className="form-title">Short Form</h2>
                <div className="short-form-videos">
                    <div className="video-card" onClick={() => handleVideoClick('https://www.youtube.com/embed/khHcpvsUdK8')}>
                        <img src={short} alt="Video1" className="video-thumbnail" />
                        <p className="sub-form-title">비비안웨스트우드 24SS</p>
                    </div>
                    <div className="video-card" onClick={() => handleVideoClick('https://www.youtube.com/embed/khHcpvsUdK8')}>
                        <img src={short} alt="Video2" className="video-thumbnail" />
                        <p className="sub-form-title">폴로가디건 화이트 데일리룩</p>
                    </div>
                    <div className="video-card" onClick={() => handleVideoClick('https://www.youtube.com/embed/khHcpvsUdK8')}>
                        <img src={short} alt="Video3" className="video-thumbnail" />
                        <p className="sub-form-title">아디다스 캠퍼스 00's 언박싱</p>
                    </div>
                </div>
                <ShortModal showModal={showModal} videoSrc={videoSrc} onClose={handleCloseModal} />
            </div>


            {/* Product Form */}
            <div className='form-container'>

                <h2 className="form-title">Recommended Products</h2>

                <div class="product-form-container">
                    <div class="card">
                        <div class="imgBx">
                            <img src={product} alt="Product" className="image-thumbnail" />
                        </div>
                        <div class="contentBx">
                            <h2>비비안웨스트우드</h2>
                            <div class="price">
                                <h3>Price :</h3>
                                <span>150,000</span>
                            </div>
                            <a href="#">Buy Now</a>
                        </div>
                    </div>

                    <div class="card">
                        <div class="imgBx">
                            <img src={product} alt="Product" className="image-thumbnail" />
                        </div>
                        <div class="contentBx">
                            <h2>비비안웨스트우드</h2>
                            <div class="price">
                                <h3>Price :</h3>
                                <span>150,000</span>
                            </div>
                            <a href="#">Buy Now</a>
                        </div>
                    </div>

                    <div class="card">
                        <div class="imgBx">
                            <img src={product} alt="Product" className="image-thumbnail" />
                        </div>
                        <div class="contentBx">
                            <h2>비비안웨스트우드</h2>
                            <div class="price">
                                <h3>Price :</h3>
                                <span>150,000</span>
                            </div>
                            <a href="#">Buy Now</a>
                        </div>
                    </div>

                    <div class="card">
                        <div class="imgBx">
                            <img src={product} alt="Product" className="image-thumbnail" />
                        </div>
                        <div class="contentBx">
                            <h2>비비안웨스트우드</h2>
                            <div class="price">
                                <h3>Price :</h3>
                                <span>150,000</span>
                            </div>
                            <a href="#">Buy Now</a>
                        </div>
                    </div>

                    <div class="card">
                        <div class="imgBx">
                            <img src={product} alt="Product" className="image-thumbnail" />
                        </div>
                        <div class="contentBx">
                            <h2>비비안웨스트우드</h2>
                            <div class="price">
                                <h3>Price :</h3>
                                <span>150,000</span>
                            </div>
                            <a href="#">Buy Now</a>
                        </div>
                    </div>

                    <div class="card">
                        <div class="imgBx">
                            <img src={product} alt="Product" className="image-thumbnail" />
                        </div>
                        <div class="contentBx">
                            <h2>비비안웨스트우드</h2>
                            <div class="price">
                                <h3>Price :</h3>
                                <span>150,000</span>
                            </div>
                            <a href="#">Buy Now</a>
                        </div>
                    </div>
                    <button className="view-all-button" onClick={handleViewAllClick}>
                        <span className="button_all_icon-wrapper">
                            <VscArrowRight className="button_all_icon-svg" />
                            <VscArrowRight className="button_all_icon-svg button_all_icon-svg--copy" />
                        </span>
                        VIEW-ALL
                    </button>
                </div>
            </div>





            <Bottom />
        </div>
    );
}

export default Home;