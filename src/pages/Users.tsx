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

export default function Users(): JSX.Element {
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
        <p className="page-title">회원정보 조회</p>
      </div>

      <div className="w100p filter-container" style={{ flex: 1 }}>
        <div className="flex">
          <div className="flex1 ml-4 mr-4 flex">
            <input
              type="date"
              className="main-event-date-input mr-4"
              data-placeholder="가입일(~부터)"
              required
              aria-required="true"
            />
            <input
              type="date"
              className="main-event-date-input ml-4"
              data-placeholder="가입일(~까지)"
              required
              aria-required="true"
            />

            {/* <input style={{ width: "100%", marginRight: 4 }} type="date" /> */}
            {/* <input style={{ width: "100%", marginLeft: 4 }} type="date" /> */}
          </div>
          <div style={{ flex: 1, margin: "0 4px" }}>
            <SelectBox
              containerStyles={{ width: "100%" }}
              value={selected}
              onChange={(e: any) => setSelected(e)}
              options={Cateogyoptions1}
              noOptionsMessage={"상태가 없습니다."}
              placeholder="회원등급"
            />
          </div>
          <div style={{ flex: 1, margin: "0 4px" }}>
            <SelectBox
              containerStyles={{ width: "100%" }}
              value={selected}
              onChange={(e: any) => setSelected(e)}
              options={Cateogyoptions1}
              noOptionsMessage={"상태가 없습니다."}
              placeholder="가입 SNS 채널"
            />
          </div>
        </div>

        <div style={{ display: "flex", marginTop: 8 }}>
          <div
            style={{
              flex: 1,
              margin: "0 4px",
              height: 32,
              width: "100%",
              display: "flex",
            }}
          >
            <InputR size="full" placeholer="닉네임/ID" innerStyle={{ margin: 0 }} />
          </div>
          <div style={{ flex: 1, margin: "0 4px", height: 32 }}>
            <InputR size="full" placeholer="이메일" innerStyle={{ margin: 0 }} />
          </div>
          <div className="flex" style={{ flex: 1, margin: "0 4px", height: 32 }}></div>
        </div>

        <div style={{ display: "flex", marginTop: 8 }}>
          <div
            style={{
              flex: 1,
              margin: "0 4px",
              height: 32,
              width: "100%",
              display: "flex",
            }}
          >
            <InputR size="full" placeholer="닉네임/ID" innerStyle={{ margin: 0 }} />
          </div>
          <div style={{ flex: 1, margin: "0 4px", height: 32 }}>
            <InputR size="full" placeholer="이메일" innerStyle={{ margin: 0 }} />
          </div>
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
        <div className="w5p">
          <input type="checkbox" />
        </div>

        <div className="w10p text-center">
          <p>가입일</p>
        </div>

        <div className="w10p text-center">
          <p>닉네임/ID</p>
        </div>
        <div className="w15p text-center">
          <p>이메일</p>
        </div>

        <div className="w10p text-center">
          <p>가입 SNS</p>
        </div>
        <div className="w10p text-center">
          <p>회원등급</p>
        </div>
        <div className="w10p text-center">
          <p>적립금</p>
        </div>
        <div className="w10p text-center">
          <p>총 실결제금액</p>
        </div>
        <div className="w10p text-center">
          <p>총 주문건수</p>
        </div>
        <div className="w10p text-center">
          <p>기능</p>
        </div>
      </div>

      <div className={`list-content pl-18 pr-18`}>
        <div className={`flex align-c mt-8 mb-8`}>
          <div className="w5p">
            <input type="checkbox" />
          </div>
          <div className="w10p text-center">
            <p>2023. 01. 01</p>
          </div>
          <div className="w10p text-center">
            <p>행복한 물개</p>
            <p>(ewsd24s)</p>
          </div>
          <div className="w15p text-center">
            <p>ahnhs719@gmail.com</p>
          </div>

          <div className="w10p text-center">
            <p>카카오</p>
          </div>
          <div className="w10p text-center">
            <p>Silver</p>
          </div>
          <div className="w10p text-center">
            <p>1,234,567</p>
          </div>
          <div className="w10p text-center">
            <p>1,234,000</p>
          </div>
          <div className="w10p text-center">
            <p>24</p>
          </div>
          <div className="w10p text-center">
            <ButtonR
              name="상세"
              color="white"
              styles={{ marginRight: 4 }}
              onClick={() => navigate("/customer/users/1234/tab1")}
            />
          </div>
        </div>
      </div>

      {/* {events?.map((eventItem: any, i: number) => (
        <div key={i} className={`list-content pl-18 pr-18 ${i === 0 && "bg-blue border-radius-8"}`}>
          <div className={`flex align-c mt-8 mb-8`}>
            <div className="w5p">
              <input type="checkbox" />
            </div>

            <div className="w10p">
              {eventItem.eventType === "normal" && <p>일반</p>}
              {eventItem.eventType === "luckydraw" && <p>럭키드로우</p>}
              {eventItem.eventType === "recommend" && <p>추천인</p>}
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

            <div className="w10p"></div>

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
                onClick={async () => {}}
              />
            </div>
          </div>
        </div>
      ))} */}

      <div className="mt-20 flex justify-sb align-c flex-wrap">
        <div className="flex">
          <ButtonR
            name="적립금 수동 처리"
            color="white"
            onClick={() => {}}
            styles={{ marginRight: 4 }}
          />
          <ButtonR
            name="쿠폰 수동 처리"
            color="white"
            onClick={() => {}}
            styles={{ marginRight: 4 }}
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
