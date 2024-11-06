import React, { useState } from 'react';
import '../css/Business_Form.css';
import '../css/Admin_List.css';
import { FaSearch } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';

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
                    <UserTable searchQuery={searchQuery} filterRole={filterRole} />
                </div>
            </div>
        </div>
    );
}

function UserTable({ searchQuery, filterRole }) {
    const [users, setUsers] = useState([
        { no: 1, name: 'a', nickname: '150,000', role: 'CLIENT', registered: '2024.10.11' },
        { no: 2, name: 'b', nickname: '150,000', role: 'CLIENT', registered: '2024.10.11' },
        { no: 3, name: 'c', nickname: '150,000', role: 'CLIENT', registered: '2024.10.11' },
        { no: 4, name: 'd', nickname: '150,000', role: 'OWNER', registered: '2024.10.11' },
        { no: 5, name: 'e', nickname: '150,000', role: 'CLIENT', registered: '2024.10.11' },
        { no: 6, name: 'f', nickname: '150,000', role: 'CLIENT', registered: '2024.10.11' },
        { no: 7, name: 'g', nickname: '150,000', role: 'OWNER', registered: '2024.10.11' },
    ]);

    const handleDeleteButtonClick = (userNo, event) => {
        Swal.fire({
            icon: 'warning',
            title: '정말 삭제하시겠습니까?',
            showCancelButton: true,
            confirmButtonText: '삭제',
            cancelButtonText: '취소',
            confirmButtonColor: '#754F23',
            background: '#F0EADC',
            color: '#754F23',
            iconColor: '#DBC797'
        }).then((result) => {
            if (result.isConfirmed) {
                const button = event.target.closest('.delete_btn');
                const animation = button.querySelector('.animation');
                const row = button.closest('tr');
                animation.style.display = 'flex';
                button.classList.add('click');

                setTimeout(() => {
                    row.classList.add('fade-out');
                }, 2000);

                setTimeout(() => {
                    const updatedUsers = users.filter((user) => user.no !== userNo);
                    setUsers(updatedUsers);
                }, 2500);
            }
        });
    };

    const filteredUsers = users.filter((user) => {
        const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase());
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
                {filteredUsers.map((user) => (
                    <tr key={user.no}>
                        <td>{user.no}</td>
                        <td>{user.name}</td>
                        <td>{user.nickname}</td>
                        <td>{user.role}</td>
                        <td>{user.registered}</td>
                        <td>
                            <button className="delete_btn" onClick={(e) => handleDeleteButtonClick(user.no, e)}>
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