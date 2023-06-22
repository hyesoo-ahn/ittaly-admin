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
          path: "/productmanage",
          element: <ProductManagement />,
        },
        {
          path: "/addproduct",
          element: <AddProduct />,
        },
        {
          path: "/brand",
          element: <Brand />,
        },

        {
          path: "/brand/:brandId",
          element: <BrandDetail />,
        },

        {
          path: "/brand/addbrand",
          element: <AddBrand />,
        },

        {
          path: "/category",
          element: <Category />,
        },

        {
          path: "/category/:categoryId",
          element: <CategoryDetail />,
        },

        {
          path: "/category/addcategory",
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
          path: "/banner",
          element: <BannerTop />,
        },
        {
          path: "/banner/addbanner",
          element: <AddBannerTop />,
        },

        {
          path: "/promotion",
          element: <Promotion />,
        },
        {
          path: "/promotion/addPromotion",
          element: <AddPromotion />,
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
