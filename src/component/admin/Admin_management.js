import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
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

function CompanyTable({ searchQuery }) {
    const [companys, setCompanys] = useState([
        { no: 1, name: '나이키', owner: '우예리', status: '미완료', applied: '2024-11-01' },
        { no: 2, name: '아디다스', owner: '이선희', status: '미완료', applied: '2024-10-30' },
        { no: 3, name: '비비안', owner: '백지연', status: '미완료', applied: '2024-10-25' },
        { no: 4, name: '폴로', owner: '강민수', status: '미완료', applied: '2024-11-01' },
        { no: 5, name: '라코스테', owner: '장나영', status: '미완료', applied: '2024-10-30' },
        { no: 6, name: '보테가', owner: '김민재', status: '미완료', applied: '2024-10-25' },
        { no: 7, name: '꼼데', owner: '황서정', status: '미완료', applied: '2024-11-01' },
        { no: 8, name: '아미', owner: '홍민혁', status: '미완료', applied: '2024-10-30' },
        { no: 9, name: '디젤', owner: '정우석', status: '미완료', applied: '2024-10-25' },
    ]);
    
    const handleApproval = (companyNo, event) => {
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
        }).then((result) => {
            if (result.isConfirmed) {
              const button = event.target.closest('.approve-btn');
              const row = button.closest('tr');
              
              // Add the fade-out class before removing the company
              row.classList.add('fade-out');
              setTimeout(() => {
                setCompanys((prevCompanys) => prevCompanys.filter(companys => companys.no !== companyNo));
                console.log(`Company ${companyNo} approved`);
              }, 500);
            }
        });
    };

    const handleRejection = (companyNo, event) => {
      Swal.fire({
          title: '거절하시겠습니까?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: '거절',
          cancelButtonText: '취소',
          confirmButtonColor: '#f44336',
          cancelButtonColor: '#4CAF50',
          background: '#F0EADC',
      }).then((result) => {
          if (result.isConfirmed) {
              const button = event.target.closest('.reject-btn');
              const row = button.closest('tr');
              
              // Add the fade-out class before removing the company
              row.classList.add('fade-out');
  
              // After the animation ends (1.5 seconds), remove the company from the list
              setTimeout(() => {
                  setCompanys((prevCompanys) => prevCompanys.filter(company => company.no !== companyNo));
                  console.log(`company ${companyNo} rejected`);
              }, 500); // Ensure this matches the duration of your animation
          }
      });
  };
  

    const filteredCompanys = companys.filter((company) =>
        company.name.includes(searchQuery) || company.owner.includes(searchQuery)
    );

    return (
        <table className="companys-table">
            <thead>
                <tr>
                    <th>번호</th>
                    <th>가게명</th>
                    <th>점주</th>
                    <th>상태</th>
                    <th>신청일</th>
                    <th>작업</th>
                </tr>
            </thead>
            <tbody>
                {filteredCompanys.map((company) => (
                    <tr key={company.no}>
                        <td>{company.no}</td>
                        <td>{company.name}</td>
                        <td>{company.owner}</td>
                        <td>{company.status}</td>
                        <td>{company.applied}</td>
                        <td>
                            <button className="approve-btn" onClick={(e) => handleApproval(company.no, e)}>승인</button>
                            <button className="reject-btn" onClick={(e) => handleRejection(company.no, e)}>거절</button>

                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default Admin_management;
