import React, { useState } from 'react';
import '../css/Admin_Login.css';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import Image from '../../logo/logo.png';

const Admin_Login = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPasswordInput, setShowPasswordInput] = useState(false);

    const handleAppleIdChange = (e) => setUsername(e.target.value);
    const handlePasswordChange = (e) => setPassword(e.target.value);

    const showPasswordField = () => {
        if (username) {
            setShowPasswordInput(true);
        } else {
            alert('Please enter your Apple ID.');
        }
    };

    const handleLogin = async () => {
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
                `${process.env.REACT_APP_API_BASE_URL}/open-api/user/login`,
                { username, password }
            );

            if (response.status === 200) {
                // console.log("로그인 성공:", response.data);

                const { accessToken, role } = response.data.body;

                // role이 MASTER가 아니면 로그인 차단
                if (role !== "MASTER") {
                    Swal.fire({
                        icon: 'error',
                        title: '로그인 불가',
                        text: '클라이언트 계정만 로그인할 수 있습니다.',
                        showConfirmButton: true,
                        confirmButtonText: '확인',
                        confirmButtonColor: '#754F23',
                        background: '#F0EADC',
                        color: '#754F23',
                        iconColor: '#DBC797'
                    });
                    return;
                }

                // 서버로부터 받은 토큰 처리
                sessionStorage.setItem("accessToken", accessToken);
                sessionStorage.setItem("role", role);

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
            // console.error("로그인 실패:", error);

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

    return (
        <div className="admin-login-container">
            <img
                src={Image}
                alt="iCloud Logo"
            />
            <h1>Sign in to ADMIN</h1>
            <div className="admin-form-group">
                <input
                    type="text"
                    id="apple-id"
                    placeholder=" "
                    required
                    value={username}
                    onChange={handleAppleIdChange}
                    disabled={showPasswordInput}
                />
                <label htmlFor="apple-id">USER ID</label>
                {!showPasswordInput && (
                    <button className="admin-arrow-button" onClick={showPasswordField}>
                        &#x2192;
                    </button>
                )}
            </div>
            {showPasswordInput && (
                <div className="admin-form-group">
                    <input
                        type="password"
                        id="password"
                        placeholder=" "
                        required
                        value={password}
                        onChange={handlePasswordChange}
                    />
                    <label htmlFor="password">Password</label>
                </div>
            )}
            <button
                className="admin-login-button"
                onClick={handleLogin}
                style={{ display: showPasswordInput ? 'block' : 'none' }}
            >
                Sign In
            </button>
        </div>
    );
};

export default Admin_Login;