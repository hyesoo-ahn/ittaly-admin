import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { getDatas } from "../common/apis";
import { currency, timeFormat1 } from "../common/utils";
import ButtonR from "../components/ButtonR";
import InputR from "../components/InputR";

const Cateogyoptions1 = [
  { value: "대분류 카테고리1", label: "대분류 카테고리1" },
  { value: "대분류 카테고리2", label: "대분류 카테고리2" },
  { value: "대분류 카테고리3", label: "대분류 카테고리3" },
];

export default function MainEvent(): JSX.Element {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<any>("");

  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    const productData: any = await getDatas({
      collection: "products",
    });
    setProducts(productData.data);
  };

  return (
    <div>
      <div className="flex justify-sb align-c">
        <p className="page-title">이벤트 관리</p>
      </div>

      <div className="w100p filter-container" style={{ flex: 1 }}>
        <div className="flex" style={{ flex: 1, width: "100%" }}>
          <div style={{ width: "33.333%" }} className="mr-10">
            <InputR size="full" placeholer="상품명 입력" />
          </div>
          <div style={{ width: "33.333%" }} className="mr-10">
            <InputR size="full" placeholer="브랜드명 입력" />
          </div>
          <div style={{ width: "33.333%" }}>
            <InputR size="full" placeholer="상품코드 입력" />
          </div>
        </div>

        <div className="flex">
          <div
            style={{
              width: "33.333%",

              marginRight: 4,
            }}
          >
            <Select
              classNamePrefix="react-select"
              placeholder={"대분류"}
              defaultValue={null}
              onChange={(e: any) => setSelected(e.value)}
              options={Cateogyoptions1}
              className="react-select-container react-select-container2 mt-8"
              noOptionsMessage={({ inputValue }) => "등록된 카테고리가 없습니다."}
            />
          </div>
          <div style={{ width: "33.333%", marginRight: 4 }}>
            <Select
              classNamePrefix="react-select"
              placeholder={"대분류"}
              defaultValue={null}
              onChange={(e: any) => setSelected(e.value)}
              options={Cateogyoptions1}
              className="react-select-container react-select-container2 mt-8"
              noOptionsMessage={({ inputValue }) => "등록된 카테고리가 없습니다."}
            />
          </div>
          <div
            style={{ width: "33.333%", flex: 1, marginTop: 8, height: 32 }}
            className="flex align-c justify-c"
          >
            <button
              className="btn-add-b"
              style={{
                width: "50%",
                marginRight: 2,
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
                marginLeft: 2,
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
        <ButtonR
          onClick={() => {
            navigate("/product/addproduct");
          }}
          name="상품 등록"
        />
      </div>

      <div className="list-header mt-10 pl-18 pr-18">
        <div className="w5p">
          <input type="checkbox" />
        </div>

        <div className="w10p">
          <p>상품코드</p>
        </div>

        <div className="w35p">
          <p>상품명</p>
        </div>

        <div className="w15p">
          <p>브랜드</p>
        </div>

        <div className="w10p">
          <p>판매상태</p>
        </div>

        <div className="w10p">
          <p>판매가</p>
        </div>

        <div className="text-center w15p">
          <p>기능</p>
        </div>
      </div>

      {products?.map((productItem: any, i: number) => (
        <div key={i} className="list-content pl-18 pr-18">
          <div className="flex align-c mt-8 mb-8">
            <div className="w5p">
              <input type="checkbox" />
            </div>

            <div className="w10p">
              <p>{productItem.productCode}</p>
            </div>

            <div className="w35p">
              <p>{productItem.productNameK}</p>
            </div>

            <div className="w15p">
              <p>{productItem.brand}</p>
            </div>

            <div className="w10p">
              {productItem.saleStatus === "onSale" && <p>판매중</p>}
              {productItem.saleStatus === "saleStopped" && <p>판매중지</p>}
              {productItem.saleStatus === "soldOut" && <p>일시품절</p>}
            </div>

            <div className="w10p">
              <p>{currency(productItem.price)}원</p>
            </div>

            <div className="text-center w15p flex justify-c">
              <ButtonR
                name="상세"
                color="white"
                styles={{ marginRight: 4 }}
                onClick={() => {}}
                // onClick={() => navigate(`/banner/${productItem._id}`)}
              />
              <ButtonR
                name="삭제"
                color="white"
                styles={{ marginRight: 4 }}
                onClick={async () => {
                  // await deleteItem("banners", aBanner._id, "배너");
                  // await init();
                }}
              />
            </div>
          </div>
        </div>
      ))}

      <div className="mt-20 flex justify-sb align-c flex-wrap">
        <div className="flex">
          <ButtonR name="선택삭제" color="white" onClick={() => {}} styles={{ marginRight: 4 }} />
          <ButtonR name="판매중" color="white" onClick={() => {}} styles={{ marginRight: 4 }} />
          <ButtonR name="판매중지" color="white" onClick={() => {}} styles={{ marginRight: 4 }} />
          <ButtonR name="일시품절" color="white" onClick={() => {}} styles={{ marginRight: 4 }} />
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
//
