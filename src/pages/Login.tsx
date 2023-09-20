import React, { useContext, useState } from "react";
import { MainContext } from "../common/context";
import { IMainContext } from "../interface/interface";
import logo from "../images/logo.png";
import InputR from "../components/InputR";
import { ADMIN_TOKEN } from "../common/config";
import { useNavigate } from "react-router-dom";

export default function Main(): JSX.Element {
  const context = useContext<IMainContext>(MainContext);
  const navigate = useNavigate();
  const [password, setPassword] = useState<string>("");

  const handleLogin = () => {
    if (password === ADMIN_TOKEN) {
      localStorage.setItem("admintoken", password);
      context.handleStateChange("isUser", true);
      navigate("/");
    } else {
      return alert("비밀번호를 확인해 주세요.");
    }
  };

  return (
    <div className="flex align-c justify-c f-direction-column " style={{ height: "100vh" }}>
      <div className="text-center mb-40">
        <img src={logo} className="login-logo" alt="login-logo" />
        <div className="mt-20"></div>
        <div className="flex f-direction-column">
          <InputR
            type={"password"}
            innerStyle={{ margin: 0 }}
            placeholer={"관리자 비밀번호"}
            value={password}
            onChange={(e: any) => setPassword(e.target.value)}
          />

          <button
            onClick={handleLogin}
            className="mt-10 cursor border-none bg-black font-white"
            style={{ height: 32, width: 280 }}
          >
            로그인
          </button>
        </div>
      </div>
    </div>
  );
}
