import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDatas } from "../common/apis";
import { IBrandData } from "../common/interfacs";
import { deleteItem, timeFormat1 } from "../common/utils";
import ButtonR from "../components/ButtonR";

const MainBrand = () => {
  const navigate = useNavigate();
  const [promotions, setPromotions] = useState<any[]>();

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    const promotionData: any = await getDatas({
      collection: "promotions",
    });

    setPromotions(promotionData.data);
  };

  return (
    <div>
      <div className="flex justify-sb align-c">
        <p className="page-title">첫 화면 관리 {">"} 브랜드</p>
      </div>

      <div className="mt-34 flex justify-sb align-c">
        <p>총 {promotions?.length}건</p>
        <ButtonR
          onClick={() => {
            navigate("/main/brand/addbrand");
          }}
          name="브랜드 등록"
        />
      </div>

      <div className="list-header mt-10 pl-18 pr-18">
        <div className="w10p">
          <input type="checkbox" />
        </div>

        <div className="w50p">
          <p>제목</p>
        </div>

        <div className="w10p text-center">
          <p>공개여부</p>
        </div>

        <div className="w15p text-center">
          <p>공개시작일</p>
        </div>

        <div className="text-center w15p">
          <p>기능</p>
        </div>
      </div>

      {promotions?.map((promotionItem, i) => (
        <div key={i} className="list-content pl-18 pr-18">
          <div className="flex align-c mt-8 mb-8">
            <div className="w10p">
              <input type="checkbox" />
            </div>

            <div className="w50p">
              <p>{promotionItem.title}</p>
            </div>

            <div className="w10p text-center">
              <p>{promotionItem.openStatus ? "공개" : "비공개"}</p>
            </div>
            <div className="w15p text-center">
              <p>{timeFormat1(promotionItem.openingStamp)}</p>
            </div>

            <div className="text-center w15p flex justify-c">
              <ButtonR
                name="상세"
                color="white"
                styles={{ marginRight: 4 }}
                onClick={() => navigate(`/main/promotion/${promotionItem._id}`)}
              />
              <ButtonR
                name="삭제"
                color="white"
                styles={{ marginRight: 4 }}
                onClick={async () => {
                  await deleteItem("promotions", promotionItem._id, "기획전");
                  await init();
                }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MainBrand;
