import React from 'react';
import logo from '../logo/shorthingoo.png';
import { BsBagHeart } from "react-icons/bs";
import { RxPerson } from "react-icons/rx";

export default function Header() {
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
              <a className="nav-link" href="/shop">Shop</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/brands">Brands</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/aboutus">About Us</a>
            </li>
          </ul>

          {/* 아이콘 */}
          <div className="icons">
            <a href="/mypage/cart">
              <BsBagHeart />
            </a>
            <a href="/mypage/order">
              <RxPerson />
            </a>
          </div>
        </div>
      </nav>
    </>
  );
}