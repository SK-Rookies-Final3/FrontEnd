import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/Brand.css';
import { useNavigate } from 'react-router-dom';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';

export default function Brand() {
  const [stores, setStores] = useState([]); // store 데이터를 관리하는 상태
  const [products, setProducts] = useState([]); // 전체 상품 데이터 상태
  const [likedProducts, setLikedProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]); // 필터링된 상품 데이터
  const [selectedBrand, setSelectedBrand] = useState(null); // 선택된 브랜드 상태
  const navigate = useNavigate();

  const handleLikeClick = (productCode) => {
    setLikedProducts((prev) => {
      if (prev.includes(productCode)) {
        return prev.filter((id) => id !== productCode);
      } else {
        return [...prev, productCode];
      }
    });

    const likedProduct = products.find((product) => product.code === productCode);
    sessionStorage.setItem('likedProduct', JSON.stringify(likedProduct));
  };

  // API로 데이터 가져오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        const storeResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL_APIgateway}/open-api/brand/store/`);
        console.log('Stores:', storeResponse.data);
        setStores(storeResponse.data);

        const productResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL_APIgateway}/open-api/brand/product/`);
        const sortedProducts = productResponse.data.sort((a, b) => {
          return a.name.localeCompare(b.name, 'ko', { numeric: true })
        });
        console.log('Products:', productResponse.data);
        setProducts(productResponse.data);
        setFilteredProducts(productResponse.data); // 초기에는 전체 상품 표시
      } catch (error) {
        console.error('API Error:', error);
      }
    };
    fetchData();
  }, []);

  // 선택된 브랜드에 따라 상품 필터링
  useEffect(() => {
    if (selectedBrand === null) {
      setFilteredProducts(products); // 전체 상품 표시
    } else {
      // 선택된 스토어 데이터 가져오기
      const selectedStore = stores.find((store) => store.name.toLowerCase() === selectedBrand.toLowerCase());
      if (selectedStore) {
        // storeId를 기준으로 상품 필터링
        const filtered = products.filter((product) => product.storeId === selectedStore.id);
        console.log('Filtered Products:', filtered);
        setFilteredProducts(filtered);
      } else {
        console.warn(`No store found for: ${selectedBrand}`);
        setFilteredProducts([]);
      }
    }
  }, [selectedBrand, products, stores]);

  // 브랜드 버튼 클릭 핸들러
  const handleBrandClick = (brandName) => {
    setSelectedBrand(brandName === selectedBrand ? null : brandName); // 같은 브랜드 클릭 시 선택 해제
  };

  // 전체 보기 버튼 클릭 핸들러
  const handleAllProductsClick = () => {
    setSelectedBrand(null); // 선택된 브랜드 초기화
  };

  // 상품 클릭 핸들러
  const handleProductClick = (productCode) => {
    navigate(`/pages/shop/detail/${productCode}`); // 상세 페이지로 이동
  };


  return (
    <div className="brand-container">
      {/* 사이드바 */}
      <aside className="brand-sidebar">
        <div className="logo">
          <h2>Brand</h2>
        </div>
        <ul className="brand-links">
          {/* 전체 상품 보기 버튼 */}
          <li
            className={selectedBrand === null ? 'active' : ''}
            onClick={handleAllProductsClick}
          >
            <span>전체 보기</span>

          </li>
          {/* 개별 브랜드 버튼 */}
          {stores.map((store, index) => (
            <li
              key={index}
              className={selectedBrand === store.name ? 'active' : ''}
              onClick={() => handleBrandClick(store.name)}
            >
              <span>{store.name}</span>

            </li>

          ))}
        </ul>
      </aside>

      {/* 상품 리스트 */}
      <div className="brand-product-list">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div className="brand-card" key={product.id}>
              <img
                src={`${process.env.REACT_APP_API_BASE_URL_APIgateway}/uploads/${product.thumbnail?.split(/[/\\]/).pop()}`}
                className="brand-card-img-top"
                alt={product.title}
                onClick={() => handleProductClick(product.code)}
              />
              <div className="brand-card-body" onClick={() => handleProductClick(product.code)}>
                <div className="brand-info">
                  <h5 className="brand-card-title">{product.name}</h5>
                  <p className="brand-card-text">{product.price.toLocaleString()}원</p>
                </div>
                <button
                  type="button"
                  className="like-button"
                  onClick={() => handleLikeClick(product.code)}
                  aria-label={likedProducts.includes(product.code) ? "Remove from favorites" : "Add to favorites"}
                >
                  {likedProducts.includes(product.code) ? (
                    <AiFillHeart size={24} color="#FF5733" />
                  ) : (
                    <AiOutlineHeart size={24} color="#FF5733" />
                  )}
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="no-products">해당 브랜드에 상품이 없습니다.</p>
        )}
      </div>
    </div>
  );
}