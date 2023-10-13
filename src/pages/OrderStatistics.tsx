import React, { useState } from "react";
import { ISelectFilter } from "../common/interfacs";
import ButtonR from "../components/ButtonR";

export default function OrderStatistics() {
  const [period, setPeriod] = useState<string>("일자별");

  const [filterBtnArr, setFilterBtnArr] = useState<ISelectFilter[]>([
    {
      label: "오늘",
      value: 1,
    },
    {
      label: "1주일",
      value: 7,
    },
    {
      label: "1개월",
      value: 30,
    },
    {
      label: "3개월",
      value: 60,
    },
    {
      label: "6개월",
      value: 180,
    },
  ]);
  const [selectedFilterDate, setSelectedFilterDate] = useState<ISelectFilter | null>();

  const handleClickPeroid = (filterItem: ISelectFilter) => {
    if (!selectedFilterDate || (selectedFilterDate && selectedFilterDate !== filterItem)) {
      setSelectedFilterDate(filterItem);
    }
    if (selectedFilterDate && selectedFilterDate === filterItem) {
      setSelectedFilterDate(null);
    }
  };
  return (
    <div>
      <div className="flex justify-sb align-c">
        <p className="page-title">주문 통계정보</p>
      </div>

      <div className="tab-container">
        <div
          onClick={() => setPeriod("일자별")}
          className={`${period === "일자별" ? "border-bottom-none font-bold" : "bg-gray"} tab-item`}
        >
          <p>일자별 요약</p>
        </div>
        <div
          onClick={() => setPeriod("월별")}
          className={`${
            period === "월별" ? "border-bottom-none font-bold" : "bg-gray"
          } tab-item border-right-black`}
        >
          <p>월별 요약</p>
        </div>

        <div className="border-bottom-black flex1"></div>
      </div>

      <div>
        {period === "일자별" && (
          <DailyStatistics
            filterBtnArr={filterBtnArr}
            handleClickPeroid={handleClickPeroid}
            selectedFilterDate={selectedFilterDate}
          />
        )}

        {period === "월별" && (
          <div className="mt-14">
            <MonthlyStatistics />
          </div>
        )}
      </div>
    </div>
  );
}

const DailyStatistics = ({ filterBtnArr, selectedFilterDate, handleClickPeroid }: any) => {
  return (
    <div>
      <div className="w100p filter-container flex1">
        <div className="flex align-c">
          <div className="flex1 ml-4 mr-4 flex">
            <input
              type="date"
              className="main-event-date-input mr-4"
              data-placeholder="작성일(~부터)"
              required
              aria-required="true"
            />
            <input
              type="date"
              className="main-event-date-input ml-4"
              data-placeholder="작성일(~까지)"
              required
              aria-required="true"
            />
          </div>
          <div className="ml-4 mr-4 flex align-c" style={{ flex: 2 }}>
            {filterBtnArr.map((monthfilterItem: ISelectFilter, i: number) => (
              <div className={`flex1 ${i !== 4 && "mr-4"}`} key={i}>
                <ButtonR
                  name={monthfilterItem.label}
                  styles={{
                    width: "100%",
                    border: monthfilterItem === selectedFilterDate && "2px solid black",
                    fontWeight: monthfilterItem === selectedFilterDate && "bold",
                  }}
                  color={`white`}
                  onClick={() => handleClickPeroid(monthfilterItem)}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex mt-8">
          <div className="flex1 ml-4 mr-4 flex" />
          <div className="flex1 ml-4 mr-4 flex" />
          <div className="flex1 ml-4 mr-4 flex">
            <button className="btn-add-b w50p mr-4 border-none h100p">검색</button>
            <button className="w50p bg-white ml-4 border-black h100p">초기화</button>
          </div>
        </div>
      </div>

      {/* contents */}

      <div className="list-header mt-10 pl-18 pr-18">
        <div className="w15p text-center">
          <p>일자</p>
        </div>
        <div className="w15p text-center">
          <p>주문</p>
        </div>
        <div className="w10p text-center">
          <p>취소완료</p>
        </div>
        <div className="w10p text-center">
          <p>교환신청</p>
        </div>
        <div className="w10p text-center">
          <p>교환완료</p>
        </div>
        <div className="w10p text-center">
          <p>반품신청</p>
        </div>
        <div className="w10p text-center">
          <p>반품완료</p>
        </div>
        <div className="w20p text-center">
          <p>판매수익</p>
        </div>
      </div>

      <div className={`list-content pl-18 pr-18`}>
        <div className={`flex align-c pt-10 pb-10`}>
          <div className="w15p text-center">
            <p>yyyy. mm. dd</p>
          </div>
          <div className="w15p text-center">
            <p>123</p>
          </div>
          <div className="w10p text-center">
            <p>12</p>
          </div>
          <div className="w10p text-center">
            <p>1</p>
          </div>
          <div className="w10p text-center">
            <p>2</p>
          </div>
          <div className="w10p text-center">
            <p>2</p>
          </div>
          <div className="w10p text-center">
            <p>0</p>
          </div>
          <div className="w20p text-center">
            <p>1,234,567원</p>
          </div>
        </div>

        <div className={`flex align-c pt-10 pb-10`}>
          <div className="w15p text-center">
            <p>yyyy. mm. dd</p>
          </div>
          <div className="w15p text-center">
            <p>123</p>
          </div>
          <div className="w10p text-center">
            <p>12</p>
          </div>
          <div className="w10p text-center">
            <p>1</p>
          </div>
          <div className="w10p text-center">
            <p>2</p>
          </div>
          <div className="w10p text-center">
            <p>2</p>
          </div>
          <div className="w10p text-center">
            <p>0</p>
          </div>
          <div className="w20p text-center">
            <p>1,234,567원</p>
          </div>
        </div>

        <div className={`flex align-c pt-10 pb-10`}>
          <div className="w15p text-center">
            <p>yyyy. mm. dd</p>
          </div>
          <div className="w15p text-center">
            <p>123</p>
          </div>
          <div className="w10p text-center">
            <p>12</p>
          </div>
          <div className="w10p text-center">
            <p>1</p>
          </div>
          <div className="w10p text-center">
            <p>2</p>
          </div>
          <div className="w10p text-center">
            <p>2</p>
          </div>
          <div className="w10p text-center">
            <p>0</p>
          </div>
          <div className="w20p text-center">
            <p>1,234,567원</p>
          </div>
        </div>

        <div className={`flex align-c pt-10 pb-10`}>
          <div className="w15p text-center">
            <p>yyyy. mm. dd</p>
          </div>
          <div className="w15p text-center">
            <p>123</p>
          </div>
          <div className="w10p text-center">
            <p>12</p>
          </div>
          <div className="w10p text-center">
            <p>1</p>
          </div>
          <div className="w10p text-center">
            <p>2</p>
          </div>
          <div className="w10p text-center">
            <p>2</p>
          </div>
          <div className="w10p text-center">
            <p>0</p>
          </div>
          <div className="w20p text-center">
            <p>1,234,567원</p>
          </div>
        </div>

        <div className={`flex align-c pt-10 pb-10`}>
          <div className="w15p text-center">
            <p>yyyy. mm. dd</p>
          </div>
          <div className="w15p text-center">
            <p>123</p>
          </div>
          <div className="w10p text-center">
            <p>12</p>
          </div>
          <div className="w10p text-center">
            <p>1</p>
          </div>
          <div className="w10p text-center">
            <p>2</p>
          </div>
          <div className="w10p text-center">
            <p>2</p>
          </div>
          <div className="w10p text-center">
            <p>0</p>
          </div>
          <div className="w20p text-center">
            <p>1,234,567원</p>
          </div>
        </div>
      </div>

      <div className="list-header pl-18 pr-18">
        <div className="w15p text-center">
          <p>합계</p>
        </div>
        <div className="w15p text-center">
          <p>주문</p>
        </div>
        <div className="w10p text-center">
          <p>취소완료</p>
        </div>
        <div className="w10p text-center">
          <p>교환신청</p>
        </div>
        <div className="w10p text-center">
          <p>교환완료</p>
        </div>
        <div className="w10p text-center">
          <p>반품신청</p>
        </div>
        <div className="w10p text-center">
          <p>반품완료</p>
        </div>
        <div className="w20p text-center">
          <p>판매수익</p>
        </div>
      </div>
    </div>
  );
};

const MonthlyStatistics = () => {
  return (
    <div>
      <p>최종 업데이트: 2023.05.21</p>
      <div className="mt-14 flex flex-wrap w100p order-statistics-container">
        <div className="order-statistics-left">
          <p className="font-16">월별 판매 수익 현황</p>

          <div className="list-header mt-10 pl-18 pr-18">
            <div className="w50p text-center">
              <p>월</p>
            </div>
            <div className="w50p text-center">
              <p>판매수익</p>
            </div>
          </div>

          <div className={`list-content pl-18 pr-18`}>
            <div className={`flex align-c pt-10 pb-10`}>
              <div className="w50p text-center">
                <p>1월</p>
              </div>
              <div className="w50p text-center">
                <p>1,234,567원</p>
              </div>
            </div>

            <div className={`flex align-c pt-10 pb-10`}>
              <div className="w50p text-center">
                <p>2월</p>
              </div>
              <div className="w50p text-center">
                <p>1,234,567원</p>
              </div>
            </div>

            <div className={`flex align-c pt-10 pb-10`}>
              <div className="w50p text-center">
                <p>3월</p>
              </div>
              <div className="w50p text-center">
                <p>1,234,567원</p>
              </div>
            </div>
          </div>
        </div>
        <div className="order-statistics-right">
          <p className="font-16">지난 30일간 상품 판매 순위 TOP 12</p>

          <div className="list-header mt-10 pl-18 pr-18">
            <div className="w10p text-left">{/* <p>상품명</p> */}</div>
            <div className="w70p text-left">
              <p>상품명</p>
            </div>
            <div className="w20p text-center">
              <p>판매수익</p>
            </div>
          </div>

          <div className={`list-content pl-18 pr-18`}>
            <div className={`flex align-c pt-10 pb-10`}>
              <div className="w10p text-center">
                <p>1</p>
              </div>
              <div className="w70p text-left">
                <p>Chanel 르리프트 세럼 30ml</p>
              </div>
              <div className="w20p text-center">
                <p>1,234,567원</p>
              </div>
            </div>
            <div className={`flex align-c pt-10 pb-10`}>
              <div className="w10p text-center">
                <p>2</p>
              </div>
              <div className="w70p text-left">
                <p>Chanel 르리프트 세럼 30ml</p>
              </div>
              <div className="w20p text-center">
                <p>1,234,567원</p>
              </div>
            </div>{" "}
            <div className={`flex align-c pt-10 pb-10`}>
              <div className="w10p text-center">
                <p>3</p>
              </div>
              <div className="w70p text-left">
                <p>Chanel 르리프트 세럼 30ml</p>
              </div>
              <div className="w20p text-center">
                <p>1,234,567원</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
