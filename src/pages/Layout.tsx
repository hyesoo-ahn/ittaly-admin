import React, { useContext, useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { MainContext } from "../common/context";
import { IMainContext } from "../interface/interface";

function Layout(): JSX.Element {
  const context = useContext<IMainContext>(MainContext);
  const navigate = useNavigate();

  return (
    <>
      <div className="flex">
        <p>This is header component.</p>
        <p>IS User:? {JSON.stringify(context.isUser)}</p>
        <button onClick={() => navigate("/login")}>Login</button>
        <button onClick={() => navigate("/signup")}>Signup</button>
      </div>
      <div>
        <Outlet />
      </div>
    </>
  );
}

export default Layout;
