import { deleteData } from "./apis";

export const moveValue = (array: object[], fromIndex: number, toIndex: number) => {
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
  const deleteResult: any = await deleteData({
    collection,
    _id,
  });

  if (deleteResult.deletedCount === 1 && deleteResult.status === 200) {
    alert(`해당 ${type}가(이) 삭제되었습니다.`);
  }
};

// 반대로 풀때
// const n: string = text.replace(/,/gi, "");
