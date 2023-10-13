import React, { useEffect, useRef, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";
import { getDatas, postCollection, postUploadImage, putUpdateDataBulk } from "../common/apis";
import { moveValue } from "../common/utils";
import ButtonR from "../components/ButtonR";

import InputR from "../components/InputR";
import SelectBox from "../components/SelectBox";

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

interface ICategory {
  label: string;
  value: string;
}
interface IFile {
  file: File | null;
  fileUrl: string;
}

const CATEGORY = [
  // { label: "전체", value: "전체" },
  { label: "공지", value: "공지" },
  { label: "시스템", value: "시스템" },
  { label: "이벤트", value: "이벤트" },
];

const AddNotice = () => {
  const navigate = useNavigate();
  const [bannersData, setBannersData] = useState<any[]>([]);
  const [value, setValue] = useState("");
  const [category, setCategory] = useState<ICategory | null>();
  const [openStatus, setOpenStatus] = useState<boolean>(true);
  const [events, setEvents] = useState<any[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [title, setTitle] = useState<string>("");
  const [file, setFile] = useState<IFile>();
  const fileRef = useRef<HTMLInputElement>(null);
  const [openingDate, setOpeningDate] = useState<string>("");

  useEffect(() => {
    // init();
  }, []);

  useEffect(() => {
    if (category?.label === "이벤트") {
      getEvents();
    }
  }, [category]);

  const getEvents = async () => {
    const eventsData: any = await getDatas({
      collection: "events",
      sort: { sort: 1 },
    });

    let tempEvents = [];
    for (let i = 0; i < eventsData.data?.length; i++) {
      tempEvents.push({
        label: eventsData.data[i].title,
        value: eventsData.data[i].title,
        _id: eventsData.data[i]._id,
      });
    }
    setEvents(tempEvents);
  };

  // 이미지 첨부 핸들러
  const handleFileChange = (evt: any) => {
    const file = evt.target.files?.[0];
    const imgUrl = URL.createObjectURL(file);
    setFile({
      file: file,
      fileUrl: imgUrl,
    });
  };

  const handleValidateNotice = () => {
    let isValid = true;
    if (!category) return false;
    if (title === "") return false;
    if (value === "") return false;
    return isValid;
  };

  const handleAddNotice = async () => {
    const valid = handleValidateNotice();
    if (!valid) return alert("필수 사항을 입력해 주세요.");

    const opening = new Date(openingDate);
    const timestamp = opening.getTime();

    let url: any = "";
    if (file?.file) {
      const formData = new FormData();
      formData.append("file", file.file as File);
      const urlResult: any = await postUploadImage(formData);
      url = urlResult.url;
    }

    const body = {
      category: category!.value,
      title,
      contents: value,
      openingDate: openingDate !== "" ? timestamp : null,
      openStatus,
      imgUrl: url,
      targetEventId: category!.value === "이벤트" ? selectedEvent._id : null,
    };

    const postResult = await postCollection({
      collection: "notice",
      ...body,
    });

    if (postResult.status === 200) {
      alert("등록이 완료되었습니다.");
      navigate(-1);
    }
  };

  return (
    <div>
      <div className="flex justify-sb align-c">
        <p className="page-title">공지사항 등록</p>
      </div>

      <div className="field-list-wrapper mt-40">
        <div className="product-field mr-20">
          <p>
            카테고리<span className="font-red">*</span>
          </p>
        </div>

        <div className="flex1 pt-10 pb-10">
          <SelectBox
            options={CATEGORY}
            value={category}
            noOptionsMessage=""
            onChange={(e: any) => setCategory(e)}
            placeholder="카테고리"
          />
        </div>
      </div>

      <div className="field-list-wrapper mt-2">
        <div className="product-field mr-20">
          <p>
            제목<span className="font-red">*</span>
          </p>
        </div>

        <div className="flex1 pt-10 pb-10">
          <InputR
            value={title}
            onChange={(e: any) => setTitle(e.target.value)}
            placeholer="제목을 입력해 주세요"
            size="full"
          />
        </div>
      </div>

      <div className="field-list-wrapper mt-2">
        <div className="product-field mr-20">
          <p>
            내용<span className="font-red">*</span>
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
        <div className="product-field mr-20">
          <p>이미지 첨부</p>
        </div>

        <div className="flex1 pt-10 pb-10">
          <ButtonR
            name={`이미지 추가 ${file?.fileUrl ? 1 : 0}/1`}
            onClick={() => fileRef?.current?.click()}
          />
          <input
            type="file"
            style={{ display: "none" }}
            onChange={(e) => handleFileChange(e)}
            ref={fileRef}
          />

          {file?.fileUrl && (
            <>
              <div className="mt-10">
                <img src={file?.fileUrl} style={{ width: 136, height: "auto" }} />

                <ButtonR
                  color={"white"}
                  name="삭제"
                  onClick={() => {
                    setFile({
                      file: null,
                      fileUrl: "",
                    });
                  }}
                />
              </div>
            </>
          )}
        </div>
      </div>

      {category?.label === "이벤트" && (
        <div className="field-list-wrapper mt-2">
          <div className="product-field mr-20">
            <p>
              해당 이벤트<span className="font-red">*</span>
            </p>
          </div>

          <div className="flex1 pt-10 pb-10">
            <SelectBox
              containerStyles={{ width: "100%" }}
              options={events}
              value={selectedEvent}
              noOptionsMessage=""
              onChange={(e: any) => setSelectedEvent(e)}
              placeholder="카테고리"
            />
          </div>
        </div>
      )}

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
        <ButtonR onClick={() => navigate(-1)} name={"취소"} color={"white"} styleClass="mr-4" />
        <ButtonR onClick={handleAddNotice} name={"저장"} />
      </div>
    </div>
  );
};

export default AddNotice;
