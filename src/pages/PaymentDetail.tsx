import React, { memo, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ButtonR from "../components/ButtonR";
import Modal from "../components/Modal";
import SelectBox from "../components/SelectBox";
import close from "../images/close.png";
import forward from "../images/Forward.png";
import { postCollection, putUpdateData } from "../common/apis";
import { currency, timeFormat1, timeFormat2 } from "../common/utils";
import DaumPostcode from "react-daum-postcode";
import InputR from "../components/InputR";

export default function PaymentDetail(): JSX.Element {
  const navigate = useNavigate();
  const { paymentId } = useParams();
  const [user, setUser] = useState<any>({});
  const [memos, setMemos] = useState<any>([]);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    // const { data }: any = await getUsers({
    //   collection: "users",
    //   find: { _id: userId },
    // });
    // const memoData: any = await getDatas({
    //   collection: "customerMemos",
    //   find: { targetUserId: userId },
    // });
    // setMemos(memoData?.data);
    // setUser(data[0] ? data[0] : {});
  };

  return (
    <div>
      <div className="flex align-c">
        <img onClick={() => navigate(-1)} className="img-close cursor mr-4" src={forward} />
        <p className="page-title mt-3">주문상세</p>
      </div>

      {/* 컨텐츠 */}
      <div className="mt-30 mb-30">
        <Tab1 navigate={navigate} user={user} init={init} memos={memos} />
      </div>
    </div>
  );
}

const Tab1 = ({ navigate, user, init, memos }: any) => {
  const [memoPopup, setMemoPopup] = useState<boolean>(false);
  const [popupAdd, setPopupAdd] = useState<string>("");
  const [memoContents, setMemoContents] = useState<string>("");
  const [editMemoId, setEditMemoId] = useState<string>("");
  const [personalCustomCodePopup, setPersonalCustomCode] = useState<boolean>(false);
  const [editAddressPopup, setEditAddressPopup] = useState<boolean>(false);
  const [openPostcode, setOpenPostcode] = React.useState<boolean>(false);
  const [address, setAddress] = useState<any>({
    zonecode: "30098",
    address: "세종특별자치시 보듬4로 20 10단지 호반베르디움 어반시티 아파트",
    restAddress: "101동 101호",
  });

  const handle = {
    // 버튼 클릭 이벤트
    clickButton: () => {
      setOpenPostcode((current) => !current);
    },

    // 주소 선택 이벤트
    selectAddress: (data: any) => {
      console.log(data);
      setAddress(data);
      setOpenPostcode(false);
    },
  };

  const handleSaveCustomerMemo = async () => {
    if (popupAdd === "add") {
      const body = {
        collection: "customerMemos",
        targetUserId: user._id,
        contents: memoContents,
      };

      const postResult = await postCollection(body);
      if (postResult.status === 200) {
        alert("메모 등록이 완료되었습니다.");
      }
    }

    if (popupAdd === "edit") {
      const body = {
        collection: "customerMemos",
        _id: editMemoId,
        contents: memoContents,
      };

      const updateResult: any = await putUpdateData(body);
      if (updateResult.status === 200) {
        alert("메모 수정이 완료되었습니다.");
      }
    }

    setMemoPopup(false);
    setMemoContents("");
    init();
  };

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

                  <p>
                    {user.nickname} ({user.kakaoId})
                  </p>
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
                    value={memoContents}
                    onChange={(e: any) => setMemoContents(e.target.value)}
                    className="input-textarea"
                    style={{ height: 200 }}
                    placeholder="내용을 입력해 주세요"
                  />
                )}

                {popupAdd === "view" && (
                  <div>
                    <p>
                      {memoContents.split("\n").map((line) => {
                        return (
                          <span>
                            {line}
                            <br />
                          </span>
                        );
                      })}
                    </p>
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
              {popupAdd !== "view" && <ButtonR name={"저장"} onClick={handleSaveCustomerMemo} />}
            </div>
          </div>
        </Modal>
      )}
      {editAddressPopup && (
        <Modal
          innerStyle={{
            display: "flex",
            flexDirection: "column",
            width: "30%",
            minHeight: "20vh",
            padding: 30,
          }}
        >
          <div className="flex justify-sb align-c relative">
            <h2 className="margin-0">배송지 수정</h2>
            <img
              onClick={() => setEditAddressPopup(false)}
              src={close}
              style={{ width: 24, top: -10, right: -10 }}
              className="cursor absolute"
            />
          </div>

          {!openPostcode && (
            <div>
              <div className="flex mt-20 justify-sb">
                <div className="w20p">
                  <ButtonR
                    name={"주소찾기"}
                    color="white"
                    styles={{ width: "100%", marginRight: 10 }}
                    onClick={() => setOpenPostcode(true)}
                  />
                </div>

                <div
                  className="w80p flex align-c"
                  style={{
                    border: "1px solid #979797",
                    backgroundColor: "#e8e8e8",
                    color: "rgba(0,0,0,0.4)",
                    padding: "0 10px",
                    fontSize: 14,
                    flex: "none",
                    marginLeft: 10,
                  }}
                >
                  {address?.zonecode}
                </div>
              </div>

              <div
                className="mt-8"
                style={{
                  border: "1px solid #979797",
                  backgroundColor: "#e8e8e8",
                  color: "rgba(0,0,0,0.4)",
                  padding: "8px 10px",
                  fontSize: 14,
                  flex: "none",
                }}
              >
                {address?.address}
              </div>

              <InputR
                value={address.restAddress}
                onChange={(e: any) =>
                  setAddress((prev: any) => {
                    return {
                      ...prev,
                      restAddress: e.target.value,
                    };
                  })
                }
                size="full"
                styleClass={"mt-8"}
              />
            </div>
          )}
          {openPostcode && (
            <div className="mt-10">
              <DaumPostcode
                onComplete={handle.selectAddress} // 값을 선택할 경우 실행되는 이벤트
                autoClose={false} // 값을 선택할 경우 사용되는 DOM을 제거하여 자동 닫힘 설정
                defaultQuery="" // 팝업을 열때 기본적으로 입력되는 검색어
              />
            </div>
          )}

          <div className="flex justify-fe mt-20">
            <ButtonR
              color={"white"}
              name="취소"
              onClick={() => setEditAddressPopup(false)}
              styleClass="mr-4"
            />
            <ButtonR name="저장" onClick={() => {}} />
          </div>
        </Modal>
      )}
      {personalCustomCodePopup && (
        <Modal
          innerStyle={{
            display: "flex",
            flexDirection: "column",
            width: "30%",
            minHeight: "20vh",
            padding: 30,
          }}
        >
          <div className="flex justify-sb align-c relative">
            <h2 className="margin-0">개인통관고유부호 수정</h2>
            <img
              onClick={() => setPersonalCustomCode(false)}
              src={close}
              style={{ width: 24, top: -10, right: -10 }}
              className="cursor absolute"
            />
          </div>

          <div className="flex1 flex mt-20">
            <div className="flex1">
              <p>이름</p>
            </div>
            <div style={{ flex: 2 }}>
              <p>김모노</p>
            </div>
          </div>
          <div className="flex1 flex mt-10">
            <div className="flex1">
              <p>연락처</p>
            </div>
            <div style={{ flex: 2 }}>
              <p>010-1234-5678</p>
            </div>
          </div>
          <div className="flex1 flex mt-10">
            <div className="flex1">
              <p>개인통관고유부호</p>
            </div>
            <div style={{ flex: 2 }}>
              <InputR value={"P1234567890123"} size={"full"} />
              <div className="mt-4"></div>
              <p className="font-12 font-green">올바른 개인통관고유부호입니다</p>
            </div>
          </div>

          <div className="flex justify-fe mt-20">
            <ButtonR
              color={"white"}
              name="취소"
              onClick={() => setPersonalCustomCode(false)}
              styleClass="mr-4"
            />
            <ButtonR name="저장" onClick={() => {}} />
          </div>
        </Modal>
      )}
      <p className="font-category">주문정보</p>
      <div className="flex mt-13">
        <div className="flex1">
          <div className="product-field-wrapper mt-2">
            <div className="product-field mr-20">
              <p>주문번호</p>
            </div>

            <p>12345678</p>
          </div>

          <div className="product-field-wrapper mt-2">
            <div className="product-field mr-20">
              <p>주문상태</p>
            </div>
            <p className="font-bold">결제완료</p>
          </div>

          <div className="product-field-wrapper mt-2">
            <div className="product-field mr-20">
              <p>결제수단</p>
            </div>

            <p>신용/체크카드</p>
          </div>

          <div className="field-list-wrapper mt-2">
            <div className="product-field mr-20">
              <p>원주문 내역</p>
            </div>

            <div className="flex1 pt-10 pb-10" style={{ paddingRight: 20 }}>
              <p>
                [판매가합계]800,000원 + [배송비]40,000원 - [쿠폰할인]40,000원 - [적립금]20,000원 =
                780,000원
              </p>
            </div>
          </div>

          <div className="field-list-wrapper mt-2">
            <div className="product-field mr-20">
              <p>할인정보</p>
            </div>

            <div className="flex1 pt-10 pb-10" style={{ paddingRight: 20 }}>
              <p>[쿠폰할인]40,000원 / [적립금]20,000원</p>
            </div>
          </div>

          <div className="field-list-wrapper mt-2">
            <div className="product-field mr-20">
              <p>배송유형</p>
            </div>

            <div className="flex align-c flex1 pt-10 pb-10">
              <p>해외배송</p>
            </div>
          </div>

          <div className="field-list-wrapper mt-2">
            <div className="product-field mr-20">
              <p>주문자 정보</p>
            </div>

            <div className="flex1 pt-10 pb-10">
              <div className="flex align-c">
                <p style={{ width: 60 }}>이름</p>
                <p>안혜수</p>
              </div>

              <div className="flex align-c mt-4">
                <p style={{ width: 60 }}>연락처</p>
                <p>010-1234-1234</p>
              </div>

              <div className="flex align-c mt-4">
                <p style={{ width: 60 }}>이메일</p>
                <p>ahnhs719@gmail.com</p>
              </div>
            </div>
          </div>

          <div className="field-list-wrapper mt-2">
            <div className="product-field mr-20">
              <p>배송지 정보</p>
            </div>

            <div className="flex1 pt-10 pb-10" style={{ paddingRight: 20 }}>
              <div className="flex align-c">
                <p style={{ width: 200 }}>이름</p>
                <p>안혜수</p>
              </div>

              <div className="flex align-c mt-4">
                <p style={{ width: 200 }}>연락처</p>
                <p>010-1234-1234</p>
              </div>

              <div className="flex align-c mt-4">
                <p style={{ width: 200 }}>
                  개인통관고유부호
                  <span
                    onClick={() => setPersonalCustomCode(true)}
                    className="ml-4 font-blue text-underline cursor"
                  >
                    수정
                  </span>
                </p>

                <p>ahnhs719@gmail.com</p>
              </div>

              <div className="flex mt-4">
                <div style={{ width: 200, flex: "none" }}>
                  <p>
                    배송지
                    <span
                      onClick={() => setEditAddressPopup(true)}
                      className="ml-4 font-blue text-underline cursor"
                    >
                      수정
                    </span>
                  </p>
                </div>
                <div>
                  <p>
                    ({address.zonecode}) {address.address} {address.restAddress}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex1">
          <div className="product-field-wrapper mt-2">
            <div className="product-field mr-20">
              <p>주문일시</p>
            </div>

            <p>2023.08.01 21:21:21</p>
          </div>

          <div className="product-field-wrapper mt-2">
            <div className="product-field mr-20">
              <p>주문채널</p>
            </div>

            <p>mobile app</p>
          </div>

          <div className="product-field-wrapper mt-2">
            <div className="product-field mr-20">
              <p>결제정보</p>
            </div>

            <p>롯데 / 3762 - **** - **** - ****</p>
          </div>

          <div className="field-list-wrapper mt-2">
            <div className="product-field mr-20">
              <p>적립정보</p>
            </div>

            <div className="flex align-c flex1 pt-10 pb-10">
              <p>[적립금] 78,000원</p>
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
        <ButtonR name={"주문취소"} styleClass={"mr-8"} onClick={() => {}} color={"white"} />
        <ButtonR name={"상품준비"} styleClass={"mr-8"} onClick={() => {}} color={"white"} />
        <ButtonR name={"배송완료"} styleClass={"mr-8"} onClick={() => {}} color={"white"} />
        <ButtonR name={"주문확인"} onClick={() => {}} />
      </div>

      {/* 주문상품 */}
      <div className="mt-40">
        <div className="flex justify-sb align-c">
          <p className="font-bold font-16">
            주문상품 {memos.length}
            <span className="font-400">건</span>
          </p>
        </div>

        <div className="list-header mt-10 pl-18 pr-18 text-center">
          <div className="w10p text-left">
            <p>상품코드</p>
          </div>

          <div className="w40p">
            <p>상품명</p>
          </div>

          <div className="w10p">
            <p>옵션명</p>
          </div>

          <div className="w10p">
            <p>판매가</p>
          </div>

          <div className="w10p">
            <p>쿠폰할인</p>
          </div>
          <div className="w10p">
            <p>배송비</p>
          </div>
          <div className="w10p">
            <p>구매수량</p>
          </div>
        </div>

        <div className="list-content pl-18 pr-18">
          <div className="flex align-c mt-8 mb-8 text-center">
            <div className="w10p text-left">
              <p>12345678</p>
            </div>

            <div className="w40p">
              <p className="text-line">Seletti 하이브리드 푸르트 볼그릇1</p>
            </div>

            <div className="w10p">
              <p>small</p>
            </div>

            <div className="w10p">
              <p>{currency(200000)}</p>
            </div>
            <div className="w10p">
              <p>{currency(-100000)}</p>
            </div>

            <div className="w10p">
              <p>{currency(4500)}</p>
            </div>
            <div className="w10p">
              <p>2</p>
            </div>
          </div>
        </div>

        <div className="list-content pl-18 pr-18">
          <div className="flex align-c mt-8 mb-8 text-center">
            <div className="w10p text-left">
              <p>12345678</p>
            </div>

            <div className="w40p">
              <p className="text-line">Seletti 하이브리드 푸르트 볼그릇1</p>
            </div>

            <div className="w10p">
              <p>small</p>
            </div>

            <div className="w10p">
              <p>{currency(200000)}</p>
            </div>
            <div className="w10p">
              <p>{currency(-100000)}</p>
            </div>

            <div className="w10p">
              <p>{currency(4500)}</p>
            </div>
            <div className="w10p">
              <p>2</p>
            </div>
          </div>
        </div>

        <div className="list-content pl-18 pr-18">
          <div className="flex align-c mt-8 mb-8 text-center">
            <div className="w10p text-left">
              <p>12345678</p>
            </div>

            <div className="w40p">
              <p className="text-line">Seletti 하이브리드 푸르트 볼그릇1</p>
            </div>

            <div className="w10p">
              <p>small</p>
            </div>

            <div className="w10p">
              <p>{currency(200000)}</p>
            </div>
            <div className="w10p">
              <p>{currency(-100000)}</p>
            </div>

            <div className="w10p">
              <p>{currency(4500)}</p>
            </div>
            <div className="w10p">
              <p>2</p>
            </div>
          </div>
        </div>
      </div>

      {/* CS상담메모 */}
      <div className="mt-40">
        <div className="flex justify-sb align-c">
          <p className="font-bold font-16">CS상담메모</p>
          <ButtonR
            color={"white"}
            name={"메모 추가"}
            onClick={() => {
              setMemoPopup(true);
              setMemoContents("");
              setPopupAdd("add");
            }}
          />
        </div>

        <div className="list-header mt-10 pl-18 pr-18 text-center">
          <div className="w10p text-left">
            <p>구분</p>
          </div>

          <div className="w40p">
            <p>접수제목</p>
          </div>

          <div className="w10p">
            <p>상담사</p>
          </div>

          <div className="w15p">
            <p>접수일자</p>
          </div>

          <div className="w10p">
            <p>진행상태</p>
          </div>
          <div className="w15p">
            <p>완료일자</p>
          </div>
        </div>

        {memos.map((aMemo: any, i: number) => (
          <div key={i} className="list-content pl-18 pr-18">
            <div className="flex align-c mt-8 mb-8 text-center">
              <div className="w10p text-left">
                <p>{i + 1}</p>
              </div>

              <div className="w40p">
                <p className="text-line">{aMemo.contents}</p>
              </div>

              <div className="w15p">
                <p>작성자</p>
              </div>

              <div className="w25p">
                <p>{timeFormat1(aMemo.created)}</p>
              </div>

              <div className="text-center w10p flex justify-c">
                <ButtonR
                  name="상세"
                  color="white"
                  styles={{ marginRight: 4 }}
                  onClick={() => {
                    setMemoPopup(true);
                    setMemoContents(aMemo.contents);
                    setPopupAdd("view");
                    setEditMemoId(aMemo._id);
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
        ))}
      </div>
    </>
  );
};
