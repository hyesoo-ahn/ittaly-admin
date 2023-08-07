import React, { ChangeEvent, useCallback, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { postAddBrand, postUploadImage } from "../common/apis";
import ButtonR from "../components/ButtonR";
import InputR from "../components/InputR";
import forward from "../images/Forward.png";

interface IFile {
  file: File | null;
  url: string;
}

const AddBrand = () => {
  const navigate = useNavigate();
  const [brandName, setBrandName] = useState<string>("");
  const [desc, setDesc] = useState<string>("");
  const [txtLength, setTxtLength] = useState(0);
  const [file, setFile] = useState<IFile>({
    file: null,
    url: "",
  });
  const fileRef = useRef<any>(null);
  const [openStatus, setOpenStatus] = useState<boolean>(true);

  const onChangeHandler = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    setDesc(e.target.value);
    setTxtLength(e.target.value.length);
  }, []);

  // 이미지 첨부 핸들러
  const handleFileChange = (evt: any) => {
    const file = evt.target.files?.[0];
    const imgUrl = URL.createObjectURL(file);
    setFile({
      file: file,
      url: imgUrl,
    });
  };

  // 브랜드 등록
  const handleAddBrand = async () => {
    const formData = new FormData();
    formData.append("file", file.file as File);
    const getUrl: any = await postUploadImage(formData);

    if (getUrl.result && getUrl.status === 200) {
      const body = {
        collection: "brands",
        brandName,
        desc,
        imgUrl: getUrl.url,
        openStatus,
      };
      const addResult: any = await postAddBrand(body);
      if (addResult.result && addResult.status === 200) {
        alert("브랜드 등록이 완료되었습니다.");
      }
      navigate(-1);
    }
  };

  return (
    <div>
      <div className="flex align-c pb-30">
        <img onClick={() => navigate(-1)} className="img-close cursor mr-4" src={forward} />
        <p className="page-title mt-3">브랜드 등록</p>
      </div>

      <div className="product-field-wrapper mt-2 w100p">
        <div className="product-field mr-20">
          <p>
            브랜드명<span className="font-red">*</span>
          </p>
        </div>

        <div className="flex1">
          <InputR
            size="full"
            value={brandName}
            onChange={(e: any) => setBrandName(e.target.value)}
            placeholer={"영문입력"}
          />
        </div>
      </div>

      <div className="field-list-wrapper mt-2">
        <div className="product-field mr-20">
          <p>
            브랜드 소개<span className="font-red">*</span>
          </p>
        </div>

        <div className="mt-16 mb-16 flex1" style={{ position: "relative" }}>
          <textarea
            value={desc}
            onChange={(e) => onChangeHandler(e)}
            className="input-textarea"
            placeholder="공백포함 100자 이내"
          />
          <div
            className="font-12"
            style={{
              position: "absolute",
              bottom: 10,
              right: 10,
              fontWeight: 400,
              color: "rgba(0,0,0,0.4)",
            }}
          >
            {txtLength}/100
          </div>
        </div>
      </div>

      <div className="mt-2 field-list-wrapper">
        <div className="product-field mr-20">
          <p>
            대표이미지
            <br />
            (썸네일)
            <span className="font-red">*</span>
          </p>
        </div>

        <div className="flex f-direction-column">
          <div className="list-header-content align-c" style={{ border: "none" }}>
            <div className="mr-12">
              <input
                style={{ display: "none" }}
                ref={fileRef}
                onChange={(e) => handleFileChange(e)}
                type="file"
              />
              <ButtonR onClick={() => fileRef?.current?.click()} name={`이미지 추가 0/1`} />
            </div>

            <p className="font-desc">이미지 1장, 1080px x 1080px</p>
          </div>

          {file.url && <img src={file.url} style={{ width: 136, height: "auto" }} />}

          {file.url && (
            <div className="flex mt-10 mb-16">
              <ButtonR
                name={`삭제`}
                color={"white"}
                onClick={() => setFile({ file: null, url: "" })}
              />
            </div>
          )}
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

      <div className="flex justify-sb mt-10">
        <div>
          <ButtonR name={"삭제"} onClick={() => {}} color={"white"} />
        </div>
        <div className="flex">
          <ButtonR name={"취소"} onClick={() => navigate(-1)} styleClass={"mr-4"} color={"white"} />
          <ButtonR name={"저장"} onClick={handleAddBrand} />
        </div>
      </div>
    </div>
  );
};

export default AddBrand;
