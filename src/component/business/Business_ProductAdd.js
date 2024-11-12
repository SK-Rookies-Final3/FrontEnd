import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../css/Business_ProductAdd.css';
import { TbJacket, TbKarate } from "react-icons/tb";
import { PiTShirt } from "react-icons/pi";
import { PiPants } from "react-icons/pi";
import { GiSkirt } from "react-icons/gi";
import { IoFootstepsOutline } from "react-icons/io5";
import { FaRedhat } from "react-icons/fa6";
import { IoBagHandleOutline } from "react-icons/io5";
import { GiBigDiamondRing } from "react-icons/gi";

export default function Business_ProductAdd() {
  const navigate = useNavigate();
  const [activeDropdown, setActiveDropdown] = useState(false);
  const [colorDropdownActive, setColorDropdownActive] = useState(false);
  const [sizeDropdownActive, setSizeDropdownActive] = useState(false);
  const [description, setDescription] = useState(""); 
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState(""); 
  const [color, setColor] = useState("");
  const [size, setSize] = useState("");
  const [productName, setProductName] = useState("");
  const [stockQuantity, setStockQuantity] = useState(""); 
  const [hoveredColor, setHoveredColor] = useState(""); // 색상 마우스 오버 상태
  const dropdownRef_CT = useRef(null); 
  const dropdownRef_Color = useRef(null); 
  const dropdownRef_Size = useRef(null); 

  const handleDropdownToggle = () => {
    if (!activeDropdown) {
      setActiveDropdown(true); 
    }
  };

  const handleStatusChange = (status) => {
    setCategory(status); 
    setActiveDropdown(false);
    setSize("");
    setColor("");
  };

  const handleColorChange = (color) => {
    setColor(color);
    setColorDropdownActive(false);
  };

  const handleSizeChange = (size) => {
    setSize(size);
    setSizeDropdownActive(false);
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

  const handlePriceChange = (event) => {
    setPrice(event.target.value);
  };

  const handleSubmit = () => {
    Swal.fire({
      title: '수정이 안됩니다!',
      html: '수정을 원하시면 "취소", 수정 필요없이 등록 하고<br/> 싶으시다면 "확인"버튼을 누르세요',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: '확인',
      cancelButtonText: '취소',
    }).then((result) => {
      if (result.isConfirmed) {
        navigate('/business/product', {
          state: {
            productName,
            stockQuantity,
            price,
            category,
            color,
            size,
            description,
          },
        });
      }
    });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef_CT.current && !dropdownRef_CT.current.contains(event.target)) {
        setActiveDropdown(false); 
      }
      if (dropdownRef_Color.current && !dropdownRef_Color.current.contains(event.target)) {
        setColorDropdownActive(false);
      }
      if (dropdownRef_Size.current && !dropdownRef_Size.current.contains(event.target)) {
        setSizeDropdownActive(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 마우스 오버 이벤트 핸들러
  const handleColorMouseEnter = (color) => {
    setHoveredColor(color);
  };

  const handleColorMouseLeave = () => {
    setHoveredColor("");
  };

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
          <div className='wrap-input-2 stock-quantity'>
            <input
              className="input"
              type="number"
              placeholder="재고 수량 입력"
              value={stockQuantity}
              onChange={handleStockQuantityChange}
            />
            <span className="focus-border"></span>
          </div>
          <div className='wrap-input-2'>
            <input
              className="input"
              type="number"
              placeholder="가격 입력" // 가격 입력 필드 추가
              value={price}
              onChange={handlePriceChange}
            />
            <span className="focus-border"></span>
          </div>
          <div className={`add-dropdown ${activeDropdown ? 'active' : ''}`} ref={dropdownRef_CT} onClick={handleDropdownToggle}>
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

          {/* 색상 변경 드롭다운 */}
          <div className={`add-dropdown ${colorDropdownActive ? 'active' : ''}`} ref={dropdownRef_Color} onClick={() => setColorDropdownActive(!colorDropdownActive)}>
            <p>{color || "색상 선택"}</p>
            <span className="left-icon"></span>
            <span className="right-icon"></span>
            {colorDropdownActive && (
              <div className="items">
                {[
                  { name: '빨강', color: 'red', english: 'Red' },
                  { name: '주황', color: 'orange', english: 'Orange' },
                  { name: '노랑', color: 'yellow', english: 'Yellow' },
                  { name: '초록', color: 'green', english: 'Green' },
                  { name: '파랑', color: 'blue', english: 'Blue' },
                  { name: '보라', color: 'purple', english: 'Purple' },
                  { name: '갈색', color: 'brown', english: 'Brown' },
                  { name: '회색', color: 'gray', english: 'Gray' },
                  { name: '흰색', color: 'white', english: 'White' },
                  { name: '검정색', color: 'black', english: 'Black' }
                ].map(item => (
                  <a
                    key={item.name}
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handleColorChange(item.name);
                    }}
                    onMouseEnter={() => handleColorMouseEnter(item.english)}
                    onMouseLeave={handleColorMouseLeave}
                    style={{ '--i': 1 }}
                  >
                    <span className="color-circle" style={{ backgroundColor: item.color }}></span>
                    {hoveredColor === item.english ? item.english : item.name}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* 사이즈 변경 드롭다운 */}
          <div className={`add-dropdown ${sizeDropdownActive ? 'active' : ''}`} ref={dropdownRef_Size} onClick={() => setSizeDropdownActive(!sizeDropdownActive)}>
            <p>{size || "사이즈 선택"}</p>
            <span className="left-icon"></span>
            <span className="right-icon"></span>
            {sizeDropdownActive && (
              <div className="items">
                {(category === '신발' ? ['220', '230', '240', '250', '260', '270', '280'] : ['S', 'M', 'L', 'FREE']).map(item => (
                  <a key={item} href="#" onClick={(e) => {
                    e.preventDefault();
                    handleSizeChange(item);
                  }} style={{ '--i': 1 }}>
                    <span></span>{item}
                  </a>
                ))}
              </div>
            )}
          </div>

          <div className='file-upload'>
            <input type="file" id='Thumbnail' accept="image/*" multiple style={{ display: 'none' }} />
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
