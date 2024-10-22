import React, { useState } from 'react';
import '../css/Business_Form.css';
import { FaSearch, FaPlus } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';

function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <div className="sidebar">
            <ul>
                <li className={location.pathname === '/business/product' ? 'active' : ''}
                    onClick={() => navigate('/business/product')}>물품 목록 및 확인</li>
                <li className={location.pathname === '/business/orderlist' ? 'active' : ''}
                    onClick={() => navigate('/business/orderlist')}>주문 목록 확인</li>
                <li className={location.pathname === '/business/statistics' ? 'active' : ''}
                    onClick={() => navigate('/business/statistics')}>통계</li>
            </ul>
        </div>
    );
}

function BusinessProduct() {
    const [searchQuery, setSearchQuery] = useState('');

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
                    {/* <button className="add-button">물품등록</button> */}
                    <button className="add-button">
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
    const [products, setProducts] = useState([
        { no: 1, name: '1', price: '150,000', category: '전자제품', status: '판매중', stock: 12, registered: '2024.10.11', updated: '2024.10.16' },
        { no: 2, name: '2', price: '150,000', category: '의류', status: '판매중', stock: 12, registered: '2024.10.11', updated: '2024.10.16' },
        { no: 3, name: '3', price: '150,000', category: '가전', status: '품절', stock: 0, registered: '2024.10.11', updated: '2024.10.16' },
        { no: 4, name: '4', price: '150,000', category: '주방용품', status: '판매중', stock: 13, registered: '2024.10.11', updated: '2024.10.16' },
        { no: 5, name: '5', price: '150,000', category: '의류', status: '품절', stock: 0, registered: '2024.10.11', updated: '2024.10.16' },
        { no: 6, name: '6', price: '150,000', category: '가전', status: '판매중', stock: 20, registered: '2024.10.11', updated: '2024.10.16' },
        { no: 7, name: '7', price: '150,000', category: '전자제품', status: '판매중', stock: 7, registered: '2024.10.11', updated: '2024.10.16' },
    ]);

    const handleDeleteButtonClick = (productNo, event) => {
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
                    const updatedProducts = products.filter((product) => product.no !== productNo);
                    setProducts(updatedProducts);
                }, 2500);
            }
        });
    };

    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
                    <th>수정일</th>
                    <th>삭제</th>
                </tr>
            </thead>
            <tbody>
                {filteredProducts.map((product) => (
                    <tr key={product.no}>
                        <td>{product.no}</td>
                        <td>{product.name}</td>
                        <td>{product.price}</td>
                        <td>{product.category}</td>
                        <td>{product.status}</td>
                        <td>{product.stock}</td>
                        <td>{product.registered}</td>
                        <td>{product.updated}</td>
                        <td>
                            <button className="delete_btn" onClick={(e) => handleDeleteButtonClick(product.no, e)}>
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

export default BusinessProduct;