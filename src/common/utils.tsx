import { deleteData, getDatas } from "./apis";

export const moveValue = (array: any[], fromIndex: number, toIndex: number) => {
  let temp = array;

  if (
    (fromIndex + 1 !== temp.length && fromIndex < toIndex) ||
    (fromIndex !== 0 && fromIndex > toIndex)
  ) {
    const item = temp.splice(fromIndex, 1)[0];
    temp.splice(toIndex, 0, item);
  }

  return temp;
};

export const currency = (num: number): string => {
  const n = Math.round(num); // 소수점 자르기

  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const deleteItem = async (collection: string, _id: string, type: string) => {
  let typeSubject = "";

  switch (type) {
    case "상품":
      typeSubject = "상품을";
      break;

    case "배너":
      typeSubject = "배너를";
      break;
    case "브랜드":
      typeSubject = "브랜드를";
      break;
    case "기획전":
      typeSubject = "기획전을";
      break;
    case "메인스크린 브랜드":
      typeSubject = "메인스크린 브랜드를";
      break;
    case "매거진":
      typeSubject = "매거진을";
      break;
    case "live like ittaly":
      typeSubject = "live like ittaly를";
      break;
    case "문의":
      typeSubject = "문의를";
      break;
    case "쿠폰":
      typeSubject = "쿠폰을";
      break;
    case "FAQ":
      typeSubject = "FAQ를";
      break;
  }

  const confirm = window.confirm(`해당 ${typeSubject} 삭제하시겠습니까?`);
  if (confirm) {
    const deleteResult: any = await deleteData({
      collection,
      _id,
    });

    if (deleteResult.deletedCount === 1 && deleteResult.status === 200) {
      alert(`해당 ${type}가(이) 삭제되었습니다.`);
    }
  } else {
    return;
  }
};

export const getLocation = (path: string) => {
  let selected = "";
  let subSelected = "";

  const pathParams = path;
  const split = pathParams.split("/");

  if (split[1]?.includes("product")) {
    selected = "상품";
  }
  if (split[1]?.includes("order")) {
    selected = "주문배송";
  }

  if (split[1]?.includes("site")) {
    selected = "사이트관리";
  }

  if (split[1]?.includes("customer")) {
    selected = "고객";
  }

  if (split[2]?.includes("main")) {
    subSelected = "첫 화면 관리";
  }

  if (split[2]?.includes("banner")) {
    subSelected = "배너 관리";
  }

  if (split[2]?.includes("terms")) {
    subSelected = "약관";
  }

  if (split[2]?.includes("users")) {
    subSelected = "회원 관리";
  }

  if (split[2]?.includes("referral")) {
    subSelected = "추천인 프로그램";
  }

  return { selected, subSelected };
};

// 반대로 풀때
// const n: string = text.replace(/,/gi, "");

export const timeFormat1 = (timestamp: number): string => {
  const time: Date = new Date(timestamp);
  const year: string = time.getFullYear().toString();
  let month: string = (time.getMonth() + 1).toString();
  if (month.length === 1) {
    month = "0" + month;
  }
  let hours: string = time.getHours() > 9 ? time.getHours().toString() : `0${time.getHours()}`;
  let minutes: string =
    time.getMinutes() > 9 ? time.getMinutes().toString() : `0${time.getMinutes()}`;
  let date: string = time.getDate().toString();
  if (date.length === 1) {
    date = "0" + date;
  }
  const day = time.getDay();
  let _dayKr = "";
  switch (day) {
    case 0:
      _dayKr = "일";
      break;
    case 1:
      _dayKr = "월";
      break;
    case 2:
      _dayKr = "화";
      break;
    case 3:
      _dayKr = "수";
      break;
    case 4:
      _dayKr = "목";
      break;
    case 5:
      _dayKr = "금";
      break;
    case 6:
      _dayKr = "토";
      break;
  }

  return `${year}. ${month}. ${date} (${_dayKr}) ${hours}:${minutes}`;
};

export const timeFormat2 = (timestamp: number): string => {
  const time: Date = new Date(timestamp);
  const year: string = time.getFullYear().toString();
  let month: string = (time.getMonth() + 1).toString();
  if (month.length === 1) {
    month = "0" + month;
  }
  let hours: string = time.getHours() > 9 ? time.getHours().toString() : `0${time.getHours()}`;
  let minutes: string =
    time.getMinutes() > 9 ? time.getMinutes().toString() : `0${time.getMinutes()}`;
  let date: string = time.getDate().toString();
  if (date.length === 1) {
    date = "0" + date;
  }
  const day = time.getDay();
  let _dayKr = "";
  switch (day) {
    case 0:
      _dayKr = "일";
      break;
    case 1:
      _dayKr = "월";
      break;
    case 2:
      _dayKr = "화";
      break;
    case 3:
      _dayKr = "수";
      break;
    case 4:
      _dayKr = "목";
      break;
    case 5:
      _dayKr = "금";
      break;
    case 6:
      _dayKr = "토";
      break;
  }

  return `${year}-${month}-${date}`;
};

export const timeFormat3 = (timestamp: number): string => {
  const time: Date = new Date(timestamp);
  const year: string = time.getFullYear().toString();
  let month: string = (time.getMonth() + 1).toString();
  if (month.length === 1) {
    month = "0" + month;
  }
  let hours: string = time.getHours() > 9 ? time.getHours().toString() : `0${time.getHours()}`;
  let minutes: string =
    time.getMinutes() > 9 ? time.getMinutes().toString() : `0${time.getMinutes()}`;
  let date: string = time.getDate().toString();
  if (date.length === 1) {
    date = "0" + date;
  }
  const day = time.getDay();
  let _dayKr = "";
  switch (day) {
    case 0:
      _dayKr = "일";
      break;
    case 1:
      _dayKr = "월";
      break;
    case 2:
      _dayKr = "화";
      break;
    case 3:
      _dayKr = "수";
      break;
    case 4:
      _dayKr = "목";
      break;
    case 5:
      _dayKr = "금";
      break;
    case 6:
      _dayKr = "토";
      break;
  }

  return `${year}. ${month}. ${date} ${_dayKr}요일`;
};

export const csvToJSON = (csv_string: string) => {
  // 1. 문자열을 줄바꿈으로 구분 => 배열에 저장
  // console.log(csv_string);
  let rows = csv_string.split("\n");

  // 2. 빈 배열 생성: CSV의 각 행을 담을 JSON 객체임
  const jsonArray: any = [];

  // 3. 제목 행 추출 후, 콤마로 구분 => 배열에 저장
  const header: any = rows[0]?.split(",");

  // 4. 내용 행 전체를 객체로 만들어, jsonArray에 담겨
  for (let i = 1; i < rows?.length; i++) {
    // 빈 객체 생성: 각 내용 행을 객체로 만들어 담아둘 오브젝트임
    let obj: any = {};

    // // 각 내용 행을 콤마로 구분
    let row = rows[i]?.split(",");

    // // 각 내용행을 {제목1:내용1, 제목2:내용2, ...} 형태의 객체로 생성
    for (let j = 0; j < header?.length; j++) {
      obj[header[j].replace(/\"/gi, "").replace(/\r/gi, "")] = row[j]
        .replace(/\"/gi, "")
        .replace(/\r/gi, "");
    }

    // // 각 내용 행의 객체를 jsonArray배열에 담기
    jsonArray.push(obj);
  }

  return jsonArray;
};

// 브랜드 삭제
export const handleDeleteBrand = async (item: any, init: any) => {
  const { data }: any = await getDatas({
    collection: "products",
    find: { brandId: item?._id, delete: { $ne: true } },
  });

  if (data.length === 0) {
    await deleteItem("brands", item._id, "브랜드");
    await init();
  } else {
    alert(
      `해당 브랜드에 포함된 상품이 남아있습니다. \n해당 브랜드의 모든 상품 삭제 후 진행해 주세요.`
    );
  }
};
