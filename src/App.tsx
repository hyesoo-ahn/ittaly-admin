import React, { useEffect, useState } from "react";

import logo from "./logo.svg";
import "./App.css";
import { IMainContext } from "./interface/interface";
import { createBrowserRouter, redirect, Route, RouterProvider, Routes } from "react-router-dom";
import Main from "./pages/Main";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Loading from "./components/Loading";
import Layout from "./pages/Layout";
import { MainContext } from "./common/context";
import ProductManagement from "./pages/ProductManagement";
import AddProduct from "./pages/AddProduct";
import Brand from "./pages/Brand";
import AddBrand from "./pages/AddBrand";
import Category from "./pages/Category";
import AddCategory from "./pages/AddCategory";
import BrandDetail from "./pages/BrandDetail";
import CategoryDetail from "./pages/CategoryDetail";
import { ADMIN_TOKEN } from "./common/config";
import BannerTop from "./pages/BannerTop";
import AddBannerTop from "./pages/AddBannerTop";
import Promotion from "./pages/Promotion";
import AddPromotion from "./pages/AddPromotion";
import BannerDetail from "./pages/BannerDetail";
import PromotionDetail from "./pages/PromotionDetail";
import MainBrand from "./pages/MainBrand";
import AddMainBrand from "./pages/AddMainBrand";
import MainBrandDetail from "./pages/MainBrandDetail";
import AddMagazine from "./pages/AddMagazine";
import Magazine from "./pages/Magazine";
import MagazineDetail from "./pages/MagazineDetail";
import LiveLikeIttaly from "./pages/LiveLikeIttaly";
import AddLiveLikeIttaly from "./pages/AddLiveLikeIttaly";
import Popup from "./pages/Popup";
import MainHBanner from "./pages/MainBanner";
import LiveLikeIttalyDetail from "./pages/LiveLikeIttayDetail";
import ErrorPage from "./pages/ErrorPage";
import MainEvent from "./pages/MainEvent";
import AddMainEvent from "./pages/AddMainEvent";
import Deposit from "./pages/Deposit";
import MainEventDetail from "./pages/MainEventDetail";
import ProductDetail from "./pages/ProductDetail";
import Coupon from "./pages/Coupon";
import AddCoupon from "./pages/AddCoupon";
import ScrollTop from "./components/ScrollTop";
import Users from "./pages/Users";
import UserDetail from "./pages/UserDetail";
import InactiveUsers from "./pages/InactiveUsers";
import InactiveUserDetail from "./pages/InactiveUserDetail";
import Withdrawnusers from "./pages/WithdrawnUsers";
import WithdrawnUserDetail from "./pages/WithdrawnUserDetail";
import ReferralRewards from "./pages/ReferralRewards";
import TermsOfPrivacy from "./pages/TermsOfPrivacy";
import Notice from "./pages/Notice";
import Referrals from "./pages/Referrals";
import CustomerInquiry from "./pages/CustomerInquiry";
import CustomerInquiryDetail from "./pages/CustomerInquiryDetail";
import ProductInquiry from "./pages/ProductInquiry";
import { ProductInquiryDetail } from "./pages/ProductInquiryDetail";
import ProductReviews from "./pages/ProductReview";
import AddNotice from "./pages/AddNotice";
import NoticeDetail from "./pages/NoticeDetail";
import ProductReviewDetail from "./pages/ProductReviewDetail";
import CouponDetail from "./pages/CouponDetail";
import Payments from "./pages/Payments";
import PaymentDetail from "./pages/PaymentDetail";
import FAQ from "./pages/FAQ";
import AddFAQ from "./pages/AddFAQ";
import FAQDetail from "./pages/FAQDetail";
import ShippingRequest from "./pages/ShippingRequest";
import Pendingshipment from "./pages/PendingShipment";
import Invoice from "./pages/Invoice";
import Deliverystatus from "./pages/DeliveryStatus";
import Cancellation from "./pages/Cancellation";
import RestockRequest from "./pages/RestockRequest";
import RestockRequestDetail from "./pages/RestockRequestDetail";
import MemberStatistics from "./pages/UserStatistics";
import UserStatistics from "./pages/UserStatistics";
import OrderStatistics from "./pages/OrderStatistics";
import TermsOfService from "./pages/TermsOfService";

function App() {
  useEffect(() => {
    detectIsUser();
  }, []);

  const _handleStateChange = (key: string, state: any) => {
    setData((prevState: any) => {
      return {
        ...prevState,
        [key]: state,
      };
    });
  };

  const detectIsUser = async () => {
    const adminToken = localStorage.getItem("admintoken");
    if (adminToken && adminToken === ADMIN_TOKEN) {
      _handleStateChange("isUser", true);
    } else {
      _handleStateChange("isUser", false);
    }

    setLoading(false);
  };

  const _push = (location: string) => {
    setData((prev: any) => {
      return {
        ...prev,
        myHistory: [...prev.myHistory, location],
      };
    });
  };

  const [data, setData] = useState<IMainContext>({
    handleStateChange: _handleStateChange,
    isUser: false,
    push: _push,
    myHistory: [],
  });

  const [loading, setLoading] = useState<boolean>(true);

  if (loading) return <Loading />;

  return (
    <>
      <MainContext.Provider value={data}>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route element={data.isUser ? <Layout /> : <Login />}>
            <Route path="/" index element={<Main />} />
            <Route path="/product/productmanage" element={<ProductManagement />} />
            <Route path="/product/productmanage/:productId" element={<ProductDetail />} />
            <Route path="/product/addproduct" element={<AddProduct />} />
            <Route path="/product/brand" element={<Brand />} />
            <Route path="/product/brand/:brandId" element={<BrandDetail />} />
            <Route path="/product/brand/addbrand" element={<AddBrand />} />
            <Route path="/product/category" element={<Category />} />
            <Route path="/product/category/add" element={<AddCategory />} />
            <Route path="/product/category/:categoryId" element={<CategoryDetail />} />
            <Route path="/site/main/bannertop" element={<BannerTop />} />
            <Route path="/site/main/bannertop/addbanner" element={<AddBannerTop />} />
            <Route path="/site/main/bannertop/:bannerId" element={<BannerDetail />} />
            <Route path="/site/main/promotion" element={<Promotion />} />
            <Route path="/site/main/promotion/addPromotion" element={<AddPromotion />} />
            <Route path="/site/main/promotion/:promotionId" element={<PromotionDetail />} />
            <Route path="/site/main/brand" element={<MainBrand />} />
            <Route path="/site/main/brand/addbrand" element={<AddMainBrand />} />
            <Route path="/site/main/brand/:mainBrandId" element={<MainBrandDetail />} />
            <Route path="/site/main/magazine" element={<Magazine />} />
            <Route path="/site/main/magazine/addmagazine" element={<AddMagazine />} />
            <Route path="/site/main/magazine/:magazineId" element={<MagazineDetail />} />
            <Route path="/site/main/livelikeittaly" element={<LiveLikeIttaly />} />
            <Route
              path="/site/main/livelikeittaly/addlivelikeittaly"
              element={<AddLiveLikeIttaly />}
            />
            <Route
              path="/site/main/livelikeittaly/:liveittalyId"
              element={<LiveLikeIttalyDetail />}
            />
            <Route path="/site/popup" element={<Popup />} />
            <Route path="/site/banner/:bannerType" element={<MainHBanner />} />
            <Route path="/site/event" element={<MainEvent />} />
            <Route path="/site/event/add" element={<AddMainEvent />} />
            <Route path="/site/event/:eventId" element={<MainEventDetail />} />
            <Route path="/site/deposit" element={<Deposit />} />
            <Route path="/site/coupon" element={<Coupon />} />
            <Route path="/site/coupon/add" element={<AddCoupon />} />
            <Route path="/site/coupon/:couponId" element={<CouponDetail />} />
            <Route path="/site/terms/privacy" element={<TermsOfPrivacy />} />
            <Route path="/site/terms/service" element={<TermsOfService />} />
            <Route path="/site/notice" element={<Notice />} />
            <Route path="/site/notice/add" element={<AddNotice />} />
            <Route path="/site/notice/:noticeId" element={<NoticeDetail />} />
            <Route path="/site/faq" element={<FAQ />} />
            <Route path="/site/faq/add" element={<AddFAQ />} />
            <Route path="/site/faq/:faqId" element={<FAQDetail />} />

            {/* 주문배송 */}
            <Route path="/order/payments" element={<Payments />} />
            <Route path="/order/payments/:paymentId" element={<PaymentDetail />} />
            <Route path="/order/shippingrequest" element={<ShippingRequest />} />
            <Route path="/order/pendingshipment" element={<Pendingshipment />} />
            <Route path="/order/invoice" element={<Invoice />} />
            <Route path="/order/deliverystatus" element={<Deliverystatus />} />
            <Route path="/order/cancellation" element={<Cancellation />} />
            <Route path="/order/cancellation/:tab" element={<Cancellation />} />

            {/* 고객 */}
            {/* 유저 */}
            <Route path="/customer/users/active" element={<Users />} />
            <Route path="/customer/users/active/:userId/:tab" element={<UserDetail />} />
            <Route path="/customer/users/inactive" element={<InactiveUsers />} />
            <Route path="/customer/users/inactive/:userId/:tab" element={<InactiveUserDetail />} />
            <Route path="/customer/users/withdrawn" element={<Withdrawnusers />} />
            <Route
              path="/customer/users/withdrawn/:userId/:tab"
              element={<WithdrawnUserDetail />}
            />
            {/* 추천인 */}
            <Route path="/customer/referral/rewards" element={<ReferralRewards />} />
            <Route path="/customer/referral/managing" element={<Referrals />} />
            <Route path="/customer/referral/managing/:tab" element={<Referrals />} />

            {/* 1:1 문의 */}
            <Route path="/customer/inquiry" element={<CustomerInquiry />} />
            <Route path="/customer/inquiry/:inquiryId" element={<CustomerInquiryDetail />} />

            {/* 상품 문의 */}
            <Route path="/customer/productinquiry" element={<ProductInquiry />} />
            <Route
              path="/customer/productinquiry/:productinquiryId"
              element={<ProductInquiryDetail />}
            />
            <Route path="/customer/reviews" element={<ProductReviews />} />
            <Route path="/customer/reviews/:reviewId" element={<ProductReviewDetail />} />

            {/* 입고요청 */}
            <Route path="/customer/restockrequest" element={<RestockRequest />} />
            <Route
              path="/customer/restockrequest/:restockrequestid"
              element={<RestockRequestDetail />}
            />

            {/* 시스템 관리 */}
            <Route path="/system/statistics/users" element={<UserStatistics />} />
            <Route path="/system/statistics/orders" element={<OrderStatistics />} />
          </Route>

          <Route path="*" element={<ErrorPage />} />
        </Routes>

        {/* <RouterProvider router={router} /> */}
      </MainContext.Provider>
    </>
  );
}

export default App;
