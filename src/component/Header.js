import React, { useState, useEffect } from 'react';
import logo from '../logo/shorthingoo.png';
import { BsBagHeart } from "react-icons/bs";
import { RxPerson } from "react-icons/rx";
import { TbBellRinging } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import NotificationModal from './NotificationModal';
import Swal from "sweetalert2";

export default function Header() {
  const navigate = useNavigate();
  const [showTooltip, setShowTooltip] = useState(true); // 초기값을 true로 설정
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      setShowTooltip(false); // 토큰이 있으면 Tooltip 숨김
      setIsLoggedIn(true);
    } else {
      setShowTooltip(true); // 토큰이 없으면 Tooltip 표시
      setIsLoggedIn(false);
    }
  });

  const toggleTooltip = () => {
    setShowTooltip(!showTooltip);
  };

  const toggleNotificationModal = () => {
    setShowNotificationModal(!showNotificationModal);
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
          cursor: pointer;
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
          min-width: 100px
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
          right: -35%; /* Tooltip을 가운데 정렬 */
          transform: translate(-50%, 0); /* 가운데 정렬 */
          display: ${showTooltip ? 'block' : 'none'}; /* 상태에 따라 표시 */
          background-color: #fff;
          padding: 10px 10px; /* 여백 설정 */
          border-radius: 8px;
          font-size: 14px;
          color: #333;
          width: 200px;
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
          margin-left: -16px;
          border-width: 8px;
          border-style: solid;
          border-color: transparent transparent #fff transparent; /* 아래쪽 화살표 */
          transform: translate(-50%, 0); /* 가운데 정렬 */
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
              <span className="nav-link" onClick={() => navigate("/")}>Home</span>
            </li>
            <li className="nav-item">
              <span className="nav-link" onClick={() => navigate("/pages/shop")}>Shop</span>
            </li>
            <li className="nav-item">
              <span className="nav-link" onClick={() => navigate("/pages/brands")}>Brands</span>
            </li>
            <li className="nav-item">
              <span className="nav-link" onClick={() => navigate("/aboutus")}>About Us</span>
            </li>
          </ul>

          {/* 아이콘 */}
          <div className="icons">
            {isLoggedIn && (
              <a onClick={toggleNotificationModal}>
                <TbBellRinging />
              </a>
            )}

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
            <a onClick={async () => {
              const accessToken = localStorage.getItem("accessToken");
              const role = localStorage.getItem("role");
              const userId = localStorage.getItem("id");
              console.log(userId)

              if (!accessToken) {
                navigate("/user/login");
              } else {
                if (role === "CLIENT") {
                  navigate("/mypages/orderlist");
                } else if (role === "OWNER") {
                  try {
                    // API 호출
                    const response = await fetch(`${process.env.REACT_APP_API_BASE_URL_APIgateway}/api/brand/store/owner/status/${userId}`, {
                      method: 'GET',
                      headers: {
                        Authorization: `${accessToken}`,
                      },
                    });

                    if (!response.ok) {
                      throw new Error("API 호출 실패");
                    }

                    const data = await response.json();
                    const status = data;
                    console.log("status:", status);

                    if (status === 0) {
                      Swal.fire({
                        title: "아직 승인 대기 중 입니다.",
                        text: "로그아웃 하시겠습니까?",
                        icon: "info",
                        showCancelButton: true,
                        confirmButtonText: "확인",
                        cancelButtonText: "취소",
                      }).then((result) => {
                        if (result.isConfirmed) {
                          localStorage.removeItem("role");
                          localStorage.removeItem("accessToken");
                          localStorage.removeItem("id");
                          navigate("/");
                          Swal.fire({
                            title: "로그아웃 되었습니다.",
                            icon: "success",
                            confirmButtonText: "확인",
                          });
                        }
                      });
                    } else if (status === 1) {
                      navigate("/business/product");
                    } else if (status === 2) {
                      Swal.fire({
                        title: "거절되었습니다.",
                        text: "자동 로그아웃합니다.",
                        icon: "error",
                        confirmButtonText: "확인",
                      }).then(() => {
                        localStorage.removeItem("accessToken");
                        localStorage.removeItem("role");
                        localStorage.removeItem("id");
                        navigate("/");
                      });
                    }
                  } catch (error) {
                    console.error("API 호출 중 오류 발생:", error);
                    Swal.fire({
                      title: "오류",
                      text: "상태 정보를 불러올 수 없습니다.",
                      icon: "error",
                      confirmButtonText: "확인",
                    });
                  }
                } else if (role === "MASTER") {
                  navigate("/admin/userlist");
                }
              }
            }}>
              <RxPerson />
            </a>
            {/* Tooltip */}
            <div className="tooltip">
              회원가입하고 나만의 맞춤 추천 받기!
            </div>
          </div>
        </div>
      </nav>
      {/* NotificationModal 컴포넌트 */}
      {showNotificationModal && (
        <NotificationModal onClose={toggleNotificationModal} />
      )}
    </>
  );
}
