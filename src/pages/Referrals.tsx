import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Select from "react-select";
import { getDatas } from "../common/apis";
import { currency, timeFormat1 } from "../common/utils";
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

export default function Referrals(): JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectArr, setSelectArr] = useState<any>([
    {
      label: "tab1",
      value: "피추천인",
    },
    {
      label: "tab2",
      value: "추천인",
    },
  ]);
  const [selectedTab, setSelectedTab] = useState<string>("tab1");
  const [selected, setSelected] = useState<any>("");
  const [rewardsPopup, setRewardsPopup] = useState<boolean>(false);
  const [rewards, setRewards] = useState<string>("");
  const [rewardType, setRewardType] = useState<string>("지급");

  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    const { pathname } = location;
    const tab = pathname.split("/");

    if (tab[4]) {
      setSelectedTab(tab[4]);
    } else {
      setSelectedTab("tab1");
    }

    const productData: any = await getDatas({
      collection: "events",
      sort: { sort: -1 },
    });
    setEvents(productData.data);
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
      {rewardsPopup && (
        <Modal innerStyle={{ width: "29%", minHeight: "0" }}>
          <div className="padding-24">
            <div className="flex justify-sb">
              <h2 className="margin-0 mb-20">적립금 설정</h2>

              <div>
                <img
                  onClick={() => {
                    setRewardsPopup(false);
                  }}
                  src={close}
                  className="img-close cursor"
                  alt="close"
                />
              </div>
            </div>

            <div className="pt-15 pb-15 border-bottom-gray">
              <div className="flex align-c">
                <div className="rewards-contents flex align-c mr-10">
                  <div className="w40p bg-gray h100 flex align-c justify-c flex-wrap pl-18 pr-18">
                    <div className="flex align-c mr-20">
                      <div onClick={() => setRewardType("지급")} className="checkbox-c mr-4 cursor">
                        {rewardType === "지급" && <div className="checkbox-c-filled"></div>}
                      </div>
                      <p onClick={() => setRewardType("지급")} className="font-14 cursor ">
                        지급
                      </p>
                    </div>
                    <div className="flex align-c">
                      <div onClick={() => setRewardType("차감")} className="checkbox-c mr-4 cursor">
                        {rewardType === "차감" && <div className="checkbox-c-filled"></div>}
                      </div>
                      <p onClick={() => setRewardType("차감")} className="font-14 cursor">
                        차감
                      </p>
                    </div>
                  </div>

                  <div className="w60p flex align-c">
                    <input
                      className="reward-input"
                      value={rewards}
                      onChange={(e: any) => handleOnChangeRewards(e)}
                    />
                  </div>
                </div>
                <p>원</p>
              </div>

              <div className="mt-15">
                <div className="flex justify-sb align-c">
                  <p>행복한 물개(ewsd24s)</p>
                  <p>500원</p>
                </div>

                <div className="flex justify-sb align-c mt-4">
                  <p>행복한 물개(ewsd24s2)</p>
                  <p>2,000원</p>
                </div>
              </div>
            </div>

            <p className="text-center mt-15">선택한 2명에게 적용됩니다.</p>

            <div className="flex justify-fe mt-20">
              <ButtonR
                name={"취소"}
                onClick={() => {
                  setRewards("");
                  setRewardType("지급");
                  setRewardsPopup(false);
                }}
                color={"white"}
                styleClass={"mr-8"}
              />

              <ButtonR name={"설정"} onClick={() => {}} />
            </div>
          </div>
        </Modal>
      )}
      <div className="flex justify-sb align-c">
        <p className="page-title">추천인 관리</p>

        <p className="font-12">
          <span className="font-bold">* 추천인: </span>
          <span>기존 가입자 / </span>
          <span className="font-bold">* 피추천인: </span>
          <span>추천인의 코드를 입력하여 신규 가입한 회원</span>
        </p>
      </div>

      {/* tab */}
      <div className="tab-container">
        {selectArr.map((tabItem: any, i: number) => (
          <div
            key={i}
            onClick={() => {
              setSelectedTab(tabItem.label);
              navigate(`/customer/referral/managing/${tabItem.label}`);
            }}
            className={`tab-item 
            ${i === 1 && "border-right-black"}
            ${selectedTab === tabItem.label ? "border-bottom-none font-bold" : "bg-gray"}`}
          >
            <p className="font-14">{tabItem.value}</p>
          </div>
        ))}

        <div className="border-bottom-black flex1"></div>
      </div>

      <div className="w100p filter-container" style={{ flex: 1 }}>
        <div className="flex">
          <div className="flex1 ml-4 mr-4 flex">
            <input
              type="date"
              className="main-event-date-input"
              data-placeholder="가입일(~부터)"
              required
              aria-required="true"
            />
          </div>
          <div className="flex1 ml-4 mr-4 flex">
            <input
              type="date"
              className="main-event-date-input"
              data-placeholder="가입일(~부터)"
              required
              aria-required="true"
            />
          </div>
          <div className="flex1 ml-4 mr-4">
            {/* <SelectBox
              containerStyles={{ width: "100%" }}
              value={selected}
              onChange={(e: any) => setSelected(e)}
              options={Cateogyoptions1}
              noOptionsMessage={"상태가 없습니다."}
              placeholder="추천인 적립금 지급 상태"
            /> */}
            <InputR size={"full"} placeholer="회원 ID" />
          </div>
        </div>

        <div style={{ display: "flex", marginTop: 8 }}>
          <div className="flex flex1 ml-4 mr-4 w100p" style={{ height: 32 }}></div>
          <div className="flex1 ml-4 mr-4" style={{ height: 32 }}></div>
          <div className="flex flex1 ml-4 mr-4" style={{ height: 32 }}>
            <button
              className="btn-add-b mr-4"
              style={{
                width: "50%",
                height: "100%",
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
      {/* 컨텐츠 */}
      <div className="mt-30 mb-30">
        {selectedTab === "tab1" && <Tab1 navigate={navigate} />}
        {selectedTab === "tab2" && <Tab2 />}
      </div>

      <div className="mt-20 flex justify-fe align-c flex-wrap ">
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

const Tab1 = ({ navigate }: any) => {
  return (
    <>
      <div>
        <div className="mt-34 flex justify-sb align-c">
          <p>총 0건</p>
        </div>
        <div className="list-header mt-10 pl-18 pr-18">
          <div className="w20p text-center">
            <p>가입일</p>
          </div>

          <div className="w20p text-center">
            <p>피추천인 ID</p>
          </div>

          <div className="w20p text-center">
            <p>추천인 ID(추천인코드)</p>
          </div>
          <div className="w20p text-center">
            <p>총 주문 수</p>
          </div>

          <div className="w20p text-center">
            <p>총 적립금액</p>
          </div>
        </div>
        <div className={`list-content pl-18 pr-18`}>
          <div className={`flex align-c pt-10 pb-10`}>
            <div className="w20p text-center">
              <p>2023. 01. 01</p>
            </div>
            <div className="w20p text-center">
              <p>aff77h2r</p>
            </div>
            <div className="w20p text-center">
              <p>sdsfge92(12345567)</p>
            </div>

            <div className="w20p text-center">
              <p>10</p>
            </div>
            <div className="w20p text-center">
              <p>123,456</p>
            </div>
          </div>
          <div className={`flex align-c pt-10 pb-10`}>
            <div className="w20p text-center">
              <p>2023. 01. 01</p>
            </div>
            <div className="w20p text-center">
              <p>aff77h2r</p>
            </div>
            <div className="w20p text-center">
              <p>sdsfge92(12345567)</p>
            </div>

            <div className="w20p text-center">
              <p>10</p>
            </div>
            <div className="w20p text-center">
              <p>123,456</p>
            </div>
          </div>
          <div className={`flex align-c pt-10 pb-10`}>
            <div className="w20p text-center">
              <p>2023. 01. 01</p>
            </div>
            <div className="w20p text-center">
              <p>aff77h2r</p>
            </div>
            <div className="w20p text-center">
              <p>sdsfge92(12345567)</p>
            </div>

            <div className="w20p text-center">
              <p>10</p>
            </div>
            <div className="w20p text-center">
              <p>123,456</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const Tab2 = ({ navigate }: any) => {
  return (
    <>
      <div>
        {" "}
        <div>
          <div className="mt-34 flex justify-sb align-c">
            <p>총 0건</p>
          </div>
          <div className="list-header mt-10 pl-18 pr-18">
            <div className="w20p text-center">
              <p>가입일</p>
            </div>

            <div className="w20p text-center">
              <p>피추천인 ID</p>
            </div>

            <div className="w20p text-center">
              <p>추천인 ID(추천인코드)</p>
            </div>
            <div className="w20p text-center">
              <p>총 주문 수</p>
            </div>

            <div className="w20p text-center">
              <p>총 적립금액</p>
            </div>
          </div>
          <div className={`list-content pl-18 pr-18`}>
            <div className={`flex align-c pt-10 pb-10`}>
              <div className="w20p text-center">
                <p>2023. 01. 01</p>
              </div>
              <div className="w20p text-center">
                <p>aff77h2r</p>
              </div>
              <div className="w20p text-center">
                <p>sdsfge92(12345567)</p>
              </div>

              <div className="w20p text-center">
                <p>10</p>
              </div>
              <div className="w20p text-center">
                <p>123,456</p>
              </div>
            </div>
            <div className={`flex align-c pt-10 pb-10`}>
              <div className="w20p text-center">
                <p>2023. 01. 01</p>
              </div>
              <div className="w20p text-center">
                <p>aff77h2r</p>
              </div>
              <div className="w20p text-center">
                <p>sdsfge92(12345567)</p>
              </div>

              <div className="w20p text-center">
                <p>10</p>
              </div>
              <div className="w20p text-center">
                <p>123,456</p>
              </div>
            </div>
            <div className={`flex align-c pt-10 pb-10`}>
              <div className="w20p text-center">
                <p>2023. 01. 01</p>
              </div>
              <div className="w20p text-center">
                <p>aff77h2r</p>
              </div>
              <div className="w20p text-center">
                <p>sdsfge92(12345567)</p>
              </div>

              <div className="w20p text-center">
                <p>10</p>
              </div>
              <div className="w20p text-center">
                <p>123,456</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
