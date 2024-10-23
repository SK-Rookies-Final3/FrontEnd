import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Business_ProductAdd.css';

export default function Business_ProductAdd() {
  const navigate = useNavigate();
  const [activeDropdown, setActiveDropdown] = useState(false); 
  const [description, setDescription] = useState(""); 
  const [category, setCategory] = useState(""); 
  const [productName, setProductName] = useState("");
  const [stockQuantity, setStockQuantity] = useState(""); 
  const dropdownRef = useRef(null); 

  const handleDropdownToggle = () => {
    if (!activeDropdown) {
      setActiveDropdown(true); 
      
    }
  };

  const handleStatusChange = (status) => {
    setCategory(status); 
    setActiveDropdown(false); // 상태 변경 후 드롭다운 닫기
  };


  const handleDescriptionChange = (event) => {
    setDescription(event.target.value); 
  };

  const handleProductNameChange = (event) => {
    setProductName(event.target.value); 
  };

  const handleStockQuantityChange = (event) => {
    setStockQuantity(event.target.value); 
  };

  const handleSubmit = () => {
    navigate('/business/product', {
      state: {
        productName,
        stockQuantity,
        category,
        description,
      },
    });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(false); 
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="businessadd-container">
      <div className="add-header">
        <span className="add-text">물품 등록</span>
        <button className='add-button' onClick={handleSubmit}>등록</button>
      </div>
      <div className='add-box'>
        <div className='input-row'> 
          <div className='wrap-input-2'>
            <input
              className="input"
              type="text"
              placeholder="상품명을 입력해주세요."
              value={productName}
              onChange={handleProductNameChange}
            />
            <span className="focus-border"></span>
          </div>
          <div className='wrap-input-2'>
            <input
              className="input"
              type="number"
              placeholder="재고 수량 입력"
              value={stockQuantity}
              onChange={handleStockQuantityChange}
            />
            <span className="focus-border"></span>
          </div>
          <div className={`add-dropdown ${activeDropdown ? 'active' : ''}`} ref={dropdownRef} onClick={handleDropdownToggle}>
            <p>{category || "카테고리"}</p> 
            <span className="left-icon"></span>
            <span className="right-icon"></span>
            {activeDropdown && ( 
              <div className="items">
                {['아우터', '상의', '하의', '치마', '신발', '모자', '악세사리', '가방'].map(item => (
                  <a key={item} href="#" onClick={(e) => { 
                      e.preventDefault(); 
                      handleStatusChange(item); 
                    }} style={{ '--i': 1 }}>
                    <span></span>{item}
                  </a>
                ))}
              </div>
            )}
          </div>
          <div className='file-upload'>
            <input type="file" id='Thumbnail' accept="image/*" style={{ display: 'none' }} />
            <label htmlFor="Thumbnail">썸네일 첨부</label>
            <input type="file" id='Detailed' accept="image/*" multiple style={{ display: 'none' }} />
            <label htmlFor='Detailed'>상세 사진 첨부</label>
          </div>
        </div>
        <div className='wrap-input-3'> 
          <textarea
            className="input"
            placeholder="상세 내용을 입력해주세요."
            value={description}
            onChange={handleDescriptionChange}
          />
          <span className="focus-border"></span>
        </div>
      </div>
    </div>
  );
}
