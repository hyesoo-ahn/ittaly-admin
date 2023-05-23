import React, { useEffect, useState } from "react";
import InputR from "../components/InputR";
import ButtonR from "../components/ButtonR";
import Select from "react-select";

const options = [
  { value: "chocolate", label: "Chocolate" },
  { value: "strawberry", label: "Strawberry" },
  { value: "vanilla", label: "Vanilla" },
];

export default function AddProduct(): JSX.Element {
  const [form, setForm] = useState<any>({});
  const [selectedOption, setSelectedOption] = useState(null);

  const onChangeForm = (type: string, value: string) => {
    setForm((prev: any) => {
      return {
        ...prev,
        [type]: value,
      };
    });
  };

  useEffect(() => {
    console.log(form);
  }, [form]);

  return (
    <div>
      <div className="flex justify-sb align-c pb-30">
        <p className="page-title">상품등록/상세</p>
        <p className="font-12">
          <span className="font-red mr-4">*</span>
          <span>필수입력</span>
        </p>
      </div>

      {/* 카테고리/기본정보 */}
      <div>
        <div>
          <p className="font-catetory">카테고리/기본정보</p>
        </div>

        <div className="product-field-wrapper mt-13">
          <div className="product-field mr-20">
            <p>
              카테고리<span className="font-red">*</span>
            </p>
          </div>

          <Select
            classNamePrefix="react-select"
            placeholder={"대분류"}
            defaultValue={selectedOption}
            onChange={(e: any) => setSelectedOption(e.value)}
            options={options}
            className="react-select-container"
          />
          <Select
            classNamePrefix="react-select"
            placeholder={"하위분류"}
            defaultValue={selectedOption}
            onChange={(e: any) => setSelectedOption(e.value)}
            options={options}
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
            defaultValue={selectedOption}
            onChange={(e: any) => setSelectedOption(e.value)}
            options={options}
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
            value={form.productCode}
            onChange={(e: any) => onChangeForm("desc", e.target.value)}
            placeholer={"예시) 레드 / 블루 / 화이트 / 블랙"}
          />

          <p className="font-12">
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
            value={form.productCode}
            onChange={(e: any) => onChangeForm("keywords", e.target.value)}
            placeholer={"예시) 키워드1, 키워드2, 키워드3"}
          />

          <p className="font-12">*키워드는 쉼표로 구분해서 입력해주세요.</p>
        </div>

        <div className="product-field-wrapper mt-2">
          <div className="product-field mr-20">
            <p>설정</p>
          </div>
          <input name="coupon" id="check1" type="checkbox" className="mr-4 cursor" />
          <label htmlFor="check1" className="font-12 mr-18 cursor">
            쿠폰적용불가
          </label>

          <input type="checkbox" id="check2" className="mr-4 cursor" />
          <label htmlFor="check2" className="font-12 mr-18 cursor">
            Boss Pick!
          </label>

          <input type="checkbox" id="check3" className="mr-4 cursor" />
          <label htmlFor="check3" className="font-12 mr-18 cursor">
            Best
          </label>
          <input type="checkbox" id="check4" className="mr-4 cursor" />
          <label htmlFor="check4" className="font-12 mr-18 cursor">
            100원 럭키드로우
          </label>
          <p className="font-12">*100원 럭키드로우 설정 시 카테고리는 이벤트로 적용해주세요.</p>
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

          <input id="check5" type="checkbox" className="mr-4 cursor" />
          <label htmlFor="check5" className="font-12 mr-18 cursor">
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
            value={form.productCode}
            onChange={(e: any) => onChangeForm("productCode", e.target.value)}
            placeholer={"상품코드 입력"}
          />
          <p className="font-12">원</p>
        </div>

        <div className="product-field-wrapper mt-2">
          <div className="product-field mr-20">
            <p>
              할인가<span className="font-red">*</span>
            </p>
          </div>

          <InputR
            value={form.productCode}
            onChange={(e: any) => onChangeForm("productCode", e.target.value)}
            placeholer={"상품코드 입력"}
          />
          <p className="font-12 mr-30">원</p>

          <div className="product-field mr-20">
            <p>할인율</p>
          </div>

          <p className="font-12">0%</p>
        </div>

        <div className="product-field-wrapper mt-2">
          <div className="product-field mr-20">
            <p>적립금 설정</p>
          </div>

          <p className="font-12">기본 적립율 0.5%</p>
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

          <div className="checkbox-c mr-4">
            <div className="checkbox-c-filled"></div>
          </div>

          <p className="font-12 mr-20">옵션없음(단품)</p>

          <div className="checkbox-c mr-4">{/* <div className="checkbox-c-filled"></div> */}</div>
          <p className="font-12">옵션있음</p>
        </div>
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

          <div className="checkbox-c mr-4">
            <div className="checkbox-c-filled"></div>
          </div>

          <p className="font-12 mr-20">무료배송</p>

          <div className="checkbox-c mr-4">{/* <div className="checkbox-c-filled"></div> */}</div>
          <p className="font-12">유료배송</p>

          <InputR
            size={"small"}
            styleClass="ml-10 mr-10"
            value={form.productCode}
            onChange={(e: any) => onChangeForm("productCode", e.target.value)}
          />
          <p className="font-12">원</p>
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
          <p className="font-12">원</p>
        </div>
      </div>

      {/* 이미지 등록 */}
      <div className="mt-30">
        <div>
          <p className="font-catetory">이미지 등록</p>
        </div>

        <div className="product-field-wrapper mt-13">
          <div className="product-field mr-20">
            <p>
              대표이미지
              <br />
              (썸네일)
              <span className="font-red">*</span>
            </p>
          </div>

          <div className="mr-12">
            <ButtonR name={"이미지 추가 0/1"} onClick={() => {}} />
          </div>
          <p className="font-12">이미지 1장, 1080px x 1080px</p>
        </div>

        <div className="mt-2" style={{ display: "flex" }}>
          <div className="product-field mr-20">
            <p>추가 이미지</p>
          </div>

          <div className="product-field-wrapper2">
            <p className="font-12">※ 상품 상세화면의 상단 이미지에 대표이미지와 함께 노출됩니다.</p>
            <div className="mr-12 mt-6 mb-6">
              <ButtonR name={"이미지 추가 0/4"} onClick={() => {}} />
            </div>

            <p className="font-12">이미지 1장, 1080px x 1080px</p>
          </div>
        </div>
      </div>

      {/* 상품 설명 */}
    </div>
  );
}
