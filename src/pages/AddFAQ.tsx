import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";
import { getDatas, postCollection, putUpdateDataBulk } from "../common/apis";
import { IBrandData } from "../common/interfacs";
import { deleteItem, moveValue, timeFormat1 } from "../common/utils";
import ButtonR from "../components/ButtonR";
import down_g from "../images/down_g.png";
import down_b from "../images/down_b.png";
import up_g from "../images/up_g.png";
import up_b from "../images/up_b.png";
import InputR from "../components/InputR";
import SelectBox from "../components/SelectBox";

const Cateogyoptions1 = [
  { value: "전체", label: "전체" },
  { value: "취소/교환/반품", label: "취소/교환/반품" },
  { value: "주문/결제", label: "주문/결제" },
  { value: "배송", label: "배송" },
  { value: "회원", label: "회원" },
  { value: "적립금/쿠폰", label: "적립금/쿠폰" },
];

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

const AddFAQ = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<any>("");
  const [question, setQuestion] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");
  const [openingDate, setOpeningDate] = useState<string>("");
  const [openStatus, setOpenStatus] = useState<boolean>(true);

  useEffect(() => {}, []);

  const handleValidForm = () => {
    let isValid = true;
    if (selected === "" || !selected) {
      isValid = false;
      return alert("카테고리를 선택해 주세요.");
    }
    if (question === "") {
      isValid = false;
      return alert("질문을 입력해 주세요.");
    }
    if (answer === "") {
      isValid = false;
      return alert("답변을 입력해 주세요.");
    }

    return isValid;
  };

  const handleAddFaq = async () => {
    const isValid: any = handleValidForm();
    if (!isValid) return;

    const timestamp: number | null = openingDate ? new Date(openingDate).getTime() : null;

    const _body = {
      category: selected.value,
      question,
      answer,
      openingDate: timestamp,
      openStatus,
    };

    const postResult: any = await postCollection({
      collection: "faq",
      ..._body,
    });

    if (postResult.status === 200 && postResult.acknowledged) {
      alert("등록이 완료되었습니다.");
      navigate("/site/faq");
    }
  };

  return (
    <div>
      <div className="flex justify-sb align-c">
        <p className="page-title">FAQ 등록</p>
      </div>

      <div className="field-list-wrapper mt-40">
        <div className="product-field mr-20">
          <p>
            카테고리<span className="font-red">*</span>
          </p>
        </div>

        <div className="flex1 pt-10 pb-10">
          <SelectBox
            value={selected}
            onChange={(e: any) => setSelected(e)}
            options={Cateogyoptions1}
            noOptionsMessage={"상태가 없습니다."}
            placeholder="카테고리 선택"
          />
        </div>
      </div>
      <div className="field-list-wrapper mt-2">
        <div className="product-field mr-20 align-c">
          <p>
            질문<span className="font-red">*</span>
          </p>
        </div>

        <div className="flex1 pt-10 pb-10">
          <InputR
            value={question}
            onChange={(e: any) => setQuestion(e.target.value)}
            size="full"
            placeholer="질문을 입력해 주세요"
          />
        </div>
      </div>
      <div className="field-list-wrapper mt-2">
        <div className="product-field mr-20">
          <p>
            답변<span className="font-red">*</span>
          </p>
        </div>

        <div className="flex1 pt-10 pb-10">
          <div>
            <ReactQuill
              placeholder="답변을 입력해 주세요"
              className="quill"
              theme="snow"
              modules={{ toolbar: toolbarOptions }}
              value={answer}
              onChange={setAnswer}
            />
          </div>
        </div>
      </div>

      <div className="field-list-wrapper mt-2">
        <div className="product-field mr-20">
          <p>공개시작일</p>
        </div>

        <div className="flex1 pt-10 pb-10 flex align-c">
          <input
            value={openingDate}
            onChange={(e: any) => setOpeningDate(e.target.value)}
            className="input-date mr-8"
            type="date"
          />
        </div>
      </div>

      <div className="product-field-wrapper mt-2 w100p">
        <div className="product-field mr-20">
          <p>공개여부</p>
        </div>

        <div onClick={() => setOpenStatus(true)} className="checkbox-c mr-4 cursor">
          {openStatus && <div className="checkbox-c-filled"></div>}
        </div>

        <p onClick={() => setOpenStatus(true)} className="mr-30 cursor">
          공개
        </p>

        <div onClick={() => setOpenStatus(false)} className="checkbox-c mr-4 cursor">
          {!openStatus && <div className="checkbox-c-filled" />}
        </div>

        <p onClick={() => setOpenStatus(false)} className="mr-35 cursor">
          비공개
        </p>
      </div>

      <div className="flex justify-fe">
        <ButtonR
          onClick={() => navigate("/site/faq")}
          name={"취소"}
          color={"white"}
          styleClass="mr-4"
        />
        <ButtonR onClick={handleAddFaq} name={"저장"} />
      </div>
    </div>
  );
};

export default AddFAQ;
