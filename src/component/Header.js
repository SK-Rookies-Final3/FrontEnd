import React from 'react';
import logo from '../logo/shorthingoo.png';
import { BsBagHeart } from "react-icons/bs";
import { RxPerson } from "react-icons/rx";
import { BiFontSize } from 'react-icons/bi';

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
        }

        .nav-item {
          margin: 0 40px;
        }

        .nav-item a {
          display: block;
          padding: 10px 45px; 
        }

        .navbar {
          padding: 0; 
          margin: 0;
        }

        .logo {
          width: 40px;
          margin-right: 80px; 
        }

      `}</style>

      <nav className="navbar navbar-expand-lg" style={{ backgroundColor: '#F0EADC' }}>
        <div className="container-fluid d-flex justify-content-between align-items-center">
          <div className="d-flex justify-content-center flex-grow-1">
            <ul className="navbar-nav d-flex flex-row justify-content-center mb-0"> {/* margin, padding 제거 */}
              <a className="navbar-brand fw-bold" href="/" style={{ marginLeft: '20px' }}>
                <img src={logo} alt="SummaryBuddy Logo" style={{ width: '200px'}} />
              </a>
              <li className="nav-item" style={{ marginLeft: '100px', marginRight: '100px' }}>
                <a className="nav-link" href="/">Home</a>
              </li>
              <li className="nav-item" style={{ marginLeft: '100px', marginRight: '100px' }}>
                <a className="nav-link" href="/shop">Shop</a>
              </li>
              <li className="nav-item" style={{ marginLeft: '100px', marginRight: '100px' }}>
                <a className="nav-link" href="/brands">Brands</a>
              </li>
              <li className="nav-item" style={{ marginLeft: '100px', marginRight: '100px' }}>
                <a className="nav-link" href="/aboutus">AboutUs</a>
              </li>
              <a href="/mypage/cart" style={{ fontSize: '24px', marginLeft: '20px', cursor: 'pointer' }}>
                <BsBagHeart />
              </a>
              <a href="/mypage/order" style={{ fontSize: '24px', marginLeft: '20px', cursor: 'pointer' }}>
                <RxPerson />
              </a>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}
