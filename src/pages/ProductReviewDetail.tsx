import React, { useEffect, useLayoutEffect, useState } from "react";
import ButtonR from "../components/ButtonR";
import { useNavigate, useParams } from "react-router-dom";
import { getAdminLookup, getDatas, postCollection, putUpdateData } from "../common/apis";
import { timeFormat1, timeFormat2, timeFormat3 } from "../common/utils";

export const ProductReviewDetail = () => {
  const navigate = useNavigate();
  const params = useParams();
  const { reviewId } = params;
  const [detail, setDetail] = useState<any>([]);
  const [content, setContent] = useState<string>("");

  useLayoutEffect(() => {
    init();
  }, []);

  const init = async () => {
    let qna: any = await getAdminLookup({
      collection: "reviews",
      find: { _id: reviewId },
      lookupFrom: "products",
      addField: "targetId",
      as: "productInfo",
    });
    qna = qna.data;

    let user: any = await getAdminLookup({
      collection: "reviews",
      find: { _id: reviewId },
      lookupFrom: "users",
      addField: "userId",
      as: "userInfo",
    });
    user = user.data;
    qna[0].userInfo = user[0].userInfo;
    setDetail(qna);
  };

  const reviewType = () => {
    let reviewType = "";
    if (detail[0]?.files && detail[0]?.files.length !== 0) {
      return (reviewType = "포토");
    }
    if (detail[0]?.content?.length >= 50) {
      return (reviewType = "텍스트 (50자 이상)");
    }
    if (detail[0]?.content?.length < 50) {
      return (reviewType = "텍스트 (50자 미만)");
    }
  };

  const handleAddAnswer = async () => {
    let tempAnswers = detail[0]?.answer ? [...detail[0]?.answer] : [];
    tempAnswers.push({
      content: content,
      created: Date.now(),
    });

    const updateAnswerResult: any = await putUpdateData({
      collection: "reviews",
      _id: reviewId,
      status: "resolved",
      answer: tempAnswers,
    });

    if (updateAnswerResult.status === 200) {
      alert("답변이 등록되었습니다.");
      setContent("");
      init();
    }
  };

  const handleReward = async () => {
    const confirm = window.confirm("적립금을 지급하시겠습니까?");
    if (confirm) {
      const rewardType = reviewType();
      let rewardPrice = 0;

      if (rewardType === "포토") {
        rewardPrice = 200;
      }
      if (rewardType === "텍스트 (50자 이상)") {
        rewardPrice = 100;
      }
      if (rewardType === "텍스트 (50자 미만)") {
        rewardPrice = 50;
      }

      const _body = {
        collection: "userRewards",
        targetCollection: "reviews",
        targetUserId: detail[0]?.userInfo[0]?._id,
        cagegory: "후기적립",
        detail: `${detail[0]?.productInfo[0]?.productNameK}`,
        rewards: rewardPrice,
      };

      const addRewardsResult: any = await postCollection({
        ..._body,
      });

      if (addRewardsResult.status === 200) {
        alert("적립금이 지급되었습니다.");
        const updateAnswerResult: any = await putUpdateData({
          collection: "reviews",
          _id: reviewId,
          rewardStatus: true,
        });

        init();
      }
    } else {
      return;
    }
  };

  const handleDeleteReview = async () => {
    console.log(reviewId);
  };

  return (
    <>
      <p className="page-title">상품후기 상세</p>

      <div>
        <p className="font-category mt-30">후기 내용</p>
      </div>
      <div className="flex mt-13">
        <div className="flex1">
          <div className="product-field-wrapper mt-2">
            <div className="product-field mr-20">
              <p>작성자</p>
            </div>

            <p>
              {detail[0]?.userInfo[0]?.nickname} ({detail[0]?.userInfo[0]?.email})
              {/* ({detail[0]?.userInfo[0]?.kakaoId}) */}
            </p>
          </div>

          <div className="product-field-wrapper mt-2">
            <div className="product-field mr-20">
              <p>상품명</p>
            </div>

            <a target="blank" href={`/product/productmanage/${detail[0]?.productInfo[0]?._id}`}>
              <p className="font-blue text-underline cursor">
                {detail[0]?.productInfo[0]?.productNameK}
              </p>
            </a>
          </div>

          <div className="product-field-wrapper mt-2">
            <div className="product-field mr-20">
              <p>공개여부</p>
            </div>

            <p>공개</p>
          </div>

          <div className="product-field-wrapper mt-2">
            <div className="product-field mr-20">
              <p>별점</p>
            </div>

            {detail[0]?.rate === 1 && <p>★☆☆☆ 매우 아쉬워요</p>}
            {detail[0]?.rate === 2 && <p>★★☆☆ 아쉬워요</p>}
            {detail[0]?.rate === 3 && <p>★★★☆ 만족해요</p>}
            {detail[0]?.rate === 4 && <p>★★★★ 매우 만족해요</p>}
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
              <p>유형</p>
            </div>

            <div className="flex align-c">
              <p className="mr-20">{reviewType()}</p>

              {!detail[0]?.rewardStatus && (
                <ButtonR name={"적립금 지급"} color="white" onClick={handleReward} />
              )}
            </div>
          </div>

          <div className="product-field-wrapper mt-2">
            <div className="product-field mr-20">
              <p>조회수</p>
            </div>

            <p>1,234</p>
          </div>

          <div className="product-field-wrapper mt-2">
            <div className="product-field mr-20">
              <p>적립금 지급 여부</p>
            </div>

            <p>{detail[0]?.rewardStatus ? "Y" : "N"}</p>
          </div>
        </div>
      </div>
      <div className="field-list-wrapper mt-2">
        <div className="product-field mr-20">
          <p>내용</p>
        </div>

        <div className="flex1 pt-10 pb-10">
          <p>
            {detail[0]?.content?.split("\n").map((line: any) => {
              return (
                <span>
                  {line}
                  <br />
                </span>
              );
            })}
          </p>
          <p className="mt-20 font-red font-12">{detail[0]?.content.length}자</p>
        </div>
      </div>

      <div className="field-list-wrapper mt-2">
        <div className="product-field mr-20">
          <p>첨부이미지</p>
        </div>

        <div className="flex1 pt-10 pb-10 flex">
          {detail[0]?.files &&
            detail[0]?.files?.map((url: string, i: number) => (
              <img
                key={i}
                src={url}
                className={`${i !== detail[0]?.files.length - 1 ? "mr-10" : ""}`}
                style={{ width: 100, height: "auto" }}
              />
            ))}
        </div>
      </div>

      <div className="flex justify-fe mt-10">
        {/* <ButtonR name={"삭제"} color={"white"} onClick={() => navigate(-1)} styleClass={"mr-4"} /> */}
        <div className="flex">
          <ButtonR
            name={"리뷰 삭제"}
            color={"white"}
            onClick={handleDeleteReview}
            styleClass={"mr-4"}
          />
        </div>
      </div>

      {/* 답변 내용 */}

      {detail[0]?.answer && detail[0]?.answer.length !== 0 && (
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
                {item.content?.split("\n").map((line: any) => {
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
        <div className="product-field-wrapper mt-10">
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

      <div className="flex justify-fe mt-10">
        {/* <ButtonR name={"삭제"} color={"white"} onClick={() => navigate(-1)} styleClass={"mr-4"} /> */}
        <div className="flex">
          <ButtonR name={"취소"} color={"white"} onClick={() => navigate(-1)} styleClass={"mr-4"} />
          <ButtonR
            name={`${
              detail[0]?.answer && detail[0]?.answer?.length !== 0 ? "추가답변" : "답변등록"
            }`}
            onClick={handleAddAnswer}
          />
        </div>
      </div>
    </>
  );
};

export default ProductReviewDetail;
