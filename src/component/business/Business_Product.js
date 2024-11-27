import React, { useState, useEffect } from 'react';
import '../css/Business_Form.css';
import { FaSearch, FaPlus } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios'; // Axios를 import 합니다.

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

function BusinessProduct() {
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    const handleAddButtonClick = () => {
        navigate('/business/productadd');
    };

    return (
        <div className="business-container">
            <Sidebar />
            <div className="main-content">
                <div className="header">
                    <span className="store-text">My Store Product</span>
                    <div className="search-box">
                        <input
                            className="search-text"
                            type="text"
                            placeholder="Search Anything"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)} />
                        <div className="search-btn">
                            <FaSearch />
                        </div>
                    </div>
                    <button className="product-add-button" onClick={handleAddButtonClick}>
                        <span className="button__icon-wrapper">
                            <FaPlus className="button__icon-svg" />
                            <FaPlus className="button__icon-svg button__icon-svg--copy" />
                        </span>
                        물품등록
                    </button>
                </div>
                <ProductTable searchQuery={searchQuery} />
            </div>
        </div>
    );
}

function ProductTable({ searchQuery }) {
    const [products, setProducts] = useState([]);
    const [storeId, setStoreId] = useState(null);
    const accessToken = localStorage.getItem("accessToken");
    const userId = localStorage.getItem('id');

    useEffect(() => {
        const fetchStoreId = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL_APIgateway}/open-api/brand/store/`, {
                    headers: {
                        'Authorization': accessToken
                    }
                });

                const stores = Array.isArray(response.data) ? response.data : [response.data];

                const matchedStore = stores.find(store =>
                    String(store.userId).trim() === String(userId).trim()
                );

                if (matchedStore) {
                    setStoreId(matchedStore.id);
                    console.log('매칭된 Store ID:', matchedStore.id);
                } else {
                    console.warn('매칭되는 Store가 없습니다.');
                    console.log('LocalStorage ID:', userId);
                    console.log('Store User IDs:', stores.map(store => store.userId));
                    Swal.fire({
                        title: '경고',
                        text: '매칭되는 Store를 찾을 수 없습니다.',
                        icon: 'warning',
                        confirmButtonText: '확인'
                    });
                }
            } catch (error) {
                console.error('Store 정보를 가져오는 데 실패했습니다:', error);
                Swal.fire({
                    title: '오류',
                    text: 'Store 정보를 가져오는 데 실패했습니다.',
                    icon: 'error',
                    confirmButtonText: '확인'
                });
            }
        };

        fetchStoreId();
    }, [accessToken, userId]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_BASE_URL_APIgateway}/api/brand/product/owner`, {
                    method: 'GET',
                    headers: {
                        'Authorization': accessToken
                    }
                });

                if (!response.ok) {
                    throw new Error(`Error: ${response.status} ${response.statusText}`);
                }

                const data = await response.json();
                setProducts(data);

                console.log('상품 응답 데이터:', data);
            } catch (error) {
                console.error('상품을 불러오는 데 실패했습니다 or 상품이 없습니다.', error);
            }
        };

        if (storeId) {
            fetchProducts();
        }
    }, [accessToken, storeId]);

    const handleDeleteButtonClick = async (productCode, event) => {
        if (!storeId) {
            Swal.fire({
                title: '오류',
                text: 'Store ID가 설정되지 않았습니다.',
                icon: 'error',
                confirmButtonText: '확인'
            });
            return;
        }

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
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const deleteResponse = await fetch(`${process.env.REACT_APP_API_BASE_URL_APIgateway}/api/brand/product/owner/${storeId}/${productCode}`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': accessToken
                        }
                    });

                    if (!deleteResponse.ok) {
                        throw new Error(`Error: ${deleteResponse.status} ${deleteResponse.statusText}`);
                    }

                    const button = event.target.closest('.delete_btn');
                    const animation = button.querySelector('.animation');
                    const row = button.closest('tr');
                    animation.style.display = 'flex';
                    button.classList.add('click');

                    setTimeout(() => {
                        row.classList.add('fade-out');
                    }, 2000);

                    setTimeout(() => {
                        const updatedProducts = products.filter((product) => product.code !== productCode);
                        setProducts(updatedProducts);
                    }, 2500);
                } catch (error) {
                    console.error('상품 삭제에 실패했습니다:', error);
                }
            }
        });
    };

    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (!storeId) {
        return <div className="loading">Store ID를 가져오는 중...</div>;
    }

    return (
        <table className="product-table">
            <thead>
                <tr>
                    <th>No</th>
                    <th>상품명</th>
                    <th>판매가</th>
                    <th>카테고리</th>
                    <th>상태</th>
                    <th>재고</th>
                    <th>등록일</th>
                    <th>삭제</th>
                </tr>
            </thead>
            <tbody>
                {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                        <tr key={product.code}>
                            <td>{product.code}</td>
                            <td>{product.name}</td>
                            <td>{Number(product.price).toLocaleString()}원</td>
                            <td>{product.category}</td>
                            <td>{product.stock === 0 ? '품절' : '판매중'}</td>
                            <td>{product.stock}</td>
                            <td>{new Date(product.registerAt).toLocaleDateString()}</td>
                            <td>
                                <button className="delete_btn" onClick={(e) => handleDeleteButtonClick(product.code, e)}>
                                    <span className="button-text">삭제</span>
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
                    ))
                ) : (
                    <tr>
                        <td colSpan="8" style={{ textAlign: 'center' }}>
                            등록된 상품이 없습니다.
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    );
}

export default BusinessProduct;