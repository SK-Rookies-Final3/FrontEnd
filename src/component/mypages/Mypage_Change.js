import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../css/Mypage_Form.css';
import '../css/Mypage_Order.css';
import Swal from 'sweetalert2';
import { BsPersonBoundingBox } from "react-icons/bs";
import { FaRegHandPointRight, FaRegHandPointLeft } from "react-icons/fa";
import { MdOutlineWavingHand } from "react-icons/md";
import axios from "axios";

function Sidebar({ handleDeleteAccount, handleLogout }) {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <div className="order_sidebar">
            <ul>
                <li className={location.pathname === '/mypages/orderlist' ? 'active' : ''} onClick={() => navigate('/mypages/orderlist')}>
                    주문 조회
                </li>
                <li className={location.pathname === '/mypages/like' ? 'active' : ''} onClick={() => navigate('/mypages/like')}>
                    위시 리스트
                </li>
                <li className={location.pathname === '/mypages/question' ? 'active' : ''} onClick={() => navigate('/mypages/question')}>
                    1:1 문의
                </li>
                <li className={location.pathname === '/mypages/change' ? 'active' : ''} onClick={() => navigate('/mypages/change')}>
                    정보수정
                </li>
                <li onClick={handleLogout}>로그아웃</li>
                <li onClick={handleDeleteAccount}>회원 탈퇴</li>
            </ul>
        </div>
    );
}

function ChangeContainer() {
    const [Id, setId] = useState('');
    const [username, setUsername] = useState('');
    const [nickname, setNickname] = useState('');
    const [isEditingNickname, setIsEditingNickname] = useState(false);
    const [email, setEmail] = useState('');
    const [isEditingEmail, setIsEditingEmail] = useState(false);
    const [gender, setGender] = useState('');
    const [isEditingGender, setIsEditingGender] = useState(false);
    const [age, setAge] = useState('');
    const [isEditingAge, setIsEditingAge] = useState(false);
    const [height, setHeight] = useState('');
    const [isEditingHeight, setIsEditingHeight] = useState(false);
    const [weight, setWeight] = useState('');
    const [isEditingWeight, setIsEditingWeight] = useState(false);
    const [address, setAddress] = useState('');


    const navigate = useNavigate();

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/user`, {
                headers: {
                    Authorization: `${accessToken}`
                }
            })
                .then(response => {
                    if (response.data && response.data.body) {
                        setUsername(response.data.body.username);
                        setNickname(response.data.body.nickname);
                        setId(response.data.body.id);
                        setEmail(response.data.body.email);
                        setGender(response.data.body.gender);
                        setAge(response.data.body.age);
                        setHeight(response.data.body.height);
                        setWeight(response.data.body.weight);
                        setAddress(response.data.body.address);
                    } else {
                        console.log("응답에 닉네임 데이터가 없습니다.");
                    }
                })
                .catch(error => {
                    console.log("닉네임을 가져오는 중 오류가 발생했습니다.", error.response?.data || error.message);
                });
        } else {
            console.log("사용자 인증 토큰을 찾을 수 없습니다.");
        }
    }, []);

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    };

    const handleNicknameChange = (event) => {
        setNickname(event.target.value);
    };

    const toggleNicknameEdit = () => {
        setIsEditingNickname(!isEditingNickname);
    };

    const handleGenderChange = (event) => {
        setGender(event.target.value);
    };

    const toggleGenderEdit = () => {
        setIsEditingGender(!isEditingGender);
    };

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const toggleEmailEdit = () => {
        setIsEditingEmail(!isEditingEmail);
    };

    const handleAgeChange = (event) => {
        setAge(event.target.value);
    };

    const toggleAgeEdit = () => {
        setIsEditingAge(!isEditingAge);
    };

    const handleHeightChange = (event) => {
        setHeight(event.target.value);
    };

    const toggleHeightEdit = () => {
        setIsEditingHeight(!isEditingHeight);
    };

    const handleWeightChange = (event) => {
        setWeight(event.target.value);
    };

    const toggleWeightEdit = () => {
        setIsEditingWeight(!isEditingWeight);
    };

    const handelEditingButton = async () => {
        const accessToken = localStorage.getItem('accessToken');

        // address가 비어 있거나 null이면 기본값 '대한민국'을 설정
        const requestData = {
            nickname,
            email,
            age: parseInt(age, 10),
            gender,
            height: parseInt(height, 10),
            weight: parseInt(weight, 10),
            address: address || "대한민국"
        };

        console.log("Sending request data:", requestData);

        try {
            await axios.patch(`${process.env.REACT_APP_API_BASE_URL}/api/user/update`, requestData, {
                headers: {
                    Authorization: `${accessToken}`
                }
            });

            Swal.fire({
                icon: 'success',
                title: '정보 수정 완료',
                text: '정보가 성공적으로 수정되었습니다.',
                confirmButtonText: '확인',
                confirmButtonColor: '#754F23',
                background: '#F0EADC',
                iconColor: '#DBC797'
            });

        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: '정보 수정 실패',
                text: '문제가 발생했습니다. 다시 시도해주세요.',
                confirmButtonText: '확인',
                confirmButtonColor: '#754F23',
                background: '#F0EADC',
                iconColor: '#DBC797'
            });
            console.log(error);
        }
    };

    const handleLogout = () => {
        Swal.fire({
            title: '정말 로그아웃하시겠습니까?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: '로그아웃',
            cancelButtonText: '취소',
            confirmButtonColor: '#754F23',
            background: '#F0EADC',
            iconColor: '#DBC797'
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem("accessToken");
                localStorage.removeItem("role");
                navigate('/');
            }
        });
    };

    const handleDeleteAccount = async () => {
        Swal.fire({
            title: '정말 회원 탈퇴하시겠습니까?',
            text: '회원 정보를 복구할 수 없습니다.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: '탈퇴',
            cancelButtonText: '취소',
            confirmButtonColor: '#d33',
            background: '#F0EADC',
            iconColor: '#DBC797'
        }).then(async (result) => {
            if (result.isConfirmed) {
                const token = localStorage.getItem('accessToken');
                try {
                    const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/user/exit/${Id}`, {
                        method: 'DELETE',
                        headers: {
                            Authorization: `${token}`,
                        },
                    });

                    if (response.ok) {
                        Swal.fire({
                            icon: 'success',
                            title: '회원 탈퇴 완료',
                            text: '이용해 주셔서 감사합니다.',
                            confirmButtonText: '확인',
                            confirmButtonColor: '#754F23',
                            background: '#F0EADC',
                            iconColor: '#DBC797'
                        }).then(() => {
                            localStorage.removeItem("accessToken");
                            localStorage.removeItem("role");
                            navigate('/');
                        });
                    } else {
                        throw new Error('회원 탈퇴 실패');
                    }
                } catch (error) {
                    Swal.fire({
                        icon: 'error',
                        title: '회원 탈퇴 실패',
                        text: '문제가 발생했습니다. 다시 시도해주세요.',
                        confirmButtonText: '확인',
                        confirmButtonColor: '#754F23',
                        background: '#F0EADC',
                        iconColor: '#DBC797'
                    });
                }
            }
        });
    };

    return (
        <div className="order-container">
            <Sidebar handleDeleteAccount={handleDeleteAccount} handleLogout={handleLogout} />
            <div className="order-content-area">
                <div className="order-rectangle">
                    <div className="order-circle"><MdOutlineWavingHand size={38} color='#333' /></div>
                    <span className="order-text">{nickname} 님 안녕하세요!</span>
                </div>
                <div className="order-title">
                    <span><FaRegHandPointRight />    ------------------    정보 수정    ------------------    <FaRegHandPointLeft /></span>
                </div>

                <div className='profile-section'>

                    <div className='input-group'>
                        <label>아이디</label>
                        <input
                            type="text"
                            placeholder="Enter your full name"
                            value={username}
                            onChange={handleUsernameChange}
                            className="idtext"
                            readOnly
                        />
                    </div>

                    <div className='input-group'>
                        <label>닉네임</label>
                        {isEditingNickname ? (
                            <input type="text" value={nickname} onChange={handleNicknameChange} />
                        ) : (
                            <input type="text" value={nickname} readOnly />
                        )}
                        <button className="edit-button" onClick={toggleNicknameEdit}>
                            {isEditingNickname ? "완료" : "닉네임 수정"}
                        </button>
                    </div>

                    <div className='input-group'>
                        <label>이메일</label>
                        {isEditingEmail ? (
                            <input type="email" value={email} onChange={handleEmailChange} />
                        ) : (
                            <input type="email" value={email} readOnly />
                        )}
                        <button className="edit-button" onClick={toggleEmailEdit}>
                            {isEditingEmail ? "완료" : "이메일 수정"}
                        </button>
                    </div>

                    <div className='input-group'>
                        <label>나이</label>
                        {isEditingAge ? (
                            <input type="number" value={age} onChange={handleAgeChange}
                                onKeyDown={(e) => {
                                    if (["e", "E", "+", "-"].includes(e.key)) {
                                        e.preventDefault();
                                    }
                                }} />
                        ) : (
                            <input type="number" value={age} readOnly />
                        )}
                        <button className="edit-button" onClick={toggleAgeEdit}>
                            {isEditingAge ? "완료" : "나이 수정"}
                        </button>
                    </div>

                    <div className='input-group'>
                        <label>키</label>
                        {isEditingHeight ? (
                            <input type="number" value={height} onChange={handleHeightChange}
                                onKeyDown={(e) => {
                                    if (["e", "E", "+", "-"].includes(e.key)) {
                                        e.preventDefault();
                                    }
                                }} />
                        ) : (
                            <input type="number" value={height} readOnly />
                        )}
                        <button className="edit-button" onClick={toggleHeightEdit}>
                            {isEditingHeight ? "완료" : "키 수정"}
                        </button>
                    </div>

                    <div className='input-group'>
                        <label>몸무게</label>
                        {isEditingWeight ? (
                            <input type="number" value={weight} onChange={handleWeightChange}
                                onKeyDown={(e) => {
                                    if (["e", "E", "+", "-"].includes(e.key)) {
                                        e.preventDefault();
                                    }
                                }} />
                        ) : (
                            <input type="number" value={weight} readOnly />
                        )}
                        <button className="edit-button" onClick={toggleWeightEdit}>
                            {isEditingWeight ? "완료" : "몸무게 수정"}
                        </button>
                    </div>

                    <div className='input-group'>
                        <label>성별</label>
                        <div className="gender-container">
                            <input
                                id="a"
                                type="radio"
                                name="gender"
                                value="SECRET"
                                checked={gender === "SECRET"}
                                onChange={handleGenderChange}
                                className='gender-input'
                            />
                            <label htmlFor="a" className='label'>
                                <span className="label-span"></span>SECRET
                            </label>

                            <input
                                id="b"
                                type="radio"
                                name="gender"
                                value="MALE"
                                checked={gender === "MALE"}
                                onChange={handleGenderChange}
                                className='gender-input'
                            />
                            <label htmlFor="b" className='label'>
                                <span className="label-span"></span>MALE
                            </label>

                            <input
                                id="c"
                                type="radio"
                                name="gender"
                                value="FEMALE"
                                checked={gender === "FEMALE"}
                                onChange={handleGenderChange}
                                className='gender-input'
                            />
                            <label htmlFor="c" className='label'>
                                <span className="label-span"></span>FEMALE
                            </label>

                            <div className="worm">
                                {Array.from({ length: 30 }).map((_, index) => (
                                    <div className="worm__segment" key={index}></div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <button class="edit" type="button" onClick={handelEditingButton}>
                        <span class="edit-icon"></span>
                        <span>수정하기</span>
                    </button>



                </div>
            </div>
        </div>
    );
}

export default ChangeContainer;