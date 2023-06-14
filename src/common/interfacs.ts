export interface IBrandData {
  _id: string;
  brandName: string;
  desc: string;
  imgUrl: string;
  openStatus: boolean;
  created: number;
}

export interface ISubCategory {
  optionName: string;
  URL: string;
  openStatus: boolean;
}
