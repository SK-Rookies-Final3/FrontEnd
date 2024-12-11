import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ShortModal from './ShortModal';
import leftImage from '../logo/404logo.png';
import rightImage from '../logo/made_404logo.png';
import personImage from '../img/person.png';
import short from '../img/shorts.png';
import product from '../img/product.jpg';
import './css/Home.css';
import { VscArrowRight } from "react-icons/vsc";
import axios from "axios";

function Bottom() {
    return (
        <div className="bottom">
            <img src={leftImage} alt='Left' className='bottom-image' />
            <img src={rightImage} alt='Right' className='bottom-image-r' />
        </div>
    );
}

function Home() {
    const [nickname, setNickname] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [videoSrc, setVideoSrc] = useState('');
    const navigate = useNavigate();

    const [shortsData, setShortsData] = useState([]);
    const [productsData, setProductsData] = useState([]);

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
    const newTexts_be = ["사랑받은 아이템으로 맞춘 AI 추천 컬렉션, 지금 만나보세요!", "AI Recommendation Collection Made with Loved Items, Meet It Now!"];
    const [newTextSet, setNewTextSet] = useState(newTexts);
    const [newTextIndex, setNewTextIndex] = useState(0);
    const [newCharIndex, setNewCharIndex] = useState(0);
    const [newIsDeleting, setNewIsDeleting] = useState(false);
    const [isPausedProduct, setIsPausedProduct] = useState(false);

    useEffect(() => {
        const accessToken = sessionStorage.getItem('accessToken');
        if (accessToken) {
            axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/user`, {
                headers: {
                    Authorization: `${accessToken}`,
                },
            })
                .then(response => {
                    if (response.data && response.data.body) {
                        setNickname(response.data.body.nickname);
                    }
                })
                .catch(error => {
                    console.error("닉네임을 가져오는 중 오류가 발생했습니다.", error);
                });
        }
    }, []);


    useEffect(() => {
        const accessToken = sessionStorage.getItem('accessToken');
        setTextSet(accessToken ? texts : texts_be);
        setNewTextSet(accessToken ? newTexts : newTexts_be);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;

            const homeTopContainer = document.querySelector('.home_top-container');
            if (homeTopContainer) {
                const scaleValue = Math.max(1 - (scrollTop / 1000), 0.8);
                const rotateValue = Math.min((scrollTop / 1000) * 5, 5);
                const opacityValue = Math.max(1 - (scrollTop / 1000) * 0.3, 0.7);
                const translateY = Math.min(scrollTop * 0.1, 50);

                homeTopContainer.style.perspective = '1000px';
                homeTopContainer.style.transform = `
                    scale(${scaleValue}) 
                    rotate(${rotateValue}deg)
                    translateY(-${translateY}px)
                `;
                homeTopContainer.style.opacity = opacityValue;
                homeTopContainer.style.transition = 'transform 0.3s ease-out, opacity 0.3s ease-out';
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Intersection Observer를 사용하여 스크롤 애니메이션 적용
    useEffect(() => {
        const options = {
            threshold: 0.1,
        };

        const callback = (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                } else {
                    entry.target.classList.remove('animate');
                }
            });
        };

        const observer = new IntersectionObserver(callback, options);

        const sections = document.querySelectorAll('.sections');

        sections.forEach(section => {
            observer.observe(section);
        });

        return () => {
            sections.forEach(section => {
                observer.unobserve(section);
            });
        };
    }, []);

    // highlight 기능 함수 정의
    const h3Ref = useRef(null); // h3 요소에 ref 설정
    const highlightStrong = (element) => {
        const strongTags = element.querySelectorAll("strong");
        let index = 0;
        const intervalId = setInterval(() => {
            if (index < strongTags.length) {
                const strongTag = strongTags[index];
                strongTag.className = "highlight";
                index++;
            } else {
                clearInterval(intervalId);
            }
        }, 1000);
    };
    useEffect(() => {
        if (h3Ref.current) {
            highlightStrong(h3Ref.current);
        }
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

    // ai를 통한 추천
    useEffect(() => {
        const fetchShortsData = async () => {
            const accessToken = sessionStorage.getItem("accessToken");
            const userId = sessionStorage.getItem("id");
    
            try {
                const url = accessToken && userId
                    // ? `https://dotblossom.today/ai-api/preference/${userId}`
                    ? `https://dotblossom.today/ai-api/preference/10`
                    : `https://dotblossom.today/ai-api/preference/default`;
    
                const headers = accessToken ? { Authorization: `${accessToken}` } : {};
    
                const response = await axios.get(url, { headers });
    
                console.log("Full API Response:", response.data);
    
                if (accessToken) {
                    // 로그인 시
                    const userPreference = response.data[0]?.payload || [];
                    setShortsData(userPreference);
                    setProductsData(userPreference);
                } else {
                    // 비로그인 시
                    const defaultPreference = response.data[0]?.default_preference_id || [];
                    setShortsData(defaultPreference);
                    setProductsData(defaultPreference);
                }
            } catch (error) {
                console.error("Error fetching shorts data:", error);
            }
        };
    
        fetchShortsData();
    }, []);

    const convertToEmbedUrl = (url) => {
        const match = url.match(/(?:\?v=|\/shorts\/)([a-zA-Z0-9_-]{11})/);
        if (match && match[1]) {
            return `https://www.youtube.com/embed/${match[1]}`;
        }
        return url;
    };

    return (
        <div className='home-container'>
            <div className='home_top-container sections'>
                <div className="text-container">
                    <h1 className="main-title">
                        <svg viewBox="0 0 1320 300" className="svg-title">
                            <text x="50%" y="50%" textAnchor="middle">
                                <tspan x="50%" dy="-20">Crafting Elegance</tspan>
                                <tspan x="50%" dy="100">One Story at a Time</tspan>
                            </text>
                        </svg>
                    </h1>
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
            <div className="s-form-container sections">
                <div className='form-title-con'>
                    <h2 className="form-title">Short Form</h2>
                    {sessionStorage.getItem('accessToken') ? (
                        <h3 ref={h3Ref}>
                            <strong>{nickname}에게 맞는 AI 추천!</strong>
                        </h3>
                    ) : (
                        <h3 ref={h3Ref}>
                            <strong>AI Filtering 완료</strong>
                        </h3>
                    )}
                </div>
                <div className="typed-text">_ {displayedText}</div>
                <div className="short-form-videos">
                    {shortsData.map((item, index) => (
                        <div className="has-glow item" key={index}>
                            <div className="glow">
                                <div className="glow-bg"></div>
                            </div>
                            <div className="white-clip"></div>
                            <div className="content">
                                <div className="video-card" onClick={() => handleVideoClick(convertToEmbedUrl(item.shorts.youtube_url))}>
                                    <img src={item.shorts.youtube_thumbnail_url} alt={`Video ${index + 1}`} className="video-thumbnail" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>


            </div>
            <ShortModal showModal={showModal} videoSrc={videoSrc} onClose={handleCloseModal} />


            {/* Product Form */}
            <div className='p-form-container sections'>
                <h2 className="form-title">Recommended Products</h2>
                <div className="typed-text">_ {newDisplayedText}</div>
                <div className="product-form-container">
                    {productsData.map((item, index) => (
                        <div className="card item" key={index}>
                            <div className="imgBx">
                                <img src={item.product.product_thumbnail} alt={`Product ${index + 1}`} className="image-thumbnail" />
                            </div>
                            <div className="contentBx">
                                <h2>{item.product.product_name}</h2>
                                <div className="price">
                                    <h3>Price :</h3>
                                    <span>{item.product.product_price.toLocaleString()}원</span>
                                </div>
                                <a
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        navigate(`/pages/shop/detail/${item.product_id}`);
                                    }}
                                >
                                    Buy Now
                                </a>
                            </div>
                        </div>
                    ))}

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