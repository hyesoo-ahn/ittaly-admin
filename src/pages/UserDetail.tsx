import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { getDatas } from "../common/apis";
import { currency, timeFormat1 } from "../common/utils";
import ButtonR from "../components/ButtonR";
import InputR from "../components/InputR";
import SelectBox from "../components/SelectBox";

export default function UserDetail(): JSX.Element {
  const navigate = useNavigate();
  const [selectArr, setSelectArr] = useState<any>([
    {
      label: "tab1",
      value: "기본정보",
    },
    {
      label: "tab2",
      value: "주문내역",
    },
    {
      label: "tab3",
      value: "쿠폰 내역",
    },
    {
      label: "tab4",
      value: "적립 내역",
    },
    {
      label: "tab5",
      value: "작성글",
    },
  ]);
  const [selectedTab, setSelectedTab] = useState<string>("tab1");

  return (
    <div>
      <div className="flex justify-sb align-c">
        <p className="page-title">회원정보 상세</p>
      </div>

      {/* tab */}
      <div className="tab-container">
        {selectArr.map((tabItem: any, i: number) => (
          <div
            key={i}
            onClick={() => {
              setSelectedTab(tabItem.label);
              navigate(`/customer/user/1234/${tabItem.label}`);
            }}
            className={`tab-item 
            ${i === 4 && "border-right-black"}
            ${selectedTab === tabItem.label ? "border-bottom-none font-bold" : "bg-gray"}`}
          >
            <p className="font-14">{tabItem.value}</p>
          </div>
        ))}

        <div className="border-bottom-black flex1"></div>
      </div>

      {/* 컨텐츠 */}
      <div className="mt-30 mb-30">
        {selectedTab === "tab1" && <Tab1 />}
        {selectedTab === "tab2" && <Tab2 />}
        {selectedTab === "tab3" && <Tab3 />}
        {selectedTab === "tab4" && <Tab4 />}
        {selectedTab === "tab5" && <Tab5 />}
      </div>
    </div>
  );
}

const Tab1 = () => {
  return (
    <div className="flex">
      <div className="flex1">
        <div className="product-field-wrapper mt-2">
          <div className="product-field mr-20">
            <p>닉네임/ID</p>
          </div>

          <p>행복한 물개(ews24s)</p>
        </div>

        <div className="product-field-wrapper mt-2">
          <div className="product-field mr-20">
            <p>가입 SNS 채널</p>
          </div>

          <p>카카오</p>
        </div>

        <div className="product-field-wrapper mt-2">
          <div className="product-field mr-20">
            <p>이름</p>
          </div>

          <p>김모노</p>
        </div>

        <div className="field-list-wrapper mt-2">
          <div className="product-field mr-20">
            <p>주소(기본배송지)</p>
          </div>

          <div className="flex1 pt-10 pb-10">
            <p>(30098) 세종특별자치시 보듬4로 20 10단지 호반베르디움 어반시티 아파트 101동 101 </p>
          </div>
        </div>

        <div className="field-list-wrapper mt-2">
          <div className="product-field mr-20">
            <p>회원등급</p>
          </div>

          <div className="flex align-c flex1 pt-10 pb-10">
            <p className="mr-20">Gold</p>

            <ButtonR name="등급변경" color={"white"} onClick={() => {}} />
          </div>
        </div>

        <div className="field-list-wrapper mt-2">
          <div className="product-field mr-20">
            <p>총 주문금액</p>
            <p className="font-12 font-300">할인/적립금 사용금액 포함</p>
          </div>

          <div className="flex align-c flex1 pt-10 pb-10">
            <p>1,234,567</p>
          </div>
        </div>
      </div>
      <div className="flex1">222</div>
    </div>
  );
};

const Tab2 = () => {
  return (
    <div>
      <p>tab2입니다.</p>
    </div>
  );
};

const Tab3 = () => {
  return (
    <div>
      <p>tab3입니다.</p>
    </div>
  );
};

const Tab4 = () => {
  return (
    <div>
      <p>tab4입니다.</p>
    </div>
  );
};

const Tab5 = () => {
  return (
    <div>
      <p>tab5입니다.</p>
    </div>
  );
};
