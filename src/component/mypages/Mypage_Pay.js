import React, { useState,useEffect } from 'react';
import '../css/Mypage_Pay.css';
import kakaopay from '../../img/kakaopay.png';
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';

export default function Mypage_Pay() {
  const [address, setAddress] = useState('');
  const [receiver, setReceiver] = useState('');
  const [phone, setPhone] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const products = location.state?.products || [];

  useEffect(() => {
    const jquery = document.createElement("script");
    jquery.src = "https://code.jquery.com/jquery-1.12.4.min.js";
    const iamport = document.createElement("script");
    iamport.src = "https://cdn.iamport.kr/js/iamport.payment-1.1.7.js";
    document.head.appendChild(jquery);
    document.head.appendChild(iamport);
    return () => {
    document.head.removeChild(jquery);
    document.head.removeChild(iamport);
    };
}, []);

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

  // 장바구니 항목 삭제 함수
  const removeItemsFromCart = async (itemIds) => {
    try {
      const accessToken = sessionStorage.getItem('accessToken');
      const deletePromises = itemIds.map(async (id) => {
        await axios.delete(
          `${process.env.REACT_APP_API_BASE_URL_APIgateway}/api/cart/items/${id}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: accessToken,
            },
          }
        );
      });

      await Promise.all(deletePromises);
      console.log('Successfully deleted items:', itemIds);
    } catch (error) {
      console.error('장바구니 항목 삭제 실패:', error);
      Swal.fire({
        title: '장바구니 삭제 실패',
        text: error.response?.data?.message || '장바구니 항목 삭제 중 오류가 발생했습니다.',
        icon: 'error',
        confirmButtonText: '확인',
        confirmButtonColor: '#754F23',
        background: '#F0EADC',
        color: '#754F23',
      });
    }
  };

  const addOrder = async () => {
    const totalPrice = products.reduce((sum, product) => sum + product.price * product.stock, 0);

    try {
      const { IMP } = window;
      IMP.init('imp03224481'); // 가맹점 식별 코드
      console.log(totalPrice + totalPrice.type)
      IMP.request_pay(
        {
          pg: 'kakaopay.TC0ONETIME',
          pay_method: 'card',
          merchant_uid: `order_${new Date().getTime()}`,
          name: "Shortpingoo",
          amount: totalPrice,
        },
        async (rsp) => {
          if (rsp.success) {
            try {
              const token = sessionStorage.getItem('accessToken');

              const orderItemList = products.map((product) => ({
                productCode: product.productCode,
                stock: product.stock,
                color: product.color,
                price: product.price,
                name: product.name,
                size: product.size,
                thumbnail: product.thumbnail,
              }));
              console.log("===================")
              console.log(orderItemList)

              // OrderRequest 생성
              const requestData = {
                impUid: rsp.imp_uid,
                orderItemList: orderItemList,
              };
              console.log("===================")
              console.log(requestData)
              const verifyResponse = await axios.post(
                `${process.env.REACT_APP_API_BASE_URL_APIgateway}/api/order`,
                requestData,
                {
                  headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                  },
                }
              );
  
              if (rsp.paid_amount) {
                Swal.fire({
                  title: "결제 성공",
                  text: "결제가 성공적으로 완료되었습니다.",
                  icon: "success",
                  confirmButtonText: "확인",
                }).then(async () => {
                  try {
                    // 장바구니에서 항목 삭제
                    const itemIds = products.map((product) => product.id);
                    await removeItemsFromCart(itemIds);
              
                    // 결제 후 장바구니 페이지로 이동
                    navigate('/mypages/cart');
                  } catch (error) {
                    console.error('장바구니 항목 삭제 중 오류 발생:', error);
                    Swal.fire({
                      icon: 'error',
                      title: '장바구니 항목 삭제 실패',
                      text: '장바구니 항목 삭제 중 오류가 발생했습니다.',
                    });
                  }
                });
              } else {
                Swal.fire({
                  icon: 'error',
                  title: '결제 실패',
                  text: '결제 금액이 일치하지 않습니다.',
                });
              }
            } catch (error) {
              console.error('결제 검증 중 오류 발생:', error);
              Swal.fire({
                icon: 'error',
                title: '결제 검증 중 오류 발생',
                text: `${error.message}`,
              });
            }
          } else {
            Swal.fire({
              icon: 'error',
              title: '결제 실패',
              text: `${rsp.error_msg}`,
            });
          }
        }
      );
    } catch (error) {
      console.error('결제 요청 중 오류 발생:', error);
    }
  };
  

  return (
    <div className='pay-container'>
      <div className='pay-title'>결제하기</div>
      <div className='pay-rectangle'>
        <span style={{ marginTop: '15px' }}>정보 입력</span>
        {/* 주소 검색과 주소 입력 필드를 한 줄로 배치 */}
        <div className="pay-address-container">
          <input
            className='pay-inputaddress'
            type="text"
            value={address}
            onChange={handleInputChange}
            readOnly
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
          <div key={product.id} className="pay-product-item">
            <img src={product.thumbnail} alt={product.name} className="pay-product-image" />
            <div className="pay-product-details">
              <div className="pay-product-name">{product.name}</div>
              <div className="pay-quantity">수량: {product.stock} 개</div>
              <div className="pay-product-info">
                {product.size} / {product.color}
              </div>
              <div className="pay-product-price">{product.price.toLocaleString()} KRW</div>
            </div>
          </div>
        ))}
      </div>

      <button className="pay-btn" onClick={addOrder}>
        <img className="kakaopay-logo" src={kakaopay} alt="KakaoPay" />
        결 제
      </button>
    </div>
  );
}