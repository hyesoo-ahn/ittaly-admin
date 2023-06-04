import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ButtonR from "../components/ButtonR";
import InputR from "../components/InputR";
import forward from "../images/Forward.png";

const AddCategory = () => {
  const navigate = useNavigate();
  const [brandName, setBrandName] = useState<string>("");
  return (
    <div>
      <div className="flex align-c pb-30">
        <img onClick={() => navigate(-1)} className="img-close cursor mr-4" src={forward} />
        <p className="page-title mt-3">카테고리 등록</p>
      </div>

      <p className="font-catetory">카테고리 정보</p>

      <div className="product-field-wrapper mt-13 w100p">
        <div className="product-field mr-20">
          <p>
            카테고리명<span className="font-red">*</span>
          </p>
        </div>

        <div className="flex1">
          <InputR
            size="full"
            value={brandName}
            onChange={(e: any) => setBrandName(e.target.value)}
            // placeholer={"영문입력"}
          />
        </div>
      </div>

      <div className="product-field-wrapper mt-2 w100p">
        <div className="product-field mr-20">
          <p>
            URL<span className="font-red">*</span>
          </p>
        </div>

        <div className="flex1">
          <InputR
            size="full"
            value={brandName}
            onChange={(e: any) => setBrandName(e.target.value)}
            // placeholer={"영문입력"}
          />
        </div>
      </div>

      {/* <div className="field-list-wrapper mt-2">
        <div className="product-field mr-20">
          <p>
            브랜드 소개<span className="font-red">*</span>
          </p>
        </div>

        <div className="mt-16 mb-16 flex1" style={{ position: "relative" }}>
          <textarea className="input-textarea" placeholder="공백포함 60자 이내" />
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
            0/80
          </div>
        </div>
      </div> */}

      <div className="product-field-wrapper mt-2 w100p">
        <div className="product-field mr-20">
          <p>공개여부</p>
        </div>

        <div className="checkbox-c mr-4 cursor">
          <div className="checkbox-c-filled"></div>
        </div>

        <p className="mr-30">공개</p>

        <div className="checkbox-c mr-4 cursor">{/* <div className="checkbox-c-filled" /> */}</div>

        <p className="mr-35">비공개</p>
      </div>

      <div className="flex justify-fe mt-10">
        <ButtonR name={"취소"} onClick={() => {}} styleClass={"mr-4"} color={"white"} />
        <ButtonR name={"저장"} onClick={() => {}} />
      </div>
    </div>
  );
};

export default AddCategory;
