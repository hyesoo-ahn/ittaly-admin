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
    // localStorage.removeItem("token"); // dev
    // const token = localStorage.getItem("token");
    // if (!token) {
    //   localStorage.removeItem("token");
    //   _handleStateChange("isUser", false);
    //   setLoading(false);
    // } else {
    //   _handleStateChange("isUser", true);
    //   setLoading(false);
    // }
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
      element: <Layout />,

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
          path: "/login",
          element: <Login />,
        },
        {
          path: "/signup",
          element: <Signup />,
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
