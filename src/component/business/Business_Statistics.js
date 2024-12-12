import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../css/Business_Form.css';
import '../css/Business_Statistics.css';
import Swal from 'sweetalert2';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    LineChart,
    Line,
} from 'recharts';

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
                sessionStorage.removeItem("id");
                navigate('/');
            }
        });
    };

    return (
        <div className="business_sidebar">
            <ul>
                <li className={location.pathname === '/business/product' ? 'active' : ''}
                    onClick={() => navigate('/business/product')}>물품 목록 및 확인</li>
                <li className={location.pathname === '/business/orderlist' ? 'active' : ''}
                    onClick={() => navigate('/business/orderlist')}>주문 목록 확인</li>
                <li className={location.pathname === '/business/statistics' ? 'active' : ''}
                    onClick={() => navigate('/business/statistics')}>통계</li>
                <li onClick={handleLogout}>로그아웃</li>
            </ul>
        </div>
    );
}

function BusinessStatistics() {
    const [productData, setProductData] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();

    // 주문 데이터 가져오기
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                console.log("/////////Token////////");
                console.log(`${sessionStorage.getItem("accessToken")}`);
                const response = await fetch(
                    `${process.env.REACT_APP_API_BASE_URL_APIgateway}/api/order/owner`,
                    {
                        method: 'GET',
                        headers: {
                            'Authorization': `${sessionStorage.getItem("accessToken")}`,
                            'Content-Type': 'application/json'
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                console.log("응답 데이터 (주문):", data);
                processProductData(data);
            } catch (err) {
                console.error('주문 조회를 가져오는 데 실패했습니다:', err);
            }
        };

        fetchOrders();
    }, []);

    // 주문 데이터를 productCode별로 집계
    const processProductData = (data) => {
        const productAggregatedData = {};

        data.forEach(order => {
            // 각 주문에서 고유한 productCode를 추출
            const uniqueProductCodes = new Set(order.orderItems.map(item => item.productCode));

            uniqueProductCodes.forEach(productCode => {
                const firstItem = order.orderItems.find(item => item.productCode === productCode);
                if (!productAggregatedData[productCode]) {
                    productAggregatedData[productCode] = {
                        productCode: productCode,
                        name: firstItem.name,
                        totalRevenue: 0,
                        productsSold: 0,
                        orderCount: 0
                    };
                }
                productAggregatedData[productCode].orderCount += 1;
            });

            // 주문 항목을 순회하며 총 매출과 판매된 상품 수를 집계
            order.orderItems.forEach(item => {
                if (!productAggregatedData[item.productCode]) {
                    productAggregatedData[item.productCode] = {
                        productCode: item.productCode,
                        name: item.name,
                        totalRevenue: 0,
                        productsSold: 0,
                        orderCount: 0
                    };
                }
                productAggregatedData[item.productCode].totalRevenue += item.price * item.stock;
                productAggregatedData[item.productCode].productsSold += item.stock;
            });
        });

        // 집계된 데이터를 배열로 변환하고 총 매출 기준 내림차순 정렬
        const productChartData = Object.values(productAggregatedData).sort((a, b) => b.totalRevenue - a.totalRevenue);
        console.log("집계된 productCode별 차트 데이터:", productChartData);
        setProductData(productChartData);
    };

    // 파이차트를 위한 색상 배열
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28BFF', '#FF6699', '#FF6384', '#36A2EB'];

    return (
        <div className="business-containers">
            <Sidebar />
            <div className="statistics-content">
                <h2>통계</h2>
                {productData.length > 0 ? (
                    <>
                        {/* 제품별 총 매출 차트 */}
                        <div className="chart-container">
                            <h3>제품별 총 매출</h3>
                            <ResponsiveContainer width="100%" height={400}>
                                <BarChart
                                    data={productData}
                                    margin={{
                                        top: 20, right: 30, left: 20, bottom: 5,
                                    }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="totalRevenue" fill="#8884d8" name="총 매출" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        {/* 제품별 판매된 상품 수 차트 */}
                        <div className="chart-container">
                            <h3>제품별 판매된 상품 수</h3>
                            <ResponsiveContainer width="100%" height={400}>
                                <BarChart
                                    data={productData}
                                    margin={{
                                        top: 20, right: 30, left: 20, bottom: 5,
                                    }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="productsSold" fill="#82ca9d" name="판매된 상품 수" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </>
                ) : (
                    <p>데이터를 불러오는 중입니다...</p>
                )}
            </div>
        </div>
    );
}

export default BusinessStatistics;