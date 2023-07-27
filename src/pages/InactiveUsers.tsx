import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { getDatas } from "../common/apis";
import { currency, timeFormat1 } from "../common/utils";
import ButtonR from "../components/ButtonR";
import InputR from "../components/InputR";
import SelectBox from "../components/SelectBox";

const Cateogyoptions1 = [
  { value: "대분류 카테고리1", label: "대분류 카테고리1" },
  { value: "대분류 카테고리2", label: "대분류 카테고리2" },
  { value: "대분류 카테고리3", label: "대분류 카테고리3" },
];

export default function InactiveUsers(): JSX.Element {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<any>("");

  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    const productData: any = await getDatas({
      collection: "events",
      sort: { sort: -1 },
    });
    setEvents(productData.data);
  };

  return (
    <div>
      <div className="flex justify-sb align-c">
        <p className="page-title">휴면회원 관리</p>
      </div>

      <div className="w100p filter-container" style={{ flex: 1 }}>
        <div className="flex">
          <div className="flex1 ml-4 mr-4 flex">
            <input
              type="date"
              className="main-event-date-input"
              data-placeholder="탈퇴일(~부터)"
              required
              aria-required="true"
            />
          </div>
          <div className="flex1 ml-4 mr-4 flex">
            <input
              type="date"
              className="main-event-date-input"
              data-placeholder="탈퇴일(~까지)"
              required
              aria-required="true"
            />
          </div>
          <div className="flex1 ml-4 mr-4 flex">
            <InputR size="full" placeholer="닉네임/ID" innerStyle={{ margin: 0 }} />
          </div>
        </div>

        <div className="flex mt-8">
          <div
            className="flex1 mr-4 ml-4 flex w100p"
            style={{
              height: 32,
            }}
          ></div>
          <div
            className="flex1 mr-4 ml-4 flex w100p"
            style={{
              height: 32,
            }}
          ></div>

          <div className="flex" style={{ flex: 1, margin: "0 4px", height: 32 }}>
            <button
              className="btn-add-b"
              style={{
                width: "50%",
                marginRight: 4,
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
                marginLeft: 4,
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
      </div>

      <div className="list-header mt-10 pl-18 pr-18">
        <div className="w25p text-left pl-6 pl-6">
          <p>닉네임/ID</p>
        </div>
        <div className="w25p text-center pl-6 pl-6">
          <p>휴면처리일</p>
        </div>
        <div className="w25p text-center pl-6 pl-6">
          <p>이메일</p>
        </div>

        <div className="w25p text-center pl-6 pl-6">
          <p>기능</p>
        </div>
      </div>

      <div className={`list-content pl-18 pr-18`}>
        <div className={`flex align-c mt-8 mb-8`}>
          <div className="w25p text-left pl-6 pl-6">
            <p>행복한 물개(ew*****)</p>
          </div>
          <div className="w25p text-center pl-6 pl-6">
            <p>2023.01.01</p>
          </div>
          <div className="w25p text-center pl-6 pl-6">
            <p>******************</p>
          </div>

          <div className="w25p text-center pl-6 pl-6">
            <ButtonR
              name="상세"
              color="white"
              onClick={() => navigate("/customer/inactiveusers/1234/tab1")}
            />
          </div>
        </div>
      </div>

      <div className="mt-20 flex justify-fe align-c flex-wrap">
        <div className="flex pagination">
          <p className="font-lightgray">{"<"}</p>
          <p className="font-bold">1</p>
          <p>2</p>
          <p>3</p>
          <p>4</p>
          <p>5</p>
          <p className="font-lightgray">{">"}</p>
        </div>
      </div>
    </div>
  );
}
