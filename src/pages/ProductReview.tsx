import React, { ChangeEventHandler, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { getAdminLookup, getDatas, getUsers } from "../common/apis";

import ButtonR from "../components/ButtonR";
import InputR from "../components/InputR";
import SelectBox from "../components/SelectBox";
import { deleteItem, timeFormat1, timeFormat2 } from "../common/utils";

const SELECT_STATUS = [
  { value: "전체", label: "전체" },
  { value: "상품문의", label: "상품문의" },
  { value: "배송문의", label: "배송문의" },
  { value: "교환/환불/취소 문의", label: "교환/환불/취소 문의" },
  { value: "기타 문의", label: "기타 문의" },
];

const OPEN_STATUS = [
  { value: "전체", label: "전체" },
  { value: "Y", label: "Y" },
  { value: "N", label: "N" },
];

export default function ProductReviews(): JSX.Element {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<any>("");
  const [openSelected, setOpenSelected] = useState<any>("");
  const [rewardsPopup, setRewardsPopup] = useState<boolean>(false);
  const [rewards, setRewards] = useState<string>("");
  const [rewardType, setRewardType] = useState<string>("지급");

  const [couponPopup, setCouponPopup] = useState<boolean>(false);

  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    let reviews: any = await getAdminLookup({
      collection: "reviews",
      lookupFrom: "products",
      addField: "targetId",
      as: "productInfo",
    });
    reviews = reviews.data;

    let users: any = await getAdminLookup({
      collection: "reviews",
      lookupFrom: "users",
      addField: "userId",
      as: "userInfo",
    });
    users = users.data;

    for (let i = 0; i < reviews.length; i++) {
      reviews[i].userInfo = users[i].userInfo;
    }

    setData(reviews);
  };

  const handleOnChangeRewards = (e: any) => {
    let value: string = e.target.value;
    const numCheck: boolean = /^[0-9,]/.test(value);

    if (!numCheck && value) return;

    if (numCheck) {
      const numValue = value.replaceAll(",", "");
      value = numValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    setRewards(value);
  };

  return (
    <div>
      <div className="flex justify-sb align-c">
        <p className="page-title">상품문의 관리</p>
      </div>

      <div className="w100p filter-container" style={{ flex: 1 }}>
        <div className="flex">
          <div className="flex1 ml-4 mr-4 flex">
            <input
              type="date"
              className="main-event-date-input mr-4"
              data-placeholder="작성일(~부터)"
              required
              aria-required="true"
            />
            <input
              type="date"
              className="main-event-date-input ml-4"
              data-placeholder="작성일(~까지)"
              required
              aria-required="true"
            />
          </div>
          <div style={{ flex: 1, margin: "0 4px" }}></div>
          <div className="flex" style={{ flex: 1, margin: "0 4px" }}>
            <div className="flex flex1 ml-4 mr-4" style={{ height: 32 }}>
              <button className="btn-add-b w50p border-none mr-4 h100p" style={{}}>
                검색
              </button>
              <button className="w50p bg-white border-black h100p ml-4">초기화</button>
            </div>
          </div>
        </div>

        <div className="flex mt-8">
          <div className="flex1 ml-4 mr-4 flex">
            <SelectBox
              containerStyles={{ width: "100%" }}
              value={openSelected}
              onChange={(e: any) => setOpenSelected(e)}
              options={SELECT_STATUS}
              noOptionsMessage={"상태가 없습니다."}
              placeholder="유형"
            />
          </div>
          <div className="flex1 mr-4 ml-4">
            <SelectBox
              containerStyles={{ width: "100%" }}
              value={openSelected}
              onChange={(e: any) => setOpenSelected(e)}
              options={SELECT_STATUS}
              noOptionsMessage={"상태가 없습니다."}
              placeholder="적립금 지급여부"
            />
          </div>
          <div className="flex1 ml-4 mr-4">
            <SelectBox
              containerStyles={{ width: "100%" }}
              value={openSelected}
              onChange={(e: any) => setOpenSelected(e)}
              options={OPEN_STATUS}
              noOptionsMessage={"상태가 없습니다."}
              placeholder="공개여부"
            />
          </div>
        </div>

        <div className="flex mt-8" style={{ display: "flex", marginTop: 8 }}>
          <div className="flex1 ml-4 mr-4 w100p flex" style={{ height: 32 }}>
            <InputR size="full" placeholer="상품명" innerStyle={{ margin: 0 }} />
          </div>
          <div style={{ flex: 1, margin: "0 4px", height: 32 }}>
            <InputR size="full" placeholer="작성자 ID" innerStyle={{ margin: 0 }} />
          </div>
          <div style={{ flex: 1, margin: "0 4px", height: 32 }}>
            <InputR size="full" placeholer="내용" innerStyle={{ margin: 0 }} />
          </div>
        </div>
      </div>

      <div className="mt-34 flex justify-sb align-c">
        <p>총 0건</p>
      </div>

      <div className="list-header mt-10 pl-18 pr-18">
        <div className="w10p">{/* <p>카테고리</p> */}</div>

        <div className="w20p pl-10 pr-10">
          <p>상품명</p>
        </div>

        <div className="w10p pl-10 pr-10">
          <p>작성자</p>
        </div>

        <div className="w10p text-center">
          <p>조회수</p>
        </div>
        <div className="w10p text-center">
          <p>공개여부</p>
        </div>

        <div className="w10p text-center">
          <p>작성일자</p>
        </div>
        <div className="w10p text-center">
          <p>유형</p>
        </div>
        <div className="w10p text-center">
          <p>적립금 지급여부</p>
        </div>
        <div className="w10p text-center">
          <p>기능</p>
        </div>
      </div>

      <div className={`list-content pl-18 pr-18`}>
        {data?.map((item: any, i: number) => (
          <div key={i} className={`flex align-c mt-8 mb-8`}>
            <div className="w10p">
              <input type="checkbox" />
            </div>

            <div className="w20p pl-10 pr-10">
              <p className="text-line">{item.productInfo[0]?.productNameK}</p>
            </div>

            <div className="w10p pl-10 pr-10">
              <p className="text-line">{item.userInfo ? item.userInfo[0]?.nickname : ""}</p>
            </div>

            <div className="w10p text-center">
              <p>1,234</p>
            </div>

            <div className="w10p text-center">
              <p>{item.openStatus ? "Y" : "N"}</p>
            </div>
            <div className="w10p text-center">
              <p>
                텍스트 <br />
                (50자 미만)
              </p>
            </div>
            <div className="w10p text-center">
              <p>{timeFormat2(item.created)}</p>
            </div>
            <div className="w10p text-center">
              <p>N</p>
            </div>

            <div className="w10p text-center flex justify-c">
              <ButtonR
                name="상세"
                color="white"
                styles={{ marginRight: 4 }}
                onClick={() => navigate(`/customer/productinquiry/${item._id}`)}
              />
              <ButtonR
                name="삭제"
                color="white"
                onClick={async () => {
                  await deleteItem("productQna", item._id, "문의");
                  init();
                }}
              />
            </div>
          </div>
        ))}
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
            name="공개"
            color="white"
            onClick={() => setRewardsPopup(true)}
            styles={{ marginRight: 4 }}
          />
          <ButtonR
            name="비공개"
            color="white"
            onClick={() => setCouponPopup(true)}
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
