import React, { useState } from 'react'; 
import { useNavigate } from 'react-router-dom';
import '../css/Shop.css';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai'; // 채워진 하트 아이콘 추가
import { TbJacket } from "react-icons/tb";
import { PiTShirt } from "react-icons/pi";
import { PiPants } from "react-icons/pi";
import { GiSkirt } from "react-icons/gi";
import { IoFootstepsOutline } from "react-icons/io5";
import { FaRedhat } from "react-icons/fa6";
import { IoBagHandleOutline } from "react-icons/io5";
import { GiBigDiamondRing } from "react-icons/gi";
import productImage from '../../img/product.jpg'; // 이미지 경로 변경

export default function Shop() {
  const [hoveredIndex, setHoveredIndex] = useState(null); // 현재 호버된 카테고리의 인덱스 상태
  const [likedProducts, setLikedProducts] = useState([]); // 좋아요 상태 배열
  const navigate = useNavigate();

  const categories = [
    { icon: <TbJacket />, label: '겉옷', hoverText: 'Outerwear' },
    { icon: <PiTShirt />, label: '상의', hoverText: 'Tops' },
    { icon: <PiPants />, label: '하의', hoverText: 'Bottoms' },
    { icon: <GiSkirt />, label: '치마', hoverText: 'Skirts' },
    { icon: <IoFootstepsOutline />, label: '신발', hoverText: 'Shoes' },
    { icon: <FaRedhat />, label: '모자', hoverText: 'Hats' },
    { icon: <IoBagHandleOutline />, label: '가방', hoverText: 'Bags' },
    { icon: <GiBigDiamondRing />, label: '장신구', hoverText: 'Accessories' },
  ];

  const products = [ // 상품 데이터 배열
    { id: 1, title: '비비안웨스트우드', price: '150,000', image: productImage },
    { id: 2, title: '상품2', price: '100,000', image: productImage },
    { id: 3, title: '상품3', price: '80,000', image: productImage },
    { id: 4, title: '상품4', price: '90,000', image: productImage },
    { id: 5, title: '상품5', price: '120,000', image: productImage },
    { id: 6, title: '상품6', price: '60,000', image: productImage },
    // 필요 시 추가 상품 데이터 추가
  ];

  const handleLikeClick = (productId) => {
    setLikedProducts(prev => {
      if (prev.includes(productId)) {
        // 이미 좋아요가 눌렸다면 제거
        return prev.filter(id => id !== productId);
      } else {
        // 아니면 추가
        return [...prev, productId];
      }
    });
    
    const likedProduct = products.find(product => product.id === productId);
    localStorage.setItem('likedProduct', JSON.stringify(likedProduct));
  };

  const handleProductClick = (productId) => {
    navigate('/page/shop/detail'); // 상세 페이지로 이동
  };

  return (
    <div className="shop-container">
      <aside className="shop-sidebar">
        <div className="logo">
          <h2>Category</h2>
        </div>
        <ul className="shop-links">
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
      <div className="product-list">
        {products.map(product => (
            <div className="shop-card" key={product.id}> {/* 카드 너비 조정 */}
            <img 
                src={product.image} 
                className='shop-card-img-top' 
                alt={product.title} 
                onClick={() => handleProductClick(product.id)} 
                style={{ cursor: 'pointer' }} 
            />
            <div className='card-body'>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ textAlign: 'left', cursor: 'pointer' }} onClick={() => handleProductClick(product.id)}>
                    <h5 className='card-title'>{product.title}</h5>
                    <p className="card-text">{product.price}</p>
                </div>
                <button
                    type="button"
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
                    onClick={() => handleLikeClick(product.id)}
                >
                    {likedProducts.includes(product.id) ? (
                    <AiFillHeart size={24} color="#FF5733" /> // 채워진 하트 아이콘
                    ) : (
                    <AiOutlineHeart size={24} color="#FF5733" /> // 빈 하트 아이콘
                    )}
                </button>
                </div>
            </div>
            </div>
         ))}
        </div>
    </div>
  );
}
