import React, { ChangeEvent, memo, useCallback, useEffect, useRef, useState } from "react";
import _ from "lodash";
import moment from "moment";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ButtonR from "../components/ButtonR";
import Modal from "../components/Modal";
import SelectBox from "../components/SelectBox";
import close from "../images/close.png";
import forward from "../images/Forward.png";
import {
  deleteData,
  getDatas,
  getValidCheckCustomCode,
  postCollection,
  putUpdateData,
} from "../common/apis";
import { currency, timeFormat1, timeFormat2 } from "../common/utils";
import DaumPostcode from "react-daum-postcode";
import InputR from "../components/InputR";
import { CustomSelectbox } from "../components/CustomSelectbox";
import { useInput, usePriceInput } from "../hooks/useInput";
import OrderCancelPopup from "../components/OrderCancelPopup";

const CS_ORDER_PATH = [
  {
    value: "마이잇태리",
    label: "마이잇태리",
  },
  {
    value: "채팅상담",
    label: "채팅상담",
  },
  {
    value: "1:1 문의",
    label: "1:1 문의",
  },
  {
    value: "기타",
    label: "기타",
  },
];

const CS_MEMO_PATH = [
  { label: "채팅상담", value: "채팅상담" },
  { label: "1:1 문의", value: "1:1 문의" },
];

const CANCEL_REASON = [
  {
    value: "[고객신청] 단순 변심",
    label: "[고객신청] 단순 변심",
  },
  {
    value: "[고객신청] 주문 실수",
    label: "[고객신청] 주문 실수",
  },
  {
    value: "[고객신청] 배송 지연",
    label: "[고객신청] 배송 지연",
  },
  {
    value: "[고객신청] 서비스 불만족",
    label: "[고객신청] 서비스 불만족",
  },
  {
    value: "[고객신청] 기타",
    label: "[고객신청] 기타",
  },
  {
    value: "[본사신청] 품절",
    label: "[본사신청] 품절",
  },
  {
    value: "[본사신청] 기타",
    label: "[본사신청] 기타",
  },
];

const DELAY_REASON = [
  {
    value: "품절 - 재고확보중",
    label: "품절 - 재고확보중",
  },
  {
    value: "교환출고",
    label: "교환출고",
  },
  {
    value: "예약주문/주문제작",
    label: "예약주문/주문제작",
  },
  {
    value: "연휴 배송마감",
    label: "연휴 배송마감",
  },
];

export default function PaymentDetail(): JSX.Element {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [memoPopup, setMemoPopup] = useState<boolean>(false);
  const [popupAdd, setPopupAdd] = useState<string>("");
  const [editMemoId, setEditMemoId] = useState<string>("");
  const [personalCustomCodePopup, setPersonalCustomCodePopup] = useState<boolean>(false);
  const [personalCustomCode, setPersonalCustomCode] = useState<string>("");
  const [editAddressPopup, setEditAddressPopup] = useState<boolean>(false);
  const [openPostcode, setOpenPostcode] = React.useState<boolean>(false);
  const [address, setAddress] = useState<any>({
    zonecode: "30098",
    address: "세종특별자치시 보듬4로 20 10단지 호반베르디움 어반시티 아파트",
    restAddress: "101동 101호",
  });
  const [orderCancelPopup, setOrderCancelPopup] = useState<boolean>(false);
  const [txtLength, setTxtLength] = useState(0);
  const [orderStatusPopup, setOrderStatusPopup] = useState<string>("");
  const [selectedDelayReason, setSelectedDelayReason] = useState<any>({});
  const [csMemo, setCsMemo] = useState<any>({
    csPath: {},
    memo: "",
    process: "N",
  });
  const [orderInfo, setOrderInfo] = useState<any>({});
  const [orderInfoCopy, setOrderInfoCopy] = useState<any>({});
  const [csInfo, setCsInfo] = useState<any>([]);
  const [csMemos, setCsMemos] = useState<any>([]);

  // 주문취소처리 폼
  const [cancelForm, setCancelForm] = useState<any>({});
  const [{ cancelCouponPrice, cancelRewardPrice }, onChangePrice, resetPrice] = usePriceInput({
    cancelCouponPrice: "",
    cancelRewardPrice: "",
  });
  const [{ delayReason, trackingNumber }, delayReasonLength, onChange, resetInput, handleSetInput] =
    useInput(
      {
        delayReason: "",
        trackingNumber: "",
      },
      200
    );

  const handle = {
    // 버튼 클릭 이벤트
    clickButton: () => {
      setOpenPostcode((current) => !current);
    },

    // 주소 선택 이벤트
    selectAddress: (data: any) => {
      setAddress(data);
      setOpenPostcode(false);
    },
  };

  const handleSaveCustomerMemo = async () => {
    if (popupAdd === "add") {
      const body = {
        collection: "csMemos",
        targetOrderId: orderId,
        targetCsId: csInfo[0]?._id,
        memo: csMemo.memo,
        process: csMemo.process,
        path: csMemo.csPath.value,
      };
      const postResult = await postCollection(body);
      if (postResult.status === 200) {
        alert("메모 등록이 완료되었습니다.");
      }
    }
    if (popupAdd === "edit") {
      const body = {
        collection: "csMemos",
        _id: editMemoId,
        targetOrderId: orderId,
        targetCsId: csInfo[0]?._id,
        memo: csMemo.memo,
        process: csMemo.process,
        path: csMemo.csPath.value,
      };
      const updateResult: any = await putUpdateData(body);
      if (updateResult.status === 200) {
        alert("메모 수정이 완료되었습니다.");
      }
    }
    setMemoPopup(false);

    init();
  };

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    const { data }: any = await getDatas({
      collection: "orders",
      find: { _id: orderId },
    });

    const csData: any = await getDatas({
      collection: "customerService",
      find: { orderId: orderId },
    });

    if (csData.data.length !== 0) {
      const csMemoData: any = await getDatas({
        collection: "csMemos",
        find: { targetOrderId: orderId, targetCsId: csData.data[0]?._id },
      });

      setCsMemos(csMemoData?.data);
    }

    setCsInfo(csData.data);
    setOrderInfoCopy(_.cloneDeep(data[0]));
    setOrderInfo(data[0]);
    setPersonalCustomCode(data[0]?.deliveryAddressInfo?.personalCustomCode);
    setAddress({
      zonecode: data[0]?.address?.zonecode,
      address: data[0]?.address?.address,
      restAddress: data[0]?.address?.restAddress,
    });

    handleSetInput("trackingNumber", data[0]?.trackingNumber);
  };

  const handleValidCustomCode = () => {
    let regText = /^(p|P)[0-9]{12}$/;
    if (!regText.exec(personalCustomCode)) {
      return false;
    }

    return true;
  };

  const handleDeleteMemo = async (_id: string) => {
    const deleteResult: any = await deleteData({
      collection: "csMemos",
      _id,
    });

    alert("해당 메모가 삭제되었습니다.");
    init();
  };

  const handleSetAddress = async () => {
    const updateAddress: any = await putUpdateData({
      collection: "orders",
      _id: orderId,
      address,
      deliveryAddressInfo: {
        ...orderInfo.deliveryAddressInfo,
        address: `(${address.zonecode}) ${address.address} ${address.restAddress}`,
      },
    });

    setEditAddressPopup(false);
    init();
  };

  const handlePostCancelOrder = async () => {
    // 1. CS정보 post하기
    // 수량이 1개가 아닌 경우 =>
    // 2. orderInfo에서 취소할 물건의 status === "cancel"로 변경하기
    // 3. 그 외 필요한 취소정보 update하기
    // 4. 쿠폰 취소
  };

  const setProductQuantityRange = (index: number) => {
    const range = [];
    for (let i = 1; i < parseInt(orderInfoCopy.orderedProduct[index]?.quantity + 1); i++) {
      range.push({
        label: i,
        value: i,
      });
    }

    return range;
  };

  const handleOrderStatusUpdate = async (status: string) => {
    const update = await putUpdateData({
      collection: "orders".toString(),
      _id: orderId,
      // tid: "testId",
      orderStatus: status,
      delayType: selectedDelayReason.value ? selectedDelayReason.value : "",
      delayReason: delayReason !== "" ? delayReason : "",
    });

    setOrderStatusPopup("");
    setSelectedDelayReason({});
    resetInput();

    if (update) {
      alert("배송 상태가 변경되었습니다.");
    }

    init();
  };

  const countDelayDays = () => {
    const today: any = new Date();
    const orderDate: any = new Date(orderInfo.orderDate);
    const gapNum: any = today - orderDate - 86400000;

    const delayDays = Math.ceil(gapNum / (1000 * 60 * 60 * 24));

    return delayDays;
  };

  const handleAddDeliveryAccount = async (): Promise<void> => {
    const check = /^[0-9]+$/;
    if (!check.test(trackingNumber)) {
      return alert("숫자만 입력해 주세요.");
    }

    const update = await putUpdateData({
      collection: "orders".toString(),
      _id: orderId,
      trackingNumber,
      orderStatus: "배송중",
      delayReason: "",
      delayType: "",
    });

    init();
  };

  return (
    <div>
      <div className="flex align-c">
        <img onClick={() => navigate(-1)} className="img-close cursor mr-4" src={forward} />
        <p className="page-title mt-3">주문상세</p>
      </div>

      {/* 컨텐츠 */}
      <div className="mt-30 mb-30">
        {memoPopup && (
          <Modal innerStyle={{ width: "60%", minHeight: "0" }}>
            <div className="padding-24">
              <div className="flex justify-sb">
                <h2 className="margin-0 mb-20">CS 상담메모 추가</h2>

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
                      <p>주문번호</p>
                    </div>

                    <p>{orderInfo.orderNo}</p>
                  </div>
                  <div className="product-field-wrapper mt-2">
                    <div className="product-field mr-20">
                      <p>상담경로</p>
                    </div>

                    <div>
                      <CustomSelectbox
                        selected={csMemo.csPath}
                        setSelected={(e: any) => {
                          setCsMemo((prev: any) => ({
                            ...prev,
                            csPath: e,
                          }));
                        }}
                        data={CS_MEMO_PATH}
                        noDataMessage={"상담경로 선택"}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex1">
                  <div className="field-list-wrapper mt-2">
                    <div className="product-field mr-20">
                      <p>상담사</p>
                    </div>

                    <div className="flex align-c flex1 pt-10 pb-10">
                      <p>관리자</p>
                    </div>
                  </div>
                  <div className="field-list-wrapper mt-2">
                    <div className="product-field mr-20">
                      <p>접수일시</p>
                    </div>

                    <div className="flex align-c flex1 pt-10 pb-10">
                      <p>{popupAdd === "view" ? timeFormat1(csMemo.created) : "-"}</p>
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
                      value={csMemo.memo}
                      onChange={(e: any) => {
                        setCsMemo((prev: any) => ({
                          ...prev,
                          memo: e.target.value,
                        }));
                      }}
                      className="input-textarea"
                      style={{ height: 200 }}
                      placeholder="내용을 입력해 주세요"
                    />
                  )}

                  {popupAdd === "view" && (
                    <div>
                      <p>
                        {csMemo.memo?.split("\n").map((line: any) => {
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

              <div className="flex">
                <div className="flex1">
                  <div className="product-field-wrapper mt-2">
                    <div className="product-field mr-20">
                      <p>처리여부</p>
                    </div>

                    <div className="flex align-c mr-20">
                      <div className="checkbox-c mr-4 cursor">
                        {csMemo.process === "N" && <div className="checkbox-c-filled"></div>}
                      </div>
                      {
                        <p
                          className="cursor"
                          onClick={() => {
                            setCsMemo((prev: any) => ({
                              ...prev,
                              process: "N",
                            }));
                          }}
                        >
                          처리 전(N)
                        </p>
                      }
                    </div>
                    <div className="flex align-c">
                      <div className="checkbox-c mr-4 cursor">
                        {csMemo.process === "Y" && <div className="checkbox-c-filled"></div>}
                      </div>
                      <p
                        className="cursor"
                        onClick={() => {
                          setCsMemo((prev: any) => ({
                            ...prev,
                            process: "Y",
                          }));
                        }}
                      >
                        처리 후(Y)
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex1">
                  <div className="field-list-wrapper mt-2">
                    <div className="product-field mr-20">
                      <p>처리완료일</p>
                    </div>

                    <div className="flex align-c flex1 pt-10 pb-10">
                      <p>
                        {popupAdd === "view" && csMemo.completed
                          ? timeFormat1(csMemo.completed)
                          : "-"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-fe">
                <ButtonR
                  name={"취소"}
                  onClick={() => setMemoPopup(false)}
                  color={"white"}
                  styleClass={"mr-8"}
                />
                {popupAdd === "view" && (
                  <ButtonR name={"변경"} onClick={() => setPopupAdd("edit")} />
                )}
                {popupAdd !== "view" && <ButtonR name={"저장"} onClick={handleSaveCustomerMemo} />}
              </div>
            </div>
          </Modal>
        )}

        {/* 배송지 수정 팝업 */}
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

                  <div className="w80p flex align-c postcode-zonecode pr-10 pl-10 ml-10">
                    {address?.zonecode}
                  </div>
                </div>

                <div className="mt-8 postcode-zonecode" style={{ padding: "8px 10px" }}>
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
                onClick={() => {
                  setEditAddressPopup(false);
                  setAddress({
                    zonecode: orderInfo?.address.zonecode,
                    address: orderInfo?.address.address,
                    restAddress: orderInfo?.address.restAddress,
                  });
                }}
                styleClass="mr-4"
              />
              <ButtonR name="저장" onClick={handleSetAddress} />
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
                onClick={() => setPersonalCustomCodePopup(false)}
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
                <InputR
                  value={personalCustomCode}
                  onChange={(e: any) => setPersonalCustomCode(e.target.value)}
                  size={"full"}
                />
                <div className="mt-4"></div>
                {handleValidCustomCode() ? (
                  <p className="font-12 font-green">올바른 개인통관고유부호입니다</p>
                ) : (
                  <p className="font-12 font-red">
                    P로 시작하는 개인통관고유부호 13자리를 입력해주세요.
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-fe mt-20">
              <ButtonR
                color={"white"}
                name="취소"
                onClick={() => setPersonalCustomCodePopup(false)}
                styleClass="mr-4"
              />
              <ButtonR
                name="저장"
                onClick={() => {
                  if (!handleValidCustomCode())
                    return alert("개인통관고유부호를 정확히 입력해 주세요.");

                  setPersonalCustomCodePopup(false);
                }}
              />
            </div>
          </Modal>
        )}
        {orderStatusPopup === "주문확인" && (
          <Modal
            innerStyle={{
              display: "flex",
              justifyContent: "space-between",
              flexDirection: "column",
              width: "20%",
              minHeight: "15vh",
              padding: 30,
            }}
          >
            <div className="flex justify-sb align-c f-direction-column">
              <p className="font-16">주문 확인처리 하시겠습니까?</p>
              <p className="font-16 mt-8">처리 시 배송준비중으로 변경됩니다.</p>
            </div>
            <div className="flex justify-c mt-20">
              <ButtonR
                color={"white"}
                name="취소"
                onClick={() => setOrderStatusPopup("")}
                styleClass="mr-10"
              />
              <ButtonR name="저장" onClick={() => handleOrderStatusUpdate("배송준비")} />
            </div>
          </Modal>
        )}
        {orderStatusPopup === "상품준비" && (
          <Modal
            innerStyle={{
              display: "flex",
              justifyContent: "space-between",
              flexDirection: "column",
              width: "30%",
              minHeight: "20vh",
              padding: 30,
            }}
          >
            <div className="flex justify-sb align-c relative">
              <h2 className="margin-0">상품준비(미출고) 처리</h2>
              <img
                onClick={() => {
                  setOrderStatusPopup("");
                  setSelectedDelayReason({});
                  resetInput();
                }}
                src={close}
                style={{ width: 24, top: -10, right: -10 }}
                className="cursor absolute"
              />
            </div>

            <div className="flex flex-wrap mt-12">
              <div className="w100p">
                <div className="field-list-wrapper mt-2">
                  <div className="product-field mr-20">
                    <p>미출고 사유</p>
                  </div>

                  <div className="flex1 pt-10 pb-10 relative">
                    <CustomSelectbox
                      selected={selectedDelayReason}
                      setSelected={setSelectedDelayReason}
                      data={DELAY_REASON}
                      noDataMessage={"지연사유 선택"}
                    />
                    <div className="mt-8 flex1 relative">
                      <textarea
                        className="input-textarea"
                        placeholder="200자 이내로 입력해주세요"
                        value={delayReason}
                        onChange={(e) => onChange("delayReason", e)}
                      />
                      <div
                        className="font-12"
                        style={{
                          position: "absolute",
                          bottom: 10,
                          right: 10,
                          fontWeight: 400,
                          color: "rgba(0,0,0,0.4)",
                        }}
                      >
                        {delayReasonLength.delayReason}/200
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-c mt-20">
              <ButtonR
                color={"white"}
                name="취소"
                onClick={() => setOrderStatusPopup("")}
                styleClass="mr-10"
              />
              <ButtonR name="저장" onClick={() => handleOrderStatusUpdate("상품준비")} />
            </div>
          </Modal>
        )}
        {orderCancelPopup && (
          <OrderCancelPopup
            setOrderCancelPopup={setOrderCancelPopup}
            resetPrice={resetPrice}
            orderInfo={orderInfo}
            setOrderInfo={setOrderInfo}
            cancelForm={cancelForm}
            setCancelForm={setCancelForm}
            txtLength={txtLength}
            setTxtLength={setTxtLength}
            setProductQuantityRange={setProductQuantityRange}
            onChangePrice={onChangePrice}
            cancelCouponPrice={cancelCouponPrice}
            cancelRewardPrice={cancelRewardPrice}
            handleResetPopup={() => {}}
          />
        )}
        {orderStatusPopup === "배송완료" && (
          <Modal
            innerStyle={{
              display: "flex",
              justifyContent: "space-between",
              flexDirection: "column",
              width: "20%",
              minHeight: "15vh",
              padding: 30,
            }}
          >
            <div className="flex justify-sb align-c f-direction-column">
              <p className="font-16">배송완료 하시겠습니까?</p>
              <p className="font-16 mt-8">처리 시 배송완료 상태로 변경됩니다.</p>
            </div>
            <div className="flex justify-c mt-20">
              <ButtonR
                color={"white"}
                name="취소"
                onClick={() => setOrderStatusPopup("")}
                styleClass="mr-10"
              />
              <ButtonR name="저장" onClick={() => handleOrderStatusUpdate("배송완료")} />
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

              <p>{orderInfo.orderNo}</p>
            </div>

            <div className="product-field-wrapper mt-2">
              <div className="product-field mr-20">
                <p>주문상태</p>
              </div>
              <p className="font-bold mr-8">{orderInfo.orderStatus}</p>
              {orderInfo.orderStatus === "상품준비" && (
                <p className="font-12">지연사유: {orderInfo.delayType}</p>
              )}
            </div>

            <div className="product-field-wrapper mt-2">
              <div className="product-field mr-20">
                <p>결제수단</p>
              </div>
              <p>
                {orderInfo.paymentMethod} ({orderInfo.pg})
              </p>
            </div>

            <div className="field-list-wrapper mt-2">
              <div className="product-field mr-20">
                <p>원주문 내역</p>
              </div>

              <div className="flex1 pt-10 pb-10" style={{ paddingRight: 20 }}>
                <p>
                  [판매가합계]{currency(orderInfo.totalAmount)}원 + [배송비]
                  {currency(orderInfo.deliveryFee)}원 - [쿠폰할인]
                  {currency(orderInfo.couponDiscount)}원 - [적립금]{currency(orderInfo.usingPoint)}
                  원 = {currency(orderInfo.totalPayAmount)}원
                </p>
              </div>
            </div>

            <div className="field-list-wrapper mt-2">
              <div className="product-field mr-20">
                <p>할인정보</p>
              </div>

              <div className="flex1 pt-10 pb-10" style={{ paddingRight: 20 }}>
                <p>
                  [쿠폰할인]{currency(orderInfo.couponDiscount)}원 / [적립금]
                  {currency(orderInfo.usingPoint)}원
                </p>
              </div>
            </div>

            <div className="field-list-wrapper mt-2">
              <div className="product-field mr-20">
                <p>배송유형</p>
              </div>

              <div className="flex align-c flex1 pt-10 pb-10">
                <p>{orderInfo.deliveryType}</p>
              </div>
            </div>

            {orderInfo.orderStatus === "배송중" && (
              <div className="field-list-wrapper mt-2">
                <div className="product-field mr-20">
                  <p>배송정보</p>
                </div>

                <div className="flex align-c flex1 pt-10 pb-10">
                  <p className="mr-8">{orderInfo.deliveryType === "국내배송" ? "CJ" : "GSMNtoN"}</p>
                  <p className="font-blue text-underline cursor">{orderInfo.trackingNumber}</p>
                  {/* <SelectBox
                    containerStyles={{ marginRight: 8, width: 120 }}
                    placeholder={"택배사선택"}
                    value={{
                      value: orderInfo?.deliveryType === "국내배송" ? "CJ" : "GSMNtoN",
                      label: orderInfo?.deliveryType === "국내배송" ? "CJ" : "GSMNtoN",
                    }}
                    onChange={() => {}}
                    options={[
                      {
                        value: orderInfo?.deliveryType === "국내배송" ? "CJ" : "GSMNtoN",
                        label: orderInfo?.deliveryType === "국내배송" ? "CJ" : "GSMNtoN",
                      },
                    ]}
                    noOptionsMessage={"카테고리가 없습니다."}
                  /> */}
                  {/* <InputR
                    value={trackingNumber}
                    onChange={(e: any) => onChange("trackingNumber", e)}
                    placeholer="운송장번호(숫자만 입력)"
                    innerStyle={{ width: 160 }}
                  />
                  <ButtonR name={"적용"} color={"white"} onClick={handleAddDeliveryAccount} /> */}
                </div>
              </div>
            )}

            {/* 배송준비시 배송정보 인풋  */}
            {orderInfo.orderStatus === "배송준비" && (
              <div className="field-list-wrapper mt-2">
                <div className="product-field mr-20">
                  <p>배송정보</p>
                </div>

                <div className="flex align-c flex1 pt-10 pb-10">
                  <SelectBox
                    containerStyles={{ marginRight: 8, width: 120 }}
                    placeholder={"택배사선택"}
                    value={{
                      value: orderInfo?.deliveryType === "국내배송" ? "CJ" : "GSMNtoN",
                      label: orderInfo?.deliveryType === "국내배송" ? "CJ" : "GSMNtoN",
                    }}
                    onChange={() => {}}
                    options={[
                      {
                        value: orderInfo?.deliveryType === "국내배송" ? "CJ" : "GSMNtoN",
                        label: orderInfo?.deliveryType === "국내배송" ? "CJ" : "GSMNtoN",
                      },
                    ]}
                    noOptionsMessage={"카테고리가 없습니다."}
                  />
                  <InputR
                    value={trackingNumber}
                    onChange={(e: any) => onChange("trackingNumber", e)}
                    placeholer="운송장번호(숫자만 입력)"
                    innerStyle={{ width: 160 }}
                  />
                  <ButtonR name={"적용"} color={"white"} onClick={handleAddDeliveryAccount} />
                </div>
              </div>
            )}

            <div className="field-list-wrapper mt-2">
              <div className="product-field mr-20">
                <p>주문자 정보</p>
              </div>

              <div className="flex1 pt-10 pb-10">
                <div className="flex align-c">
                  <p style={{ width: 60 }}>이름</p>
                  <p>{orderInfo.ordererInfo?.name}</p>
                </div>

                <div className="flex align-c mt-4">
                  <p style={{ width: 60 }}>연락처</p>
                  <p>{orderInfo.ordererInfo?.phone}</p>
                </div>

                <div className="flex align-c mt-4">
                  <p style={{ width: 60 }}>이메일</p>
                  <p>{orderInfo.ordererInfo?.email}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex1">
            <div className="product-field-wrapper mt-2">
              <div className="product-field mr-20">
                <p>주문일시</p>
              </div>

              <p>{timeFormat1(orderInfo.orderDate)}</p>
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

              <p>
                {orderInfo.card} / {orderInfo.cardNum} - **** - **** - ****
              </p>
            </div>

            <div className="field-list-wrapper mt-2">
              <div className="product-field mr-20">
                <p>적립정보</p>
              </div>

              <div className="flex align-c flex1 pt-10 pb-10">
                <p>[적립금] {currency(orderInfo.rewardPoints)}원</p>
              </div>
            </div>

            {orderInfo.orderStatus === "상품준비" && (
              <div className="field-list-wrapper mt-2">
                <div className="product-field mr-20">
                  <p>지연 상태</p>
                </div>

                <div className="flex align-c flex1 pt-10 pb-10">
                  <p className="font-red font-bold">+ {countDelayDays()}일</p>
                  {/* <p>[적립금] {currency(orderInfo.rewardPoints)}원</p> */}
                </div>
              </div>
            )}

            <div className="field-list-wrapper mt-2">
              <div className="product-field mr-20">
                <p>배송지 정보</p>
              </div>

              <div className="flex1 pt-10 pb-10" style={{ paddingRight: 20 }}>
                <div className="flex align-c">
                  <p style={{ width: 200 }}>이름</p>
                  <p>{orderInfo.deliveryAddressInfo?.name}</p>
                </div>

                <div className="flex align-c mt-4">
                  <p style={{ width: 200 }}>연락처</p>
                  <p>{orderInfo.deliveryAddressInfo?.phone}</p>
                </div>

                <div className="flex align-c mt-4">
                  <p style={{ width: 200 }}>
                    개인통관고유부호
                    <span
                      onClick={() => setPersonalCustomCodePopup(true)}
                      className="ml-4 font-blue text-underline cursor"
                    >
                      수정
                    </span>
                  </p>

                  <p>{personalCustomCode}</p>
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
                      {orderInfo.deliveryAddressInfo?.address}
                      {/* ({address.zonecode}) {address.address} {address.restAddress} */}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-fe">
          {(orderInfo.orderStatus === "결제완료" ||
            orderInfo.orderStatus === "상품준비" ||
            orderInfo.orderStatus === "배송준비") && (
            <ButtonR
              name={"주문취소"}
              styleClass={"mr-8"}
              onClick={() => setOrderCancelPopup(true)}
              color={"white"}
            />
          )}

          {orderInfo.orderStatus === "결제완료" && (
            <ButtonR
              name={"상품준비"}
              styleClass={"mr-8"}
              onClick={() => setOrderStatusPopup("상품준비")}
              color={"white"}
            />
          )}

          {(orderInfo.orderStatus === "결제완료" ||
            orderInfo.orderStatus === "상품준비" ||
            orderInfo.orderStatus === "배송준비" ||
            orderInfo.orderStatus === "배송중") && (
            <ButtonR
              name={"배송완료"}
              styleClass={"mr-8"}
              onClick={() => setOrderStatusPopup("배송완료")}
              color={"white"}
            />
          )}

          {(orderInfo.orderStatus === "결제완료" || orderInfo.orderStatus === "상품준비") && (
            <ButtonR name={"주문확인"} onClick={() => setOrderStatusPopup("주문확인")} />
          )}

          {orderInfo.orderStatus === "배송완료" && (
            <div className="flex">
              <ButtonR
                name={"교환신청"}
                styleClass={"mr-8"}
                onClick={() => setOrderStatusPopup("상품준비")}
                color={"white"}
              />
              <ButtonR
                name={"반품신청"}
                styleClass={"mr-8"}
                onClick={() => setOrderStatusPopup("상품준비")}
                color={"white"}
              />
            </div>
          )}
        </div>

        {csInfo.length !== 0 && (
          <div className="mt-40">
            <p className="font-category">CS정보</p>
            <div className="flex mt-13">
              <div className="flex1">
                <div className="product-field-wrapper mt-2">
                  <div className="product-field mr-20">
                    <p>요청구분</p>
                  </div>

                  <p>취소</p>
                </div>

                <div className="product-field-wrapper mt-2">
                  <div className="product-field mr-20">
                    <p>CS접수번호</p>
                  </div>

                  <p
                    onClick={() => setOrderCancelPopup(true)}
                    className="font-blue text-underline cursor"
                  >
                    {csInfo[0]?.csNo}
                  </p>
                </div>

                <div className="field-list-wrapper mt-2">
                  <div className="product-field mr-20">
                    <p>접수사유</p>
                  </div>

                  <div className="flex1 pt-10 pb-10" style={{ paddingRight: 20 }}>
                    <p>
                      [{csInfo[0]?.from}] {csInfo[0]?.type}
                    </p>
                  </div>
                </div>

                <div className="field-list-wrapper mt-2">
                  <div className="product-field mr-20">
                    <p>환불여부</p>
                  </div>

                  <div className="flex1 pt-10 pb-10" style={{ paddingRight: 20 }}>
                    <p>{csInfo[0]?.refund ? "Y" : "N"}</p>
                  </div>
                </div>
              </div>

              <div className="flex1">
                <div className="product-field-wrapper mt-2">
                  <div className="product-field mr-20">
                    <p>CS상태</p>
                  </div>

                  <p>{csInfo[0]?.status ? "완료" : "처리중"}</p>
                </div>

                <div className="product-field-wrapper mt-2">
                  <div className="product-field mr-20">
                    <p>CS접수경로</p>
                  </div>

                  <p>{csInfo[0]?.csRoute}</p>
                </div>

                <div className="field-list-wrapper mt-2">
                  <div className="product-field mr-20">
                    <p>접수일</p>
                  </div>

                  <div className="flex1 pt-10 pb-10" style={{ paddingRight: 20 }}>
                    <p>{timeFormat1(csInfo[0]?.created)}</p>
                  </div>
                </div>

                <div className="field-list-wrapper mt-2">
                  <div className="product-field mr-20">
                    <p>처리완료일</p>
                  </div>

                  <div className="flex1 pt-10 pb-10" style={{ paddingRight: 20 }}>
                    <p>{timeFormat1(csInfo[0]?.completed)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 주문상품 */}
        <div className="mt-40">
          <div className="flex justify-sb align-c">
            <p className="font-category">
              주문상품 {orderInfo.orderedProduct?.length}
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

          {orderInfo.orderedProduct?.map((item: any, i: number) => (
            <div key={i} className="list-content pl-18 pr-18 mt-12">
              <div className="flex align-c mt-8 mb-8 text-center">
                <div className="w10p text-left">
                  <p className={`${item.status === "cancel" ? "text-cancel" : ""}`}>
                    {item.productCode}
                  </p>
                </div>

                <div className="w40p">
                  <p className={`text-line ${item.status === "cancel" ? "text-cancel" : ""}`}>
                    {item.productNameK}
                  </p>
                </div>

                <div className="w10p">
                  <p className={`${item.status === "cancel" ? "text-cancel" : ""}`}>
                    {item.option}
                  </p>
                </div>

                <div className="w10p">
                  <p className={`${item.status === "cancel" ? "text-cancel" : ""}`}>
                    {currency(item.price)}
                  </p>
                </div>
                <div className="w10p">
                  <p className={`${item.status === "cancel" ? "text-cancel" : ""}`}>
                    {currency(-item.couponDiscount ? item.couponDiscount : 0)}
                  </p>
                </div>

                <div className="w10p">
                  <p className={`${item.status === "cancel" ? "text-cancel" : ""}`}>
                    {currency(item.deliveryFee)}
                  </p>
                </div>
                <div className="w10p">
                  <p className={`${item.status === "cancel" ? "text-cancel" : ""}`}>{item.count}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CS상담메모 */}
        <div className="mt-40">
          <div className="flex justify-sb align-c">
            <p className="font-category">CS상담메모</p>
            <ButtonR
              color={"white"}
              name={"메모 추가"}
              onClick={() => {
                setMemoPopup(true);
                setPopupAdd("add");
                setCsMemo({
                  csPath: {},
                  memo: "",
                  process: "N",
                });
              }}
            />
          </div>

          <div className="list-header mt-8 pl-18 pr-18 text-center">
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

          {csMemos.map((aMemo: any, i: number) => (
            <div key={i} className="list-content pl-18 pr-18">
              <div className="flex align-c mt-8 mb-8 text-center">
                <div className="w10p text-left">
                  <p>{i + 1}</p>
                </div>

                <div className="w40p">
                  <p className="text-line">{aMemo.memo}</p>
                </div>

                <div className="w10p">
                  <p>관리자</p>
                </div>

                <div className="w15p">
                  <p>{timeFormat1(aMemo.created)}</p>
                </div>

                <div className="w10p">
                  <p>{aMemo.process}</p>
                </div>

                <div className="text-center w15p flex justify-c">
                  <ButtonR
                    name="상세"
                    color="white"
                    styles={{ marginRight: 4 }}
                    onClick={() => {
                      setMemoPopup(true);
                      setPopupAdd("view");
                      setEditMemoId(aMemo._id);
                      setCsMemo({
                        csPath: {
                          label: aMemo.path,
                          value: aMemo.path,
                        },
                        memo: aMemo.memo,
                        process: aMemo.process,
                        created: aMemo.created,
                        completed: aMemo.completed,
                      });
                    }}
                    // onClick={() => navigate(`/site/main/bannertop/${aBanner._id}`)}
                  />
                  <ButtonR
                    name="삭제"
                    color="white"
                    onClick={() => handleDeleteMemo(aMemo._id)}
                    // onClick={() => navigate(`/site/main/bannertop/${aBanner._id}`)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
