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

export default function Coupon(): JSX.Element {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<any>("");
  const [coupons, setCoupons] = useState<any[]>([]);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    const { data }: any = await getDatas({
      collection: "coupons",
      sort: { sort: -1 },
    });

    console.log(data);
    setCoupons(data);
  };

  return (
    <div>
      <div className="flex justify-sb align-c">
        <p className="page-title">쿠폰 조회</p>
      </div>

      <div className="w100p filter-container flex1">
        <div className="flex">
          <div className="flex1 ml-4 mr-4 flex">
            <input
              type="date"
              className="main-event-date-input mr-4"
              data-placeholder="생성일(~부터)"
              required
              aria-required="true"
            />
            <input
              type="date"
              className="main-event-date-input ml-4"
              data-placeholder="생성일(~까지)"
              required
              aria-required="true"
            />

            {/* <input style={{ width: "100%", marginRight: 4 }} type="date" /> */}
            {/* <input style={{ width: "100%", marginLeft: 4 }} type="date" /> */}
          </div>
          <div className="flex1 ml-4 mr-4">
            <SelectBox
              containerStyles={{ width: "100%" }}
              value={selected}
              onChange={(e: any) => setSelected(e)}
              options={Cateogyoptions1}
              noOptionsMessage={"상태가 없습니다."}
              placeholder="발급구분"
            />
          </div>
          <div className="flex1 ml-4 mr-4">
            <SelectBox
              containerStyles={{ width: "100%" }}
              value={selected}
              onChange={(e: any) => setSelected(e)}
              options={Cateogyoptions1}
              noOptionsMessage={"상태가 없습니다."}
              placeholder="혜택구분"
            />
          </div>
        </div>

        <div className="flex flex1 mt-8">
          <div
            style={{
              flex: 1,
              margin: "0 4px",
              height: 32,
              width: "100%",
              display: "flex",
            }}
          >
            <InputR size="full" placeholer="쿠폰명" innerStyle={{ margin: 0 }} />
          </div>
          <div className="flex1 ml-4 mr-4" style={{ height: 32 }}>
            <SelectBox
              containerStyles={{ width: "100%" }}
              value={selected}
              onChange={(e: any) => setSelected(e)}
              options={Cateogyoptions1}
              noOptionsMessage={"상태가 없습니다."}
              placeholder="상태"
            />
          </div>
          <div className="flex flex1 ml-4 mr-4" style={{ height: 32 }}>
            <button className="btn-add-b w50p mr-4 h100p border-none">검색</button>
            <button className="w50p bg-white h100p ml-4 border-black">초기화</button>
          </div>
        </div>
        {/* <SelectBox
          value={selected}
          onChange={(e: any) => setSelected(e)}
          options={Cateogyoptions1}
          noOptionsMessage={"상태가 없습니다."}
          placeholder="진행상태"
        /> */}
        {/* <div className="flex" style={{ flex: 1, width: "100%" }}ㄴ>
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
            navigate("/site/coupon/add");
          }}
          name="쿠폰 등록"
        />
      </div>

      <div className="list-header mt-10 pl-18 pr-18">
        <div className="w5p">
          <input type="checkbox" />
        </div>

        <div className="w10p">
          <p>쿠폰번호</p>
        </div>

        <div className="w10p text-center">
          <p>쿠폰명</p>
        </div>

        <div className="w10p text-center">
          <p>혜택구분</p>
        </div>

        <div className="w10p text-center">
          <p>혜택</p>
        </div>

        <div className="w15p text-center">
          <p>사용기간</p>
        </div>

        <div className="w10p text-center">
          <p>발급수</p>
        </div>

        <div className="w10p text-center">
          <p>발급구분</p>
        </div>

        <div className="w10p text-center">
          <p>상태</p>
        </div>

        <div className="w10p text-center">
          <p>기능</p>
        </div>
      </div>

      {coupons?.map((couponItem: any, i: number) => (
        <div key={i} className={`list-content pl-18 pr-18`}>
          <div className={`flex align-c mt-8 mb-8`}>
            <div className="w5p">
              <input type="checkbox" />
            </div>

            <div className="w10p">
              <p>1234567890</p>
            </div>

            <div className="w10p text-center">
              <p>{couponItem.title}</p>
            </div>

            <div className="w10p text-center">
              {couponItem.discountRatio !== 0 && <p>할인율</p>}
              {couponItem.discountPrice !== 0 && <p>할인금액</p>}
              {couponItem.freeshipping && <p>무료배송</p>}
            </div>

            <div className="w10p text-center">
              {couponItem.discountRatio !== 0 && <p>{couponItem.discountRatio}%</p>}
              {couponItem.discountPrice !== 0 && <p>{currency(couponItem.discountPrice)}</p>}
              {couponItem.freeshipping && <p>무료배송</p>}
            </div>

            <div className="w15p text-center">
              {couponItem.startingDate && couponItem.endingDate && (
                <p>
                  <span>{couponItem.startingDate ? timeFormat1(couponItem.startingDate) : ""}</span>{" "}
                  ~ <span>{couponItem.endingDate ? timeFormat1(couponItem.endingDate) : ""}</span>
                </p>
              )}

              {!couponItem.startingDate && !couponItem.endingDate && <p>-</p>}
            </div>
            <div className="w10p text-center">
              <p>발급수</p>
            </div>

            <div className="w10p text-center">
              {couponItem.targetMember && <p>고객 다운로드</p>}
              {!couponItem.targetMember && <p>조건부 발급</p>}
            </div>
            <div className="w10p text-center">
              <p>{couponItem.status ? "사용가능" : "사용불가"}</p>
            </div>

            <div className="w10p flex justify-c text-center">
              <ButtonR
                name="상세"
                color="white"
                styles={{ marginRight: 4 }}
                onClick={() => navigate(`/site/event/${couponItem._id}`)}
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
          <ButtonR name="사용가능" color="white" styleClass="mr-4" onClick={() => {}} />
          <ButtonR name="사용불가" color="white" styleClass="mr-4" onClick={() => {}} />
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
