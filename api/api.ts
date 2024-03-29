import axios from "axios";
import { Role, UserInOrganization } from "../utils/interfaces";

const API_VERSION = "v1";

//#region users

type SignInData = {
  name: string;
  password: string;
};

export const signInReq = async (data: SignInData) => {
  return axios.post(
    `${process.env.NEXT_PUBLIC_BASE_URL}/${API_VERSION}/auth/tokens`,
    data
  );
};

export const getUserInfoViaTokenReq = async (subjectToken: string) => {
  return axios.get(
    `${process.env.NEXT_PUBLIC_BASE_URL}/${API_VERSION}/auth/tokens`,
    {
      headers: {
        "X-Subject-token": subjectToken,
      },
    }
  );
};

type NewUser = {
  username: string;
  email: string;
  password: string;
};

export const createUserReq = async (data: NewUser) => {
  return axios.post(
    `${process.env.NEXT_PUBLIC_BASE_URL}/${API_VERSION}/users`,
    { user: data }
  );
};

export const getUserListReq = async () => {
  return axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/${API_VERSION}/users`);
};

type PatchUser = {
  userId: string;
  userData: {
    username?: string;
    email?: string;
    enabled?: boolean;
    gravatar?: boolean;
    date_password?: string;
    description?: string;
    website?: string;
  };
};

export const patchUserReq = async (data: PatchUser) => {
  const { userId, userData } = data;
  return axios.patch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/${API_VERSION}/users/${userId}`,
    { user: userData }
  );
};

export const deleteUserReq = async (userId: string) => {
  return axios.delete(
    `${process.env.NEXT_PUBLIC_BASE_URL}/${API_VERSION}/users/${userId}`
  );
};

// export const getUserInfoViaIdReq = async (userId: string) => {
//   return axios.get(
//     `${process.env.NEXT_PUBLIC_BASE_URL}/${API_VERSION}/users/${userId}`
//   );
// };

//#endregion users

//#region organizations

type NewOrganization = {
  name: string;
  description: string;
};

export const createOrganizationReq = async (data: NewOrganization) => {
  return axios.post(
    `${process.env.NEXT_PUBLIC_BASE_URL}/${API_VERSION}/organizations`,
    { organization: data }
  );
};

export const getOrganizationList = async () => {
  return axios.get(
    `${process.env.NEXT_PUBLIC_BASE_URL}/${API_VERSION}/organizations`
  );
};

type PatchOrganization = {
  organizationId: string;
  organizationData: {
    name?: string;
    description?: string;
    website?: string;
  };
};

export const patchOrganizationReq = async (data: PatchOrganization) => {
  const { organizationId, organizationData } = data;
  return axios.patch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/${API_VERSION}/organizations/${organizationId}`,
    { organization: organizationData }
  );
};

export const deleteOrganizationReq = async (organizationId: string) => {
  return axios.delete(
    `${process.env.NEXT_PUBLIC_BASE_URL}/${API_VERSION}/organizations/${organizationId}`
  );
};

// export const getOrganizationDetails = async (organizationId: string) => {
//   return axios.get(
//     `${process.env.NEXT_PUBLIC_BASE_URL}/${API_VERSION}/organizations/${organizationId}`
//   );
// };

//#endregion

//#region users x organizations

type AddMoveRemoveUserToOrganization = UserInOrganization & {
  role: Role;
};

export const addUserToOrganizationReq = async (
  data: AddMoveRemoveUserToOrganization
) => {
  return axios.put(
    `${process.env.NEXT_PUBLIC_BASE_URL}/${API_VERSION}/organizations/${data.organizationId}/users/${data.userId}/organization_roles/${data.role}`,
    {},
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

export const getOrganizationUsers = async (organizationId: string) => {
  return axios.get(
    `${process.env.NEXT_PUBLIC_BASE_URL}/${API_VERSION}/organizations/${organizationId}/users`
  );
};

export const removeUserFromOrganizationReq = async (
  data: AddMoveRemoveUserToOrganization
) => {
  return axios.delete(
    `${process.env.NEXT_PUBLIC_BASE_URL}/${API_VERSION}/organizations/${data.organizationId}/users/${data.userId}/organization_roles/${data.role}`
  );
};

// export const getUserRoleInOrganization = async (data: UserInOrganization) => {
//   return axios.get(
//     `${process.env.NEXT_PUBLIC_BASE_URL}/${API_VERSION}/organizations/${data.organizationId}/users/${data.userId}/organization_roles`
//   );
// };

//#endregion
