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
    return "";
  }
};

// 상품등록
export const postAddProduct = async (body: any): Promise<any> => {
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

// 카테고리 등록
export const postAddCategory = async (body: any): Promise<any> => {
  try {
    const { data } = await axios.post(`${URI}/admin/create`, body, {
      headers: {
        Authorization: `Bearer ${ADMIN_TOKEN}`,
      },
    });

    console.log(data);
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
    const start = body.skip ? body.skip : 0;
    const limit = body.limit ? body.limit : {};

    const { data }: any = await axios.get(
      `${URI}/admin/find?collection=${collection}&find=${JSON.stringify(
        find
      )}&sort=${JSON.stringify(sort)}&skip=${start}&limit=${limit}`,
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

// get data length for pagination
export const getDataLength = async (body: any): Promise<boolean | object> => {
  try {
    const collection = body.collection;
    const find = body.find ? body.find : {};

    const { data }: any = await axios.get(
      `${URI}/admin/count?collection=${collection}&find=${JSON.stringify(find)}`,
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

export const getAdminLookup = async (body: any): Promise<boolean | object> => {
  try {
    const collection = body.collection;
    const find = body.find ? JSON.stringify(body.find) : JSON.stringify({});
    const sort = body.sort ? body.sort : {};
    const start = body.start ? body.start : 0;
    const limit = body.limit ? body.limit : 100;
    const end = body.end ? body.end : 0;
    const lookupFrom = body.lookupFrom;
    const addField = body.addField;
    const as = body.as;

    const { data }: any = await axios.get(
      `${URI}/admin/lookup?collection=${collection}&lookupFrom=${lookupFrom}&limit=100&addField=${addField}&as=${as}&find=${find}`,
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

// 데이터 수정 (개별)
export const putUpdateData = async (_body: any): Promise<boolean> => {
  try {
    // const token: any = localStorage.getItem("token");
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${ADMIN_TOKEN}`,
    };
    const { data } = await axios.put(`${URI}/admin/data`, _body, { headers });
    // console.log(data);
    return data;
  } catch (error) {
    return false;
  }
};

// 데이터 삭제
export const deleteData = async (_body: object): Promise<boolean> => {
  try {
    const { data } = await axios.delete(`${URI}/admin/data`, {
      data: {
        ..._body,
      },
      headers: {
        Authorization: `Bearer ${ADMIN_TOKEN}`,
      },
    });

    return data;
  } catch (error) {
    return false;
  }
};

// 상품삭제
export const deleteProduct = async (_body: object): Promise<boolean> => {
  try {
    const { data } = await axios.delete(`${URI}/admin/product/delete`, {
      data: {
        ..._body,
      },
      headers: {
        Authorization: `Bearer ${ADMIN_TOKEN}`,
      },
    });

    return data;
  } catch (error) {
    return false;
  }
};

// 어드민등록
export const postCollection = async (body: any): Promise<any> => {
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

// 데이터 수정 bulk (데이터 각각 수정)
export const putUpdateDataBulk = async (_body: any): Promise<boolean> => {
  try {
    // const token: any = localStorage.getItem("token");
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${ADMIN_TOKEN}`,
    };
    const { data } = await axios.put(`${URI}/admin/bulk`, _body, { headers });
    // console.log(data);
    return data;
  } catch (error) {
    return false;
  }
};

// 데이터 수정 bulk (일괄데이터 수정)
export const putUpdateDataBulk2 = async (_body: any): Promise<boolean> => {
  try {
    // const token: any = localStorage.getItem("token");
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${ADMIN_TOKEN}`,
    };
    const { data } = await axios.put(`${URI}/admin/many`, _body, { headers });
    // console.log(data);
    return data;
  } catch (error) {
    return false;
  }
};

// 유저리스트
export const getUsers = async (body: any): Promise<boolean | object> => {
  try {
    const find = body.find ? body.find : {};
    const sort = body.sort ? body.sort : {};
    const start = body.start ? body.start : 0;
    const limit = body.limit ? body.limit : {};
    const end = body.end ? body.end : 0;

    const { data }: any = await axios.get(
      `${URI}/admin/userinfo?collection=users&find=${JSON.stringify(find)}&sort=${JSON.stringify(
        sort
      )}&start=${start}&end=${end}&limit=${limit}`,
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

// 통관부호 유효성검증
export const getValidCheckCustomCode = async (): Promise<boolean | object> => {
  try {
    const { data }: any = await axios.get(
      `https://tunipass.customs.go.kr:38010/ext/rest/ecmQry/retrieveEcm?crkyCn=y240a243a180e166g040j060q0&ecm=P180016748474&brno=1028144680&conmNm=(주)모노글로트홀딩스`,
      {
        headers: {
          "Content-Type": "Application/xml",
        },
      }
    );

    return data;
  } catch (error) {
    return false;
  }
};
