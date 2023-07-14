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

interface IFile {
  file: File | null;
  url: string;
}

const Cateogyoptions1 = [
  { value: "대분류 카테고리1", label: "대분류 카테고리1" },
  { value: "대분류 카테고리2", label: "대분류 카테고리2" },
  { value: "대분류 카테고리3", label: "대분류 카테고리3" },
];

const Deposit: React.FC = () => {
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

  return (
    <div>
      <div className="flex align-c justify-sb pb-30">
        <div className="flex alicn-c">
          <img onClick={() => navigate(-1)} className="img-close cursor mr-4" src={forward} />
          <p className="page-title mt-3">적립금 관리</p>
        </div>

        <p className="font-desc">
          <span className="font-red mr-4">*</span>
          <span>필수입력</span>
        </p>
      </div>

      <p className="font-category">기본 설정</p>
      <div className="product-field-wrapper mt-13 w100p">
        <div className="product-field mr-20">
          <p>
            적립금 지급 시점<span className="font-red">*</span>
          </p>
        </div>

        <p className="font-bold mr-20">배송완료 후</p>
        <div onClick={() => setEventType("normal")} className="checkbox-c mr-4 cursor">
          {eventType === "normal" && <div className="checkbox-c-filled"></div>}
        </div>

        <p onClick={() => setEventType("normal")} className="mr-30 cursor">
          익일
        </p>

        <div onClick={() => setEventType("luckydraw")} className="checkbox-c mr-4 cursor">
          {eventType === "luckydraw" && <div className="checkbox-c-filled" />}
        </div>

        <p onClick={() => setEventType("luckydraw")} className="mr-30 cursor">
          3일
        </p>

        <div onClick={() => setEventType("luckydraw")} className="checkbox-c mr-4 cursor">
          {eventType === "luckydraw" && <div className="checkbox-c-filled" />}
        </div>

        <p onClick={() => setEventType("luckydraw")} className="mr-30 cursor">
          7일
        </p>
      </div>

      <div className="field-list-wrapper mt-2 w100p">
        <div className="product-field mr-20">
          <p>
            사용조건<span className="font-red">*</span>
          </p>
        </div>

        <div style={{ flex: 1 }} className="mt-16 mb-16">
          <div className="flex">
            <p>
              <span className="font-bold mr-8">유효기간</span>
              <span className="font-12">*유효기간이 없으면 공란</span>
            </p>
          </div>

          <div className="mt-10 flex align-c">
            <p className="mr-8">지급 후</p>
            <InputR size="small" />
            <p className="mr-4">일 후 자동소멸</p>
          </div>
        </div>
      </div>

      <p className="font-category mt-40">개별 지급</p>
      <ButtonR name={"개별 지급하러 가기"} styleClass="mt-13" color="white" onClick={() => {}} />

      <p className="font-category mt-40">자동 지급</p>

      <div className="mt-13 field-list-wrapper">
        <div className="product-field mr-20">
          <p>추천인 코드 입력했을 때 지급</p>
        </div>

        <div className="flex1 pt-15 pb-15">
          <div className="flex align-c">
            <div onClick={() => setEventType("normal")} className="checkbox-c mr-4 cursor">
              {eventType === "normal" && <div className="checkbox-c-filled"></div>}
            </div>

            <p onClick={() => setEventType("normal")} className="mr-30 cursor">
              사용
            </p>

            <div onClick={() => setEventType("luckydraw")} className="checkbox-c mr-4 cursor">
              {eventType === "luckydraw" && <div className="checkbox-c-filled" />}
            </div>

            <p onClick={() => setEventType("luckydraw")} className="mr-30 cursor">
              사용안함
            </p>
          </div>

          <div className="mt-20 flex align-c">
            <div className="flex1">
              <p className="font-bold">피추천인(신규 고객)</p>
              <div className="flex align-c mt-6">
                <InputR />
                <p>원</p>
              </div>
            </div>
            <div className="flex1">
              <p className="font-bold">추천인(기존 고객)</p>
              <div className="flex align-c mt-6">
                <InputR />
                <p>원</p>
              </div>
            </div>
          </div>

          <div className="mt-20">
            <p className="font-bold">이벤트 기간</p>

            <div className="flex1 flex align-c mt-10">
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
              * 공개기간을 지정하지 않을 경우 이벤트 기간이 무기한으로 설정됩니다.
            </p>
          </div>

          <div style={{ flex: 1 }} className="mt-30">
            <div className="flex">
              <p>
                <span className="font-bold mr-8">유효기간</span>
                <span className="font-12">*유효기간이 없으면 공란</span>
              </p>
            </div>

            <div className="mt-10 flex align-c">
              <p className="mr-8">지급 후</p>
              <InputR size="small" />
              <p className="mr-4">일 후 자동소멸</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-fe mt-10">
        <div className="flex">
          <ButtonR name={"취소"} onClick={() => navigate(-1)} styleClass={"mr-4"} color={"white"} />
          <ButtonR name={"저장"} onClick={handleAddPromotion} />
        </div>
      </div>
    </div>
  );
};

export default Deposit;
