import React, { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import up_g from "../images/up_g.png";
import down_g from "../images/down_g.png";
import up_b from "../images/up_b.png";
import down_b from "../images/down_b.png";
import Select from "react-select";
import { currency, moveValue, timeFormat2 } from "../common/utils";

interface IFile {
  file: File | null;
  url: string;
}

const Cateogyoptions1 = [
  { value: "대분류 카테고리1", label: "대분류 카테고리1" },
  { value: "대분류 카테고리2", label: "대분류 카테고리2" },
  { value: "대분류 카테고리3", label: "대분류 카테고리3" },
];

const Deposit: React.FC = () => {
  const navigate = useNavigate();
  const [rewardDateType, setRewardDateType] = useState<string>("followingDay");
  const [expireAfter, setExpireAfter] = useState<string>("");
  const [referralCode, setReferralCode] = useState<boolean>(true);
  const [referralCodeDetail, setReferralCodeDetail] = useState<any>({
    // 신규가입자
    referee: "",
    // 추천한 사람
    referrer: "",
  });
  const [referralCodeExpireAfter, setReferralCodeExpireAfter] = useState<string>("");

  const [dates, setDates] = useState<{
    startingDate: string;
    endingDate: string;
  }>({
    startingDate: "",
    endingDate: "",
  });

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    const { data }: any = await getDatas({
      collection: "rewards",
    });
    setRewardDateType(data[0]?.rewardDateType);
    setExpireAfter(data[0]?.expireAfter);
    setReferralCode(data[0]?.referralCode);
    setReferralCodeDetail({
      referee: currency(data[0]?.referee),
      referrer: currency(data[0]?.referrer),
    });
    setDates({
      startingDate: data[0]?.referralCode && data[0]?.term[0] ? timeFormat2(data[0]?.term[0]) : "",
      endingDate: data[0]?.referralCode && data[0]?.term[1] ? timeFormat2(data[0]?.term[1]) : "",
    });
    setReferralCodeExpireAfter(data[0]?.referralCodeExpireAfter);
  };

  const onChangePrice = (type: string, value: string) => {
    let n: string = value.replace(/,/gi, "");
    if (n !== "") {
      let currencyPrice = currency(parseInt(n));

      setReferralCodeDetail((prev: any) => {
        return {
          ...prev,
          [type]: currencyPrice,
        };
      });
    } else {
      setReferralCodeDetail((prev: any) => {
        return {
          ...prev,
          [type]: "",
        };
      });
    }
  };

  const handleSave = async () => {
    const startingDate = new Date(dates.startingDate);
    const endingDate = new Date(dates.endingDate);
    const startingDateStamp = startingDate.getTime();
    const endingDateStamp = endingDate.getTime();

    let updateForm: any = {
      rewardDateType,
      expireAfter: parseInt(expireAfter),
      referralCode,
      expire: false,
      referee: 0,
      referrer: 0,
      term: [0, 0],
      referralCodeExpireAfter: 0,
    };

    if (referralCode) {
      updateForm = {
        ...updateForm,
        referee: parseInt(referralCodeDetail.referee.replace(/,/gi, "")),
        referrer: parseInt(referralCodeDetail.referrer.replace(/,/gi, "")),
        term: [startingDateStamp, endingDateStamp],
        referralCodeExpireAfter: parseInt(referralCodeExpireAfter),
      };
    }

    const result: any = await putUpdateData({
      collection: "rewards",
      _id: "64c0c4e2ea26a037ec37cd2a",
      ...updateForm,
    });

    if (result.result && result.status === 200) {
      alert("수정되었습니다.");
      init();
    }
  };

  const handleKeyDown = (event: any, type: string) => {
    if (event.key === "Backspace") {
      if (type === "expireAfter" && expireAfter.length === 1) {
        setExpireAfter("");
      }

      if (type === "expireAfter" && referralCodeExpireAfter.length === 1) {
        setReferralCodeExpireAfter("");
      }
    }
  };

  const handleKeyDown2 = (event: any, type: string) => {
    let n: string = referralCodeDetail[type].replace(/,/gi, "");
    let parsedN: any = parseInt(n);

    if (isNaN(parsedN)) {
      setReferralCodeDetail((prev: any) => {
        return {
          ...prev,
          [type]: "",
        };
      });
    }
  };

  return (
    <div>
      <div className="flex align-c justify-sb pb-30">
        <div className="flex alicn-c">
          <img onClick={() => navigate(-1)} className="img-close cursor mr-4" src={forward} />
          <p className="page-title mt-3">적립금 관리</p>
        </div>

        <p className="font-desc">
          <span className="font-red mr-4">*</span>
          <span>필수입력</span>
        </p>
      </div>

      <p className="font-category">기본 설정</p>
      <div className="product-field-wrapper mt-13 w100p">
        <div className="product-field mr-20">
          <p>
            적립금 지급 시점<span className="font-red">*</span>
          </p>
        </div>

        <p className="font-bold mr-20">배송완료 후</p>
        <div onClick={() => setRewardDateType("followingDay")} className="checkbox-c mr-4 cursor">
          {rewardDateType === "followingDay" && <div className="checkbox-c-filled"></div>}
        </div>

        <p onClick={() => setRewardDateType("followingDay")} className="mr-30 cursor">
          익일
        </p>

        <div onClick={() => setRewardDateType("3days")} className="checkbox-c mr-4 cursor">
          {rewardDateType === "3days" && <div className="checkbox-c-filled" />}
        </div>

        <p onClick={() => setRewardDateType("3days")} className="mr-30 cursor">
          3일
        </p>

        <div onClick={() => setRewardDateType("7days")} className="checkbox-c mr-4 cursor">
          {rewardDateType === "7days" && <div className="checkbox-c-filled" />}
        </div>

        <p onClick={() => setRewardDateType("7days")} className="mr-30 cursor">
          7일
        </p>
      </div>

      <div className="field-list-wrapper mt-2 w100p">
        <div className="product-field mr-20">
          <p>
            사용조건<span className="font-red">*</span>
          </p>
        </div>

        <div style={{ flex: 1 }} className="mt-16 mb-16">
          <div className="flex">
            <p>
              <span className="font-bold mr-8">유효기간</span>
              <span className="font-12">*유효기간이 없으면 공란</span>
            </p>
          </div>

          <div className="mt-10 flex align-c">
            <p className="mr-8">지급 후</p>
            <InputR
              size="small"
              type={"number"}
              value={expireAfter}
              onKeyDown={(e: any) => handleKeyDown(e, "expireAfter")}
              onChange={(e: any) => {
                if (e.target.value > 0) {
                  setExpireAfter(e.target.value);
                }
              }}
            />
            <p className="mr-4">일 후 자동소멸</p>
          </div>
        </div>
      </div>

      <p className="font-category mt-40">개별 지급</p>
      <ButtonR name={"개별 지급하러 가기"} styleClass="mt-13" color="white" onClick={() => {}} />

      <p className="font-category mt-40">자동 지급</p>

      <div className="mt-13 field-list-wrapper">
        <div className="product-field mr-20">
          <p>추천인 코드 입력했을 때 지급</p>
        </div>

        <div className="flex1 pt-15 pb-15">
          <div className="flex align-c">
            <div onClick={() => setReferralCode(true)} className="checkbox-c mr-4 cursor">
              {referralCode && <div className="checkbox-c-filled"></div>}
            </div>

            <p onClick={() => setReferralCode(true)} className="mr-30 cursor">
              사용
            </p>

            <div onClick={() => setReferralCode(false)} className="checkbox-c mr-4 cursor">
              {!referralCode && <div className="checkbox-c-filled" />}
            </div>

            <p onClick={() => setReferralCode(false)} className="mr-30 cursor">
              사용안함
            </p>
          </div>

          {referralCode && (
            <div className="mt-20 flex align-c">
              <div className="flex1">
                <p className="font-bold">피추천인(신규 고객)</p>
                <div className="flex align-c mt-6">
                  <InputR
                    onKeyDown={(e: any) => handleKeyDown2(e, "referee")}
                    value={referralCodeDetail.referee}
                    onChange={(e: any) => onChangePrice("referee", e.target.value)}
                  />
                  <p>원</p>
                </div>
              </div>
              <div className="flex1">
                <p className="font-bold">추천인(기존 고객)</p>
                <div className="flex align-c mt-6">
                  <InputR
                    onKeyDown={(e: any) => handleKeyDown2(e, "referrer")}
                    value={referralCodeDetail.referrer}
                    onChange={(e: any) => onChangePrice("referrer", e.target.value)}
                  />
                  <p>원</p>
                </div>
              </div>
            </div>
          )}

          {referralCode && (
            <div className="mt-20">
              <p className="font-bold">이벤트 기간</p>

              <div className="flex1 flex align-c mt-10">
                <input
                  style={{ border: "1px solid #cccccc", padding: "4px 10px", color: "#979797" }}
                  type="date"
                  value={dates.startingDate}
                  onChange={(e: any) => {
                    setDates((prev) => {
                      return {
                        ...prev,
                        startingDate: e.target.value,
                      };
                    });
                  }}
                />
                <p className="mr-8 ml-8">-</p>
                <input
                  style={{ border: "1px solid #cccccc", padding: "4px 10px", color: "#979797" }}
                  type="date"
                  value={dates.endingDate}
                  onChange={(e: any) => {
                    setDates((prev) => {
                      return {
                        ...prev,
                        endingDate: e.target.value,
                      };
                    });
                  }}
                />
              </div>
              <p className="font-12 mt-10">
                * 공개기간을 지정하지 않을 경우 이벤트 기간이 무기한으로 설정됩니다.
              </p>
            </div>
          )}

          {referralCode && (
            <div style={{ flex: 1 }} className="mt-30">
              <div className="flex">
                <p>
                  <span className="font-bold mr-8">유효기간</span>
                  <span className="font-12">*유효기간이 없으면 공란</span>
                </p>
              </div>

              <div className="mt-10 flex align-c">
                <p className="mr-8">지급 후</p>
                <InputR
                  type={"number"}
                  onKeyDown={(e: any) => handleKeyDown(e, "expireAfter")}
                  onChange={(e: any) => setReferralCodeExpireAfter(e.target.value)}
                  value={referralCodeExpireAfter}
                  size="small"
                />
                <p className="mr-4">일 후 자동소멸</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-fe mt-10">
        <div className="flex">
          <ButtonR name={"취소"} onClick={() => navigate(-1)} styleClass={"mr-4"} color={"white"} />
          <ButtonR name={"저장"} onClick={handleSave} />
        </div>
      </div>
    </div>
  );
};

export default Deposit;
