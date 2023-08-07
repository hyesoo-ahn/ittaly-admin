import React, { ChangeEventHandler, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { getDatas, getUsers } from "../common/apis";
import { currency, timeFormat1, timeFormat2 } from "../common/utils";
import ButtonR from "../components/ButtonR";
import InputR from "../components/InputR";
import SelectBox from "../components/SelectBox";
import Modal from "../components/Modal";
import close from "../images/close.png";

const Cateogyoptions1 = [
  { value: "대분류 카테고리1", label: "대분류 카테고리1" },
  { value: "대분류 카테고리2", label: "대분류 카테고리2" },
  { value: "대분류 카테고리3", label: "대분류 카테고리3" },
];

export default function Notice(): JSX.Element {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<any>("");
  const [rewardsPopup, setRewardsPopup] = useState<boolean>(false);
  const [rewards, setRewards] = useState<string>("");
  const [rewardType, setRewardType] = useState<string>("지급");

  const [couponPopup, setCouponPopup] = useState<boolean>(false);

  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    const { data }: any = await getUsers({
      // sort: { sort: -1 },
    });

    console.log(data);
    setUsers(data);
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
        <p className="page-title">공지사항 관리</p>
      </div>

      <div className="w100p filter-container flex1">
        <div className="flex"></div>

        <div className="flex">
          <div className="flex1 flex ml-4 mr-4 w100p" style={{ height: 32 }}>
            {/* <InputR size="full" placeholer="닉네임/ID" innerStyle={{ margin: 0 }} /> */}
            <SelectBox
              containerStyles={{ width: "100%" }}
              onChange={() => {}}
              placeholder="카테고리"
              value={null}
              options={Cateogyoptions1}
              noOptionsMessage="옵션이 없습니다"
            />
          </div>
          <div className="flex ml-4 mr-4 flex1" style={{ height: 32 }}>
            <SelectBox
              containerStyles={{ width: "100%" }}
              onChange={() => {}}
              placeholder="카테고리"
              value={null}
              options={Cateogyoptions1}
              noOptionsMessage="옵션이 없습니다"
            />
          </div>
          <div className="flex flex1 ml-4 mr-4" style={{ height: 32 }}></div>
        </div>

        <div className="flex mt-8">
          <div className="flex mr-4 ml-4" style={{ height: 32, flex: 2 }}>
            <InputR size="full" innerStyle={{ marginRight: 0 }} />
            {/* <InputR size="full" placeholer="닉네임/ID" innerStyle={{ margin: 0 }} /> */}
          </div>

          <div className="flex flex1 ml-4 align-c">
            <button
              className="btn-add-b mr-4"
              style={{
                width: "50%",
                border: "none",
              }}
            >
              검색
            </button>
            <button
              className="ml-4"
              style={{
                width: "50%",
                backgroundColor: "#fff",
                height: "100%",

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
        {users.map((user: any, i: number) => (
          <div key={i} className={`flex align-c mt-8 mb-8`}>
            <div className="w5p">
              <input type="checkbox" />
            </div>
            <div className="w10p text-center">
              <p>{timeFormat2(user.created)}</p>
            </div>
            <div className="w10p text-center">
              <p>{user.nickname}</p>
              <p>(ewsd24s)</p>
            </div>
            <div className="w15p text-center">
              <p>{user.email}</p>
            </div>

            <div className="w10p text-center">
              <p>카카오</p>
            </div>
            <div className="w10p text-center">
              <p>{user.membership}</p>
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
                onClick={() => navigate("/customer/users/active/1234/tab1")}
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
