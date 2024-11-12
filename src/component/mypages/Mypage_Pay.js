import React, { useState } from 'react';
import '../css/Mypage_Pay.css';
import kakaopay from '../../img/kakaopay.png';

export default function Mypage_Pay() {
  const [address, setAddress] = useState('');
  const [receiver, setReceiver] = useState('');
  const [phone, setPhone] = useState('');

  const handleAddressSearch = () => {
    new window.daum.Postcode({
      oncomplete: function (data) {
        setAddress(data.address);
      }
    }).open();
  };

  const handleInputChange = (e) => {
    setAddress(e.target.value);
  };

  const handleReceiverChange = (e) => {
    setReceiver(e.target.value);
  };

  const handlePhoneChange = (e) => {
    let value = e.target.value;
    
    // 전화번호 형식으로 자동 변환
    const input = value.replace(/\D/g, ''); // 숫자 이외의 문자 제거
    if (input.length > 11) {
      return; // 길이가 11을 초과하면 아무것도 하지 않음
    }
    value = input.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3'); // 3-4-4 형태로 변환
    
    setPhone(value);
  };

  const products = [
    { id: 1, name: '상품 1', quantity: '3 개', price: '10,000원', imageUrl: '' },
    { id: 2, name: '상품 2', quantity: '1 개', price: '15,000원', imageUrl: '' },
    { id: 3, name: '상품 3', quantity: '3 개', price: '20,000원', imageUrl: '' },
    // 더 많은 상품 추가 가능
  ];

  return (
    <div className='pay-container'>
      <div className='pay-title'>결제하기</div>
      <div className='pay-rectangle'>
        <span style={{marginTop: '15px'}}>정보 입력</span>
        {/* 주소 검색과 주소 입력 필드를 한 줄로 배치 */}
        <div className="pay-address-container">
          <input
            className='pay-inputaddress'
            type="text"
            value={address}
            onChange={handleInputChange}
            placeholder="주소를 입력하세요"
          />
          <button className='pay-address' onClick={handleAddressSearch}>주소 검색</button>
        </div>
        
        {/* 수령인과 연락처 입력 필드 */}
        <div className="pay-input-group">
          <input
            className='pay-receiver'
            type="text"
            value={receiver}
            onChange={handleReceiverChange}
            placeholder="수령인"
          />
          <input
            className='pay-phone'
            type="text"
            value={phone}
            onChange={handlePhoneChange}
            placeholder="연락처"
          />
        </div>
      </div>

      {/* 상품 정보 */}
      <div className='pay-product-container'>
        {products.map((product) => (
          <div key={product.id} className='pay-product-item'>
            <div className='pay-product-image'>
              {/* 상품 이미지 삽입 가능 */}
            </div>
            <div className='pay-product-name'>{product.name}</div>
            <div className='pay-quantity'>{product.quantity}</div>
            <div className='pay-product-price'>{product.price}</div>
          </div>
        ))}
      </div>

      <button className="pay-btn">
      <img className="kakaopay-logo" src={kakaopay} alt="KakaoPay" />
        결 제
      </button>
    </div>
  );
}
