import React, { ChangeEventHandler, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { getAdminLookup, getDatas, getUsers } from "../common/apis";

import ButtonR from "../components/ButtonR";
import InputR from "../components/InputR";
import SelectBox from "../components/SelectBox";
import { deleteItem, timeFormat1, timeFormat2 } from "../common/utils";
import ObjectID from "bson-objectid";
// import { ObjectId } from "mongodb";

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

export default function ProductInquiry(): JSX.Element {
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
    let qna: any = await getAdminLookup({
      collection: "productQna",
      lookupFrom: "products",
      addField: "targetId",
      as: "productInfo",
    });
    qna = qna.data;
    let users: any = await getAdminLookup({
      collection: "productQna",
      lookupFrom: "users",
      addField: "userId",
      as: "userInfo",
    });
    users = users.data;

    for (let i = 0; i < qna.length; i++) {
      qna[i].userInfo = users[i].userInfo;
    }

    setData(qna);
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
          <div className="flex1 ml-4 mr-4">
            <SelectBox
              containerStyles={{ width: "100%" }}
              value={selected}
              onChange={(e: any) => setSelected(e)}
              options={SELECT_STATUS}
              noOptionsMessage={"상태가 없습니다."}
              placeholder="상태"
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

        <div className="flex mt-8">
          <div
            style={{
              flex: 1,
              margin: "0 4px",
              height: 32,
              width: "100%",
              display: "flex",
            }}
          >
            <InputR size="full" placeholer="작성자 ID" innerStyle={{ margin: 0 }} />
          </div>
          <div style={{ flex: 1, margin: "0 4px", height: 32 }}>
            <InputR size="full" placeholer="이메일" innerStyle={{ margin: 0 }} />
          </div>
          <div style={{ flex: 1, margin: "0 4px", height: 32 }}>
            <InputR size="full" placeholer="내용" innerStyle={{ margin: 0 }} />
          </div>
        </div>

        <div className="flex mt-8">
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

        <div className="w20p pl-10 pr-10">
          <p>상품명</p>
        </div>

        <div className="w25p pl-10 pr-10">
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

            <div className="w20p pl-10 pr-10">
              <a
                className="font-blue text-underline"
                target="blank"
                href={`/product/productmanage/${item.productInfo[0]?._id}`}
              >
                <p className="text-line">{item.productInfo[0]?.productNameK}</p>
              </a>
            </div>

            <div className="w25p pl-10 pr-10">
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
