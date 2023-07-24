import React, { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDatas, postAddBrand, postCollection, postUploadImage } from "../common/apis";
import ButtonR from "../components/ButtonR";
import InputR from "../components/InputR";
import forward from "../images/Forward.png";
import sale from "../images/sale_s.png";
import new_s from "../images/new_s.png";
import Select from "react-select";
import sample from "../images/sample_img.png";
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

const AddPromotion: React.FC = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState<string>("");
  const [desc, setDesc] = useState<string>("");
  const [txtLength, setTxtLength] = useState(0);
  const [file, setFile] = useState<IFile>({
    file: null,
    url: "",
  });
  const fileRef = useRef<any>(null);
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
  }>({
    startingDate: "",
    endingDate: "",
    openingDate: "",
  });

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    if (selectedCategory && relatedProducts.type === "category") {
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

    if (selectedCategory && relatedProducts.type === "brand") {
      selectedProducts();
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
    const find =
      relatedProducts.type === "category"
        ? { categoryId: selectedSubCategory.categoryId, category2: selectedSubCategory.value }
        : { brandId: selectedCategory._id };

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
  const handleFileChange = (evt: any) => {
    const file = evt.target.files?.[0];
    const imgUrl = URL.createObjectURL(file);
    setFile({
      file: file,
      url: imgUrl,
    });
  };

  // 기획전 등록
  const handleAddPromotion = async () => {
    const startingDate = new Date(dates.startingDate);
    const endingDate = new Date(dates.endingDate);
    const openingDate = new Date(dates.openingDate);
    const startingDateStamp = startingDate.getTime();
    const endingDateStamp = endingDate.getTime();
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

    const formData = new FormData();
    formData.append("file", file.file as File);
    const getUrl: any = await postUploadImage(formData);
    if (getUrl.result && getUrl.status === 200) {
      const body = {
        collection: "promotions",
        title,
        intro: desc,
        imgUrl: getUrl.url,
        openStatus,
        term: [startingDateStamp, endingDateStamp],
        relatedProd,
        openingStamp: openingDateStamp,
      };
      const addResult: any = await postCollection(body);
      if (addResult.result && addResult.status === 200) {
        alert("기획전 등록이 완료되었습니다.");
      }
      navigate(-1);
    }
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
          <p className="page-title mt-3">기획전 등록</p>
        </div>

        <p className="font-desc">
          <span className="font-red mr-4">*</span>
          <span>필수입력</span>
        </p>
      </div>

      <div className="product-field-wrapper mt-2 w100p">
        <div className="product-field mr-20">
          <p>
            제목<span className="font-red">*</span>
          </p>
        </div>

        <div className="flex1">
          <InputR
            size="full"
            value={title}
            onChange={(e: any) => setTitle(e.target.value)}
            placeholer={"공백 포함 30글자 이내로 입력해 주세요"}
          />
        </div>
      </div>

      <div className="product-field-wrapper mt-2 w100p">
        <div className="product-field mr-20">
          <p>
            기획전 소개<span className="font-red">*</span>
          </p>
        </div>

        <div className="flex1">
          <InputR
            size="full"
            value={desc}
            onChange={(e: any) => setDesc(e.target.value)}
            placeholer={"공백 포함 40글자 이내로 입력해 주세요"}
          />
        </div>
      </div>

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
                ref={fileRef}
                onChange={(e) => handleFileChange(e)}
                type="file"
              />
              <ButtonR onClick={() => fileRef?.current?.click()} name={`이미지 추가 0/1`} />
            </div>

            <p className="font-desc">이미지 1장, 1080px x 1080px</p>
          </div>

          {file.url && <img src={file.url} style={{ width: 278, height: "auto" }} />}

          {file.url && (
            <div className="flex mt-10 mb-16">
              <ButtonR
                name={`변경`}
                color={"white"}
                onClick={() => {}}
                // onClick={() => handleUploadClick(0)}
                styles={{ marginRight: 4 }}
              />
              <ButtonR name={`삭제`} color={"white"} onClick={() => {}} />
            </div>
          )}
        </div>
      </div>

      <div className="product-field-wrapper mt-2 w100p">
        <div className="product-field mr-20">
          <p>기획전 기간</p>
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

    ㅊ

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

export default AddPromotion;
