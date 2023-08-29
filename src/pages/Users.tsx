import React, { ChangeEventHandler, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { getDatas, getUsers, postCollection } from "../common/apis";
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

export default function Users(): JSX.Element {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<any>("");
  const [rewardsPopup, setRewardsPopup] = useState<boolean>(false);
  const [rewards, setRewards] = useState<string>("");
  const [rewardType, setRewardType] = useState<string>("지급");
  const [couponData, setCouponData] = useState<any>([]);
  const [selectedCoupon, setSelectedCoupon] = useState<any>(null);

  const [couponPopup, setCouponPopup] = useState<boolean>(false);

  const [users, setUsers] = useState<any[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<any>([]);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    const { data }: any = await getUsers({
      // sort: { sort: -1 },
    });

    const couponData: any = await getDatas({
      collection: "coupons",
      find: { targetMember: true },
    });

    let coupons = couponData?.data;

    let tempCoupons = [];
    for (let i = 0; i < coupons?.length; i++) {
      tempCoupons.push({
        label: coupons[i].title,
        value: coupons[i].title,
        ...coupons[i],
      });
    }

    // console.log(coupons);
    console.log("USERDATA", data);
    setCouponData(tempCoupons);
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

  const handleCheckUsers = (user: any) => {
    let tempUsers = [...users];
    const tIdx = tempUsers.findIndex((el: any) => el === user);

    tempUsers[tIdx].checked = !tempUsers[tIdx].checked;
    setUsers(tempUsers);
  };

  const handleFileterUsers = () => {
    const filteredUsers = users.filter((aUser) => aUser.checked);
    setFilteredUsers(filteredUsers);
  };

  useEffect(() => {
    if (rewardsPopup || couponPopup) {
      handleFileterUsers();
    }
  }, [rewardsPopup, couponPopup]);

  const handlePostRewards = async () => {
    // rewardType, rewards
    for (let i in filteredUsers) {
      const _body = {
        collection: "userRewards",
        targetCollection: "",
        targetUserId: filteredUsers[i]._id,
        detail: `[관리자 권한] 적립금 ${rewardType === "지급" ? "지급" : "차감"}`,
        rewards:
          rewardType === "지급"
            ? parseInt(rewards.replace(/,/gi, ""))
            : -parseInt(rewards.replace(/,/gi, "")),
      };

      await postCollection({
        ..._body,
      });
    }

    setRewardsPopup(false);
    init();
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
                {filteredUsers.map((aUser: any, i: number) => (
                  <div key={i} className="flex justify-sb align-c mt-8">
                    <p>
                      {aUser.nickname}({aUser.kakao})
                    </p>
                    <p>
                      {currency(aUser.rewards ? aUser.rewards : 0)} <span>{">"}</span>{" "}
                      <span>
                        {isNaN(
                          parseInt(aUser.rewards ? aUser.rewards : 0) +
                            parseInt(rewards.replace(",", ""))
                        )
                          ? 0
                          : rewardType === "지급"
                          ? currency(
                              parseInt(aUser.rewards ? aUser.rewards : 0) +
                                parseInt(rewards.replace(",", ""))
                            )
                          : currency(
                              parseInt(aUser.rewards ? aUser.rewards : 0) -
                                parseInt(rewards.replace(",", ""))
                            )}
                      </span>
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-center mt-15">선택한 {filteredUsers.length}명에게 적용됩니다.</p>

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

              <ButtonR name={"설정"} onClick={handlePostRewards} />
            </div>
          </div>
        </Modal>
      )}
      {couponPopup && (
        <Modal innerStyle={{ width: "29%", minHeight: "0" }}>
          <div className="padding-24">
            <div className="flex justify-sb">
              <h2 className="margin-0 mb-20">쿠폰 설정</h2>

              <div>
                <img
                  onClick={() => {
                    setCouponPopup(false);
                  }}
                  src={close}
                  className="img-close cursor"
                  alt="close"
                />
              </div>
            </div>

            <div className="pt-15 pb-15 border-bottom-gray">
              <SelectBox
                containerStyles={{ width: "100%" }}
                onChange={(e: any) => {
                  setSelectedCoupon(e);
                }}
                options={couponData}
                value={selectedCoupon}
                noOptionsMessage=""
                placeholder="쿠폰 선택"
              />
              <div className="mt-15">
                {filteredUsers.map((aUser: any) => (
                  <div className="flex justify-sb align-c mt-8">
                    <p>
                      {aUser.nickname}({aUser.kakao})
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-center mt-15">선택한 {filteredUsers.length}명에게 적용됩니다.</p>

            <div className="flex justify-fe mt-20">
              <ButtonR
                name={"취소"}
                onClick={() => {
                  setCouponPopup(false);
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
        <div className="w5p">{/* <input type="checkbox" /> */}</div>

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
        {users?.map((user: any, i: number) => (
          <div key={i} className={`flex align-c mt-8 mb-8`}>
            <div className="w5p">
              <input
                type="checkbox"
                onChange={() => handleCheckUsers(user)}
                checked={user.checked || ""}
              />
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
                onClick={() => navigate(`/customer/users/active/${user._id}/tab1`)}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-20 flex justify-sb align-c flex-wrap">
        <div className="flex">
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
