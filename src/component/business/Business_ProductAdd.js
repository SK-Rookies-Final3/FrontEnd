import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios'; // axios 임포트
import '../css/Business_ProductAdd.css';
import { TbJacket, TbKarate } from "react-icons/tb";
import { PiTShirt, PiPants } from "react-icons/pi";
import { GiSkirt, GiBigDiamondRing } from "react-icons/gi";
import { IoFootstepsOutline, IoBagHandleOutline } from "react-icons/io5";
import { FaRedhat } from "react-icons/fa6";

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
  const [storeId, setStoreId] = useState(null); // storeId 저장

  const [thumbnail, setThumbnails] = useState([]); // 썸네일 이미지 File 객체 배열
  const [images, setDetailedImages] = useState([]); // 상세 이미지 File 객체 배열

  const dropdownRef_CT = useRef(null);
  const dropdownRef_Color = useRef(null);
  const dropdownRef_Size = useRef(null);

  // 로컬스토리지에서 로그인된 사용자의 id 가져오기
  const userId = sessionStorage.getItem('id');

  useEffect(() => {
    const fetchStoreId = async () => {
      if (!userId) {
        Swal.fire({
          title: '로그인 필요',
          text: '사용자가 로그인되지 않았습니다.',
          icon: 'error',
        });
        return;
      }

      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL_APIgateway}/open-api/brand/store/`);
        // 받은 스토어 목록에서 userId가 일치하는 스토어 필터링
        const userStores = response.data.filter(store => store.userId === parseInt(userId, 10));
        if (userStores.length === 0) {
          Swal.fire({
            title: '스토어 없음',
            text: '해당 사용자의 스토어가 없습니다.',
            icon: 'error',
          });
        } else {
          // 유일한 storeId를 저장
          setStoreId(userStores[0].id);
        }
      } catch (err) {
        console.error(err);
        Swal.fire({
          title: '스토어 정보 오류',
          text: '스토어 정보를 가져오는 중 오류가 발생했습니다.',
          icon: 'error',
        });
      }
    };

    fetchStoreId();
  }, [userId]);

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

  // 썸네일 이미지 첨부 핸들러
  const handleThumbnailChange = (event) => {
    const files = event.target.files;
    if (files) {
      const selectedFiles = Array.from(files);
      if (selectedFiles.length > 3) {
        Swal.fire({
          title: '이미지 수 초과',
          text: '썸네일 이미지는 최대 3개까지 첨부할 수 있습니다.',
          icon: 'warning',
        });
        return;
      }

      setThumbnails(selectedFiles);
    }
  };

  // 상세 이미지 첨부 핸들러
  const handleDetailedImagesChange = (event) => {
    const files = event.target.files;
    if (files) {
      const selectedFiles = Array.from(files);
      if (selectedFiles.length > 10) {
        Swal.fire({
          title: '이미지 수 초과',
          text: '상세 이미지는 최대 10개까지 첨부할 수 있습니다.',
          icon: 'warning',
        });
        return;
      }

      setDetailedImages(selectedFiles);
    }
  };

  const handleSubmit = async () => {
    if (
      !productName ||
      !price ||
      !stockQuantity ||
      !category ||
      !color ||
      !size ||
      thumbnail.length === 0 ||
      !description
    ) {
      Swal.fire({
        title: '모든 필드를 채워주세요.',
        text: '썸네일 이미지도 필수 입니다.',
        icon: 'warning',
      });
      return;
    }

    // FormData 객체 생성
    const formData = new FormData();

    // JSON 데이터를 문자열로 추가
    const productRequest = {
      name: productName,
      price,
      stock: stockQuantity,
      textInformation: description,
      category: category.toUpperCase(),
      color,
      clothesSize: category !== '신발' ? size : '',
      shoesSize: category === '신발' ? size : '',
    };

    formData.append('productRequest', new Blob([JSON.stringify(productRequest)], { type: 'application/json' }));

    // 썸네일 이미지 추가
    thumbnail.forEach((file, index) => {
      formData.append('thumbnail', file);
    });

    // 상세 이미지 추가
    images.forEach((file, index) => {
      formData.append('images', file);
    });

    try {
      // 로딩 모달 표시
      Swal.fire({
        title: '등록 중...',
        text: '상품을 등록하는 중입니다.',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const accessToken = sessionStorage.getItem('accessToken');

      // Axios POST 요청
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL_APIgateway}/api/brand/product/owner/${storeId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `${accessToken}`,
          },
        }
      );

      // 로딩 모달 닫기
      Swal.close();

      // Response 로그 출력
      console.log('응답 데이터:', response.data);

      // 성공 메시지 표시
      Swal.fire({
        title: '등록 완료',
        text: '상품이 성공적으로 등록되었습니다.',
        icon: 'success',
      }).then(() => {
        navigate('/business/product');
      });
    } catch (err) {
      // 로딩 모달 닫기
      Swal.close();

      // 오류 메시지 표시
      Swal.fire({
        title: '등록 실패',
        text: err.response?.data?.message || '알 수 없는 오류가 발생했습니다. 1대1 문의 해주세요.',
        icon: 'error',
      });
    }
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

  // 색상 마우스 오버 이벤트 핸들러
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
              placeholder="가격 입력"
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
                  { name: 'Red', color: 'red', english: 'Red' },
                  { name: 'Orange', color: 'orange', english: 'Orange' },
                  { name: 'Yellow', color: 'yellow', english: 'Yellow' },
                  { name: 'Green', color: 'green', english: 'Green' },
                  { name: 'Blue', color: 'blue', english: 'Blue' },
                  { name: 'Purple', color: 'purple', english: 'Purple' },
                  { name: 'Brown', color: 'brown', english: 'Brown' },
                  { name: 'Gray', color: 'gray', english: 'Gray' },
                  { name: 'White', color: 'white', english: 'White' },
                  { name: 'Black', color: 'black', english: 'Black' }
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
                {(category === '신발'
                  ? ['220', '230', '240', '250', '260', '270', '280']
                  : ['모자', '악세사리', '가방'].includes(category)
                    ? ['FREE']
                    : ['S', 'M', 'L', 'FREE']).map(item => (
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

          {/* 이미지 업로드 필드 */}
          <div className='file-upload'>
            {/* 썸네일 첨부 */}
            <input
              type="file"
              id='Thumbnail'
              accept="image/*"
              multiple={true} // 다중 선택 가능하도록 변경
              style={{ display: 'none' }}
              onChange={handleThumbnailChange}
            />
            <label htmlFor="Thumbnail">
              썸네일 첨부 {thumbnail.length > 0 && `(${thumbnail.length}개)`}
            </label>

            {/* 상세 사진 첨부 */}
            <input
              type="file"
              id='Detailed'
              accept="image/*"
              multiple
              style={{ display: 'none' }}
              onChange={handleDetailedImagesChange}
            />
            <label htmlFor="Detailed">
              상세 사진 첨부 {images.length > 0 && `(${images.length}개)`}
            </label>
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