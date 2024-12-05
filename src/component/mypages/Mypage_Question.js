import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../css/Mypage_Form.css';
import '../css/Mypage_Question.css';
import Swal from 'sweetalert2';
import { BsPersonBoundingBox } from "react-icons/bs";
import { FaRegHandPointRight, FaRegHandPointLeft } from "react-icons/fa";
import { MdOutlineWavingHand } from "react-icons/md";
import axios from "axios";
import { HiOutlineMailOpen } from "react-icons/hi";
import { IoPhonePortraitOutline } from "react-icons/io5";
import { GiQueenCrown } from "react-icons/gi";
import { FaPhone } from 'react-icons/fa';

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

function QuestionContainer() {
    const [nickname, setNickname] = useState('');
    const [Id, setId] = useState('');
    const navigate = useNavigate();

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
        }
    }, []);

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

    return (
        <div className="order-container">
            <Sidebar handleDeleteAccount={handleDeleteAccount} handleLogout={handleLogout} />
            <div className="order-content-area">
                <div className="order-rectangle">
                    <div className="order-circle"><MdOutlineWavingHand size={38} color='#333' /></div>
                    <span className="order-text">{nickname} 님 안녕하세요!</span>
                </div>
                <div className="order-title">
                    <span><FaRegHandPointRight />    ------------------    도움이 필요하신가요?    ------------------    <FaRegHandPointLeft /></span>
                </div>

                <div className="footer-content">
                    <div className="footer-info">
                        {/* <GiQueenCrown className='email-icon' /> */}
                        <svg className="crown">
                            <path fill="#333333">
                                <animate
                                    attributeName="d"
                                    dur="1440ms"
                                    repeatCount="indefinite"
                                    values="M 10,110 L 10,10 L 40,50 L 70,10 L 100,50 L 130,10 L 130,110 z;M 30,110 L 0,0 L 50,50 L 70,0 L 90,50 L 140,0 L 110,110 z;M 10,110 L 10,10 L 40,50 L 70,10 L 100,50 L 130,10 L 130,110 z;"
                                />
                            </path>
                        </svg>
                        <p>(유) 숏핑구 (SHORTPINGOO)</p>
                        <p>대표: 우예리 | 사업자등록번호: 000-00-00000</p>
                        <p>주소: 서울특별시 강남구</p>
                        <p>이메일: sk@gmail.com</p>
                    </div>
                </div>

                <div className='question-content'>
                    <div className="footer-content">
                        <div className="footer-info">
                            {/* <HiOutlineMailOpen className='email-icon' /> */}
                            <div id="unsubscribe">
                                <div class="letter">
                                    <div class="shadow"></div>
                                    <div class="background"></div>
                                    <div class="body">
                                    </div>
                                </div>
                            </div>
                            <p>메일 문의</p>
                            <p>제품 및 주문 | 9:00 – 18:00 | 월요일 – 일요일(설/추석 연휴 제외)</p>
                            <p>이메일: sk@gmail.com</p>
                        </div>
                    </div>
                    <div className="footer-content">
                        <div className="footer-info">
                            <FaPhone className="phone-icon bgc-blue c-white circle p-5 osc-rotation" />
                            <p>전화 문의</p>
                            <p>제품 및 주문 | 9:00 – 18:00, 월요일 – 일요일(설/추석 연휴 제외)</p>
                            <p>080-0000-0000</p>
                        </div>
                    </div>
                </div>



            </div>
        </div >
    );
}

export default QuestionContainer;