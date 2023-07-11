import React, { useContext, useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { MainContext } from "../common/context";
import { IMainContext } from "../interface/interface";
import logo_w from "../images/logo_w.png";
import down from "../images/down.png";
import up from "../images/up.png";
import arrow_down from "../images/down-arrow.png";
import { getLocation } from "../common/utils";

const NAV_DATA = [
  {
    title: "대시보드",
    path: "/",
  },
  {
    title: "상품",
    path: "",
    navArr1: [
      { title: "상품관리", path: "product/productmanage" },
      { title: "상품등록", path: "product/addproduct" },
      { title: "브랜드 관리", path: "product/brand" },
      { title: "카테고리 관리", path: "product/category" },
    ],
  },
  {
    title: "사이트관리",
    path: "",
    navArr1: [
      {
        title: "첫 화면 관리",
        path: "",
        navArr2: [
          {
            title: "상단배너",
            path: "/site/main/bannertop",
          },
          {
            title: "기획전",
            path: "/site/main/promotion",
          },
          {
            title: "브랜드",
            path: "/site/main/brand",
          },
          {
            title: "매거진",
            path: "/site/main/magazine",
          },
          {
            title: "#Live like ittaly",
            path: "/site/main/livelikeittaly",
          },
        ],
      },
      { title: "라이브 관리", path: "/error" },
      { title: "팝업 관리", path: "/site/popup" },
      {
        title: "배너 관리",
        path: "",
        navArr2: [
          {
            title: "홈 띠배너",
            path: "/site/banner/hbanner",
          },
          {
            title: "마이잇태리 띠배너",
            path: "/site/banner/myittalybanner",
          },
        ],
      },
      { title: "이벤트 관리", path: "/site/event" },
      { title: "적립금 관리", path: "/site/deposit" },
      { title: "쿠폰 관리", path: "coupon" },
      { title: "공지사항", path: "notice" },
      { title: "FAQ", path: "faq" },
      { title: "약관", path: "terms" },
    ],
  },
];

function Layout(): JSX.Element {
  const context = useContext<IMainContext>(MainContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [select, setSelect] = useState<string>("");
  const [subSelect, setSubSelect] = useState<string>("");

  useEffect(() => {
    const getSelected: any = getLocation(location.pathname);

    setSelect(getSelected?.selected);
    setSubSelect(getSelected?.subSelected);
  }, []);

  const handleLogout = () => {
    context.handleStateChange("isUser", false);
    localStorage.removeItem("admin");
    navigate("/");
  };

  return (
    <>
      <div className="body">
        {/* nav bar */}
        <nav className="nav_container justify-sb">
          <div>
            <div className="logo_wrapper">
              <img src={logo_w} style={{ width: 92, height: "auto" }} alt="logo" />
            </div>

            <div className="nav_contents">
              {NAV_DATA.map((nav, i) => (
                <div key={i} className="mb-20 font-14">
                  {nav.path !== "" && (
                    <NavLink
                      to={nav.path}
                      className={({ isActive }) => {
                        return isActive ? "nav-active" : "nav-deactive";
                      }}
                    >
                      <p>{nav.title}</p>
                    </NavLink>
                  )}
                  {nav.path === "" && (
                    <>
                      <div
                        onClick={() => {
                          setSelect((prev: string) => {
                            return prev === "" || prev !== nav.title ? nav.title : "";
                          });
                        }}
                        className={`flex justify-sb align-center cursor ${
                          (select === "" || select !== nav.title) && "mb-20"
                        }`}
                      >
                        <p>{nav.title}</p>
                        <img
                          src={arrow_down}
                          className={`img-${select === nav.title ? "up" : "down"}-white`}
                          style={{ width: 18, height: "auto" }}
                        />
                      </div>

                      {select === nav.title && (
                        <div className="sub-catetory font-14">
                          {nav?.navArr1?.map((subNav1: any, index: number) => (
                            <div key={index}>
                              {subNav1.path !== "" && (
                                <div className="mb-20">
                                  <NavLink
                                    to={subNav1.path}
                                    className={({ isActive }) => {
                                      return isActive ? "nav-active" : "nav-deactive";
                                    }}
                                  >
                                    {subNav1.title}
                                  </NavLink>
                                </div>
                              )}

                              {subNav1.path === "" && (
                                <>
                                  <div
                                    onClick={() => {
                                      setSubSelect((prev: string) => {
                                        return prev === "" || prev !== subNav1.title
                                          ? subNav1.title
                                          : "";
                                      });
                                    }}
                                    className="flex justify-sb align-center mb-20 cursor"
                                  >
                                    <div>{subNav1.title}</div>
                                    <img
                                      src={arrow_down}
                                      className={`img-${
                                        subSelect === subNav1.title ? "up" : "down"
                                      }-white`}
                                      style={{ width: 18, height: "auto" }}
                                    />
                                  </div>
                                  {subSelect === subNav1.title && (
                                    <div className="sub-category2">
                                      {subNav1?.navArr2?.map((subNav2: any, idx: number) => (
                                        <div className="mb-20">
                                          <NavLink
                                            to={subNav2.path}
                                            className={({ isActive }) => {
                                              return isActive ? "nav-active" : "nav-deactive";
                                            }}
                                          >
                                            {subNav2.title}
                                          </NavLink>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>

            {/* <div className="nav_contents">
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
              <div
                onClick={() => {
                  setSelect((prev: string) => {
                    return prev === "" || prev !== "상품" ? "상품" : "";
                  });
                }}
                className={`flex justify-sb align-c cursor ${
                  (select === "" || select !== "상품") && "mb-20"
                }`}
              >
                <p>상품</p>
                <img src={select === "상품" ? up : down} style={{ width: 13, height: 10 }} />
              </div>
              {select === "상품" && (
                <div className="sub-catetory font-14">
                  <div className="mb-20">
                    <NavLink
                      to="product/productmanage"
                      className={({ isActive }) => {
                        return isActive ? "nav-active" : "nav-deactive";
                      }}
                    >
                      상품관리
                    </NavLink>
                  </div>

                  <div className="mb-20">
                    <NavLink
                      to="product/addproduct"
                      className={({ isActive }) => {
                        return isActive ? "nav-active" : "nav-deactive";
                      }}
                    >
                      상품등록
                    </NavLink>
                  </div>

                  <div className="mb-20">
                    <NavLink
                      to="product/brand"
                      className={({ isActive }) => {
                        return isActive ? "nav-active" : "nav-deactive";
                      }}
                    >
                      브랜드 관리
                    </NavLink>
                  </div>
                  <div className="mb-20">
                    <NavLink
                      to="product/category"
                      className={({ isActive }) => {
                        return isActive ? "nav-active" : "nav-deactive";
                      }}
                    >
                      카테고리 관리
                    </NavLink>
                  </div>
                </div>
              )}

              <div
                onClick={() => {
                  setSelect((prev: string) => {
                    return prev === "" || prev !== "사이트관리" ? "사이트관리" : "";
                  });
                }}
                className={`flex justify-sb align-c cursor ${select === "" && "mb-20"}`}
              >
                <p>사이트관리</p>
                <img src={select === "사이트관리" ? up : down} style={{ width: 13, height: 10 }} />
              </div>
              {select === "사이트관리" && (
                <div className="sub-catetory font-14">
                  <div className="flex justify-sb align-center mb-20 cursor">
                    <div>첫 화면 관리</div>
                    <img
                      src={arrow_down}
                      className="img-down-white"
                      style={{ width: 18, height: "auto" }}
                    />
                  </div>
                  <div className="sub-category2">
                    <div className="mb-20">
                      <NavLink
                        to="/site/main/bannertop"
                        className={({ isActive }) => {
                          return isActive ? "nav-active" : "nav-deactive";
                        }}
                      >
                        상단배너
                      </NavLink>
                    </div>

                    <div className="mb-20">
                      <NavLink
                        to="/site/main/promotion"
                        className={({ isActive }) => {
                          return isActive ? "nav-active" : "nav-deactive";
                        }}
                      >
                        기획전
                      </NavLink>
                    </div>

                    <div className="mb-20">
                      <NavLink
                        to="/site/main/brand"
                        className={({ isActive }) => {
                          return isActive ? "nav-active" : "nav-deactive";
                        }}
                      >
                        브랜드
                      </NavLink>
                    </div>

                    <div className="mb-20">
                      <NavLink
                        to="/site/main/magazine"
                        className={({ isActive }) => {
                          return isActive ? "nav-active" : "nav-deactive";
                        }}
                      >
                        매거진
                      </NavLink>
                    </div>

                    <div>
                      <NavLink
                        to="/site/main/livelikeittaly"
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
                      to="/site/main/popup"
                      className={({ isActive }) => {
                        return isActive ? "nav-active" : "nav-deactive";
                      }}
                    >
                      팝업 관리
                    </NavLink>
                  </div>
                  <div className="mb-20">배너 관리</div>
                  <div className="sub-category2">
                    <div className="mb-20">
                      <NavLink
                        to="/site/main/banner/hbanner"
                        className={({ isActive }) => {
                          return isActive ? "nav-active" : "nav-deactive";
                        }}
                      >
                        홈 띠배너
                      </NavLink>
                    </div>

                    <div>
                      <NavLink
                        to="/site/main/banner/myittalybanner"
                        className={({ isActive }) => {
                          return isActive ? "nav-active" : "nav-deactive";
                        }}
                      >
                        마이잇태리 띠배너
                      </NavLink>
                    </div>
                  </div>

                  <div className="mb-20">
                    <NavLink
                      to="/site/main/event"
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
              )}
            </div> */}
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
