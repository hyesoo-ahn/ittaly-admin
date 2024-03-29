import React, { useEffect, useLayoutEffect, useState } from "react";
import ButtonR from "../components/ButtonR";
import { useNavigate, useParams } from "react-router-dom";
import { getAdminLookup, getDatas, putUpdateData } from "../common/apis";
import { timeFormat1 } from "../common/utils";

export const CustomerInquiryDetail = () => {
  const navigate = useNavigate();
  const params = useParams();
  const { inquiryId } = params;
  const [detail, setDetail] = useState<any>([]);
  const [content, setContent] = useState<string>("");

  useLayoutEffect(() => {
    init();
  }, []);

  const init = async () => {
    const { data }: any = await getAdminLookup({
      collection: "customerQna",
      find: { _id: inquiryId },
      lookupFrom: "users",
      addField: "userId",
      as: "userInfo",
    });

    setDetail(data);
  };

  const handleAddAnswer = async () => {
    let tempAnswers = detail[0]?.answer ? [...detail[0]?.answer] : [];
    tempAnswers.push({
      content: content,
      created: Date.now(),
    });

    const updateAnswerResult: any = await putUpdateData({
      collection: "customerQna",
      _id: inquiryId,
      status: "resolved",
      answer: tempAnswers,
    });

    if (updateAnswerResult.status === 200) {
      alert("답변이 등록되었습니다.");
      setContent("");
      init();
    }
  };

  return (
    <>
      <p className="page-title">1:1 문의 관리</p>

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
          {detail[0]?.imgUrls?.map((img: string, i: number) => (
            <img key={i} src={img} style={{ width: 80, height: "auto" }} />
          ))}
        </div>
      </div>

      {/* 답변 내용 */}
      {detail[0]?.answer && detail[0]?.answer?.length !== 0 && (
        <div className="flex align-c mt-30">
          <p className="font-category mr-20">답변 내용</p>
        </div>
      )}

      {detail[0]?.answer?.map((item: any, i: number) => (
        <div key={i}>
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

                <p>{timeFormat1(item.created)}</p>
              </div>
            </div>
          </div>

          <div className="field-list-wrapper mt-2">
            <div className="product-field mr-20">
              <p>내용</p>
            </div>

            <div className="flex1 pt-10 pb-10">
              <p>
                {item?.content?.split("\n").map((line: any) => {
                  return (
                    <span>
                      {line}
                      <br />
                    </span>
                  );
                })}
              </p>
            </div>
          </div>
        </div>
      ))}

      <div className="flex align-c mt-30">
        <p className="font-category mr-20">
          {detail[0]?.answer && detail[0]?.answer?.length !== 0 ? "추가 답변" : "답변 내용"}
        </p>
        <p className="font-12 font-400">
          * 답변 등록 시, 회원이 등록한 이메일 주소로 답변메일이 송부됩니다.
        </p>
      </div>
      <div className="flex1">
        <div className="product-field-wrapper mt-13">
          <div className="product-field mr-20">
            <p>작성자</p>
          </div>

          <p>잇태리</p>
        </div>
      </div>
      <div className="field-list-wrapper mt-2">
        <div className="product-field mr-20">
          <p>내용</p>
        </div>

        <div className="flex1 pt-10 pb-10">
          <textarea
            onChange={(e) => setContent(e.target.value)}
            value={content}
            className="input-textarea"
            placeholder="답변 내용 입력"
          />
        </div>
      </div>

      <div className="flex justify-fe">
        <ButtonR name={"취소"} color={"white"} onClick={() => navigate(-1)} styleClass={"mr-4"} />
        <ButtonR
          name={`${detail[0]?.answer && detail[0]?.answer?.length !== 0 ? "추가답변" : "답변등록"}`}
          onClick={handleAddAnswer}
        />
      </div>
    </>
  );
};

export default CustomerInquiryDetail;
