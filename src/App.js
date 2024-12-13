import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Header from './component/Header';
import Home from './component/Home';
import User_Login from './component/login/User_Login';
import Business_Login from './component/login/Business_Login';
import Admin_Login from './component/login/Admin_Login';
import Admin_Register from './component/login/Admin_Register';
import Business_Request from './component/login/Business_Request';
import Business_Product from './component/business/Business_Product';
import Business_ProductAdd from './component/business/Business_ProductAdd';
import Business_OrderList from './component/business/Business_OrderList';
import Business_Statistics from './component/business/Business_Statistics';
import Business_Loading from './component/business/Business_Loading';
import Admin_List from './component/admin/Admin_List';
import Admin_Management from './component/admin/Admin_management';
import Admin_AllProduct from './component/admin/Admin_AllProduct';
import Admin_Statistics from './component/admin/Admin_Statistics';
import Shop from './component/pages/Shop';
import Shop_Detail from './component/pages/Shop_Detail';
import Mypage_Order from './component/mypages/Mypage_Order';
import Mypage_Like from './component/mypages/Mypage_Like';
import Mypage_Question from './component/mypages/Mypage_Question';
import Mypage_Change from './component/mypages/Mypage_Change';
import Mypage_Cart from './component/mypages/Mypage_Cart';
import Mypage_Pay from './component/mypages/Mypage_Pay';
import Brand from './component/pages/Brand';
import Loading from './component/Loading';
import AboutUs from './component/AboutUs';
import Unauthorized from './component/Unauthorized';
import PrivateRoute from './component/PrivateRoute';
import ReactGA from 'react-ga';
import { createBrowserHistory } from 'history';

function App() {

  const history = createBrowserHistory()
  React.useEffect(() => {
    ReactGA.initialize('G-J3S2D3P4GW');
    
    // 메인 페이지 초기 로드 트래킹
    if (window.location.pathname === "/") {
      ReactGA.set({ page: "/" });
      ReactGA.pageview("/");
    }
  
    history.listen((location) => {
      if (location.pathname === "/") {
        ReactGA.set({ page: location.pathname });
        ReactGA.pageview(location.pathname);
      }
    });
  }, [])

  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          {/* 공용 페이지 */}
          <Route path="/" element={<Home />} />
          <Route path="/user/login" element={<User_Login />} />
          <Route path="/business/login" element={<Business_Login />} />
          <Route path="/djemals/login" element={<Admin_Login />} />
          <Route path="/djemals/register" element={<Admin_Register />} />
          <Route path="/pages/brands" element={<Brand />} />
          <Route path="/pages/shop" element={<Shop />} />
          <Route path="/pages/shop/detail/:productCode" element={<Shop_Detail />} />
          <Route path="/aboutus" element={<AboutUs />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* CLIENT 전용 */}
          <Route
            path="/mypages/orderlist"
            element={
              <PrivateRoute allowedRoles={['CLIENT']}>
                <Mypage_Order />
              </PrivateRoute>
            }
          />
          <Route
            path="/mypages/like"
            element={
              <PrivateRoute allowedRoles={['CLIENT']}>
                <Mypage_Like />
              </PrivateRoute>
            }
          />
          <Route
            path="/mypages/question"
            element={
              <PrivateRoute allowedRoles={['CLIENT']}>
                <Mypage_Question />
              </PrivateRoute>
            }
          />
          <Route
            path="/mypages/change"
            element={
              <PrivateRoute allowedRoles={['CLIENT']}>
                <Mypage_Change />
              </PrivateRoute>
            }
          />
          <Route
            path="/mypages/cart"
            element={
              <PrivateRoute allowedRoles={['CLIENT']}>
                <Mypage_Cart />
              </PrivateRoute>
            }
          />
          <Route
            path="/mypages/pay"
            element={
              <PrivateRoute allowedRoles={['CLIENT']}>
                <Mypage_Pay />
              </PrivateRoute>
            }
          />

          {/* BUSINESS 전용 */}
          <Route
            path="/business/request"
            element={
              <PrivateRoute allowedRoles={['OWNER']}>
                <Business_Request />
              </PrivateRoute>
            }
          />
          <Route
            path="/business/product"
            element={
              <PrivateRoute allowedRoles={['OWNER']}>
                <Business_Product />
              </PrivateRoute>
            }
          />
          <Route
            path="/business/productadd"
            element={
              <PrivateRoute allowedRoles={['OWNER']}>
                <Business_ProductAdd />
              </PrivateRoute>
            }
          />
          <Route
            path="/business/orderlist"
            element={
              <PrivateRoute allowedRoles={['OWNER']}>
                <Business_OrderList />
              </PrivateRoute>
            }
          />
          <Route
            path="/business/statistics"
            element={
              <PrivateRoute allowedRoles={['OWNER']}>
                <Business_Statistics />
              </PrivateRoute>
            }
          />

          {/* MASTER 전용 */}
          <Route
            path="/admin/userlist"
            element={
              <PrivateRoute allowedRoles={['MASTER']}>
                <Admin_List />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/management"
            element={
              <PrivateRoute allowedRoles={['MASTER']}>
                <Admin_Management />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/allproduct"
            element={
              <PrivateRoute allowedRoles={['MASTER']}>
                <Admin_AllProduct />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/statistics"
            element={
              <PrivateRoute allowedRoles={['MASTER']}>
                <Admin_Statistics />
              </PrivateRoute>
            }
          />

          {/* 로딩 페이지 */}
          <Route path="/loading" element={<Loading />} />
          <Route path="/business/loading" element={<Business_Loading />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;