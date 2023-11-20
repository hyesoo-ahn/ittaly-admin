import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { getAdminLookup, getDatas } from "../common/apis";
import { currency, timeFormat1 } from "../common/utils";
import ButtonR from "../components/ButtonR";
import InputR from "../components/InputR";
import SelectBox from "../components/SelectBox";

const Cateogyoptions1 = [
  { value: "대분류 카테고리1", label: "대분류 카테고리1" },
  { value: "대분류 카테고리2", label: "대분류 카테고리2" },
  { value: "대분류 카테고리3", label: "대분류 카테고리3" },
];

export default function RestockRequest(): JSX.Element {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<any>("");
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    // const productData: any = await getDatas({
    //   collection: "restockRequest",
    //   sort: { sort: -1 },
    // });
    // setData(productData.data);
    let requests: any = await getAdminLookup({
      collection: "restockRequest",
      lookupFrom: "products",
      addField: "productId",
      as: "productInfo",
    });
    requests = requests.data;

    let brands: any = await getAdminLookup({
      collection: "restockRequest",
      lookupFrom: "brands",
      addField: "brandId",
      as: "brandInfo",
    });
    brands = brands.data;

    let users: any = await getAdminLookup({
      collection: "restockRequest",
      lookupFrom: "users",
      addField: "userId",
      as: "userInfo",
    });
    users = users.data;

    for (let i = 0; i < requests.length; i++) {
      requests[i].userInfo = users[i].userInfo;
      requests[i].brandInfo = brands[i].brandInfo;
    }

    console.log(requests);
    setData(requests);
  };

  return (
    <div>
      <div className="flex justify-sb align-c">
        <p className="page-title">입고요청 관리</p>
      </div>

      <div className="w100p filter-container flex1">
        <div className="flex">
          <div className="flex1 ml-4 mr-4 flex">
            <input
              type="date"
              className="main-event-date-input mr-4"
              data-placeholder="작성일(~부터)"
              required
              aria-required="true"
            />
            <input
              type="date"
              className="main-event-date-input ml-4"
              data-placeholder="작성일(~까지)"
              required
              aria-required="true"
            />
          </div>
          <div className="flex1 ml-4 mr-4">
            <SelectBox
              containerStyles={{ width: "100%" }}
              value={selected}
              onChange={(e: any) => setSelected(e)}
              options={Cateogyoptions1}
              noOptionsMessage={"상태가 없습니다."}
              placeholder="주문상태"
            />
          </div>
          <div className="flex1 ml-4 mr-4 flex">
            <button className="btn-add-b w50p mr-4 border-none h100p">검색</button>
            <button className="w50p bg-white ml-4 border-black h100p">초기화</button>
          </div>
        </div>
      </div>

      <div className="mt-34 flex justify-sb align-c">
        <p>총 0건</p>
      </div>

      <div className="list-header mt-10 pl-18 pr-18">
        <div className="w10p text-left pl-6 pl-6">
          <p>카테고리</p>
        </div>
        <div className="w20p text-center pl-6 pl-6">
          <p>브랜드명</p>
        </div>
        <div className="w30p text-center pl-6 pl-6">
          <p>상품명</p>
        </div>
        <div className="w10p text-center pl-6 pl-6">
          <p>작성자</p>
        </div>
        <div className="w20p text-center pl-6 pl-6">
          <p>작성일자</p>
        </div>
        <div className="w10p text-center pl-6 pl-6">
          <p>기능</p>
        </div>
      </div>

      <div className={`list-content pl-18 pr-18`}>
        <div className={`flex align-c mt-8 mb-8`}>
          <div className="w10p text-left pl-6 pl-6">
            <p>패션잡화</p>
          </div>
          <div className="w20p text-center pl-6 pl-6">
            <p>Valentino Garavani</p>
          </div>
          <div className="w30p text-center pl-6 pl-6">
            <p>Valentino Garavani Rockstud Tote Bag</p>
          </div>

          <div className="w10p text-center pl-6 pl-6">
            <p>se29dsk</p>
          </div>
          <div className="w20p text-center pl-6 pl-6">
            <p>2023. 01. 01</p>
          </div>
          <div className="w10p text-center pl-6 pl-6">
            <ButtonR
              name={"상세"}
              onClick={() => navigate(`/customer/restockrequest/${"12345"}`)}
              color="white"
            />
          </div>
        </div>
      </div>

      <div className="mt-20 flex justify-fe align-c flex-wrap">
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
