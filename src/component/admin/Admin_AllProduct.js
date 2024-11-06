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
                <li className={location.pathname === '/admin/userlist' ? 'active' : ''}
                    onClick={() => navigate('/admin/userlist')}>사용자 목록</li>
                <li className={location.pathname === '/admin/management' ? 'active' : ''}
                    onClick={() => navigate('/admin/management')}>기업 승인 및 거절</li>
                <li className={location.pathname === '/admin/allproduct' ? 'active' : ''}
                    onClick={() => navigate('/admin/allproduct')}>물품 목록 및 확인</li>
                <li className={location.pathname === '/admin/statistics' ? 'active' : ''}
                    onClick={() => navigate('/admin/statistics')}>통계</li>
                <li onClick={handleLogout}>로그아웃</li>
            </ul>
        </div>
    );
}

function AdminProduct() {
    const [searchQuery, setSearchQuery] = useState('');
    const [products, setProducts] = useState([
        { no: 1, name: '1', price: '150,000', category: '전자제품', status: '판매중', stock: 12, registered: '2024.10.11', updated: '2024.10.16' },
        { no: 2, name: '2', price: '150,000', category: '의류', status: '판매중', stock: 12, registered: '2024.10.11', updated: '2024.10.16' },
        { no: 3, name: '3', price: '150,000', category: '가전', status: '품절', stock: 0, registered: '2024.10.11', updated: '2024.10.16' },
        { no: 4, name: '4', price: '150,000', category: '주방용품', status: '판매중', stock: 13, registered: '2024.10.11', updated: '2024.10.16' },
        { no: 5, name: '5', price: '150,000', category: '의류', status: '품절', stock: 0, registered: '2024.10.11', updated: '2024.10.16' },
        { no: 6, name: '6', price: '150,000', category: '가전', status: '판매중', stock: 20, registered: '2024.10.11', updated: '2024.10.16' },
        { no: 7, name: '7', price: '150,000', category: '전자제품', status: '판매중', stock: 7, registered: '2024.10.11', updated: '2024.10.16' },
    ]);

    const navigate = useNavigate();

    // 상태를 기반으로 productall-text의 정보를 동적으로 계산
    const totalProducts = products.length;
    const availableProducts = products.filter(product => product.status === '판매중').length;
    const outOfStockProducts = products.filter(product => product.status === '품절').length;

    return (
        <div className="business-container">
            <Sidebar />
            <div className="main-content">
                <div className="header">
                    <span className="productall-text" style={{
                        marginLeft: '30px',
                        fontSize: '20px',
                        fontWeight: 'bold',
                        backgroundColor: '#EAE1D3',
                        padding: '5px 15px',
                        borderRadius: '20px'
                    }}>
                        전체: {totalProducts}개 | 판매중: {availableProducts}개 | 품절: {outOfStockProducts}개
                    </span>
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
                </div>
                <ProductTable products={products} setProducts={setProducts} searchQuery={searchQuery} />
            </div>
        </div>
    );
}

function ProductTable({ products, setProducts, searchQuery }) {
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
                    setProducts(updatedProducts); // 상태 업데이트
                }, 2500);
            }
        });
    };

    // searchQuery에 따라 필터링된 제품 목록
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

export default AdminProduct;