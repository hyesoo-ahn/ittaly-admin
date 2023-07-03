import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getDatas } from "../common/apis";
import { IBrandData } from "../common/interfacs";
import { deleteItem, timeFormat1 } from "../common/utils";
import ButtonR from "../components/ButtonR";

const MainBrand = () => {
  const navigate = useNavigate();
  const [mainBrands, setMainBrands] = useState<any[]>();

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    const { data }: any = await getDatas({
      collection: "mainBrands",
    });

    setMainBrands(data);
  };

  return (
    <div>
      <div className="flex justify-sb align-c">
        <p className="page-title">첫 화면 관리 {">"} 브랜드</p>
      </div>

      <div className="mt-34 flex justify-sb align-c">
        <p>총 {mainBrands?.length}건</p>
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
          <p>브랜드</p>
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

      {mainBrands?.map((item, i) => (
        <div key={i} className="list-content pl-18 pr-18">
          <div className="flex align-c mt-8 mb-8">
            <div className="w10p">
              <input type="checkbox" />
            </div>

            <div className="w50p">
              <p>{item.brandName}</p>
            </div>

            <div className="w10p text-center">
              <p>{item.openStatus ? "공개" : "비공개"}</p>
            </div>
            <div className="w15p text-center">
              <p>{timeFormat1(item.openingStamp)}</p>
            </div>

            <div className="text-center w15p flex justify-c">
              <ButtonR
                name="상세"
                color="white"
                styles={{ marginRight: 4 }}
                onClick={() => navigate(`/main/brand/${item._id}`)}
              />
              <ButtonR
                name="삭제"
                color="white"
                styles={{ marginRight: 4 }}
                onClick={async () => {
                  await deleteItem("mainBrands", item._id, "메인스크린 브랜드");
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
