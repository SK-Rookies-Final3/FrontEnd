import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaStore, FaRegIdBadge } from "react-icons/fa";
import '../css/LoginForm.css';

const Business_Request = () => {
    const navigate = useNavigate();
    const [storename, setStorename] = useState("");
    const [storenum, setStorenum] = useState("");

    const handleRequest = async () => {
        if (!storename || !storenum) {
            alert("모든 필드를 채워주세요.");
            return;
        }
    
        // console.log(`${process.env.REACT_APP_API_BASE_URL_APIgateway}`);
        
        try {
            const accessToken = localStorage.getItem('accessToken');
            console.log("accessToken:", accessToken);
            
            const response = await axios.post(
                `${process.env.REACT_APP_API_BASE_URL_APIgateway}/api/store/owner/register`,
                { name: storename, licenseNumber: parseInt(storenum, 10) },
                {
                    headers: {
                        Authorization: `${accessToken}`,
                    },
                }
            );
    
            console.log("Response:", response.data);
            alert("사업자 승인 요청이 성공적으로 전송되었습니다.");
            navigate("/");
        } catch (error) {
            console.error("Error:", error);
            alert("사업자 승인 요청 중 문제가 발생했습니다.");
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
                                    type="number"
                                    name="logstorenum"
                                    className="form-style"
                                    placeholder="사업자 등록 번호"
                                    id="logstorenum"
                                    autoComplete="off"
                                    value={storenum}
                                    onChange={(e) => setStorenum(e.target.value)}
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