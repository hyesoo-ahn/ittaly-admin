import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { getDatas, putUpdateDataBulk } from "../common/apis";
import { currency, deleteItem, timeFormat1 } from "../common/utils";
import ButtonR from "../components/ButtonR";
import InputR from "../components/InputR";
import SelectBox from "../components/SelectBox";

const CategoryOption1 = [
  { value: "전체", label: "전체" },
  { value: "취소/교환/반품", label: "취소/교환/반품" },
  { value: "주문/결제", label: "주문/결제" },
  { value: "배송", label: "배송" },
  { value: "회원", label: "회원" },
  { value: "적립금/쿠폰", label: "적립금/쿠폰" },
];
const CategoryOption2 = [
  { value: "전체", label: "전체" },
  { value: true, label: "Y" },
  { value: false, label: "N" },
];

export default function FAQ(): JSX.Element {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<any>("");
  const [selected2, setSelected2] = useState<any>("");
  const [faqData, setFaqData] = useState<any[]>([]);
  const [question, setQuestion] = useState<string>("");

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    const { data }: any = await getDatas({
      collection: "faq",
      sort: { topview: -1 },
    });

    setFaqData(data);
  };

  const handleCheckFaq = (item: any) => {
    let temp = [...faqData];
    const findIdx = temp.findIndex((el) => el === item);
    temp[findIdx].checked = !temp[findIdx].checked;
    setFaqData(temp);
  };

  const handleFaqStatusChange = async (state: boolean) => {
    const filtered = faqData.filter((el) => el.checked);
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

    const updateResult: any = await putUpdateDataBulk({ collection: "faq", updateData });

    if (updateResult.status === 200) {
      alert("FAQ 변경이 완료되었습니다.");
    }
    init();
  };

  const handleSetOrder = async (type: string) => {
    const filtered = faqData.filter((el) => el.checked);

    const updateData = [];

    switch (type) {
      case "addTopview":
        for (let i in filtered) {
          updateData.push({
            _id: filtered[i]._id,
            setData: {
              topview: true,
            },
          });
        }
        break;

      case "removeTopview":
        for (let i in filtered) {
          updateData.push({
            _id: filtered[i]._id,
            setData: {
              topview: false,
            },
          });
        }
        break;
    }

    const updateResult: any = await putUpdateDataBulk({ collection: "faq", updateData });

    if (updateResult.status === 200) {
      alert("FAQ 변경이 완료되었습니다.");
    }
    init();
  };

  const handleFilterFaq = async () => {
    let find: any = {};

    if (selected && selected.value !== "전체") find.category = selected.value;
    if (selected2 && selected2.value !== "전체") {
      find.openStatus = selected2.value;
    }
    if (question !== "") find.question = question;

    const { data }: any = await getDatas({
      collection: "faq",
      find: {
        ...find,
      },
      sort: { topview: -1 },
    });

    setFaqData(data);
  };

  const handleInitializingFilter = () => {
    setSelected("");
    setSelected2("");
    setQuestion("");

    init();
  };

  return (
    <div>
      <div className="flex justify-sb align-c">
        <p className="page-title">FAQ 관리</p>
      </div>

      <div className="w100p filter-container flex1">
        <div className="flex ml-4 mr-4">
          <div className="flex1 mr-4">
            <SelectBox
              containerStyles={{ width: "100%" }}
              value={selected}
              onChange={(e: any) => setSelected(e)}
              options={CategoryOption1}
              noOptionsMessage={"상태가 없습니다."}
              placeholder="카테고리"
            />
          </div>
          <div className="flex1 ml-4 mr-4">
            <SelectBox
              containerStyles={{ width: "100%" }}
              value={selected2}
              onChange={(e: any) => setSelected2(e)}
              options={CategoryOption2}
              noOptionsMessage={"상태가 없습니다."}
              placeholder="공개여부"
            />
          </div>
          <div className="flex1 ml-8"></div>
        </div>

        <div className="flex flex1 mt-8">
          <div className="flex ml-4 mr-4" style={{ width: "66.6666%" }}>
            <SelectBox
              containerStyles={{ width: "10%", marginRight: 8 }}
              onChange={(e: any) => {}}
              options={[{ value: "질문", label: "질문" }]}
              noOptionsMessage={"상태가 없습니다."}
              placeholder="질문"
            />
            <InputR
              placeholer="질문 내용"
              value={question}
              onChange={(e: any) => setQuestion(e.target.value)}
              innerStyle={{ flex: 1, margin: 0 }}
            />
          </div>

          <div className="flex ml-4 mr-4" style={{ height: 32, width: "33.3333%" }}>
            <button onClick={handleFilterFaq} className="btn-add-b w50p mr-4 h100p border-none">
              검색
            </button>
            <button
              onClick={handleInitializingFilter}
              className="w50p bg-white h100p ml-4 border-black"
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
            navigate("/site/faq/add");
          }}
          name="FAQ 등록"
        />
      </div>

      <div className="list-header mt-10 pl-18 pr-18">
        <div className="w5p">
          <input type="checkbox" />
        </div>

        <div className="w20p">
          <p>카테고리</p>
        </div>

        <div className="w55p">
          <p>질문</p>
        </div>

        <div className="w10p text-center">
          <p>공개여부</p>
        </div>

        <div className="w10p text-center">
          <p>기능</p>
        </div>
      </div>

      {faqData?.map((element: any, i: number) => (
        <div
          key={i}
          className={`list-content pl-18 pr-18 pt-2 pb-2 ${element.topview ? "bg-blue2" : ""} mt-4`}
        >
          <div className={`flex align-c`}>
            <div className="w5p">
              <input
                type="checkbox"
                checked={element.checked || ""}
                onChange={(e: any) => handleCheckFaq(element)}
              />
            </div>

            <div className="w20p">
              <p>{element.category}</p>
            </div>

            <div className="w55p">
              <p className="text-underline font-blue cursor">{element.question}</p>
            </div>

            <div className="w10p text-center">
              {element.openStatus && <p>Y</p>}
              {!element.openStatus && <p>N</p>}
            </div>

            <div className="w10p flex justify-c text-center">
              <ButtonR
                name="상세"
                color="white"
                styles={{ marginRight: 4 }}
                onClick={() => navigate(`/site/coupon/${element._id}`)}
              />
              <ButtonR
                name="삭제"
                color="white"
                styles={{ marginRight: 4 }}
                onClick={async () => {
                  await deleteItem("coupons", element._id, "쿠폰");
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
            styleClass="mr-4"
            onClick={() => handleFaqStatusChange(true)}
          />
          <ButtonR
            name="비공개"
            color="white"
            styleClass="mr-4"
            onClick={() => handleFaqStatusChange(false)}
          />
          <button className="mr-4 bg-blue2 btn-add " onClick={() => handleSetOrder("addTopview")}>
            TOP10 설정
          </button>
          <button className="mr-4 bg-blue2 btn-add" onClick={() => handleSetOrder("removeTopview")}>
            TOP10 해제
          </button>
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
