import { Typography, Box } from "@mui/material";
import Image from "next/image";
import UserTable from "../src/components/data-display/user-table";
import { useQuery } from "@tanstack/react-query";
import { getUserListReq } from "../api/api";
import { FadeInComponent } from "../src/components/animations";

type Props = {};

const Main = (props: Props) => {
  const { data: users } = useQuery(["getUserList"], () => getUserListReq(), {
    select: (data) => {
      return data.data.users;
    },
  });

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
        <Box sx={{ flex: 1 }}>
          <FadeInComponent>
            <UserTable users={users || []} />
          </FadeInComponent>
        </Box>
        {/* <Box sx={{ bgcolor: "red", height: 200, flex: 1 }}>.</Box> */}
      </Box>
    </Box>
  );
};

export default Main;
