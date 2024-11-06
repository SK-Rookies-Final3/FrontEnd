import React, { useState, useEffect } from 'react';
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
    const navigate = useNavigate();

    // 타이핑 effect short
    const [displayedText, setDisplayedText] = useState('');
    const texts = ["당신에게 꼭 맞는 AI 추천 숏폼을 지금 만나보세요!", "Discover AI-recommended shorts tailored just for you!  "];
    const texts_be = ["사랑받은 아이템으로 맞춘 AI 추천 컬렉션, 지금 만나보세요!", "AI Recommendation Collection Made with Loved Items, Meet It Now!"]
    const [textSet, setTextSet] = useState(texts);
    const [textIndex, setTextIndex] = useState(0);
    const [charIndex, setCharIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isPausedShort, setIsPausedShort] = useState(false);

    // 타이핑 effect product
    const [newDisplayedText, setNewDisplayedText] = useState('');
    const newTexts = ["당신에게 꼭 맞는 AI 추천 상품을 지금 만나보세요!", "Discover AI-recommended products tailored just for you!"];
    const newTexts_be = ["사랑받은 아이템으로 맞춘 AI 추천 컬렉션, 지금 만나보세요!", "AI Recommendation Collection Made with Loved Items, Meet It Now!"]
    const [newTextSet, setNewTextSet] = useState(newTexts);
    const [newTextIndex, setNewTextIndex] = useState(0);
    const [newCharIndex, setNewCharIndex] = useState(0);
    const [newIsDeleting, setNewIsDeleting] = useState(false);
    const [isPausedProduct, setIsPausedProduct] = useState(false);

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        setTextSet(accessToken ? texts : texts_be);
        setNewTextSet(accessToken ? newTexts : newTexts_be);
    }, []);

    const typingEffect = (
        texts, setDisplayedText, charIndex, setCharIndex,
        isDeleting, setIsDeleting, textIndex, setTextIndex,
        isPaused, setIsPaused
    ) => {
        if (isPaused) return;

        const timeout = setTimeout(() => {
            if (isDeleting) {
                if (charIndex > 0) {
                    setDisplayedText(texts[textIndex].slice(0, charIndex - 1));
                    setCharIndex((prev) => prev - 1);
                } else {
                    setIsDeleting(false);
                    setTextIndex((prev) => (prev + 1) % texts.length);
                    setIsPaused(true);
                    setTimeout(() => setIsPaused(false), 1500);
                }
            } else {
                if (charIndex < texts[textIndex].length) {
                    setDisplayedText(texts[textIndex].slice(0, charIndex + 1));
                    setCharIndex((prev) => prev + 1);
                } else {
                    setIsDeleting(true);
                    setIsPaused(true);
                    setTimeout(() => setIsPaused(false), 1500);
                }
            }
        }, isDeleting ? 50 : 50);

        return () => clearTimeout(timeout);
    };

    useEffect(() => {
        return typingEffect(
            textSet, setDisplayedText, charIndex, setCharIndex,
            isDeleting, setIsDeleting, textIndex, setTextIndex,
            isPausedShort, setIsPausedShort
        );
    }, [charIndex, isDeleting, textIndex, isPausedShort, textSet]);

    useEffect(() => {
        return typingEffect(
            newTextSet, setNewDisplayedText, newCharIndex, setNewCharIndex,
            newIsDeleting, setNewIsDeleting, newTextIndex, setNewTextIndex,
            isPausedProduct, setIsPausedProduct
        );
    }, [newCharIndex, newIsDeleting, newTextIndex, isPausedProduct, newTextSet]);

    const handleVideoClick = (url) => {
        setVideoSrc(url);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setVideoSrc('');
    };

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
                <div className="typed-text">_ {displayedText}</div>
                <div className="short-form-videos">

                    <div className="has-glow">
                        <div className="glow">
                            <div className="glow-bg"></div>
                        </div>
                        <div className="white-clip"></div>
                        <div className="content">
                            <div className="video-card" onClick={() => handleVideoClick('https://www.youtube.com/embed/khHcpvsUdK8')}>
                                <img src={short} alt="Video3" className="video-thumbnail" />
                                <p className="sub-form-title">아디다스 캠퍼스 00's 언박싱</p>
                            </div>
                        </div>
                    </div>

                    <div className="has-glow">
                        <div className="glow">
                            <div className="glow-bg"></div>
                        </div>
                        <div className="white-clip"></div>
                        <div className="content">
                            <div className="video-card" onClick={() => handleVideoClick('https://www.youtube.com/embed/khHcpvsUdK8')}>
                                <img src={short} alt="Video3" className="video-thumbnail" />
                                <p className="sub-form-title">아디다스 캠퍼스 00's 언박싱</p>
                            </div>
                        </div>
                    </div>

                    <div className="has-glow">
                        <div className="glow">
                            <div className="glow-bg"></div>
                        </div>
                        <div className="white-clip"></div>
                        <div className="content">
                            <div className="video-card" onClick={() => handleVideoClick('https://www.youtube.com/embed/khHcpvsUdK8')}>
                                <img src={short} alt="Video3" className="video-thumbnail" />
                                <p className="sub-form-title">아디다스 캠퍼스 00's 언박싱</p>
                            </div>
                        </div>
                    </div>

                </div>


                <ShortModal showModal={showModal} videoSrc={videoSrc} onClose={handleCloseModal} />
            </div>


            {/* Product Form */}
            <div className='form-container'>
                <h2 className="form-title">Recommended Products</h2>
                <div className="typed-text">_ {newDisplayedText}</div>
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