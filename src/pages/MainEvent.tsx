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

export default function MainEvent(): JSX.Element {
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
        <p className="page-title">이벤트 관리</p>
      </div>

      <div className="w100p filter-container" style={{ flex: 1 }}>
        <SelectBox
          value={selected}
          onChange={(e: any) => setSelected(e)}
          options={Cateogyoptions1}
          noOptionsMessage={"상태가 없습니다."}
          placeholder="진행상태"
        />
        {/* <div className="flex" style={{ flex: 1, width: "100%" }}>
          <div style={{ width: "33.333%" }} className="mr-10 flex flex-wrap">
            <div className="mr-10 flex1">
              <input
                type="date"
                className="main-event-date-input"
                data-placeholder="시작일(~부터)"
                required
                aria-required="true"
              />
            </div>
            <div className="flex1">
              <input
                type="date"
                className="main-event-date-input"
                data-placeholder="종료일(~까지)"
                required
                aria-required="true"
              />
            </div>
          </div>
          <div style={{ width: "33.333%" }} className="mr-10">
            <InputR size="full" placeholer="쿠폰명 입력" />
          </div>

          <div style={{ width: "33.33333%" }}>
            <SelectBox
              value={selected}
              onChange={(e: any) => setSelected(e)}
              options={Cateogyoptions1}
              noOptionsMessage={"상태가 없습니다."}
              placeholder="진행상태"
            />
          </div>
        </div> */}

        {/* <div className="flex">
          <div
            style={{
              width: "33.333%",
            }}
          >
            <SelectBox
              containerStyles={{ paddingRight: 8, marginTop: 8 }}
              placeholder={"이벤트 유형"}
              options={Cateogyoptions1}
              noOptionsMessage={"등록된 유형이 없습니다."}
              value={selected}
              onChange={(e: any) => setSelected(e)}
            />
          </div>
          <div style={{ width: "33.333%" }}>
            <SelectBox
              containerStyles={{ paddingRight: 7, marginTop: 8 }}
              placeholder={"공개 여부"}
              options={Cateogyoptions1}
              noOptionsMessage={"등록된 유형이 없습니다."}
              value={selected}
              onChange={(e: any) => setSelected(e)}
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
        </div> */}
      </div>

      <div className="mt-34 flex justify-sb align-c">
        <p>총 0건</p>
        <ButtonR
          onClick={() => {
            navigate("/site/event/add");
          }}
          name="이벤트 등록"
        />
      </div>

      <div className="list-header mt-10 pl-18 pr-18">
        <div className="w5p">
          <input type="checkbox" />
        </div>

        <div className="w10p">
          <p>이벤트 유형</p>
        </div>

        <div className="w25p">
          <p>이벤트명</p>
        </div>

        <div className="w30p">
          <p>이벤트 기간</p>
        </div>

        <div className="w10p text-center">
          <p>진행상태</p>
        </div>

        <div className="w10p text-center">
          <p>조회수</p>
        </div>

        <div className="w5p text-center">
          <p>공개여부</p>
        </div>

        <div className="text-center w15p">
          <p>기능</p>
        </div>
      </div>

      {events?.map((eventItem: any, i: number) => (
        <div key={i} className={`list-content pl-18 pr-18 ${i === 0 && "bg-blue border-radius-8"}`}>
          <div className={`flex align-c mt-8 mb-8`}>
            <div className="w5p">
              <input type="checkbox" />
            </div>

            <div className="w10p">
              {eventItem.eventType === "normal" && <p>일반</p>}
              {eventItem.eventType === "luckydraw" && <p>럭키드로우</p>}
            </div>

            <div className="w25p">
              <p>{eventItem.title}</p>
            </div>

            <div className="w30p">
              <p>
                {timeFormat1(eventItem.term[0])} ~ {timeFormat1(eventItem.term[1])}
              </p>
            </div>

            <div className="w10p text-center">
              <p> {eventItem.term[1] > Date.now() ? "진행중" : "종료"}</p>
            </div>

            <div className="w10p">{/* <p>{currency(productItem.price)}원</p> */}</div>

            <div className="w5p text-center">
              <p>Y</p>
            </div>

            <div className="text-center w15p flex justify-c">
              <ButtonR
                name="상세"
                color="white"
                styles={{ marginRight: 4 }}
                onClick={() => navigate(`/site/event/${eventItem._id}`)}
              />
              <ButtonR
                name="삭제"
                color="white"
                styles={{ marginRight: 4 }}
                onClick={async () => {
                  // await deleteItem("banners", aBanner._id, "배너");
                  // await init();
                }}
              />
            </div>
          </div>
        </div>
      ))}

      <div className="mt-20 flex justify-sb align-c flex-wrap">
        <div className="flex">
          <ButtonR name="공개" color="white" onClick={() => {}} styles={{ marginRight: 4 }} />
          <ButtonR name="비공개" color="white" onClick={() => {}} styles={{ marginRight: 4 }} />
          <ButtonR
            name="우선노출지정"
            color="white"
            onClick={() => {}}
            styles={{ marginRight: 4 }}
            styleClass={"bg-blue"}
          />
          <ButtonR
            name="우선노출해제"
            color="white"
            onClick={() => {}}
            styles={{ marginRight: 4 }}
            styleClass={"bg-blue"}
          />
        </div>

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
//
