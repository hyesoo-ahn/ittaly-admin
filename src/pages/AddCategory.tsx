import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ButtonR from "../components/ButtonR";
import InputR from "../components/InputR";
import forward from "../images/Forward.png";
import up_g from "../images/up_g.png";
import down_g from "../images/down_g.png";

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

      <div className="mt-30">
        <p className="font-catetory">하위분류</p>

        <div className="product-field-wrapper w100p">
          <div className="product-field mr-20 mt-13">
            <p>하위분류 여부</p>
          </div>

          <div className="checkbox-c mr-4 cursor">
            <div className="checkbox-c-filled"></div>
          </div>

          <p className="mr-30">없음</p>

          <div className="checkbox-c mr-4 cursor">
            {/* <div className="checkbox-c-filled" /> */}
          </div>

          <p className="mr-35">있음</p>
        </div>
      </div>

      <div className="mt-2 field-list-wrapper">
        <div className="product-field mr-20">
          <p>하위분류 입력</p>
        </div>

        <div style={{ flex: 1 }}>
          <div className="list-header">
            <div className="text-center w20p">순서</div>
            <div className="text-center w20p">옵션명</div>
            <div className="text-center w20p">URL</div>
            <div className="text-center w20p">공개여부</div>
            <div className="text-center w20p">삭제/추가</div>
          </div>

          <div className="list-header-content">
            <div className="text-center w20p">
              <img src={up_g} style={{ width: 28, height: "auto" }} className="mr-4 cursor" />
              <img src={down_g} style={{ width: 28, height: "auto" }} className="cursor" />
            </div>
            <div className="text-center w20p">
              <div className="mr-4 ml-4">
                <InputR size={"full"} />
              </div>
            </div>

            <div className="text-center w20p">
              <div className="mr-4 ml-4">
                <InputR size={"full"} />
              </div>
            </div>

            <div className="text-center w20p flex align-c justify-c">
              <div className="checkbox-c mr-4 cursor">
                <div className="checkbox-c-filled"></div>
              </div>

              <p className="mr-30">없음</p>

              <div className="checkbox-c mr-4 cursor">
                {/* <div className="checkbox-c-filled" /> */}
              </div>

              <p className="mr-35">있음</p>
            </div>

            <div className="text-center w20p">
              <ButtonR onClick={() => {}} name={"추가"} />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-fe mt-10">
        <ButtonR name={"취소"} onClick={() => {}} styleClass={"mr-4"} color={"white"} />
        <ButtonR name={"저장"} onClick={() => {}} />
      </div>
    </div>
  );
};

export default AddCategory;
