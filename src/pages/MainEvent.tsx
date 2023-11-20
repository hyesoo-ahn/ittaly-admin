import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { deleteData, getDataLength, getDatas, putUpdateDataBulk } from "../common/apis";
import { PAGINATION_LIMIT, PAGINATION_NUM_LIMIT, currency, timeFormat1 } from "../common/utils";
import ButtonR from "../components/ButtonR";
import InputR from "../components/InputR";
import SelectBox from "../components/SelectBox";
import Pagination from "../components/Pagination";

const EVENT_TYPE = [
  { value: "normal", label: "일반" },
  { value: "recommend", label: "추천인" },
  { value: "luckydraw", label: "럭키드로우" },
];

const EVENT_STATUS = [
  { value: "종료", label: "종료" },
  { value: "진행중", label: "진행중" },
];

const EVENT_OPEN_STATUS = [
  { value: true, label: "공개" },
  { value: false, label: "비공개" },
];

export default function MainEvent(): JSX.Element {
  const navigate = useNavigate();
  const [events, setEvents] = useState<any[]>([]);
  const [filterOb, setFilterOb] = useState<any>({
    startingDate: "",
    endingDate: "",
    eventType: null,
    eventStatus: "",
    title: "",
    openStatus: null,
  });

  const [filterInfo, setFilterInfo] = useState<any>({});
  const [totalCount, setTotalCount] = useState<number>(0);
  // pagination
  const [numPage, setNumPage] = useState<number>(1);
  const [page, setPage] = useState(1);
  const limit = PAGINATION_LIMIT;
  const numLimit = PAGINATION_NUM_LIMIT;
  const offset = (page - 1) * limit; // 시작점과 끝점을 구하는 offset
  const numPagesTotal = Math.ceil(totalCount / limit);
  const numOffset = (numPage - 1) * numLimit;

  useEffect(() => {
    init();
  }, [page, filterInfo]);

  const init = async () => {
    const count: any = await getDataLength({
      collection: "events",
      find: { ...filterInfo },
    });

    const { data }: any = await getDatas({
      collection: "events",
      sort: { created: 1 },
      skip: (page - 1) * limit,
      find: { ...filterInfo },
      // 처음 스킵0 리미트10 다음 스킵10 리미트 10
      limit: 10,
    });

    setTotalCount(count.count);
    // setPagesTotal(Math.ceil(count.count / limit));
    setEvents(data);
  };

  const paginationNumbering = () => {
    const numArr: number[] = Array.from({ length: numPagesTotal }, (v, i) => i + 1);
    const result = numArr.slice(numOffset, numOffset + 5);
    return result;
  };
  // pagination end

  const handleInitFilter = () => {
    setFilterOb({
      startingDate: "",
      endingDate: "",
      eventType: null,
      eventStatus: "",
      title: "",
      openStatus: null,
    });
    setFilterInfo({});
    setPage(1);
    init();
  };

  const handleFilterEvent = async () => {
    let find: any = {};
    let findTimeStamp: any = {};
    if (filterOb.startingDate !== "")
      findTimeStamp.startingDate = { $gte: new Date(filterOb.startingDate).getTime() };
    if (filterOb.endingDate !== "")
      findTimeStamp.endingDate = { $lte: new Date(filterOb.endingDate).getTime() };
    if (filterOb.eventType) find.eventType = filterOb.eventType.value;
    if (filterOb.title !== "") find.title = filterOb.title;
    if (filterOb.openStatus) find.openStatus = filterOb.openStatus.value;

    const { data }: any = await getDatas({
      collection: "events",
      find: {
        ...findTimeStamp,
        ...find,
      },
    });

    const timeStamp = Date.now();

    let tempFilterArr = data;
    if (filterOb.eventStatus === "종료") {
      tempFilterArr = data.filter((el: any) => el.endingDate < timeStamp);
    }
    if (filterOb.eventStatus === "진행중") {
      tempFilterArr = data.filter((el: any) => el.endingDate > timeStamp);
    }

    setEvents(tempFilterArr);
  };

  const handleCheckData = (element: any) => {
    let tempArr = [...events];

    const findIdx = tempArr.findIndex((el) => el === element);
    tempArr[findIdx].checked = !tempArr[findIdx].checked;

    setEvents(tempArr);
  };

  const handleSetOrder = async (type: string): Promise<void> => {
    const filtered = events.filter((el) => el.checked);

    const updateData = [];

    switch (type) {
      case "addTopview":
        for (let i in filtered) {
          updateData.push({
            _id: filtered[i]._id,
            setData: {
              topview: true,
            },
          });
        }
        break;

      case "removeTopview":
        for (let i in filtered) {
          updateData.push({
            _id: filtered[i]._id,
            setData: {
              topview: false,
            },
          });
        }
        break;
      case "open":
        for (let i in filtered) {
          updateData.push({
            _id: filtered[i]._id,
            setData: {
              openStatus: true,
            },
          });
        }
        break;
      case "hide":
        for (let i in filtered) {
          updateData.push({
            _id: filtered[i]._id,
            setData: {
              openStatus: false,
            },
          });
        }
        break;
    }

    const updateResult: any = await putUpdateDataBulk({ collection: "events", updateData });

    if (updateResult.status === 200) {
      alert("이벤트 변경이 완료되었습니다.");
    }
    init();
  };

  const handleDeleteEventItem = async (eventItem: any) => {
    const confirm = window.confirm("해당 이벤트를 삭제하시겠습니까?");
    if (confirm) {
      await deleteData({
        _id: eventItem._id,
        collection: "events",
      });
    } else {
      return false;
    }

    init();
  };

  return (
    <div>
      <div className="flex justify-sb align-c">
        <p className="page-title">이벤트 관리</p>
      </div>

      <div className="w100p filter-container" style={{ flex: 1 }}>
        <div className="flex">
          <div className="flex1 ml-4 mr-4 flex">
            <input
              value={filterOb.startingDate}
              onChange={(e: any) => {
                setFilterOb((prev: any) => {
                  return {
                    ...prev,
                    startingDate: e.target.value,
                  };
                });
              }}
              type="date"
              className="main-event-date-input mr-4"
              data-placeholder="시작일(~부터)"
              required
              aria-required="true"
            />
            <input
              value={filterOb.endingDate}
              onChange={(e: any) => {
                setFilterOb((prev: any) => {
                  return {
                    ...prev,
                    endingDate: e.target.value,
                  };
                });
              }}
              type="date"
              className="main-event-date-input ml-4"
              data-placeholder="종료일(~까지)"
              required
              aria-required="true"
            />
          </div>
          <div className="flex1 ml-4 mr-4">
            <SelectBox
              containerStyles={{ width: "100%" }}
              value={filterOb.eventType}
              onChange={(e: any) => {
                setFilterOb((prev: any) => {
                  return {
                    ...prev,
                    eventType: e,
                  };
                });
              }}
              options={EVENT_TYPE}
              noOptionsMessage={"상태가 없습니다."}
              placeholder="이벤트 유형"
            />
          </div>
          <div className="flex1 ml-4 mr-4">
            <SelectBox
              containerStyles={{ width: "100%" }}
              value={filterOb.status}
              onChange={(e: any) => {
                setFilterOb((prev: any) => {
                  return {
                    ...prev,
                    eventStatus: e.value,
                  };
                });
              }}
              options={EVENT_STATUS}
              noOptionsMessage={"상태가 없습니다."}
              placeholder="진행상태"
            />
          </div>
        </div>

        <div className="flex mt-8">
          <div className="flex1 ml-4 mr-4 w100p flex" style={{ height: 32 }}>
            <InputR
              size="full"
              placeholer="쿠폰명"
              value={filterOb.title}
              onChange={(e: any) => {
                setFilterOb((prev: any) => {
                  return {
                    ...prev,
                    title: e.target.value,
                  };
                });
              }}
              innerStyle={{ margin: 0 }}
            />
          </div>
          <div style={{ flex: 1, margin: "0 4px", height: 32 }}>
            <SelectBox
              containerStyles={{ width: "100%" }}
              value={filterOb.openStatus}
              onChange={(e: any) => {
                setFilterOb((prev: any) => {
                  return {
                    ...prev,
                    openStatus: e,
                  };
                });
              }}
              options={EVENT_OPEN_STATUS}
              noOptionsMessage={"상태가 없습니다."}
              placeholder="공개여부"
            />
          </div>
          <div className="flex flex1 ml-4 mr-4" style={{ height: 32 }}>
            <button onClick={handleFilterEvent} className="btn-add-b w50p mr-4 h100p border-none">
              검색
            </button>
            <button onClick={handleInitFilter} className="w50p bg-white h100p ml-4 border-black">
              초기화
            </button>
          </div>
        </div>
      </div>

      <div className="mt-34 flex justify-sb align-c">
        <p>총 0건</p>
        <ButtonR
          onClick={() => {
            navigate("/site/event/add");
          }}
          name="이벤트 등록"
        />
      </div>

      <div className="list-header mt-10 pl-18 pr-18">
        <div className="w5p">
          <input type="checkbox" />
        </div>

        <div className="w10p">
          <p>이벤트 유형</p>
        </div>

        <div className="w25p">
          <p>이벤트명</p>
        </div>

        <div className="w30p">
          <p>이벤트 기간</p>
        </div>

        <div className="w10p text-center">
          <p>진행상태</p>
        </div>

        <div className="w10p text-center">
          <p>조회수</p>
        </div>

        <div className="w5p text-center">
          <p>공개여부</p>
        </div>

        <div className="text-center w15p">
          <p>기능</p>
        </div>
      </div>

      {events?.map((eventItem: any, i: number) => (
        <div
          key={i}
          className={`list-content pl-18 pr-18 ${eventItem.topview && "bg-blue border-radius-8"}`}
        >
          <div className={`flex align-c mt-8 mb-8`}>
            <div className="w5p">
              <input
                type="checkbox"
                checked={eventItem.checked}
                onChange={() => handleCheckData(eventItem)}
              />
            </div>

            <div className="w10p">
              {eventItem.eventType === "normal" && <p>일반</p>}
              {eventItem.eventType === "luckydraw" && <p>럭키드로우</p>}
              {eventItem.eventType === "recommend" && <p>추천인</p>}
            </div>

            <div className="w25p">
              <p>{eventItem.title}</p>
            </div>

            <div className="w30p">
              <p>
                {timeFormat1(eventItem.startingDate)} ~ {timeFormat1(eventItem.endingDate)}
              </p>
            </div>

            <div className="w10p text-center">
              <p> {eventItem.endingDate > Date.now() ? "진행중" : "종료"}</p>
            </div>

            <div className="w10p">{/* <p>{currency(productItem.price)}원</p> */}</div>

            <div className="w5p text-center">
              <p>{eventItem.openStatus ? "Y" : "N"}</p>
            </div>

            <div className="text-center w15p flex justify-c">
              <ButtonR
                name="상세"
                color="white"
                styles={{ marginRight: 4 }}
                onClick={() => navigate(`/site/event/${eventItem._id}`)}
              />
              <ButtonR
                name="삭제"
                color="white"
                styles={{ marginRight: 4 }}
                onClick={() => handleDeleteEventItem(eventItem)}
              />
            </div>
          </div>
        </div>
      ))}

      <div className="mt-20 flex justify-sb align-c flex-wrap">
        <div className="flex">
          <ButtonR
            name="공개"
            color="white"
            onClick={() => handleSetOrder("open")}
            styles={{ marginRight: 4 }}
          />
          <ButtonR
            name="비공개"
            color="white"
            onClick={() => handleSetOrder("hide")}
            styles={{ marginRight: 4 }}
          />
          <ButtonR
            name="우선노출지정"
            color="white"
            onClick={() => handleSetOrder("addTopview")}
            styles={{ marginRight: 4 }}
            styleClass={"bg-blue"}
          />
          <ButtonR
            name="우선노출해제"
            color="white"
            onClick={() => handleSetOrder("removeTopview")}
            styles={{ marginRight: 4 }}
            styleClass={"bg-blue"}
          />
        </div>

        <Pagination
          data={events}
          numPagesTotal={numPagesTotal}
          numOffset={numOffset}
          numLimit={numLimit}
          limit={limit}
          numPage={numPage}
          setNumPage={setNumPage}
          paginationNumbering={paginationNumbering}
          page={page}
          setPage={setPage}
          offset={offset}
        />
      </div>
    </div>
  );
}
//
