import React, { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getDatas,
  postAddBrand,
  postCollection,
  postUploadImage,
  putUpdateData,
} from "../common/apis";
import ButtonR from "../components/ButtonR";
import InputR from "../components/InputR";
import forward from "../images/Forward.png";
import sale from "../images/sale_s.png";
import new_s from "../images/new_s.png";
import Select from "react-select";
import sample from "../images/sample_img.png";
import { timeFormat2 } from "../common/utils";
import SelectBox from "../components/SelectBox";

interface IFile {
  file: File | null;
  url: string;
}

const Cateogyoptions1 = [
  { value: "대분류 카테고리1", label: "대분류 카테고리1" },
  { value: "대분류 카테고리2", label: "대분류 카테고리2" },
  { value: "대분류 카테고리3", label: "대분류 카테고리3" },
];

const AddMainBrand: React.FC = () => {
  const navigate = useNavigate();
  const params = useParams();
  const { mainBrandId } = params;
  const [brand, setBrand] = useState<string>("");
  const [desc, setDesc] = useState<string>("");
  const [txtLength, setTxtLength] = useState(0);
  const [file, setFile] = useState<IFile>({
    file: null,
    url: "",
  });
  const fileRef = useRef<any>(null);
  const [openStatus, setOpenStatus] = useState<boolean>(true);
  const [selectedBrand, setSelectedBrand] = useState<any>(null);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any>({
    type: "brand",
    products: [],
  });

  const [brands, setBrands] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [dates, setDates] = useState<{
    startingDate: string;
    endingDate: string;
    openingDate: string;
  }>({
    startingDate: "",
    endingDate: "",
    openingDate: "",
  });

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    selectedProducts();
  }, [selectedBrand]);

  const init = async () => {
    //브랜드 불러오기
    const getBrands: any = await getDatas({
      collection: "brands",
    });

    const selectedBrandDatas: any = await getDatas({
      collection: "mainBrands",
      find: { _id: mainBrandId },
    });

    const { data } = getBrands;
    const selectedData = selectedBrandDatas.data;

    let tempBrands = [];
    for (let i = 0; i < data?.length; i++) {
      tempBrands.push({
        value: data[i]?.brandName,
        label: data[i]?.brandName,
        _id: data[i]?._id,
        imgUrl: data[i]?.imgUrl,
      });
    }

    setBrand(selectedData[0]?.brandName);
    setDesc(selectedData[0]?.desc);
    setOpenStatus(selectedData[0]?.openStatus);
    setDates((prev) => {
      return {
        ...prev,
        openingDate: timeFormat2(selectedData[0]?.openingStamp),
      };
    });

    setSelectedBrand({
      value: selectedData[0].brandName,
      label: selectedData[0].brandName,
      _id: selectedData[0].brandId,
      imgUrl: selectedData[0].imgUrl,
    });

    setRelatedProducts({
      type: "brand",
      products: selectedData[0].relatedProd,
    });

    setBrands(tempBrands);
  };

  const selectedProducts = async () => {
    const find = { brandId: selectedBrand._id };

    const selectProducts: any = await getDatas({
      collection: "products",
      find: find,
    });

    const { data } = selectProducts;

    let tempProductSelect: any = [];
    for (let i = 0; i < data?.length; i++) {
      tempProductSelect.push({
        value: data[i].productNameK,
        label: data[i].productNameK,
        ...data[i],
      });
    }

    setProducts(tempProductSelect);
  };

  const onChangeHandler = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    setDesc(e.target.value);
    setTxtLength(e.target.value.length);
  }, []);

  // 이미지 첨부 핸들러

  // 메인페이지 브랜드 수정
  const handleUpdateMainBrand = async () => {
    const openingDate = new Date(dates.openingDate);
    const openingDateStamp = openingDate.getTime();

    const relatedProd = [];
    for (let i in relatedProducts.products) {
      relatedProd.push({
        _id: relatedProducts.products[i]._id,
        productNameK: relatedProducts.products[i].productNameK,
        thumbnail: relatedProducts.products[i].thumbnail,
        originalPrice: relatedProducts.products[i].price,
        discounted: relatedProducts.products[i].discounted,
      });
    }

    const body = {
      collection: "mainBrands",
      _id: mainBrandId,
      brandName: selectedBrand.value,
      brandId: selectedBrand._id,
      desc,
      openStatus,
      relatedProd,
      openingStamp: openingDateStamp,
    };
    const addResult: any = await putUpdateData(body);
    if (addResult.result && addResult.status === 200) {
      alert("메인스크린 브랜드 수정이 완료되었습니다.");
    }
    navigate(-1);
  };

  const onSelectProduct = (e: any) => {
    let tempProds = [...relatedProducts.products];

    let isValid = true;
    for (let i in tempProds) {
      if (e._id === tempProds[i]._id) {
        isValid = false;
      }
    }

    if (isValid) {
      tempProds.push(e);
      setRelatedProducts((prev: any) => {
        return {
          ...prev,
          type: prev.type,
          products: tempProds,
        };
      });
    }

    setSelectedProduct(null);
  };

  const handleDeleteRelatedProd = (_id: string) => {
    const tempProds = [...relatedProducts.products];
    const filterData = tempProds.filter((el) => el._id !== _id);

    setRelatedProducts((prev: any) => {
      return {
        ...prev,
        type: prev.type,
        products: filterData,
      };
    });
  };

  return (
    <div>
      <div className="flex align-c justify-sb pb-30">
        <div className="flex alicn-c">
          {/* <img onClick={() => navigate(-1)} className="img-close cursor mr-4" src={forward} /> */}
          <p className="page-title">첫 화면 관리 {">"} 브랜드 수정</p>
        </div>

        <p className="font-desc">
          <span className="font-red mr-4">*</span>
          <span>필수입력</span>
        </p>
      </div>

      <div className="product-field-wrapper mt-2 w100p">
        <div className="product-field mr-20">
          <p>
            브랜드<span className="font-red">*</span>
          </p>
        </div>

        <div className="flex">
          <SelectBox
            placeholder={"브랜드 선택"}
            value={selectedBrand}
            onChange={(e: any) => {
              setSelectedBrand(e);
              setRelatedProducts((prev: any) => {
                return {
                  ...prev,
                  type: prev.type,
                  products: [],
                };
              });
            }}
            options={brands}
            noOptionsMessage={"브랜드가 없습니다."}
          />
        </div>
      </div>

      <div className="field-list-wrapper mt-2">
        <div className="product-field mr-20">
          <p>
            브랜드 소개<span className="font-red">*</span>
          </p>
        </div>

        <div className="mt-16 mb-16 flex1" style={{ position: "relative" }}>
          <textarea
            value={desc}
            onChange={(e) => onChangeHandler(e)}
            className="input-textarea"
            placeholder="공백포함 40자 이내"
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
            {txtLength}/100
          </div>
        </div>
      </div>

      {selectedBrand?.imgUrl && (
        <div className="mt-2 field-list-wrapper">
          <div className="product-field mr-20">
            <p>
              대표이미지
              <span className="font-red">*</span>
            </p>
            <p>(썸네일)</p>
          </div>

          <div className="flex f-direction-column">
            {selectedBrand?.imgUrl && (
              <img src={selectedBrand?.imgUrl} style={{ width: 278, height: "auto" }} />
            )}
          </div>
        </div>
      )}

      <div className="field-list-wrapper mt-2">
        <div className="product-field mr-20 flex">
          <p>대표상품 2개</p>
          <span className="font-red">*</span>
        </div>

        <div style={{ flex: 1 }} className="mb-16 mt-10">
          {relatedProducts.type === "brand" && (
            <div className="flex align-c">
              <div className="flex">
                <div
                  style={{
                    width: 273,
                    height: 32,
                    display: "flex",
                    alignItems: "center",
                    marginRight: 20,
                    border: "1px solid hsl(0, 0%, 80%)",
                    paddingLeft: 10,
                    color: "#333333",
                    fontWeight: 400,
                  }}
                >
                  <p>{selectedBrand ? selectedBrand.value : "브랜드 선택"}</p>
                </div>
              </div>

              <div className="flex align-c">
                <SelectBox
                  placeholder={"상품선택"}
                  value={products?.filter(function (option) {
                    return option.value === selectedProduct;
                  })}
                  onChange={(e: any) => onSelectProduct(e)}
                  options={products}
                  noOptionsMessage={"상품이 없습니다."}
                />
              </div>
            </div>
          )}

          {relatedProducts?.products?.length !== 0 && (
            <div className="mt-4">
              {relatedProducts?.products.map((item: any, i: number) => (
                <div key={i} className="flex justify-sb align-c border-bottom-gray pt-10 pb-10">
                  <div className="flex align-c">
                    <img src={item.thumbnail} className="list-img mr-10" />
                    <p>{item.productNameK}</p>
                  </div>

                  <ButtonR
                    onClick={() => handleDeleteRelatedProd(item._id)}
                    color={"white"}
                    name="삭제"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="product-field-wrapper mt-2 w100p">
        <div className="product-field mr-20">
          <p>공개시작일</p>
        </div>

        <div className="flex1">
          <input
            style={{ border: "1px solid #cccccc", padding: "4px 10px", color: "#979797" }}
            type="date"
            value={dates.openingDate}
            onChange={(e: any) => {
              setDates((prev) => {
                return {
                  ...prev,
                  openingDate: e.target.value,
                };
              });
            }}
          />
        </div>
      </div>

      <div className="product-field-wrapper mt-2 w100p">
        <div className="product-field mr-20">
          <p>공개여부</p>
        </div>

        <div onClick={() => setOpenStatus(true)} className="checkbox-c mr-4 cursor">
          {openStatus && <div className="checkbox-c-filled"></div>}
        </div>

        <p onClick={() => setOpenStatus(true)} className="mr-30 cursor">
          공개
        </p>

        <div onClick={() => setOpenStatus(false)} className="checkbox-c mr-4 cursor">
          {!openStatus && <div className="checkbox-c-filled" />}
        </div>

        <p onClick={() => setOpenStatus(false)} className="mr-35 cursor">
          비공개
        </p>
      </div>

      <div className="flex justify-fe mt-10">
        <div className="flex">
          <ButtonR name={"취소"} onClick={() => navigate(-1)} styleClass={"mr-4"} color={"white"} />
          <ButtonR name={"저장"} onClick={handleUpdateMainBrand} />
        </div>
      </div>
    </div>
  );
};

export default AddMainBrand;
