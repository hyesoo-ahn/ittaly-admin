import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { getDatas, putUpdateDataBulk } from "../common/apis";
import { currency, deleteItem, timeFormat1 } from "../common/utils";
import ButtonR from "../components/ButtonR";
import InputR from "../components/InputR";
import SelectBox from "../components/SelectBox";

const Cateogyoptions1 = [
  { value: "연관상품 있음", label: "연관상품 있음" },
  { value: "연관상품 없음", label: "연관상품 없음" },
];

export default function LiveLikeIttaly(): JSX.Element {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<any>("");
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    const { data }: any = await getDatas({
      collection: "liveLikeIttaly",
    });
    setProducts(data);
  };

  const handleSerchValue = () => {
    let temp = [...products];
    if (selected.value === "연관상품 없음") {
      for (let i in temp) {
        if (temp[i].relatedProd.length === 0) {
          temp[i].hide = false;
        } else {
          temp[i].hide = true;
        }
      }
    }

    if (selected.value === "연관상품 있음") {
      for (let i in temp) {
        if (temp[i].relatedProd.length !== 0) {
          temp[i].hide = false;
        } else {
          temp[i].hide = true;
        }
      }
    }

    setProducts(temp);
  };

  const handleInit = async () => {
    await init();
    setSelected(null);
  };

  const handleCheck = (item: any) => {
    const targetIdx = products.findIndex((el) => el === item);
    let temp = [...products];
    temp[targetIdx] = !temp[targetIdx];
    setProducts(temp);
  };

  const handleUpdateStatus = async (type: boolean) => {
    const filterData = products.filter((el) => el.checked);

    let updateData: any[] = [];
    if (type) {
      for (let i in filterData) {
        updateData.push({
          _id: filterData[i]._id,
          setData: {
            openStatus: true,
          },
        });
      }
    } else {
      for (let i in filterData) {
        updateData.push({
          _id: filterData[i]._id,
          setData: {
            openStatus: false,
          },
        });
      }
    }

    const updateResult: any = await putUpdateDataBulk({ collection: "reviews", updateData });

    if (updateResult.status === 200) {
      alert(`${type ? "공개 설정" : "비공개 설정"}이 완료되었습니다.`);
    }

    init();
  };

  return (
    <div>
      <div className="flex justify-sb align-c">
        <p className="page-title">첫 화면 관리 {">"} #Live like ittaly</p>
      </div>

      <div className="w100p filter-container" style={{ flex: 1 }}>
        <div className="flex">
          <div
            style={{
              width: "33.333%",
              marginRight: 4,
            }}
          >
            <SelectBox
              containerStyles={{ width: "100%" }}
              placeholder={"게시물 유형"}
              value={selected}
              onChange={(e: any) => setSelected(e)}
              options={Cateogyoptions1}
              noOptionsMessage={""}
            />
          </div>
          <div style={{ width: "33.333%", marginRight: 4 }}></div>
          <div style={{ width: "33.333%", flex: 1, height: 32 }} className="flex align-c justify-c">
            <button
              className="btn-add-b"
              onClick={handleSerchValue}
              style={{
                width: "50%",
                marginRight: 2,
                height: "100%",
                border: "none",
              }}
            >
              검색
            </button>
            <button
              onClick={handleInit}
              style={{
                width: "50%",
                backgroundColor: "#fff",
                height: "100%",
                marginLeft: 2,
                border: "1px solid black",
              }}
            >
              초기화
            </button>
          </div>
        </div>
      </div>

      <div className="mt-34 flex justify-sb align-c">
        <p>총 0건</p>
        <ButtonR
          onClick={() => {
            navigate("/site/main/livelikeittaly/addlivelikeittaly");
          }}
          name="등록"
        />
      </div>

      <div className="list-header mt-10 pl-18 pr-18 text-center">
        <div className="w5p">
          <input type="checkbox" />
        </div>

        <div className="w10p">
          <div className="text-center">
            <p>썸네일</p>
          </div>
        </div>

        <div className="w10p">
          <p>관련상품</p>
        </div>

        <div className="w35p">
          <p>상품정보</p>
        </div>

        <div className="w15p">
          <p>공개여부</p>
        </div>

        <div className="w10p">
          <p>공개시작일</p>
        </div>

        <div className="text-center w15p">
          <p>기능</p>
        </div>
      </div>

      {products
        ?.filter((el) => !el.hide)
        ?.map((productItem: any, i: number) => (
          <div key={i} className="list-content pl-18 pr-18">
            <div className="flex align-c mt-8 mb-8 text-center">
              <div className="w5p">
                <input
                  checked={productItem.checked}
                  onChange={(e: any) => handleCheck(productItem)}
                  type="checkbox"
                />
              </div>

              <div className="w10p">
                <img src={productItem.imgUrl} style={{ width: 60, height: "auto" }} />
              </div>

              <div className="w10p">{productItem?.relatedProd?.length === 0 ? "N" : "Y"}</div>

              <div className="w35p">
                <p>{productItem.relatedProd[0]?.productNameK}</p>
              </div>

              <div className="w15p">
                <p>{productItem.openStatus ? "공개" : "비공개"}</p>
              </div>

              <div className="w10p">
                <p>{timeFormat1(productItem.openingStamp)}</p>
              </div>

              <div className="text-center w15p flex justify-c">
                <ButtonR
                  name="상세"
                  color="white"
                  styles={{ marginRight: 4 }}
                  onClick={() => navigate(`/site/main/livelikeittaly/${productItem._id}`)}
                />
                <ButtonR
                  name="삭제"
                  color="white"
                  styles={{ marginRight: 4 }}
                  onClick={async () => {
                    await deleteItem("liveLikeIttaly", productItem._id, "live like ittaly");
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
            onClick={() => handleUpdateStatus(true)}
            styles={{ marginRight: 4 }}
          />
          <ButtonR
            name="비공개"
            color="white"
            onClick={() => handleUpdateStatus(false)}
            styles={{ marginRight: 4 }}
          />
        </div>

        <div className="flex pagination">
          <p className="font-lightgray">{"<"}</p>
          <p className="font-bold">1</p>
          <p>2</p>
          <p>3</p>
          <p>4</p>
          <p>5</p>
          <p className="font-lightgray">{">"}</p>
        </div>
      </div>
    </div>
  );
}
//
