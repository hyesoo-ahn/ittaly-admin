import React, { useContext, useEffect, useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { MainContext } from "../common/context";
import { IMainContext } from "../interface/interface";
import logo_w from "../images/logo_w.png";

function Layout(): JSX.Element {
  const context = useContext<IMainContext>(MainContext);
  const navigate = useNavigate();

  return (
    <>
      {/* <div className="flex">
        <p>This is header component.</p>
        <p>IS User:? {JSON.stringify(context.isUser)}</p>
        <button onClick={() => navigate("/login")}>Login</button>
        <button onClick={() => navigate("/signup")}>Signup</button>
      </div> */}

      <div className="body">
        {/* nav bar */}
        <nav className="nav_container">
          <div className="logo_wrapper">
            <img src={logo_w} style={{ width: 92, height: "auto" }} alt="logo" />
          </div>

          <div className="nav_contents">
            <p className="mb-20">대시보드</p>
            <div>
              <p>상품</p>
            </div>
            <div className="sub-catetory font-14">
              <div className="mb-20">
                <NavLink
                  to="productmanage"
                  className={({ isActive }) => {
                    return isActive ? "nav-active" : "nav-deactive";
                  }}
                >
                  상품관리
                </NavLink>
              </div>

              <div className="mb-20">
                <NavLink
                  to="addproduct"
                  className={({ isActive }) => {
                    return isActive ? "nav-active" : "nav-deactive";
                  }}
                >
                  상품등록
                </NavLink>
              </div>

              <div className="mb-20">
                <NavLink
                  to="brand"
                  className={({ isActive }) => {
                    return isActive ? "nav-active" : "nav-deactive";
                  }}
                >
                  브랜드 관리
                </NavLink>
              </div>
              <div className="mb-20">
                <NavLink
                  to="category"
                  className={({ isActive }) => {
                    return isActive ? "nav-active" : "nav-deactive";
                  }}
                >
                  카테고리 관리
                </NavLink>
              </div>
            </div>
          </div>
        </nav>

        {/* nav bar */}
        <div className="padding-40">
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default Layout;
