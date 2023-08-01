import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";
import { getDatas, putUpdateDataBulk } from "../common/apis";
import { IBrandData } from "../common/interfacs";
import { deleteItem, moveValue, timeFormat1 } from "../common/utils";
import ButtonR from "../components/ButtonR";
import down_g from "../images/down_g.png";
import down_b from "../images/down_b.png";
import up_g from "../images/up_g.png";
import up_b from "../images/up_b.png";
import InputR from "../components/InputR";

const toolbarOptions = [
  ["bold", "italic", "underline", "strike"],
  ["blockquote", "code-block"],

  //   [{ header: 1 }, { header: 2 }], // custom button values
  [{ list: "ordered" }, { list: "bullet" }],
  //   [{ script: "sub" }, { script: "super" }], // superscript/subscript
  [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
  //   [{ direction: "rtl" }], // text direction

  [{ size: ["small", false, "large", "huge"] }], // custom dropdown
  [{ header: [1, 2, 3, 4, 5, 6, false] }],

  [{ color: [] }, { background: [] }], // dropdown with defaults from theme
  [{ font: [] }],
  [{ align: [] }],

  ["clean"],
];

const TermsOfPrivacy = () => {
  const navigate = useNavigate();
  const [bannersData, setBannersData] = useState<any[]>([]);
  const [value, setValue] = useState("");

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

  return (
    <div>
      <div className="flex justify-sb align-c">
        <p className="page-title">약관 {">"} 개인정보처리방침</p>
      </div>

      <div className="field-list-wrapper mt-40">
        <div className="product-field mr-20">
          <p>
            본문<span className="font-red">*</span>
          </p>
        </div>

        <div className="flex1 pt-10 pb-10">
          <div>
            <ReactQuill
              className="quill"
              theme="snow"
              modules={{ toolbar: toolbarOptions }}
              value={value}
              onChange={setValue}
            />
          </div>
        </div>
      </div>
      <div className="field-list-wrapper mt-2">
        <div className="product-field mr-20 align-c">
          <p>
            개정사유<span className="font-red">*</span>
          </p>
        </div>

        <div className="flex1 pt-10 pb-10">
          <InputR size="full" />
        </div>
      </div>
      <div className="field-list-wrapper mt-2">
        <div className="product-field mr-20">
          <p>
            개정일<span className="font-red">*</span>
          </p>
        </div>

        <div className="flex1 pt-10 pb-10 flex align-c">
          <input className="input-date mr-8" type="date" />
          <input type="checkbox" className="cursor" />
          <p className="font-12">신규 약관 적용</p>
        </div>
      </div>

      <div className="flex justify-fe">
        <ButtonR onClick={() => {}} name={"취소"} color={"white"} styleClass="mr-4" />
        <ButtonR onClick={() => {}} name={"저장"} />
      </div>

      <div className="mt-40">
        <p className="font-18 font-bold">개정 이력</p>
      </div>
      <div className="list-header mt-10 pl-18 pr-18 text-center">
        <div className="w20p">
          <p>개정일 (최신순)</p>
          {/* <input type="checkbox" /> */}
        </div>

        <div className="w60p">
          <p>개정 사유</p>
        </div>

        <div className="w20p">
          <p>등록자</p>
        </div>
      </div>

      <div className="pl-18 pr-18 pt-10 pb-10">
        <div className="flex align-c text-center font-14">
          <div className="w20p">
            <p>2023.01.01 11:11</p>
          </div>

          <div className="w60p">
            <p>개인정보 처리 담당자 변경</p>
          </div>

          <div className="w20p">
            <p>관리자</p>
          </div>
        </div>
      </div>

      <div className="pl-18 pr-18 pt-10 pb-10">
        <div className="flex align-c text-center font-14">
          <div className="w20p">
            <p>2023.01.01 11:11</p>
          </div>

          <div className="w60p">
            <p>개인정보 처리 담당자 변경</p>
          </div>

          <div className="w20p">
            <p>관리자</p>
          </div>
        </div>
      </div>

      <div className="pl-18 pr-18 pt-10 pb-10">
        <div className="flex align-c text-center font-14">
          <div className="w20p">
            <p>2023.01.01 11:11</p>
          </div>

          <div className="w60p">
            <p>개인정보 처리 담당자 변경</p>
          </div>

          <div className="w20p">
            <p>관리자</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfPrivacy;
