import React, { useContext, useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { MainContext } from "../common/context";
import { IMainContext } from "../interface/interface";
import logo_w from "../images/logo_w.png";
import link from "../images/external_link.png";
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
    title: "주문배송",
    path: "",
    navArr1: [
      { title: "주문 전체검색", path: "/order/payments" },
      { title: "출고요청 리스트", path: "/order/shippingrequest" },
      { title: "미출고 리스트", path: "/order/pendingshipment" },
      { title: "출고운송장 입력", path: "/order/invoice" },
      { title: "배송상태 조회", path: "/order/deliverystatus" },
      { title: "취소/반품/교환", path: "/order/cancellation" },
    ],
  },
  {
    title: "사이트 관리",
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
      { title: "쿠폰 관리", path: "/site/coupon" },
      { title: "공지사항", path: "/site/notice" },
      { title: "FAQ", path: "/site/faq" },
      {
        title: "약관",
        path: "",
        navArr2: [
          {
            title: "개인정보처리방침",
            path: "/site/terms/privacy",
          },
          {
            title: "이용약관",
            path: "/site/terms/service",
          },
        ],
      },
    ],
  },

  {
    title: "고객",
    path: "",
    navArr1: [
      {
        title: "회원 관리",
        path: "",
        navArr2: [
          {
            title: "회원정보 조회",
            path: "/customer/users/active",
          },
          {
            title: "휴면회원 관리",
            path: "/customer/users/inactive",
          },
          {
            title: "탈퇴회원 관리",
            path: "/customer/users/withdrawn",
          },
        ],
      },
      {
        title: "추천인 프로그램",
        path: "",
        navArr2: [
          {
            title: "추천인 적립금 지급관리",
            path: "/customer/referral/rewards",
          },
          {
            title: "추천인 관리",
            path: "/customer/referral/managing",
          },
        ],
      },
      { title: "1:1 문의 관리", path: "/customer/inquiry" },
      { title: "상품 문의 관리", path: "/customer/productinquiry" },
      { title: "상품 후기 관리", path: "/customer/reviews" },
      { title: "입고 요청 관리", path: "/customer/restockrequest" },
      { title: "푸시 발송 관리", path: "/error" },
    ],
  },

  {
    title: "시스템 관리",
    path: "",
    navArr1: [
      {
        title: "통계정보 확인",
        path: "",
        navArr2: [
          {
            title: "회원 통계",
            path: "/system/statistics/users",
          },
          {
            title: "주문 통계",
            path: "/system/statistics/orders",
          },
          {
            title: "라이브 통계",
            path: "/system/statistics/orders",
          },
        ],
      },
    ],
  },
];

function Layout(): JSX.Element {
  const context = useContext<IMainContext>(MainContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [select, setSelect] = useState<string>("");
  const [subSelect, setSubSelect] = useState<string>("");
  const { push } = context;

  useEffect(() => {
    push(location.pathname);
    const getSelected: any = getLocation(location.pathname);

    setSelect(getSelected?.selected);
    setSubSelect(getSelected?.subSelected);
  }, [location]);

  const handleLogout = () => {
    context.handleStateChange("isUser", false);
    localStorage.removeItem("admin");
    navigate("/login");
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
                                    className={`${
                                      subSelect === subNav1.title && "font-bold"
                                    }   flex justify-sb align-center mb-20 cursor`}
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
                                        <div key={idx} className="mb-20">
                                          {subNav2.title !== "라이브 통계" && (
                                            <NavLink
                                              to={subNav2.path}
                                              className={({ isActive, isPending }) => {
                                                return isActive ? "nav-active" : "nav-deactive";
                                              }}
                                            >
                                              {subNav2.title}
                                            </NavLink>
                                          )}
                                          {subNav2.title === "라이브 통계" && (
                                            <a
                                              target="_blank"
                                              href={
                                                "https://admin.shoplive.cloud/login?returnUrl=%2F"
                                              }
                                              style={{ textDecoration: "none" }}
                                              className="flex align-c cursor font-white"
                                            >
                                              <p className="mr-4">라이브 통계</p>
                                              <img src={link} style={{ width: 16, height: 16 }} />
                                            </a>
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
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div onClick={handleLogout} className="font-white text-right font-desc cursor">
            로그아웃 {">"}
          </div>
        </nav>
        {/* nav bar */}
        <div className="padding-40" style={{ width: "85%" }}>
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default Layout;
