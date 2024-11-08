import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Header from './component/Header';
import Home from './component/Home';
import User_Login from './component/login/User_Login';
import Business_Login from './component/login/Business_Login';
import Business_Request from './component/login/Business_Request';
import Business_Product from './component/business/Business_Product';
import Business_ProductAdd from './component/business/Business_ProductAdd';
import Business_OrderList from './component/business/Business_OrderList';
import Business_Statistics from './component/business/Business_Statistics';
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
import Brand from './component/pages/Brand';
import Loading from './component/Loading';
import AboutUs from './component/AboutUs';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path='/user/login' element={<User_Login />} />
          <Route path='/business/login' element={<Business_Login />} />
          <Route path='/business/request' element={<Business_Request />} />
          <Route path='/business/product' element={<Business_Product />} />
          <Route path='/business/productadd' element={<Business_ProductAdd />} />
          <Route path='/business/orderlist' element={<Business_OrderList />} />
          <Route path='/business/statistics' element={<Business_Statistics />} />

          <Route path='/admin/userlist' element={<Admin_List />} />
          <Route path='/admin/management' element={<Admin_Management />} />
          <Route path='/admin/allproduct' element={<Admin_AllProduct />} />
          <Route path='/admin/statistics' element={<Admin_Statistics />} />

          <Route path='/pages/shop' element={<Shop />}/>
          <Route path='/pages/shop/detail' element={<Shop_Detail />}/>
          <Route path="/pages/brands" element={<Brand />} />

          <Route path='/mypages/orderlist' element={<Mypage_Order />}/>
          <Route path='/mypages/like' element={<Mypage_Like />}/>
          <Route path='/mypages/question' element={<Mypage_Question />}/>
          <Route path='/mypages/change' element={<Mypage_Change />}/>
          <Route path='/mypages/cart' element={<Mypage_Cart />}/>

          <Route path='/loading' element={<Loading />} />
          <Route path='/aboutus' element={<AboutUs />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;