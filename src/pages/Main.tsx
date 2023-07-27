import React, { useContext } from "react";
import { MainContext } from "../common/context";
import { timeFormat3 } from "../common/utils";
import { IMainContext } from "../interface/interface";

export default function Main(): JSX.Element {
  const context = useContext<IMainContext>(MainContext);
  return (
    <div>
      <h2 className="margin-0">{timeFormat3(Date.now())}</h2>

      <div className="mt-40">
        <div className="flex justify-sb flex-wrap align-c ml-4 mr-4">
          <p className="font-700 font-18">주문/배송</p>
          <p className="font-link">새로고침</p>
        </div>

        <div className="main-container flex mt-12">
          <div className="flex1 text-center">
            <p className="font-16 font-700">신규주문</p>
            <p className="font-38 font-700 mt-10 main-top-text cursor">24</p>
          </div>

          <div className="flex1 text-center">
            <p className="font-16 font-700">상품준비</p>
            <p className="font-38 font-700 mt-10 main-top-text cursor">3</p>
          </div>

          <div className="flex1 text-center">
            <p className="font-16 font-700">배송준비</p>
            <p className="font-38 font-700 mt-10 main-top-text cursor">1</p>
          </div>

          <div className="flex1 text-center">
            <p className="font-16 font-700">배송중</p>
            <p className="font-38 font-700 mt-10 main-top-text cursor">12</p>
          </div>

          <div className="flex1 text-center">
            <p className="font-16 font-700">배송완료</p>
            <p className="font-38 font-700 mt-10 main-top-text cursor">5</p>
          </div>
        </div>
      </div>

      <div className="mt-30">
        <div className="flex flex-wrap">
          <div className="flex1 mr-10">
            <div className="flex justify-sb flex-wrap align-c ml-4 mr-4">
              <p className="font-700 font-18">클레임</p>
              <p className="font-link">새로고침</p>
            </div>

            <div className="main-container mt-12" style={{ padding: "25px 45px" }}>
              <div className="main-mid-content">
                <p className="font-600">취소완료</p>
                <p className="font-600">
                  <span className="text-underline">3</span>건
                </p>
              </div>

              <div className="main-mid-content">
                <p className="font-600">교환신청</p>
                <p className="font-600">
                  <span className="text-underline">3</span>건
                </p>
              </div>

              <div className="main-mid-content">
                <p className="font-600">반품신청</p>
                <p className="font-600">
                  <span className="text-underline">3</span>건
                </p>
              </div>
            </div>
          </div>
          <div className="flex1 ml-10">
            <div className="flex justify-sb flex-wrap align-c ml-4 mr-4">
              <p className="font-700 font-18">매출 통계 최근 7일</p>
              <p className="font-link">통계 바로가기</p>
            </div>

            <div className="main-container mt-12" style={{ padding: "25px 45px" }}>
              <div className="main-mid-content">
                <p className="font-600">결제건수</p>
                <p className="font-600">
                  <span>133</span>건
                </p>
              </div>

              <div className="main-mid-content">
                <p className="font-600">결제자수</p>
                <p className="font-600">
                  <span>120</span>명
                </p>
              </div>

              <div className="main-mid-content">
                <p className="font-600">결제금액</p>
                <p className="font-600">
                  <span>1,234,567</span>원
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-30">
        <div className="flex">
          <div className="flex1 mr-10">
            <div className="flex justify-sb flex-wrap align-c ml-4 mr-4">
              <p className="font-700 font-18">미답변 문의</p>
              <p className="font-link">새로고침</p>
            </div>

            <div className="main-container mt-12" style={{ padding: "25px 45px" }}>
              <div className="main-mid-content">
                <p className="font-600">상품문의</p>
                <p className="font-600">
                  <span className="text-underline">3</span>건
                </p>
              </div>

              <div className="main-mid-content">
                <p className="font-600">1:1 문의</p>
                <p className="font-600">
                  <span className="text-underline">3</span>건
                </p>
              </div>
            </div>
          </div>
          <div className="flex1 ml-10">
            <div className="flex justify-sb flex-wrap align-c ml-4 mr-4">
              <p className="font-700 font-18">후기/요청</p>
              <p className="font-link">새로고침</p>
            </div>

            <div className="main-container mt-12" style={{ padding: "25px 45px" }}>
              <div className="main-mid-content">
                <p className="font-600">새로운 후기</p>
                <p className="font-600">
                  <span className="text-underline">3</span>건
                </p>
              </div>

              <div className="main-mid-content">
                <p className="font-600">새로운 입고 요청</p>
                <p className="font-600">
                  <span className="text-underline">3</span>명
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <h1>This Is Main page</h1>
      <h1>This Is Main page</h1>
      <h1>This Is Main page</h1>
      <h1>This Is Main page</h1>
      <h1>This Is Main page</h1>
      <h1>This Is Main page</h1>
      <h1>This Is Main page</h1>
      <h1>This Is Main page</h1>

      <h1>This Is Main page</h1>
      <h1>This Is Main page</h1>
      <h1>This Is Main page</h1>
      <h1>This Is Main page</h1>
      <h1>This Is Main page</h1>
      <h1>This Is Main page</h1>
      <h1>This Is Main page</h1>
      <h1>This Is Main page</h1>
      <h1>This Is Main page</h1>
      <h1>This Is Main page</h1>
      <h1>This Is Main page</h1>
      <h1>This Is Main page</h1>
      <h1>This Is Main page</h1>

      <h1>This Is Main page</h1>
      <h1>This Is Main page</h1>
      <h1>This Is Main page</h1> */}
    </div>
  );
}
