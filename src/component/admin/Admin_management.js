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
                sessionStorage.removeItem("accessToken");
                sessionStorage.removeItem("role");
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

function CompanyTable({ searchQuery }) {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const accessToken = sessionStorage.getItem('accessToken');

                // 사용자 데이터 가져오기
                const usersResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/user/master`, {
                    headers: {
                        Authorization: `${accessToken}`
                    }
                });
                const userList = usersResponse.data;
                // console.log('Fetched Users:', userList);

                const ownerIds = userList
                    .filter(user => user.role === 'OWNER')
                    .map(owner => owner.id);

                // console.log('Owner IDs:', ownerIds);

                // 기업 데이터 가져오기
                const companiesResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL_APIgateway}/open-api/brand/store `, {
                    headers: {
                        Authorization: `${accessToken}`
                    }
                });
                // console.log('Fetched Companies:', companiesResponse.data);

                if (companiesResponse.data) {
                    // OWNER의 id와 일치하는 기업만 필터링
                    const filteredCompanies = companiesResponse.data.filter(company => ownerIds.includes(company.userId));

                    // console.log('Filtered Companies:', filteredCompanies);

                    setCompanies(filteredCompanies.map((company) => ({
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
                // console.error("데이터를 가져오는 중 오류가 발생했습니다.", error);
                if (error.response) {
                    // console.error("응답 데이터:", error.response.data);
                    // console.error("응답 상태:", error.response.status);
                    // console.error("응답 헤더:", error.response.headers);
                } else if (error.request) {
                    // console.error("요청:", error.request);
                } else {
                    // console.error("오류 메시지:", error.message);
                }
                Swal.fire('오류 발생', '데이터를 가져오는 중 문제가 발생했습니다.', 'error');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleApproval = async (storeId, userId) => {
        const accessToken = sessionStorage.getItem('accessToken');
        const result = await Swal.fire({
            title: '승인하시겠습니까?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: '승인',
            cancelButtonText: '취소',
            confirmButtonColor: '#4CAF50',
            cancelButtonColor: '#f44336',
            background: '#F0EADC',
            iconColor: '#754F23',
        });

        if (result.isConfirmed) {
            try {
                await axios.patch(
                    `${process.env.REACT_APP_API_BASE_URL_APIgateway}/api/brand/store/master/${storeId}/status`,
                    { status: 1 },
                    {
                        headers: {
                            Authorization: `${accessToken}`
                        },
                    }
                );

                Swal.fire('승인 완료', '해당 가게가 승인되었습니다.', 'success');

                setCompanies((prevCompanies) =>
                    prevCompanies.map((company) =>
                        company.id === storeId ? { ...company, status: '승인' } : company
                    )
                );

                // console.log('Updated Companies after Approval:', companies);

            } catch (error) {
                Swal.fire('오류 발생', '승인 중 문제가 발생했습니다.', 'error');
                // console.error(error);
            }
        }
    };

    const handleRejection = async (storeId, userId) => {
        const accessToken = sessionStorage.getItem('accessToken');
        const result = await Swal.fire({
            title: '거절하시겠습니까?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: '거절',
            cancelButtonText: '취소',
            confirmButtonColor: '#f44336',
            cancelButtonColor: '#4CAF50',
            background: '#F0EADC',
        });

        if (result.isConfirmed) {
            try {
                await axios.patch(
                    `${process.env.REACT_APP_API_BASE_URL_APIgateway}/api/brand/store/master/${storeId}/status`,
                    { status: 2 },
                    {
                        headers: {
                            Authorization: `${accessToken}`
                        },
                    }
                );

                Swal.fire('거절 완료', '해당 가게가 거절되었습니다.', 'success');

                setCompanies((prevCompanies) =>
                    prevCompanies.map((company) =>
                        company.id === storeId ? { ...company, status: '거절' } : company
                    )
                );

                // console.log('Updated Companies after Rejection:', companies);

            } catch (error) {
                Swal.fire('오류 발생', '거절 중 문제가 발생했습니다.', 'error');
                // console.error(error);
            }
        }
    };

    const filteredCompanies = companies.filter((company) =>
        company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.userId.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <table className="product-table">
            <thead>
                <tr>
                    <th>사용자 ID</th>
                    <th>가게명</th>
                    <th>사업자 번호</th>
                    <th>상태</th>
                    <th>작업</th>
                </tr>
            </thead>
            <tbody>
                {filteredCompanies.map((company) => (
                    <tr key={company.id}>
                        <td>{company.userId}</td>
                        <td>{company.name}</td>
                        <td>{company.licenseNumber}</td>
                        <td>{company.status}</td>
                        <td>
                            <button
                                className="approve-btn"
                                onClick={() => handleApproval(company.id, company.userId)}
                                disabled={company.status === '승인'}
                                style={{
                                    opacity: company.status === '승인' ? 0.2 : 1,
                                    cursor: company.status === '승인' ? 'not-allowed' : 'pointer'
                                }}
                            >
                                승인
                            </button>
                            <button
                                className="reject-btn"
                                onClick={() => handleRejection(company.id, company.userId)}
                                disabled={company.status === '거절'}
                                style={{
                                    opacity: company.status === '거절' ? 0.2 : 1,
                                    cursor: company.status === '거절' ? 'not-allowed' : 'pointer'
                                }}
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