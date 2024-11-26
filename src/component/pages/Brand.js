import React, { useState } from 'react'; 
import '../css/Brand.css';
import { useNavigate } from 'react-router-dom';
import brandImage from '../../img/Nike.PNG'; // 이미지 경로 변경

export default function Brand() {
  const [hoveredIndex, setHoveredIndex] = useState(null); // 현재 호버된 카테고리의 인덱스 상태
  const navigate = useNavigate();

  const categories = [
    { label: '나이키', hoverText: 'Nike' },
    { label: '아디다스', hoverText: 'Adidas' },
    { label: '폴로', hoverText: 'Polo' },
    { label: '꼼데', hoverText: 'Comme des' },
    { label: '베이프', hoverText: 'Bape' },
    { label: '아미', hoverText: 'Ami' },
    { label: '보스', hoverText: 'Boss' },
    { label: '디젤', hoverText: 'Diesel' },
  ];

  const products = [ // 상품 데이터 배열
    { id: 1, title: '나이키 에어 포스 1 "07', price: '169,000', image: brandImage },
    { id: 2, title: '상품2', price: '100,000', image: brandImage },
    { id: 3, title: '상품3', price: '80,000', image: brandImage },
    { id: 4, title: '상품4', price: '90,000', image: brandImage },
    { id: 5, title: '상품5', price: '120,000', image: brandImage },
    { id: 6, title: '상품6', price: '60,000', image: brandImage },
    // 필요 시 추가 상품 데이터 추가
  ];

  const handleProductClick = (productId) => {
    navigate('/pages/shop/detail'); // 상세 페이지로 이동
  };

  return (
    <div className="brand-container">
      <aside className="brand-sidebar">
        <div className="logo">
          <h2>Category</h2>
        </div>
        <ul className="brand-links">
          {categories.map((category, index) => (
            <li
              key={index}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <span className="icon">{category.icon}</span>
              <span>
                {hoveredIndex === index ? category.hoverText : category.label}
              </span>
            </li>
          ))}
        </ul>
      </aside>
      <div className="brand-product-list">
        {products.map(product => (
            <div className="brand-card" key={product.id} > {/* 카드 너비 조정 */}
            <img 
                src={product.image} 
                className='brand-card-img-top' 
                alt={product.title} 
                onClick={() => handleProductClick(product.id)} 
                style={{ cursor: 'pointer' }} 
            />
            <div className='brand-card-body'>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ textAlign: 'left', cursor: 'pointer' }} onClick={() => handleProductClick(product.id)}>
                    <h5 className='brand-card-title'>{product.title}</h5>
                    <p className="brand-card-text">{product.price}</p>
                </div>
                <button
                    type="button"
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
                >
                </button>
                </div>
            </div>
            </div>
         ))}
        </div>
    </div>
  );
}
