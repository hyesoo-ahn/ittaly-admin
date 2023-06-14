import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDatas } from "../common/apis";
import ButtonR from "../components/ButtonR";

const Category = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<any>([]);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    const getCategoryData: any = await getDatas({
      collection: "categories",
    });

    setCategories(getCategoryData.data);
  };

  return (
    <div>
      <div className="flex justify-sb align-c">
        <p className="page-title">카테고리 관리</p>
      </div>

      <div className="mt-34 flex justify-sb align-c">
        <p>총 {categories?.length}건</p>
        <ButtonR
          onClick={() => {
            navigate("/category/addcategory");
          }}
          name="카테고리 등록"
        />
      </div>

      <div className="list-header mt-10 pl-18 pr-18">
        <div className="w10p">
          <input type="checkbox" />
        </div>

        <div className="w15p">
          <p>순서</p>
        </div>

        <div className="w40p">
          <p>카테고리명</p>
        </div>

        <div className="w15p">
          <p>공개여부</p>
        </div>
        <div className="text-center w20p">
          <p>기능</p>
        </div>
      </div>

      {categories?.map((aCategory: any, i: number) => (
        <div key={i} className="list-content pl-18 pr-18">
          <div className="flex align-c mt-8 mb-8">
            <div className="w10p">
              <input type="checkbox" />
            </div>

            <div className="w15p">
              <p>순서</p>
            </div>

            <div className="w40p">
              <p>{aCategory.name}</p>
            </div>

            <div className="w15p">
              <p>{aCategory.openStatus ? "공개" : "비공개"}</p>
            </div>

            <div className="text-center w20p flex justify-c">
              <ButtonR
                name="상세"
                color="white"
                styles={{ marginRight: 4 }}
                onClick={() => navigate(`/category/${aCategory._id}`)}
              />
              <ButtonR name="삭제" color="white" styles={{ marginRight: 4 }} onClick={() => {}} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Category;
