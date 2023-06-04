import axios from "axios";
import { URI } from "./config";

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
