import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDatas } from "../common/apis";
import { IBrandData } from "../common/interfacs";
import { deleteItem } from "../common/utils";
import ButtonR from "../components/ButtonR";

const Promotion = () => {
  const navigate = useNavigate();
  const [brandData, setBrandData] = useState<IBrandData[]>();

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    const brandData: any = await getDatas({
      collection: "brands",
    });

    setBrandData(brandData.data);
  };

  return (
    <div>
      <div className="flex justify-sb align-c">
        <p className="page-title">첫 화면 관리 {">"} 기획전</p>
      </div>

      <div className="mt-34 flex justify-sb align-c">
        <p>총 {brandData?.length}건</p>
        <ButtonR
          onClick={() => {
            navigate("/promotion/addpromotion");
          }}
          name="기획전 등록"
        />
      </div>

      <div className="list-header mt-10 pl-18 pr-18">
        <div className="w10p">
          <input type="checkbox" />
        </div>

        <div className="w60p">
          <p>브랜드명</p>
        </div>

        <div className="w10p">
          <p>공개여부</p>
        </div>

        <div className="text-center w20p">
          <p>기능</p>
        </div>
      </div>

      {brandData?.map((aBrand, i) => (
        <div key={i} className="list-content pl-18 pr-18">
          <div className="flex align-c mt-8 mb-8">
            <div className="w10p">
              <input type="checkbox" />
            </div>

            <div className="w60p">
              <p>{aBrand.brandName}</p>
            </div>

            <div className="w10p">
              <p>{aBrand.openStatus ? "공개" : "비공개"}</p>
            </div>

            <div className="text-center w20p flex justify-c">
              <ButtonR
                name="상세"
                color="white"
                styles={{ marginRight: 4 }}
                onClick={() => navigate(`/brand/${aBrand._id}`)}
              />
              <ButtonR
                name="삭제"
                color="white"
                styles={{ marginRight: 4 }}
                onClick={async () => {
                  await deleteItem("brands", aBrand._id, "브랜드");
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

export default Promotion;
