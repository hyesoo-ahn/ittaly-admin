import React, { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getDatas,
  postAddBrand,
  postCollection,
  postUploadImage,
  putUpdateData,
} from "../common/apis";
import ButtonR from "../components/ButtonR";
import InputR from "../components/InputR";
import { timeFormat2 } from "../common/utils";

interface IFile {
  file: File | null;
  url: string;
}

const MainHBanner: React.FC = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [title, setTitle] = useState<string>("");
  const [path, setPath] = useState<string>("");
  const [file, setFile] = useState<IFile>({
    file: null,
    url: "",
  });
  const fileRef = useRef<any>(null);
  const [openStatus, setOpenStatus] = useState<boolean>(true);
  const [bannerId, setBannerId] = useState<string>("");

  useEffect(() => {
    init();
  }, [params.bannerType]);

  const init = async () => {
    const { data }: any = await getDatas({
      collection: params.bannerType === "hbanner" ? "mainHorizontalBanners" : "myIttalyBanner",
    });

    if (data.length !== 0) {
      setTitle(data[0]?.title);
      setFile({
        file: null,
        url: data[0]?.imgUrl,
      });
      setPath(data[0]?.path);
      setOpenStatus(data[0]?.openStatus);
      setBannerId(data[0]?._id);
    } else {
      setTitle("");
      setFile({
        file: null,
        url: "",
      });
      setPath("");
      setOpenStatus(true);
      setBannerId("");
    }
  };

  const handleUploadClick = async (idx: number) => {
    fileRef?.current?.click();
  };

  // 이미지 첨부 핸들러
  const handleFileChange = (evt: any) => {
    const file = evt.target.files?.[0];
    const imgUrl = URL.createObjectURL(file);
    setFile({
      file: file,
      url: imgUrl,
    });
  };

  // 배너 수정
  const handleUpdatebanners = async () => {
    let url = "";
    if (file.file) {
      const formData = new FormData();
      formData.append("file", file.file as File);
      const getUrl: any = await postUploadImage(formData);
      if (getUrl.result && getUrl.status === 200) {
        url = getUrl.url;
      }
    } else {
      url = file.url;
    }
    const body = {
      collection: params.bannerType === "hbanner" ? "mainHorizontalBanners" : "myIttalyBanner",
      _id: bannerId,
      title,
      path,
      imgUrl: url,
      openStatus,
    };

    const addResult: any = await putUpdateData(body);
    if (addResult.result && addResult.status === 200) {
      alert("띠배너 수정이 완료되었습니다.");
    }
  };

  return (
    <div>
      <div className="flex align-c justify-sb pb-30">
        <div className="flex alicn-c">
          {/* <img onClick={() => navigate(-1)} className="img-close cursor mr-4" src={forward} /> */}
          <p className="page-title mt-3">
            {params.bannerType === "hbanner"
              ? "홈 띠배너 등록/수정"
              : "마이잇태리 띠배너 등록/수정"}
          </p>
        </div>

        <p className="font-desc">
          <span className="font-red mr-4">*</span>
          <span>필수입력</span>
        </p>
      </div>

      <div className="mt-2 w100p flex">
        <div className="product-field mr-20">
          <p>
            제목<span className="font-red">*</span>
          </p>
        </div>

        <div className="flex1 f-direction-column mt-10 mb-10">
          <InputR
            size="full"
            value={title}
            onChange={(e: any) => setTitle(e.target.value)}
            placeholer={"공백 포함 30글자 이내로 입력해 주세요"}
          />
          <p className="font-12 mt-10">※ 제목은 관리자 소통용으로 프론트에 노출되지 않습니다.</p>
        </div>
      </div>

      <div className="mt-2 field-list-wrapper">
        <div className="product-field mr-20">
          <p>
            이미지 등록
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
              <ButtonR
                onClick={() => fileRef?.current?.click()}
                name={`이미지 추가 ${file.url !== "" ? "1" : "0"}/1`}
              />
            </div>

            <p className="font-desc">이미지 1장, 1080px x 1080px</p>
          </div>

          {file.url && <img src={file.url} style={{ width: 278, height: "auto" }} />}

          {file.url && (
            <div className="flex mt-10 mb-16">
              <ButtonR
                name={`변경`}
                color={"white"}
                onClick={() => handleUploadClick(0)}
                styles={{ marginRight: 4 }}
              />
              <ButtonR
                name={`삭제`}
                color={"white"}
                onClick={() =>
                  setFile({
                    file: null,
                    url: "",
                  })
                }
              />
            </div>
          )}
        </div>
      </div>

      <div className="product-field-wrapper mt-2 w100p">
        <div className="product-field mr-20">
          <p>
            URL<span className="font-red">*</span>
          </p>
        </div>

        <div className="flex1">
          <InputR
            size="full"
            value={path}
            onChange={(e: any) => setPath(e.target.value)}
            placeholer={"이동할 페이지 주소를 입력해 주세요"}
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

      <div className="flex justify-fe mt-10">
        {/* <div>
          <ButtonR name={"삭제"} onClick={() => {}} color={"white"} />
        </div> */}
        <div className="flex">
          <ButtonR name={"취소"} onClick={() => navigate(-1)} styleClass={"mr-4"} color={"white"} />
          <ButtonR name={"저장"} onClick={handleUpdatebanners} />
        </div>
      </div>
    </div>
  );
};

export default MainHBanner;
