import React, { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import InputR from "../components/InputR";
import ButtonR from "../components/ButtonR";
import Select from "react-select";
import up_g from "../images/up_g.png";
import down_g from "../images/down_g.png";
import up_b from "../images/up_b.png";
import down_b from "../images/down_b.png";
import close from "../images/close.png";
import sample from "../images/sample_img.png";
import { useFileUpload } from "../hooks/useFileUpload";
import Modal from "../components/Modal";
import { useBodyScrollLock } from "../hooks/useBodyScrollLock";
import { currency, moveValue } from "../common/utils";
import CheckboxS from "../components/CheckboxS";
import { getDatas, postAddProduct, postUploadImage } from "../common/apis";

const Cateogyoptions1 = [
  { value: "대분류 카테고리1", label: "대분류 카테고리1" },
  { value: "대분류 카테고리2", label: "대분류 카테고리2" },
  { value: "대분류 카테고리3", label: "대분류 카테고리3" },
];

const Cateogyoptions2 = [
  { value: "하위분류 카테고리1", label: "하위분류 카테고리1" },
  { value: "하위분류 카테고리2", label: "하위분류 카테고리2" },
  { value: "하위분류 카테고리3", label: "하위분류 카테고리3" },
];

const brandOptions = [
  { value: "브랜드 옵션1", label: "브랜드 옵션1" },
  { value: "브랜드 옵션2", label: "브랜드 옵션2" },
  { value: "브랜드 옵션3", label: "브랜드 옵션3" },
];

interface IPoint {
  summary: string;
  desc: string;
  imgUrls: IFile[];
}

interface IProductInfo {
  title: string;
  content: string;
}

interface IFile {
  file: File | null;
  imgUrl: string;
}

export default function Magazine(): JSX.Element {
  const [form, setForm] = useState<any>({
    category1: "",
    category2: "",
    brand: "",
    productNameE: "",
    productNameK: "",
    productCode: "",
    productDesc: "",
    keywords: "",
    productSetting: {
      noneCoupon: false,
      bossPick: false,
      best: false,
      luckyDraw: false,
    },
    dutyFree: false,
    freeShip: true,
    deliveryFee: "",
    deliveryFeeForException: "",
    deliveryType: "international",
    originalPrice: "",
    discounted: "",
  });
  const [productOptions, setProductOptions] = useState<any>({});
  const [productItemOptions, setProductItemOptions] = useState<any>([]);

  const [desc, setDesc] = useState<string>("");
  const [txtLength, setTxtLength] = useState(0);

  const [dates, setDates] = useState<{
    startingDate: string;
    endingDate: string;
    openingDate: string;
  }>({
    startingDate: "",
    endingDate: "",
    openingDate: "",
  });

  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);

  const [openStatus, setOpenStatus] = useState<boolean>(true);

  const [selectedOption, setSelectedOption] = useState(null);
  const inputFileRef = useRef<any[]>([]);
  const [files, setFiles] = useState<any>({
    thumbnail: [],
    additionalImg: [],
    points: [],
    options: [],
  });
  const [points, setPoints] = useState<any[]>([]);
  const [pointForm, setPointForm] = useState<IPoint>({
    summary: "",
    desc: "",
    imgUrls: [],
  });
  const [productItemForm, setProductItemForm] = useState<any>({
    optionName: "",
    imgUrls: [],
  });
  const [productInfoForm, setProductInfoForm] = useState<IProductInfo>({
    title: "",
    content: "",
  });
  const [productInfos, setProductInfos] = useState<IProductInfo[]>([
    {
      title: "제조국",
      content: "이탈리아",
    },
    {
      title: "품질 보증 기준",
      content: "공정거래위원회 고시(소비자분쟁해결기준)에 의거하여 보상해 드립니다.",
    },
    {
      title: "A/S 책임자와 전화번호",
      content: "ittaly, 010-4194-4399 (평일 09:00 - 18:00)",
    },
  ]);
  const [saleStatus, setSaleStatus] = useState<string>("onSale");

  // 연관상품
  const [relatedProducts, setRelatedProducts] = useState<any>({
    type: "random",
    products: [],
  });

  // 모달창 제어
  const [isOpen, setIsOpen] = useState(false);
  const { lockScroll, openScroll } = useBodyScrollLock();

  // 카테고리
  const [categories, setCategories] = useState<any>([]);
  // 서브카테고리
  const [subCategories, setSubCategories] = useState<any>([]);

  // 브랜드
  const [brands, setBrands] = useState<any>([]);

  const [body, setBody] = useState<any>("");

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      const targetIdx = categories.findIndex((el: any, i: number) => el === selectedCategory);

      let tempCategories = [];
      for (let i = 0; i < categories[targetIdx].subCategories?.length; i++) {
        tempCategories.push({
          value: categories[targetIdx].subCategories[i].optionName,
          label: categories[targetIdx].subCategories[i].optionName,
          categoryId: categories[targetIdx]._id,
        });
      }

      setSubCategories(tempCategories);
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (selectedSubCategory) {
      selectedProducts();
    }
  }, [selectedSubCategory]);

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
    const find = {
      categoryId: selectedSubCategory.categoryId,
      category2: selectedSubCategory.value,
    };

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

  const onChangeForm = (type: string, value: string | object | boolean) => {
    setForm((prev: any) => {
      return {
        ...prev,
        [type]: value,
      };
    });
  };

  // useEffect(() => {
  //   console.log(productOptions);
  //   console.log(form);
  // }, [productOptions, form]);

  const handleUploadClick = async (idx: number) => {
    inputFileRef?.current[idx]?.click();
  };

  // 이미지 첨부 핸들러
  const handleFileChange = (evt: any, type: string) => {
    const file = evt.target.files?.[0];
    const imgUrl = URL.createObjectURL(file);
    if (type === "thumbnail") {
      setFiles((prev: any) => {
        return {
          ...prev,
          [type]: [
            {
              file: file,
              fileUrl: URL.createObjectURL(file),
            },
          ],
        };
      });
    } else {
      setFiles((prev: any) => {
        return {
          ...prev,
          [type]: [
            ...prev[type],
            {
              file: file,
              fileUrl: URL.createObjectURL(file),
            },
          ],
        };
      });
    }
  };

  const handleFileChange2 = (evt: any, type: string) => {
    const file = evt.target.files?.[0];
    const imgUrl: any = URL.createObjectURL(file);
    let imgArr = type === "pointForm" ? [...pointForm.imgUrls] : [...productItemForm.imgUrls];
    imgArr.push({
      file: file,
      imgUrl: imgUrl,
    });

    if (type === "pointForm") {
      setPointForm((prev: any) => {
        return {
          ...prev,
          imgUrls: imgArr,
        };
      });
    } else {
      setProductItemForm((prev: any) => {
        return {
          ...prev,
          imgUrls: imgArr,
        };
      });
    }
  };

  const handleDeleteFile = (type: string, url: string) => {
    const filesArr = files[type];
    let tempFileArr: any = [];
    for (let i = 0; i < filesArr.length; i++) {
      if (filesArr[i].fileUrl !== url) {
        tempFileArr.push(filesArr[i]);
      }
    }
    setFiles((prev: any) => {
      return {
        ...prev,
        [type]: [...tempFileArr],
      };
    });
  };

  const handleAddForm = (type: string) => {
    let tempArr = [];

    switch (type) {
      case "point":
        tempArr = [...points];
        tempArr.push(pointForm);
        setPoints(tempArr);
        setPointForm({
          summary: "",
          desc: "",
          imgUrls: [],
        });
        break;

      case "productInfo":
        tempArr = [productInfoForm, ...productInfos];
        // tempArr.push(productInfoForm);
        setProductInfos(tempArr);
        setProductInfoForm({
          title: "",
          content: "",
        });

        break;

      case "productItem":
        tempArr = [...productItemOptions];
        tempArr.push(productItemForm);
        setProductItemOptions(tempArr);
        setProductItemForm({
          optionName: "",
          imgUrls: [],
        });

        break;
    }
  };

  // 상품등록 모달창
  const handleOpen = () => {
    lockScroll();
    setIsOpen(true);
  };

  const handleClose = () => {
    openScroll();
    setIsOpen(false);
  };

  const handleChangeTextarea = (content: string) => {
    let str = content;
    str = str.replace(/(?:\r\n|\r|\n)/g, `<br/>`);
    return str;
  };

  const handleMoveOrder = (type: string, array: object[], fromIndex: number, toIndex: number) => {
    const newArr: any = moveValue(array, fromIndex, toIndex);

    if (type === "productInfos") {
      setProductInfos([...newArr]);
    }

    if (type === "points") {
      setPoints([...newArr]);
    }

    if (type === "productItem") {
      setProductItemOptions([...newArr]);
    }
  };

  const handleDeleteListItem = (type: string, i: number) => {
    let tempArr = [];

    switch (type) {
      case "point":
        tempArr = [...points];
        tempArr.splice(i, 1);
        setPoints(tempArr);
        break;

      case "productInfo":
        tempArr = [...productInfos];
        tempArr.splice(i, 1);
        setProductInfos(tempArr);
        break;

      case "productItemOptions":
        tempArr = [...productItemOptions];
        tempArr.splice(i, 1);
        setProductItemOptions(tempArr);
        break;
    }
  };

  const onChangeProductSetting = (type: string) => {
    setForm((prev: any) => {
      return {
        ...prev,
        productSetting: {
          ...prev.productSetting,
          [type]: !prev.productSetting[type],
        },
      };
    });
  };

  const onChangePrice = (type: string, value: string) => {
    let n: string = value.replace(/,/gi, "");
    if (n !== "") {
      let currencyPrice = currency(parseInt(n));

      setForm((prev: any) => {
        return {
          ...prev,
          [type]: currencyPrice,
        };
      });
    } else {
      setForm((prev: any) => {
        return {
          ...prev,
          [type]: "",
        };
      });
    }
  };

  const getDiscountP = () => {
    // 10000원 8000원 20퍼센트..!

    let percent = 0;

    const original = parseInt(form.originalPrice.replace(/,/gi, ""));
    const discounted = parseInt(form.discounted.replace(/,/gi, ""));

    if (original > 0 && discounted > 0) {
      percent = Math.floor(100 - (discounted / original) * 100);
    }

    return percent;
  };

  const handleChangeOption = (value: string) => {
    if (value === "1개") {
      setProductOptions({
        option1: {
          optionName: "",
          options: [{}],
        },
      });
    }

    if (value === "2개") {
      setProductOptions({
        option1: {
          optionName: "",
          options: [{}],
        },
        option2: {
          optionName: "",
          options: [{}],
        },
      });
    }

    if (value === "3개") {
      setProductOptions({
        option1: {
          optionName: "",
          options: [{}],
        },
        option2: {
          optionName: "",
          options: [{}],
        },
        option3: {
          optionName: "",
          options: [{}],
        },
      });
    }
  };

  const onChangeOptions = (aOption: any, index: number, event: any, value: string) => {
    let tempOptions = [...productOptions[aOption].options];
    tempOptions[index][value] = event.target.value;

    setProductOptions((prev: any) => {
      return {
        ...prev,
        [aOption]: {
          ...prev[aOption],
          options: tempOptions,
        },
      };
    });
  };

  const handleAddOption = (option: any) => {
    const tempOptions = [{}, ...productOptions[option].options];
    setProductOptions((prev: any) => {
      return {
        ...prev,
        [option]: {
          optionName: prev[option].optionName,
          options: tempOptions,
        },
      };
    });
  };

  const handleDeleteOption = (option: any, index: number) => {
    let tempOptions = [...productOptions[option].options];
    tempOptions.splice(index, 1);
    setProductOptions((prev: any) => {
      return {
        ...prev,
        [option]: {
          optionName: prev[option].optionName,
          options: tempOptions,
        },
      };
    });
  };

  const handleAddProduct = async () => {
    // 판매/가격 정보까지 =>  form
    // 옵션 여부 => productOptions
    // 배송정책 form.freeship
    // 대표 이미지 => files.thumbnail url: imgUrl
    // 추가 이미지 => files.additionalImg url: imgUrl
    // 구매 포인트 => points 요약: summary 설명: desc 이미지URL: imgUrl
    // 상품 옵션 => productItemOptions 옵션명: optionName 이미지URL: imgUrl
    // 상품정보제공공시 => productInfos 제목: title 설명: content
    // 연관 추천상품 => relatedProducts 랜덤: random 직접입력: planned products: []...
    // 판매상태 saleStatus 판매중: onSale 판매중지: saleStopped 일시품절: soldOut
    // console.log(files.thumbnail);

    if (loading) return alert("상품 등록중입니다.");
    setLoading(true);

    let tempForm = { ...form };
    delete tempForm.productSetting;
    delete tempForm.originalPrice;

    let categoryId: string = "";
    for (let i in categories) {
      if (categories[i].value === form.category1) {
        categoryId = categories[i]._id;
      }
    }

    let _body = {
      ...tempForm,
      categoryId,
      brand: tempForm.brand.value,
      brandId: tempForm.brand._id,
      price: Number(form.originalPrice.replace(/,/gi, "")),
      discounted: Number(form.discounted.replace(/,/gi, "")),
      deliveryFee: Number(form.deliveryFee.replace(/,/gi, "")),
      deliveryFeeForException: Number(form.deliveryFeeForException.replace(/,/gi, "")),
      noneCoupon: form.productSetting.noneCoupon,
      bossPick: form.productSetting.bossPick,
      best: form.productSetting.best,
      luckyDraw: form.productSetting.luckyDraw,
      productOptions,
      productInfos,
      saleStatus,
    };

    // 대표이미지(썸네일)
    const formData = new FormData();
    formData.append("file", files.thumbnail[0]?.file);
    const getUrl: any = await postUploadImage(formData);
    _body.thumbnail = getUrl.url;

    // // 추가이미지
    let tempAdditionalImg: string[] = [];
    for (let i = 0; i < files.additionalImg.length; i++) {
      const formData = new FormData();
      formData.append("file", files.additionalImg[i].file);
      const getUrl: any = await postUploadImage(formData);
      tempAdditionalImg.push(getUrl.url);
    }

    _body.additionalImg = tempAdditionalImg;

    // 구매포인트
    let tempPoints: any = [...points];

    for (let i = 0; i < tempPoints?.length; i++) {
      let tempImgArr: string[] = [];
      for (let k = 0; k < tempPoints[i]?.imgUrls?.length; k++) {
        const formData = new FormData();
        formData.append("file", tempPoints[i]?.imgUrls[k]?.file);
        const getUrl: any = await postUploadImage(formData);
        if (getUrl.result) {
          tempImgArr.push(getUrl.url);
        }
      }

      tempPoints[i].imgUrls = tempImgArr;
    }

    _body.salesPoints = tempPoints;

    // 상품옵션
    let tempItemOptions: any = [...productItemOptions];
    for (let i = 0; i < tempItemOptions?.length; i++) {
      let tempImgArr: string[] = [];
      for (let k = 0; k < tempItemOptions[i]?.imgUrls?.length; k++) {
        const formData = new FormData();
        formData.append("file", tempItemOptions[i]?.imgUrls[k]?.file);
        const getUrl: any = await postUploadImage(formData);
        if (getUrl.result) {
          tempImgArr.push(getUrl.url);
        }
      }
      tempItemOptions[i].imgUrls = tempImgArr;
    }
    _body.productItemOptions = tempItemOptions;

    const productAddResult: any = await postAddProduct({
      collection: "products",
      ..._body,
    });

    if (productAddResult.result) {
      alert("상품 등록이 완료되었습니다.");
    }

    setLoading(false);
  };

  const handleCancelProductInfo = () => {
    setProductInfos([
      {
        title: "제조국",
        content: "이탈리아",
      },
      {
        title: "품질 보증 기준",
        content: "공정거래위원회 고시(소비자분쟁해결기준)에 의거하여 보상해 드립니다.",
      },
      {
        title: "A/S 책임자와 전화번호",
        content: "ittaly, 010-4194-4399 (평일 09:00 - 18:00)",
      },
    ]);
    setProductInfoForm({
      title: "",
      content: "",
    });
    handleClose();
  };

  const onChangeHandler = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    setDesc(e.target.value);
    setTxtLength(e.target.value.length);
  }, []);

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

    setSelectedCategory(null);
    setSelectedSubCategory(null);
    setSubCategories([]);
    setProducts([]);
  };

  return (
    <>
      <div>
        <div className="flex justify-sb align-c pb-30">
          <p className="page-title">매거진 등록</p>
          <p className="font-desc">
            <span className="font-red mr-4">*</span>
            <span>필수입력</span>
          </p>
        </div>

        {/* 카테고리/기본정보 */}
        <div>
          <div className="product-field-wrapper mt-2 w100p">
            <div className="product-field mr-20">
              <p>
                제목<span className="font-red">*</span>
              </p>
            </div>

            <div className="flex1">
              <InputR size="full" placeholer={"제목을 입력해 주세요"} />
            </div>
          </div>

          <div className="mt-2 field-list-wrapper">
            <div className="product-field mr-20">
              <p>
                대표이미지
                <br />
                (썸네일)
                <span className="font-red">*</span>
              </p>
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
                  <ButtonR
                    name={`이미지 추가 ${files?.thumbnail.length}/1`}
                    onClick={() => handleUploadClick(0)}
                  />
                </div>

                <p className="font-desc">이미지 1장, 1080px x 1080px</p>
              </div>

              {files?.thumbnail.length !== 0 && (
                <img src={files?.thumbnail[0]?.fileUrl} style={{ width: 136, height: "auto" }} />
              )}

              {files?.thumbnail.length !== 0 && (
                <div className="flex mt-16 mb-16">
                  <ButtonR
                    name={`변경`}
                    color={"white"}
                    onClick={() => {}}
                    // onClick={() => handleUploadClick(0)}
                    styles={{ marginRight: 4 }}
                  />
                  <ButtonR
                    name={`삭제`}
                    color={"white"}
                    onClick={() => handleDeleteFile("thumbnail", files?.thumbnail[0]?.fileUrl)}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="mt-2 field-list-wrapper">
            <div className="product-field mr-20">
              <p>
                상세이미지 등록
                <span className="font-red">*</span>
              </p>
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
                  <ButtonR
                    name={`이미지 추가 ${files?.thumbnail.length}/1`}
                    onClick={() => handleUploadClick(0)}
                  />
                </div>

                <p className="font-desc">이미지 1장, 1080px x 1080px</p>
              </div>

              {files?.thumbnail.length !== 0 && (
                <img src={files?.thumbnail[0]?.fileUrl} style={{ width: 136, height: "auto" }} />
              )}

              {files?.thumbnail.length !== 0 && (
                <div className="flex mt-16 mb-16">
                  <ButtonR
                    name={`변경`}
                    color={"white"}
                    onClick={() => {}}
                    // onClick={() => handleUploadClick(0)}
                    styles={{ marginRight: 4 }}
                  />
                  <ButtonR
                    name={`삭제`}
                    color={"white"}
                    onClick={() => handleDeleteFile("thumbnail", files?.thumbnail[0]?.fileUrl)}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="field-list-wrapper mt-2">
            <div className="product-field mr-20">
              <p>
                요약 내용<span className="font-red">*</span>
              </p>
            </div>

            <div className="mt-16 mb-16 flex1" style={{ position: "relative" }}>
              <textarea
                className="input-textarea"
                placeholder="내용을 입력해 주세요"
                value={desc}
                onChange={(e) => onChangeHandler(e)}
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

          <div className="mt-2 field-list-wrapper">
            <div className="product-field mr-20">
              <p>
                상세내용
                <span className="font-red">*</span>
              </p>
            </div>

            <div style={{ flex: 1 }}>
              <div className="list-header">
                <div className="text-center w10p">순서</div>
                <div className="text-center w80p">상품정보</div>
                <div className="text-center w10p">삭제/추가</div>
              </div>

              <div className="list-header-content">
                <div className="text-center w10p">
                  <img src={up_g} style={{ width: 28, height: "auto" }} className="mr-4 cursor" />
                  <img src={down_g} style={{ width: 28, height: "auto" }} className="cursor" />
                </div>
                <div className="text-center w80p">
                  <div className="flex align-c mb-10">
                    <div className="w10p" style={{ width: "10%" }}></div>
                    <p className="text-left font-12 font-gray">
                      추가 버튼을 클릭해서 정보를 추가해주세요.
                    </p>
                  </div>
                  <div className="flex align-c">
                    <div
                      className="font-14 text-center font-bold flex align-c justify-c"
                      style={{ width: "10%" }}
                    >
                      요약
                    </div>

                    <div style={{ width: "80%" }}>
                      <input
                        value={pointForm?.summary}
                        onChange={(e) => {
                          setPointForm((prevState: IPoint) => {
                            return {
                              ...prevState,
                              summary: e.target.value,
                            };
                          });
                        }}
                        className="input-desc"
                        placeholder="50자 이내로 입력해 주세요.(필수)"
                      />
                    </div>
                  </div>
                  <div className="flex align-c mt-10">
                    <div className="font-14 font-bold" style={{ width: "10%" }}>
                      설명
                    </div>
                    <div style={{ width: "80%" }}>
                      <textarea
                        value={pointForm?.desc}
                        onChange={(e) => {
                          setPointForm((prevState: IPoint) => {
                            return {
                              ...prevState,
                              desc: e.target.value,
                            };
                          });
                        }}
                        className="input-textarea"
                        placeholder="200자 이내로 입력해주세요(선택)"
                      />
                    </div>
                  </div>

                  <div className="flex mt-10">
                    <div className="font-14 font-bold" style={{ width: "10%" }}>
                      이미지
                    </div>
                    <div
                      className="mr-12 flex"
                      style={{
                        flexDirection: "column",
                      }}
                    >
                      <div className="flex align-c">
                        <input
                          ref={(el) => (inputFileRef.current[2] = el)}
                          onChange={(e: any) => handleFileChange2(e, "pointForm")}
                          style={{ display: "none" }}
                          type="file"
                        />
                        <ButtonR
                          onClick={() => handleUploadClick(2)}
                          name="이미지 추가 0/5"
                          styles={{ marginRight: 12 }}
                        />

                        <p className="font-desc">이미지 최소 1장 ~ 최대 5장, 가로 1080px</p>
                      </div>

                      <div
                        className={`text-left flex ${pointForm.imgUrls.length !== 0 && "mt-10"}`}
                      >
                        {pointForm.imgUrls?.length !== 0 &&
                          pointForm.imgUrls?.map((el: any, i: number) => (
                            <div key={i} className="mr-12">
                              <img src={el.imgUrl} style={{ width: 136, height: "auto" }} />
                              <div className="flex mb-16">
                                <ButtonR
                                  name={`변경`}
                                  color={"white"}
                                  onClick={() => {}}
                                  // onClick={() => handleUploadClick(1)}
                                  styles={{ marginRight: 4 }}
                                />
                                <ButtonR
                                  name={`삭제`}
                                  color={"white"}
                                  onClick={() => {}}
                                  // handleDeleteFile(
                                  //   "additionalImg",
                                  //   files?.additionalImg[i]?.fileUrl
                                  // )
                                />
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-center w10p flex justify-c">
                  <ButtonR onClick={() => handleAddForm("point")} name="추가" />
                </div>
              </div>

              {points.map((aPoint: IPoint, i: number) => (
                <div key={i} className="list-header-content">
                  <div className="text-center w10p">
                    <img
                      onClick={() => handleMoveOrder("points", points, i, i - 1)}
                      src={i === 0 ? up_g : up_b}
                      style={{ width: 28, height: "auto" }}
                      className="mr-4 cursor"
                    />
                    <img
                      onClick={() => handleMoveOrder("points", points, i, i + 1)}
                      src={i === points.length - 1 ? down_g : down_b}
                      style={{ width: 28, height: "auto" }}
                      className="cursor"
                    />
                  </div>
                  <div className="text-center w80p">
                    <div className="flex align-c">
                      <div
                        className="font-14 text-center font-bold flex align-c justify-c"
                        style={{ width: "10%" }}
                      >
                        요약
                      </div>

                      <div style={{ width: "80%" }}>
                        <input
                          value={aPoint.summary}
                          // value={pointForm?.summary}
                          // onChange={(e) => {
                          //   setPointForm((prevState: IPoint) => {
                          //     return {
                          //       ...prevState,
                          //       summary: e.target.value,
                          //     };
                          //   });
                          // }}
                          className="input-desc"
                          placeholder="50자 이내로 입력해 주세요.(필수)"
                        />
                      </div>
                    </div>
                    <div className="flex align-c mt-10">
                      <div className="font-14 font-bold" style={{ width: "10%" }}>
                        설명
                      </div>
                      <div style={{ width: "80%" }}>
                        <textarea
                          value={aPoint.desc}
                          // value={pointForm?.desc}
                          // onChange={(e) => {
                          //   setPointForm((prevState: IPoint) => {
                          //     return {
                          //       ...prevState,
                          //       desc: e.target.value,
                          //     };
                          //   });
                          // }}
                          className="input-textarea"
                          placeholder="200자 이내로 입력해주세요(선택)"
                        />
                      </div>
                    </div>

                    <div className="flex mt-10">
                      <div className="font-14 font-bold" style={{ width: "10%" }}>
                        이미지
                      </div>
                      <div
                        className="mr-12 flex"
                        style={{
                          flexDirection: "column",
                        }}
                      >
                        <div
                          className={`text-left flex ${pointForm.imgUrls.length !== 0 && "mt-10"}`}
                        >
                          {aPoint.imgUrls?.length !== 0 &&
                            aPoint.imgUrls?.map((el: any, i: number) => (
                              <div key={i} className="mr-12">
                                <img src={el.imgUrl} style={{ width: 136, height: "auto" }} />
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-center w10p">
                    <button
                      onClick={() => handleDeleteListItem("point", i)}
                      className="btn-add mr-4"
                    >
                      삭제
                    </button>
                    {/* <button onClick={() => handleAddForm("point")} className="btn-add">
                      추가
                    </button> */}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="field-list-wrapper mt-2">
            <div className="product-field mr-20">
              <p>연관 추천상품</p>
            </div>

            <div style={{ flex: 1 }} className="mt-16 mb-16">
              <div className="flex mt-10">
                <Select
                  classNamePrefix="react-select"
                  placeholder={"카테고리 대분류"}
                  defaultValue={null}
                  onChange={(e: any) => setSelectedCategory(e)}
                  options={categories}
                  className="react-select-container"
                />
                <Select
                  classNamePrefix="react-select"
                  placeholder={"카테고리 하위분류"}
                  defaultValue={null}
                  onChange={(e: any) => setSelectedSubCategory(e)}
                  options={subCategories}
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

              {relatedProducts?.products?.length !== 0 && (
                <div className="mt-4">
                  <div className="flex justify-sb align-c border-bottom-gray pt-10 pb-10">
                    <div className="flex align-c">
                      <img src={sample} className="list-img mr-10" />
                      <p>Arcadia 엘다 미니 호보백</p>
                    </div>

                    <ButtonR onClick={() => {}} color={"white"} name="삭제" />
                  </div>

                  <div className="flex justify-sb align-c border-bottom-gray pt-10 pb-10">
                    <div className="flex align-c">
                      <img src={sample} className="list-img mr-10" />
                      <p>Arcadia 엘다 미니 호보백</p>
                    </div>

                    <ButtonR onClick={() => {}} color={"white"} name="삭제" />
                  </div>

                  <div className="flex justify-sb align-c border-bottom-gray pt-10 pb-10">
                    <div className="flex align-c">
                      <img src={sample} className="list-img mr-10" />
                      <p>Arcadia 엘다 미니 호보백</p>
                    </div>

                    <ButtonR onClick={() => {}} color={"white"} name="삭제" />
                  </div>

                  <div className="flex justify-sb align-c border-bottom-gray pt-10 pb-10">
                    <div className="flex align-c">
                      <img src={sample} className="list-img mr-10" />
                      <p>Arcadia 엘다 미니 호보백</p>
                    </div>

                    <ButtonR onClick={() => {}} color={"white"} name="삭제" />
                  </div>
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
        </div>

        <div className="flex justify-sb align-c mt-34">
          <button className="btn-add pl-30 pr-30">삭제</button>
          <div className="flex">
            <button className="btn-add mr-4 pl-30 pr-30">취소</button>
            <button onClick={handleAddProduct} className="btn-add-b pl-30 pr-30">
              {loading ? "상품 등록중" : "저장"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
