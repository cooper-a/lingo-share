import * as React from "react";
import {
  Button,
  Heading,
  Avatar,
  Box,
  Center,
  Flex,
  Stack,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

export default function ProfileCard({
  name,
  userId,
  isFriend,
  handleClickViewProfile,
  handleClickManageFriend,
}) {
  const { t } = useTranslation();

  return (
    <div>
      <Center py={6}>
        <Box maxW={"270px"} w={"full"} bg={"#D9D9D9"} rounded={"lg"}>
          <Flex justify={"center"} mt={7}>
            <Avatar
              size={"xl"}
              src={"google.com"}
              alt={"user"}
              bg="#6B6C72"
              css={{
                border: "2px solid white",
              }}
            />
          </Flex>
          <Box p={6}>
            <Stack spacing={0} align={"center"} mb={3}>
              <Heading fontSize={"lg"} fontWeight={500} fontFamily={"body"}>
                {name}
              </Heading>
              {/* <Text color={"gray.500"}>Native Speaker</Text> */}
            </Stack>
            <Button
              w={"full"}
              mt={3}
              bg={"white"}
              color={"black"}
              rounded={"md"}
              onClick={() => handleClickViewProfile(userId)}
            >
              {t("View Profile")}
            </Button>
            {!isFriend ? (
              <Button
                w={"full"}
                mt={3}
                bg={"white"}
                color={"black"}
                rounded={"md"}
                onClick={(e) => handleClickManageFriend(e, userId, true)}
              >
                {t("Add as Friend")}
              </Button>
            ) : (
              <Button
                w={"full"}
                mt={3}
                bg={"white"}
                color={"black"}
                rounded={"md"}
                onClick={(e) => handleClickManageFriend(e, userId, false)}
              >
                {t("Remove Friend")}
              </Button>
            )}
          </Box>
        </Box>
      </Center>
    </div>
  );
}
