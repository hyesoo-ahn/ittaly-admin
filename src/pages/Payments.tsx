import React, { ChangeEventHandler, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { getDataLength, getDatas, getOrderData, getUsers } from "../common/apis";
import {
  PAGINATION_LIMIT,
  PAGINATION_NUM_LIMIT,
  currency,
  timeFormat1,
  timeFormat2,
} from "../common/utils";
import ButtonR from "../components/ButtonR";
import InputR from "../components/InputR";
import SelectBox from "../components/SelectBox";
import Modal from "../components/Modal";
import close from "../images/close.png";
import Pagination from "../components/Pagination";

const ORDER_STATUS_OPTIONS = [
  {
    value: "전체",
    label: "전체",
  },
  {
    value: "결제완료",
    label: "결제완료",
  },
  {
    value: "상품준비",
    label: "상품준비",
  },
  {
    value: "배송준비",
    label: "배송준비",
  },
  {
    value: "배송완료",
    label: "배송완료",
  },
  {
    value: "주문취소",
    label: "주문취소",
  },
  {
    value: "부분취소",
    label: "부분취소",
  },
  {
    value: "교환신청",
    label: "교환신청",
  },
  {
    value: "교환완료",
    label: "교환완료",
  },
  {
    value: "반품신청",
    label: "반품신청",
  },
  {
    value: "반품완료",
    label: "반품완료",
  },
];

const PAY_METHOD_OPTIONS = [
  {
    value: "전체",
    label: "전체",
  },
  {
    value: "신용/체크카드",
    label: "신용/체크카드",
  },
  {
    value: "네이버페이",
    label: "네이버페이",
  },
  {
    value: "카카오페이",
    label: "카카오페이",
  },
];

const ORDERER_TYPE = [
  { value: "전체", label: "전체" },
  { value: "회원", label: "회원" },
  { value: "비회원", label: "비회원" },
];

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

export default function Payments(): JSX.Element {
  const navigate = useNavigate();
  const [exportItem, setExportItem] = useState<boolean>(false);
  const [filterOb, setFilterOb] = useState<any>({});
  const [filterInfo, setFilterInfo] = useState<any>({});
  const [datas, setDatas] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);

  // pagination
  const [numPage, setNumPage] = useState<number>(1);
  const [page, setPage] = useState(1);
  const limit = PAGINATION_LIMIT;
  const numLimit = PAGINATION_NUM_LIMIT;
  const offset = (page - 1) * limit; // 시작점과 끝점을 구하는 offset
  const numPagesTotal = Math.ceil(totalCount / limit);
  const numOffset = (numPage - 1) * numLimit;

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
        find: { ...filterInfo },
      });
    } else {
      data = await getOrderData({
        text: text,
        // sort: { sort: -1 },
        find: { ...filterInfo },
      });
    }

    setTotalCount(count.count);
    setDatas(data.data);
  };

  const paginationNumbering = () => {
    const numArr: number[] = Array.from({ length: numPagesTotal }, (v, i) => i + 1);
    const result = numArr.slice(numOffset, numOffset + 5);
    return result;
  };
  // pagination end

  // 주문 전체검색

  const handleChangeFilterInput = (type: string, value: any) => {
    setFilterOb((prev: any) => {
      return {
        ...prev,
        [type]: value,
      };
    });
  };

  const handleInitFilter = () => {
    setFilterOb({});
    setFilterInfo({});
    // setPage(1);

    init();
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
    // 1. 해당 상품명을 가진 프로덕트 아이디를 조회
    // 2. orders 컬렉션에서 elemMatch 이용해서
    // db.getCollection('orders').find({"orderedProduct": {"$elemMatch":{"_id": "64be4610ea26a037ec37cd1f"} }})

    if (filterOb.userName && filterOb.userName !== "") {
      find.userName = filterOb.userName;
    }
    if (filterOb.orderStatus && filterOb.orderStatus.value !== "전체") {
      find.orderStatus = filterOb.orderStatus.value;
    }
    if (filterOb.payMethod && filterOb.payMethod.value !== "전체") {
      find.paymentMethod = filterOb.payMethod.value;
    }

    // 회원, 비회원 우케해?
    // if (filterOb.ordererType && filterOb.ordererType.value === "회원") {
    //   find.userId = {
    //     $ne: "",
    //   };
    // }

    if (filterOb.deliveryType && filterOb.deliveryType.value !== "전체") {
      find.deliveryType = filterOb.deliveryType.value;
    }

    setFilterInfo(find);
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
      <div className="flex justify-sb align-c">
        <p className="page-title">주문 전체검색</p>
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
            <InputR
              value={filterOb.userName || ""}
              onChange={(e: any) => handleChangeFilterInput("userName", e.target.value)}
              size="full"
              placeholer="주문자이름"
              innerStyle={{ margin: 0 }}
            />
          </div>
          <div className="flex1 ml-4 mr-4" style={{ height: 32 }}>
            <SelectBox
              containerStyles={{ width: "100%" }}
              value={filterOb.orderStatus || ""}
              onChange={(e: any) => handleChangeFilterInput("orderStatus", e)}
              options={ORDER_STATUS_OPTIONS}
              noOptionsMessage={"상태가 없습니다."}
              placeholder="주문상태"
            />
          </div>
          <div className="flex flex1 ml-4 mr-4" style={{ height: 32 }}>
            <SelectBox
              containerStyles={{ width: "100%" }}
              value={filterOb.payMethod || ""}
              onChange={(e: any) => handleChangeFilterInput("payMethod", e)}
              options={PAY_METHOD_OPTIONS}
              noOptionsMessage={"상태가 없습니다."}
              placeholder="결제수단"
            />
          </div>
        </div>

        <div style={{ display: "flex", marginTop: 8 }}>
          <div className="flex1 ml-4 mr-4 w100p flex" style={{ height: 32 }}>
            <SelectBox
              containerStyles={{ width: "100%" }}
              value={filterOb.ordererType || ""}
              onChange={(e: any) => handleChangeFilterInput("ordererType", e)}
              options={ORDERER_TYPE}
              noOptionsMessage={"상태가 없습니다."}
              placeholder="주문자유형"
            />
          </div>
          <div className="flex1 ml-4 mr-4" style={{ height: 32 }}>
            <SelectBox
              containerStyles={{ width: "100%" }}
              value={filterOb.deliveryType || ""}
              onChange={(e: any) => handleChangeFilterInput("deliveryType", e)}
              options={DELIVERY_TYPE}
              noOptionsMessage={"상태가 없습니다."}
              placeholder="배송 유형"
            />
            {/* <SelectBox
              containerStyles={{ width: "100%" }}
              value={selected}
              onChange={(e: any) => setSelected(e)}
              options={Cateogyoptions1}
              noOptionsMessage={"상태가 없습니다."}
              placeholder="주문채널"
            /> */}
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

        <div className="w10p text-center">
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
          <p>배송유형</p>
        </div>
        <div className="w10p text-center">
          <p>주문금액</p>
        </div>
        <div className="w10p text-center">
          <p>결제수단</p>
        </div>
        <div className="w15p text-center">
          <p>주문일시</p>
        </div>
        {/* <div className="w5p text-center">
          <p>주문채널</p>
        </div> */}
      </div>

      <div className={`list-content pl-18 pr-18`}>
        {datas?.map((order: any, i: number) => (
          <div key={i} className={`flex align-c mt-8 mb-8`}>
            <div className="w5p">
              <input type="checkbox" />
            </div>
            <div className="w10p text-center">
              <p>{order.orderStatus}</p>
            </div>
            <div
              className="w10p text-center"
              onClick={() => navigate(`/order/payments/${order._id}`)}
            >
              <p className="font-blue text-underline cursor">{order.orderNo}</p>
            </div>
            <div className="w20p text-center">
              <p className="text-line">
                {order.orderedProduct[0]?.productName}상품명은 서버에서 받아온다 외{" "}
                {order.orderedProduct.length}건
              </p>
            </div>

            <div className="w10p text-center">
              <p>
                {order.userName}({order.userId})
              </p>
              <p>{order.userLevel}, 총 12건</p>
            </div>
            <div className="w10p text-center">
              <p>{order.deliveryType}</p>
            </div>
            <div className="w10p text-center">
              <p>{currency(order?.totalPayAmount)}</p>
            </div>
            <div className="w10p text-center">
              <p>{order.paymentMethod}</p>
            </div>
            <div className="w15p text-center">
              <p className="text-line">{timeFormat1(order.orderDate)}</p>
            </div>
            {/* <div className="w5p text-center">
              <p>Mobile app</p>
            </div> */}
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
          data={datas}
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
