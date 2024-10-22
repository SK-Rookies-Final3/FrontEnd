import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import '../css/LoginForm.css';

const User_Login = () => {
    const navigate = useNavigate();
    const [isSignup, setIsSignup] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");

    const goBusinessLogin = () => {
        navigate('/business/login');
    };

    const toggleSwitch = () => {
        setIsSignup(!isSignup);
    };

    const handleLogin = async () => {
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_BASE_URL}/?`,
                { email, password }
            );
            console.log("로그인 성공:", response.data);

            const token = response.data.token;
            localStorage.setItem("token", token);

            Swal.fire({
                icon: 'success',
                title: '로그인 성공!',
                showConfirmButton: true,
                confirmButtonText: '확인',
                confirmButtonColor: '#754F23', 
                background: '#F0EADC', 
                color: '#754F23',  
                iconColor: '#DBC797'
            }).then(() => {
                navigate("/");
            });
        } catch (error) {
            console.error("로그인 실패:", error);
            if (error.response && error.response.status === 401) {
                Swal.fire({
                    icon: 'error',
                    title: '아이디 또는 비밀번호가 잘못되었습니다.',
                    text: '다시 시도해주세요.',
                    showConfirmButton: true,
                    confirmButtonText: '확인',
                    confirmButtonColor: '#754F23',
                    background: '#F0EADC',
                    color: '#754F23',
                    iconColor: '#DBC797'
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: '로그인 실패!',
                    text: '다시 시도해주세요.',
                    showConfirmButton: true,
                    confirmButtonText: '확인',
                    confirmButtonColor: '#754F23',
                    background: '#F0EADC',
                    color: '#754F23',
                    iconColor: '#DBC797'
                });
            }
        }
    };

    const handleRegister = async () => {
        if (password !== repeatPassword) {
            Swal.fire({
                icon: 'error',
                title: '비밀번호가 일치하지 않습니다.',
                text: '비밀번호를 다시 확인해주세요.',
                showConfirmButton: true,
                confirmButtonText: '확인',
                confirmButtonColor: '#754F23',
                background: '#F0EADC',
                color: '#754F23',
                iconColor: '#DBC797'
            });
            return;
        }

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_BASE_URL}/?`,
            );
            console.log("회원가입 성공:", response.data);
            Swal.fire({
                icon: 'success',
                title: '회원가입 성공!',
                showConfirmButton: true,
                confirmButtonText: '확인',
                confirmButtonColor: '#754F23',
                background: '#F0EADC',
                color: '#754F23',
                iconColor: '#DBC797'
            }).then(() => {
                navigate("/login");
            });
        } catch (error) {
            console.error("회원가입 실패:", error);
            Swal.fire({
                icon: 'error',
                title: '회원가입 실패!',
                text: '다시 시도해주세요.',
                showConfirmButton: true,
                confirmButtonText: '확인',
                confirmButtonColor: '#754F23',
                background: '#F0EADC',
                color: '#754F23',
                iconColor: '#DBC797'
            });
        }
    };

    return (
        <div className="login_container">
            <div className="section">
                <h3 className="switch_text">
                    <span>LOG IN </span><span>SIGN UP</span>
                </h3>
                <input className="checkbox" type="checkbox" id="reg-log" name="reg-log" checked={isSignup} onChange={toggleSwitch} />
                <label htmlFor="reg-log"></label>
                <div className="card-wrap">
                    <div className={`card-wrapper ${isSignup ? 'rotate' : ''}`}>
                        <div className="card-login">
                            <div className="center-wrap">
                                <h2 className="log_text">LOG IN</h2>
                                <input type="email" name="logemail" className="form-style" 
                                    placeholder="Your Email" id="logemail" autoComplete="off" value={email} 
                                    onChange={(e) => setEmail(e.target.value)} />
                                <input type="password" name="logpass" className="form-style" 
                                    placeholder="Your Password" id="logpass" autoComplete="off" value={password} 
                                    onChange={(e) => setPassword(e.target.value)} />
                                <button className="btn_sub" onClick={handleLogin}>Submit</button>
                                <p className="paragraph">
                                    <span className="link" onClick={goBusinessLogin}>Business</span>
                                </p>
                            </div>
                        </div>
                        <div className="card-signup">
                            <div className="center-wrap">
                                <h2 className="log_text">SIGN UP</h2>
                                <input type="text" name="logemail" className="form-style" 
                                    placeholder="Your Email" id="logemail" autoComplete="off" value={email} 
                                    onChange={(e) => setEmail(e.target.value)} />
                                <input type="email" name="logpass" className="form-style" 
                                    placeholder="Your PassWord" id="logpass" autoComplete="off" value={password} 
                                    onChange={(e) => setPassword(e.target.value)} />
                                <input type="password" name="logpass" className="form-style" 
                                    placeholder="Your Repeat Password" id="logpass" autoComplete="off" value={repeatPassword}
                                    onChange={(e) => setRepeatPassword(e.target.value)} />
                                <button className="btn_sub" onClick={handleRegister}>Submit</button>
                                <p className="paragraph">
                                    <span className="link" onClick={goBusinessLogin}>Business</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default User_Login;