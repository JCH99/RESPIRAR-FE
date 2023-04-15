import axios from "axios";

type SignInData = {
  name: string;
  password: string;
};

export const signInReq = async (data: SignInData) => {
  return axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}auth/tokens`, data);
};
