import React, { useState, useEffect, useMemo } from 'react';
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
    const [users, setUsers] = useState([]); // 사용자 데이터를 저장할 상태
    const [activeDropdown, setActiveDropdown] = useState(null);

    // 주문 데이터 가져오기
    useEffect(() => {
        const fetchOrders = async () => {
            try {

                // console.log("/////////Token////////");
                // console.log(`${sessionStorage.getItem("accessToken")}`);
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
                // console.log("응답 데이터 (주문):", data);
                setOrders(data); // 주문 데이터를 상태에 저장
            } catch (err) {
                // console.error('주문 조회를 가져오는 데 실패했습니다:', err);
            }
        };

        fetchOrders();
    }, []);

    // 사용자 데이터 가져오기
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch(
                    `${process.env.REACT_APP_API_BASE_URL}/api/user/master`,
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
                // console.log("응답 데이터 (사용자):", data);
                setUsers(data); // 사용자 데이터를 상태에 저장
            } catch (err) {
                // console.error('사용자 정보를 가져오는 데 실패했습니다:', err);
            }
        };

        fetchUsers();
    }, []);

    // userId를 nickname으로 매핑하기 위한 맵 생성
    const userMap = useMemo(() => {
        const map = {};
        users.forEach(user => {
            map[user.id] = user.nickname;
        });
        return map;
    }, [users]);

    const handleStatusChange = async (orderCode, newStatus) => {
        try {
            const response = await fetch(
                `${process.env.REACT_APP_API_BASE_URL_APIgateway}/api/order/owner/${orderCode}/status`,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${sessionStorage.getItem("accessToken")}`,
                    },
                    body: JSON.stringify({ status: newStatus }),
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            Swal.fire({
                icon: 'success',
                title: '상태가 성공적으로 변경되었습니다.',
                background: '#F0EADC',
                confirmButtonColor: '#754F23',
            });

            // 주문 상태를 업데이트
            setOrders((prevOrders) =>
                prevOrders.map((order) =>
                    order.code === orderCode ? { ...order, status: newStatus } : order
                )
            );

            setActiveDropdown(null);
        } catch (err) {
            // console.error('상태 변경에 실패했습니다:', err);
            Swal.fire({
                icon: 'error',
                title: '상태 변경에 실패했습니다.',
                text: '다시 시도해 주세요.',
                background: '#F0EADC',
                confirmButtonColor: '#754F23',
            });
        }
    };

    const handleDropdownToggle = (orderCode, itemId) => {
        const dropdownKey = `${orderCode}-${itemId}`;
        if (activeDropdown === dropdownKey) {
            setActiveDropdown(null);
        } else {
            setActiveDropdown(dropdownKey);
        }
    };

    const sortedOrders = [...orders].sort(
        (a, b) => new Date(b.orderDate) - new Date(a.orderDate)
    );

    // 검색 쿼리에 따라 주문 필터링
    const filteredOrders = sortedOrders.filter((order) =>
        order.orderItems.some((item) =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );

    return (
        <table className="product-table">
            <thead>
                <tr>
                    <th>상품명</th>
                    <th>판매가</th>
                    <th>주문자 명</th>
                    <th>상태</th>
                    <th>수량</th>
                    <th>등록일</th>
                    <th>색깔</th>
                    <th>사이즈</th>
                </tr>
            </thead>
            <tbody>
                {filteredOrders.map((order, orderIndex) =>
                    order.orderItems.map((item, index) => {
                        const size = item.clothesSize || item.shoesSize || "-"; // null이 아닌 값을 가져옴, 없으면 "-"
                        return (
                            <tr key={`${order.code}-${item.id}`}>
                                <td>{item.name}</td>
                                <td>{item.price}</td>
                                <td>
                                    {/* userId 대신 nickname 표시 */}
                                    {userMap[order.userId] || "알 수 없는 사용자"}
                                </td>
                                <td>
                                    <div
                                        className={`dropdown ${activeDropdown === `${order.code}-${item.id}` ? 'active' : ''}`}
                                        onClick={() => handleDropdownToggle(order.code, item.id)}
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
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleStatusChange(order.code, 0);
                                                }}
                                            >
                                                주문 대기
                                            </a>
                                            <a
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleStatusChange(order.code, 1);
                                                }}
                                            >
                                                주문 완료
                                            </a>
                                            <a
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleStatusChange(order.code, 2);
                                                }}
                                            >
                                                배송 대기
                                            </a>
                                        </div>
                                    </div>
                                </td>
                                <td>{item.stock}</td>
                                <td>{new Date(order.orderDate).toLocaleString()}</td>
                                <td>{item.color || "-"}</td> {/* color 컬럼 추가 */}
                                <td>{item.size}</td> {/* size 컬럼 추가 */}
                            </tr>
                        );
                    })
                )}
            </tbody>
        </table>
    );
}

export default BusinessOrderList;
