import React, { useState, useEffect } from 'react';
import '../css/Business_Form.css';
import { FaSearch } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';

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
                sessionStorage.removeItem("accessToken");
                sessionStorage.removeItem("role");
                sessionStorage.removeItem("id");
                navigate('/');
            }
        });
    };

    return (
        <div className="business_sidebar">
            <ul>
                <li className={location.pathname === '/business/product' ? 'active' : ''}
                    onClick={() => navigate('/business/product')}>물품 목록 및 확인</li>
                <li className={location.pathname === '/business/orderlist' ? 'active' : ''}
                    onClick={() => navigate('/business/orderlist')}>주문 목록 확인</li>
                <li className={location.pathname === '/business/statistics' ? 'active' : ''}
                    onClick={() => navigate('/business/statistics')}>통계</li>
                <li onClick={handleLogout}>로그아웃</li>
            </ul>
        </div>
    );
}

function BusinessOrderList() {
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <div className="business-container">
            <Sidebar />
            <div className="main-content">
                <div className="header">
                    <span className="store-text">My Store Orders</span>
                    <div className="search-box">
                        <input
                            className="search-text"
                            type="text"
                            placeholder="주문 검색"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)} />
                        <div className="search-btn">
                            <FaSearch />
                        </div>
                    </div>
                </div>
                <OrderTable searchQuery={searchQuery} />
            </div>
        </div>
    );
}

function OrderTable({ searchQuery }) {
    const [orders, setOrders] = useState([]);
    const [activeDropdown, setActiveDropdown] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch(
                    `${process.env.REACT_APP_API_BASE_URL_APIgateway}/api/order/owner`,
                    {
                        method: 'GET',
                        headers: {
                            'Authorization': `${sessionStorage.getItem("accessToken")}`,
                        },
                    }
                );

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

        fetchOrders();
    }, []);

    const handleStatusChange = (orderNo, newStatus) => {
        setOrders((prevOrders) =>
            prevOrders.map((order) =>
                order.code === orderNo ? { ...order, status: newStatus } : order
            )
        );
        setActiveDropdown(null);
    };

    const handleDropdownToggle = (orderNo) => {
        if (activeDropdown === orderNo) {
            setActiveDropdown(null);
        } else {
            setActiveDropdown(orderNo);
        }
    };

    const handleDeleteButtonClick = (orderNo, event) => {
        Swal.fire({
            icon: 'warning',
            title: '정말 삭제하시겠습니까?',
            showCancelButton: true,
            confirmButtonText: '삭제',
            cancelButtonText: '취소',
            confirmButtonColor: '#754F23',
            background: '#F0EADC',
            color: '#754F23',
            iconColor: '#DBC797'
        }).then((result) => {
            if (result.isConfirmed) {
                const button = event.target.closest('.delete_btn');
                const animation = button.querySelector('.animation');
                const row = button.closest('tr');
                animation.style.display = 'flex';
                button.classList.add('click');

                setTimeout(() => {
                    row.classList.add('fade-out');
                }, 2000);

                setTimeout(() => {
                    const updatedOrders = orders.filter((order) => order.no !== orderNo);
                    setOrders(updatedOrders);
                }, 2500);
            }
        });
    };

    const filteredOrders = orders.filter((order) =>
        order.orderItems.some((item) =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );

    return (
        <table className="product-table">
            <thead>
                <tr>
                    <th>No</th>
                    <th>상품명</th>
                    <th>판매가</th>
                    <th>주문자 명</th>
                    <th>상태</th>
                    <th>수량</th>
                    <th>등록일</th>
                    <th>색깔</th>
                    <th>사이즈</th>
                    <th>삭제</th>
                </tr>
            </thead>
            <tbody>
    {filteredOrders.map((order) =>
        order.orderItems.map((item, index) => {
            const size = item.clothesSize || item.shoesSize || "-"; // null이 아닌 값을 가져옴, 없으면 "-"
            return (
                <tr key={`${order.code}-${item.id}`}>
                    <td>{index + 1}</td>
                    <td>{item.name}</td>
                    <td>{item.price}</td>
                    <td>{order.userId}</td>
                    <td>
                        <div
                            className={`dropdown ${activeDropdown === order.code ? 'active' : ''}`}
                            onClick={() => handleDropdownToggle(order.code)}
                        >
                              {order.status === 0
                                ? "주문 대기"
                                : order.status === 1
                                ? "주문 완료"
                                : order.status === 2
                                ? "배송 대기"
                                : "알 수 없음"}
                            <span className="left-icon"></span>
                            <span className="right-icon"></span>
                            <div className="items">
                                <a
                                    href="#"
                                    onClick={() => handleStatusChange(order.code, 1)}
                                >
                                    주문 완료
                                </a>
                                <a
                                    href="#"
                                    onClick={() => handleStatusChange(order.code, 2)}
                                >
                                    배송 대기
                                </a>
                            </div>
                        </div>
                    </td>
                        <td>{item.amount}</td>
                        <td>{new Date(order.orderDate).toLocaleString()}</td>
                        <td>{item.color || "-"}</td> {/* color 컬럼 추가 */}
                        <td>{size}</td> {/* size 컬럼 추가 */}
                        <td>
                            <button className="delete_btn" onClick={(e) => handleDeleteButtonClick(order.no, e)}>
                                <span className="button-text">Delete</span>
                                    <span className="animation">
                                        <span className="paper-wrapper">
                                            <span className="paper"></span>
                                            </span>
                                            <span className="shredded-wrapper">
                                                <span className="shredded"></span>
                                            </span>
                                            <span className="can">
                                                <span className="filler"></span>
                                            </span>
                                        </span>
                                    </button>
                                </td>
                            </tr>
                        );
                    })
                )}
            </tbody>
        </table>
    );
}


export default BusinessOrderList;