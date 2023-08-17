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
  // 혜택 구분
  const [couponType, setCouponType] = useState<string>("할인율");
  const [couponBenefit, setCouponBenefit] = useState<any>({
    discountRatio: "",
    discountPrice: "",
    freeshipping: false,
  });
  const [distributionMethod, setDistributionMethod] = useState<any>({
    targetMember: true,
    downloadMemberType: null,
  });
  const [issuanceDate, setIssuanceDate] = useState<any>({
    issuanceDate: "now",
    issuanceTimestamp: "",
  });
  const [applicationScope, setApplicationScope] = useState<string>("billCoupon");
  const [termsOfUse, setTermsOfUse] = useState<any>({
    type: "unlimit",
    maxDiscountAmount: "",
    minAmount: "",
  });

  const [status, setStatus] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<any>(null);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any>({
    type: "all",
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
  const [eventType, setEventType] = useState<string>("normal");
  const [selectedCoupon, setSelectedCoupon] = useState<any>({});
  // 동일인 재발급 가능 여부

  const [reissuanceNum, setReissuanceNum] = useState<string>("0");
  const [reissuanceNum2, setReissuanceNum2] = useState<string>("-1");

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    if (eventType === "normal" && selectedCategory && relatedProducts.type === "category") {
      const targetIdx = categories.findIndex((el: any, i: number) => el === selectedCategory);

      let tempCategories: any = [];

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
      find: { ...find, delete: { $ne: true } },
    });

    const { data } = selectProducts;

    let tempProductSelect: any = [
      relatedProducts.type === "category"
        ? {
            value: "전체",
            label: "전체",
            _id: `[${selectedCategory.value}] - ${selectedSubCategory.value}`,
            productNameK: `[${selectedCategory.value}] - ${selectedSubCategory.value} 전체항목`,
          }
        : {
            value: "전체",
            label: "전체",
            _id: `[${selectedCategory.value}]`,
            productNameK: `[${selectedCategory.value}] 전체항목`,
          },
    ];
    for (let i = 0; i < data?.length; i++) {
      tempProductSelect.push({
        value: data[i].productNameK,
        label: data[i].productNameK,
        ...data[i],
      });
    }

    setProducts(tempProductSelect);
  };

  const handleValidForm = () => {
    let valid = true;
    if (title === "") return false;
    if (couponType === "할인율" && couponBenefit.discountRatio === "") return false;
    if (couponType === "할인금액" && couponBenefit.discountPrice === "") return false;
    if (issuanceDate.issuanceDate === "time" && issuanceDate.issuanceTimestamp === "") return false;

    return valid;
  };

  // 쿠폰 등록
  const handleAddCoupon = async () => {
    const isValid = handleValidForm();
    if (!isValid) return alert("필수 입력 사항을 입력해 주세요.");

    const startingDate = new Date(dates.startingDate);
    const endingDate = new Date(dates.endingDate);
    const startingDateStamp = startingDate.getTime();
    const endingDateStamp = endingDate.getTime();
    const issueCouponDate = new Date(issuanceDate.issuanceTimestamp);
    const issuanceStamp = issueCouponDate.getTime();

    const _body = {
      collection: "coupons",
      title,
      discountRatio: Number(couponBenefit.discountRatio.replace(/,/gi, "")),
      discountPrice: Number(couponBenefit.discountPrice.replace(/,/gi, "")),
      freeshipping: couponBenefit.freeshipping,
      targetMember: distributionMethod.targetMember,
      downloadMemberType: distributionMethod.downloadMemberType
        ? distributionMethod.downloadMemberType.value
        : null,
      issuanceDate: issuanceDate.issuanceDate,
      issuanceTimestamp: issuanceStamp,
      startingDate: isNaN(startingDateStamp) ? null : startingDateStamp,
      endingDate: isNaN(endingDateStamp) ? null : endingDateStamp,
      applicationScope,
      maxDiscountAmount: Number(termsOfUse.maxDiscountAmount.replace(/,/gi, "")),
      minAmount: Number(termsOfUse.minAmount.replace(/,/gi, "")),
      eligibleProd: relatedProducts,
      status,
      reissuanceEligibilityForSamePerson: distributionMethod.downloadMemberType
        ? parseInt(reissuanceNum.replace(/,/gi, ""))
        : null,
      issuanceLimit: distributionMethod.downloadMemberType
        ? parseInt(reissuanceNum2.replace(/,/gi, ""))
        : null,
    };

    const addResult: any = await postCollection(_body);
    if (addResult.result && addResult.status === 200) {
      alert("쿠폰 등록이 완료되었습니다.");
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

  const handleOnChangeNum = (e: any, type: string, state: string) => {
    let value: string = e.target.value;
    const numCheck: boolean = /^[0-9,]/.test(value);

    if (!numCheck && value) return;

    if (numCheck) {
      const numValue = value.replaceAll(",", "");
      value = numValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    if (state === "couponBenefit") {
      setCouponBenefit((prev: any) => {
        return {
          ...prev,
          [type]: value,
        };
      });
    }
    if (state === "termsOfUse") {
      setTermsOfUse((prev: any) => {
        return {
          ...prev,
          [type]: value,
        };
      });
    }

    if (state === "reissuance") {
      if (parseInt(value) === -1 || parseInt(value) === 0) return;
      else setReissuanceNum(value);
    }
    if (state === "reissuance2") {
      if (parseInt(value) === -1 || parseInt(value) === 0) return;
      else setReissuanceNum2(value);
    }
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
            placeholer={"쿠폰 이름을 입력해 주세요."}
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
            <div
              onClick={() => {
                setCouponType("할인율");
                setCouponBenefit({
                  discountRatio: "",
                  discountPrice: "",
                  freeshipping: false,
                });
              }}
              className="checkbox-c mr-4 cursor"
            >
              {couponType === "할인율" && <div className="checkbox-c-filled" />}
            </div>

            <p
              onClick={() => {
                setCouponType("할인율");
                setCouponBenefit({
                  discountRatio: "",
                  discountPrice: "",
                  freeshipping: false,
                });
              }}
              className="mr-30 cursor"
            >
              할인율
            </p>

            {couponType === "할인율" && (
              <>
                <InputR
                  value={couponBenefit.discountRatio}
                  size={"small"}
                  onChange={(e: any) => handleOnChangeNum(e, "discountRatio", "couponBenefit")}
                />
                <p>%</p>
              </>
            )}
          </div>

          <div className="flex align-c mt-10" style={{ height: 32 }}>
            <div
              onClick={() => {
                setCouponType("할인금액");
                setCouponBenefit({
                  discountRatio: "",
                  discountPrice: "",
                  freeshipping: false,
                });
              }}
              className="checkbox-c mr-4 cursor"
            >
              {couponType === "할인금액" && <div className="checkbox-c-filled" />}
            </div>

            <p
              onClick={() => {
                setCouponType("할인금액");
                setCouponBenefit({
                  discountRatio: "",
                  discountPrice: "",
                  freeshipping: false,
                });
              }}
              className="mr-30 cursor"
            >
              할인금액
            </p>

            {couponType === "할인금액" && (
              <>
                <InputR
                  value={couponBenefit.discountPrice}
                  onChange={(e: any) => handleOnChangeNum(e, "discountPrice", "couponBenefit")}
                  size={"small"}
                />
                <p>원</p>
              </>
            )}
          </div>

          <div className="flex align-c mt-10" style={{ height: 32 }}>
            <div
              onClick={() => {
                setCouponType("무료배송");
                setCouponBenefit({
                  discountRatio: "",
                  discountPrice: "",
                  freeshipping: false,
                });
              }}
              className="checkbox-c mr-4 cursor"
            >
              {couponType === "무료배송" && <div className="checkbox-c-filled"></div>}
            </div>

            <p
              onClick={() => {
                setCouponType("무료배송");
                setCouponBenefit({
                  discountRatio: "",
                  discountPrice: "",
                  freeshipping: true,
                });
              }}
              className="mr-30 cursor"
            >
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
            <div
              onClick={() =>
                setDistributionMethod({
                  targetMember: true,
                  downloadMemberType: null,
                })
              }
              className="checkbox-c mr-4 cursor"
            >
              {distributionMethod.targetMember && <div className="checkbox-c-filled" />}
            </div>

            <p
              onClick={() =>
                setDistributionMethod({
                  targetMember: true,
                  downloadMemberType: null,
                })
              }
              className="mr-30 cursor"
            >
              대상자 지정 발급
            </p>

            {/* <>
              <InputR size={"small"} />
              <p>%</p>
            </> */}
          </div>

          <div className="flex align-c mt-10" style={{ height: 32 }}>
            <div className="checkbox-c mr-4 cursor">
              {distributionMethod.downloadMemberType && <div className="checkbox-c-filled"></div>}
            </div>

            <p
              onClick={() =>
                setDistributionMethod({
                  targetMember: false,
                  downloadMemberType: {
                    label: "모든 회원",
                    value: "모든 회원",
                  },
                })
              }
              className="mr-30 cursor"
            >
              고객 다운로드 발급
            </p>

            {distributionMethod.downloadMemberType && (
              <SelectBox
                containerStyles={{ marginRight: 8 }}
                placeholder={"모든 회원"}
                value={distributionMethod.downloadMemberType}
                onChange={(e: any) => {
                  setDistributionMethod((prev: any) => {
                    return {
                      ...prev,
                      targetMember: false,
                      downloadMemberType: e,
                    };
                  });
                }}
                options={membershipLevel}
                noOptionsMessage={"카테고리가 없습니다."}
              />
            )}
          </div>
        </div>
      </div>

      {distributionMethod.downloadMemberType && (
        <div className="field-list-wrapper mt-2">
          <div className="product-field mr-20">
            <p>
              동일인 재발급
              <br /> 가능 여부
            </p>
          </div>

          <div className="mt-16 mb-16 flex1">
            <div className="flex align-c">
              <div onClick={() => setReissuanceNum("0")} className="checkbox-c mr-4">
                {reissuanceNum === "0" && <div className="checkbox-c-filled" />}
              </div>

              <p onClick={() => setReissuanceNum("0")} className="cursor mr-20">
                불가능
              </p>

              <div onClick={() => setReissuanceNum("1")} className="checkbox-c mr-4">
                {reissuanceNum !== "-1" && reissuanceNum !== "0" && (
                  <div className="checkbox-c-filled" />
                )}
              </div>

              <p onClick={() => setReissuanceNum("1")} className="cursor">
                가능
              </p>
              <p className="mr-4">{"("}최대 </p>
              <InputR
                onChange={(e: any) => handleOnChangeNum(e, "", "reissuance")}
                value={reissuanceNum === "-1" || reissuanceNum === "0" ? "1" : reissuanceNum}
                disable={reissuanceNum !== "0" && reissuanceNum !== "-1" ? false : true}
                innerStyle={{ width: 40, marginRight: 4, paddingLeft: 4 }}
              />
              <p className="mr-20">{")"}매</p>

              <div onClick={() => setReissuanceNum("-1")} className="checkbox-c mr-4">
                {reissuanceNum === "-1" && <div className="checkbox-c-filled" />}
              </div>
              <p className="cursor mr-20" onClick={() => setReissuanceNum("-1")}>
                가능(무제한)
              </p>
            </div>
          </div>
        </div>
      )}

      {distributionMethod.downloadMemberType && (
        <div className="field-list-wrapper mt-2">
          <div className="product-field mr-20">
            <p>발급 수 제한</p>
          </div>

          <div className="mt-16 mb-16 flex1">
            <div className="flex align-c">
              <div onClick={() => setReissuanceNum2("-1")} className="checkbox-c mr-4">
                {reissuanceNum2 === "-1" && <div className="checkbox-c-filled" />}
              </div>

              <p onClick={() => setReissuanceNum2("-1")} className="cursor mr-20">
                제한없음
              </p>

              <div onClick={() => setReissuanceNum2("1")} className="checkbox-c mr-4">
                {reissuanceNum2 !== "-1" && <div className="checkbox-c-filled" />}
              </div>

              <p onClick={() => setReissuanceNum2("1")} className="cursor">
                가능
              </p>
              <p className="mr-4">{"("}최대 </p>
              <InputR
                onChange={(e: any) => handleOnChangeNum(e, "", "reissuance2")}
                value={reissuanceNum2 === "-1" ? "1" : reissuanceNum2}
                disable={reissuanceNum2 !== "-1" ? false : true}
                innerStyle={{ width: 40, marginRight: 4, paddingLeft: 4 }}
              />
              <p className="mr-20">{")"}매</p>
            </div>
          </div>
        </div>
      )}

      <div className="field-list-wrapper mt-2">
        <div className="product-field mr-20">
          <p>
            발급시점<span className="font-red">*</span>
          </p>
        </div>

        <div className="mt-16 mb-16 flex1">
          <div className="flex align-c">
            <div
              onClick={() =>
                setIssuanceDate((prev: any) => {
                  return {
                    issuanceDate: "now",
                    issuanceTimestamp: "",
                  };
                })
              }
              className="checkbox-c mr-4"
            >
              {issuanceDate.issuanceDate === "now" && <div className="checkbox-c-filled" />}
            </div>

            <p
              onClick={() =>
                setIssuanceDate((prev: any) => {
                  return {
                    issuanceDate: "now",
                    issuanceTimestamp: "",
                  };
                })
              }
              className="cursor mr-20"
            >
              즉시발급
            </p>

            <div
              onClick={() =>
                setIssuanceDate((prev: any) => {
                  return {
                    issuanceDate: "time",
                    issuanceTimestamp: "",
                  };
                })
              }
              className="checkbox-c mr-4"
            >
              {issuanceDate.issuanceDate === "time" && <div className="checkbox-c-filled" />}
            </div>

            <p
              onClick={() =>
                setIssuanceDate((prev: any) => {
                  return {
                    issuanceDate: "time",
                    issuanceTimestamp: "",
                  };
                })
              }
              className="cursor mr-20"
            >
              지정한 시점
            </p>

            <div
              onClick={() =>
                setIssuanceDate((prev: any) => {
                  return {
                    issuanceDate: "join",
                    issuanceTimestamp: "",
                  };
                })
              }
              className="checkbox-c mr-4"
            >
              {issuanceDate.issuanceDate === "join" && <div className="checkbox-c-filled" />}
            </div>
            <p
              className="cursor mr-20"
              onClick={() =>
                setIssuanceDate((prev: any) => {
                  return {
                    issuanceDate: "join",
                    issuanceTimestamp: "",
                  };
                })
              }
            >
              회원가입 시
            </p>
          </div>

          {issuanceDate.issuanceDate === "time" && (
            <>
              <div className="flex mt-10">
                <input
                  className="input-date"
                  type="date"
                  value={issuanceDate.issuanceTimestamp}
                  onChange={(e: any) => {
                    setIssuanceDate((prev: any) => {
                      return {
                        ...prev,
                        issuanceTimestamp: e.target.value,
                      };
                    });
                  }}
                />
              </div>
            </>
          )}
        </div>
      </div>

      <p className="font-category mt-40">사용 정보</p>

      <div className="field-list-wrapper mt-13 w100p">
        <div className="product-field mr-20">
          <p>사용기간</p>
        </div>

        <div className="mt-16 mb-16">
          <div className="flex1 flex align-c">
            <input
              className="input-date"
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
              className="input-date"
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

        <div onClick={() => setApplicationScope("billCoupon")} className="checkbox-c mr-4 cursor">
          {applicationScope === "billCoupon" && <div className="checkbox-c-filled"></div>}
        </div>

        <p onClick={() => setApplicationScope("billCoupon")} className="mr-30 cursor">
          주문서 쿠폰
        </p>

        <div
          onClick={() => setApplicationScope("productCoupon")}
          className="checkbox-c mr-4 cursor"
        >
          {applicationScope === "productCoupon" && <div className="checkbox-c-filled" />}
        </div>

        <p onClick={() => setApplicationScope("productCoupon")} className="mr-35 cursor">
          상품 쿠폰
        </p>
      </div>

      <div className="field-list-wrapper mt-2">
        <div className="product-field mr-20">
          <p>적용상품</p>
        </div>

        <div style={{ flex: 1 }} className="mt-16 mb-16">
          <div className="flex align-c">
            <div className="checkbox-c mr-4">
              {relatedProducts.type === "all" && <div className="checkbox-c-filled" />}
            </div>

            <p onClick={() => handleRelatedProdType("all")} className="cursor mr-20">
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

          {relatedProducts.type !== "all" && (
            <p className="font-12 mt-10">
              *최대 10개까지 선택 가능하며, 상위 2개 상품은 메인에 노출됩니다.
            </p>
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

      <div className="field-list-wrapper mt-2">
        <div className="product-field mr-20">
          <p>사용조건</p>
        </div>

        <div style={{ flex: 1 }} className="mt-16 mb-16">
          <div className="flex align-c">
            <div
              onClick={() =>
                setTermsOfUse((prev: any) => {
                  return {
                    type: "unlimit",
                    maxDiscountAmount: "",
                    minAmount: "",
                  };
                })
              }
              className="checkbox-c mr-4 cursor"
            >
              {termsOfUse.type === "unlimit" && <div className="checkbox-c-filled"></div>}
            </div>

            <p
              onClick={() =>
                setTermsOfUse((prev: any) => {
                  return {
                    type: "unlimit",
                    maxDiscountAmount: "",
                    minAmount: "",
                  };
                })
              }
              className="mr-30 cursor"
            >
              사용제한없음
            </p>

            <div
              onClick={() =>
                setTermsOfUse((prev: any) => {
                  return {
                    type: "maxDiscountAmount",
                    maxDiscountAmount: "",
                    minAmount: "",
                  };
                })
              }
              className="checkbox-c mr-4 cursor"
            >
              {termsOfUse.type === "maxDiscountAmount" && <div className="checkbox-c-filled" />}
            </div>

            <p
              onClick={() =>
                setTermsOfUse((prev: any) => {
                  return {
                    type: "maxDiscountAmount",
                    maxDiscountAmount: "",
                    minAmount: "",
                  };
                })
              }
              className="mr-30 cursor"
            >
              최대 할인 금액 설정
            </p>

            <div
              onClick={() =>
                setTermsOfUse((prev: any) => {
                  return {
                    type: "minAmount",
                    maxDiscountAmount: "",
                    minAmount: "",
                  };
                })
              }
              className="checkbox-c mr-4 cursor"
            >
              {termsOfUse.type === "minAmount" && <div className="checkbox-c-filled" />}
            </div>

            <p
              onClick={() =>
                setTermsOfUse((prev: any) => {
                  return {
                    type: "minAmount",
                    maxDiscountAmount: "",
                    minAmount: "",
                  };
                })
              }
              className="mr-30 cursor"
            >
              사용가능 기준금액 설정
            </p>
          </div>

          {termsOfUse.type === "maxDiscountAmount" && (
            <div className="flex align-c mt-10">
              <InputR
                value={termsOfUse.maxDiscountAmount}
                onChange={(e: any) => handleOnChangeNum(e, "maxDiscountAmount", "termsOfUse")}
                size={"small"}
              />
              <p>원</p>
            </div>
          )}
          {termsOfUse.type === "minAmount" && (
            <div className="flex align-c mt-10">
              <InputR
                value={termsOfUse.minAmount}
                onChange={(e: any) => handleOnChangeNum(e, "minAmount", "termsOfUse")}
                size={"small"}
              />
              <p>원 이상 구매시</p>
            </div>
          )}
        </div>
      </div>

      <div className="product-field-wrapper mt-2 w100p">
        <div className="product-field mr-20">
          <p>상태</p>
        </div>

        <div onClick={() => setStatus(true)} className="checkbox-c mr-4 cursor">
          {status && <div className="checkbox-c-filled"></div>}
        </div>

        <p onClick={() => setStatus(true)} className="mr-30 cursor">
          사용가능
        </p>

        <div onClick={() => setStatus(false)} className="checkbox-c mr-4 cursor">
          {!status && <div className="checkbox-c-filled" />}
        </div>

        <p onClick={() => setStatus(false)} className="mr-30 cursor">
          사용불가
        </p>
      </div>

      <div className="flex justify-fe mt-10">
        {/* <div>
          <ButtonR name={"삭제"} onClick={() => {}} color={"white"} />
        </div> */}
        <div className="flex">
          <ButtonR name={"취소"} onClick={() => navigate(-1)} styleClass={"mr-4"} color={"white"} />
          <ButtonR name={"저장"} onClick={handleAddCoupon} />
        </div>
      </div>
    </div>
  );
};

export default AddMainEvent;
