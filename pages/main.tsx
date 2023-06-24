import { useContext } from "react";
import { Box } from "@mui/material";
import Image from "next/image";
import UserTable from "../src/components/data-display/user-table";
import { useQuery } from "@tanstack/react-query";
import { getOrganizationList, getUserListReq } from "../api/api";
import { FadeInComponent } from "../src/components/animations";
import OrganizationTable from "../src/components/data-display/organization-table";
import { AuthContext } from "../context/auth-context";

const Main = () => {
  const authContext = useContext(AuthContext);
  const isAdmin = authContext?.user?.admin;

  const { data: users } = useQuery(["getUserList"], () => getUserListReq(), {
    select: (data) => {
      return data.data.users;
    },
    enabled: isAdmin,
  });

  const { data: organizations } = useQuery(
    ["getOrganizationList"],
    () => getOrganizationList(),
    {
      select: (data) => {
        return data.data.organizations;
      },
    }
  );

  return (
    <Box
      sx={{
        mt: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
      }}
    >
      <Image src="/images/logo.png" alt="logo" height={135} width={291} />
      <Box sx={{ width: "100%", display: "flex", gap: 4 }}>
        {isAdmin && (
          <Box sx={{ flex: 1 }}>
            <FadeInComponent>
              <UserTable users={users || []} />
            </FadeInComponent>
          </Box>
        )}
        <Box sx={{ flex: 1 }}>
          <FadeInComponent>
            <OrganizationTable organizations={organizations || []} />
          </FadeInComponent>
        </Box>
      </Box>
    </Box>
  );
};

export default Main;
