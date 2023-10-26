import React, { useEffect, useRef, useState } from "react";
import InputR from "../components/InputR";
import ButtonR from "../components/ButtonR";
import Select from "react-select";
import up_g from "../images/up_g.png";
import down_g from "../images/down_g.png";
import up_b from "../images/up_b.png";
import down_b from "../images/down_b.png";
import close from "../images/close.png";
import cancel from "../images/icon_cancel.png";
import { useFileUpload } from "../hooks/useFileUpload";
import Modal from "../components/Modal";
import { useBodyScrollLock } from "../hooks/useBodyScrollLock";
import {
  CANCELLATION_TERMS_DEFAULT,
  CSV_ADD_PRODUCT_TEMPLATE,
  DELIVERY_TERMS_DEFAULT,
  csvToJSON,
  currency,
  moveValue,
} from "../common/utils";
import CheckboxS from "../components/CheckboxS";
import { getDatas, postAddProduct, postUploadImage } from "../common/apis";
import { useNavigate } from "react-router-dom";
import SelectBox from "../components/SelectBox";
import { CSVLink, CSVDownload } from "react-csv";
import CSVSelector from "../components/CSVSelector";
import { json } from "stream/consumers";

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

export default function AddProduct(): JSX.Element {
  const navigate = useNavigate();
  const [form, setForm] = useState<any>({
    category1: null,
    category2: null,
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
    freeShip: false,
    deliveryFee: "15,000",
    deliveryFeeForException: "",
    deliveryType: "international",
    originalPrice: "",
    discounted: "",
  });
  const [productOptions, setProductOptions] = useState<any>({});
  const [optionsArr, setOptionsArr] = useState<any>([]);
  const [productItemOptions, setProductItemOptions] = useState<any>([]);

  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<any>(null);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);

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
      content: "ittaly, 010-4194-4399 (평일 10:00 - 17:00)",
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

  const [optionCsvPopup, setOptionCsvPopup] = useState<boolean>(false);
  const [productOptionPopup, setProductOptionPopup] = useState<boolean>(false);
  const [jsonData, setJsonData] = useState<any>([]);
  const csvRef = useRef<HTMLInputElement>(null);

  // 배송 정보 팝업
  const [deliveryTermsPopup, setDeliveryTermsPopup] = useState<boolean>(false);
  const [deliveryTerms, setDeliveryTerms] = useState<any>(
    JSON.parse(JSON.stringify(DELIVERY_TERMS_DEFAULT))
  );

  const [deliveryTermsForm, setDeliveryTermsForm] = useState<any>({
    title: "",
    contents: [""],
  });

  // 취소/교환/반품 팝업
  const [cancellationPopup, setCancellationPopup] = useState<boolean>(false);
  const [cancellationTerms, setCancellationTerms] = useState<any>(
    JSON.parse(JSON.stringify(CANCELLATION_TERMS_DEFAULT))
  );
  const [cancellationTermsForm, setCancellationTermsForm] = useState<any>({
    title: "",
    contents: [""],
  });

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    if (form.category1) {
      const targetIdx = categories.findIndex(
        (el: any, i: number) => el.value === form.category1.value
      );

      let tempCategories = [];
      for (let i = 0; i < categories[targetIdx].subCategories.length; i++) {
        tempCategories.push({
          value: categories[targetIdx].subCategories[i].optionName,
          label: categories[targetIdx].subCategories[i].optionName,
        });
      }

      setSubCategories(tempCategories);
    }

    if (selectedCategory && relatedProducts.type === "planned") {
      const targetIdx = categories.findIndex((el: any, i: number) => el === selectedCategory);

      let tempCategories = [];
      for (let i = 0; i < categories[targetIdx].subCategories?.length; i++) {
        tempCategories.push({
          value: categories[targetIdx].subCategories[i].optionName,
          label: categories[targetIdx].subCategories[i].optionName,
          categoryId: categories[targetIdx]._id,
        });
      }

      setSelectedSubCategory(null);
      setSubCategories(tempCategories);
    }

    if (selectedCategory && relatedProducts.type === "planned") {
      selectedProducts();
    }
  }, [form.category1, selectedCategory]);

  useEffect(() => {
    if (selectedSubCategory) {
      selectedProducts();
    }
  }, [selectedSubCategory]);

  const selectedProducts = async () => {
    const find = {
      categoryId: selectedSubCategory.categoryId,
      category2: selectedSubCategory.value,
    };

    const selectProducts: any = await getDatas({
      collection: "products",
      find: { ...find, delete: { $ne: true } },
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

  const init = async () => {
    // 카테고리 불러오기
    const getCategories: any = await getDatas({
      collection: "categories",
    });

    const getBrands: any = await getDatas({
      collection: "brands",
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

    let tempBrands = [];
    for (let i = 0; i < getBrands?.data?.length; i++) {
      tempBrands.push({
        value: getBrands?.data[i]?.brandName,
        label: getBrands?.data[i]?.brandName,
        _id: getBrands?.data[i]?._id,
        ...getBrands?.data[i],
      });
    }

    setCategories(tempcategories);
    setBrands(tempBrands);
  };
  const onChangeForm = (type: string, value: string | object | boolean) => {
    setForm((prev: any) => {
      return {
        ...prev,
        [type]: value,
      };
    });
  };

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
    }

    if (type === "additionalImg") {
      if (files.additionalImg.length >= 4) return alert("이미지 최대개수를 초과하셨습니다.");
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
    if (imgArr.length >= 5) return alert("이미지 개수를 초과하셨습니다.");
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

  const validationCheck = async () => {
    let isValid = true;
    // if (!selectedCategory) isValid = false;
    // if (!selectedSubCategory) isValid = false;
    const err: string[] = [];
    if (!form.category1) {
      isValid = false;
      return alert("카테고리 대분류를 선택해주세요.");
      // err.push("카테고리1");
    }
    if (!form.category2) {
      isValid = false;
      return alert("카테고리 소분류를 선택해주세요.");
      // err.push("카테고리2");
    }
    if (!form.brand) {
      isValid = false;
      return alert("브랜드를 선택해주세요.");
      // err.push("브랜드");
    }
    if (form.productNameK === "" || form.productNameE === "") {
      isValid = false;
      return alert("상품명을 입력해주세요.");
      // err.push("상품이름");
    }
    if (form.productCode === "") {
      isValid = false;
      return alert("상품 코드를 입력해주세요.");
      // err.push("상품코드");
    }
    if (form.keywords === "") {
      isValid = false;
      return alert("키워드를 입력해주세요.");
      // err.push("키워드");
    }
    if (form.originalPrice === "") {
      isValid = false;
      return alert("가격을 입력해주세요.");
      // err.push("가격");
    }
    if (form.discounted === "") {
      isValid = false;
      return alert("할인가를 입력해주세요.");
      // err.push("할인가");
    }
    if (!files.thumbnail[0]?.file) {
      isValid = false;
      return alert("썸네일 이미지를 첨부해주세요.");
      // err.push("썸네일이미지");
    }
    if (points.length === 0) {
      isValid = false;
      return alert("상품의 구매 포인트를 입력해주세요.");
      // err.push("상품포인트");
    }

    // console.log(err);
    return isValid;
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
      case "deliveryTerms":
        for (let i in deliveryTermsForm.contents) {
          if (deliveryTermsForm.contents[i] === "") return alert("내용을 입력해 주세요.");
        }
        tempArr = [...deliveryTerms];
        tempArr.push(deliveryTermsForm);
        setDeliveryTerms(tempArr);
        setDeliveryTermsForm({
          title: "",
          contents: [""],
        });

        break;
      case "cancellationTerms":
        for (let i in cancellationTermsForm.contents) {
          if (cancellationTermsForm.contents[i] === "") return alert("내용을 입력해 주세요.");
        }
        tempArr = [...cancellationTerms];
        tempArr.push(cancellationTermsForm);
        setCancellationTerms(tempArr);
        setCancellationTermsForm({
          title: "",
          contents: [""],
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
    setDeliveryTermsPopup(false);
    setCancellationPopup(false);
  };

  const handleChangeTextarea = (content: string) => {
    let str = content;

    // if (str) {
    //   str = str.replace(/(?:\r\n|\r|\n)/g, `<br/>`);
    // }

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

    if (type === "deliveryTerms") {
      setDeliveryTerms([...newArr]);
    }

    if (type === "cancellationTerms") {
      setCancellationTerms([...newArr]);
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

      case "deliveryTerms":
        tempArr = [...deliveryTerms];
        tempArr.splice(i, 1);
        setDeliveryTerms(tempArr);
        break;
      case "cancellationTerms":
        tempArr = [...cancellationTerms];
        tempArr.splice(i, 1);
        setCancellationTerms(tempArr);
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
      setProductOptions((prev: any) => {
        return {
          option1: {
            optionName: prev.option1?.optionName,
            options: prev.option1?.options
              ? prev.option1?.options
              : [
                  {
                    optionValue: "",
                  },
                ],
          },
        };
      });
    }

    if (value === "2개") {
      setProductOptions((prev: any) => {
        return {
          option1: {
            optionName: prev.option1?.optionName,
            options: prev.option1?.options
              ? prev.option1?.options
              : [
                  {
                    optionValue: "",
                  },
                ],
          },
          option2: {
            optionName: prev.option2?.optionName,
            options: prev.option2?.options
              ? prev.option2?.options
              : [
                  {
                    optionValue: "",
                  },
                ],
          },
        };
      });
    }

    if (value === "3개") {
      setProductOptions((prev: any) => {
        return {
          option1: {
            optionName: prev.option1?.optionName,
            options: prev.option1?.options
              ? prev.option1?.options
              : [
                  {
                    optionValue: "",
                  },
                ],
          },
          option2: {
            optionName: prev.option2?.optionName,
            options: prev.option2?.options
              ? prev.option2?.options
              : [
                  {
                    optionValue: "",
                  },
                ],
          },
          option3: {
            optionName: prev.option3?.optionName,
            options: prev.option3?.options
              ? prev.option3?.options
              : [
                  {
                    optionValue: "",
                  },
                ],
          },
        };
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
    if (productOptions[option].options[0]?.optionValue === "") return;
    const tempOptions = [
      {
        optionValue: "",
      },
      ...productOptions[option].options,
    ];
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

    const isValid = await validationCheck();
    if (!isValid) return;
    if (loading) return alert("상품 등록중입니다.");
    setLoading(true);

    let tempForm = { ...form };
    delete tempForm.productSetting;
    delete tempForm.originalPrice;

    let categoryId: string = "";
    for (let i in categories) {
      if (categories[i].value === form.category1.value) {
        categoryId = categories[i]._id;
      }
    }

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

    let tempOptionsArr: any = [];
    for (let i = 0; i < optionsArr.length; i++) {
      const num = parseInt(optionsArr[i].additionalPrice.replace(/,/gi, ""));
      tempOptionsArr.push({
        option: optionsArr[i].optionValue,
        additionalPrice: isNaN(num) ? 0 : num,
      });
    }

    let _body = {
      ...tempForm,
      category1: form.category1.value,
      category2: form.category2.value,
      categoryId,
      brand: tempForm.brand.value,
      brandId: tempForm.brand._id,
      price: Number(form.originalPrice.replace(/,/gi, "")),
      discounted: Number(form.discounted.replace(/,/gi, "")),
      deliveryFee: form.freeShip ? 0 : Number(form.deliveryFee.replace(/,/gi, "")),
      deliveryFeeForException: form.freeShip
        ? 0
        : Number(form.deliveryFeeForException.replace(/,/gi, "")),
      noneCoupon: form.productSetting.noneCoupon,
      bossPick: form.productSetting.bossPick,
      best: form.productSetting.best,
      luckyDraw: form.productSetting.luckyDraw,
      relatedProdType: relatedProd.length === 0 ? "random" : "manual",
      productOptions,
      productOptionsDetail: tempOptionsArr,
      productInfos,
      saleStatus,
      relatedProd,
      deliveryTerms,
      cancellationTerms,
    };

    // console.log(_body);

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

    // 상품옵션리스트

    const productAddResult: any = await postAddProduct({
      collection: "products",
      ..._body,
    });

    if (productAddResult.result) {
      alert("상품 등록이 완료되었습니다.");
      navigate("/product/productmanage");
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
        content: "ittaly, 010-4194-4399 (평일 10:00 - 17:00)",
      },
    ]);
    setProductInfoForm({
      title: "",
      content: "",
    });
    handleClose();
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
    setSubCategories([]);
    setProducts([]);
  };

  const handleDeleteFormImage = (type: string, i: number) => {
    let tempOb: any = {};

    switch (type) {
      case "pointForm":
        tempOb = { ...pointForm };
        tempOb.imgUrls.splice(i, 1);
        setPointForm(tempOb);
        break;

      case "productItemForm":
        tempOb = { ...productItemForm };
        tempOb.imgUrls.splice(i, 1);
        setProductItemForm(tempOb);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    handleGetOptions();
  }, [productOptions]);

  const handleGetOptions = () => {
    let totalArr: any = [];
    let arr1: any = [];
    let arr2: any = [];
    let arr3: any = [];

    for (let i = 0; i < productOptions.option1?.options?.length; i++) {
      if (productOptions.option1.options[i].optionValue !== "") {
        arr1.push(productOptions.option1.options[i].optionValue);
      }
    }

    for (let i = 0; i < productOptions.option2?.options?.length; i++) {
      if (productOptions.option2.options[i].optionValue !== "") {
        arr2.push(productOptions.option2.options[i].optionValue);
      }
    }

    for (let i = 0; i < productOptions.option3?.options?.length; i++) {
      if (productOptions.option3?.options[i]?.optionValue !== "") {
        arr3.push(productOptions.option3.options[i].optionValue);
      }
    }

    for (let i = 0; i < arr1.length; i++) {
      if (arr2.length !== 0) {
        for (let k = 0; k < arr2?.length; k++) {
          if (arr3.length !== 0) {
            for (let h = 0; h < arr3?.length; h++) {
              totalArr.push({
                optionValue: `${arr1[i]} / ${arr2[k]} / ${arr3[h]}`,
                additionalPrice: "",
                checked: true,
              });
            }
          } else {
            totalArr.push({
              optionValue: `${arr1[i]} / ${arr2[k]}`,
              additionalPrice: "",
              checked: true,
            });
          }
        }
      } else {
        totalArr.push({
          optionValue: `${arr1[i]}`,
          additionalPrice: "",
          checked: true,
        });
      }
    }

    setOptionsArr(totalArr);
    // return totalArr;
  };

  const handleChangePrice = (e: any, i: number) => {
    let value: string = e.target.value;
    const numCheck: boolean = /^[0-9,]/.test(value);

    if (!numCheck && value) return;

    if (numCheck) {
      const numValue = value.replaceAll(",", "");
      value = numValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    let temp = [...optionsArr];
    temp[i].additionalPrice = value;
    setOptionsArr(temp);
  };

  const handleInitProductOption = () => {
    setProductOptions({});
    setOptionsArr([]);
    setProductOptionPopup(false);
  };

  const handleCheckOption = (el: any, i: number) => {
    const findIdx = optionsArr.findIndex((item: any) => item === el);

    let temp = [...optionsArr];
    temp[findIdx].checked = !temp[findIdx].checked;
    setOptionsArr(temp);
  };

  const handleFixOptions = () => {
    const filterData = optionsArr.filter((el: any) => el.checked);

    setOptionsArr(filterData);
    setProductOptionPopup(false);
  };

  const handleFixCsvOptions = () => {
    let tempArr = [];
    for (let i = 0; i < jsonData?.length; i++) {
      if (i !== 0 && jsonData[i].status) {
        tempArr.push({
          optionValue: `${jsonData[i]?.[Object.keys(jsonData[0])[0]]} ${
            jsonData[i]?.[Object.keys(jsonData[0])[1]] ? "/" : ""
          } ${jsonData[i]?.[Object.keys(jsonData[0])[1]]}  ${
            jsonData[i]?.[Object.keys(jsonData[0])[2]] ? "/" : ""
          } ${jsonData[i]?.[Object.keys(jsonData[0])[2]]}`,
          additionalPrice: jsonData[i].추가금액,
          checked: true,
        });
      }
    }

    setOptionsArr(tempArr);
    setOptionCsvPopup(false);
  };

  const handleDeleteTermsOption = (body: any) => {
    let temp = body.termType === "deliveryTerms" ? [...deliveryTerms] : [...cancellationTerms];
    const tempIndex = temp.findIndex((el) => el === body.termItem);
    temp[tempIndex].contents.splice(body.index, 1);
    if (body.termType === "deliveryTerms") {
      setDeliveryTerms(temp);
    } else {
      setCancellationTerms(temp);
    }
  };

  const handleDeleteRelatedProducts = (item: any, index: number) => {
    let temp = [...relatedProducts.products];

    temp.splice(index, 1);
    setRelatedProducts((prev: any) => {
      return {
        ...prev,
        products: temp,
      };
    });
  };

  const handleAddCancellationField = (termItem: any, i: number) => {
    let tempArr = [...cancellationTerms];
    tempArr[i].contents.push("");
    setDeliveryTerms(tempArr);
  };

  const handleAddDeliveryField = (termItem: any, i: number) => {
    let tempArr = [...deliveryTerms];
    tempArr[i].contents.push("");
    setDeliveryTerms(tempArr);
  };

  const handleChangeTermFieldInput = (body: any) => {
    let temp = body.termType === "deliveryTerms" ? [...deliveryTerms] : [...cancellationTerms];
    if (body.type === "title") {
      temp[body.termIndex].title = body.value;
    } else {
      temp[body.termIndex].contents[body.contentIndex] = body.value;
    }

    if (body.termType === "deliveryTerms") {
      setDeliveryTerms(temp);
    } else {
      setCancellationTerms(temp);
    }
  };

  const handleResetDeliveryTerm = () => {
    setDeliveryTerms(JSON.parse(JSON.stringify(DELIVERY_TERMS_DEFAULT)));
    setDeliveryTermsForm({
      title: "",
      contents: [""],
    });
    handleClose();
  };

  return (
    <>
      {productOptionPopup && (
        <Modal>
          <div className="padding-24">
            <div className="flex justify-sb">
              <h2 className="margin-0 mb-20">옵션 추가하기</h2>

              <div>
                <img
                  onClick={handleInitProductOption}
                  src={close}
                  className="img-close cursor"
                  alt="close"
                />
              </div>
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
                    {
                      value: "3개",
                      label: "3개",
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
                    <div className="text-center w33p">옵션명</div>
                    <div className="text-center w33p">옵션값</div>

                    <div className="text-center w33p">삭제/추가</div>
                  </div>

                  {Object.keys(productOptions)?.map((aOption: any, i: number) => (
                    <div key={i} className="list-header-content">
                      <div className="w33p text-center">
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

                      <div style={{ width: "66%" }}>
                        {productOptions[aOption]?.options?.map((optionItem: any, index: number) => (
                          <div className="flex w100p text-center">
                            <div className="w50p text-center">
                              <InputR
                                innerStyle={{ marginTop: 4 }}
                                value={optionItem.optionValue ? optionItem.optionValue : ""}
                                onChange={(e: any) =>
                                  onChangeOptions(aOption, index, e, "optionValue")
                                }
                              />
                            </div>

                            <div className="w50p text-center mt-4">
                              <div className="flex justify-c">
                                {index !== 0 && (
                                  <button
                                    onClick={() => handleDeleteOption(aOption, index)}
                                    className="btn-add"
                                  >
                                    삭제
                                  </button>
                                )}
                                {index === 0 && (
                                  <button
                                    onClick={() => handleAddOption(aOption)}
                                    className="btn-add-b"
                                  >
                                    추가
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* <div>{JSON.stringify(handleGetOptions())}</div> */}

            <div className="mt-20">
              <div className="flex flex-wrap flex1">
                <div className="flex1">
                  <p className="font-bold font-14 mb-10">항목</p>
                </div>
                <div className="flex1">
                  <p className="font-bold font-14">추가금액</p>
                </div>
              </div>

              {optionsArr?.map((el: any, i: number) => (
                <div key={i} className="flex flex-wrap flex1">
                  <div className="flex1">
                    <div className="option-item flex align-c">
                      <div onClick={() => handleCheckOption(el, i)} className="option-check">
                        {el.checked && <p className="font-12 option-checked">✔</p>}
                      </div>
                      <p className="font-14">{el.optionValue}</p>
                    </div>
                  </div>
                  <div className="flex1 flex align-c">
                    <input
                      value={el.additionalPrice}
                      onChange={(e: any) => handleChangePrice(e, i)}
                      className="option-item-input"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-fe">
              <ButtonR
                name={"취소"}
                onClick={handleInitProductOption}
                styleClass="mr-10"
                color={"white"}
              />
              <ButtonR name={"등록하기"} onClick={handleFixOptions} styleClass="mr-12" />
            </div>
          </div>
        </Modal>
      )}
      {isOpen && (
        <Modal>
          <div style={{ flex: 1 }} className="padding-24">
            <div className="flex justify-sb">
              <h2 className="margin-0 mb-20">상품정보 제공공시</h2>

              <div>
                <img
                  onClick={() => {
                    handleClose();
                    setProductInfos([
                      {
                        title: "제조국",
                        content: "이탈리아",
                      },
                      {
                        title: "품질 보증 기준",
                        content:
                          "공정거래위원회 고시(소비자분쟁해결기준)에 의거하여 보상해 드립니다.",
                      },
                      {
                        title: "A/S 책임자와 전화번호",
                        content: "ittaly, 010-4194-4399 (평일 10:00 - 17:00)",
                      },
                    ]);
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
                  handleCancelProductInfo();
                }}
                styles={{ marginRight: 10 }}
                name={"취소"}
              />
              <ButtonR onClick={handleClose} name={"저장"} />
            </div>
          </div>
        </Modal>
      )}
      {optionCsvPopup && (
        <Modal innerStyle={{ minHeight: 0 }}>
          <div className="padding-24">
            <div className="flex justify-sb">
              <h2 className="margin-0 mb-20">옵션 엑셀 등록하기</h2>

              <div>
                <img
                  onClick={() => {
                    handleInitProductOption();
                    setOptionCsvPopup(false);
                  }}
                  src={close}
                  className="img-close cursor"
                  alt="close"
                />
              </div>
            </div>

            <div className="text-center">
              <CSVSelector
                csvType="addProduct"
                ref={csvRef}
                onChange={(_data: any) => setJsonData(_data)}
              />

              <ButtonR
                name={"CSV 업로드"}
                styles={{ backgroundColor: "#f1f1f1", paddingLeft: 25, paddingRight: 25 }}
                color={"white"}
                onClick={() => csvRef?.current?.click()}
              />
              <div className="mt-20 mb-20">
                <p>CSV 양식을 내려받아 옵션 입력 후 업로드해주세요.</p>
                <p className="mt-4">
                  옵션 개수 및 양식과 다르게 입력된 경우 옵션이 등록되지 않습니다.
                </p>
              </div>

              <CSVLink
                data={CSV_ADD_PRODUCT_TEMPLATE}
                headers={[
                  { label: "옵션1", key: "option1" },
                  { label: "옵션2", key: "option2" },
                  { label: "옵션3", key: "option3" },
                  { label: "추가금액", key: "additionalPrice" },
                ]}
                // confirm 창에서 '확인'을 눌렀을 때만 csv 파일 다운로드
                onClick={() => {
                  if (window.confirm("csv파일을 다운로드 받겠습니까?")) {
                    return true;
                  } else {
                    return false;
                  }
                }}
                filename={`옵션 시트`}
              >
                <p>CSV 양식 내려받기</p>
              </CSVLink>
            </div>

            {jsonData.length !== 0 && (
              <div className="list-header mt-30 pl-18 pr-18">
                <div className="w20p">
                  <p>{jsonData[0]?.[Object.keys(jsonData[0])[0]]}</p>
                </div>

                <div className="w20p">
                  {jsonData[0]?.[Object.keys(jsonData[0])[1]] && (
                    <p>{jsonData[0]?.[Object.keys(jsonData[0])[1]]}</p>
                  )}
                </div>

                <div className="w20p">
                  {jsonData[0]?.[Object.keys(jsonData[0])[2]] && (
                    <p>{jsonData[0]?.[Object.keys(jsonData[0])[2]]}</p>
                  )}
                </div>

                <div className="w20p">
                  <p>추가금액</p>
                </div>

                <div className="w20p">
                  <p>결과</p>
                </div>
              </div>
            )}

            {jsonData?.length !== 0 &&
              jsonData?.map((el: any, i: number) => (
                <div key={i}>
                  {i !== 0 && (
                    <div key={i} className="list-content pl-18 pr-18">
                      <div className="flex align-c mt-8 mb-8">
                        <div className="w20p">
                          <p>{jsonData[i]?.[Object.keys(jsonData[0])[0]]}</p>
                        </div>

                        <div className="w20p">
                          <p>{jsonData[i]?.[Object.keys(jsonData[0])[1]]}</p>
                        </div>

                        <div className="w20p">
                          <p>{jsonData[i]?.[Object.keys(jsonData[0])[2]]}</p>
                        </div>

                        <div className="w20p">
                          {el.status && <p>{jsonData[i]?.추가금액}</p>}
                          {!el.status && <p className="font-red">{jsonData[i]?.추가금액}</p>}
                        </div>

                        <div className="w20p">
                          {el.status && <p>성공</p>}
                          {!el.status && <p className="font-red">실패</p>}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}

            <div className="flex justify-fe">
              <ButtonR
                name={"취소"}
                onClick={() => {
                  handleInitProductOption();
                  setOptionCsvPopup(false);
                }}
                styleClass="mr-10"
                color={"white"}
              />
              <ButtonR name={"등록하기"} onClick={handleFixCsvOptions} styleClass="mr-12" />
            </div>
          </div>
        </Modal>
      )}
      {deliveryTermsPopup && (
        <Modal>
          <div style={{ flex: 1 }} className="padding-24">
            <div className="flex justify-sb">
              <h2 className="margin-0 mb-20">배송정보</h2>

              <div>
                <img
                  onClick={() => {
                    setDeliveryTerms(JSON.parse(JSON.stringify(DELIVERY_TERMS_DEFAULT)));
                    setDeliveryTermsForm({
                      title: "",
                      contents: [""],
                    });
                    handleClose();
                  }}
                  src={close}
                  className="img-close cursor"
                  alt="close"
                />
              </div>
            </div>
            <div className="list-header">
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
                    제목
                  </div>

                  <div className="flex align-c" style={{ width: "80%" }}>
                    <input
                      value={deliveryTermsForm?.title}
                      onChange={(e) => {
                        setDeliveryTermsForm((prevState: any) => {
                          return {
                            ...prevState,
                            title: e.target.value,
                          };
                        });
                      }}
                      className="input-desc"
                      placeholder="제목을 입력하세요 (15자 이내)"
                    />
                    <div className="ml-24"></div>
                  </div>
                </div>
                {deliveryTermsForm.contents?.map((aContent: any, i: number) => (
                  <div key={i} className="flex align-c mt-10">
                    <div className="font-14 font-bold" style={{ width: "10%" }}>
                      {i === 0 && "내용"}
                    </div>

                    <div className="flex align-c" style={{ width: "80%" }}>
                      <textarea
                        value={aContent}
                        onChange={(e) => {
                          let temp = [...deliveryTermsForm.contents];
                          temp[i] = e.target.value;
                          setDeliveryTermsForm((prevState: any) => {
                            return {
                              ...prevState,
                              contents: temp,
                            };
                          });
                        }}
                        className="input-textarea-s"
                        placeholder="내용을 입력하세요"
                      />
                      <div className="ml-24"></div>
                    </div>
                  </div>
                ))}

                <div className="flex align-c mt-10 justify-c">
                  <p
                    onClick={() => {
                      if (deliveryTermsForm.contents[deliveryTermsForm.contents.length - 1] === "")
                        return;
                      setDeliveryTermsForm((prev: any) => {
                        return {
                          ...prev,
                          contents: [...prev.contents, ""],
                        };
                      });
                    }}
                    className="text-center font-bold cursor"
                  >
                    + 내용 값 추가하기
                  </p>
                </div>
              </div>
              <div className="text-center w10p">
                <ButtonR onClick={() => handleAddForm("deliveryTerms")} name="추가" />
              </div>
            </div>

            {deliveryTerms?.map((termItem: any, i: number) => (
              <div key={i} className="list-header-content">
                <div className="text-center w10p">
                  <img
                    onClick={() => handleMoveOrder("deliveryTerms", deliveryTerms, i, i - 1)}
                    src={i === 0 ? up_g : up_b}
                    style={{ width: 28, height: "auto" }}
                    className="mr-4 cursor"
                  />
                  <img
                    onClick={() => handleMoveOrder("deliveryTerms", deliveryTerms, i, i + 1)}
                    src={i === deliveryTerms.length - 1 ? down_g : down_b}
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
                      제목
                    </div>

                    <div className="flex align-c" style={{ width: "80%" }}>
                      <input
                        onChange={(e: any) =>
                          handleChangeTermFieldInput({
                            termType: "deliveryTerms",
                            termIndex: i,
                            type: "title",
                            value: e.target.value,
                          })
                        }
                        value={termItem?.title}
                        className="input-desc"
                        placeholder=""
                      />
                      <div className="ml-10" style={{ width: 20 }} />
                    </div>
                  </div>
                  {termItem?.contents?.map((aContent: any, index: number) => (
                    <div key={index} className="flex align-c mt-10">
                      <div
                        className="font-14 text-center font-bold flex align-c justify-c"
                        style={{ width: "10%" }}
                      >
                        {index === 0 && "내용"}
                      </div>
                      <div className="flex align-c" style={{ width: "80%" }}>
                        <textarea
                          onChange={(e: any) =>
                            handleChangeTermFieldInput({
                              termType: "deliveryTerms",
                              termIndex: i,
                              contentIndex: index,
                              type: "contents",
                              value: e.target.value,
                            })
                          }
                          value={aContent}
                          className="input-textarea-s"
                          placeholder="200자 이내로 입력해주세요(선택)"
                        />
                        <img
                          onClick={() =>
                            handleDeleteTermsOption({
                              termType: "deliveryTerms",
                              termItem,
                              contentItem: aContent,
                              index,
                            })
                          }
                          className="ml-10 cursor"
                          src={cancel}
                          style={{ width: 20, height: "auto" }}
                        />
                      </div>
                    </div>
                  ))}
                  <p
                    onClick={() => handleAddDeliveryField(termItem, i)}
                    className="text-center font-bold cursor mt-10"
                  >
                    + 내용 값 추가하기
                  </p>
                </div>
                <div className="text-center w10p">
                  <button
                    onClick={() => handleDeleteListItem("deliveryTerms", i)}
                    className="btn-add mr-4"
                  >
                    삭제
                  </button>
                </div>
              </div>
            ))}

            <div className="flex justify-fe mt-10">
              <ButtonR
                color={"white"}
                onClick={handleResetDeliveryTerm}
                styles={{ marginRight: 10 }}
                name={"취소"}
              />
              <ButtonR onClick={handleClose} name={"저장"} />
            </div>
          </div>
        </Modal>
      )}
      {cancellationPopup && (
        <Modal>
          <div style={{ flex: 1 }} className="padding-24">
            <div className="flex justify-sb">
              <h2 className="margin-0 mb-20">배송정보</h2>

              <div>
                <img
                  onClick={() => {
                    setCancellationTerms(CANCELLATION_TERMS_DEFAULT);
                    setCancellationTermsForm({
                      title: "",
                      contents: [""],
                    });
                    handleClose();
                  }}
                  src={close}
                  className="img-close cursor"
                  alt="close"
                />
              </div>
            </div>
            <div className="list-header">
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
                    제목
                  </div>

                  <div className="flex align-c" style={{ width: "80%" }}>
                    <input
                      value={cancellationTermsForm?.title}
                      onChange={(e) => {
                        setCancellationTermsForm((prevState: any) => {
                          return {
                            ...prevState,
                            title: e.target.value,
                          };
                        });
                      }}
                      className="input-desc"
                      placeholder="제목을 입력하세요 (15자 이내)"
                    />
                    <div className="ml-24"></div>
                  </div>
                </div>
                {cancellationTermsForm.contents?.map((aContent: any, i: number) => (
                  <div key={i} className="flex align-c mt-10">
                    <div className="font-14 font-bold" style={{ width: "10%" }}>
                      {i === 0 && "내용"}
                    </div>

                    <div className="flex align-c" style={{ width: "80%" }}>
                      <textarea
                        value={aContent}
                        onChange={(e) => {
                          let temp = [...cancellationTermsForm.contents];
                          temp[i] = e.target.value;
                          setCancellationTermsForm((prevState: any) => {
                            return {
                              ...prevState,
                              contents: temp,
                            };
                          });
                        }}
                        className="input-textarea-s"
                        placeholder="내용을 입력하세요"
                      />
                      <div className="ml-24"></div>
                    </div>
                  </div>
                ))}

                <div className="flex align-c mt-10 justify-c">
                  <p
                    onClick={() => {
                      if (
                        cancellationTermsForm.contents[
                          cancellationTermsForm.contents.length - 1
                        ] === ""
                      )
                        return;
                      setCancellationTermsForm((prev: any) => {
                        return {
                          ...prev,
                          contents: [...prev.contents, ""],
                        };
                      });
                    }}
                    className="text-center font-bold cursor"
                  >
                    + 내용 값 추가하기
                  </p>
                </div>
              </div>
              <div className="text-center w10p">
                <ButtonR onClick={() => handleAddForm("cancellationTerms")} name="추가" />
              </div>
            </div>

            {cancellationTerms?.map((termItem: any, i: number) => (
              <div key={i} className="list-header-content">
                <div className="text-center w10p">
                  <img
                    onClick={() =>
                      handleMoveOrder("cancellationTerms", cancellationTerms, i, i - 1)
                    }
                    src={i === 0 ? up_g : up_b}
                    style={{ width: 28, height: "auto" }}
                    className="mr-4 cursor"
                  />
                  <img
                    onClick={() =>
                      handleMoveOrder("cancellationTerms", cancellationTerms, i, i + 1)
                    }
                    src={i === cancellationTerms.length - 1 ? down_g : down_b}
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
                      제목
                    </div>

                    <div className="flex align-c" style={{ width: "80%" }}>
                      <input
                        onChange={(e: any) =>
                          handleChangeTermFieldInput({
                            termType: "cancellationTerms",
                            termIndex: i,
                            type: "title",
                            value: e.target.value,
                          })
                        }
                        value={termItem?.title}
                        className="input-desc"
                        placeholder=""
                      />
                      <div className="ml-10" style={{ width: 20 }} />
                    </div>
                  </div>
                  {termItem?.contents?.map((aContent: any, index: number) => (
                    <div key={index} className="flex align-c mt-10">
                      <div
                        className="font-14 text-center font-bold flex align-c justify-c"
                        style={{ width: "10%" }}
                      >
                        {index === 0 && "내용"}
                      </div>
                      <div className="flex align-c" style={{ width: "80%" }}>
                        <textarea
                          onChange={(e: any) =>
                            handleChangeTermFieldInput({
                              termType: "cancellation",
                              termIndex: i,
                              contentIndex: index,
                              type: "contents",
                              value: e.target.value,
                            })
                          }
                          value={aContent}
                          className="input-textarea-s"
                          placeholder="200자 이내로 입력해주세요(선택)"
                        />
                        <img
                          onClick={() =>
                            handleDeleteTermsOption({
                              termType: "cancellationTerms",
                              termItem,
                              contentItem: aContent,
                              index,
                            })
                          }
                          className="ml-10 cursor"
                          src={cancel}
                          style={{ width: 20, height: "auto" }}
                        />
                      </div>
                    </div>
                  ))}
                  <p
                    onClick={() => handleAddCancellationField(termItem, i)}
                    className="text-center font-bold cursor mt-10"
                  >
                    + 내용 값 추가하기
                  </p>
                </div>
                <div className="text-center w10p">
                  <button
                    onClick={() => handleDeleteListItem("cancellationTerms", i)}
                    className="btn-add mr-4"
                  >
                    삭제
                  </button>
                </div>
              </div>
            ))}

            <div className="flex justify-fe mt-10">
              <ButtonR
                color={"white"}
                onClick={handleResetDeliveryTerm}
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
          <p className="font-category">카테고리/기본정보</p>

          <div className="product-field-wrapper mt-13">
            <div className="product-field mr-20">
              <p>
                카테고리<span className="font-red">*</span>
              </p>
            </div>

            <SelectBox
              containerStyles={{ marginRight: 8 }}
              placeholder={"대분류"}
              value={form.category1}
              onChange={(e: any) => onChangeForm("category1", e)}
              options={categories}
              noOptionsMessage="등록된 카테고리가 없습니다."
            />

            <SelectBox
              placeholder={"하위분류"}
              value={form.category2}
              onChange={(e: any) => onChangeForm("category2", e)}
              options={subCategories}
              noOptionsMessage={"카테고리가 없습니다."}
            />
          </div>

          <div className="product-field-wrapper mt-2">
            <div className="product-field mr-20">
              <p>
                브랜드<span className="font-red">*</span>
              </p>
            </div>

            <SelectBox
              placeholder={"브랜드"}
              defaultValue={null}
              onChange={(e: any) => onChangeForm("brand", e)}
              options={brands}
              noOptionsMessage={"등록된 브랜드가 없습니다."}
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
            <p className="font-category">판매/가격 정보</p>
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
            <p className="font-category">옵션 여부</p>
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
                    options: [
                      {
                        optionValue: "",
                      },
                    ],
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
                    options: [
                      {
                        optionValue: "",
                      },
                    ],
                  },
                })
              }
              className="font-desc cursor"
            >
              옵션있음
            </p>
          </div>

          {Object.keys(productOptions).length !== 0 && (
            <div className="mt-2 field-list-wrapper">
              <div className="product-field mr-20">
                <p>옵션 입력</p>
              </div>

              <div className="align-c flex1 pt-10 pb-10">
                <div className="flex align-c">
                  <ButtonR
                    name={"옵션 추가하기"}
                    styleClass="mr-10"
                    onClick={() => setProductOptionPopup(true)}
                  />
                  <ButtonR
                    color={"white"}
                    name={"옵션 엑셀 등록"}
                    onClick={() => setOptionCsvPopup(true)}
                  />
                </div>
                <div className={`${optionsArr.length !== 0 ? "mt-10" : ""}`}>
                  {optionsArr.map((aOption: any, i: number) => (
                    <div key={i} className="border-bottom-gray pt-10 pb-10">
                      <p>
                        {aOption.optionValue}{" "}
                        {aOption.additionalPrice && aOption.additionalPrice !== ""
                          ? `(+${aOption.additionalPrice})`
                          : ""}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 배송 정보 */}
        <div className="mt-30">
          <div>
            <p className="font-category">배송정보</p>
          </div>

          <div className="product-field-wrapper mt-13">
            <div className="product-field mr-20">
              <p>배송유형</p>
            </div>

            <div
              onClick={() => {
                onChangeForm("deliveryType", "international");
                onChangePrice("deliveryFee", "15000");
              }}
              className="checkbox-c mr-4"
            >
              {form.deliveryType === "international" && <div className="checkbox-c-filled"></div>}
            </div>

            <p
              onClick={() => {
                onChangeForm("deliveryType", "international");
                onChangePrice("deliveryFee", "15000");
              }}
              className="font-desc mr-20 cursor"
            >
              해외배송
            </p>

            <div
              onClick={() => {
                onChangeForm("deliveryType", "domestic");
                onChangePrice("deliveryFee", "3000");
              }}
              className="checkbox-c mr-4"
            >
              {form.deliveryType === "domestic" && <div className="checkbox-c-filled"></div>}
            </div>

            <p
              onClick={() => {
                onChangeForm("deliveryType", "domestic");
                onChangePrice("deliveryFee", "3000");
              }}
              className="font-desc cursor"
            >
              국내배송
            </p>
          </div>

          <div className="product-field-wrapper mt-2">
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

            {!form.freeShip && (
              <>
                <InputR
                  size={"small"}
                  styleClass="ml-10 mr-10"
                  value={form.deliveryFee}
                  onChange={(e: any) => onChangePrice("deliveryFee", e.target.value)}
                />
                <p className="font-desc">원</p>
              </>
            )}
          </div>

          <div className="product-field-wrapper mt-2">
            <div className="product-field mr-20">
              <p>제주/도서산간</p>
            </div>

            <InputR
              styleClass="mr-10"
              value={form.deliveryFeeForException}
              onChange={(e: any) => onChangePrice("deliveryFeeForException", e.target.value)}
            />
            <p className="font-desc">원</p>
          </div>
        </div>

        {/* 이미지 등록 */}
        <div className="mt-30">
          <div>
            <p className="font-category">이미지 등록</p>
          </div>

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

          <div className="mt-2 flex">
            <div className="product-field mr-20">
              <p>추가 이미지</p>
            </div>

            <div className="flex f-direction-column">
              <p className="font-desc mt-16 ">
                ※ 상품 상세화면의 상단 이미지에 대표이미지와 함께 노출됩니다.
              </p>
              <div className="list-header-content align-c border-none">
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
                        {/* <ButtonR
                          name={`변경`}
                          color={"white"}
                          onClick={() => {}}
                          // onClick={() => handleUploadClick(1)}
                          styles={{ marginRight: 4 }}
                        /> */}
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
            <p className="font-category">상품설명</p>
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
                  <div className="flex align-c mb-10">
                    <div className="w10p"></div>
                    <p className="text-left font-12 font-gray">
                      추가 버튼을 클릭해서 정보를 추가해주세요.
                    </p>
                  </div>
                  <div className="flex align-c">
                    <div className="font-14 text-center font-bold flex align-c justify-c w10p">
                      요약
                    </div>

                    <div className="w80p">
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
                    <div className="font-14 w10p font-bold">설명</div>
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
                    <div className="font-14 font-bold w10p">이미지</div>
                    <div className="mr-12 flex f-direction-column">
                      <div className="flex align-c">
                        <input
                          ref={(el) => (inputFileRef.current[2] = el)}
                          onChange={(e: any) => handleFileChange2(e, "pointForm")}
                          style={{ display: "none" }}
                          type="file"
                        />
                        <ButtonR
                          onClick={() => handleUploadClick(2)}
                          name={`이미지 추가 ${pointForm?.imgUrls?.length}/5`}
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
                                {/* <ButtonR
                                  name={`변경`}
                                  color={"white"}
                                  onClick={() => {}}
                                  // onClick={() => handleUploadClick(1)}
                                  styles={{ marginRight: 4 }}
                                /> */}
                                <ButtonR
                                  name={`삭제`}
                                  color={"white"}
                                  onClick={() => handleDeleteFormImage("pointForm", i)}
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
                      <div className="font-14 font-bold w10p">설명</div>
                      <div className="w80p">
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
                      <div className="font-14 font-bold w10p">이미지</div>
                      <div className="mr-12 flex f-direction-column">
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
              <p>브랜드 소개</p>
            </div>

            <div className="flex1" style={{ padding: "15px 0" }}>
              <p className="font-desc">
                ※ 카테고리/기본정보에서 선택한 브랜드 정보가 자동으로 노출됩니다.
              </p>

              <p className="font-bold mt-10 font-16">{form.brand.brandName}</p>
              <p className="mt-10">{form.brand.desc}</p>
              <img
                className="mt-10"
                src={form.brand.imgUrl}
                style={{ width: 320, height: "auto" }}
              />
            </div>
          </div>

          <div className="mt-2 field-list-wrapper">
            <div className="product-field mr-20">
              <p>상품옵션</p>
            </div>

            <div className="flex1" style={{ padding: "15px 0" }}>
              <p className="font-desc">※ 종류, 컬러, 맛 등 각 옵션별로 이미지를 등록해 주세요.</p>
              <div className="list-header mt-6">
                <div className="text-center w10p">순서</div>
                <div className="text-center w80p">옵션정보</div>
                <div className="text-center w10p">삭제/추가</div>
              </div>

              <div className="list-header-content">
                <div className="text-center w10p">
                  <img src={up_g} style={{ width: 28, height: "auto" }} className="mr-4 cursor" />
                  <img src={down_g} style={{ width: 28, height: "auto" }} className="cursor" />
                </div>
                <div className="text-center w80p">
                  <div className="flex align-c mb-10">
                    <div className="w10p"></div>
                    <p className="text-left font-12 font-gray">
                      추가 버튼을 클릭해서 정보를 추가해주세요.
                    </p>
                  </div>

                  <div className="flex align">
                    <div className="font-14 justify-c font-bold flex align-c w10p">옵션명</div>

                    <div className="w80p">
                      <input
                        value={productItemForm.optionName}
                        onChange={(e: any) => {
                          setProductItemForm((prev: any) => {
                            return {
                              ...prev,
                              optionName: e.target.value,
                            };
                          });
                        }}
                        className="input-desc"
                        placeholder="10자 이내로 입력해 주세요.(필수)"
                      />
                    </div>
                  </div>

                  <div className="flex align-c mt-10">
                    <div className="font-14 font-bold w10p">이미지</div>
                    <div className="mr-12 flex f-direction-column">
                      <div className="flex align-c">
                        <input
                          ref={(el) => (inputFileRef.current[3] = el)}
                          onChange={(e: any) => handleFileChange2(e, "productItemForm")}
                          style={{ display: "none" }}
                          type="file"
                        />
                        <ButtonR
                          onClick={() => handleUploadClick(3)}
                          name={`이미지 추가 ${productItemForm?.imgUrls?.length}/5`}
                          styles={{ marginRight: 12 }}
                        />

                        <p className="font-desc">이미지 최소 1장 ~ 최대 5장, 가로 1080px</p>
                      </div>

                      <div
                        className={`text-left flex ${
                          productItemForm?.imgUrls.length !== 0 && "mt-10"
                        }`}
                      >
                        {productItemForm.imgUrls?.length !== 0 &&
                          productItemForm.imgUrls?.map((el: any, i: number) => (
                            <div key={i} className="mr-12">
                              <img src={el.imgUrl} style={{ width: 136, height: "auto" }} />
                              <div className="flex mb-16">
                                {/* <ButtonR
                                  name={`변경`}
                                  color={"white"}
                                  onClick={() => {}}
                                  // onClick={() => handleUploadClick(1)}
                                  styles={{ marginRight: 4 }}
                                /> */}
                                <ButtonR
                                  name={`삭제`}
                                  color={"white"}
                                  onClick={() => handleDeleteFormImage("productItemForm", i)}
                                />
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-center w10p">
                  <button onClick={() => handleAddForm("productItem")} className="btn-add-b">
                    추가
                  </button>
                </div>
              </div>

              {productItemOptions?.map((aItem: any, i: number) => (
                <div key={i} className="list-header-content">
                  <div className="text-center w10p">
                    <img
                      onClick={() => handleMoveOrder("productItem", productItemOptions, i, i - 1)}
                      src={i === 0 ? up_g : up_b}
                      style={{ width: 28, height: "auto" }}
                      className="mr-4 cursor"
                    />
                    <img
                      onClick={() => handleMoveOrder("productItem", productItemOptions, i, i + 1)}
                      src={i === productItemOptions.length - 1 ? down_g : down_b}
                      style={{ width: 28, height: "auto" }}
                      className="cursor"
                    />
                  </div>
                  <div className="text-center w80p">
                    <div className="flex align">
                      <div className="font-14 justify-c font-bold flex align-c w10p">옵션명</div>

                      <div className="w80p">
                        <input
                          value={aItem.optionName}
                          className="input-desc"
                          placeholder="10자 이내로 입력해 주세요.(필수)"
                        />
                      </div>
                    </div>

                    <div className="flex mt-10">
                      <div className="font-14 font-bold w10p">이미지</div>
                      <div
                        className="mr-12 flex"
                        style={{
                          flexDirection: "column",
                        }}
                      >
                        <div
                          className={`text-left flex ${
                            productItemForm.imgUrls?.length !== 0 && "mt-10"
                          }`}
                        >
                          {aItem.imgUrls?.length !== 0 &&
                            aItem.imgUrls?.map((el: any, i: number) => (
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
                      onClick={() => handleDeleteListItem("productItemOptions", i)}
                      className="btn-add"
                    >
                      삭제
                    </button>
                    {/* <button className="btn-add">추가</button> */}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 기타 */}
        {/* 상품 설명 */}
        <div className="mt-30">
          <div>
            <p className="font-category">기타</p>
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
              <div>
                <div className="list-header-content f-direction-column">
                  <div className="flex justify-sb align-c w100p">
                    <p className="font-bold font-14">배송정책</p>

                    <button onClick={() => setDeliveryTermsPopup(true)} className="btn-add">
                      수정
                    </button>
                  </div>

                  <div className={`${deliveryTerms?.length !== 0 && ""} font-400 font-gray`}>
                    {deliveryTerms?.map((el: any, i: number) => (
                      <div key={i} className="flex mt-12">
                        <div className="w20p">
                          <p>{el.title}</p>
                        </div>

                        <div className="w80p font-14">
                          {el.contents?.map((aContent: string, index: number) => (
                            <div
                              className="mt-8"
                              key={index}
                              dangerouslySetInnerHTML={{
                                __html: handleChangeTextarea(aContent),
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <div className="list-header-content f-direction-column">
                  <div className="flex justify-sb align-c w100p">
                    <p className="font-bold font-14">취소/교환/반품 안내</p>

                    <button onClick={() => setCancellationPopup(true)} className="btn-add">
                      수정
                    </button>
                  </div>

                  <div className={`${cancellationTerms?.length !== 0 && ""} font-400 font-gray`}>
                    {cancellationTerms?.map((el: any, i: number) => (
                      <div key={i} className="flex mt-12">
                        <div className="w20p">
                          <p>{el.title}</p>
                        </div>

                        <div className="w80p font-14">
                          {el.contents?.map((aContent: string, index: number) => (
                            <div
                              // className="mt-8"
                              key={index}
                              dangerouslySetInnerHTML={{
                                __html: handleChangeTextarea(aContent),
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="field-list-wrapper mt-2">
            <div className="product-field mr-20">
              <p>연관 추천상품</p>
            </div>

            <div className="mt-16 mb-16 flex1">
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
                      value={selectedSubCategory}
                      onChange={(e: any) => setSelectedSubCategory(e)}
                      options={subCategories}
                      noOptionsMessage={"카테고리가 없습니다."}
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

              {relatedProducts.type === "planned" && relatedProducts?.products?.length !== 0 && (
                <div className="mt-4">
                  {relatedProducts?.products?.map((productItem: any, i: number) => (
                    <div key={i} className="flex justify-sb align-c border-bottom-gray pt-10 pb-10">
                      <div className="flex align-c">
                        <img src={productItem.thumbnail} className="list-img mr-10" />
                        <p>{productItem.productNameK}</p>
                      </div>

                      <ButtonR
                        onClick={() => handleDeleteRelatedProducts(productItem, i)}
                        color={"white"}
                        name="삭제"
                      />
                    </div>
                  ))}
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

        <div className="flex justify-fe align-c mt-34">
          {/* <button className="btn-add pl-30 pr-30">삭제</button> */}
          <div className="flex">
            <button
              onClick={() => navigate("/product/productmanage")}
              className="btn-add mr-4 pl-30 pr-30"
            >
              취소
            </button>
            <button onClick={handleAddProduct} className="btn-add-b pl-30 pr-30">
              {loading ? "상품 등록중" : "저장"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
