import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from "axios";
import Swal from 'sweetalert2';
import '../css/Business_Form.css';
import '../css/Admin_List.css';
import '../css/Admin_management.css';

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

function Admin_management() {
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <div className="admin-container">
            <Sidebar />
            <div className="main-admin-content">
                <div className="admin-user-header">
                    <span className="company-text">기업 승인 및 거절</span>
                    <div className="company-search-box">
                        <input
                            className="company-search-text"
                            type="text"
                            placeholder="기업 검색"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)} />
                        <div className="company-search-btn">
                            <FaSearch />
                        </div>
                    </div>
                </div>
                <CompanyTable searchQuery={searchQuery} />
            </div>
        </div>
    );
}

function CompanyTable() {
    const [companies, setCompanies] = useState([]);

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL_APIgateway}/open-api/store/`);
                console.log(response.data);

                if (response.data) {
                    setCompanies(response.data.map((company) => ({
                        id: company.id,
                        userId: company.userId,
                        name: company.name,
                        licenseNumber: company.licenseNumber,
                        status: company.status === 0
                            ? '미완료'
                            : company.status === 1
                                ? '승인'
                                : '거절',
                    })));
                }
            } catch (error) {
                console.error("데이터를 가져오는 중 오류가 발생했습니다.", error);
            }
        };

        fetchCompanies();
    }, []);

    const handleApproval = async (storeId, userId) => {
        Swal.fire({
            title: '승인하시겠습니까?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: '승인',
            cancelButtonText: '취소',
            confirmButtonColor: '#4CAF50',
            cancelButtonColor: '#f44336',
            background: '#F0EADC',
            iconColor: '#754F23',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await axios.put(
                        `${process.env.REACT_APP_API_BASE_URL_APIgateway}/api/store/master/${storeId}/status`,
                        { status: 1 },
                        {
                            headers: {
                                Authorization: localStorage.getItem("accessToken"),
                            },
                        }
                    );
                    if (response.status === 200) {
                        Swal.fire('승인 완료', '해당 가게가 승인되었습니다.', 'success');
                        setCompanies((prevCompanies) => prevCompanies.filter((company) => company.id !== storeId));
                    }
                } catch (error) {
                    Swal.fire('오류 발생', '승인 중 문제가 발생했습니다.', 'error');
                    console.error(error);
                }
            }
        });
    };

    const handleRejection = async (storeId, userId) => {
        Swal.fire({
            title: '거절하시겠습니까?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: '거절',
            cancelButtonText: '취소',
            confirmButtonColor: '#f44336',
            cancelButtonColor: '#4CAF50',
            background: '#F0EADC',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await axios.put(
                        `${process.env.REACT_APP_API_BASE_URL_APIgateway}/api/store/master/${storeId}/status`,
                        { status: 2 },
                        {
                            headers: {
                                Authorization: localStorage.getItem("accessToken"),
                            },
                        }
                    );
                    if (response.status === 200) {
                        Swal.fire('거절 완료', '해당 가게가 거절되었습니다.', 'success');
                        setCompanies((prevCompanies) => prevCompanies.filter((company) => company.id !== storeId));
                    }
                } catch (error) {
                    Swal.fire('오류 발생', '거절 중 문제가 발생했습니다.', 'error');
                    console.error(error);
                }
            }
        });
    };

    return (
        <table className="companies-table">
            <thead>
                <tr>
                    {/* <th>아이디</th> */}
                    <th>사용자 ID</th>
                    <th>가게명</th>
                    <th>사업자 번호</th>
                    <th>상태</th>
                    {/* <th>등록일</th> */}
                    {/* <th>작업</th> */}
                </tr>
            </thead>
            <tbody>
                {companies.map((company) => (
                    <tr key={company.id}>
                        {/* <td>{company.id}</td> */}
                        <td>{company.userId}</td>
                        <td>{company.name}</td>
                        <td>{company.licenseNumber}</td>
                        <td>{company.status}</td>
                        {/* <td>{company.registeredAt}</td> */}
                        <td>
                            <button
                                className="approve-btn"
                                onClick={() => handleApproval(company.id, company.userId)}
                            >
                                승인
                            </button>
                            <button
                                className="reject-btn"
                                onClick={() => handleRejection(company.id, company.userId)}
                            >
                                거절
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default Admin_management;
