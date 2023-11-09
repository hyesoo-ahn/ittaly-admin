import React, { ChangeEventHandler, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDataLength, getDatas, getOrderData, putUpdateData } from "../common/apis";
import {
  CSV_INVOICE_TEMPLATE,
  PAGINATION_LIMIT,
  PAGINATION_NUM_LIMIT,
  formatOnlyDate,
  formatOnlyTime,
} from "../common/utils";
import ButtonR from "../components/ButtonR";
import InputR from "../components/InputR";
import SelectBox from "../components/SelectBox";
import Modal from "../components/Modal";
import close from "../images/close.png";
import CSVSelector from "../components/CSVSelector";
import { CSVLink } from "react-csv";
import { CustomSelectbox } from "../components/CustomSelectbox";
import { usePriceInput } from "../hooks/useInput";
import Pagination from "../components/Pagination";

interface ISelectedInvoice {
  _id: string;
  invoice: string;
  deliveryType: String;
}

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

// 운송장 조회 참고하기
// https://development-pro.tistory.com/entry/%ED%83%9D%EB%B0%B0%EC%82%AC%EC%A1%B0%ED%9A%8C%EA%B0%81-%ED%83%9D%EB%B0%B0%EC%82%AC-%EB%B0%8F-%EB%8C%80%ED%95%9C%ED%86%B5%EC%9A%B4-API-%EC%9D%B8%ED%84%B0%ED%8E%98%EC%9D%B4%EC%8A%A4

export default function Deliverystatus(): JSX.Element {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<any>("");
  const [exportItem, setExportItem] = useState<boolean>(false);
  const csvRef = useRef<HTMLInputElement>(null);
  const [modifyInvoicePopup, setModifyInvoicePopup] = useState<boolean>(false);
  const [selectedDeliveryService, setSelectedDeliveryService] = useState<any>({
    label: "CJ",
    value: "CJ",
  });

  const [totalCount, setTotalCount] = useState<number>(0);
  const [data, setData] = useState<any[]>([]);
  const [filterOb, setFilterOb] = useState<any>({});
  const [filterInfo, setFilterInfo] = useState<any>({});
  const [selectedInvoiceInfo, setSelectedInvoiceInfo] = useState<ISelectedInvoice>({
    _id: "",
    invoice: "",
    deliveryType: "",
  });

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
        find: { ...filterInfo, orderStatus: { $in: ["배송중", "배송완료"] } },
      });
    } else {
      data = await getOrderData({
        text: text,
        // sort: { sort: -1 },
        find: { ...filterInfo, orderStatus: { $in: ["배송중", "배송완료"] } },
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

  const handleChangeInvoice = (e: any) => {
    const { value } = e.target;

    const check = /^[0-9]+$/;

    if (check.test(value)) {
      setSelectedInvoiceInfo((prev: any) => {
        return {
          ...prev,
          invoice: value,
        };
      });
    }
  };

  const handleUpdateInvoice = async () => {
    // selectedInvoiceInfo
    const confirm = window.confirm("해당 주문의 운송장을 수정하시겠습니까?");
    if (confirm) {
      await putUpdateData({
        collection: "orders",
        _id: selectedInvoiceInfo._id,
        trackingNumber: selectedInvoiceInfo.invoice,
      });
    }

    setModifyInvoicePopup(false);
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
      {modifyInvoicePopup && (
        <Modal
          innerStyle={{
            display: "flex",
            flexDirection: "column",
            width: "30%",
            minHeight: "10vh",
            padding: 30,
          }}
        >
          <div className="flex justify-sb align-c relative">
            <h2 className="margin-0">운송장 수정</h2>
            <img
              onClick={() => setModifyInvoicePopup(false)}
              src={close}
              style={{ width: 24, top: -10, right: -10 }}
              className="cursor absolute"
            />
          </div>

          <div className="mt-20 w100p flex">
            <CustomSelectbox
              style={{ width: 140, marginRight: 4 }}
              selected={selectedDeliveryService}
              setSelected={setSelectedDeliveryService}
              data={[
                selectedInvoiceInfo.deliveryType === "국내배송"
                  ? {
                      label: "CJ",
                      value: "CJ",
                    }
                  : { label: "GSMNtoN", value: "GSMNtoN" },
              ]}
              noDataMessage={"택배사 선택"}
            />
            <div className="w100p">
              <InputR
                onChange={(e: any) => handleChangeInvoice(e)}
                value={selectedInvoiceInfo.invoice}
                size="full"
              />
            </div>
          </div>
          <div className="flex justify-fe mt-20">
            <ButtonR
              color={"white"}
              name="취소"
              onClick={() => setModifyInvoicePopup(false)}
              styleClass="mr-4"
            />
            <ButtonR name="저장" onClick={handleUpdateInvoice} />
          </div>
        </Modal>
      )}
      <div className="flex justify-sb align-c">
        <p className="page-title">배송상태 조회</p>
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
              size="full"
              value={filterOb.orderNo || ""}
              onChange={(e: any) => handleChangeFilterInput("orderNo", e.target.value)}
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
              placeholer="주문자 이름/ID"
              innerStyle={{ margin: 0 }}
            />
            {/* <InputR placeholer="상품코드" size="full" innerStyle={{ marginRight: 0 }} /> */}
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
          <div className="flex flex1 ml-4 mr-4" style={{ height: 32 }}>
          
          </div>
        </div> */}
      </div>

      <div className="mt-34 flex justify-sb align-c">
        <p>총 0건</p>

        <div className="flex">
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
          <p>배송유형</p>
        </div>
        <div className="w10p text-center">
          <p>배송정보</p>
        </div>

        <div className="w10p text-center">
          <p>주문일시</p>
        </div>
        <div className="w10p text-center">
          <p>출고일시</p>
        </div>

        <div className="w10p text-center">
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
              <p>배송중</p>
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
              <p>{item.deliveryType}</p>
            </div>
            <div className="w10p text-center">
              <p>{item.deliveryType === "국내배송" ? "CJ" : "GSMNToN"}</p>
              <p className="font-blue text-underline">{item.trackingNumber}</p>
            </div>

            <div className="w10p text-center">
              <p className="text-line">
                {formatOnlyDate(item.orderDate)}
                <br /> {formatOnlyTime(item.orderDate)}
              </p>
            </div>

            <div className="w10p text-center">
              <p className="text-line">
                2023.01.01
                <br /> 11:11:22
              </p>
            </div>

            <div className="w10p text-center">
              <div className="flex align-c justify-c">
                <ButtonR
                  name={"운송장 수정"}
                  onClick={() => {
                    setSelectedInvoiceInfo((prev: ISelectedInvoice) => {
                      return {
                        _id: item._id,
                        invoice: item.trackingNumber,
                        deliveryType: item.deliveryType,
                      };
                    });
                    setModifyInvoicePopup(true);
                  }}
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
