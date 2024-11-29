import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/Brand.css';
import { useNavigate } from 'react-router-dom';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';

export default function Brand() {
  const [stores, setStores] = useState([]);
  const [products, setProducts] = useState([]);
  const [likedProducts, setLikedProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState(null);
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storeResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL_APIgateway}/open-api/brand/store/`);
        setStores(storeResponse.data);

        const productResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL_APIgateway}/open-api/brand/product/`);
        const sortedProducts = productResponse.data.sort((a, b) =>
          a.name.localeCompare(b.name, 'ko', { numeric: true })
        );
        setProducts(sortedProducts);
        setFilteredProducts(sortedProducts);
      } catch (error) {
        console.error('API Error:', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedBrand === null) {
      setFilteredProducts(products);
    } else {
      const selectedStore = stores.find((store) => store.name.toLowerCase() === selectedBrand.toLowerCase());
      if (selectedStore) {
        const filtered = products.filter((product) => product.storeId === selectedStore.id);
        setFilteredProducts(filtered);
      } else {
        setFilteredProducts([]);
      }
    }
  }, [selectedBrand, products, stores]);

  const handleBrandClick = (brandName) => {
    setSelectedBrand(brandName === selectedBrand ? null : brandName);
  };

  const handleAllProductsClick = () => {
    setSelectedBrand(null);
  };

  const handleProductClick = (productCode) => {
    navigate(`/pages/shop/detail/${productCode}`);
  };

  return (
    <div className="brand-container">
      <aside className="brand-sidebar">
        <div className="logo">
          <h2>Brand</h2>
        </div>
        <ul className="brand-links">
          <li className={selectedBrand === null ? 'active' : ''} onClick={handleAllProductsClick}>
            <span>전체 보기</span>
          </li>
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
                  aria-label={likedProducts.includes(product.code) ? 'Remove from favorites' : 'Add to favorites'}
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
