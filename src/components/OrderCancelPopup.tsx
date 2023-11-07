import React, { ChangeEvent, useCallback } from "react";
import Modal from "./Modal";
import close from "../images/close.png";
import { currency } from "../common/utils";
import { CustomSelectbox } from "./CustomSelectbox";
import InputR from "./InputR";
import ButtonR from "./ButtonR";

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

export default function OrderCancelPopup(props: any) {
  const handleCancelFormChange = (type: string, value: string) => {
    props.setCancelForm((prev: any) => {
      return {
        ...prev,
        [type]: value,
      };
    });
  };

  const onChangeHandler = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length > 200) return;
    props.setCancelForm((prev: any) => {
      return {
        ...prev,
        reason: e.target.value,
      };
    });
    props.setTxtLength(e.target.value.length);
  }, []);

  const handleCheckOrderedProduct = (item: any) => {
    let ordered = [...props.orderInfo.orderedProduct];
    const getIdx = ordered.findIndex((el) => el === item);
    ordered[getIdx].checked = !ordered[getIdx].checked;

    props.setOrderInfo((prev: any) => {
      return {
        ...prev,
        orderedProduct: ordered,
      };
    });
  };

  const handleChangeProductQuantity = (item: any, e: any) => {
    let tempProducts = [...props.orderInfo.orderedProduct];
    const tIndex = tempProducts.findIndex((el) => el === item);
    tempProducts[tIndex].quantity = parseInt(e.value);

    props.setOrderInfo((prev: any) => {
      return {
        ...prev,
        orderedProduct: tempProducts,
      };
    });
  };

  const handleCancelPaymenet = async () => {
    console.log("주문취소 준비중입니다.");
  };

  return (
    <div>
      <Modal innerStyle={{ width: "80%", minHeight: "0" }}>
        <div className="padding-24">
          <div className="flex justify-sb">
            <h2 className="margin-0 mb-20">주문 취소 처리</h2>

            <div>
              <img
                onClick={() => {
                  props.setOrderCancelPopup(false);
                  props.resetPrice();
                  props.handleResetPopup();
                }}
                src={close}
                className="img-close cursor"
                alt="close"
              />
            </div>
          </div>

          <p className="font-category">주문정보</p>
          <div className="flex flex-wrap mt-8">
            <div className="w50p">
              <div className="field-list-wrapper mt-2">
                <div className="product-field mr-20">
                  <p>주문번호</p>
                </div>

                <div className="flex1 pt-10 pb-10">
                  <p>{props.orderInfo.orderNo}</p>
                </div>
              </div>
            </div>
            <div className="w50p">
              <div className="field-list-wrapper mt-2">
                <div className="product-field mr-20">
                  <p>결제수단</p>
                </div>

                <div className="flex1 pt-10 pb-10">
                  <p>{props.orderInfo.paymentMethod}</p>
                </div>
              </div>
            </div>
            <div className="w100p">
              <div className="field-list-wrapper mt-2">
                <div className="product-field mr-20">
                  <p>원주문내역</p>
                </div>

                <div className="flex1 pt-10 pb-10">
                  <p>
                    [판매가합계]{currency(props.orderInfo.totalAmount)}원 + [배송비]
                    {currency(props.orderInfo.deliveryFee)}원 - [쿠폰할인]
                    {currency(props.orderInfo.couponDiscount)}원 - [적립금]
                    {currency(props.orderInfo.usingPoint)}원 ={" "}
                    {currency(props.orderInfo.totalPayAmount)}원
                  </p>
                </div>
              </div>
            </div>
            <div className="w50p">
              <div className="field-list-wrapper mt-2">
                <div className="product-field mr-20">
                  <p>할인정보</p>
                </div>

                <div className="flex1 pt-10 pb-10">
                  <p>
                    [쿠폰할인]{currency(props.orderInfo.couponDiscount)}원 / [적립금]
                    {currency(props.orderInfo.usingPoint)}원
                  </p>
                </div>
              </div>
            </div>
            <div className="w50p">
              <div className="field-list-wrapper mt-2">
                <div className="product-field mr-20">
                  <p>적립정보</p>
                </div>

                <div className="flex1 pt-10 pb-10">
                  <p>[적립금] {currency(props.orderInfo.rewardPoints)}원</p>
                </div>
              </div>
            </div>
            <div className="w50p">
              <div className="field-list-wrapper mt-2">
                <div className="product-field mr-20">
                  <p>배송유형</p>
                </div>

                <div className="flex1 pt-10 pb-10">
                  <p>{props.orderInfo.deliveryType}</p>
                </div>
              </div>
            </div>
          </div>

          <p className="font-category mt-30">CS정보</p>

          <div className="flex flex-wrap mt-8">
            <div className="w100p">
              <div className="field-list-wrapper mt-2">
                <div className="product-field mr-20">
                  <p>CS접수경로</p>
                </div>

                <div className="flex1 pt-10 pb-10 relative">
                  <CustomSelectbox
                    selected={props.cancelForm.csRoute || ""}
                    setSelected={(e: any) => handleCancelFormChange("csRoute", e)}
                    data={CS_ORDER_PATH}
                    noDataMessage={"CS접수경로 선택"}
                  />
                </div>
              </div>
            </div>

            <div className="w100p">
              <div className="field-list-wrapper mt-2">
                <div className="product-field mr-20">
                  <p>접수사유</p>
                </div>

                <div className="flex1 pt-10 pb-10 relative">
                  <CustomSelectbox
                    selected={props.cancelForm.cancelReason || ""}
                    setSelected={(e: any) => handleCancelFormChange("cancelReason", e)}
                    data={CANCEL_REASON}
                    noDataMessage={"접수사유 선택"}
                  />
                  <div className="mt-8 flex1 relative">
                    <textarea
                      className="input-textarea"
                      placeholder="200자 이내로 입력해주세요"
                      value={props.cancelForm.reason}
                      onChange={(e) => onChangeHandler(e)}
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
                      {props.txtLength}/200
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-30">
            <div className="flex justify-sb align-c mb-8">
              <p className="font-bold font-16">
                주문상품
                <span className="font-400">건</span>
              </p>
            </div>

            {/* table header */}
            <div className="list-header pl-18 pr-18 text-center">
              <div className="w5p text-left">
                <input type="checkbox" />
              </div>

              <div className="w10p">
                <p>상품코드</p>
              </div>

              <div className="w20p text-left">
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

              <div className="w15p">
                <p>취소금액</p>
              </div>
            </div>

            <div className="list-content pl-18 pr-18 pt-12">
              {props.orderInfo.orderedProduct.map((item: any, i: number) => (
                <div key={i} className="flex align-c text-center pt-12">
                  <div className="w5p text-left">
                    <input
                      type="checkbox"
                      checked={item.checked ? item.checked : false}
                      onChange={() => handleCheckOrderedProduct(item)}
                    />
                  </div>

                  <div className="w10p">
                    <p className={`${item.checked && "text-cancel"} text-line`}>
                      {item.productCode}
                    </p>
                  </div>

                  <div className="w20p text-left">
                    <p className={`${item.checked && "text-cancel"} text-line`}>
                      {item.productNameK}
                    </p>
                  </div>

                  <div className="w10p">
                    <p className={`${item.checked && "text-cancel"}`}>{item.option}</p>
                  </div>
                  <div className="w10p">
                    <p className={`${item.checked && "text-cancel"}`}>{currency(item.price)}</p>
                  </div>

                  <div className="w10p">
                    <p className={`${item.checked && "text-cancel"}`}>
                      -{currency(item.couponDiscount)}
                    </p>
                  </div>
                  <div className="w10p">
                    <p className={`${item.checked && "text-cancel"}`}>{currency(10000)}</p>
                  </div>
                  <div className="w10p">
                    <div className="flex align-c justify-c">
                      <CustomSelectbox
                        style={{ width: 100, height: 28 }}
                        selected={{ value: item.quantity, label: item.quantity }}
                        setSelected={(e: any) => handleChangeProductQuantity(item, e)}
                        data={props.setProductQuantityRange(i)}
                        noDataMessage={"수량"}
                      />
                    </div>
                  </div>

                  <div className="w15p">
                    <p className={`${item.checked && "text-cancel"}`}>{currency(400000)}</p>
                  </div>
                </div>
              ))}
            </div>

            <p className="font-category mt-30">취소내역</p>
            <div className="flex flex-wrap mt-8">
              <div className="w50p">
                <div className="field-list-wrapper mt-2">
                  <div className="product-field mr-20">
                    <p>판매가합계</p>
                  </div>

                  <div className="flex1 pt-10 pb-10">
                    <p>{currency(200000)}원</p>
                  </div>
                </div>
              </div>
              <div className="w50p">
                <div className="field-list-wrapper mt-2">
                  <div className="product-field mr-20">
                    <p>배송비</p>
                  </div>

                  <div className="flex1 pt-10 pb-10">
                    <p>{currency(10000)}원</p>
                  </div>
                </div>
              </div>
              <div className="w50p">
                <div className="field-list-wrapper mt-2">
                  <div className="product-field mr-20">
                    <p>쿠폰할인취소</p>
                  </div>

                  <div className="flex1 flex align-c pt-10 pb-10">
                    <InputR
                      value={props.cancelCouponPrice}
                      onChange={(e: any) => props.onChangePrice("cancelCouponPrice", e)}
                    />
                    <p>원</p>
                  </div>
                </div>
              </div>
              <div className="w50p">
                <div className="field-list-wrapper mt-2">
                  <div className="product-field mr-20">
                    <p>사용적립금 반환</p>
                  </div>

                  <div className="flex1 flex align-c pt-10 pb-10">
                    <InputR
                      value={props.cancelRewardPrice}
                      onChange={(e: any) => props.onChangePrice("cancelRewardPrice", e)}
                    />
                    <p>원</p>
                  </div>
                </div>
              </div>
            </div>

            <p className="font-category mt-30">고객환불정보</p>
            <div className="flex flex-wrap mt-8">
              <div className="w100p">
                <div className="field-list-wrapper mt-2">
                  <div className="product-field mr-20">
                    <p>환불내역</p>
                  </div>

                  <div className="flex1 pt-10 pb-10">
                    <p>
                      [판매가합계]{currency(props.orderInfo.totalAmount)}원 - [쿠폰할인취소]
                      {currency(props.cancelCouponPrice.replaceAll(",", ""))}원 - [적립금반환]
                      {currency(props.cancelRewardPrice.replaceAll(",", ""))}원 = 190,000원
                    </p>
                  </div>
                </div>
              </div>
              <div className="w50p">
                <div className="field-list-wrapper mt-2">
                  <div className="product-field mr-20">
                    <p>환불예정금액</p>
                  </div>

                  <div className="flex1 pt-10 pb-10">
                    <p>{currency(190000)}원</p>
                  </div>
                </div>
              </div>
              <div className="w50p">
                <div className="field-list-wrapper mt-2">
                  <div className="product-field mr-20">
                    <p>환불수단</p>
                  </div>

                  <div className="flex1 flex align-c pt-10 pb-10">
                    <p>신용/체크카드</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-fe">
            <ButtonR name={"확인"} onClick={handleCancelPaymenet} />
          </div>
        </div>
      </Modal>
    </div>
  );
}
