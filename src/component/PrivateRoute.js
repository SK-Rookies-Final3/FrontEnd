import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, allowedRoles }) => {
    const accessToken = sessionStorage.getItem("accessToken"); // accessToken 확인
    const userRole = sessionStorage.getItem("role"); // role 확인

    if (!accessToken) {
        // accessToken이 없으면 로그인 페이지로 리디렉트
        return <Navigate to="/user/login" />;
    }

    if (!allowedRoles.includes(userRole)) {
        // role이 허용되지 않은 경우 Unauthorized 페이지로 리디렉트
        return <Navigate to="/unauthorized" />;
    }

    return children; // 조건 만족 시 자식 컴포넌트 렌더링
};

export default PrivateRoute;