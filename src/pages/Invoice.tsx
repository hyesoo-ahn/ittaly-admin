import React, { ChangeEventHandler, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { getDatas, getUsers } from "../common/apis";
import { CSV_INVOICE_TEMPLATE, currency, timeFormat1, timeFormat2 } from "../common/utils";
import ButtonR from "../components/ButtonR";
import InputR from "../components/InputR";
import SelectBox from "../components/SelectBox";
import Modal from "../components/Modal";
import close from "../images/close.png";
import CSVSelector from "../components/CSVSelector";
import { CSVLink } from "react-csv";

const Cateogyoptions1 = [
  { value: "대분류 카테고리1", label: "대분류 카테고리1" },
  { value: "대분류 카테고리2", label: "대분류 카테고리2" },
  { value: "대분류 카테고리3", label: "대분류 카테고리3" },
];

export default function Invoice(): JSX.Element {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<any>("");
  const [exportItem, setExportItem] = useState<boolean>(false);
  //   csv popup
  const [csvPopup, setCsvPopup] = useState<boolean>(false);
  const [jsonData, setJsonData] = useState<any>([]);
  const csvRef = useRef<HTMLInputElement>(null);

  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    const { data }: any = await getUsers({
      // sort: { sort: -1 },
    });

    setUsers(data);
  };

  useEffect(() => {
    console.log("JSON", jsonData);
  }, [jsonData]);

  return (
    <div>
      {csvPopup && (
        <Modal innerStyle={{ minHeight: 0 }}>
          <div className="padding-24">
            <div className="flex justify-sb">
              <h2 className="margin-0 mb-20">옵션 엑셀 등록하기</h2>

              <div>
                <img
                  onClick={() => {
                    // handleInitProductOption();
                    setCsvPopup(false);
                  }}
                  src={close}
                  className="img-close cursor"
                  alt="close"
                />
              </div>
            </div>

            <div className="text-center">
              <CSVSelector
                csvType="invoice"
                ref={csvRef}
                onChange={(_data: any) => setJsonData(_data)}
              />

              <ButtonR
                name={"CSV 업로드"}
                styles={{ backgroundColor: "#f1f1f1", paddingLeft: 25, paddingRight: 25 }}
                color={"white"}
                onClick={() => csvRef?.current?.click()}
              />
              <div className="mt-20 mb-20">
                <p>CSV 양식을 내려받아 옵션 입력 후 업로드해주세요.</p>
                <p className="mt-4">
                  옵션 개수 및 양식과 다르게 입력된 경우 옵션이 등록되지 않습니다.
                </p>
              </div>

              <CSVLink
                data={CSV_INVOICE_TEMPLATE}
                headers={[
                  { label: "주문번호", key: "orderNum" },
                  { label: "상품명", key: "productName" },
                  { label: "배송유형", key: "deleveryType" },
                  { label: "택배사명", key: "courierCompany" },
                  { label: "송장번호", key: "invoice" },
                ]}
                // confirm 창에서 '확인'을 눌렀을 때만 csv 파일 다운로드
                onClick={() => {
                  if (window.confirm("csv파일을 다운로드 받겠습니까?")) {
                    return true;
                  } else {
                    return false;
                  }
                }}
                filename={`송장번호_샘플_시트`}
              >
                <p>CSV 양식 내려받기</p>
              </CSVLink>
            </div>

            {jsonData.length !== 0 && (
              <div className="list-header mt-30 pl-18 pr-18">
                <div className="w10p">
                  <p>주문번호</p>
                </div>

                <div className="w45p">
                  <p>상품명</p>
                </div>

                <div className="w10p">
                  <p>배송유형</p>
                </div>

                <div className="w10p">
                  <p>택배사명</p>
                </div>

                <div className="w15p">
                  <p>송장번호</p>
                </div>
                <div className="w10p">
                  <p>결과</p>
                </div>
              </div>
            )}

            {jsonData?.length !== 0 &&
              jsonData?.map((el: any, i: number) => (
                <div key={i}>
                  {i !== 0 && (
                    <div key={i} className="list-content pl-18 pr-18">
                      <div className="flex align-c mt-8 mb-8">
                        <div className="w10p">
                          <p className={`${!el.status && "font-red"}`}>
                            {jsonData[i]?.[Object.keys(jsonData[0])[0]]}
                          </p>
                        </div>

                        <div className="w45p">
                          <p className={`${!el.status && "font-red"}`}>
                            {jsonData[i]?.[Object.keys(jsonData[0])[1]]}
                          </p>
                        </div>

                        <div className="w10p">
                          <p className={`${!el.status && "font-red"}`}>
                            {jsonData[i]?.[Object.keys(jsonData[0])[2]]}
                          </p>
                        </div>

                        <div className="w10p">
                          <p className={`${!el.status && "font-red"}`}>
                            {jsonData[i]?.[Object.keys(jsonData[0])[3]]}
                          </p>
                        </div>

                        <div className="w15p">
                          <p className={`${!el.status && "font-red"}`}>
                            {jsonData[i]?.[Object.keys(jsonData[0])[4]]}
                          </p>
                        </div>
                        <div className="w10p">
                          {el.status && <p>성공</p>}
                          {!el.status && <p className="font-red">실패</p>}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}

            <div className="flex justify-fe">
              <ButtonR
                name={"취소"}
                onClick={() => {
                  //   handleInitProductOption();
                  setCsvPopup(false);
                }}
                styleClass="mr-10"
                color={"white"}
              />
              <ButtonR name={"등록하기"} onClick={() => {}} styleClass="mr-12" />
            </div>
          </div>
        </Modal>
      )}
      {exportItem && (
        <Modal
          innerStyle={{
            display: "flex",
            flexDirection: "column",
            width: "30%",
            minHeight: "20vh",
            padding: 30,
          }}
        >
          <div className="flex justify-sb align-c relative">
            <h2 className="margin-0">주문목록 내보내기</h2>
            <img
              onClick={() => setExportItem(false)}
              src={close}
              style={{ width: 24, top: -10, right: -10 }}
              className="cursor absolute"
            />
          </div>

          <div className="mt-20">
            <p className="line-height-21">
              방송통신위원회가 고시한 '개인정보의 기술적/관리적 보호조치 기준'에 근거해 개인 정보를
              PC에 저장할 때는 의무적으로 암호화를 해야합니다.
            </p>
            <p className="line-height-21">
              이에 따라 주문목록을 엑셀로 다운로드할 경우, 개인정보를 안전하게 보호하기 위해 설정된
              암호를 입력 후 이용해 주세요.
            </p>
            <p className="mt-10">
              다운로드된 엑셀 파일은 "
              <span className="font-bold">어드민 로그인 시 사용한 비밀번호</span>"로 자동 암호화
              처리됩니다.
            </p>
          </div>

          <div className="flex justify-fe mt-20">
            <ButtonR
              color={"white"}
              name="취소"
              onClick={() => setExportItem(false)}
              styleClass="mr-4"
            />
            <ButtonR name="다운로드" onClick={() => {}} />
          </div>
        </Modal>
      )}
      <div className="flex justify-sb align-c">
        <p className="page-title">출고운송장 입력</p>
      </div>

      <div className="w100p filter-container" style={{ flex: 1 }}>
        <div className="flex">
          <div className="flex1 ml-4 mr-4 flex">
            <input
              type="date"
              className="main-event-date-input mr-4"
              data-placeholder="주문일(~부터)"
              required
              aria-required="true"
            />
            <input
              type="date"
              className="main-event-date-input ml-4"
              data-placeholder="주문일(~까지)"
              required
              aria-required="true"
            />

            {/* <input style={{ width: "100%", marginRight: 4 }} type="date" /> */}
            {/* <input style={{ width: "100%", marginLeft: 4 }} type="date" /> */}
          </div>
          <div style={{ flex: 1, margin: "0 4px" }}>
            <InputR size="full" placeholer="주문번호" innerStyle={{ margin: 0 }} />
          </div>
          <div style={{ flex: 1, margin: "0 4px" }}>
            <InputR size="full" placeholer="상품명" innerStyle={{ margin: 0 }} />
          </div>
        </div>

        <div style={{ display: "flex", marginTop: 8 }}>
          <div className="flex1 ml-4 mr-4 w100p flex" style={{ height: 32 }}>
            <InputR placeholer="상품코드" size="full" innerStyle={{ marginRight: 0 }} />
          </div>
          <div className="flex1 ml-4 mr-4" style={{ height: 32 }}>
            <InputR size="full" placeholer="주문자 이름/ID" innerStyle={{ margin: 0 }} />
          </div>
          <div className="flex flex1 ml-4 mr-4" style={{ height: 32 }}>
            <SelectBox
              containerStyles={{ width: "100%" }}
              value={selected}
              onChange={(e: any) => setSelected(e)}
              options={Cateogyoptions1}
              noOptionsMessage={"상태가 없습니다."}
              placeholder="배송 유형"
            />
          </div>
        </div>

        <div style={{ display: "flex", marginTop: 8 }}>
          <div className="flex1 ml-4 mr-4 w100p flex" style={{ height: 32 }}></div>
          <div className="flex1 ml-4 mr-4" style={{ height: 32 }}></div>
          <div className="flex flex1 ml-4 mr-4" style={{ height: 32 }}>
            <button className="btn-add-b w50p mr-4 border-none" style={{ height: "100%" }}>
              검색
            </button>
            <button className="w50p bg-white ml-4 border-black" style={{ height: "100%" }}>
              초기화
            </button>
          </div>
        </div>
      </div>

      <div className="mt-34 flex justify-sb align-c">
        <p>총 0건</p>

        <div className="flex">
          <ButtonR
            name={"송장 엑셀 등록하기"}
            color="white"
            styleClass="mr-4"
            onClick={() => setCsvPopup(true)}
          />
          <ButtonR name={"전체 목록 내보내기"} onClick={() => {}} />
        </div>
      </div>

      <div className="list-header mt-10 pl-18 pr-18">
        <div className="w5p">
          <input type="checkbox" />
        </div>

        <div className="w5p text-left">
          <p>주문상태</p>
        </div>

        <div className="w10p text-center">
          <p>주문번호</p>
        </div>
        <div className="w15p text-center">
          <p>상품명</p>
        </div>

        <div className="w10p text-center">
          <p>주문자</p>
        </div>
        <div className="w10p text-center">
          <p>배송유형</p>
        </div>
        <div className="w25p text-center">
          <p>배송정보</p>
        </div>

        <div className="w10p text-center">
          <p>주문일시</p>
        </div>

        <div className="w10p text-center">
          <p>기능</p>
        </div>
      </div>

      <div className={`list-content pl-18 pr-18`}>
        {users?.map((user: any, i: number) => (
          <div key={i} className={`flex align-c mt-8 mb-8`}>
            <div className="w5p">
              <input type="checkbox" />
            </div>
            <div className="w5p text-left">
              <p>배송준비</p>
            </div>
            <div className="w10p text-center" onClick={() => navigate("/order/payments/1234")}>
              <p className="font-blue text-underline cursor">123456789</p>
            </div>
            <div className="w15p text-center">
              <p className="text-line">
                {user.email}
                {user.email}
                {user.email}
                {user.email}
                {user.email}
                {user.email}
              </p>
            </div>

            <div className="w10p text-center">
              <p>김모노(aff77h2r)</p>
              <p>Gold, 총 12건</p>
            </div>
            <div className="w10p text-center">
              <p>국내배송</p>
            </div>
            <div className="w25p text-center">
              <div className="flex justify-c">
                <SelectBox
                  placeholder={"택배사선택"}
                  containerStyles={{ width: 120, marginRight: 4 }}
                  value={null}
                  onChange={(e: any) => {}}
                  options={[
                    { value: "CJ", label: "CJ" },
                    { value: "GSMNtoN", label: "GSMNtoN" },
                  ]}
                  noOptionsMessage={"상품이 없습니다."}
                />
                <InputR placeholer="숫자만 입력" size="small" styleClass="mr-4" />
                <ButtonR color="white" name={"적용"} onClick={() => {}} />
              </div>
            </div>

            <div className="w10p text-center">
              <p className="text-line">
                2023.01.01
                <br /> 11:11:22
              </p>
            </div>

            <div className="w10p text-center">
              <div className="flex align-c justify-c">
                <ButtonR name={"주문취소"} onClick={() => {}} color="white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-20 flex justify-sb align-c flex-wrap">
        <div className="flex">
          <ButtonR
            name="선택 목록 내보내기"
            color="white"
            onClick={() => setExportItem(true)}
            styles={{ marginRight: 4 }}
          />
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
