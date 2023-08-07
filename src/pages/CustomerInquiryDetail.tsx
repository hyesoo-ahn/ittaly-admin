import React, { useEffect, useLayoutEffect, useState } from "react";
import ButtonR from "../components/ButtonR";
import { useNavigate, useParams } from "react-router-dom";
import { getAdminLookup, getDatas } from "../common/apis";
import { timeFormat1 } from "../common/utils";

export const CustomerInquiryDetail = () => {
  const navigate = useNavigate();
  const params = useParams();
  const { inquiryId } = params;
  const [detail, setDetail] = useState<any>([]);

  useLayoutEffect(() => {
    init();
  }, []);

  const init = async () => {
    const { data }: any = await getAdminLookup({
      collection: "productQna",
      find: { _id: inquiryId },
      lookupFrom: "users",
      addField: "userId",
      as: "userInfo",
    });

    console.log(data);
    setDetail(data);
  };

  return (
    <>
      <p className="page-title">1:1문의 관리</p>

      <div>
        <p className="font-category mt-30">문의 내용</p>
      </div>
      <div className="flex mt-13">
        <div className="flex1">
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
              <p>이메일</p>
            </div>

            <p>{detail[0]?.userInfo[0]?.email}</p>
          </div>

          <div className="product-field-wrapper mt-2">
            <div className="product-field mr-20">
              <p>카테고리</p>
            </div>

            <p>{detail[0]?.category}</p>
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
              <p>휴대폰</p>
            </div>

            <p>{detail[0]?.userInfo[0]?.phone}</p>
          </div>

          <div className="product-field-wrapper mt-2">
            <div className="product-field mr-20">
              <p>주문번호</p>
            </div>

            <p>1234567890</p>
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
      <div className="field-list-wrapper mt-2">
        <div className="product-field mr-20">
          <p>첨부이미지</p>
        </div>

        <div className="flex1 pt-10 pb-10 flex">
          {detail[0]?.imgUrls.map((img: string, i: number) => (
            <img key={i} src={img} style={{ width: 80, height: "auto" }} />
          ))}
          {/* <div style={{ width: 50, height: 50, border: "1px solid gray" }} className="mr-4"></div> */}
          {/* <div style={{ width: 50, height: 50, border: "1px solid gray" }} className="mr-4"></div> */}
          {/* <div style={{ width: 50, height: 50, border: "1px solid gray" }} className="mr-4"></div> */}
        </div>
      </div>

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
          <div className="product-field-wrapper mt-2">
            <div className="product-field mr-20">
              <p>작성일자</p>
            </div>

            <p>2023.01.01 10:00:00</p>
          </div>
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

      <div className="flex justify-fe">
        <ButtonR name={"취소"} color={"white"} onClick={() => navigate(-1)} styleClass={"mr-4"} />
        <ButtonR name={"답변송부"} onClick={() => {}} />
      </div>
    </>
  );
};

export default CustomerInquiryDetail;
