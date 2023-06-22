import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import ButtonR from "../components/ButtonR";
import InputR from "../components/InputR";

const Cateogyoptions1 = [
  { value: "대분류 카테고리1", label: "대분류 카테고리1" },
  { value: "대분류 카테고리2", label: "대분류 카테고리2" },
  { value: "대분류 카테고리3", label: "대분류 카테고리3" },
];

export default function ProductManagement(): JSX.Element {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<any>("");
  return (
    <div>
      <div className="flex justify-sb align-c">
        <p className="page-title">상품관리</p>
      </div>

      <div className="w100p filter-container" style={{ flex: 1 }}>
        <div className="flex" style={{ flex: 1, width: "100%" }}>
          <div style={{ width: "33.333%" }} className="mr-10">
            <InputR size="full" placeholer="상품명 입력" />
          </div>
          <div style={{ width: "33.333%" }} className="mr-10">
            <InputR size="full" placeholer="브랜드명 입력" />
          </div>
          <div style={{ width: "33.333%" }}>
            <InputR size="full" placeholer="상품코드 입력" />
          </div>
        </div>

        <div className="flex">
          <div
            style={{
              width: "33.333%",

              marginRight: 4,
            }}
          >
            <Select
              classNamePrefix="react-select"
              placeholder={"대분류"}
              defaultValue={null}
              onChange={(e: any) => setSelected(e.value)}
              options={Cateogyoptions1}
              className="react-select-container react-select-container2"
              noOptionsMessage={({ inputValue }) => "등록된 카테고리가 없습니다."}
            />
          </div>
          <div style={{ width: "33.333%", marginRight: 4 }}>
            <Select
              classNamePrefix="react-select"
              placeholder={"대분류"}
              defaultValue={null}
              onChange={(e: any) => setSelected(e.value)}
              options={Cateogyoptions1}
              className="react-select-container react-select-container2"
              noOptionsMessage={({ inputValue }) => "등록된 카테고리가 없습니다."}
            />
          </div>
          <div
            style={{ width: "33.333%", flex: 1, marginTop: 8, height: 32 }}
            className="flex align-c justify-c"
          >
            <button
              className="btn-add-b"
              style={{
                width: "50%",
                marginRight: 2,
                // backgroundColor: "blue",
                // marginRight: 10,
                height: "100%",
                border: "none",
              }}
            >
              검색
            </button>
            <button
              style={{
                width: "50%",
                backgroundColor: "#fff",
                height: "100%",
                marginLeft: 2,
                border: "1px solid black",
              }}
            >
              초기화
            </button>
          </div>
        </div>
      </div>

      <div className="mt-34 flex justify-sb align-c">
        <p>총 0건</p>
        <ButtonR
          onClick={() => {
            navigate("/addproduct");
          }}
          name="상품 등록"
        />
      </div>
    </div>
  );
}
//
