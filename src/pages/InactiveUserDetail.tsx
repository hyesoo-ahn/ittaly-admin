import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ButtonR from "../components/ButtonR";
import Modal from "../components/Modal";
import SelectBox from "../components/SelectBox";
import close from "../images/close.png";

const MEMBERSHIP_LEVEL = [
  {
    value: "Top Class",
    label: "Top Class",
  },
  {
    value: "Platinum",
    label: "Platinum",
  },
  {
    value: "Gold",
    label: "Gold",
  },
  {
    value: "Silver",
    label: "Silver",
  },
  {
    value: "Family",
    label: "Family",
  },
];

export default function InactiveUserDetail(): JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectArr, setSelectArr] = useState<any>([
    {
      label: "tab1",
      value: "기본정보",
    },
    {
      label: "tab2",
      value: "주문내역",
    },
    {
      label: "tab3",
      value: "쿠폰 내역",
    },
    {
      label: "tab4",
      value: "적립 내역",
    },
    {
      label: "tab5",
      value: "작성글",
    },
  ]);
  const [selectedTab, setSelectedTab] = useState<string>("tab1");

  useEffect(() => {
    const { pathname } = location;

    const tab = pathname.split("/");
    setSelectedTab(tab[4]);
  }, []);

  return (
    <div>
      <div className="flex justify-sb align-c">
        <p className="page-title">휴면회원 상세</p>
      </div>

      {/* tab */}
      <div className="tab-container">
        {selectArr.map((tabItem: any, i: number) => (
          <div
            key={i}
            onClick={() => {
              setSelectedTab(tabItem.label);
              navigate(`/customer/users/1234/${tabItem.label}`);
            }}
            className={`tab-item 
            ${i === 4 && "border-right-black"}
            ${selectedTab === tabItem.label ? "border-bottom-none font-bold" : "bg-gray"}`}
          >
            <p className="font-14">{tabItem.value}</p>
          </div>
        ))}

        <div className="border-bottom-black flex1"></div>
      </div>

      {/* 컨텐츠 */}
      <div className="mt-30 mb-30">
        {selectedTab === "tab1" && <Tab1 navigate={navigate} />}
        {selectedTab === "tab2" && <Tab2 />}
        {selectedTab === "tab3" && <Tab3 />}
        {selectedTab === "tab4" && <Tab4 />}
        {selectedTab === "tab5" && <Tab5 />}
      </div>
    </div>
  );
}

const Tab1 = ({ navigate }: any) => {
  const [memoPopup, setMemoPopup] = useState<boolean>(false);
  const [customerLevelPopup, setCustomerLevelPopup] = useState<boolean>(false);
  const [popupAdd, setPopupAdd] = useState<string>("");
  const [memoContents, setMemoContents] = useState<string>("");
  const [selectedLevel, setSelectedLevel] = useState<any>(null);

  return (
    <>
      {memoPopup && (
        <Modal innerStyle={{ width: "60%", minHeight: "0" }}>
          <div className="padding-24">
            <div className="flex justify-sb">
              <h2 className="margin-0 mb-20">회원메모 추가</h2>

              <div>
                <img
                  onClick={() => {
                    setMemoPopup(false);
                  }}
                  src={close}
                  className="img-close cursor"
                  alt="close"
                />
              </div>
            </div>

            <div className="flex">
              <div className="flex1">
                <div className="product-field-wrapper mt-2">
                  <div className="product-field mr-20">
                    <p>닉네임/ID</p>
                  </div>

                  <p>행복한 물개(ews24s)</p>
                </div>
                <div className="product-field-wrapper mt-2">
                  <div className="product-field mr-20">
                    <p>작성일</p>
                  </div>

                  <p>-</p>
                </div>
              </div>
              <div className="flex1">
                <div className="field-list-wrapper mt-2">
                  <div className="product-field mr-20">
                    <p>작성자</p>
                  </div>

                  <div className="flex align-c flex1 pt-10 pb-10">
                    <p>관리자</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="field-list-wrapper mt-2">
              <div className="product-field mr-20">
                <p>메모내용</p>
              </div>

              <div className="flex align-c flex1 pt-10 pb-10">
                {popupAdd !== "view" && (
                  <textarea
                    className="input-textarea"
                    style={{ height: 200 }}
                    placeholder="내용을 입력해 주세요"
                  />
                )}

                {popupAdd === "view" && (
                  <div>
                    <h1>메모내용 한줄 노출</h1>
                    <h1>메모내용 한줄 노출</h1>
                    <h1>메모내용 한줄 노출</h1>
                    <h1>메모내용 한줄 노출</h1>
                    <h1>메모내용 한줄 노출</h1>
                    <h1>메모내용 한줄 노출</h1>
                    <h1>메모내용 한줄 노출</h1>
                    <h1>메모내용 한줄 노출</h1> <h1>메모내용 한줄 노출</h1>
                    <h1>메모내용 한줄 노출</h1>
                    <h1>메모내용 한줄 노출</h1>
                    <h1>메모내용 한줄 노출</h1>
                    <h1>메모내용 한줄 노출</h1> <h1>메모내용 한줄 노출</h1>
                    <h1>메모내용 한줄 노출</h1>
                    <h1>메모내용 한줄 노출</h1>
                    <h1>메모내용 한줄 노출</h1>
                    <h1>메모내용 한줄 노출</h1> <h1>메모내용 한줄 노출</h1>
                    <h1>메모내용 한줄 노출</h1>
                    <h1>메모내용 한줄 노출</h1>
                    <h1>메모내용 한줄 노출</h1>
                    <h1>메모내용 한줄 노출</h1>
                    <h1>메모내용 한줄 노출</h1>
                    <h1>메모내용 한줄 노출</h1> <h1>메모내용 한줄 노출</h1>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-fe">
              <ButtonR
                name={"취소"}
                onClick={() => setMemoPopup(false)}
                color={"white"}
                styleClass={"mr-8"}
              />
              {popupAdd === "view" && <ButtonR name={"변경"} onClick={() => setPopupAdd("edit")} />}
              {popupAdd !== "view" && <ButtonR name={"저장"} onClick={() => {}} />}
            </div>
          </div>
        </Modal>
      )}
      {customerLevelPopup && (
        <Modal innerStyle={{ width: "29%", minHeight: "0" }}>
          <div className="padding-24">
            <div className="flex justify-sb">
              <h2 className="margin-0 mb-20">등급변경</h2>

              <div>
                <img
                  onClick={() => {
                    setCustomerLevelPopup(false);
                  }}
                  src={close}
                  className="img-close cursor"
                  alt="close"
                />
              </div>
            </div>

            <div className="flex">
              <div className="flex1">
                <div className="product-field-wrapper mt-2">
                  <div className="product-field mr-20">
                    <p>현재 등급</p>
                  </div>

                  <p className="font-bold">Gold</p>
                </div>
              </div>
            </div>

            <div className="field-list-wrapper mt-2">
              <div className="product-field mr-20">
                <p>변경할 등급</p>
              </div>

              <div className="flex align-c pt-10 pb-10 flex1">
                <div className="absolute">
                  <SelectBox
                    // containerStyles={{ width: "100%" }}
                    placeholder="등급을 선택해 주세요"
                    value={selectedLevel}
                    options={MEMBERSHIP_LEVEL}
                    noOptionsMessage={""}
                    onChange={(e: any) => setSelectedLevel(e)}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-fe mt-20">
              <ButtonR
                name={"취소"}
                onClick={() => setCustomerLevelPopup(false)}
                color={"white"}
                styleClass={"mr-8"}
              />

              <ButtonR name={"저장"} onClick={() => {}} />
            </div>
          </div>
        </Modal>
      )}
      <div className="flex">
        <div className="flex1">
          <div className="product-field-wrapper mt-2">
            <div className="product-field mr-20">
              <p>닉네임/ID</p>
            </div>

            <p>행복한 물개(ews24s)</p>
          </div>

          <div className="product-field-wrapper mt-2">
            <div className="product-field mr-20">
              <p>가입 SNS 채널</p>
            </div>

            <p>카카오</p>
          </div>

          <div className="product-field-wrapper mt-2">
            <div className="product-field mr-20">
              <p>이름</p>
            </div>

            <p>김모노</p>
          </div>

          <div className="field-list-wrapper mt-2">
            <div className="product-field mr-20">
              <p>주소(기본배송지)</p>
            </div>

            <div className="flex1 pt-10 pb-10">
              <p>
                (30098) 세종특별자치시 보듬4로 20 10단지 호반베르디움 어반시티 아파트 101동 101{" "}
              </p>
            </div>
          </div>

          <div className="field-list-wrapper mt-2">
            <div className="product-field mr-20">
              <p>회원등급</p>
            </div>

            <div className="flex align-c flex1 pt-10 pb-10">
              <p className="mr-20">Gold</p>

              <ButtonR
                name="등급변경"
                color={"white"}
                onClick={() => setCustomerLevelPopup(true)}
              />
            </div>
          </div>

          <div className="field-list-wrapper mt-2">
            <div className="product-field mr-20">
              <p>총 주문금액</p>
              <p className="font-12 font-300">할인/적립금 사용금액 포함</p>
            </div>

            <div className="flex align-c flex1 pt-10 pb-10">
              <p>1,234,567</p>
            </div>
          </div>

          <div className="field-list-wrapper mt-2">
            <div className="product-field mr-20">
              <p>보유 쿠폰</p>
            </div>

            <div className="flex align-c flex1 pt-10 pb-10">
              <div>
                <p>사용가능한 쿠폰: 2장</p>
                <p className="mt-2">사용한 쿠폰: 10장</p>
                <p className="mt-2">사용기한 만료 쿠폰: 23장</p>
              </div>
            </div>
          </div>

          <div className="field-list-wrapper mt-2">
            <div className="product-field mr-20">
              <p>추천인 코드</p>
            </div>

            <div className="flex align-c flex1 pt-10 pb-10">
              <p>abcdefg23</p>
            </div>
          </div>

          <div className="field-list-wrapper mt-2">
            <div className="product-field mr-20">
              <p>휴면회원 처리일</p>
            </div>

            <div className="flex align-c flex1 pt-10 pb-10">
              <p>2024.01.01</p>
            </div>
          </div>
        </div>

        <div className="flex1">
          <div className="product-field-wrapper mt-2">
            <div className="product-field mr-20">
              <p>이메일</p>
            </div>

            <p>abcdefg@kakao.com</p>
          </div>

          <div className="product-field-wrapper mt-2">
            <div className="product-field mr-20">
              <p>가입일</p>
            </div>

            <p>2023.01.01</p>
          </div>

          <div className="product-field-wrapper mt-2">
            <div className="product-field mr-20">
              <p>휴대폰번호</p>
            </div>

            <p>010-1234-5678</p>
          </div>

          <div className="field-list-wrapper mt-2">
            <div className="product-field mr-20">
              <p>배송 메모</p>
            </div>

            <div className="flex align-c flex1 pt-10 pb-10">
              <p>부재시 경비실에 맡겨주세요</p>
            </div>
          </div>

          <div className="field-list-wrapper mt-2">
            <div className="product-field mr-20">
              <p>총 구매횟수</p>
            </div>

            <div className="flex align-c flex1 pt-10 pb-10">
              <p className="mr-20">12</p>
            </div>
          </div>

          <div className="field-list-wrapper mt-2">
            <div className="product-field mr-20">
              <p>총 실결제금액</p>
              <p className="font-12 font-300">할인/적립금 사용금액 제외</p>
            </div>

            <div className="flex align-c flex1 pt-10 pb-10">
              <p>1,234,567</p>
            </div>
          </div>

          <div className="field-list-wrapper mt-2">
            <div className="product-field mr-20">
              <p>보유 적립금</p>
            </div>

            <div className="flex align-c flex1 pt-10 pb-10">
              <p>1,234원</p>
            </div>
          </div>

          <div className="field-list-wrapper mt-2">
            <div className="product-field mr-20">
              <p>마지막 접속일시</p>
            </div>

            <div className="flex align-c flex1 pt-10 pb-10">
              <p>2023.01.01 11:11:11</p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-fe">
        <ButtonR
          name={"목록"}
          styleClass={"mr-8"}
          onClick={() => navigate("/customer/users")}
          color={"white"}
        />
        <ButtonR name={"탈퇴처리"} onClick={() => {}} color={"white"} />
      </div>

      <div className="mt-40">
        <div className="flex justify-sb align-c">
          <p className="font-bold font-16">
            회원메모 2<span className="font-400">건</span>
          </p>
          <ButtonR
            name={"메모 작성"}
            onClick={() => {
              setMemoPopup(true);
              setPopupAdd("add");
            }}
          />
        </div>

        <div className="list-header mt-10 pl-18 pr-18 text-center">
          <div className="w10p text-left">
            <p>번호</p>
          </div>

          <div className="w40p">
            <p>내용</p>
          </div>

          <div className="w15p">
            <p>작성자</p>
          </div>

          <div className="w25p">
            <p>작성일</p>
          </div>

          <div className="w10p">
            <p>기능</p>
          </div>
        </div>

        <div className="list-content pl-18 pr-18">
          <div className="flex align-c mt-8 mb-8 text-center">
            <div className="w10p text-left">
              <p>2</p>
            </div>

            <div className="w40p">
              <p>메모내용 한줄 노출</p>
            </div>

            <div className="w15p">
              <p>작성자</p>
            </div>

            <div className="w25p">
              <p>2023.07.19 11:11:11</p>
            </div>

            <div className="text-center w10p flex justify-c">
              <ButtonR
                name="상세"
                color="white"
                styles={{ marginRight: 4 }}
                onClick={() => {
                  setMemoPopup(true);
                  setPopupAdd("view");
                }}
                // onClick={() => navigate(`/site/main/bannertop/${aBanner._id}`)}
              />
              <ButtonR
                name="삭제"
                color="white"
                onClick={() => {}}
                // onClick={() => navigate(`/site/main/bannertop/${aBanner._id}`)}
              />
            </div>
          </div>
        </div>

        <div className="list-content pl-18 pr-18">
          <div className="flex align-c mt-8 mb-8 text-center">
            <div className="w10p text-left">
              <p>1</p>
            </div>

            <div className="w40p">
              <p>메모내용 한줄 노출</p>
            </div>

            <div className="w15p">
              <p>작성자</p>
            </div>

            <div className="w25p">
              <p>2023.07.19 11:11:11</p>
            </div>

            <div className="text-center w10p flex justify-c">
              <ButtonR
                name="상세"
                color="white"
                styles={{ marginRight: 4 }}
                onClick={() => {}}
                // onClick={() => navigate(`/site/main/bannertop/${aBanner._id}`)}
              />
              <ButtonR
                name="삭제"
                color="white"
                onClick={() => {}}
                // onClick={() => navigate(`/site/main/bannertop/${aBanner._id}`)}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const Tab2 = () => {
  return (
    <div>
      <div className="mt-40">
        <div className="flex justify-sb align-c">
          <p className="font-bold font-16">
            총 2<span className="font-400">건</span>
          </p>
        </div>

        <div className="list-header mt-10 pl-18 pr-18 text-center">
          <div className="w10p">
            <p>주문상태</p>
          </div>

          <div className="w10p">
            <p>주문번호</p>
          </div>

          <div className="w10p">
            <p>상품정보</p>
          </div>

          <div className="w10p">
            <p>주문자</p>
          </div>

          <div className="w10p">
            <p>쿠폰할인</p>
          </div>

          <div className="w10p">
            <p>적립금사용</p>
          </div>

          <div className="w10p">
            <p>실결제금액</p>
          </div>

          <div className="w10p">
            <p>결제수단</p>
          </div>

          <div className="w10p">
            <p>주문일시</p>
          </div>

          <div className="w10p">
            <p>주문채널</p>
          </div>
        </div>

        <div className="list-content pl-18 pr-18">
          <div className="flex align-c mt-12 mb-12 text-center">
            <div className="w10p pl-6 pr-6">
              <p>결제완료</p>
            </div>

            <div className="w10p pl-6 pr-6">
              <p>123456789010</p>
            </div>

            <div className="w10p pl-6 pr-6">
              <p>Seletti 하이브리드 푸르트...외 2건</p>
            </div>

            <div className="w10p pl-6 pr-6">
              <p>김모노(aff77h2r) Gold, 총 12건</p>
            </div>

            <div className="w10p pl-6 pr-6">
              <p>-12,234</p>
            </div>

            <div className="w10p pl-6 pr-6">
              <p>-12,234</p>
            </div>

            <div className="w10p pl-6 pr-6">
              <p>1,234,567</p>
            </div>

            <div className="w10p pl-6 pr-6">
              <p>네이버페이</p>
            </div>

            <div className="w10p pl-6 pr-6">
              <p>2023.01.01 11:11:22</p>
            </div>

            <div className="w10p pl-6 pr-6">
              <p>Mobile app</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Tab3 = () => {
  return (
    <div>
      <div className="mt-40">
        <div className="flex justify-sb align-c">
          <p className="font-bold font-16">
            총 2<span className="font-400">건</span>
          </p>
        </div>

        <div className="list-header mt-10 pl-18 pr-18 text-center">
          <div className="w20p">
            <p>쿠폰번호</p>
          </div>

          <div className="w20p">
            <p>쿠폰명</p>
          </div>

          <div className="w20p">
            <p>혜택</p>
          </div>

          <div className="w20p">
            <p>사용기간</p>
          </div>

          <div className="w20p">
            <p>상태</p>
          </div>
        </div>

        <div className="list-content pl-18 pr-18">
          <div className="flex align-c mt-12 mb-12 text-center">
            <div className="w20p pl-6 pr-6">
              <p>1234567890</p>
            </div>

            <div className="w20p pl-6 pr-6">
              <p>Seletti 5%</p>
            </div>

            <div className="w20p pl-6 pr-6">
              <p>5%</p>
            </div>

            <div className="w20p pl-6 pr-6">
              <p>2023.01.01 ~ 2023.02.01</p>
            </div>

            <div className="w20p pl-6 pr-6">
              <p>미사용</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Tab4 = () => {
  return (
    <div>
      <div className="mt-40">
        <div className="flex justify-sb align-c">
          <p className="font-bold font-16">
            총 2<span className="font-400">건</span>
          </p>
        </div>

        <div className="list-header mt-10 pl-18 pr-18 text-center">
          <div className="w10p">
            <p>일자</p>
          </div>

          <div className="w30p">
            <p>사유</p>
          </div>

          <div className="w10p">
            <p>변동금액</p>
          </div>

          <div className="w10p">
            <p>잔액</p>
          </div>

          <div className="w30p">
            <p>유효기간</p>
          </div>
          <div className="w10p">
            <p>유형</p>
          </div>
        </div>

        <div className="list-content pl-18 pr-18">
          <div className="flex align-c mt-12 mb-12 text-center">
            <div className="w10p pl-6 pr-6">
              <p>2023.01.01</p>
            </div>

            <div className="w30p pl-6 pr-6">
              <p>[구매적립] 주문(12345678) 1% 적립</p>
            </div>

            <div className="w10p pl-6 pr-6">
              <p>100</p>
            </div>

            <div className="w10p pl-6 pr-6">
              <p>1,500</p>
            </div>

            <div className="w30p pl-6 pr-6">
              <p>2023.01.01 23:59:59</p>
            </div>

            <div className="w10p pl-6 pr-6">
              <p>지급</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Tab5 = () => {
  return (
    <div>
      <div className="mt-40">
        <div className="flex justify-sb align-c">
          <p className="font-bold font-16">
            총 5<span className="font-400">건</span>
          </p>
        </div>

        <div className="list-header mt-10 pl-18 pr-18 text-center">
          <div className="w10p pl-6 pr-6">
            <p>번호</p>
          </div>

          <div className="w15p pl-6 pr-6">
            <p>게시판</p>
          </div>

          <div className="w25p text-left pl-6 pr-6">
            <p>상품정보</p>
          </div>

          <div className="w30p text-left pl-6 pr-6">
            <p>내용</p>
          </div>

          <div className="w20p pl-6 pr-6">
            <p>작성일</p>
          </div>
        </div>

        <div className="list-content pl-18 pr-18">
          <div className="flex align-c mt-12 mb-12 text-center">
            <div className="w10p pl-6 pr-6">
              <p>1</p>
            </div>

            <div className="w15p pl-6 pr-6">
              <p>입고요청</p>
            </div>

            <div className="w25p pl-6 pr-6 text-left">
              <p>Valentino Garavani Rockstud Tote Bag</p>
            </div>

            <div className="w30p pl-6 pr-6 text-left">
              <p className="text-line">
                너무 맛있어요. 여행갈떄마다 그 나라 초콜렛을 사먹어 봤는데, 요게 젤 맛있었어요. 너무
                맛있어요. 여행갈떄마다 그 나라 초콜렛을 사먹어 봤는데, 요게 젤 맛있었어요. 너무
                맛있어요. 여행갈떄마다 그 나라 초콜렛을 사먹어 봤는데, 요게 젤 맛있었어요. 너무
                맛있어요. 여행갈떄마다 그 나라 초콜렛을 사먹어 봤는데, 요게 젤 맛있었어요. 너무
                맛있어요. 여행갈떄마다 그 나라 초콜렛을 사먹어 봤는데, 요게 젤 맛있었어요. 너무
                맛있어요. 여행갈떄마다 그 나라 초콜렛을 사먹어 봤는데, 요게 젤 맛있었어요. 너무
                맛있어요. 여행갈떄마다 그 나라 초콜렛을 사먹어 봤는데, 요게 젤 맛있었어요. 너무
                맛있어요. 여행갈떄마다 그 나라 초콜렛을 사먹어 봤는데, 요게 젤 맛있었어요. 너무
                맛있어요. 여행갈떄마다 그 나라 초콜렛을 사먹어 봤는데, 요게 젤 맛있었어요. 너무
                맛있어요. 여행갈떄마다 그 나라 초콜렛을 사먹어 봤는데, 요게 젤 맛있었어요. 너무
                맛있어요. 여행갈떄마다 그 나라 초콜렛을 사먹어 봤는데, 요게 젤 맛있었어요. 너무
                맛있어요. 여행갈떄마다 그 나라 초콜렛을 사먹어 봤는데, 요게 젤 맛있었어요. 너무
                맛있어요. 여행갈떄마다 그 나라 초콜렛을 사먹어 봤는데, 요게 젤 맛있었어요.
              </p>
            </div>

            <div className="w20p pl-6 pr-6">
              <p>2023.01.01 11:11:22</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
