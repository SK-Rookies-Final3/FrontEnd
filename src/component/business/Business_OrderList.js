import React, { useState } from 'react';
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
                localStorage.removeItem("accessToken");
                localStorage.removeItem("role");
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
    const [orders, setOrders] = useState([
        { no: 1, name: '1', price: '150,000', customer: '주문자1', status: '배송대기', quantity: 12, registered: '2024.10.11', updated: '2024.10.16' },
        { no: 2, name: '2', price: '150,000', customer: '주문자2', status: '배송 중', quantity: 12, registered: '2024.10.11', updated: '2024.10.16' },
        { no: 3, name: '3', price: '150,000', customer: '주문자3', status: '취소', quantity: 3, registered: '2024.10.11', updated: '2024.10.16' },
        { no: 4, name: '4', price: '150,000', customer: '주문자4', status: '취소', quantity: 13, registered: '2024.10.11', updated: '2024.10.16' },
        { no: 5, name: '5', price: '150,000', customer: '주문자5', status: '결제 완료', quantity: 5, registered: '2024.10.11', updated: '2024.10.16' },
        { no: 6, name: '6', price: '150,000', customer: '주문자6', status: '완료', quantity: 20, registered: '2024.10.11', updated: '2024.10.16' },
        { no: 7, name: '7', price: '150,000', customer: '주문자7', status: '판매중', quantity: 7, registered: '2024.10.11', updated: '2024.10.16' },
    ]);

    const [activeDropdown, setActiveDropdown] = useState(null);

    const handleStatusChange = (orderNo, newStatus) => {
        setOrders((prevOrders) =>
            prevOrders.map((order) =>
                order.no === orderNo ? { ...order, status: newStatus } : order
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
        order.name.toLowerCase().includes(searchQuery.toLowerCase())
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
                    <th>수정일</th>
                    <th>삭제</th>
                </tr>
            </thead>
            <tbody>
                {filteredOrders.map((order) => (
                    <tr key={order.no}>
                        <td>{order.no}</td>
                        <td>{order.name}</td>
                        <td>{order.price}</td>
                        <td>{order.customer}</td>
                        <td>
                            <div className={`dropdown ${activeDropdown === order.no ? 'active' : ''}`} onClick={() => handleDropdownToggle(order.no)}>
                                {order.status}
                                <span className="left-icon"></span>
                                <span className="right-icon"></span>
                                <div className="items">
                                    <a href="#" onClick={() => handleStatusChange(order.no, '주문완료')} style={{ '--i': 1 }}><span></span>주문완료</a>
                                    <a href="#" onClick={() => handleStatusChange(order.no, '배송대기')} style={{ '--i': 2 }}><span></span>배송대기</a>
                                    <a href="#" onClick={() => handleStatusChange(order.no, '배송 중')} style={{ '--i': 3 }}><span></span>배송 중</a>
                                    <a href="#" onClick={() => handleStatusChange(order.no, '배송완료')} style={{ '--i': 4 }}><span></span>배송완료</a>
                                    <a href="#" onClick={() => handleStatusChange(order.no, '주문취소')} style={{ '--i': 5 }}><span></span>주문취소</a>
                                </div>
                            </div>
                        </td>
                        <td>{order.quantity}</td>
                        <td>{order.registered}</td>
                        <td>{order.updated}</td>
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
                ))}
            </tbody>
        </table>
    );
}

export default BusinessOrderList;