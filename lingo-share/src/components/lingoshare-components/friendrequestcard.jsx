import React from "react";
import { Card, CardHeader, Avatar, Box, Text, Flex } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import PrimaryButton from "./primarybutton";
import SecondaryButton from "./secondarybutton";
import TertiaryButton from "./tertiarybutton";
import { useTranslation } from "react-i18next";

export default function FriendRequestCard({
  incomingRequestIndex,
  userId,
  userType,
  interests,
  displayName,
  profilePic,
  onClickIgnore,
  onClickAccept,
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleClickViewProfile = (targetID) => {
    navigate(`/profile/${targetID}`);
  };

  return (
    <div>
      <Card
        className="call-card"
        borderWidth={"1px"}
        borderColor={"#363636"}
        width={"820px"}
        maxH={"120px"}
        left={"20px"}
        rounded={"2xl"}
      >
        <CardHeader>
          <Flex spacing="4">
            <Flex flex="1" gap="4" alignItems="center" flexWrap="wrap">
              <Avatar bg="grey" src={profilePic} />
              <div className="user-invite-heading">
                {displayName ? (
                  <Text float={"left"} fontWeight={"bold"} fontSize="lg">
                    {displayName}
                  </Text>
                ) : (
                  <Text fontSize="sm">{userId}</Text>
                )}
                <Text>
                  {userType === "learner"
                    ? "Language Learner"
                    : "Native Speaker"}
                </Text>
                {interests && (
                  <Text marginTop={"0.25rem"} fontSize={"sm"}>
                    {"Interests: " + interests.join(", ")}
                  </Text>
                )}
              </div>
            </Flex>
            <Box alignSelf={"center"}>
              <TertiaryButton
                onClick={() => handleClickViewProfile(userId)}
                marginRight={"20px"}
                text={t("View Profile")}
              />
              <SecondaryButton
                text={t("Ignore")}
                onClick={(event) =>
                  onClickIgnore(event, incomingRequestIndex, userId)
                }
              />
              <PrimaryButton
                marginLeft={"15px"}
                width={"105px"}
                text={t("Accept")}
                onClick={(event) =>
                  onClickAccept(event, incomingRequestIndex, userId)
                }
              />
            </Box>
          </Flex>
        </CardHeader>
      </Card>
    </div>
  );
}
