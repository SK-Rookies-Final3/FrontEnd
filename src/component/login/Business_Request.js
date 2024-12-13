import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaStore, FaRegIdBadge } from "react-icons/fa";
import '../css/LoginForm.css';
import Swal from "sweetalert2";

const Business_Request = () => {
    const navigate = useNavigate();
    const [storename, setStorename] = useState("");
    const [storenum, setStorenum] = useState("");

    const handleRequest = async () => {
        if (!storename || !storenum ) {
            Swal.fire({
                icon: 'error',
                title: '모든 필드를 채워주세요',
                text: '가게 이름, 사업자 등록 번호 모두 입력해주세요.',
                showConfirmButton: true,
                confirmButtonText: '확인',
                confirmButtonColor: '#754F23',
                background: '#F0EADC',
                color: '#754F23',
                iconColor: 'red'
            });
            return;
        }
        
        if (storenum.length !== 10) {
            Swal.fire({
                icon: 'error',
                title: '사업자 승인 요청 실패!',
                text: '사업자 승인 번호는 숫자로만 10자리 입력해주세요.',
                showConfirmButton: true,
                confirmButtonText: '확인',
                confirmButtonColor: '#754F23',
                background: '#F0EADC',
                color: '#754F23',
                iconColor: 'red'
            });
            return;
        }
    
        // console.log(`${process.env.REACT_APP_API_BASE_URL_APIgateway}`);
        
        try {
            const accessToken = sessionStorage.getItem('accessToken');
            // console.log("accessToken:", accessToken);
            
            const response = await axios.post(
                `${process.env.REACT_APP_API_BASE_URL_APIgateway}/api/brand/store/owner/register`,
                { name: storename, licenseNumber: storenum},
                {
                    headers: {
                        Authorization: `${accessToken}`,
                    },
                }
            );
    
            // console.log("Response:", response.data);
            
            Swal.fire({
                icon: 'success',
                title: '사업자 승인 요청 성공!',
                text: '승인 요청 완료까지 최대 2~3일 정도 소요됩니다.',
                showConfirmButton: true,
                confirmButtonText: '확인',
                confirmButtonColor: '#754F23',
                background: '#F0EADC',
                color: '#754F23',
                iconColor: 'green'
            })
            navigate("/");
        } catch (error) {
            // console.error("Error:", error);
            Swal.fire({
                icon: 'error',
                title: '사업자 승인 요청 실패!',
                text: '알 수 없는 오류가 발생하였습니다',
                showConfirmButton: true,
                confirmButtonText: '확인',
                confirmButtonColor: '#754F23',
                background: '#F0EADC',
                color: '#754F23',
                iconColor: 'red'
            });
        }
    };

    return (
        <div className="login_container">
            <div className="section">
                <div className="card-wrap">
                    <div className="card-login">
                        <div className="center-wrap">
                            <h2 className="business_text">BUSINESS</h2>
                            <h2 className="log_text">사업자 승인 요청</h2>
                            <div className="input-container">
                                <FaStore className="input-icon" />
                                <input
                                    type="text"
                                    name="logstore"
                                    className="form-style"
                                    placeholder="Your Store Name"
                                    id="logstore"
                                    autoComplete="off"
                                    value={storename}
                                    onChange={(e) => setStorename(e.target.value)}
                                />
                            </div>
                            <div className="input-container">
                                <FaRegIdBadge className="input-icon" />
                                <input
                                    type="text"
                                    name="logstorenum"
                                    className="form-style"
                                    placeholder="숫자로만 10자리 입력해주세요."
                                    id="logstorenum"
                                    autoComplete="off"
                                    value={storenum}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (/^\d*$/.test(value) && value.length <= 10) {
                                            setStorenum(value);
                                        }
                                    }}
                                    onBlur={() => {
                                        // 입력값이 10자리가 아닌 경우 초기화
                                        if (storenum.length !== 10) {
                                            setStorenum("");
                                            Swal.fire({
                                                icon: 'error',
                                                title: '사업자 승인 요청 실패!',
                                                text: '사업자 승인 번호는 숫자로만 10자리 입력해주세요.',
                                                showConfirmButton: true,
                                                confirmButtonText: '확인',
                                                confirmButtonColor: '#754F23',
                                                background: '#F0EADC',
                                                color: '#754F23',
                                                iconColor: 'red'
                                            });
                                        }
                                    }}
                                />
                            </div>
                            <button className="btn_sub" onClick={handleRequest}>Submit</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Business_Request;