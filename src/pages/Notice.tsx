import React, { ChangeEventHandler, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { getDataLength, getDatas, getUsers, putUpdateDataBulk } from "../common/apis";
import {
  PAGINATION_LIMIT,
  PAGINATION_NUM_LIMIT,
  currency,
  timeFormat1,
  timeFormat2,
} from "../common/utils";
import ButtonR from "../components/ButtonR";
import InputR from "../components/InputR";
import SelectBox from "../components/SelectBox";
import Modal from "../components/Modal";
import close from "../images/close.png";
import Pagination from "../components/Pagination";

const OPEN_STATUS = [
  { value: "Y", label: "Y" },
  { value: "N", label: "N" },
];

const CATEGORY_TYPE = [
  { value: "전체", label: "전체" },
  { value: "공지", label: "공지" },
  { value: "시스템", label: "시스템" },
  { value: "이벤트", label: "이벤트" },
];

export default function Notice(): JSX.Element {
  const navigate = useNavigate();
  const [noticeData, setNoticeData] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [selectedOpenStatus, setSelectedOpenStatus] = useState<any>(null);
  const [title, setTitle] = useState<string>("");
  const [filterInfo, setFilterInfo] = useState<any>({});

  // pagination
  const [totalCount, setTotalCount] = useState<number>(0);
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
      collection: "notice",
      find: { ...filterInfo },
    });

    const { data }: any = await getDatas({
      collection: "notice",
      sort: { created: 1 },
      skip: (page - 1) * limit,
      find: { ...filterInfo },
      // 처음 스킵0 리미트10 다음 스킵10 리미트 10
      limit: 10,
    });

    setTotalCount(count.count);
    setNoticeData(data);
  };

  const paginationNumbering = () => {
    const numArr: number[] = Array.from({ length: numPagesTotal }, (v, i) => i + 1);
    const result = numArr.slice(numOffset, numOffset + 5);
    return result;
  };
  const handleSearchData = async () => {
    let find: any = {};
    if (selectedCategory && selectedCategory.value !== "전체")
      find.category = selectedCategory.value;
    if (selectedOpenStatus) find.openStatus = selectedOpenStatus.value === "Y" ? true : false;
    if (title !== "") find.title = title;

    const { data }: any = await getDatas({
      collection: "notice",
      find: find,
    });

    setFilterInfo(find);
    setNoticeData(data);
  };

  const handlecheckItem = (item: any) => {
    const findIdx = noticeData.findIndex((aNotice) => aNotice === item);

    const temp = [...noticeData];
    temp[findIdx].checked = !temp[findIdx].checked;
    setNoticeData(temp);
  };

  const handleNoticeUpdate = async (status: boolean) => {
    const filterData = noticeData.filter((el) => el.checked);
    let updateData: any = [];
    switch (status) {
      case true:
        for (let i in filterData) {
          updateData.push({
            _id: filterData[i]._id,
            setData: {
              openStatus: true,
            },
          });
        }
        break;

      case false:
        for (let i in filterData) {
          updateData.push({
            _id: filterData[i]._id,
            setData: {
              openStatus: false,
            },
          });
        }
        break;
    }

    const updateResult: any = await putUpdateDataBulk({ collection: "notice", updateData });
    if (updateResult.status === 200) {
      alert("공지사항 변경이 완료되었습니다.");
    }
    init();
  };

  return (
    <div>
      <div className="flex justify-sb align-c">
        <p className="page-title">공지사항 관리</p>
      </div>

      <div className="w100p filter-container flex1">
        <div className="flex"></div>

        <div className="flex">
          <div className="flex1 flex ml-4 mr-4 w100p" style={{ height: 32 }}>
            {/* <InputR size="full" placeholer="닉네임/ID" innerStyle={{ margin: 0 }} /> */}
            <SelectBox
              containerStyles={{ width: "100%" }}
              onChange={(e: any) => setSelectedCategory(e)}
              placeholder="카테고리"
              value={selectedCategory}
              options={CATEGORY_TYPE}
              noOptionsMessage="옵션이 없습니다"
            />
          </div>
          <div className="flex ml-4 mr-4 flex1" style={{ height: 32 }}>
            <SelectBox
              containerStyles={{ width: "100%" }}
              onChange={(e: any) => setSelectedOpenStatus(e)}
              placeholder="공개여부"
              value={selectedOpenStatus}
              options={OPEN_STATUS}
              noOptionsMessage="옵션이 없습니다"
            />
          </div>
          <div className="flex flex1 ml-4 mr-4" style={{ height: 32 }}></div>
        </div>

        <div className="flex mt-8">
          <div className="flex mr-4 ml-4" style={{ height: 32, flex: 2 }}>
            <InputR
              value={title}
              onChange={(e: any) => setTitle(e.target.value)}
              size="full"
              placeholer="제목"
              innerStyle={{ marginRight: 0 }}
            />
          </div>

          <div className="flex flex1 ml-4 align-c">
            <button
              onClick={handleSearchData}
              className="btn-add-b mr-4"
              style={{
                width: "50%",
                border: "none",
              }}
            >
              검색
            </button>
            <button
              onClick={() => {
                setSelectedCategory(null);
                setSelectedOpenStatus(null);
                setTitle("");
                setFilterInfo({});
                init();
              }}
              className="ml-4"
              style={{
                width: "50%",
                backgroundColor: "#fff",
                height: "100%",

                border: "1px solid black",
              }}
            >
              초기화
            </button>
          </div>
        </div>
      </div>

      <div className="mt-34 flex justify-sb align-c">
        <p>총 0건</p>
        <ButtonR name="공지사항 등록" onClick={() => navigate("/site/notice/add")} />
      </div>

      <div className="list-header mt-10 pl-18 pr-18">
        <div className="w5p">
          <input type="checkbox" />
        </div>

        <div className="w10p text-center">
          <p>카테고리</p>
        </div>

        <div className="w35p text-center">
          <p>질문</p>
        </div>
        <div className="w10p text-center">
          <p>조회수</p>
        </div>

        <div className="w10p text-center">
          <p>등록일</p>
        </div>
        <div className="w10p text-center">
          <p>공개여부</p>
        </div>
        <div className="w20p text-center">
          <p>기능</p>
        </div>
      </div>

      <div className={`list-content pl-18 pr-18`}>
        {noticeData.map((aNotice: any, i: number) => (
          <div key={i} className={`flex align-c mt-8 mb-8`}>
            <div className="w5p">
              <input
                type="checkbox"
                checked={aNotice.checked}
                onChange={(e: any) => handlecheckItem(aNotice)}
              />
            </div>
            <div className="w10p text-center">
              <p>{aNotice.category}</p>
            </div>
            <div className="w35p text-center">
              <p className="text-line">{aNotice.title}</p>
            </div>
            <div className="w10p text-center">
              <p>{aNotice.viewCount}</p>
            </div>

            <div className="w10p text-center">
              <p>{timeFormat1(aNotice.created)}</p>
            </div>
            <div className="w10p text-center">
              <p>{aNotice.openStatus ? "Y" : "N"}</p>
            </div>

            <div className="w20p text-center">
              <div className="flex justify-c">
                <ButtonR
                  name="상세"
                  color="white"
                  styles={{ marginRight: 4 }}
                  onClick={() => navigate(`/site/notice/${aNotice._id}`)}
                />
                <ButtonR name="삭제" color="white" styles={{ marginRight: 4 }} onClick={() => {}} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-20 flex justify-sb align-c flex-wrap">
        <div className="flex">
          <ButtonR
            name="공개"
            color="white"
            onClick={() => handleNoticeUpdate(true)}
            styles={{ marginRight: 4 }}
          />
          <ButtonR
            name="비공개"
            color="white"
            onClick={() => handleNoticeUpdate(false)}
            styles={{ marginRight: 4 }}
          />
        </div>

        <Pagination
          data={noticeData}
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
