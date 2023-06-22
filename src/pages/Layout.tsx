import React, { useContext, useEffect, useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { MainContext } from "../common/context";
import { IMainContext } from "../interface/interface";
import logo_w from "../images/logo_w.png";

function Layout(): JSX.Element {
  const context = useContext<IMainContext>(MainContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    context.handleStateChange("isUser", false);
    localStorage.removeItem("admin");
    navigate("/");
  };

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
        <nav className="nav_container justify-sb">
          <div>
            <div className="logo_wrapper">
              <img src={logo_w} style={{ width: 92, height: "auto" }} alt="logo" />
            </div>

            <div className="nav_contents">
              <div className="mb-20 font-14">
                <NavLink
                  to="/"
                  className={({ isActive }) => {
                    return isActive ? "nav-active" : "nav-deactive";
                  }}
                >
                  대시보드
                </NavLink>
              </div>
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

              <div>
                <p>사이트 관리</p>
              </div>
              <div className="sub-catetory font-14">
                <div className="mb-20">첫 화면 관리</div>
                <div className="sub-category2">
                  <div className="mb-20">
                    <NavLink
                      to="banner"
                      className={({ isActive }) => {
                        return isActive ? "nav-active" : "nav-deactive";
                      }}
                    >
                      상단배너
                    </NavLink>
                  </div>

                  <div className="mb-20">
                    <NavLink
                      to="promotion"
                      className={({ isActive }) => {
                        return isActive ? "nav-active" : "nav-deactive";
                      }}
                    >
                      기획전
                    </NavLink>
                  </div>

                  <div className="mb-20">
                    <NavLink
                      to="addproduct"
                      className={({ isActive }) => {
                        return isActive ? "nav-active" : "nav-deactive";
                      }}
                    >
                      브랜드
                    </NavLink>
                  </div>

                  <div className="mb-20">
                    <NavLink
                      to="addproduct"
                      className={({ isActive }) => {
                        return isActive ? "nav-active" : "nav-deactive";
                      }}
                    >
                      매거진
                    </NavLink>
                  </div>

                  <div className="mb-20">
                    <NavLink
                      to="addproduct"
                      className={({ isActive }) => {
                        return isActive ? "nav-active" : "nav-deactive";
                      }}
                    >
                      #Live like ittaly
                    </NavLink>
                  </div>
                </div>

                <div className="mb-20">
                  <NavLink
                    to="addproduct"
                    className={({ isActive }) => {
                      return isActive ? "nav-active" : "nav-deactive";
                    }}
                  >
                    라이브 관리
                  </NavLink>
                </div>

                <div className="mb-20">
                  <NavLink
                    to="brand"
                    className={({ isActive }) => {
                      return isActive ? "nav-active" : "nav-deactive";
                    }}
                  >
                    팝업 관리
                  </NavLink>
                </div>
                <div className="mb-20">
                  <NavLink
                    to="category"
                    className={({ isActive }) => {
                      return isActive ? "nav-active" : "nav-deactive";
                    }}
                  >
                    배너 관리
                  </NavLink>
                </div>
                <div className="mb-20">
                  <NavLink
                    to="category"
                    className={({ isActive }) => {
                      return isActive ? "nav-active" : "nav-deactive";
                    }}
                  >
                    이벤트 관리
                  </NavLink>
                </div>

                <div className="mb-20">
                  <NavLink
                    to="category"
                    className={({ isActive }) => {
                      return isActive ? "nav-active" : "nav-deactive";
                    }}
                  >
                    쿠폰 관리
                  </NavLink>
                </div>

                <div className="mb-20">
                  <NavLink
                    to="category"
                    className={({ isActive }) => {
                      return isActive ? "nav-active" : "nav-deactive";
                    }}
                  >
                    공지사항
                  </NavLink>
                </div>

                <div className="mb-20">
                  <NavLink
                    to="category"
                    className={({ isActive }) => {
                      return isActive ? "nav-active" : "nav-deactive";
                    }}
                  >
                    FAQ
                  </NavLink>
                </div>

                <div className="mb-20">
                  <NavLink
                    to="category"
                    className={({ isActive }) => {
                      return isActive ? "nav-active" : "nav-deactive";
                    }}
                  >
                    약관
                  </NavLink>
                </div>
              </div>
            </div>
          </div>

          <div onClick={handleLogout} className="font-white text-right font-desc cursor">
            로그아웃 {">"}
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
