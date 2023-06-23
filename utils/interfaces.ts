export enum Role {
  OWNER = "owner",
  MEMBER = "member",
}

export type UserInOrganization = {
  organizationId: string;
  userId: string;
};

export type User = {
  id: string;
  username: string;
  email: string;
  date_password: string;
  enabled: boolean;
  admin: boolean;
};
