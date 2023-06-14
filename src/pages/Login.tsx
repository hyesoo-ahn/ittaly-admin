import React, { useContext, useState } from "react";
import { MainContext } from "../common/context";
import { IMainContext } from "../interface/interface";
import logo from "../images/logo.png";
import InputR from "../components/InputR";
import { ADMIN_TOKEN } from "../common/config";

export default function Main(): JSX.Element {
  const context = useContext<IMainContext>(MainContext);
  const [password, setPassword] = useState<string>("");

  const handleLogin = () => {
    if (password === ADMIN_TOKEN) {
      localStorage.setItem("admin", password);
      context.handleStateChange("isUser", true);
    } else {
      return alert("비밀번호를 확인해 주세요.");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        height: "100vh",
      }}
    >
      {/* <p>This is Login page</p> */}
      <div style={{ marginBottom: 40, textAlign: "center" }}>
        <img src={logo} style={{ width: 158, height: "auto" }} />
        <div className="mt-20"></div>
        <InputR
          innerStyle={{ margin: 0 }}
          placeholer={"관리자 비밀번호"}
          value={password}
          onChange={(e: any) => setPassword(e.target.value)}
          // onChange={(e: any) => onChangeForm("productDesc", e.target.value)}
          // placeholer={"예시) 레드 / 블루 / 화이트 / 블랙"}
        />

        <button
          onClick={handleLogin}
          className="mt-10 cursor"
          style={{
            height: 32,
            width: 280,
            border: "none",
            backgroundColor: "black",
            color: "#fff",
          }}
        >
          로그인
        </button>
      </div>
      {/* <button onClick={() => context.handleStateChange("isUser", true)}>로그인</button> */}
    </div>
  );
}
