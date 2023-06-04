import React from "react";
import { useNavigate } from "react-router-dom";
import ButtonR from "../components/ButtonR";

const Category = () => {
  const navigate = useNavigate();
  return (
    <div>
      <div className="flex justify-sb align-c">
        <p className="page-title">카테고리 관리</p>
      </div>

      <div className="mt-34 flex justify-sb align-c">
        <p>총 10건</p>
        <ButtonR
          onClick={() => {
            navigate("/category/addcategory");
          }}
          name="카테고리 등록"
        />
      </div>
    </div>
  );
};

export default Category;
