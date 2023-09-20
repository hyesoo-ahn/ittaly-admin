import React, { useEffect, useLayoutEffect, useState } from "react";
import ButtonR from "../components/ButtonR";
import { useNavigate, useParams } from "react-router-dom";
import { getAdminLookup, getDatas, putUpdateData } from "../common/apis";
import { timeFormat1, timeFormat2, timeFormat3 } from "../common/utils";

export const RestockRequestDetail = () => {
  const navigate = useNavigate();

  const { restockrequestid } = useParams();
  const [detail, setDetail] = useState<any>([]);
  const [content, setContent] = useState<string>("");

  useLayoutEffect(() => {
    init();
  }, []);

  const init = async () => {
    console.log(restockrequestid);
    // let qna: any = await getAdminLookup({
    //   collection: "productQna",
    //   find: { _id: productinquiryId },
    //   lookupFrom: "products",
    //   addField: "targetId",
    //   as: "productInfo",
    // });
    // qna = qna.data;
    // let user: any = await getAdminLookup({
    //   collection: "productQna",
    //   find: { _id: productinquiryId },
    //   lookupFrom: "users",
    //   addField: "userId",
    //   as: "userInfo",
    // });
    // user = user.data;
    // qna[0].userInfo = user[0].userInfo;
    // setDetail(qna);
  };

  return (
    <>
      <p className="page-title">입고요청 상세</p>

      <div className="mt-13">
        {/* 1 row */}
        <div className="flex w100p flex-wrap">
          <div className="flex2-item">
            <div className="product-field-wrapper mt-2">
              <div className="product-field mr-20">
                <p>작성자</p>
              </div>

              <p>se29dsk</p>
            </div>
          </div>
          <div className="flex2-item">
            <div className="product-field-wrapper mt-2">
              <div className="product-field mr-20">
                <p>작성일자</p>
              </div>

              <p>2023.01.01 10:00:00</p>
            </div>
          </div>
        </div>
        {/* 1row end */}

        <div className="flex2-item flex-wrap">
          <div className="product-field-wrapper mt-2">
            <div className="product-field mr-20">
              <p>카테고리</p>
            </div>

            <p>패션잡화</p>
          </div>
        </div>

        <div className="flex w100p flex-wrap">
          <div className="flex2-item">
            <div className="product-field-wrapper mt-2">
              <div className="product-field mr-20">
                <p>브랜드명</p>
              </div>

              <p>Valentino Garavani</p>
            </div>
          </div>
          <div className="flex2-item">
            <div className="field-list-wrapper mt-2">
              <div className="product-field mr-20">
                <p>상품명</p>
              </div>

              <div className="flex1 pt-10 pb-10">
                <p>Valentino Garavani Rockstud Tote Bag</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex w100p flex-wrap">
          <div className="flex2-item">
            <div className="field-list-wrapper mt-2">
              <div className="product-field mr-20">
                <p>URL</p>
              </div>

              <div className="flex1 pt-10 pb-10">
                <p className="text-underline">
                  https://www.italist.com/kr/women/bags/totes/valentino-garavani-rockstud-tote-bag/13185903/13353595/valentino-garavani
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex w100p flex-wrap">
          <div className="flex2-item">
            <div className="field-list-wrapper mt-2">
              <div className="product-field mr-20">
                <p>내용</p>
              </div>

              <div className="flex1 pt-10 pb-10">
                <p>
                  여행가서 본건데 너무 예쁘더라구요! 꼭 입고되었으면 좋겠어요 여행가서 본건데 너무
                  예쁘더라구요! 꼭 입고되었으면 좋겠어요 여행가서 본건데 너무 예쁘더라구요! 꼭
                  입고되었으면 좋겠어요 여행가서 본건데 너무 예쁘더라구요! 꼭 입고되었으면 좋겠어요
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex w100p flex-wrap">
          <div className="flex2-item">
            <div className="field-list-wrapper mt-2">
              <div className="product-field mr-20">
                <p>첨부이미지</p>
              </div>

              <div className="flex1 pt-10 pb-10">
                <div className="flex">
                  <div
                    className="mr-8"
                    style={{ border: "1px solid #ececec", width: 80, height: 80 }}
                  ></div>
                  <div
                    className="mr-8"
                    style={{ border: "1px solid #ececec", width: 80, height: 80 }}
                  ></div>
                  <div
                    className="mr-8"
                    style={{ border: "1px solid #ececec", width: 80, height: 80 }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-sb mt-10">
          <ButtonR name={"삭제"} onClick={() => {}} color={"white"} />
          <ButtonR name={"취소"} onClick={() => {}} color={"white"} />
        </div>
      </div>
    </>
  );
};

export default RestockRequestDetail;
