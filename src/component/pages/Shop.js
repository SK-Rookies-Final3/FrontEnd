import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/Shop.css';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import { TbJacket } from "react-icons/tb";
import { PiTShirt, PiPants } from "react-icons/pi";
import { GiSkirt, GiBigDiamondRing } from "react-icons/gi";
import { IoFootstepsOutline, IoBagHandleOutline } from "react-icons/io5";
import { FaRedhat } from "react-icons/fa6";

export default function Shop() {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  // const [likedProducts, setLikedProducts] = useState([]);
  const [products, setProducts] = useState([]); // 모든 상품 데이터
  const [filteredProducts, setFilteredProducts] = useState([]); // 필터링된 상품 데이터
  const [selectedCategory, setSelectedCategory] = useState(''); // 선택된 카테고리 상태
  const navigate = useNavigate();

  // 카테고리 아이콘과 이름 유지
  const categories = [
    { id: '', icon: <TbJacket />, label: '전체', hoverText: 'All' }, // 전체 보기
    { id: '아우터', icon: <TbJacket />, label: '아우터', hoverText: 'Outerwear' },
    { id: '상의', icon: <PiTShirt />, label: '상의', hoverText: 'Tops' },
    { id: '하의', icon: <PiPants />, label: '하의', hoverText: 'Bottoms' },
    { id: '치마', icon: <GiSkirt />, label: '치마', hoverText: 'Skirts' },
    { id: '신발', icon: <IoFootstepsOutline />, label: '신발', hoverText: 'Shoes' },
    { id: '모자', icon: <FaRedhat />, label: '모자', hoverText: 'Hats' },
    { id: '가방', icon: <IoBagHandleOutline />, label: '가방', hoverText: 'Bags' },
    { id: '악세사리', icon: <GiBigDiamondRing />, label: '악세사리', hoverText: 'Accessories' },
  ];

  // 백엔드에서 상품 데이터 가져오기
  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL_APIgateway}/open-api/brand/product`); // 백엔드 엔드포인트
      const sortedProducts = response.data.sort((a, b) => {
        return a.name.localeCompare(b.name, 'ko', { numeric: true });
      });
      setProducts(sortedProducts); 
      setFilteredProducts(sortedProducts); 
      console.log(sortedProducts)
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  };

  useEffect(() => {
    fetchProducts(); // 컴포넌트 로드 시 데이터 가져오기
  }, []);

  // 카테고리 선택 핸들러
  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId); // 선택된 카테고리 상태 업데이트
    if (categoryId === '') {
      setFilteredProducts(products); // 카테고리가 비어 있으면 모든 상품 표시
    } else {
      const filtered = products.filter((product) => product.category === categoryId);
      setFilteredProducts(filtered); // 선택된 카테고리에 해당하는 상품만 필터링
    }
  };

  // const handleLikeClick = (productCode) => {
  //   setLikedProducts((prev) => {
  //     if (prev.includes(productCode)) {
  //       return prev.filter((id) => id !== productCode);
  //     } else {
  //       return [...prev, productCode];
  //     }
  //   });

  //   const likedProduct = products.find((product) => product.code === productCode);
  //   sessionStorage.setItem('likedProduct', JSON.stringify(likedProduct));
  // };

  const handleProductClick = (productCode) => {
    navigate(`/pages/shop/detail/${productCode}`); // 상세 페이지 이동
  };

  return (
    <div className="shop-container">
      {/* 사이드바 */}
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
              onClick={() => handleCategoryClick(category.id)} // 카테고리 클릭
              style={{ cursor: 'pointer', fontWeight: selectedCategory === category.id ? 'bold' : 'normal' }}
            >
              <span className="icon">{category.icon}</span>
              <span>
                {hoveredIndex === index ? category.hoverText : category.label}
              </span>
            </li>
          ))}
        </ul>
      </aside>

      {/* 상품 리스트 */}
      <div className="product-list">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div className="shop-card" key={product.code}>
              <img
                src={product.thumbnail}
                className="shop-card-img-top"
                alt={product.name}
                onClick={() => handleProductClick(product.code)}
                style={{ cursor: 'pointer' }}
              />
              <div className="card-body" >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div
                    style={{ textAlign: 'left', cursor: 'pointer' }}
                  >
                    <h5 className="card-title" style={{ marginLeft: '10px' }}>{product.name}</h5>
                    <p className="card-text" style={{ marginLeft: '10px' }}>{product.price.toLocaleString()}원</p>
                  </div>
                  {/* <button
                    type="button"
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
                    onClick={() => handleLikeClick(product.code)}
                  >
                    {likedProducts.includes(product.code) ? (
                      <AiFillHeart size={24} color="#FF5733" />
                    ) : (
                      <AiOutlineHeart size={24} color="#FF5733" />
                    )}
                  </button> */}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-products-message">
            등록된 상품이 없습니다 😞
          </div>
        )}
      </div>
    </div>
  );
}
