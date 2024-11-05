import React, { useState, useEffect } from 'react';
import logo from '../logo/shorthingoo.png';
import { BsBagHeart } from "react-icons/bs";
import { RxPerson } from "react-icons/rx";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();
  const [showTooltip, setShowTooltip] = useState(true); // 초기값을 true로 설정

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      setShowTooltip(false); // 토큰이 있으면 Tooltip 숨김
    } else {
      setShowTooltip(true); // 토큰이 없으면 Tooltip 표시
    }
  },[]);

  const toggleTooltip = () => {
    setShowTooltip(!showTooltip);
  };

  return (
    <>
      <style>{`
        .nav-link {
          position: relative;
          display: inline-block;
          text-decoration: none;
          color: black;
          transition: color 0.3s ease;
        }

        .nav-link::after {
          content: '';
          position: absolute;
          width: 0;
          height: 3px;
          display: block;
          margin-top: 5px;
          background: #754F23;
          transition: width 0.3s ease;
          left: 50%;
          transform: translateX(-50%);
        }

        .nav-link:hover::after {
          width: 70%;
        }

        .navbar-nav {
          display: flex;
          align-items: center;
          margin: 0;
          padding: 0;
          list-style-type: none;
          font-family: "continuous";
          font-size: 24px;
        }

        .nav-item {
          margin: 0 100px;
        }

        .navbar {
          padding: 0;
          margin: 0;
          width: 100%;
        }

        .logo {
          width: 180px;
          margin-left: 30px;
        }

        .icons {
          display: flex;
          align-items: center;
          margin-right: 30px;
          position: relative; /* 위치 조정 */
        }

        .icons a {
          font-size: 24px;
          margin-left: 20px;
          cursor: pointer;
          color: black;
          text-decoration: none;
        }

        .container-fluid {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 5px 20px;
        }

        /* Tooltip 스타일 */
        .tooltip {
          position: absolute; /* 아이콘 아래에 절대 위치 */
          top: 100%; /* 아이콘 아래쪽으로 위치 조정 */
          right: -50%; /* Tooltip을 가운데 정렬 */
          transform: translate(-50%, 0); /* 가운데 정렬 */
          display: ${showTooltip ? 'block' : 'none'}; /* 상태에 따라 표시 */
          background-color: #fff;
          padding: 10px 10px; /* 여백 설정 */
          border-radius: 8px;
          font-size: 14px;
          color: #333;
          width: 230px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          z-index: 10; /* 다른 요소 위에 표시 */
          white-space: nowrap; /* 내용이 한 줄로 표시되도록 설정 */
          overflow: visible; /* 내용이 넘치도록 설정 */
          text-align: left; 
          animation: scaleAnimation 3s ease-in-out infinite;
          transform-origin: top;
    
        }

        /* Tooltip의 화살표 */
        .tooltip::after {
          content: "";
          position: absolute;
          bottom: 100%; /* Tooltip의 위쪽에 위치 */
          left: 80%; /* 가운데 정렬 */
          margin-left: -8px;
          border-width: 8px;
          border-style: solid;
          border-color: transparent transparent #fff transparent; /* 아래쪽 화살표 */
          transform: translate(-50%, 0); /* 가운데 정렬 */
        }

        .close-button {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 16px;
          position: absolute;
          top: 5px; /* 툴팁 상단 */
          right: 5px; /* 툴팁 오른쪽 */
          color: #333;
          padding: 0; /* 패딩 제거 */
        }
      `}</style>

      <nav className="navbar navbar-expand-lg" style={{ backgroundColor: '#F0EADC' }}>
        <div className="container-fluid">
          {/* 로고 */}
          <a className="navbar-brand" href="/">
            <img src={logo} alt="Shorthingoo Logo" className="logo" />
          </a>

          {/* 네비게이션 메뉴 */}
          <ul className="navbar-nav d-flex flex-row justify-content-center mb-0">
            <li className="nav-item">
              <a className="nav-link" href="/">Home</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/pages/shop">Shop</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/pages/brands">Brands</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/aboutus">About Us</a>
            </li>
          </ul>

          {/* 아이콘 */}
          <div className="icons">
            <a onClick={() => {
              const accessToken = localStorage.getItem("accessToken");

              if (!accessToken) {
                navigate("user/login");
              } else {
                navigate("mypages/cart")
              }
            }}>
              <BsBagHeart />
            </a>
            <a onClick={() => {
              const accessToken = localStorage.getItem("accessToken");
              const role = localStorage.getItem("role");

              if (!accessToken) {
                navigate("/user/login");
              } else {
                if (role === "CLIENT") {
                  navigate("/mypages/orderlist");
                } else if (role === "OWNER") {
                  navigate("/business/product");
                } else if (role === "MASTER") {
                  navigate("/admin/userlist");
                }
              }
            }}>
              <RxPerson />
            </a>
            {/* Tooltip */}
            <div className="tooltip">
              <button className="close-button" onClick={toggleTooltip}>✖</button>
              회원가입하고 나만의 맞춤 추천 받기!
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
