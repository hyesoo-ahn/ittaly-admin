import React from "react";
import { useNavigate } from "react-router-dom";
import ButtonR from "../components/ButtonR";

const Brand = () => {
  const navigate = useNavigate();
  return (
    <div>
      <div className="flex justify-sb align-c">
        <p className="page-title">브랜드 관리</p>
      </div>

      <div className="mt-34 flex justify-sb align-c">
        <p>총 100건</p>
        <ButtonR
          onClick={() => {
            navigate("/brand/addbrand");
          }}
          name="브랜드 등록"
        />
      </div>
    </div>
  );
};

export default Brand;
