import React, { useEffect, useLayoutEffect, useState } from "react";
import ButtonR from "../components/ButtonR";
import { useNavigate, useParams } from "react-router-dom";
import { getAdminLookup, getDatas } from "../common/apis";
import { timeFormat1 } from "../common/utils";

export const ProductInquiryDetail = () => {
  const navigate = useNavigate();
  const params = useParams();
  const { productinquiryId } = params;
  const [detail, setDetail] = useState<any>([]);

  useLayoutEffect(() => {
    init();
  }, []);

  const init = async () => {
    const { data }: any = await getAdminLookup({
      collection: "productQna",
      find: { _id: productinquiryId },
      lookupFrom: "users",
      addField: "userId",
      as: "userInfo",
    });

    console.log(data);
    setDetail(data);
  };

  return (
    <>
      <p className="page-title">상품문의 상세</p>

      <div>
        <p className="font-category mt-30">문의 내용</p>
      </div>
      <div className="flex mt-13">
        <div className="flex1">
          <div className="product-field-wrapper mt-2">
            <div className="product-field mr-20">
              <p>카테고리</p>
            </div>

            <p>{detail[0]?.category}</p>
          </div>
          <div className="product-field-wrapper mt-2">
            <div className="product-field mr-20">
              <p>작성자</p>
            </div>

            <p>
              {detail[0]?.userInfo[0]?.nickname} ({detail[0]?.userInfo[0]?.kakaoId})
            </p>
          </div>

          <div className="product-field-wrapper mt-2">
            <div className="product-field mr-20">
              <p>상품명</p>
            </div>

            <p className="font-blue text-underline">Seletti 하이브리드 푸르트 볼그릇</p>
          </div>

          <div className="product-field-wrapper mt-2">
            <div className="product-field mr-20">
              <p>공개여부</p>
            </div>

            <p>공개</p>
          </div>
        </div>

        <div className="flex1">
          <div className="product-field-wrapper mt-2">
            <div className="product-field mr-20">
              <p>작성일자</p>
            </div>

            <p>{timeFormat1(detail[0]?.created)}</p>
          </div>

          <div className="product-field-wrapper mt-2">
            <div className="product-field mr-20">
              <p>조회수</p>
            </div>

            <p>1,234</p>
          </div>
        </div>
      </div>
      <div className="field-list-wrapper mt-2">
        <div className="product-field mr-20">
          <p>내용</p>
        </div>

        <div className="flex1 pt-10 pb-10">
          <p>{detail[0]?.content}</p>
        </div>
      </div>
      {/* <div className="field-list-wrapper mt-2">
        <div className="product-field mr-20">
          <p>내용</p>
        </div>

        <div className="flex1 pt-10 pb-10">
          <p>{detail[0]?.content}</p>
        </div>
      </div> */}

      {/* 답변 내용 */}
      <div className="flex align-c mt-30">
        <p className="font-category mr-20">답변 내용</p>
        <p className="font-12 font-400">
          * 답변 등록 시, 회원이 등록한 이메일 주소로 답변메일이 송부됩니다.
        </p>
      </div>

      <div className="flex mt-13">
        <div className="flex1">
          <div className="product-field-wrapper mt-2">
            <div className="product-field mr-20">
              <p>작성자</p>
            </div>

            <p>잇태리</p>
          </div>
        </div>

        <div className="flex1">
          {/* <div className="product-field-wrapper mt-2">
            <div className="product-field mr-20">
              <p>작성일자</p>
            </div>

            <p>2023.01.01 10:00:00</p>
          </div> */}
        </div>
      </div>
      <div className="field-list-wrapper mt-2">
        <div className="product-field mr-20">
          <p>내용</p>
        </div>

        <div className="flex1 pt-10 pb-10">
          <textarea onChange={(e) => {}} className="input-textarea" placeholder="답변 내용 입력" />
        </div>
      </div>

      <div className="flex justify-sb mt-10">
        <ButtonR name={"삭제"} color={"white"} onClick={() => navigate(-1)} styleClass={"mr-4"} />
        <div className="flex">
          <ButtonR name={"취소"} color={"white"} onClick={() => navigate(-1)} styleClass={"mr-4"} />
          <ButtonR name={"답변등록"} onClick={() => {}} />
        </div>
      </div>
    </>
  );
};

export default ProductInquiryDetail;
