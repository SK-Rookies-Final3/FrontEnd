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
import Shop from './component/pages/Shop';
// import Loading from './component/Loading';

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
          <Route path='/pages/shop' element={<Shop />}/>
          {/* <Route path='/loading' element={<Loading />} /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;