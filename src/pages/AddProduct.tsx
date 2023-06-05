import React, { useEffect, useRef, useState } from "react";
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
  img: IFile[];
}

interface IProductInfo {
  title: string;
  content: string;
}

interface IFile {
  file: File | null;
  imgUrl: string;
}

export default function AddProduct(): JSX.Element {
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
    options: [],
    freeShip: true,
    originalPrice: "",
    discounted: "",
  });
  const [productOptions, setProductOptions] = useState<any>({});
  const [selectedOption, setSelectedOption] = useState(null);
  const inputFileRef = useRef<any[]>([]);
  const [files, setFiles] = useState<any>({
    thumbnail: [],
    additionalImg: [],
    points: [],
    options: [],
  });
  const [points, setPoints] = useState<IPoint[]>([]);
  const [pointForm, setPointForm] = useState<IPoint>({
    summary: "",
    desc: "",
    img: [],
  });
  const [productInfoForm, setProductInfoForm] = useState<IProductInfo>({
    title: "",
    content: "",
  });
  const [productInfos, setProductInfos] = useState<IProductInfo[]>([]);
  const [saleStatus, setSaleStatus] = useState<string>("onSale");

  // 연관상품
  const [relatedProducts, setRelatedProducts] = useState<any>({
    type: "random",
    products: [],
  });

  // 모달창 제어
  const [isOpen, setIsOpen] = useState(false);
  const { lockScroll, openScroll } = useBodyScrollLock();

  const onChangeForm = (type: string, value: string | object | boolean) => {
    setForm((prev: any) => {
      return {
        ...prev,
        [type]: value,
      };
    });
  };

  useEffect(() => {
    console.log(productOptions);
  }, [productOptions]);

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
          img: [],
        });
        break;

      case "productInfo":
        tempArr = [...productInfos];
        tempArr.push(productInfoForm);
        setProductInfos(tempArr);
        setProductInfoForm({
          title: "",
          content: "",
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
    } else {
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
  };

  return (
    <>
      {isOpen && (
        <Modal>
          <div style={{ flex: 1 }} className="padding-24">
            <div className="flex justify-sb">
              <h2 className="margin-0 mb-20">상품정보 제공공시</h2>

              <div>
                <img
                  onClick={() => {
                    handleClose();
                    setProductInfos([]);
                    setProductInfoForm({
                      title: "",
                      content: "",
                    });
                  }}
                  src={close}
                  className="img-close cursor"
                  alt="close"
                />
              </div>
            </div>
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
                <div className="flex align-c">
                  <div
                    className="font-14 text-center font-bold flex align-c justify-c"
                    style={{ width: "10%" }}
                  >
                    요약
                  </div>

                  <div style={{ width: "80%" }}>
                    <input
                      value={productInfoForm?.title}
                      onChange={(e) => {
                        setProductInfoForm((prevState: IProductInfo) => {
                          return {
                            ...prevState,
                            title: e.target.value,
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
                      value={productInfoForm?.content}
                      onChange={(e) => {
                        setProductInfoForm((prevState: IProductInfo) => {
                          return {
                            ...prevState,
                            content: e.target.value,
                          };
                        });
                      }}
                      className="input-textarea"
                      placeholder="200자 이내로 입력해주세요(선택)"
                    />
                  </div>
                </div>
              </div>
              <div className="text-center w10p">
                <ButtonR onClick={() => handleAddForm("productInfo")} name="추가" />
              </div>
            </div>

            {productInfos?.map((aProductInfo: IProductInfo, i: number) => (
              <div key={i} className="list-header-content">
                <div className="text-center w10p">
                  <img
                    onClick={() => handleMoveOrder("productInfos", productInfos, i, i - 1)}
                    src={i === 0 ? up_g : up_b}
                    style={{ width: 28, height: "auto" }}
                    className="mr-4 cursor"
                  />
                  <img
                    onClick={() => handleMoveOrder("productInfos", productInfos, i, i + 1)}
                    src={i === productInfos.length - 1 ? down_g : down_b}
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
                        value={aProductInfo?.title}
                        // onChange={(e) => {
                        //   setProductInfo((prevState: IPoint) => {
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
                        value={aProductInfo?.content}
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
                </div>
                <div className="text-center w10p">
                  <button
                    onClick={() => handleDeleteListItem("productInfo", i)}
                    className="btn-add mr-4"
                  >
                    삭제
                  </button>
                  {/* <button onClick={() => handleAddForm("productInfo")} className="btn-add">
                    추가
                  </button> */}
                </div>
              </div>
            ))}

            <div className="flex justify-fe mt-10">
              <ButtonR
                color={"white"}
                onClick={() => {
                  setProductInfos([]);
                  setProductInfoForm({
                    title: "",
                    content: "",
                  });
                  handleClose();
                }}
                styles={{ marginRight: 10 }}
                name={"취소"}
              />
              <ButtonR onClick={handleClose} name={"저장"} />
            </div>
          </div>
        </Modal>
      )}
      <div>
        <div className="flex justify-sb align-c pb-30">
          <p className="page-title">상품등록/상세</p>
          <p className="font-desc">
            <span className="font-red mr-4">*</span>
            <span>필수입력</span>
          </p>
        </div>

        {/* 카테고리/기본정보 */}
        <div>
          <p className="font-catetory">카테고리/기본정보</p>

          <div className="product-field-wrapper mt-13">
            <div className="product-field mr-20">
              <p>
                카테고리<span className="font-red">*</span>
              </p>
            </div>

            <Select
              classNamePrefix="react-select"
              placeholder={"대분류"}
              defaultValue={null}
              onChange={(e: any) => onChangeForm("category1", e.value)}
              options={Cateogyoptions1}
              className="react-select-container"
            />
            <Select
              classNamePrefix="react-select"
              placeholder={"하위분류"}
              defaultValue={null}
              onChange={(e: any) => onChangeForm("category2", e.value)}
              options={Cateogyoptions2}
              className="react-select-container"
            />
          </div>

          <div className="product-field-wrapper mt-2">
            <div className="product-field mr-20">
              <p>
                브랜드<span className="font-red">*</span>
              </p>
            </div>

            <Select
              classNamePrefix="react-select"
              placeholder={"브랜드"}
              defaultValue={null}
              onChange={(e: any) => onChangeForm("brand", e.value)}
              options={brandOptions}
              className="react-select-container"
            />
          </div>

          <div className="product-field-wrapper mt-2">
            <div className="product-field mr-20">
              <p>
                상품명<span className="font-red">*</span>
              </p>
            </div>

            <InputR
              value={form.productNameK}
              onChange={(e: any) => onChangeForm("productNameK", e.target.value)}
              placeholer={"상품명 국문 입력"}
            />
            <InputR
              value={form.productNameE}
              onChange={(e: any) => onChangeForm("productNameE", e.target.value)}
              placeholer={"상품명 영문 입력(세관신고용)"}
            />
          </div>

          <div className="product-field-wrapper mt-2">
            <div className="product-field mr-20">
              <p>
                상품코드<span className="font-red">*</span>
              </p>
            </div>

            <InputR
              value={form.productCode}
              onChange={(e: any) => onChangeForm("productCode", e.target.value)}
              placeholer={"상품코드 입력"}
            />
          </div>

          <div className="product-field-wrapper mt-2">
            <div className="product-field mr-20">
              <p>상품설명</p>
            </div>

            <InputR
              value={form.productDesc}
              onChange={(e: any) => onChangeForm("productDesc", e.target.value)}
              placeholer={"예시) 레드 / 블루 / 화이트 / 블랙"}
            />

            <p className="font-desc">
              *컬러, 종류, 맛 등 옵션이 있을 경우 ‘/’로 옵션을 구분하여 입력해주세요.
            </p>
          </div>

          <div className="product-field-wrapper mt-2">
            <div className="product-field mr-20">
              <p>
                검색 키워드<span className="font-red">*</span>
              </p>
            </div>

            <InputR
              value={form.keywords}
              onChange={(e: any) => onChangeForm("keywords", e.target.value)}
              placeholer={"예시) 키워드1, 키워드2, 키워드3"}
            />

            <p className="font-desc">*키워드는 쉼표로 구분해서 입력해주세요.</p>
          </div>

          <div className="product-field-wrapper mt-2">
            <div className="product-field mr-20">
              <p>설정</p>
            </div>
            <CheckboxS
              onChange={() => onChangeProductSetting("noneCoupon")}
              checked={form.productSetting.noneCoupon}
              name={"coupon"}
              id="check1"
            />
            <label htmlFor="check1" className="font-desc mr-18 cursor">
              쿠폰적용불가
            </label>

            <CheckboxS
              onChange={() => onChangeProductSetting("bossPick")}
              checked={form.productSetting.bossPick}
              name={"bossPick"}
              id="check2"
            />
            <label htmlFor="check2" className="font-desc mr-18 cursor">
              Boss Pick!
            </label>

            <CheckboxS
              onChange={() => onChangeProductSetting("best")}
              checked={form.productSetting.best}
              name={"best"}
              id="check3"
            />
            <label htmlFor="check3" className="font-desc mr-18 cursor">
              Best
            </label>
            <CheckboxS
              onChange={() => onChangeProductSetting("luckyDraw")}
              checked={form.productSetting.luckyDraw}
              name={"luckyDraw"}
              id="check4"
            />
            <label htmlFor="check4" className="font-desc mr-18 cursor">
              100원 럭키드로우
            </label>
            <p className="font-desc">*100원 럭키드로우 설정 시 카테고리는 이벤트로 적용해주세요.</p>
          </div>
        </div>

        {/* 판매/가격정보 */}
        <div className="mt-30">
          <div>
            <p className="font-catetory">판매/가격 정보</p>
          </div>

          <div className="product-field-wrapper mt-13">
            <div className="product-field mr-20">
              <p>면세여부</p>
            </div>

            <CheckboxS
              onChange={() => onChangeForm("dutyFree", !form.dutyFree)}
              checked={form.dutyFree}
              name={"dutyFree"}
              id="check5"
            />
            <label htmlFor="check5" className="font-desc mr-18 cursor">
              면세상품
            </label>
          </div>

          <div className="product-field-wrapper mt-2">
            <div className="product-field mr-20">
              <p>
                판매가<span className="font-red">*</span>
              </p>
            </div>

            <InputR
              value={form.originalPrice}
              onChange={(e: any) => onChangePrice("originalPrice", e.target.value)}
              placeholer={"금액 입력"}
            />
            <p className="font-desc">원</p>
          </div>

          <div className="product-field-wrapper mt-2">
            <div className="product-field mr-20">
              <p>
                할인가<span className="font-red">*</span>
              </p>
            </div>

            <InputR
              value={form.discounted}
              onChange={(e: any) => onChangePrice("discounted", e.target.value)}
              placeholer={"금액 입력"}
            />
            <p className="font-desc mr-30">원</p>

            <div className="product-field mr-20">
              <p>할인율</p>
            </div>

            <p className="font-desc">{getDiscountP()}%</p>
          </div>

          <div className="product-field-wrapper mt-2">
            <div className="product-field mr-20">
              <p>적립금 설정</p>
            </div>

            <p className="font-desc">기본 적립율 0.5%</p>
          </div>
        </div>

        {/* 옵션 */}
        <div className="mt-30">
          <div>
            <p className="font-catetory">옵션 여부</p>
          </div>

          <div className="product-field-wrapper mt-13">
            <div className="product-field mr-20">
              <p>옵션여부</p>
            </div>

            <div onClick={() => setProductOptions({})} className="checkbox-c mr-4 cursor">
              {Object.keys(productOptions).length === 0 && (
                <div className="checkbox-c-filled"></div>
              )}
            </div>
            <p onClick={() => setProductOptions({})} className="font-desc mr-20 cursor">
              옵션없음(단품)
            </p>

            <div
              onClick={() =>
                setProductOptions({
                  option1: {
                    optionName: "",
                    options: [],
                  },
                })
              }
              className="checkbox-c mr-4 cursor"
            >
              {Object.keys(productOptions).length !== 0 && (
                <div className="checkbox-c-filled"></div>
              )}
            </div>
            <p
              onClick={() =>
                setProductOptions({
                  option1: {
                    optionName: "",
                    options: [{}],
                  },
                })
              }
              className="font-desc cursor"
            >
              옵션있음
            </p>
          </div>

          {Object.keys(productOptions).length !== 0 && (
            <div className="product-field-wrapper mt-2">
              <div className="product-field mr-20">
                <p>옵션 개수</p>
              </div>

              <Select
                classNamePrefix="react-select"
                placeholder={"옵션 개수"}
                defaultValue={{
                  value: "1개",
                  label: "1개",
                }}
                onChange={(e: any) => handleChangeOption(e.value)}
                options={[
                  {
                    value: "1개",
                    label: "1개",
                  },
                  {
                    value: "2개",
                    label: "2개",
                  },
                ]}
                className="react-select-container"
              />
            </div>
          )}

          {Object.keys(productOptions).length !== 0 && (
            <div className="mt-2 field-list-wrapper">
              <div className="product-field mr-20">
                <p>
                  옵션 입력
                  <span className="font-red">*</span>
                </p>
              </div>

              <div style={{ flex: 1 }} className="mt-10 mb-10">
                <div className="list-header">
                  <div className="text-center w25p">옵션명</div>
                  <div className="text-center w25p">옵션값</div>
                  <div className="text-center w25p">추가금액</div>
                  <div className="text-center w25p">삭제/추가</div>
                </div>

                {Object.keys(productOptions).map((aOption: any, i: number) => (
                  <div key={i} className="list-header-content">
                    <div className="w25p text-center">
                      <InputR
                        size={"small"}
                        onChange={(e: any) => {
                          setProductOptions((prev: any) => {
                            return {
                              ...prev,
                              [aOption]: {
                                ...prev[aOption],
                                optionName: e.target.value,
                              },
                            };
                          });
                        }}
                        value={productOptions[aOption].optionName}
                      />
                    </div>
                    <div className="w25p text-center">
                      <InputR value={""} />

                      {/* <InputR value={""} styleClass={"mt-6"} /> */}
                    </div>

                    <div className="w25p text-center">
                      <InputR value={""} />
                      {/* <InputR value={""} styleClass={"mt-6"} /> */}
                    </div>

                    <div className="w25p text-center">
                      <div className="flex justify-c">
                        <button className="btn-add mr-4">삭제</button>
                        <button className="btn-add">추가</button>
                      </div>
                      {/* <div className="flex justify-c mt-6">
                      <button className="btn-add mr-4">삭제</button>
                      <button className="btn-add">추가</button>
                    </div> */}
                    </div>
                  </div>
                ))}

                {/* <div className="list-header-content">
                  <div className="w25p text-center">
                    <InputR size={"small"} value={""} />
                  </div>
                  <div className="w25p text-center">
                    <InputR value={""} />
                    <InputR value={""} styleClass={"mt-6"} />
                    <InputR value={""} styleClass={"mt-6"} />
                  </div>

                  <div className="w25p text-center">
                    <InputR value={""} />
                    <InputR value={""} styleClass={"mt-6"} />
                    <InputR value={""} styleClass={"mt-6"} />
                  </div>

                  <div className="w25p text-center">
                    <div className="flex justify-c">
                      <button className="btn-add mr-4">삭제</button>
                      <button className="btn-add">추가</button>
                    </div>
                    <div className="flex justify-c mt-6">
                      <button className="btn-add mr-4">삭제</button>
                      <button className="btn-add">추가</button>
                    </div>
                    <div className="flex justify-c mt-6">
                      <button className="btn-add mr-4">삭제</button>
                      <button className="btn-add">추가</button>
                    </div>
                  </div>
                </div> */}
              </div>
            </div>
          )}
        </div>

        {/* 배송 정보 */}
        <div className="mt-30">
          <div>
            <p className="font-catetory">배송정보</p>
          </div>

          <div className="product-field-wrapper mt-13">
            <div className="product-field mr-20">
              <p>배송정책</p>
            </div>

            <div onClick={() => onChangeForm("freeShip", true)} className="checkbox-c mr-4">
              {form.freeShip && <div className="checkbox-c-filled"></div>}
            </div>

            <p onClick={() => onChangeForm("freeShip", true)} className="font-desc mr-20 cursor">
              무료배송
            </p>

            <div onClick={() => onChangeForm("freeShip", false)} className="checkbox-c mr-4">
              {!form.freeShip && <div className="checkbox-c-filled"></div>}
            </div>

            <p onClick={() => onChangeForm("freeShip", false)} className="font-desc cursor">
              유료배송
            </p>

            <InputR
              size={"small"}
              styleClass="ml-10 mr-10"
              value={form.productCode}
              onChange={(e: any) => onChangeForm("productCode", e.target.value)}
            />
            <p className="font-desc">원</p>
          </div>

          <div className="product-field-wrapper mt-2">
            <div className="product-field mr-20">
              <p>제주/도서산간</p>
            </div>

            <InputR
              styleClass="mr-10"
              value={form.productCode}
              onChange={(e: any) => onChangeForm("productCode", e.target.value)}
            />
            <p className="font-desc">원</p>
          </div>
        </div>

        {/* 이미지 등록 */}
        <div className="mt-30">
          <div>
            <p className="font-catetory">이미지 등록</p>
          </div>

          {/* <div className="field-list-wrapper mt-13">
          <div className="product-field mr-20">
            <p>
              대표이미지
              <br />
              (썸네일)
              <span className="font-red">*</span>
            </p>
          </div>

          <div className="mr-12">
            <input
              style={{ display: "none" }}
              ref={(el) => (inputFileRef.current[0] = el)}
              onChange={(e) => handleFileChange(e, "thumbnail")}
              type="file"
            />
            <ButtonR name={"이미지 추가 0/1"} onClick={handleUploadClick} />
          </div>

          <p className="font-desc">이미지 1장, 1080px x 1080px</p>

          <div>으악</div>
        </div> */}
          <div className="mt-13 field-list-wrapper">
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
                    onClick={() => handleUploadClick(0)}
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

          <div className="mt-2" style={{ display: "flex" }}>
            <div className="product-field mr-20">
              <p>추가 이미지</p>
            </div>

            <div className="flex f-direction-column">
              <p className="font-desc mt-16 ">
                ※ 상품 상세화면의 상단 이미지에 대표이미지와 함께 노출됩니다.
              </p>
              <div className="list-header-content align-c" style={{ border: "none" }}>
                <div className="mr-12">
                  <input
                    style={{ display: "none" }}
                    ref={(el) => (inputFileRef.current[1] = el)}
                    onChange={(e) => handleFileChange(e, "additionalImg")}
                    type="file"
                  />
                  <ButtonR
                    name={`이미지 추가 ${files?.additionalImg.length}/4`}
                    onClick={() => handleUploadClick(1)}
                  />
                </div>

                <p className="font-desc">이미지 1장, 1080px x 1080px</p>
              </div>

              <div className="flex align-c">
                {files?.additionalImg.length !== 0 &&
                  files?.additionalImg.map((el: any, i: number) => (
                    <div key={i} className="mr-12">
                      <img
                        src={files?.additionalImg[i]?.fileUrl}
                        style={{ width: 136, height: "auto" }}
                      />
                      <div className="flex mb-16">
                        <ButtonR
                          name={`변경`}
                          color={"white"}
                          onClick={() => handleUploadClick(1)}
                          styles={{ marginRight: 4 }}
                        />
                        <ButtonR
                          name={`삭제`}
                          color={"white"}
                          onClick={() =>
                            handleDeleteFile("additionalImg", files?.additionalImg[i]?.fileUrl)
                          }
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* <div className="product-field-wrapper2">
            <p className="font-desc">
              ※ 상품 상세화면의 상단 이미지에 대표이미지와 함께 노출됩니다.
            </p>
            <div className="mr-12 mt-6 mb-6">
              <input
                style={{ display: "none" }}
                ref={(el) => (inputFileRef.current[1] = el)}
                onChange={(e) => handleFileChange(e, "additionalImg")}
                type="file"
              />
              <ButtonR name={"이미지 추가 0/4"} onClick={() => handleUploadClick(1)} />
            </div>

            <p className="font-desc">이미지 최대 4장, 1080px x 1080px</p>
          </div> */}
          </div>
        </div>

        {/* 상품 설명 */}
        <div className="mt-30">
          <div>
            <p className="font-catetory">상품설명</p>
          </div>

          <div className="mt-13 field-list-wrapper">
            <div className="product-field mr-20">
              <p>
                구매포인트
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

                  <div className="flex align-c mt-10">
                    <div className="justify-c font-14 font-bold" style={{ width: "10%" }}>
                      이미지
                    </div>
                    <div className="mr-12">
                      <ButtonR onClick={() => {}} name="이미지 추가 0/5" />
                    </div>

                    <p className="font-desc">이미지 최소 1장 ~ 최대 5장, 가로 1080px</p>
                  </div>
                </div>
                <div className="text-center w10p flex justify-c">
                  {/* <ButtonR
                    onClick={() => {}}
                    name="삭제"
                    color="white"
                    styles={{ marginRight: 4 }}
                  /> */}
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

                    <div className="flex align-c mt-10">
                      <div className="justify-c font-14 font-bold" style={{ width: "10%" }}>
                        이미지
                      </div>
                      <div className="mr-12">
                        <ButtonR onClick={() => {}} name="이미지 추가 0/5" />
                      </div>

                      <p className="font-desc">이미지 최소 1장 ~ 최대 5장, 가로 1080px</p>
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

          <div className="product-field-wrapper mt-2">
            <div className="product-field mr-20">
              <p>브랜드 소개</p>
            </div>

            <p className="font-desc">
              ※ 카테고리/기본정보에서 선택한 브랜드 정보가 자동으로 노출됩니다.
            </p>
          </div>

          <div className="mt-2 field-list-wrapper">
            <div className="product-field mr-20">
              <p>상품옵션</p>
            </div>

            <div style={{ flex: 1, padding: "15px 0" }}>
              <p className="font-desc">※ 종류, 컬러, 맛 등 각 옵션별로 이미지를 등록해 주세요.</p>
              <div className="list-header mt-6">
                <div className="text-center w10p">순서</div>
                <div className="text-center w80p">옵션정보</div>
                <div className="text-center w10p">삭제/추가</div>
              </div>

              <div className="list-header-content">
                <div className="text-center w10p">
                  <img src={up_b} style={{ width: 28, height: "auto" }} className="mr-4 cursor" />
                  <img src={down_b} style={{ width: 28, height: "auto" }} className="cursor" />
                </div>
                <div className="text-center w80p">
                  <div className="flex align">
                    <div
                      className="font-14 justify-c font-bold flex align-c"
                      style={{ width: "10%" }}
                    >
                      옵션명
                    </div>

                    <div style={{ width: "80%" }}>
                      <input
                        className="input-desc"
                        placeholder="50자 이내로 입력해 주세요.(필수)"
                      />
                    </div>
                  </div>

                  <div className="flex align-c mt-10">
                    <div className="font-14 font-bold" style={{ width: "10%" }}>
                      이미지
                    </div>
                    <div className="mr-12">
                      <ButtonR onClick={() => {}} name="이미지 추가 0/5" />
                    </div>

                    <p className="font-desc">이미지 최소 1장 ~ 최대 5장, 가로 1080px</p>
                  </div>
                </div>
                <div className="text-center w10p">
                  <button className="btn-add mr-4">삭제</button>
                  <button className="btn-add">추가</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 기타 */}
        {/* 상품 설명 */}
        <div className="mt-30">
          <div>
            <p className="font-catetory">기타</p>
          </div>

          <div className="mt-13 field-list-wrapper">
            <div className="product-field mr-20">
              <p>
                정책안내
                <span className="font-red">*</span>
              </p>
            </div>

            <div style={{ flex: 1 }}>
              <div>
                <div className="list-header-content f-direction-column">
                  <div className="flex justify-sb align-c w100p">
                    <p className="font-bold font-14">상품정보 제공공시</p>

                    <button onClick={handleOpen} className="btn-add-b">
                      등록
                    </button>
                  </div>

                  <div className={`${productInfos.length !== 0 && "mt-20"} font-400 font-gray`}>
                    {productInfos.map((el: IProductInfo, i: number) => (
                      <div key={i} className="flex mt-12">
                        <div className="w20p">
                          <p>{el.title}</p>
                        </div>

                        <div className="w80p font-14">
                          <div
                            dangerouslySetInnerHTML={{ __html: handleChangeTextarea(el.content) }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="list-header-content justify-sb align-c">
                <p className="font-bold font-14">배송정책</p>
                <button className="btn-add">수정</button>
              </div>
              <div className="list-header-content justify-sb align-c">
                <p className="font-bold font-14">취소/교환/반품 안내</p>
                <button className="btn-add">수정</button>
              </div>
            </div>
          </div>

          <div className="field-list-wrapper mt-2">
            <div className="product-field mr-20">
              <p>연관 추천상품</p>
            </div>

            <div style={{ flex: 1 }} className="mt-16 mb-16">
              <div className="flex align-c">
                <div className="checkbox-c mr-4">
                  {relatedProducts.type === "random" && <div className="checkbox-c-filled" />}
                </div>

                <p
                  onClick={() => {
                    setRelatedProducts((prev: any) => {
                      return {
                        ...prev,
                        type: "random",
                      };
                    });
                  }}
                  className="cursor font-desc mr-20"
                >
                  랜덤
                </p>

                <div className="checkbox-c mr-4">
                  {relatedProducts.type === "planned" && <div className="checkbox-c-filled" />}
                </div>
                <p
                  className="cursor font-desc mr-20"
                  onClick={() => {
                    setRelatedProducts((prev: any) => {
                      return {
                        ...prev,
                        type: "planned",
                      };
                    });
                  }}
                >
                  직접입력
                </p>

                <p className="font-desc">
                  ※ 랜덤 선택 시 동일 카테고리에 등록된 상품 4개가 랜덤으로 노출됩니다.
                </p>
              </div>

              {relatedProducts.type === "planned" && (
                <>
                  <div className="mt-20">
                    <p className="font-14 font-bold">상품선택</p>
                  </div>

                  <div className="flex mt-10">
                    <Select
                      classNamePrefix="react-select"
                      placeholder={"카테고리 대분류"}
                      defaultValue={null}
                      onChange={(e: any) => setSelectedOption(e.value)}
                      options={Cateogyoptions1}
                      className="react-select-container"
                    />
                    <Select
                      classNamePrefix="react-select"
                      placeholder={"카테고리 하위분류"}
                      defaultValue={selectedOption}
                      onChange={(e: any) => setSelectedOption(e.value)}
                      options={Cateogyoptions1}
                      className="react-select-container"
                    />
                  </div>

                  <div className="flex align-c mt-4">
                    <Select
                      classNamePrefix="react-select"
                      placeholder={"상품선택"}
                      defaultValue={selectedOption}
                      onChange={(e: any) => setSelectedOption(e.value)}
                      options={Cateogyoptions1}
                      className="react-select-container"
                    />
                    <p className="font-12">※ 최소 1개 ~ 최대 4개 선택 가능합니다.</p>
                  </div>
                </>
              )}

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

          <div className="product-field-wrapper mt-2">
            <div className="product-field mr-20">
              <p>판매상태</p>
            </div>

            <div className="checkbox-c mr-4">
              {saleStatus === "onSale" && <div className="checkbox-c-filled"></div>}
            </div>

            <p onClick={() => setSaleStatus("onSale")} className="font-desc mr-20 cursor">
              판매중
            </p>

            <div className="checkbox-c mr-4">
              {saleStatus === "saleStopped" && <div className="checkbox-c-filled"></div>}
            </div>
            <p onClick={() => setSaleStatus("saleStopped")} className="font-desc mr-20 cursor">
              판매중지
            </p>

            <div className="checkbox-c mr-4">
              {saleStatus === "soldOut" && <div className="checkbox-c-filled"></div>}
            </div>
            <p onClick={() => setSaleStatus("soldOut")} className="font-desc cursor">
              일시품절
            </p>
          </div>
        </div>

        <div className="flex justify-sb align-c mt-34">
          <button className="btn-add pl-30 pr-30">삭제</button>
          <div className="flex">
            <button className="btn-add mr-4 pl-30 pr-30">취소</button>
            <button className="btn-add-b pl-30 pr-30">저장</button>
          </div>
        </div>
      </div>
    </>
  );
}
