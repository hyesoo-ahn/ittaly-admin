import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDatas, putUpdateDataBulk } from "../common/apis";
import { IBrandData } from "../common/interfacs";
import { deleteItem, timeFormat1 } from "../common/utils";
import ButtonR from "../components/ButtonR";

const Promotion = () => {
  const navigate = useNavigate();
  const [promotions, setPromotions] = useState<any[]>([]);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    const promotionData: any = await getDatas({
      collection: "promotions",
    });

    setPromotions(promotionData.data);
  };

  const handleCheckPromotion = (item: any) => {
    let temp: any = [...promotions];
    const findIdx = temp.findIndex((el: any) => el === item);
    temp[findIdx].checked = !temp[findIdx].checked;
    setPromotions(temp);
  };

  const handleStatusChange = async (state: boolean) => {
    const filtered: any = promotions.filter((el) => el.checked);
    const updateData = [];

    switch (state) {
      case true:
        for (let i in filtered) {
          updateData.push({
            _id: filtered[i]._id,
            setData: {
              openStatus: true,
            },
          });
        }
        break;

      case false:
        for (let i in filtered) {
          updateData.push({
            _id: filtered[i]._id,
            setData: {
              openStatus: false,
            },
          });
        }
        break;
    }

    const updateResult: any = await putUpdateDataBulk({ collection: "promotions", updateData });

    if (updateResult.status === 200) {
      alert("변경되었습니다.");
    }

    init();
  };

  return (
    <div>
      <div className="flex justify-sb align-c">
        <p className="page-title">첫 화면 관리 {">"} 기획전</p>
      </div>

      <div className="mt-34 flex justify-sb align-c">
        <p>총 {promotions?.length}건</p>
        <ButtonR
          onClick={() => {
            navigate("/site/main/promotion/addpromotion");
          }}
          name="기획전 등록"
        />
      </div>

      <div className="list-header mt-10 pl-18 pr-18">
        <div className="w10p">{/* <input type="checkbox" /> */}</div>

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
              <input
                checked={promotionItem.checked}
                onChange={() => handleCheckPromotion(promotionItem)}
                type="checkbox"
              />
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
                onClick={() => navigate(`/site/main/promotion/${promotionItem._id}`)}
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

      <div className="mt-20 flex justify-sb align-c flex-wrap">
        <div className="flex">
          <ButtonR
            name="공개"
            color="white"
            onClick={() => handleStatusChange(true)}
            styles={{ marginRight: 4, width: 80 }}
          />
          <ButtonR
            name="비공개"
            color="white"
            onClick={() => handleStatusChange(false)}
            styles={{ marginRight: 4, width: 80 }}
          />
        </div>
      </div>
    </div>
  );
};

export default Promotion;
