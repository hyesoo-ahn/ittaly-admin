import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { getDatas } from "../common/apis";
import { currency, timeFormat1 } from "../common/utils";
import ButtonR from "../components/ButtonR";
import InputR from "../components/InputR";
import SelectBox from "../components/SelectBox";

const Cateogyoptions1 = [
  { value: "onSale", label: "판매중" },
  { value: "saleStopped", label: "판매중지" },
  { value: "soldOut", label: "일시품절" },
];

interface ISearchForm {
  productNameK: string;
  brandName: string;
  productCode: string;
  salesStatus: {
    value: string;
    label: string;
  };
  category: {
    value: string;
    label: string;
  };
}

export default function ProductManagement(): JSX.Element {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<any>("");
  const [products, setProducts] = useState<any[]>([]);
  const [searchForm, setSearchForm] = useState<ISearchForm>({
    productNameK: "",
    brandName: "",
    productCode: "",
    category: {
      value: "",
      label: "",
    },
    salesStatus: {
      value: "",
      label: "",
    },
  });
  const [categories, setCategories] = useState<any>([]);
  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    const productData: any = await getDatas({
      collection: "products",
    });
    const getCategories: any = await getDatas({
      collection: "categories",
    });

    let tempcategories = [];
    for (let i = 0; i < getCategories?.data?.length; i++) {
      tempcategories.push({
        value: getCategories?.data[i]?.name,
        label: getCategories?.data[i]?.name,
        subCategories: getCategories?.data[i]?.subCategories,
        _id: getCategories?.data[i]?._id,
      });
    }

    setCategories(tempcategories);
    setProducts(productData.data);
  };

  const handleSearchResult = async () => {
    let find: any = {};
    if (searchForm.productNameK !== "") find.productNameK = searchForm.productNameK;
    if (searchForm.brandName !== "") find.brand = searchForm.brandName;
    if (searchForm.productCode !== "") find.productCode = searchForm.productCode;
    if (searchForm.category.value !== "") find.category = searchForm.category.value;
    if (searchForm.salesStatus.value !== "") find.saleStatus = searchForm.salesStatus.value;

    const { data }: any = await getDatas({
      collection: "products",
      find: find,
    });

    setProducts(data);
  };

  const handleSearchInit = () => {
    setSearchForm({
      productNameK: "",
      brandName: "",
      productCode: "",
      category: {
        value: "",
        label: "",
      },
      salesStatus: {
        value: "",
        label: "",
      },
    });

    init();
  };

  return (
    <div>
      <div className="flex justify-sb align-c">
        <p className="page-title">상품관리</p>
      </div>

      <div className="w100p filter-container" style={{ flex: 1 }}>
        <div className="flex justify-sb" style={{ flex: 1, width: "100%" }}>
          <div style={{ width: "33%" }}>
            <InputR
              onChange={(e: any) => {
                setSearchForm((prev: ISearchForm) => {
                  return {
                    ...prev,
                    productNameK: e.target.value,
                  };
                });
              }}
              value={searchForm.productNameK}
              size="full"
              placeholer="상품명 입력"
            />
          </div>
          <div style={{ width: "33%" }}>
            <InputR
              onChange={(e: any) => {
                setSearchForm((prev: ISearchForm) => {
                  return {
                    ...prev,
                    brandName: e.target.value,
                  };
                });
              }}
              value={searchForm.brandName}
              size="full"
              placeholer="브랜드명 입력"
            />
          </div>
          <div style={{ width: "33%" }}>
            <InputR
              size="full"
              onChange={(e: any) => {
                setSearchForm((prev: ISearchForm) => {
                  return {
                    ...prev,
                    productCode: e.target.value,
                  };
                });
              }}
              value={searchForm.productCode}
              placeholer="상품코드 입력"
            />
          </div>
        </div>

        <div className="flex justify-sb">
          <SelectBox
            containerStyles={{ width: "33%", marginTop: 8 }}
            placeholder={"카테고리"}
            defaultValue={null}
            onChange={(e: any) => {
              setSearchForm((prev: ISearchForm) => {
                return {
                  ...prev,
                  category: e,
                };
              });
            }}
            options={categories}
            noOptionsMessage={"등록된 카테고리가 없습니다."}
          />

          <SelectBox
            containerStyles={{ width: "33%", marginTop: 8 }}
            placeholder={"판매상태"}
            defaultValue={null}
            onChange={(e: any) => {
              setSearchForm((prev: ISearchForm) => {
                return {
                  ...prev,
                  salesStatus: e,
                };
              });
            }}
            options={Cateogyoptions1}
            noOptionsMessage={"등록된 카테고리가 없습니다."}
          />

          <div
            style={{ width: "33%", marginTop: 8, height: 32 }}
            className="flex align-c justify-c"
          >
            <button onClick={handleSearchResult} className="btn-add-b search-btn">
              검색
            </button>

            <button onClick={handleSearchInit} className="search-btn-reset">
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
                onClick={() => navigate(`/product/detail/${productItem._id}`)}
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
