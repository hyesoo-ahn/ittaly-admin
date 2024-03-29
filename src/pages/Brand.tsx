import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDatas } from "../common/apis";
import { IBrandData } from "../common/interfacs";
import { deleteItem, handleDeleteBrand } from "../common/utils";
import ButtonR from "../components/ButtonR";

const Brand = () => {
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

  // const handleDeleteBrand = async (item: any) => {
  //   const { data }: any = await getDatas({
  //     collection: "products",
  //     find: { brandId: item?._id, delete: { $ne: true } },
  //   });

  //   if (data.length === 0) {
  //     await deleteItem("brands", item._id, "브랜드");
  //     await init();
  //   } else {
  //     alert(
  //       `해당 브랜드에 포함된 상품이 남아있습니다. \n해당 브랜드의 모든 상품 삭제 후 진행해 주세요.`
  //     );
  //   }
  // };

  return (
    <div>
      <div className="flex justify-sb align-c">
        <p className="page-title">브랜드 관리</p>
      </div>

      <div className="mt-34 flex justify-sb align-c">
        <p>총 {brandData?.length}건</p>
        <ButtonR
          onClick={() => {
            navigate("/product/brand/addbrand");
          }}
          name="브랜드 등록"
        />
      </div>

      <div className="list-header mt-10 pl-18 pr-18">
        {/* <div className="w10p">
          <input type="checkbox" />
        </div> */}

        <div className="w60p">
          <p>브랜드명</p>
        </div>

        <div className="w20p">
          <p>공개여부</p>
        </div>

        <div className="text-center w20p">
          <p>기능</p>
        </div>
      </div>

      {brandData?.map((aBrand, i) => (
        <div key={i} className="list-content pl-18 pr-18">
          <div className="flex align-c mt-8 mb-8">
            {/* <div className="w10p">
              <input type="checkbox" />
            </div> */}

            <div className="w60p">
              <p>{aBrand.brandName}</p>
            </div>

            <div className="w20p">
              <p>{aBrand.openStatus ? "공개" : "비공개"}</p>
            </div>

            <div className="text-center w20p flex justify-c">
              <ButtonR
                name="상세"
                color="white"
                styles={{ marginRight: 4 }}
                onClick={() => navigate(`/product/brand/${aBrand._id}`)}
              />
              <ButtonR
                name="삭제"
                color="white"
                styles={{ marginRight: 4 }}
                onClick={() => handleDeleteBrand(aBrand, init)}
                // onClick={async () => {
                //   await deleteItem("brands", aBrand._id, "브랜드");
                //   await init();
                // }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Brand;
