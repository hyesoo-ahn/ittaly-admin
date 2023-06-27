import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
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
import forward from "../images/Forward.png";
import sale from "../images/sale_s.png";
import new_s from "../images/new_s.png";
import Select from "react-select";
import uuid from "react-uuid";
import { timeFormat2 } from "../common/utils";

interface IFile {
  file: File | null;
  url: string;
}

const Cateogyoptions1 = [
  { value: "대분류 카테고리1", label: "대분류 카테고리1" },
  { value: "대분류 카테고리2", label: "대분류 카테고리2" },
  { value: "대분류 카테고리3", label: "대분류 카테고리3" },
];

const BannerDetail: React.FC = () => {
  const navigate = useNavigate();
  const params = useParams();
  const { bannerId } = params;
  const [headline, setHeadline] = useState<string>("");
  const [subcopy, setSubcopy] = useState<string>("");
  const [path, setPath] = useState<string>("");
  const [file, setFile] = useState<IFile>({
    file: null,
    url: "",
  });
  const [label, setLabel] = useState<string>("");
  const fileRef = useRef<any>(null);
  const [openStatus, setOpenStatus] = useState<boolean>(true);
  const [selectedOption, setSelectedOption] = useState<any>({});
  const [openingStamp, setOpeningStamp] = useState<string>("");
  const [orderSelect, setOrderSelect] = useState<any>([]);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    const getBannerDetail: any = await getDatas({
      collection: "banners",
      find: { _id: bannerId },
    });

    const ordersData: any = await getDatas({
      collection: "banners",
    });

    let tempSelect = [];
    if (ordersData.data.length !== 0) {
      for (let i = 0; i < ordersData?.data?.length + 1; i++) {
        tempSelect.push({
          value: i + 1,
          label: i + 1,
        });
      }
    } else {
      tempSelect.push({
        value: 1,
        label: 1,
      });
    }

    setOrderSelect(tempSelect);

    if (getBannerDetail.result && getBannerDetail.status === 200) {
      const data = getBannerDetail.data[0];
      console.log(data);

      setHeadline(data.headline);
      setSubcopy(data.subcopy);
      setPath(data.path);
      setLabel(data.label);
      setSelectedOption({ value: data.order.toString(), label: data.order.toString() });
      setOpeningStamp(timeFormat2(data.openingStamp));

      setFile({
        file: null,
        url: data.imgUrl,
      });
      setOpenStatus(data.openStatus);
    }
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
  const handleAddBanner = async () => {
    const startingDate = new Date(openingStamp);
    const timeStamp = startingDate.getTime();

    let imgUrl = "";
    if (file.file) {
      const formData = new FormData();
      formData.append("file", file.file as File);
      const getUrl: any = await postUploadImage(formData);
      imgUrl = getUrl.url;
    }

    const body = {
      collection: "banners",
      _id: bannerId,
      headline,
      subcopy,
      path,
      imgUrl: imgUrl,
      label,
      order: parseInt(selectedOption.value),
      openingStamp: timeStamp,
      openStatus,
    };
    const addResult: any = await putUpdateData(body);
    if (addResult.result && addResult.status === 200) {
      alert("배너 수정이 완료되었습니다.");
    }
    navigate(-1);
  };

  return (
    <div>
      <div className="flex align-c pb-30">
        <img onClick={() => navigate(-1)} className="img-close cursor mr-4" src={forward} />
        <p className="page-title mt-3">상단배너 등록</p>
      </div>

      <div className="product-field-wrapper mt-2 w100p">
        <div className="product-field mr-20">
          <p>
            헤드라인<span className="font-red">*</span>
          </p>
        </div>

        <div className="flex1">
          <InputR
            size="full"
            value={headline}
            onChange={(e: any) => setHeadline(e.target.value)}
            placeholer={"공백 포함 30글자 이내로 입력해 주세요"}
          />
        </div>
      </div>

      <div className="product-field-wrapper mt-2 w100p">
        <div className="product-field mr-20">
          <p>
            서브카피<span className="font-red">*</span>
          </p>
        </div>

        <div className="flex1">
          <InputR
            size="full"
            value={subcopy}
            onChange={(e: any) => setSubcopy(e.target.value)}
            placeholer={"공백 포함 40글자 이내로 입력해 주세요"}
          />
        </div>
      </div>

      <div className="product-field-wrapper mt-2 w100p">
        <div className="product-field mr-20">
          <p>
            URL<span className="font-red">*</span>
          </p>
        </div>

        <div className="flex1">
          <InputR size="full" value={path} onChange={(e: any) => setPath(e.target.value)} />
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
                name={`이미지 추가 ${file.url ? 1 : 0}/1`}
              />
            </div>

            <p className="font-desc">이미지 1장, 1080px x 1080px</p>
          </div>

          {file.url && <img src={file.url} style={{ width: 136, height: "auto" }} />}

          {file.url && (
            <div className="flex mt-10 mb-16">
              <ButtonR
                name={`변경`}
                color={"white"}
                onClick={() => fileRef?.current?.click()}
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

      <div className="field-list-wrapper mt-2">
        <div className="product-field mr-20">
          <p>
            강조라벨 설정<span className="font-red">*</span>
          </p>
        </div>

        <div className="mt-16 mb-16 flex" style={{ position: "relative" }}>
          <div className="flex align-center f-direction-column">
            <div className="flex align-center">
              <div onClick={() => setLabel("")} className="checkbox-c mr-4 cursor">
                {label === "" && <div className="checkbox-c-filled"></div>}
              </div>

              <p onClick={() => setLabel("")} className="mr-30 cursor">
                없음
              </p>
            </div>
          </div>
          <div className="flex align-center f-direction-column">
            <div className="flex align-center">
              <div onClick={() => setLabel("Sale")} className="checkbox-c mr-4 cursor">
                {label === "Sale" && <div className="checkbox-c-filled"></div>}
              </div>

              <p onClick={() => setLabel("Sale")} className="mr-30 cursor">
                Sale
              </p>
            </div>

            <img
              onClick={() => setLabel("Sale")}
              src={sale}
              style={{ width: 80, height: "auto" }}
              className="mt-10 cursor mr-20"
            />
          </div>
          <div className="flex align-center f-direction-column">
            <div className="flex align-center">
              <div onClick={() => setLabel("New")} className="checkbox-c mr-4 cursor">
                {label === "New" && <div className="checkbox-c-filled"></div>}
              </div>

              <p onClick={() => setLabel("New")} className="mr-30 cursor">
                New
              </p>
            </div>

            <img
              onClick={() => setLabel("New")}
              src={new_s}
              style={{ width: 80, height: "auto" }}
              className="mt-10 cursor"
            />
          </div>
        </div>
      </div>

      <div className="product-field-wrapper mt-2 w100p">
        <div className="product-field mr-20">
          <p>
            노출순서<span className="font-red">*</span>
          </p>
        </div>

        <div className="flex1">
          <Select
            classNamePrefix="react-select"
            placeholder={"노출순서"}
            defaultValue={selectedOption}
            key={uuid()}
            value={selectedOption}
            onChange={(option: any) => setSelectedOption(option)}
            options={orderSelect}
            className="react-select-container"
          />
        </div>
      </div>

      <div className="product-field-wrapper mt-2 w100p">
        <div className="product-field mr-20">
          <p>공개시작일</p>
        </div>

        <div className="flex1">
          <input
            style={{ border: "1px solid #cccccc", padding: "4px 10px", color: "#979797" }}
            type="date"
            value={openingStamp}
            onChange={(e: any) => setOpeningStamp(e.target.value)}
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

      <div className="flex justify-sb mt-10">
        <div>
          <ButtonR name={"삭제"} onClick={() => {}} color={"white"} />
        </div>
        <div className="flex">
          <ButtonR name={"취소"} onClick={() => navigate(-1)} styleClass={"mr-4"} color={"white"} />
          <ButtonR name={"저장"} onClick={handleAddBanner} />
        </div>
      </div>
    </div>
  );
};

export default BannerDetail;
