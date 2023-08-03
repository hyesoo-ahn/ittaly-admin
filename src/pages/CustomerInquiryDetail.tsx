import React from "react";
import ButtonR from "../components/ButtonR";

export const CustomerInquiryDetail = () => {
  return (
    <>
      <p className="page-title">추천인 관리</p>

      <div>
        <p className="font-category mt-30">문의 내용</p>
      </div>
      <div className="flex mt-13">
        <div className="flex1">
          <div className="product-field-wrapper mt-2">
            <div className="product-field mr-20">
              <p>작성자</p>
            </div>

            <p>행복한 물개(ews24s)</p>
          </div>

          <div className="product-field-wrapper mt-2">
            <div className="product-field mr-20">
              <p>이메일</p>
            </div>

            <p>abcdefg@abc.com</p>
          </div>

          <div className="product-field-wrapper mt-2">
            <div className="product-field mr-20">
              <p>카테고리</p>
            </div>

            <p>주문/교환/반품 문의</p>
          </div>
        </div>

        <div className="flex1">
          <div className="product-field-wrapper mt-2">
            <div className="product-field mr-20">
              <p>작성일자</p>
            </div>

            <p>2023.01.01 10:00:00</p>
          </div>

          <div className="product-field-wrapper mt-2">
            <div className="product-field mr-20">
              <p>휴대폰</p>
            </div>

            <p>010-1234-5678</p>
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
          <p>
            안녕하세요~ 저 교환 신청 했었는데요..^^ 답변에 교환신청 해주신다고 했는데 배송에는 S
            사이즈로 해서 배송이 시작된거 같아서요.. S가 오는건지..M이 오는건지 알수 있을까요?  
            번거롭게 해드려 정말 죄송합니다 ㅠㅠ 안녕하세요~ 저 교환 신청 했었는데요..^^ 답변에
            교환신청 해주신다고 했는데 배송에는 S 사이즈로 해서 배송이 시작된거 같아서요.. S가
            오는건지..M이 오는건지 알수 있을까요?   번거롭게 해드려 정말 죄송합니다 ㅠㅠ 
            안녕하세요~ 저 교환 신청 했었는데요..^^ 답변에 교환신청 해주신다고 했는데 배송에는 S
            사이즈로 해서 배송이 시작된거 같아서요.. S가 오는건지..M이 오는건지 알수 있을까요?  
            번거롭게 해드려 정말 죄송합니다 ㅠㅠ 
          </p>
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
        <ButtonR name={"취소"} color={"white"} onClick={() => {}} styleClass={"mr-4"} />
        <ButtonR name={"답변송부"} onClick={() => {}} />
      </div>
    </>
  );
};

export default CustomerInquiryDetail;
