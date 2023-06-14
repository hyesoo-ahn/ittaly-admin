import axios from "axios";
import { URI, ADMIN_TOKEN } from "./config";

export const getSignin = async (body: any): Promise<any> => {
  try {
    const { data } = await axios.get(
      `${URI}/openapi/user/signin?email=${body.email}&password=${body.password}`
    );
    if (!data) localStorage.removeItem("token");
    return data;
  } catch (error) {
    localStorage.removeItem("token");
    return false;
  }
};

export const postSignup = async (body: any): Promise<any> => {
  try {
    const { data } = await axios.post(`${URI}/openapi/user/signup`, body);
    if (!data) localStorage.removeItem("token");
    return data;
  } catch (error) {
    localStorage.removeItem("token");
    return false;
  }
};

export const postUploadImage = async (_file: object): Promise<string | boolean> => {
  try {
    const { data }: any = await axios.post(`${URI}/admin/image`, _file, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${ADMIN_TOKEN}`,
      },
    });
    return data;
  } catch (error) {
    return false;
  }
};

// 상품등록
export const postAddProduct = async (body: any): Promise<any> => {
  try {
    const { data } = await axios.post(`${URI}/openapi/user/signup`, body);

    return data;
  } catch (error) {
    return false;
  }
};

// 카테고리 등록
export const postAddCategory = async (body: any): Promise<any> => {
  try {
    const { data } = await axios.post(`${URI}/admin/create`, body, {
      headers: {
        Authorization: `Bearer ${ADMIN_TOKEN}`,
      },
    });

    return data;
  } catch (error) {
    return false;
  }
};

// 브랜드 등록
export const postAddBrand = async (body: any): Promise<any> => {
  try {
    const { data } = await axios.post(`${URI}/admin/create`, body, {
      headers: {
        Authorization: `Bearer ${ADMIN_TOKEN}`,
      },
    });

    return data;
  } catch (error) {
    return false;
  }
};

export const getDatas = async (body: any): Promise<boolean | object> => {
  try {
    const collection = body.collection;
    const find = body.find ? body.find : {};
    const sort = body.sort ? body.sort : {};
    const start = body.start ? body.start : 0;
    const end = body.end ? body.end : 0;

    const { data }: any = await axios.get(
      `${URI}/admin/find?collection=${collection}&find=${JSON.stringify(
        find
      )}&sort=${JSON.stringify(sort)}&start=${start}&end=${end}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${ADMIN_TOKEN}`,
        },
      }
    );

    return data;
  } catch (error) {
    return false;
  }
};
