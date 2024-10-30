import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../css/Mypage_Form.css'; 
import Swal from 'sweetalert2';
import { BsPersonBoundingBox } from "react-icons/bs";
import { FaRegHandPointRight } from "react-icons/fa";
import { FaRegHandPointLeft } from "react-icons/fa";

function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();

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
                localStorage.removeItem("accessToken");
                localStorage.removeItem("role");
                localStorage.removeItem("username");
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
                const token = localStorage.getItem('accessToken');
                const username = localStorage.getItem('username');
                
                try {
                    const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/open-api/user/${username}`, {
                        method: 'DELETE',
                        headers: {
                            Authorization: `Bearer ${token}`,
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
                            handleLogout();
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
                <li onClick={handleLogout} >
                    로그아웃
                </li>
                <li onClick={handleDeleteAccount}>
                    회원 탈퇴
                </li>
            </ul>
        </div>
    );
}

function OrderContainer() {
    const [username, setUsername] = useState('');

    useEffect(() => {
        const fetchedUsername = localStorage.getItem('username');
        if (fetchedUsername) {
            setUsername(fetchedUsername);
        } else {
            console.log("사용자 ID를 찾을 수 없습니다.");
        }
    }, []);

    return (
        <div className="order-container">
            <Sidebar />
            <div className="order-content-area">
                <div className="order-rectangle">
                    <div className="order-circle"><BsPersonBoundingBox size={38} color='#333' /></div>
                    <span className="order-text">{username} 님 안녕하세요!</span>
                </div>
                <div className="order-title">
                    <span><FaRegHandPointRight />    ------------------    주문 조회    ------------------    <FaRegHandPointLeft /></span>
                </div>
            </div>
        </div>
    );
}

export default OrderContainer;
