import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { IMainContext } from "./interface/interface";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
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

  const detectIsUser = (): void => {
    const adminToken = localStorage.getItem("admin");
    if (adminToken === ADMIN_TOKEN) {
      _handleStateChange("isUser", true);
    } else {
      _handleStateChange("isUser", false);
    }

    setLoading(false);
  };

  const [data, setData] = useState<IMainContext>({
    handleStateChange: _handleStateChange,
    isUser: false,
  });

  const [loading, setLoading] = useState<boolean>(true);

  const router = createBrowserRouter([
    {
      path: "/",
      element: data.isUser ? <Layout /> : <Login />,
      children: [
        {
          path: "/",
          element: <Main />,
        },
        {
          path: "/product/productmanage",
          element: <ProductManagement />,
        },
        {
          path: "/product/productmanage/:productId",
          element: <ProductDetail />,
        },

        {
          path: "/product/addproduct",
          element: <AddProduct />,
        },
        {
          path: "/product/brand",
          element: <Brand />,
        },

        {
          path: "/product/brand/:brandId",
          element: <BrandDetail />,
        },

        {
          path: "/product/brand/addbrand",
          element: <AddBrand />,
        },

        {
          path: "/product/category",
          element: <Category />,
        },

        {
          path: "/product/category/:categoryId",
          element: <CategoryDetail />,
        },

        {
          path: "/product/category/addcategory",
          element: <AddCategory />,
        },

        {
          path: "/login",
          element: <Login />,
        },
        {
          path: "/signup",
          element: <Signup />,
        },

        {
          path: "/site/main/bannertop",
          element: <BannerTop />,
        },
        {
          path: "/site/main/bannertop/addbanner",
          element: <AddBannerTop />,
        },
        {
          path: "/site/main/bannertop/:bannerId",
          element: <BannerDetail />,
        },

        {
          path: "/site/main/promotion",
          element: <Promotion />,
        },
        {
          path: "/site/main/promotion/addPromotion",
          element: <AddPromotion />,
        },

        {
          path: "/site/main/promotion/:promotionId",
          element: <PromotionDetail />,
        },
        {
          path: "/site/main/brand",
          element: <MainBrand />,
        },
        {
          path: "/site/main/brand/addbrand",
          element: <AddMainBrand />,
        },
        {
          path: "/site/main/brand/:mainBrandId",
          element: <MainBrandDetail />,
        },
        {
          path: "/site/main/magazine",
          element: <Magazine />,
        },
        {
          path: "/site/main/magazine/addmagazine",
          element: <AddMagazine />,
        },
        {
          path: "/site/main/magazine/:magazineId",
          element: <MagazineDetail />,
        },

        {
          path: "/site/main/livelikeittaly",
          element: <LiveLikeIttaly />,
        },
        {
          path: "/site/main/livelikeittaly/addlivelikeittaly",
          element: <AddLiveLikeIttaly />,
        },
        {
          path: "/site/main/livelikeittaly/:liveittalyId",
          element: <LiveLikeIttalyDetail />,
        },
        {
          path: "/site/popup",
          element: <Popup />,
        },
        {
          path: "/site/banner/:bannerType",
          element: <MainHBanner />,
        },
        {
          path: "/site/event",
          element: <MainEvent />,
        },
        {
          path: "/site/event/add",
          element: <AddMainEvent />,
        },
        {
          path: "/site/event/:eventId",
          element: <MainEventDetail />,
        },
        {
          path: "/site/deposit",
          element: <Deposit />,
        },
        {
          path: "/site/coupon",
          element: <Coupon />,
        },
        {
          path: "/site/coupon/add",
          element: <AddCoupon />,
        },
        {
          path: "*",
          element: <ErrorPage />,
        },
      ],
    },
  ]);

  if (loading) return <Loading />;

  return (
    <>
      <MainContext.Provider value={data}>
        <RouterProvider router={router} />
      </MainContext.Provider>
    </>
  );
}

export default App;
