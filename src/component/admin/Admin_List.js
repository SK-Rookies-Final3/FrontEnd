import React, { useState, useEffect } from 'react';
import '../css/Business_Form.css';
import '../css/Admin_List.css';
import { FaSearch } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from "axios";

function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();

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

    return (
        <div className="business_sidebar">
            <ul>
                <li className={location.pathname === '/admin/userlist' ? 'active' : ''}
                    onClick={() => navigate('/admin/userlist')}>사용자 목록</li>
                <li className={location.pathname === '/admin/management' ? 'active' : ''}
                    onClick={() => navigate('/admin/management')}>기업 승인 및 거절</li>
                <li className={location.pathname === '/admin/allproduct' ? 'active' : ''}
                    onClick={() => navigate('/admin/allproduct')}>물품 목록 및 확인</li>
                <li className={location.pathname === '/admin/statistics' ? 'active' : ''}
                    onClick={() => navigate('/admin/statistics')}>통계</li>
                <li onClick={handleLogout}>로그아웃</li>
            </ul>
        </div>
    );
}

function AdminList() {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterRole, setFilterRole] = useState('ALL');
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/user/master`, {
                headers: {
                    Authorization: `${accessToken}`
                }
            })
                .then(response => {
                    console.log(response.data);
                    if (response.data) {
                        setUsers(response.data);
                    }
                })
                .catch(error => {
                    console.log("데이터를 가져오는 중 오류가 발생했습니다.", error);
                });
        }
    }, []);

    return (
        <div className="admin-container">
            <Sidebar />
            <div className="main-admin-content">
                <div className="admin-user-header">
                    <span className="store-text">USER ALL LIST</span>
                    <div className="user-search-box">
                        <input
                            className="user-search-text"
                            type="text"
                            placeholder="사용자 검색"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)} />
                        <div className="user-search-btn">
                            <FaSearch />
                        </div>
                    </div>
                </div>
                <div className="content-wrapper">
                    <div className="filter-buttons">
                        <button onClick={() => setFilterRole('ALL')}>전체 사용자</button>
                        <button onClick={() => setFilterRole('CLIENT')}>일반 사용자</button>
                        <button onClick={() => setFilterRole('OWNER')}>기업 사용자</button>
                    </div>
                    <UserTable users={users} searchQuery={searchQuery} filterRole={filterRole} setUsers={setUsers} />
                </div>
            </div>
        </div>
    );
}

function UserTable({ users, searchQuery, filterRole, setUsers }) {
    const handleDeleteButtonClick = async (username, event, targetId) => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            console.log("토큰이 없습니다.");
            return;
        }

        const result = await Swal.fire({
            icon: 'warning',
            title: `ID : ${username} 을(를) 정말 강제 탈퇴 시키겠습니까?`,
            showCancelButton: true,
            confirmButtonText: '삭제',
            cancelButtonText: '취소',
            confirmButtonColor: '#754F23',
            background: '#F0EADC',
            color: '#754F23',
            iconColor: '#DBC797'
        });

        if (result.isConfirmed) {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/user/master/exit/${targetId}`, {
                    method: 'DELETE',
                    headers: {
                        Authorization: `${token}`,
                    },
                });

                if (response.ok) {
                    const button = event.target.closest('.delete_btn');
                    const animation = button.querySelector('.animation');
                    const row = button.closest('tr');
                    animation.style.display = 'flex';
                    button.classList.add('click');

                    setTimeout(() => {
                        row.classList.add('fade-out');
                    }, 2000);

                    setTimeout(() => {
                        const updatedUsers = users.filter((user) => user.id !== targetId);
                        setUsers(updatedUsers);
                    }, 2500);
                } else {
                    console.log("사용자 삭제에 실패했습니다.");
                }
            } catch (error) {
                console.log("API 요청 중 오류가 발생했습니다:", error);
            }
        }
    };

    const filteredUsers = users.filter((user) => {
        const matchesSearch = user.username.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRole = filterRole === 'ALL' || user.role === filterRole;
        return matchesSearch && matchesRole;
    });

    return (
        <table className="users-table">
            <thead>
                <tr>
                    <th>No</th>
                    <th>ID</th>
                    <th>NickName</th>
                    <th>Role</th>
                    <th>가입일</th>
                    <th>삭제</th>
                </tr>
            </thead>
            <tbody>
                {filteredUsers.map((user, index) => (
                    <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.username}</td>
                        <td>{user.nickname}</td>
                        <td>{user.role}</td>
                        <td>{user.createdAt.slice(0, 19).replace('T', ' ')}</td>
                        <td>
                            <button className="delete_btn" onClick={(e) => handleDeleteButtonClick(user.username, e, user.id)}>
                                <span className="button-text">Delete</span>
                                <span className="animation">
                                    <span className="paper-wrapper">
                                        <span className="paper"></span>
                                    </span>
                                    <span className="shredded-wrapper">
                                        <span className="shredded"></span>
                                    </span>
                                    <span className="can">
                                        <span className="filler"></span>
                                    </span>
                                </span>
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default AdminList;