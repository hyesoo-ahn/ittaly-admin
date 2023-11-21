import React, { ChangeEventHandler, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { getAdminLookup, getDatas, getUsers } from "../common/apis";

import ButtonR from "../components/ButtonR";
import InputR from "../components/InputR";
import SelectBox from "../components/SelectBox";
import { PAGINATION_LIMIT, PAGINATION_NUM_LIMIT, timeFormat1, timeFormat2 } from "../common/utils";

const INQUIRY_STATUS = [
  { value: "전체", label: "전체" },
  { value: "미답변", label: "미답변" },
  { value: "답변완료", label: "답변완료" },
];

const CATEGORY = [
  { value: "전체", label: "전체" },
  { value: "주문/교환/반품 문의", label: "주문/교환/반품 문의" },
  { value: "이벤트/쿠폰/적립금 문의", label: "이벤트/쿠폰/적립금 문의" },
  { value: "상품 문의", label: "상품 문의" },
  { value: "배송 문의", label: "배송 문의" },
  { value: "결제 문의", label: "결제 문의" },
  { value: "기타 문의", label: "기타 문의" },
];

export default function CustomerInquiry(): JSX.Element {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<any>("");
  const [data, setData] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [filterOb, setFilterOb] = useState<any>({
    startingDate: "",
    endingDate: "",
    target: null,
    benefit: null,
    title: "",
    status: null,
  });
  const [filterInfo, setFilterInfo] = useState<any>({});

  // pagination
  const [numPage, setNumPage] = useState<number>(1);
  const [page, setPage] = useState(1);
  const limit = PAGINATION_LIMIT;
  const numLimit = PAGINATION_NUM_LIMIT;
  const offset = (page - 1) * limit; // 시작점과 끝점을 구하는 offset
  const numPagesTotal = Math.ceil(totalCount / limit);
  const numOffset = (numPage - 1) * numLimit;
  // const [pagesTotal, setPagesTotal] = useState<number>(0);

  useEffect(() => {
    init();
  }, [page, filterInfo]);

  const init = async () => {
    const { data }: any = await getAdminLookup({
      collection: "customerQna",

      lookupFrom: "users",
      addField: "userId",
      as: "userInfo",
    });

    setData(data);
  };

  const handleFilter = async () => {
    let find: any = {};
  };

  const handleChangeFilterInput = (type: string, value: any) => {
    setFilterOb((prev: any) => {
      return {
        ...prev,
        [type]: value,
      };
    });
  };

  return (
    <div>
      <div className="flex justify-sb align-c">
        <p className="page-title">1:1 문의 관리</p>
      </div>

      <div className="w100p filter-container" style={{ flex: 1 }}>
        <div className="flex">
          <div className="flex1 ml-4 mr-4 flex">
            <input
              value={filterOb.startingDate}
              onChange={(e: any) => {
                setFilterOb((prev: any) => {
                  return {
                    ...prev,
                    startingDate: e.target.value,
                  };
                });
              }}
              type="date"
              className="main-event-date-input mr-4"
              data-placeholder="작성일(~부터)"
              required
              aria-required="true"
            />
            <input
              value={filterOb.endingDate}
              onChange={(e: any) => {
                setFilterOb((prev: any) => {
                  return {
                    ...prev,
                    endingDate: e.target.value,
                  };
                });
              }}
              type="date"
              className="main-event-date-input ml-4"
              data-placeholder="작성일(~까지)"
              required
              aria-required="true"
            />
          </div>
          <div style={{ flex: 1, margin: "0 4px" }}>
            <SelectBox
              containerStyles={{ width: "100%" }}
              value={filterOb.target}
              onChange={(e: any) => handleChangeFilterInput("target", e)}
              options={INQUIRY_STATUS}
              noOptionsMessage={"상태가 없습니다."}
              placeholder="상태"
            />
          </div>
          <div style={{ flex: 1, margin: "0 4px" }}>
            <SelectBox
              containerStyles={{ width: "100%" }}
              value={filterOb.category}
              onChange={(e: any) => handleChangeFilterInput("category", e)}
              options={CATEGORY}
              noOptionsMessage={"상태가 없습니다."}
              placeholder="카테고리"
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
            <InputR
              value={filterOb.userid}
              onChange={(e: any) => handleChangeFilterInput("userid", e.target.value)}
              size="full"
              placeholer="작성자 ID"
              innerStyle={{ margin: 0 }}
            />
          </div>
          <div style={{ flex: 1, margin: "0 4px", height: 32 }}>
            <InputR
              value={filterOb.email}
              onChange={(e: any) => handleChangeFilterInput("email", e.target.value)}
              size="full"
              placeholer="이메일"
              innerStyle={{ margin: 0 }}
            />
          </div>
          <div style={{ flex: 1, margin: "0 4px", height: 32 }}>
            <InputR
              value={filterOb.content}
              onChange={(e: any) => handleChangeFilterInput("content", e.target.value)}
              size="full"
              placeholer="내용"
              innerStyle={{ margin: 0 }}
            />
          </div>
        </div>

        <div style={{ display: "flex", marginTop: 8 }}>
          <div className="flex1 flex ml-4 mr-4 w100p" style={{ height: 32 }}></div>
          <div className="flex1 ml-4 mr-4" style={{ height: 32 }}></div>
          <div className="flex flex1 ml-4 mr-4" style={{ height: 32 }}>
            <button className="btn-add-b w50p border-none mr-4 h100p" style={{}}>
              검색
            </button>
            <button className="w50p bg-white border-black h100p ml-4">초기화</button>
          </div>
        </div>
      </div>

      <div className="mt-34 flex justify-sb align-c">
        <p>총 0건</p>
      </div>

      <div className="list-header mt-10 pl-18 pr-18">
        <div className="w15p">
          <p>카테고리</p>
        </div>

        <div className="w45p pl-10 pr-10">
          <p>상담내용</p>
        </div>

        <div className="w10p text-center">
          <p>작성자</p>
        </div>

        <div className="w10p text-center">
          <p>작성일자</p>
        </div>
        <div className="w10p text-center">
          <p>상태</p>
        </div>
        <div className="w10p text-center">
          <p>기능</p>
        </div>
      </div>

      <div className={`list-content pl-18 pr-18`}>
        {data?.map((item: any, i: number) => (
          <div key={i} className={`flex align-c mt-8 mb-8`}>
            <div className="w15p">
              <p>{item.category}</p>
            </div>

            <div className="w45p pl-10 pr-10">
              <p className="text-line">{item.content}</p>
            </div>

            <div className="w10p text-center">
              <p>{item.userInfo[0]?.nickname}</p>
            </div>

            <div className="w10p text-center">
              <p>{timeFormat2(item.created)}</p>
            </div>
            <div className="w10p text-center">
              {item.status === "resolved" && <p>답변 완료</p>}
              {item.status === "unresolved" && <p>미답변</p>}
            </div>

            <div className="w10p text-center">
              <ButtonR
                name="상세"
                color="white"
                styles={{ marginRight: 4 }}
                onClick={() => navigate(`/customer/inquiry/${item._id}`)}
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

      <div className="mt-20 flex justify-fe align-c flex-wrap">
        {/* <div className="flex">
          <ButtonR
            name="적립금 수동 처리"
            color="white"
            onClick={() => setRewardsPopup(true)}
            styles={{ marginRight: 4 }}
          />
          <ButtonR
            name="쿠폰 수동 처리"
            color="white"
            onClick={() => setCouponPopup(true)}
            styles={{ marginRight: 4 }}
          />
        </div> */}

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
