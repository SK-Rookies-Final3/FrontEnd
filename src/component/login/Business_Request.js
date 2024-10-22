import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import '../css/LoginForm.css'

const Business_Request = () => {
    const navigate = useNavigate();
    const [storename, setStorename] = useState("");
    const [storenum, setStorenum] = useState("");

    const handleRequest = async () => {
        
    };

    return (
        <div className="login_container">
            <div className="section">
                <div className="card-wrap">
                    <div className="card-login">
                        <div className="center-wrap">
                            <h2 className="business_text">BUSINESS</h2>
                            <h2 className="log_text">사업자 승인 요청</h2>
                            <input type="text" name="logstore" className="form-style" 
                                placeholder="Your Store Name" id="logstore" autoComplete="off" value={storename} 
                                onChange={(e) => setStorename(e.target.value)} />
                            <input type="number" name="logstorenum" className="form-style" 
                                placeholder="사업자 등록 번호" id="logstorenum" autoComplete="off" value={storenum} 
                                onChange={(e) => setStorenum(e.target.value)} />
                            <button className="btn_sub" onClick={handleRequest}>Submit</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default Business_Request;