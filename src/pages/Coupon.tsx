import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { getDataLength, getDatas, putUpdateDataBulk } from "../common/apis";
import {
  PAGINATION_LIMIT,
  PAGINATION_NUM_LIMIT,
  currency,
  deleteItem,
  timeFormat1,
} from "../common/utils";
import ButtonR from "../components/ButtonR";
import InputR from "../components/InputR";
import SelectBox from "../components/SelectBox";
import Pagination from "../components/Pagination";

const Cateogyoptions1 = [
  { value: -1, label: "전체" },
  { value: 0, label: "고객 다운로드" },
  { value: 1, label: "조건부 발급" },
];
const Cateogyoptions2 = [
  { value: "", label: "전체" },
  { value: "discountRatio", label: "할인율" },
  { value: "discountPrice", label: "할인금액" },
  { value: "freeshipping", label: "무료배송" },
];
const Cateogyoptions3 = [
  { value: "전체", label: "전체" },
  { value: "사용가능", label: "사용가능" },
  { value: "사용불가", label: "사용불가" },
];

export default function Coupon(): JSX.Element {
  const navigate = useNavigate();
  const [coupons, setCoupons] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [filterOb, setFilterOb] = useState<any>({
    startingDate: "",
    endingDate: "",
    target: null,
    benefit: null,
    title: "",
    status: null,
  });
  const [filterInfo, setFilterInfo] = useState<any>({});

  // pagination
  const [numPage, setNumPage] = useState<number>(1);
  const [page, setPage] = useState(1);
  const limit = PAGINATION_LIMIT;
  const numLimit = PAGINATION_NUM_LIMIT;
  const offset = (page - 1) * limit; // 시작점과 끝점을 구하는 offset
  const numPagesTotal = Math.ceil(totalCount / limit);
  const numOffset = (numPage - 1) * numLimit;
  // const [pagesTotal, setPagesTotal] = useState<number>(0);

  useEffect(() => {
    productData();
  }, [page, filterInfo]);

  const productData = async () => {
    const count: any = await getDataLength({
      collection: "coupons",
      find: { ...filterInfo },
    });

    const { data }: any = await getDatas({
      collection: "coupons",
      sort: { created: 1 },
      skip: (page - 1) * limit,
      find: { ...filterInfo },
      // 처음 스킵0 리미트10 다음 스킵10 리미트 10
      limit: 10,
    });

    setTotalCount(count.count);
    // setPagesTotal(Math.ceil(count.count / limit));
    setCoupons(data);
  };

  const paginationNumbering = () => {
    const numArr: number[] = Array.from({ length: numPagesTotal }, (v, i) => i + 1);
    const result = numArr.slice(numOffset, numOffset + 5);
    return result;
  };
  // pagination end

  const handleCheckCoupon = (item: any) => {
    let temp = [...coupons];
    const findIdx = temp.findIndex((el) => el === item);
    temp[findIdx].checked = !temp[findIdx].checked;
    setCoupons(temp);
  };

  const handleChangeFilterInput = (type: string, value: any) => {
    setFilterOb((prev: any) => {
      return {
        ...prev,
        [type]: value,
      };
    });
  };

  const handleFilterCoupon = async () => {
    let find: any = {};

    if (filterOb.startingDate) {
      find.created = {
        $gte: new Date(filterOb.startingDate).getTime(),
      };
    }
    if (filterOb.endingDate) {
      find.created = {
        ...find.creaated,
        $lte: new Date(filterOb.endingDate).getTime(),
      };
    }
    if (filterOb.target?.label === "고객 다운로드") {
      find.targetMember = true;
    }
    if (filterOb.target?.label === "조건부 발급") {
      find.targetMember = false;
    }

    if (filterOb.benefit?.label === "할인율") {
      find.discountRatio = { $ne: 0 };
    }
    if (filterOb.benefit?.label === "할인금액") {
      find.discountPrice = { $ne: 0 };
    }
    if (filterOb.benefit?.label === "무료배송") {
      find.freeshipping = true;
    }
    if (filterOb.status?.label === "사용가능") {
      find.status = true;
    }
    if (filterOb.status?.label === "사용불가") {
      find.status = false;
    }
    if (filterOb.title !== "") {
      find.title = filterOb.title;
    }

    setPage(1);
    setFilterInfo(find);
  };

  const handleInitFilter = () => {
    setFilterOb({
      startingDate: "",
      endingDate: "",
      target: null,
      benefit: null,
      title: "",
      status: null,
    });
    setFilterInfo({});
    setPage(1);

    // productData();
  };

  const handleCouponStatusChange = async (state: boolean) => {
    const filtered = coupons.filter((el) => el.checked);
    const updateData = [];

    switch (state) {
      case true:
        for (let i in filtered) {
          updateData.push({
            _id: filtered[i]._id,
            setData: {
              status: true,
            },
          });
        }
        break;

      case false:
        for (let i in filtered) {
          updateData.push({
            _id: filtered[i]._id,
            setData: {
              status: false,
            },
          });
        }
        break;
    }

    const updateResult: any = await putUpdateDataBulk({ collection: "coupons", updateData });

    if (updateResult.status === 200) {
      alert("쿠폰 변경이 완료되었습니다.");
    }
    productData();
  };

  return (
    <div>
      <div className="flex justify-sb align-c">
        <p className="page-title">쿠폰 조회</p>
      </div>

      <div className="w100p filter-container flex1">
        <div className="flex">
          <div className="flex1 ml-4 mr-4 flex">
            <input
              value={filterOb.startingDate}
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
              data-placeholder="생성일(~부터)"
              required
              aria-required="true"
            />
            <input
              value={filterOb.endingDate}
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
              data-placeholder="생성일(~까지)"
              required
              aria-required="true"
            />
          </div>
          <div className="flex1 ml-4 mr-4">
            <SelectBox
              containerStyles={{ width: "100%" }}
              value={filterOb.target}
              onChange={(e: any) => handleChangeFilterInput("target", e)}
              options={Cateogyoptions1}
              noOptionsMessage={"상태가 없습니다."}
              placeholder="발급구분"
            />
          </div>
          <div className="flex1 ml-4 mr-4">
            <SelectBox
              containerStyles={{ width: "100%" }}
              value={filterOb.benefit}
              onChange={(e: any) => handleChangeFilterInput("benefit", e)}
              options={Cateogyoptions2}
              noOptionsMessage={"상태가 없습니다."}
              placeholder="혜택구분"
            />
          </div>
        </div>

        <div className="flex flex1 mt-8">
          <div
            style={{
              flex: 1,
              margin: "0 4px",
              height: 32,
              width: "100%",
              display: "flex",
            }}
          >
            <InputR
              size="full"
              placeholer="쿠폰명"
              value={filterOb.title}
              onChange={(e: any) => handleChangeFilterInput("title", e.target.value)}
              innerStyle={{ margin: 0 }}
            />
          </div>
          <div className="flex1 ml-4 mr-4" style={{ height: 32 }}>
            <SelectBox
              containerStyles={{ width: "100%" }}
              value={filterOb.status}
              onChange={(e: any) => handleChangeFilterInput("status", e)}
              options={Cateogyoptions3}
              noOptionsMessage={"상태가 없습니다."}
              placeholder="상태"
            />
          </div>
          <div className="flex flex1 ml-4 mr-4" style={{ height: 32 }}>
            <button onClick={handleFilterCoupon} className="btn-add-b w50p mr-4 h100p border-none">
              검색
            </button>
            <button onClick={handleInitFilter} className="w50p bg-white h100p ml-4 border-black">
              초기화
            </button>
          </div>
        </div>
      </div>

      <div className="mt-34 flex justify-sb align-c">
        <p>총 0건</p>
        <ButtonR
          onClick={() => {
            navigate("/site/coupon/add");
          }}
          name="쿠폰 등록"
        />
      </div>

      <div className="list-header mt-10 pl-18 pr-18">
        <div className="w5p">
          <input type="checkbox" />
        </div>

        <div className="w10p">
          <p>쿠폰번호</p>
        </div>

        <div className="w10p text-center">
          <p>쿠폰명</p>
        </div>

        <div className="w10p text-center">
          <p>혜택구분</p>
        </div>

        <div className="w10p text-center">
          <p>혜택</p>
        </div>

        <div className="w15p text-center">
          <p>사용기간</p>
        </div>

        <div className="w10p text-center">
          <p>발급수</p>
        </div>

        <div className="w10p text-center">
          <p>발급구분</p>
        </div>

        <div className="w10p text-center">
          <p>상태</p>
        </div>

        <div className="w10p text-center">
          <p>기능</p>
        </div>
      </div>

      {coupons?.map((couponItem: any, i: number) => (
        <div key={i} className={`list-content pl-18 pr-18`}>
          <div className={`flex align-c mt-8 mb-8`}>
            <div className="w5p">
              <input
                type="checkbox"
                checked={couponItem.checked || ""}
                onChange={(e: any) => handleCheckCoupon(couponItem)}
              />
            </div>

            <div className="w10p">
              <p>{couponItem._id.substr(6, 8)}</p>
            </div>

            <div className="w10p text-center">
              <p>{couponItem.title}</p>
            </div>

            <div className="w10p text-center">
              {couponItem.discountRatio !== 0 && <p>할인율</p>}
              {couponItem.discountPrice !== 0 && <p>할인금액</p>}
              {couponItem.freeshipping && <p>무료배송</p>}
            </div>

            <div className="w10p text-center">
              {couponItem.discountRatio !== 0 && <p>{couponItem.discountRatio}%</p>}
              {couponItem.discountPrice !== 0 && <p>{currency(couponItem.discountPrice)}</p>}
              {couponItem.freeshipping && <p>무료배송</p>}
            </div>

            <div className="w15p text-center">
              {couponItem.startingDate && couponItem.endingDate && (
                <p>
                  <span>{couponItem.startingDate ? timeFormat1(couponItem.startingDate) : ""}</span>{" "}
                  ~ <span>{couponItem.endingDate ? timeFormat1(couponItem.endingDate) : ""}</span>
                </p>
              )}

              {!couponItem.startingDate && !couponItem.endingDate && <p>-</p>}
            </div>
            <div className="w10p text-center">
              <p>발급수</p>
            </div>

            <div className="w10p text-center">
              {couponItem.targetMember && <p>고객 다운로드</p>}
              {!couponItem.targetMember && <p>조건부 발급</p>}
            </div>
            <div className="w10p text-center">
              <p>{couponItem.status ? "사용가능" : "사용불가"}</p>
            </div>

            <div className="w10p flex justify-c text-center">
              <ButtonR
                name="상세"
                color="white"
                styles={{ marginRight: 4 }}
                onClick={() => navigate(`/site/coupon/${couponItem._id}`)}
              />
              <ButtonR
                name="삭제"
                color="white"
                styles={{ marginRight: 4 }}
                onClick={async () => {
                  await deleteItem("coupons", couponItem._id, "쿠폰");
                  await productData();
                }}
              />
            </div>
          </div>
        </div>
      ))}

      <div className="mt-20 flex justify-sb align-c flex-wrap">
        <div className="flex">
          <ButtonR
            name="사용가능"
            color="white"
            styleClass="mr-4"
            onClick={() => handleCouponStatusChange(true)}
          />
          <ButtonR
            name="사용불가"
            color="white"
            styleClass="mr-4"
            onClick={() => handleCouponStatusChange(false)}
          />
        </div>

        <Pagination
          data={coupons}
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
