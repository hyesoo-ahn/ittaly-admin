import React, { ChangeEventHandler, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import _ from "lodash";
import { getDataLength, getDatas, getOrderData, getUsers, putUpdateData } from "../common/apis";
import {
  PAGINATION_LIMIT,
  PAGINATION_NUM_LIMIT,
  countDelayDays,
  currency,
  formatOnlyDate,
  formatOnlyTime,
  timeFormat1,
  timeFormat2,
} from "../common/utils";
import ButtonR from "../components/ButtonR";
import InputR from "../components/InputR";
import SelectBox from "../components/SelectBox";
import Modal from "../components/Modal";
import close from "../images/close.png";
import Pagination from "../components/Pagination";
import OrderCancelPopup from "../components/OrderCancelPopup";
import { useInput, usePriceInput } from "../hooks/useInput";
import { CustomSelectbox } from "../components/CustomSelectbox";

const DELIVERY_TYPE = [
  {
    value: "전체",
    label: "전체",
  },
  {
    value: "해외배송",
    label: "해외배송",
  },
  {
    value: "국내배송",
    label: "국내배송",
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

export default function Pendingshipment(): JSX.Element {
  const navigate = useNavigate();
  const [exportItem, setExportItem] = useState<boolean>(false);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [data, setData] = useState<any[]>([]);
  const [filterOb, setFilterOb] = useState<any>({});
  const [filterInfo, setFilterInfo] = useState<any>({});

  // pagination
  const [numPage, setNumPage] = useState<number>(1);
  const [page, setPage] = useState(1);
  const limit = PAGINATION_LIMIT;
  const numLimit = PAGINATION_NUM_LIMIT;
  const offset = (page - 1) * limit; // 시작점과 끝점을 구하는 offset
  const numPagesTotal = Math.ceil(totalCount / limit);
  const numOffset = (numPage - 1) * numLimit;

  const [orderStatusPopup, setOrderStatusPopup] = useState<string>("");
  // 주문취소 form
  const [orderCancelPopup, setOrderCancelPopup] = useState<boolean>(false);
  const [orderInfo, setOrderInfo] = useState<any>({});
  const [orderInfoCopy, setOrderInfoCopy] = useState<any>({});
  // 주문취소처리 폼
  const [cancelForm, setCancelForm] = useState<any>({});
  const [txtLength, setTxtLength] = useState(0);
  const [{ cancelCouponPrice, cancelRewardPrice }, onChangePrice, resetPrice] = usePriceInput({
    cancelCouponPrice: "",
    cancelRewardPrice: "",
  });

  useEffect(() => {
    init();
  }, [page, filterInfo]);

  const init = async () => {
    const count: any = await getDataLength({
      collection: "orders",
      find: { ...filterInfo },
    });

    let data: any = [];

    const text = filterInfo.text;

    delete filterInfo.text;
    if (!text || text === "") {
      data = await getDatas({
        // sort: { sort: -1 },
        collection: "orders",
        find: { ...filterInfo, orderStatus: "상품준비" },
      });
    } else {
      data = await getOrderData({
        text: text,
        // sort: { sort: -1 },
        find: { ...filterInfo, orderStatus: "상품준비" },
      });
    }

    setTotalCount(count.count);
    setData(data.data);
  };

  const paginationNumbering = () => {
    const numArr: number[] = Array.from({ length: numPagesTotal }, (v, i) => i + 1);
    const result = numArr.slice(numOffset, numOffset + 5);
    return result;
  };

  const handleChangeFilterInput = (type: string, value: any) => {
    setFilterOb((prev: any) => {
      return {
        ...prev,
        [type]: value,
      };
    });
  };

  const handleFilter = async () => {
    let find: any = {};

    if (filterOb.startingDate) {
      find.orderDate = {
        $gte: new Date(filterOb.startingDate).getTime(),
      };
    }
    if (filterOb.endingDate) {
      find.orderDate = {
        ...find.creaated,
        $lte: new Date(filterOb.endingDate).getTime(),
      };
    }
    if (filterOb.orderNo && filterOb.orderNo !== "") {
      find.orderNo = filterOb.orderNo;
    }

    find.text = filterOb.productNameK;

    if (filterOb.userName && filterOb.userName !== "") {
      find.userName = filterOb.userName;
    }

    if (filterOb.deliveryType && filterOb.deliveryType.value !== "전체") {
      find.deliveryType = filterOb.deliveryType.value;
    }

    setFilterInfo(find);
  };

  const handleInitFilter = () => {
    setFilterOb({});
    setFilterInfo({});
    init();
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

  const handleCancelPaymentPopup = (item: any) => {
    setOrderInfo(item);
    setOrderCancelPopup(true);
    setOrderInfoCopy(_.cloneDeep(item));
  };

  const handleClickBtn = (orderState: string, item: any) => {
    setOrderStatusPopup(orderState);
    setOrderInfo(item);
    setOrderInfoCopy(_.cloneDeep(item));
  };

  const handleOrderConfirm = async () => {
    const updateStatus: any = await putUpdateData({
      collection: "orders",
      _id: orderInfo._id,
      orderStatus: "배송준비",
      delayReason: "",
      delayType: "",
    });

    setOrderInfo({});
    setOrderInfoCopy({});
    setOrderStatusPopup("");
    init();
  };

  return (
    <div>
      {exportItem && (
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
            <h2 className="margin-0">주문목록 내보내기</h2>
            <img
              onClick={() => setExportItem(false)}
              src={close}
              style={{ width: 24, top: -10, right: -10 }}
              className="cursor absolute"
            />
          </div>

          <div className="mt-20">
            <p className="line-height-21">
              방송통신위원회가 고시한 '개인정보의 기술적/관리적 보호조치 기준'에 근거해 개인 정보를
              PC에 저장할 때는 의무적으로 암호화를 해야합니다.
            </p>
            <p className="line-height-21">
              이에 따라 주문목록을 엑셀로 다운로드할 경우, 개인정보를 안전하게 보호하기 위해 설정된
              암호를 입력 후 이용해 주세요.
            </p>
            <p className="mt-10">
              다운로드된 엑셀 파일은 "
              <span className="font-bold">어드민 로그인 시 사용한 비밀번호</span>"로 자동 암호화
              처리됩니다.
            </p>
          </div>

          <div className="flex justify-fe mt-20">
            <ButtonR
              color={"white"}
              name="취소"
              onClick={() => setExportItem(false)}
              styleClass="mr-4"
            />
            <ButtonR name="다운로드" onClick={() => {}} />
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
            <ButtonR name="저장" onClick={handleOrderConfirm} />
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
          handleResetPopup={() => {
            setOrderInfo({});
            setOrderInfoCopy({});
          }}
        />
      )}
      <div className="flex justify-sb align-c">
        <p className="page-title">미출고 리스트</p>
      </div>

      <div className="w100p filter-container" style={{ flex: 1 }}>
        <div className="flex">
          <div className="flex1 ml-4 mr-4 flex">
            <input
              value={filterOb.startingDate || ""}
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
              data-placeholder="주문일(~부터)"
              required
              aria-required="true"
            />
            <input
              value={filterOb.endingDate || ""}
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
              data-placeholder="주문일(~까지)"
              required
              aria-required="true"
            />

            {/* <input style={{ width: "100%", marginRight: 4 }} type="date" /> */}
            {/* <input style={{ width: "100%", marginLeft: 4 }} type="date" /> */}
          </div>
          <div style={{ flex: 1, margin: "0 4px" }}>
            <InputR
              value={filterOb.orderNo || ""}
              onChange={(e: any) => handleChangeFilterInput("orderNo", e.target.value)}
              size="full"
              placeholer="주문번호"
              innerStyle={{ margin: 0 }}
            />
          </div>
          <div style={{ flex: 1, margin: "0 4px" }}>
            <InputR
              value={filterOb.productNameK || ""}
              onChange={(e: any) => handleChangeFilterInput("productNameK", e.target.value)}
              size="full"
              placeholer="상품명"
              innerStyle={{ margin: 0 }}
            />
          </div>
        </div>

        <div style={{ display: "flex", marginTop: 8 }}>
          <div className="flex1 ml-4 mr-4 w100p flex" style={{ height: 32 }}>
            {/* <InputR placeholer="상품코드" size="full" innerStyle={{ marginRight: 0 }} /> */}
            <InputR
              size="full"
              value={filterOb.userName || ""}
              onChange={(e: any) => handleChangeFilterInput("userName", e.target.value)}
              placeholer="주문자 이름"
              innerStyle={{ margin: 0 }}
            />
          </div>
          <div className="flex1 ml-4 mr-4" style={{ height: 32 }}>
            <SelectBox
              containerStyles={{ width: "100%" }}
              value={filterOb.ordererType || ""}
              onChange={(e: any) => handleChangeFilterInput("deliveryType", e)}
              options={DELIVERY_TYPE}
              noOptionsMessage={"상태가 없습니다."}
              placeholder="배송 유형"
            />
          </div>
          <div className="flex flex1 ml-4 mr-4" style={{ height: 32 }}>
            <button
              onClick={handleFilter}
              className="btn-add-b w50p mr-4 border-none"
              style={{ height: "100%" }}
            >
              검색
            </button>
            <button
              onClick={handleInitFilter}
              className="w50p bg-white ml-4 border-black"
              style={{ height: "100%" }}
            >
              초기화
            </button>
          </div>
        </div>

        {/* <div style={{ display: "flex", marginTop: 8 }}>
          <div className="flex1 ml-4 mr-4 w100p flex" style={{ height: 32 }}></div>
          <div className="flex1 ml-4 mr-4" style={{ height: 32 }}></div>
          <div className="flex flex1 ml-4 mr-4" style={{ height: 32 }}></div>
        </div> */}
      </div>

      <div className="mt-34 flex justify-sb align-c">
        <p>총 0건</p>

        <div>
          <ButtonR name={"전체 목록 내보내기"} onClick={() => {}} />
        </div>
      </div>

      <div className="list-header mt-10 pl-18 pr-18">
        <div className="w5p">
          <input type="checkbox" />
        </div>

        <div className="w5p text-left">
          <p>주문상태</p>
        </div>

        <div className="w10p text-center">
          <p>주문번호</p>
        </div>
        <div className="w20p text-center">
          <p>상품명</p>
        </div>

        <div className="w10p text-center">
          <p>주문자</p>
        </div>
        <div className="w10p text-center">
          <p>지연사유</p>
        </div>
        <div className="w10p text-center">
          <p>배송유형</p>
        </div>
        <div className="w10p text-center">
          <p>주문일시</p>
        </div>
        <div className="w5p text-center">
          <p>지연상태</p>
        </div>
        <div className="w15p text-center">
          <p>기능</p>
        </div>
      </div>

      <div className={`list-content pl-18 pr-18`}>
        {data?.map((item: any, i: number) => (
          <div key={i} className={`flex align-c mt-8 mb-8`}>
            <div className="w5p">
              <input type="checkbox" />
            </div>
            <div className="w5p text-left">
              <p>상품준비</p>
            </div>
            <div
              className="w10p text-center"
              onClick={() => navigate(`/order/payments/${item._id}`)}
            >
              <p className="font-blue text-underline cursor">{item.orderNo}</p>
            </div>
            <div className="w20p text-center">
              <p className="text-line">
                {item.orderedProduct[0]?.productNameK}{" "}
                {item.orderedProduct.length !== 0 && `외 ${item.orderedProduct.length - 1}건`}
              </p>
            </div>

            <div className="w10p text-center">
              <p>{item.userName}</p>
              <p>{item.userLevel}</p>
            </div>
            <div className="w10p text-center">
              <p>{item.delayType}</p>
            </div>
            <div className="w10p text-center">
              <p>{item.deliveryType}</p>
            </div>
            <div className="w10p text-center">
              <p className="text-line">{formatOnlyDate(item.orderDate)}</p>
              <p className="text-line">{formatOnlyTime(item.orderDate)}</p>
            </div>
            <div className="w5p text-center">
              <p className="font-bold font-red">+{countDelayDays(item.orderDate)}일</p>
            </div>
            <div className="w15p text-center">
              <div className="flex align-c justify-c">
                <ButtonR
                  name={"주문취소"}
                  onClick={() => handleCancelPaymentPopup(item)}
                  color="white"
                  styleClass={"mr-4"}
                />
                <ButtonR
                  name={"주문확인"}
                  onClick={() => handleClickBtn("주문확인", item)}
                  color="white"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-20 flex justify-sb align-c flex-wrap">
        <div className="flex">
          <ButtonR
            name="선택 목록 내보내기"
            color="white"
            onClick={() => setExportItem(true)}
            styles={{ marginRight: 4 }}
          />
        </div>

        <Pagination
          data={data}
          numPagesTotal={numPagesTotal}
          numOffset={numOffset}
          numLimit={numLimit}
          limit={limit}
          numPage={numPage}
          setNumPage={setNumPage}
          paginationNumbering={paginationNumbering}
          page={page}
          setPage={setPage}
          offset={offset}
        />
      </div>
    </div>
  );
}
