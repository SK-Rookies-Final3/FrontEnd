import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import '../css/LoginForm.css';

const User_Login = () => {
    const navigate = useNavigate();
    const [isSignup, setIsSignup] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");

    const goBusinessLogin = () => {
        navigate('/business/login');
    };

    const toggleSwitch = () => {
        setUsername("");
        setPassword("");
        setRepeatPassword("");
        setIsSignup(!isSignup);
    };

    const handleLogin = async () => {
        // 입력 값 검증
        if (!username || !password) {
            Swal.fire({
                icon: 'error',
                title: '입력 오류',
                text: '아이디와 비밀번호를 모두 입력해주세요.',
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
                `http://localhost:8080/open-api/login`,
                { username, password }
            );

            if (response.status === 200) {
                console.log("로그인 성공:", response.data);

                // 서버로부터 받은 토큰 처리
                const { accessToken } = response.data.body;
                localStorage.setItem("accessToken", accessToken);

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
            } else {
                throw new Error("로그인 실패");
            }
        } catch (error) {
            console.error("로그인 실패:", error);

            // 서버에서 반환된 에러 코드에 따른 메시지 처리
            if (error.response && error.response.status === 400) {
                Swal.fire({
                    icon: 'error',
                    title: '잘못된 요청입니다.',
                    text: '아이디 또는 비밀번호를 확인해주세요.',
                    showConfirmButton: true,
                    confirmButtonText: '확인',
                    confirmButtonColor: '#754F23',
                    background: '#F0EADC',
                    color: '#754F23',
                    iconColor: '#DBC797'
                });
            } else if (error.response && error.response.status === 500) {
                Swal.fire({
                    icon: 'error',
                    title: '서버 오류입니다.',
                    text: '서버에서 문제가 발생했습니다. 다시 시도해주세요.',
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
                    title: '알 수 없는 오류가 발생했습니다.',
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
        // 입력 값 검증
        if (!username || !password || !repeatPassword) {
            Swal.fire({
                icon: 'error',
                title: '입력 오류',
                text: '아이디, 비밀번호, 비밀번호 확인을 모두 입력해주세요.',
                showConfirmButton: true,
                confirmButtonText: '확인',
                confirmButtonColor: '#754F23',
                background: '#F0EADC',
                color: '#754F23',
                iconColor: '#DBC797'
            });
            return;
        }

        if (password !== repeatPassword) {
            Swal.fire({
                icon: 'error',
                title: '비밀번호가 일치하지 않습니다.',
                text: '다시 확인해주세요.',
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
            const token = localStorage.getItem('token');
            const response = await axios.post(
                `http://localhost:8080/open-api/register`,
                { username, password, role: 'CLIENT' },
                {
                    headers: {
                        Authorization: `${token}`,
                    },
                }
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
                setUsername("");
                setPassword("");
                setRepeatPassword("");
                setIsSignup(false);
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
                                <input type="text" name="logeid" className="form-style"
                                    placeholder="Your ID" id="logeid" autoComplete="off" value={username}
                                    onChange={(e) => setUsername(e.target.value)} />
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
                                <input type="text" name="logeid" className="form-style"
                                    placeholder="Your ID" id="logeid" autoComplete="off" value={username}
                                    onChange={(e) => setUsername(e.target.value)} />
                                <input type="password" name="logpass" className="form-style"
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