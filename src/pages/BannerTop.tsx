import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDatas, putUpdateDataBulk } from "../common/apis";
import { IBrandData } from "../common/interfacs";
import { deleteItem, moveValue, timeFormat1 } from "../common/utils";
import ButtonR from "../components/ButtonR";
import down_g from "../images/down_g.png";
import down_b from "../images/down_b.png";
import up_g from "../images/up_g.png";
import up_b from "../images/up_b.png";

const BannerTop = () => {
  const navigate = useNavigate();
  const [bannersData, setBannersData] = useState<any[]>([]);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    const banners: any = await getDatas({
      collection: "banners",
      sort: { sort: 1 },
    });
    setBannersData(banners.data);
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

    await putUpdateDataBulk({
      collection: "banners",
      updateData: [...updateTemp],
    });

    setBannersData([...newArr]);
  };

  const handleCheckBanner = (item: any) => {
    let temp = [...bannersData];
    const findIdx = temp.findIndex((el) => el === item);
    temp[findIdx].checked = !temp[findIdx].checked;
    setBannersData(temp);
  };

  const handleFaqStatusChange = async (state: boolean) => {
    const filtered = bannersData.filter((el) => el.checked);
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

    const updateResult: any = await putUpdateDataBulk({ collection: "banners", updateData });

    if (updateResult.status === 200) {
      alert("변경되었습니다.");
    }

    init();
  };

  return (
    <div>
      <div className="flex justify-sb align-c">
        <p className="page-title">첫 화면 관리 {">"} 상단배너</p>
      </div>

      <div className="mt-34 flex justify-sb align-c">
        <p>총 {bannersData?.length}건</p>
        <ButtonR
          onClick={() => {
            navigate("/site/main/bannertop/addbanner");
          }}
          name="배너 등록"
        />
      </div>

      <div className="list-header mt-10 pl-18 pr-18 text-center">
        <div className="w5p text-left">{/* <input type="checkbox" /> */}</div>

        <div className="w10p">
          <p>순서</p>
        </div>

        <div className="w35p">
          <p>헤드라인</p>
        </div>

        <div className="w15p">
          <p>공개여부</p>
        </div>

        <div className="w15p">
          <p>공개시작일</p>
        </div>

        <div className="text-center w20p">
          <p>기능</p>
        </div>
      </div>

      {bannersData?.map((aBanner: any, i: number) => (
        <div key={i} className="list-content pl-18 pr-18">
          <div className="flex align-c mt-8 mb-8 text-center">
            <div className="w5p text-left">
              <input
                type="checkbox"
                checked={aBanner.checked}
                onChange={(e: any) => handleCheckBanner(aBanner)}
              />
            </div>

            <div className="w10p">
              <img
                onClick={() => handleMoveOrder(bannersData, i, i - 1)}
                src={i === 0 ? up_g : up_b}
                style={{ width: 28, height: "auto" }}
                className="mr-4 cursor"
              />
              <img
                onClick={() => handleMoveOrder(bannersData, i, i + 1)}
                src={i === bannersData.length - 1 ? down_g : down_b}
                style={{ width: 28, height: "auto" }}
                className="cursor"
              />
            </div>

            <div className="w35p">
              <p>{aBanner.headline}</p>
            </div>

            <div className="w15p">
              <p>{aBanner.openStatus ? "공개" : "비공개"}</p>
            </div>

            <div className="w15p">
              <p>{timeFormat1(aBanner.openingStamp)}</p>
            </div>

            <div className="text-center w20p flex justify-c">
              <ButtonR
                name="상세"
                color="white"
                styles={{ marginRight: 4 }}
                onClick={() => navigate(`/site/main/bannertop/${aBanner._id}`)}
              />
              <ButtonR
                name="삭제"
                color="white"
                styles={{ marginRight: 4 }}
                onClick={async () => {
                  await deleteItem("banners", aBanner._id, "배너");
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
            onClick={() => handleFaqStatusChange(true)}
            styles={{ marginRight: 4, width: 80 }}
          />
          <ButtonR
            name="비공개"
            color="white"
            onClick={() => handleFaqStatusChange(false)}
            styles={{ marginRight: 4, width: 80 }}
          />
        </div>
      </div>
    </div>
  );
};

export default BannerTop;
