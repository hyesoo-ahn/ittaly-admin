import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Select from "react-select";
import { getDatas } from "../common/apis";
import { currency, timeFormat1 } from "../common/utils";
import ButtonR from "../components/ButtonR";
import InputR from "../components/InputR";
import SelectBox from "../components/SelectBox";
import { ISelectFilter } from "../common/interfacs";

const Cateogyoptions1 = [
  { value: "대분류 카테고리1", label: "대분류 카테고리1" },
  { value: "대분류 카테고리2", label: "대분류 카테고리2" },
  { value: "대분류 카테고리3", label: "대분류 카테고리3" },
];

export default function UserStatistics(): JSX.Element {
  const location = useLocation();
  const navigate = useNavigate();
  const [selected, setSelected] = useState<any>("");
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

  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    const productData: any = await getDatas({
      collection: "events",
      sort: { sort: -1 },
    });
    setEvents(productData.data);
  };

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
        <p className="page-title">회원 통계정보</p>
      </div>

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

      <div className="mt-34 flex justify-sb align-c">
        <p>총 0건</p>
      </div>

      <div className="list-header mt-10 pl-18 pr-18">
        <div className="w20p text-left pl-6 pl-6">
          <p>날짜</p>
        </div>
        <div className="w10p text-center pl-6 pl-6">
          <p>카카오 가입</p>
        </div>
        <div className="w10p text-center pl-6 pl-6">
          <p>네이버 가입</p>
        </div>
        <div className="w10p text-center pl-6 pl-6">
          <p>구글 가입</p>
        </div>
        <div className="w10p text-center pl-6 pl-6">
          <p>애플 가입</p>
        </div>
        <div className="w20p text-center pl-6 pl-6">
          <p>신규회원 합계</p>
        </div>
        <div className="w20p text-center pl-6 pl-6">
          <p>탈퇴회원</p>
        </div>
      </div>

      <div className={`list-content pl-18 pr-18`}>
        <div className={`flex align-c pt-10 pb-10`}>
          <div className="w20p text-left pl-6 pl-6">
            <p>yyyy.mm.dd</p>
          </div>
          <div className="w10p text-center pl-6 pl-6">
            <p>123</p>
          </div>
          <div className="w10p text-center pl-6 pl-6">
            <p>123</p>
          </div>

          <div className="w10p text-center pl-6 pl-6">
            <p>123</p>
          </div>
          <div className="w10p text-center pl-6 pl-6">
            <p>123</p>
          </div>
          <div className="w20p text-center pl-6 pl-6">
            <p className="font-bold">1,234</p>
          </div>
          <div className="w20p text-center pl-6 pl-6">
            <p>0</p>
          </div>
        </div>
        <div className={`flex align-c pt-10 pb-10`}>
          <div className="w20p text-left pl-6 pl-6">
            <p>yyyy.mm.dd</p>
          </div>
          <div className="w10p text-center pl-6 pl-6">
            <p>123</p>
          </div>
          <div className="w10p text-center pl-6 pl-6">
            <p>123</p>
          </div>

          <div className="w10p text-center pl-6 pl-6">
            <p>123</p>
          </div>
          <div className="w10p text-center pl-6 pl-6">
            <p>123</p>
          </div>
          <div className="w20p text-center pl-6 pl-6">
            <p className="font-bold">1,234</p>
          </div>
          <div className="w20p text-center pl-6 pl-6">
            <p>0</p>
          </div>
        </div>
        <div className={`flex align-c pt-10 pb-10`}>
          <div className="w20p text-left pl-6 pl-6">
            <p>yyyy.mm.dd</p>
          </div>
          <div className="w10p text-center pl-6 pl-6">
            <p>123</p>
          </div>
          <div className="w10p text-center pl-6 pl-6">
            <p>123</p>
          </div>

          <div className="w10p text-center pl-6 pl-6">
            <p>123</p>
          </div>
          <div className="w10p text-center pl-6 pl-6">
            <p>123</p>
          </div>
          <div className="w20p text-center pl-6 pl-6">
            <p className="font-bold">1,234</p>
          </div>
          <div className="w20p text-center pl-6 pl-6">
            <p>0</p>
          </div>
        </div>
        <div className={`flex align-c pt-10 pb-10`}>
          <div className="w20p text-left pl-6 pl-6">
            <p>yyyy.mm.dd</p>
          </div>
          <div className="w10p text-center pl-6 pl-6">
            <p>123</p>
          </div>
          <div className="w10p text-center pl-6 pl-6">
            <p>123</p>
          </div>

          <div className="w10p text-center pl-6 pl-6">
            <p>123</p>
          </div>
          <div className="w10p text-center pl-6 pl-6">
            <p>123</p>
          </div>
          <div className="w20p text-center pl-6 pl-6">
            <p className="font-bold">1,234</p>
          </div>
          <div className="w20p text-center pl-6 pl-6">
            <p>0</p>
          </div>
        </div>
      </div>

      <div className="list-header mt-10 pl-18 pr-18">
        <div className="w20p pl-6 pl-6">
          <p>합계</p>
        </div>
        <div className="w10p text-center pl-6 pl-6">
          <p>{currency(123 * 4)}</p>
        </div>
        <div className="w10p text-center pl-6 pl-6">
          <p>{currency(123 * 4)}</p>
        </div>
        <div className="w10p text-center pl-6 pl-6">
          <p>{currency(123 * 4)}</p>
        </div>
        <div className="w10p text-center pl-6 pl-6">
          <p>{currency(123 * 4)}</p>
        </div>
        <div className="w20p text-center pl-6 pl-6">
          <p>{currency(1234 * 4)}</p>
        </div>
        <div className="w20p text-center pl-6 pl-6">
          <p>0</p>
        </div>
      </div>

      <div className="mt-20 flex justify-fe align-c flex-wrap">
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
