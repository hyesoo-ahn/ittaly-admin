import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getDatas, putUpdateDataBulk } from "../common/apis";
import { IBrandData } from "../common/interfacs";
import { deleteItem, timeFormat1 } from "../common/utils";
import ButtonR from "../components/ButtonR";

const Magazine = () => {
  const navigate = useNavigate();
  const [magazines, setMagazines] = useState<any[]>([]);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    const { data }: any = await getDatas({
      collection: "magazines",
    });

    setMagazines(data);
  };

  const handleCheckItem = (item: any) => {
    let temp = [...magazines];
    const findIdx = temp.findIndex((el) => el === item);
    temp[findIdx].checked = !temp[findIdx].checked;
    setMagazines(temp);
  };

  const handleStatusChange = async (state: boolean) => {
    const filtered = magazines.filter((el) => el.checked);
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

    const updateResult: any = await putUpdateDataBulk({ collection: "magazines", updateData });

    if (updateResult.status === 200) {
      alert("변경되었습니다.");
    }

    init();
  };

  return (
    <div>
      <div className="flex justify-sb align-c">
        <p className="page-title">첫 화면 관리 {">"} 매거진</p>
      </div>

      <div className="mt-34 flex justify-sb align-c">
        <p>총 {magazines?.length}건</p>
        <ButtonR
          onClick={() => {
            navigate("/site/main/magazine/addmagazine");
          }}
          name="매거진 등록"
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

      {magazines?.map((item, i) => (
        <div key={i} className="list-content pl-18 pr-18">
          <div className="flex align-c mt-8 mb-8">
            <div className="w10p">
              <input
                type="checkbox"
                checked={item.checked}
                onChange={() => handleCheckItem(item)}
              />
            </div>

            <div className="w50p">
              <p>{item.title}</p>
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
                onClick={() => navigate(`/site/main/magazine/${item._id}`)}
              />
              <ButtonR
                name="삭제"
                color="white"
                styles={{ marginRight: 4 }}
                onClick={async () => {
                  await deleteItem("magazines", item._id, "매거진");
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

export default Magazine;
