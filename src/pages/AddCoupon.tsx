import React, { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDatas, postAddBrand, postCollection, postUploadImage } from "../common/apis";
import ButtonR from "../components/ButtonR";
import InputR from "../components/InputR";
import forward from "../images/Forward.png";
import Select from "react-select";
import { moveValue } from "../common/utils";
import SelectBox from "../components/SelectBox";

interface IFile {
  file: File | null;
  url: string;
}
const membershipLevel = [
  {
    value: "모든 회원",
    label: "모든 회원",
  },
  {
    value: "Top Class",
    label: "Top Class",
  },
  {
    value: "Platinum",
    label: "Platinum",
  },
  {
    value: "Gold",
    label: "Gold",
  },
  {
    value: "Silver",
    label: "Silver",
  },
  {
    value: "Family",
    label: "Family",
  },
];

const AddMainEvent: React.FC = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState<string>("");
  const [files, setFiles] = useState<any>({
    thumbnail: {},
    detailImg: {},
  });
  const inputFileRef = useRef<any[]>([]);
  const [openStatus, setOpenStatus] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<any>(null);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any>({
    type: "category",
    products: [],
  });
  const [categories, setCategories] = useState<any[]>([]);
  const [subCategories, setSubCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [dates, setDates] = useState<{
    startingDate: string;
    endingDate: string;
    openingDate: string;
    winnerAnnouncementDate: string;
  }>({
    startingDate: "",
    endingDate: "",
    openingDate: "",
    winnerAnnouncementDate: "",
  });
  const [cautions, setCautions] = useState<string[]>([]);
  const [cautionText, setCautionText] = useState<string>("");
  const [eventType, setEventType] = useState<string>("normal");
  const [eventFeature, setEventFeature] = useState<string>("coupon");
  const [coupons, setCoupons] = useState<any[]>([]);
  const [selectedCoupon, setSelectedCoupon] = useState<any>({});
  const [links, setLinks] = useState<any>({
    btnName: "",
    path: "",
  });

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    if (eventType === "normal" && selectedCategory && relatedProducts.type === "category") {
      const targetIdx = categories.findIndex((el: any, i: number) => el === selectedCategory);

      let tempCategories = [];
      for (let i = 0; i < categories[targetIdx]?.subCategories?.length; i++) {
        tempCategories.push({
          value: categories[targetIdx].subCategories[i].optionName,
          label: categories[targetIdx].subCategories[i].optionName,
          categoryId: categories[targetIdx]._id,
        });
      }

      setSubCategories(tempCategories);
    }

    if (selectedCategory && relatedProducts.type === "brand") {
      selectedProducts();
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (selectedSubCategory) {
      selectedProducts();
    }

    if (eventType === "luckydraw") {
      selectedProducts();
      setRelatedProducts((prev: any) => {
        return {
          ...prev,
          type: "category",
          products: [],
        };
      });
      setSelectedCoupon({});
      setLinks({});
    }
  }, [selectedSubCategory, eventType]);

  const init = async () => {
    // 카테고리 불러오기
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
  };

  const selectedProducts = async () => {
    let find: any = {};
    if (eventType === "normal" && relatedProducts.type === "category") {
      find.categoryId = selectedSubCategory.categoryId;
      find.category2 = selectedSubCategory.value;
    }

    if (eventType === "normal" && relatedProducts.type === "brand") {
      find.brandId = selectedCategory._id;
    }

    if (eventType === "luckydraw") {
      find.luckyDraw = true;
    }

    const selectProducts: any = await getDatas({
      collection: "products",
      find: find,
    });

    const { data } = selectProducts;
    console.log("DATA", data);

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

  // 이벤트 등록
  const handleAddPromotion = async () => {
    const startingDate = new Date(dates.startingDate);
    const endingDate = new Date(dates.endingDate);
    const openingDate = new Date(dates.openingDate);
    const winnerAnnouncementDate = new Date(dates.winnerAnnouncementDate);
    const startingDateStamp = startingDate.getTime();
    const endingDateStamp = endingDate.getTime();
    const openingDateStamp = openingDate.getTime();
    const winnerAnnouncementDateStamp = winnerAnnouncementDate.getTime();

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

    // const formData = new FormData();
    // formData.append("file", files.file as File);
    // const getThumbnailUrl: any = await postUploadImage(formData);

    const postImagePromise = [];
    for (let i = 0; i < Object.keys(files).length; i++) {
      const formData = new FormData();
      formData.append("file", files[Object.keys(files)[i]].file as File);

      postImagePromise.push(postUploadImage(formData));
    }

    const imgArrResult: any[] = await Promise.all(postImagePromise);

    const body: any = {
      collection: "events",
      eventType,
      title,
      term: [startingDateStamp, endingDateStamp],
      imgUrl: imgArrResult[0]?.url,
      detailUrl: imgArrResult[1]?.url,
      winnerAnnouncementTimeStamp: winnerAnnouncementDateStamp, // eventType==="normal"일때 있으면 안됨.
      eventFeature, // eventType==="luckydraw"일때 있으면 안됨
      coupon: selectedCoupon,
      links,
      cautions,
      relatedProd,
      openingStamp: openingDateStamp,
      openStatus,
    };

    if (eventType === "normal" && eventFeature === "coupon") {
      delete body.winnerAnnouncementTimeStamp;
      delete body.links;
    }

    if (eventType === "normal" && eventFeature === "link") {
      delete body.winnerAnnouncementTimeStamp;
      delete body.coupon;
    }

    if (eventType === "luckydraw") {
      delete body.eventFeature;
      delete body.coupon;
      delete body.links;
    }

    const addResult: any = await postCollection(body);
    if (addResult.result && addResult.status === 200) {
      alert("이벤트 등록이 완료되었습니다.");
    }
    navigate(-1);
    // }
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
    setSelectedCategory(null);
    setSelectedSubCategory(null);
    // setSubCategories([]);
    // setProducts([]);
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

  const handleRelatedProdType = async (type: string) => {
    let tempcategories = [];
    if (type === "category") {
      const getCategories: any = await getDatas({
        collection: "categories",
      });

      const { data } = getCategories;

      for (let i = 0; i < data?.length; i++) {
        tempcategories.push({
          value: data[i]?.name,
          label: data[i]?.name,
          subCategories: data[i]?.subCategories,
          _id: data[i]?._id,
        });
      }
    }

    if (type === "brand") {
      const getBrands: any = await getDatas({
        collection: "brands",
      });

      const { data } = getBrands;

      for (let i = 0; i < data?.length; i++) {
        tempcategories.push({
          value: data[i]?.brandName,
          label: data[i]?.brandName,
          _id: data[i]?._id,
        });
      }
    }

    setCategories(tempcategories);
    setRelatedProducts((prev: any) => {
      return {
        ...prev,
        type: type,
      };
    });
  };

  return (
    <div>
      <div className="flex align-c justify-sb pb-30">
        <div className="flex alicn-c">
          <img onClick={() => navigate(-1)} className="img-close cursor mr-4" src={forward} />
          <p className="page-title mt-3">쿠폰 등록</p>
        </div>

        <p className="font-desc">
          <span className="font-red mr-4">*</span>
          <span>필수입력</span>
        </p>
      </div>

      <p className="font-category">발급 정보</p>

      <div className="product-field-wrapper mt-13 w100p">
        <div className="product-field mr-20">
          <p>
            쿠폰이름<span className="font-red">*</span>
          </p>
        </div>

        <div className="flex1">
          <InputR
            size="full"
            value={title}
            onChange={(e: any) => setTitle(e.target.value)}
            placeholer={"이벤트 제목을 입력해 주세요."}
          />
        </div>
      </div>

      <div className="mt-2 field-list-wrapper">
        <div className="product-field mr-20">
          <p>
            혜택구분<span className="font-red">*</span>
          </p>
        </div>

        <div className="mt-16 mb-16">
          <div className="flex align-c" style={{ height: 32 }}>
            <div onClick={() => setOpenStatus(true)} className="checkbox-c mr-4 cursor">
              {openStatus && <div className="checkbox-c-filled"></div>}
            </div>

            <p onClick={() => setOpenStatus(true)} className="mr-30 cursor">
              할인율
            </p>

            <InputR size={"small"} />
            <p>%</p>
          </div>

          <div className="flex align-c mt-10" style={{ height: 32 }}>
            <div className="checkbox-c mr-4 cursor">
              {<div className="checkbox-c-filled"></div>}
            </div>

            <p onClick={() => setOpenStatus(true)} className="mr-30 cursor">
              할인금액
            </p>

            <InputR size={"small"} />
            <p>원</p>
          </div>

          <div className="flex align-c mt-10" style={{ height: 32 }}>
            <div onClick={() => setOpenStatus(true)} className="checkbox-c mr-4 cursor">
              {openStatus && <div className="checkbox-c-filled"></div>}
            </div>

            <p onClick={() => setOpenStatus(true)} className="mr-30 cursor">
              무료배송
            </p>
          </div>
        </div>
      </div>

      <div className="mt-2 field-list-wrapper">
        <div className="product-field mr-20">
          <p>
            지급구분<span className="font-red">*</span>
          </p>
        </div>

        <div className="mt-16 mb-16">
          <div className="flex align-c" style={{ height: 32 }}>
            <div onClick={() => setOpenStatus(true)} className="checkbox-c mr-4 cursor">
              {openStatus && <div className="checkbox-c-filled"></div>}
            </div>

            <p onClick={() => setOpenStatus(true)} className="mr-30 cursor">
              대상자 지정 발급
            </p>

            <InputR size={"small"} />
            <p>%</p>
          </div>

          <div className="flex align-c mt-10" style={{ height: 32 }}>
            <div className="checkbox-c mr-4 cursor">
              {<div className="checkbox-c-filled"></div>}
            </div>

            <p onClick={() => setOpenStatus(true)} className="mr-30 cursor">
              고객 다운로드 발급
            </p>

            <SelectBox
              containerStyles={{ marginRight: 8 }}
              placeholder={"모든 회원"}
              value={selectedCategory}
              onChange={(e: any) => setSelectedCategory(e)}
              options={membershipLevel}
              noOptionsMessage={"카테고리가 없습니다."}
            />
          </div>
        </div>
      </div>

      {/* <div className="product-field-wrapper mt-2 w100p">
        <div className="product-field mr-20">
          <p>
            지급시점<span className="font-red">*</span>
          </p>
        </div>

        <div onClick={() => setOpenStatus(true)} className="checkbox-c mr-4 cursor">
          {openStatus && <div className="checkbox-c-filled"></div>}
        </div>

        <p onClick={() => setOpenStatus(true)} className="mr-30 cursor">
          즉시발급
        </p>

        <div onClick={() => setOpenStatus(false)} className="checkbox-c mr-4 cursor">
          {!openStatus && <div className="checkbox-c-filled" />}
        </div>

        <p onClick={() => setOpenStatus(false)} className="mr-30 cursor">
          지정한 시점
        </p>

        <div onClick={() => setOpenStatus(false)} className="checkbox-c mr-4 cursor">
          {!openStatus && <div className="checkbox-c-filled" />}
        </div>

        <p onClick={() => setOpenStatus(false)} className="mr-30 cursor">
          회원가입 시
        </p>
      </div> */}

      <div className="field-list-wrapper mt-2">
        <div className="product-field mr-20">
          <p>발급시점</p>
        </div>

        <div style={{ flex: 1 }} className="mt-16 mb-16">
          <div className="flex align-c">
            <div className="checkbox-c mr-4">
              {relatedProducts.type === "category" && <div className="checkbox-c-filled" />}
            </div>

            <p onClick={() => handleRelatedProdType("category")} className="cursor mr-20">
              즉시발급
            </p>

            <div className="checkbox-c mr-4">
              {relatedProducts.type === "category" && <div className="checkbox-c-filled" />}
            </div>

            <p onClick={() => handleRelatedProdType("category")} className="cursor mr-20">
              지정한 시점
            </p>

            <div className="checkbox-c mr-4">
              {relatedProducts.type === "brand" && <div className="checkbox-c-filled" />}
            </div>
            <p className="cursor mr-20" onClick={() => handleRelatedProdType("brand")}>
              회원가입 시
            </p>
          </div>

          {relatedProducts.type === "category" && (
            <>
              <div className="mt-20">
                <p className="font-14 font-bold">상품선택</p>
              </div>

              <div className="flex mt-10">
                <SelectBox
                  containerStyles={{ marginRight: 10 }}
                  placeholder={"카테고리 대분류"}
                  defaultValue={null}
                  onChange={(e: any) => setSelectedCategory(e)}
                  options={categories}
                  noOptionsMessage="카테고리가 없습니다."
                />
              </div>
            </>
          )}

          {relatedProducts.type === "brand" && (
            <>
              <div className="mt-20">
                <p className="font-14 font-bold">상품선택</p>
              </div>

              <div className="flex mt-10">
                <Select
                  classNamePrefix="react-select"
                  placeholder={"브랜드 선택"}
                  defaultValue={null}
                  onChange={(e: any) => setSelectedCategory(e)}
                  options={categories}
                  className="react-select-container"
                />
              </div>

              <div className="flex align-c mt-4">
                <Select
                  classNamePrefix="react-select"
                  placeholder={"상품선택"}
                  defaultValue={null}
                  onChange={(e: any) => onSelectProduct(e)}
                  // onChange={(e: any) => setSelectedProduct(e)}
                  options={products}
                  className="react-select-container"
                />
                {/* <p className="font-12">※ 최소 1개 ~ 최대 4개 선택 가능합니다.</p> */}
              </div>
            </>
          )}

          <p className="font-12 mt-10">
            *최대 10개까지 선택 가능하며, 상위 2개 상품은 메인에 노출됩니다.
          </p>

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

      <p className="font-category mt-40">사용 정보</p>

      <div className="field-list-wrapper mt-13 w100p">
        <div className="product-field mr-20">
          <p>
            사용기간
            <span className="font-red">*</span>
          </p>
        </div>

        <div className="mt-16 mb-16">
          <div className="flex1 flex align-c">
            <input
              style={{ border: "1px solid #cccccc", padding: "4px 10px", color: "#979797" }}
              type="date"
              value={dates.startingDate}
              onChange={(e: any) => {
                setDates((prev) => {
                  return {
                    ...prev,
                    startingDate: e.target.value,
                  };
                });
              }}
            />
            <p className="mr-8 ml-8">-</p>
            <input
              style={{ border: "1px solid #cccccc", padding: "4px 10px", color: "#979797" }}
              type="date"
              value={dates.endingDate}
              onChange={(e: any) => {
                setDates((prev) => {
                  return {
                    ...prev,
                    endingDate: e.target.value,
                  };
                });
              }}
            />
          </div>

          <p className="font-12 mt-10">
            * 사용기간을 지정하지 않을 경우 쿠폰 사용기간이 무기한으로 설정됩니다.
          </p>
        </div>
      </div>

      <div className="product-field-wrapper mt-2 w100p">
        <div className="product-field mr-20">
          <p>적용범위</p>
        </div>

        <div onClick={() => setOpenStatus(true)} className="checkbox-c mr-4 cursor">
          {openStatus && <div className="checkbox-c-filled"></div>}
        </div>

        <p onClick={() => setOpenStatus(true)} className="mr-30 cursor">
          주문서 쿠폰
        </p>

        <div onClick={() => setOpenStatus(false)} className="checkbox-c mr-4 cursor">
          {!openStatus && <div className="checkbox-c-filled" />}
        </div>

        <p onClick={() => setOpenStatus(false)} className="mr-35 cursor">
          상품 쿠폰
        </p>
      </div>

      {/* <div className="product-field-wrapper mt-2 w100p">
        <div className="product-field mr-20">
          <p>적용상품</p>
        </div>

        <div onClick={() => setOpenStatus(true)} className="checkbox-c mr-4 cursor">
          {openStatus && <div className="checkbox-c-filled"></div>}
        </div>

        <p onClick={() => setOpenStatus(true)} className="mr-30 cursor">
          전체
        </p>

        <div onClick={() => setOpenStatus(true)} className="checkbox-c mr-4 cursor">
          {openStatus && <div className="checkbox-c-filled"></div>}
        </div>

        <p onClick={() => setOpenStatus(true)} className="mr-30 cursor">
          특정상품
        </p>

        <div onClick={() => setOpenStatus(false)} className="checkbox-c mr-4 cursor">
          {!openStatus && <div className="checkbox-c-filled" />}
        </div>

        <p onClick={() => setOpenStatus(false)} className="mr-35 cursor">
          특정브랜드
        </p>
      </div> */}
      <div className="field-list-wrapper mt-2">
        <div className="product-field mr-20">
          <p>적용상품</p>
        </div>

        <div style={{ flex: 1 }} className="mt-16 mb-16">
          <div className="flex align-c">
            <div className="checkbox-c mr-4">
              {relatedProducts.type === "category" && <div className="checkbox-c-filled" />}
            </div>

            <p onClick={() => handleRelatedProdType("category")} className="cursor mr-20">
              전체
            </p>

            <div className="checkbox-c mr-4">
              {relatedProducts.type === "category" && <div className="checkbox-c-filled" />}
            </div>

            <p onClick={() => handleRelatedProdType("category")} className="cursor mr-20">
              특정상품
            </p>

            <div className="checkbox-c mr-4">
              {relatedProducts.type === "brand" && <div className="checkbox-c-filled" />}
            </div>
            <p className="cursor mr-20" onClick={() => handleRelatedProdType("brand")}>
              특정브랜드
            </p>
          </div>

          {relatedProducts.type === "category" && (
            <>
              <div className="mt-20">
                <p className="font-14 font-bold">상품선택</p>
              </div>

              <div className="flex mt-10">
                <SelectBox
                  containerStyles={{ marginRight: 10 }}
                  placeholder={"카테고리 대분류"}
                  defaultValue={null}
                  onChange={(e: any) => setSelectedCategory(e)}
                  options={categories}
                  noOptionsMessage="카테고리가 없습니다."
                />
                <SelectBox
                  placeholder={"카테고리 하위분류"}
                  defaultValue={null}
                  onChange={(e: any) => setSelectedSubCategory(e)}
                  options={subCategories}
                  noOptionsMessage="카테고리가 없습니다."
                />
              </div>

              <div className="flex align-c mt-4">
                <SelectBox
                  placeholder={"상품선택"}
                  defaultValue={null}
                  onChange={(e: any) => onSelectProduct(e)}
                  options={products}
                  noOptionsMessage="상품이 없습니다."
                />
                {/* <p className="font-12">※ 최소 1개 ~ 최대 4개 선택 가능합니다.</p> */}
              </div>
            </>
          )}

          {relatedProducts.type === "brand" && (
            <>
              <div className="mt-20">
                <p className="font-14 font-bold">상품선택</p>
              </div>

              <div className="flex mt-10">
                <SelectBox
                  placeholder={"브랜드 선택"}
                  defaultValue={null}
                  onChange={(e: any) => setSelectedCategory(e)}
                  options={categories}
                  noOptionsMessage={"브랜드가 없습니다."}
                />
              </div>

              <div className="flex align-c mt-4">
                <SelectBox
                  placeholder={"상품선택"}
                  defaultValue={null}
                  onChange={(e: any) => onSelectProduct(e)}
                  // onChange={(e: any) => setSelectedProduct(e)}
                  options={products}
                  noOptionsMessage={"상품이 없습니다."}
                />
                {/* <p className="font-12">※ 최소 1개 ~ 최대 4개 선택 가능합니다.</p> */}
              </div>
            </>
          )}

          <p className="font-12 mt-10">
            *최대 10개까지 선택 가능하며, 상위 2개 상품은 메인에 노출됩니다.
          </p>

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
          <p>사용조건</p>
        </div>

        <div onClick={() => setOpenStatus(true)} className="checkbox-c mr-4 cursor">
          {openStatus && <div className="checkbox-c-filled"></div>}
        </div>

        <p onClick={() => setOpenStatus(true)} className="mr-30 cursor">
          사용제한없음
        </p>

        <div onClick={() => setOpenStatus(false)} className="checkbox-c mr-4 cursor">
          {!openStatus && <div className="checkbox-c-filled" />}
        </div>

        <p onClick={() => setOpenStatus(false)} className="mr-30 cursor">
          최대 할인 금액 설정
        </p>

        <div onClick={() => setOpenStatus(false)} className="checkbox-c mr-4 cursor">
          {!openStatus && <div className="checkbox-c-filled" />}
        </div>

        <p onClick={() => setOpenStatus(false)} className="mr-30 cursor">
          사용가능 기준금액 설정
        </p>
      </div>

      <div className="product-field-wrapper mt-2 w100p">
        <div className="product-field mr-20">
          <p>상태</p>
        </div>

        <div onClick={() => setOpenStatus(true)} className="checkbox-c mr-4 cursor">
          {openStatus && <div className="checkbox-c-filled"></div>}
        </div>

        <p onClick={() => setOpenStatus(true)} className="mr-30 cursor">
          사용가능
        </p>

        <div onClick={() => setOpenStatus(false)} className="checkbox-c mr-4 cursor">
          {!openStatus && <div className="checkbox-c-filled" />}
        </div>

        <p onClick={() => setOpenStatus(false)} className="mr-30 cursor">
          사용불가
        </p>
      </div>

      <div className="flex justify-fe mt-10">
        {/* <div>
          <ButtonR name={"삭제"} onClick={() => {}} color={"white"} />
        </div> */}
        <div className="flex">
          <ButtonR name={"취소"} onClick={() => navigate(-1)} styleClass={"mr-4"} color={"white"} />
          <ButtonR name={"저장"} onClick={handleAddPromotion} />
        </div>
      </div>
    </div>
  );
};

export default AddMainEvent;
// {
//   title:"",
//   benefitType:{
//     discountPercentage:false,
//     discountedAmount:false,
//     discountPercentageInt:0,
//     discountedAmountInt:0,
//     freeship:false,
//   },
//   couponClassification: {
//     targetCustomers:false,
//     customerDownload:false,
//     customerList:[],
//   },
//   couponIssuanceMoment : "",
//   couponIssuanceTimestamp:0,
//   usagePeriod:[],
//
// }
