import React, { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDatas, postAddBrand, postCollection, postUploadImage } from "../common/apis";
import ButtonR from "../components/ButtonR";
import InputR from "../components/InputR";
import forward from "../images/Forward.png";
import up_g from "../images/up_g.png";
import down_g from "../images/down_g.png";
import up_b from "../images/up_b.png";
import down_b from "../images/down_b.png";
import Select from "react-select";
import { moveValue } from "../common/utils";
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
      startingDate: startingDateStamp,
      endingDate: endingDateStamp,

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

  const handleUploadClick = async (idx: number) => {
    inputFileRef?.current[idx]?.click();
  };

  const handleFileChange = (evt: any, type: string) => {
    const file = evt.target.files?.[0];

    setFiles((prev: any) => {
      return {
        ...prev,
        [type]: {
          file: file,
          fileUrl: URL.createObjectURL(file),
        },
      };
    });
  };

  const handleAddCaution = () => {
    const tempCautions = [...cautions];
    tempCautions.push(cautionText);

    setCautions(tempCautions);
    setCautionText("");
  };

  const handleMoveOrder = (array: string[], fromIndex: number, toIndex: number) => {
    const newArr: any = moveValue(array, fromIndex, toIndex);

    setCautions([...newArr]);
  };

  const handleDeleteListItem = (i: number) => {
    let tempArr = [];
    tempArr = [...cautions];
    tempArr.splice(i, 1);
    setCautions(tempArr);
  };

  return (
    <div>
      <div className="flex align-c justify-sb pb-30">
        <div className="flex alicn-c">
          <img onClick={() => navigate(-1)} className="img-close cursor mr-4" src={forward} />
          <p className="page-title mt-3">이벤트 등록</p>
        </div>

        <p className="font-desc">
          <span className="font-red mr-4">*</span>
          <span>필수입력</span>
        </p>
      </div>

      <div className="product-field-wrapper mt-2 w100p">
        <div className="product-field mr-20">
          <p>
            이벤트 유형<span className="font-red">*</span>
          </p>
        </div>

        <div onClick={() => setEventType("normal")} className="checkbox-c mr-4 cursor">
          {eventType === "normal" && <div className="checkbox-c-filled"></div>}
        </div>

        <p onClick={() => setEventType("normal")} className="mr-30 cursor">
          일반
        </p>

        <div onClick={() => setEventType("luckydraw")} className="checkbox-c mr-4 cursor">
          {eventType === "luckydraw" && <div className="checkbox-c-filled" />}
        </div>

        <p onClick={() => setEventType("luckydraw")} className="mr-30 cursor">
          럭키드로우
        </p>

        <div onClick={() => setEventType("recommend")} className="checkbox-c mr-4 cursor">
          {eventType === "recommend" && <div className="checkbox-c-filled" />}
        </div>

        <p onClick={() => setEventType("recommend")} className="mr-30 cursor">
          추천인
        </p>
      </div>
      <div className="product-field-wrapper mt-2 w100p">
        <div className="product-field mr-20">
          <p>
            이벤트명<span className="font-red">*</span>
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

      <div className="product-field-wrapper mt-2 w100p">
        <div className="product-field mr-20">
          <p>
            {eventType === "normal" ? "이벤트 기간" : "응모기간"}
            <span className="font-red">*</span>
          </p>
        </div>

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
      </div>

      {eventType === "luckydraw" && (
        <div className="product-field-wrapper mt-2 w100p">
          <div className="product-field mr-20">
            <p>
              당첨자 발표일
              <span className="font-red">*</span>
            </p>
          </div>

          <div className="flex1 flex align-c">
            <input
              style={{ border: "1px solid #cccccc", padding: "4px 10px", color: "#979797" }}
              type="date"
              value={dates.winnerAnnouncementDate}
              onChange={(e: any) => {
                setDates((prev) => {
                  return {
                    ...prev,
                    winnerAnnouncementDate: e.target.value,
                  };
                });
              }}
            />
          </div>
        </div>
      )}

      <div className="mt-2 field-list-wrapper">
        <div className="product-field mr-20">
          <p>
            대표이미지
            <span className="font-red">*</span>
          </p>
          <p>(썸네일)</p>
        </div>

        <div className="flex f-direction-column">
          <div className="list-header-content align-c" style={{ border: "none" }}>
            <div className="mr-12">
              <input
                style={{ display: "none" }}
                ref={(el) => (inputFileRef.current[0] = el)}
                onChange={(e) => handleFileChange(e, "thumbnail")}
                type="file"
              />
              <ButtonR onClick={() => handleUploadClick(0)} name={`이미지 추가 0/1`} />
            </div>

            <p className="font-desc">이미지 1장, 1080px x 1080px</p>
          </div>

          {files?.thumbnail?.fileUrl && (
            <img src={files.thumbnail.fileUrl} style={{ width: 278, height: "auto" }} />
          )}

          {files?.thumbnail?.fileUrl && (
            <div className="flex mt-10 mb-16">
              {/* <ButtonR
                name={`변경`}
                color={"white"}
                onClick={() => {}}
                // onClick={() => handleUploadClick(0)}
                styles={{ marginRight: 4 }}
              /> */}
              <ButtonR name={`삭제`} color={"white"} onClick={() => {}} />
            </div>
          )}
        </div>
      </div>

      <div className="mt-2 field-list-wrapper">
        <div className="product-field mr-20">
          <p>
            상세 이미지 등록
            <span className="font-red">*</span>
          </p>
        </div>

        <div className="flex f-direction-column">
          <div className="list-header-content align-c" style={{ border: "none" }}>
            <div className="mr-12">
              <input
                style={{ display: "none" }}
                ref={(el) => (inputFileRef.current[1] = el)}
                onChange={(e) => handleFileChange(e, "detailImg")}
                type="file"
              />
              <ButtonR onClick={() => handleUploadClick(1)} name={`이미지 추가 0/1`} />
            </div>

            <p className="font-desc">이미지 1장, 1080px x 1080px</p>
          </div>

          {files?.detailImg?.fileUrl && (
            <img src={files.detailImg.fileUrl} style={{ width: 278, height: "auto" }} />
          )}

          {files?.detailImg?.fileUrl && (
            <div className="flex mt-10 mb-16">
              {/* <ButtonR
                name={`변경`}
                color={"white"}
                onClick={() => {}}
                // onClick={() => handleUploadClick(0)}
                styles={{ marginRight: 4 }}
              /> */}
              <ButtonR name={`삭제`} color={"white"} onClick={() => {}} />
            </div>
          )}
        </div>
      </div>

      {eventType === "normal" && (
        <div className="field-list-wrapper mt-2 w100p">
          <div className="product-field mr-20">
            <p>
              기능 선택<span className="font-red">*</span>
            </p>
          </div>

          <div style={{ flex: 1 }} className="mt-16 mb-16">
            <div className="flex align-center">
              <div onClick={() => setEventFeature("coupon")} className="checkbox-c mr-4 cursor">
                {eventFeature === "coupon" && <div className="checkbox-c-filled"></div>}
              </div>

              <p onClick={() => setEventFeature("coupon")} className="mr-30 cursor">
                쿠폰 다운로드
              </p>

              <div onClick={() => setEventFeature("link")} className="checkbox-c mr-4 cursor">
                {eventFeature === "link" && <div className="checkbox-c-filled" />}
              </div>

              <p onClick={() => setEventFeature("link")} className="mr-30 cursor">
                링크 이동
              </p>

              <div onClick={() => setEventFeature("none")} className="checkbox-c mr-4 cursor">
                {eventFeature === "none" && <div className="checkbox-c-filled" />}
              </div>

              <p onClick={() => setEventFeature("none")} className="mr-30 cursor">
                해당 없음
              </p>
            </div>

            {eventFeature === "coupon" && (
              <div className="mt-10">
                <SelectBox
                  placeholder={"쿠폰 선택"}
                  defaultValue={null}
                  onChange={(e: any) => setSelectedCategory(e)}
                  options={categories}
                  noOptionsMessage={"쿠폰이 없습니다."}
                />
              </div>
            )}
            {eventFeature === "link" && (
              <div className="mt-10">
                <InputR
                  value={links.btnName}
                  onChange={(e: any) => {
                    setLinks((prev: any) => {
                      return {
                        ...prev,
                        btnName: e.target.value,
                      };
                    });
                  }}
                  placeholer="버튼명 공백포함 23글자이내"
                  styleClass={"mb-5"}
                />
                <InputR
                  value={links.path}
                  onChange={(e: any) => {
                    setLinks((prev: any) => {
                      return {
                        ...prev,
                        path: e.target.value,
                      };
                    });
                  }}
                  placeholer="URL"
                />
              </div>
            )}
          </div>
        </div>
      )}

      <div className="mt-2 field-list-wrapper">
        <div className="product-field mr-20">
          <p>주의사항 입력</p>
        </div>

        <div style={{ flex: 1, padding: "15px 0" }}>
          <div className="list-header mt-6">
            <div className="text-center w10p">순서</div>
            <div className="text-center w80p">항목</div>
            <div className="text-center w10p">삭제/추가</div>
          </div>

          <div className="list-header-content">
            <div className="text-center w10p">
              <img src={up_g} style={{ width: 28, height: "auto" }} className="mr-4 cursor" />
              <img src={down_g} style={{ width: 28, height: "auto" }} className="cursor" />
            </div>

            <div className="text-center w80p">
              <div className="flex align-c mb-10">
                <p className="text-left font-12 font-gray">
                  추가 버튼을 클릭해서 정보를 추가해주세요.
                </p>
              </div>

              <div className="flex align">
                <div style={{ width: "100%" }}>
                  <input
                    value={cautionText}
                    onChange={(e: any) => {
                      setCautionText(e.target.value);
                    }}
                    className="input-desc"
                    placeholder="주의사항을 입력해 주세요."
                  />
                </div>
              </div>
            </div>
            <div className="text-center w10p">
              <button onClick={handleAddCaution} className="btn-add-b">
                추가
              </button>
            </div>
          </div>

          {cautions?.map((el: any, i: number) => (
            <div key={i} className="list-header-content">
              <div className="text-center w10p">
                <img
                  onClick={() => handleMoveOrder(cautions, i, i - 1)}
                  src={i === 0 ? up_g : up_b}
                  style={{ width: 28, height: "auto" }}
                  className="mr-4 cursor"
                />
                <img
                  onClick={() => handleMoveOrder(cautions, i, i + 1)}
                  src={i === cautions.length - 1 ? down_g : down_b}
                  style={{ width: 28, height: "auto" }}
                  className="cursor"
                />
              </div>
              <div className="text-center w80p">
                <div className="flex align">
                  <div className="w100p">
                    <input
                      value={el}
                      className="input-desc"
                      placeholder="10자 이내로 입력해 주세요.(필수)"
                    />
                  </div>
                </div>
              </div>
              <div className="text-center w10p">
                <button onClick={() => handleDeleteListItem(i)} className="btn-add">
                  삭제
                </button>
                {/* <button className="btn-add">추가</button> */}
              </div>
            </div>
          ))}
        </div>
      </div>

      {eventType !== "recommend" && (
        <div className="field-list-wrapper mt-2">
          <div className="product-field mr-20">
            <p>
              관련상품 추가<span className="font-red">*</span>
            </p>
          </div>

          {eventType === "normal" && (
            <div style={{ flex: 1 }} className="mt-16 mb-16">
              <div className="flex align-c">
                <div className="checkbox-c mr-4">
                  {relatedProducts.type === "category" && <div className="checkbox-c-filled" />}
                </div>

                <p
                  onClick={() => handleRelatedProdType("category")}
                  className="cursor font-desc mr-20"
                >
                  카테고리
                </p>

                <div className="checkbox-c mr-4">
                  {relatedProducts.type === "brand" && <div className="checkbox-c-filled" />}
                </div>
                <p
                  className="cursor font-desc mr-20"
                  onClick={() => handleRelatedProdType("brand")}
                >
                  브랜드
                </p>
              </div>

              {relatedProducts.type === "category" && (
                <>
                  <div className="mt-20">
                    <p className="font-14 font-bold">상품선택</p>
                  </div>

                  <div className="flex mt-10">
                    <SelectBox
                      containerStyles={{ marginRight: 8 }}
                      placeholder={"카테고리 대분류"}
                      value={selectedCategory}
                      onChange={(e: any) => setSelectedCategory(e)}
                      options={categories}
                      noOptionsMessage={"카테고리가 없습니다."}
                    />
                    <SelectBox
                      placeholder={"카테고리 하위분류"}
                      // defaultValue={null}
                      value={selectedSubCategory}
                      onChange={(e: any) => setSelectedSubCategory(e)}
                      options={subCategories}
                      noOptionsMessage={"카테고리가 없습니다."}
                    />
                  </div>

                  <div className="flex align-c mt-4">
                    <SelectBox
                      placeholder={"상품선택"}
                      // defaultValue={null}
                      value={selectedProduct}
                      onChange={(e: any) => onSelectProduct(e)}
                      // onChange={(e: any) => setSelectedProduct(e)}
                      options={products}
                      noOptionsMessage={"상품이 없습니다."}
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
                      value={selectedCategory}
                      onChange={(e: any) => setSelectedCategory(e)}
                      options={categories}
                      noOptionsMessage={"브랜드가 없습니다."}
                    />
                  </div>

                  <div className="flex align-c mt-4">
                    <SelectBox
                      placeholder={"상품선택"}
                      value={selectedProduct}
                      onChange={(e: any) => onSelectProduct(e)}
                      options={products}
                      noOptionsMessage={"상품이 없습니다."}
                    />
                    {/* <p className="font-12">※ 최소 1개 ~ 최대 4개 선택 가능합니다.</p> */}
                  </div>
                </>
              )}

              {/* <p className="font-12 mt-10">
              *최대 10개까지 선택 가능하며, 상위 2개 상품은 메인에 노출됩니다.
            </p> */}

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
          )}

          {eventType === "luckydraw" && (
            <div style={{ flex: 1 }} className="mt-16 mb-16">
              <>
                <div className="flex align-c mt-4">
                  <SelectBox
                    placeholder={"상품선택"}
                    value={selectedProduct}
                    //   defaultValue={null}
                    onChange={(e: any) => onSelectProduct(e)}
                    options={products}
                    noOptionsMessage={"상품이 없습니다."}
                  />
                  {/* <p className="font-12">※ 최소 1개 ~ 최대 4개 선택 가능합니다.</p> */}
                </div>
              </>

              {/* <p className="font-12 mt-10">
              *최대 10개까지 선택 가능하며, 상위 2개 상품은 메인에 노출됩니다.
            </p> */}

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
          )}
        </div>
      )}

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
