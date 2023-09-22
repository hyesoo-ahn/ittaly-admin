import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import InputR from "../components/InputR";
import SelectBox from "../components/SelectBox";
import ButtonR from "../components/ButtonR";
import { IMainContext } from "../interface/interface";
import { MainContext } from "../common/context";
import { history } from "../hooks/history";

const Cateogyoptions1 = [
  { value: "전체", label: "전체" },
  { value: "취소완료", label: "취소완료" },
];

export default function Cancellation() {
  const navigate = useNavigate();
  const context = useContext<IMainContext>(MainContext);
  const { push } = context;
  const location = useLocation();
  const [selected, setSelected] = useState<any>("");
  const [selectArr, setSelectArr] = useState<any>([
    {
      label: "tab1",
      value: "취소",
    },
    {
      label: "tab2",
      value: "교환",
    },
    {
      label: "tab3",
      value: "반품",
    },
  ]);
  const [selectedTab, setSelectedTab] = useState<string>("tab1");

  useEffect(() => {
    const { pathname } = location;
    const tab = pathname.split("/");

    setSelectedTab(tab[3]);
    if (tab[3]) {
      setSelectedTab(tab[3]);
    } else {
      setSelectedTab("tab1");
    }
  });

  useEffect(() => {
    const stack = context.myHistory;

    const listenBackEvent = (length: number): any => {
      if (stack.length === 0) return navigate(-1);
      if (stack.length !== 0 && stack[length - 1]?.split("/")[2] === "cancellation") {
        return listenBackEvent(length - 1);
      } else {
        return navigate(stack[length - 1], { replace: true });
      }
    };

    const unlistenHistoryEvent = history.listen(({ action }) => {
      if (action === "POP") {
        listenBackEvent(stack.length);
      }
    });
    return unlistenHistoryEvent;
  }, [location]);

  return (
    <div>
      <div className="flex justify-sb align-c">
        <p className="page-title">취소/교환/반품</p>
      </div>

      {/* tab */}
      <div className="tab-container">
        {selectArr.map((tabItem: any, i: number) => (
          <div
            key={i}
            onClick={() => {
              setSelectedTab(tabItem.label);
              navigate(`/order/cancellation/${tabItem.label}`);
            }}
            className={`tab-item 
        ${i === 2 && "border-right-black"}
        ${selectedTab === tabItem.label ? "border-bottom-none font-bold" : "bg-gray"}`}
          >
            <p className="font-14">{tabItem.value}</p>
          </div>
        ))}

        <div className="border-bottom-black flex1"></div>
      </div>

      <div className="w100p filter-container flex1">
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
          </div>
          <div className="flex1 ml-4 mr-4">
            <InputR size="full" placeholer="주문번호" innerStyle={{ margin: 0 }} />
          </div>
          <div className="flex1 ml-4 mr-4">
            <InputR size="full" placeholer="상품명" innerStyle={{ margin: 0 }} />
          </div>
        </div>

        <div className="flex mt-8">
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
              placeholder="주문상태"
            />
          </div>
        </div>

        <div style={{ display: "flex", marginTop: 8 }}>
          <div className="flex1 ml-4 mr-4 w100p flex" style={{ height: 32 }}>
            <SelectBox
              containerStyles={{ width: "100%" }}
              value={selected}
              onChange={(e: any) => setSelected(e)}
              options={Cateogyoptions1}
              noOptionsMessage={"상태가 없습니다."}
              placeholder="CS처리상태"
            />
          </div>
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

      {/* 컨텐츠 */}
      <div className="mt-30 mb-30">
        {selectedTab === "tab1" && <Tab1 />}
        {selectedTab === "tab2" && <Tab2 />}
        {selectedTab === "tab3" && <Tab3 />}
      </div>
    </div>
  );
}

const Tab1 = () => {
  return (
    <div>
      <div className="mt-34 flex justify-sb align-c">
        <p>총 0건</p>

        <div className="flex">
          <ButtonR name={"전체 목록 내보내기"} onClick={() => {}} />
        </div>
      </div>

      <div className="list-header mt-10 pl-18 pr-18">
        <div className="w2p">
          <input type="checkbox" />
        </div>

        <div className="w12-1p text-center">
          <p>CS요청구분</p>
        </div>

        <div className="w12-1p text-center">
          <p>CS상태</p>
        </div>
        <div className="w12-1p text-center">
          <p>CS접수번호</p>
        </div>

        <div className="w12-1p text-center">
          <p>CS접수경로</p>
        </div>
        <div className="w10-3p text-center">
          <p>접수사유</p>
        </div>
        <div className="w12-1p text-center">
          <p>주문자</p>
        </div>

        <div className="w12-1p text-center">
          <p>주문번호</p>
        </div>
        <div className="w12-1p text-center">
          <p>주문상태</p>
        </div>

        <div className="w12-1p text-center">
          <p>결제수단</p>
        </div>
        <div className="w12-1p text-center">
          <p>접수일</p>
        </div>
        <div className="w12-1p text-center">
          <p>처리완료일</p>
        </div>
      </div>

      <div className={`list-content pl-18 pr-18`}>
        <div className={`flex align-c mt-8 mb-8`}>
          <div className="w2p">
            <input type="checkbox" />
          </div>
          <div className="w12-1p text-center">
            <p>취소</p>
          </div>
          <div className="w12-1p text-center">
            <p>완료</p>
          </div>
          <div className="w12-1p text-center" onClick={() => {}}>
            <p className="font-blue text-underline cursor">cs12345678</p>
          </div>
          <div className="w12-1p text-center">
            <p className="text-line">마이잇태리</p>
          </div>

          <div className="w10-3p text-center">
            <p>[고객취소] 단순변심</p>
          </div>
          <div className="w12-1p text-center">
            <p>김모노(aft1212s)</p>
          </div>
          <div className="w12-1p text-center">
            <p className="font-blue text-underline text-line pl-6 pr-6">
              ord123423451154451154511545115
            </p>
          </div>

          <div className="w12-1p text-center">
            <p className="text-line">취소완료</p>
          </div>

          <div className="w12-1p text-center">
            <p className="text-line">네이버페이</p>
          </div>
          <div className="w12-1p text-center">
            <p className="text-line">2023. 01. 01</p>
          </div>
          <div className="w12-1p text-center">
            <p className="text-line">2023. 01. 01</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Tab2 = () => {
  return (
    <div>
      <div className="mt-34 flex justify-sb align-c">
        <p>총 0건</p>

        <div className="flex">
          <ButtonR name={"전체 목록 내보내기"} onClick={() => {}} />
        </div>
      </div>

      <div className="list-header mt-10 pl-18 pr-18">
        <div className="w2p">
          <input type="checkbox" />
        </div>

        <div className="w12-1p text-center">
          <p>CS요청구분</p>
        </div>

        <div className="w12-1p text-center">
          <p>CS상태</p>
        </div>
        <div className="w12-1p text-center">
          <p>CS접수번호</p>
        </div>

        <div className="w12-1p text-center">
          <p>CS접수경로</p>
        </div>
        <div className="w10-3p text-center">
          <p>접수사유</p>
        </div>
        <div className="w12-1p text-center">
          <p>주문자</p>
        </div>

        <div className="w12-1p text-center">
          <p>주문번호</p>
        </div>
        <div className="w12-1p text-center">
          <p>주문상태</p>
        </div>

        <div className="w12-1p text-center">
          <p>결제수단</p>
        </div>
        <div className="w12-1p text-center">
          <p>접수일</p>
        </div>
        <div className="w12-1p text-center">
          <p>처리완료일</p>
        </div>
      </div>

      <div className={`list-content pl-18 pr-18`}>
        <div className={`flex align-c mt-8 mb-8`}>
          <div className="w2p">
            <input type="checkbox" />
          </div>
          <div className="w12-1p text-center">
            <p>취소</p>
          </div>
          <div className="w12-1p text-center">
            <p>완료</p>
          </div>
          <div className="w12-1p text-center" onClick={() => {}}>
            <p className="font-blue text-underline cursor">cs12345678</p>
          </div>
          <div className="w12-1p text-center">
            <p className="text-line">마이잇태리</p>
          </div>

          <div className="w10-3p text-center">
            <p>[고객취소] 단순변심</p>
          </div>
          <div className="w12-1p text-center">
            <p>김모노(aft1212s)</p>
          </div>
          <div className="w12-1p text-center">
            <p className="font-blue text-underline text-line pl-6 pr-6">
              ord123423451154451154511545115
            </p>
          </div>

          <div className="w12-1p text-center">
            <p className="text-line">취소완료</p>
          </div>

          <div className="w12-1p text-center">
            <p className="text-line">네이버페이</p>
          </div>
          <div className="w12-1p text-center">
            <p className="text-line">2023. 01. 01</p>
          </div>
          <div className="w12-1p text-center">
            <p className="text-line">2023. 01. 01</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Tab3 = () => {
  return (
    <div>
      <div className="mt-34 flex justify-sb align-c">
        <p>총 0건</p>

        <div className="flex">
          <ButtonR name={"전체 목록 내보내기"} onClick={() => {}} />
        </div>
      </div>

      <div className="list-header mt-10 pl-18 pr-18">
        <div className="w2p">
          <input type="checkbox" />
        </div>

        <div className="w12-1p text-center">
          <p>CS요청구분</p>
        </div>

        <div className="w12-1p text-center">
          <p>CS상태</p>
        </div>
        <div className="w12-1p text-center">
          <p>CS접수번호</p>
        </div>

        <div className="w12-1p text-center">
          <p>CS접수경로</p>
        </div>
        <div className="w10-3p text-center">
          <p>접수사유</p>
        </div>
        <div className="w12-1p text-center">
          <p>주문자</p>
        </div>

        <div className="w12-1p text-center">
          <p>주문번호</p>
        </div>
        <div className="w12-1p text-center">
          <p>주문상태</p>
        </div>

        <div className="w12-1p text-center">
          <p>결제수단</p>
        </div>
        <div className="w12-1p text-center">
          <p>접수일</p>
        </div>
        <div className="w12-1p text-center">
          <p>처리완료일</p>
        </div>
      </div>

      <div className={`list-content pl-18 pr-18`}>
        <div className={`flex align-c mt-8 mb-8`}>
          <div className="w2p">
            <input type="checkbox" />
          </div>
          <div className="w12-1p text-center">
            <p>취소</p>
          </div>
          <div className="w12-1p text-center">
            <p>완료</p>
          </div>
          <div className="w12-1p text-center" onClick={() => {}}>
            <p className="font-blue text-underline cursor">cs12345678</p>
          </div>
          <div className="w12-1p text-center">
            <p className="text-line">마이잇태리</p>
          </div>

          <div className="w10-3p text-center">
            <p>[고객취소] 단순변심</p>
          </div>
          <div className="w12-1p text-center">
            <p>김모노(aft1212s)</p>
          </div>
          <div className="w12-1p text-center">
            <p className="font-blue text-underline text-line pl-6 pr-6">
              ord123423451154451154511545115
            </p>
          </div>

          <div className="w12-1p text-center">
            <p className="text-line">취소완료</p>
          </div>

          <div className="w12-1p text-center">
            <p className="text-line">네이버페이</p>
          </div>
          <div className="w12-1p text-center">
            <p className="text-line">2023. 01. 01</p>
          </div>
          <div className="w12-1p text-center">
            <p className="text-line">2023. 01. 01</p>
          </div>
        </div>
      </div>
    </div>
  );
};
