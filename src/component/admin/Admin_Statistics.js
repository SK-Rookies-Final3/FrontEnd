import React, { useEffect, useState } from 'react';
import ReactGA from 'react-ga4';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

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

function AdminStatistics() {
    const [analyticsData, setAnalyticsData] = useState([]);

    useEffect(() => {
        ReactGA.send({ hitType: 'pageview', page: '/admin/statistics' });
    }, []);

    useEffect(() => {
        const fetchAnalyticsData = async () => {
            try {
                const response = await axios.post(
                    'https://analyticsdata.googleapis.com/v1beta/properties/463382170:runReport',
                    {
                        dateRanges: [{ startDate: '90daysAgo', endDate: 'today' }],
                        metrics: [
                            { name: 'screenPageViews' },
                            { name: 'averageSessionDuration' }
                        ],
                        dimensions: [{ name: 'pagePath' }],
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${process.env.REACT_APP_API_BASE_URL_Googleanalyticsdata}`,
                            'Content-Type': 'application/json',
                        },
                    }
                );

                // console.log('API Response:', response.data);
                setAnalyticsData(response.data.rows || []);
            } catch (error) {
                // console.error('Error fetching analytics data:', error.response ? error.response.data : error.message);
                // Swal.fire('에러', '데이터를 불러오는 중 오류가 발생했습니다.', 'error');
            }
        };

        fetchAnalyticsData();
    }, []);

    // 전체 차트 데이터 생성
    const filteredOverallData = analyticsData
        .filter(row => !row.dimensionValues[0].value.startsWith('/pages/shop/detail/'));

    const chartData = {
        labels: filteredOverallData.map(row => row.dimensionValues[0].value),
        datasets: [
            {
                label: 'Page Views',
                data: filteredOverallData.map(row => parseInt(row.metricValues[0].value, 10)),
                backgroundColor: filteredOverallData.map(row =>
                    row.dimensionValues[0].value === '/' ? '#FF9800' : '#64B5F6'
                ),
            },
        ],
    };

    // /pages/shop/detail/로 시작하는 데이터만 필터링 및 정렬
    const filteredData = analyticsData
        .filter(row => row.dimensionValues[0].value.startsWith('/pages/shop/detail/'))
        .sort((a, b) => parseInt(b.metricValues[0].value, 10) - parseInt(a.metricValues[0].value, 10));

    const filteredChartData = {
        labels: filteredData.map(row => row.dimensionValues[0].value),
        datasets: [
            {
                label: 'Detail Page Views',
                data: filteredData.map(row => parseInt(row.metricValues[0].value, 10)),
                backgroundColor: '#eaa0ff',
            },
        ],
    };

    // 평균 세션 유지시간을 기준으로 데이터 생성 및 정렬
    const averageSessionDurationData = analyticsData
        .map(row => ({
            pagePath: row.dimensionValues[0].value,
            duration: parseFloat(row.metricValues[1].value),
        }))
        .sort((a, b) => b.duration - a.duration);

    const sessionDurationChartData = {
        labels: averageSessionDurationData.map(row => row.pagePath),
        datasets: [
            {
                label: 'Average Session Duration (Seconds)',
                data: averageSessionDurationData.map(row => row.duration),
                backgroundColor: '#31b822',
            },
        ],
    };

    return (
        <div className="admin-container">
            <Sidebar />
            <div className="main-admin-content">
                <span className="productall-text" style={{ marginLeft: '30px', fontSize: '20px', fontWeight: 'bold', backgroundColor: '#EAE1D3', padding: '5px 15px', borderRadius: '20px' }}>
                    통계
                </span>
                <h3>전체 페이지 조회수</h3>
                <div style={{ width: '80%', margin: '30px auto' }}>
                    <Bar data={chartData} />
                </div>
                <h3>상세 페이지 인기순 조회수</h3>
                <div style={{ width: '80%', margin: '30px auto' }}>
                    <Bar data={filteredChartData} />
                </div>
                <h3>페이지별 평균 세션 유지 시간</h3>
                <div style={{ width: '80%', margin: '30px auto' }}>
                    <Bar data={sessionDurationChartData} />
                </div>
            </div>
        </div>
    );
}

export default AdminStatistics;