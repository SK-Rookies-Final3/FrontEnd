import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../css/Mypage_Form.css';
import '../css/Mypage_myorder.css';
import Swal from 'sweetalert2';
import { FaRegHandPointRight, FaRegHandPointLeft } from "react-icons/fa";
import { FcCalendar } from "react-icons/fc";
import { MdOutlineWavingHand } from "react-icons/md";
import axios from "axios";
import nikeImage from '../../img/Nike.PNG';

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

function OrderContainer() {
    const [nickname, setNickname] = useState('');
    const [Id, setId] = useState('');
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [prevOrderDate, setPrevOrderDate] = useState('');

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

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_BASE_URL_APIgateway}/api/order/client`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `${sessionStorage.getItem("accessToken")}`
                    }
                });
    
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
    
                const data = await response.json();
                console.log("응답 데이터:", data);
                setOrders(data); // 주문 데이터를 상태에 저장
    
            } catch (err) {
                console.error('주문 조회를 가져오는 데 실패했습니다:', err);
            }
        };
    
        fetchProducts();
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
                    <div className="order-circle">
                        <MdOutlineWavingHand size={38} color='#333' />
                    </div>
                    <span className="order-text">{nickname} 님 안녕하세요!</span>
                </div>
                <div className="order-title">
                    <span>
                        <FaRegHandPointRight /> ------------------ 주문 조회 ------------------ <FaRegHandPointLeft />
                    </span>
                </div>
    
                {orders.length > 0 ? (
                    <div className="myorder-list">
                        {orders.map(order => (
                            <div key={order.code} className="myorder-container">
                                <div className="myorder-day">
                                    {new Date(order.orderDate).toLocaleDateString()} <FcCalendar />
                                </div>
                                <div className="myorder-rectangle">
                                    <div className="myorder-products">
                                        {order.orderItems.map(item => (
                                            <div key={item.id} className="myorder-product">
                                               <img 
                                                src={item.thumbnail}
                                                alt="Product Thumbnail" 
                                            />
                                                <div className="myorder-product-info">
                                                    <span className="highlights">상품명 :</span> {item.name},&nbsp;&nbsp;
                                                    <span className="highlights">색상 :</span> {item.color},&nbsp;&nbsp;
                                                    <span className="highlights">사이즈 :</span> 
                                                        {item.clothesSize || item.shoesSize || "-"}
                                                        ,&nbsp;&nbsp;
                                                    <span className="highlights">수량 :</span> {item.stock}
                                                </div>
                                                <div className="myorder-product-price">
                                                    {`${Number(item.price).toLocaleString()} 원`}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="no-orders">주문 내역이 없습니다.</div>
                )}
            </div>
        </div>
    );    
}

export default OrderContainer;
