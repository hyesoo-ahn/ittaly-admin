import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteData, getDatas, putUpdateDataBulk } from "../common/apis";
import ButtonR from "../components/ButtonR";
import up_g from "../images/up_g.png";
import up_b from "../images/up_b.png";
import down_g from "../images/down_g.png";
import down_b from "../images/down_b.png";
import { moveValue } from "../common/utils";

const Category = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<any>([]);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    const getCategoryData: any = await getDatas({
      collection: "categories",
      sort: { sort: 1 },
    });

    setCategories(getCategoryData.data);
  };

  const handleMoveOrder = async (array: object[], fromIndex: number, toIndex: number) => {
    const newArr: any = moveValue(array, fromIndex, toIndex);

    let updateTemp = [];
    for (let i in [...newArr]) {
      updateTemp.push({
        _id: newArr[i]._id,
        setData: {
          sort: i,
        },
      });
    }

    const result: any = await putUpdateDataBulk({
      collection: "categories",
      updateData: [...updateTemp],
    });

    setCategories([...newArr]);
  };

  const handleDelteCategory = async (id: string) => {
    //카테고리 삭제시 등록된 상품도 같이 삭제..?

    const deleteResult: any = await deleteData({
      collection: "categories",
      _id: id,
    });

    if (deleteResult.deletedCount) {
      alert("해당 카테고리가 삭제되었습니다.");
      init();
    }
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
              <img
                onClick={() => handleMoveOrder(categories, i, i - 1)}
                src={i === 0 ? up_g : up_b}
                style={{ width: 28, height: "auto" }}
                className="mr-4 cursor"
              />
              <img
                onClick={() => handleMoveOrder(categories, i, i + 1)}
                src={i === categories.length - 1 ? down_g : down_b}
                style={{ width: 28, height: "auto" }}
                className="cursor"
              />
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
              <ButtonR
                name="삭제"
                color="white"
                styles={{ marginRight: 4 }}
                onClick={() => handleDelteCategory(aCategory._id)}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Category;
