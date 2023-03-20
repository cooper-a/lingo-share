import React from "react";
import { Card, CardHeader, Avatar, Box, Text, Flex } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import PrimaryButton from "./primarybutton";
import SecondaryButton from "./secondarybutton";
import TertiaryButton from "./tertiarybutton";
import { useTranslation } from "react-i18next";
import ButtonGroup from "./buttongroup.jsx";

export default function FriendRequestCard({
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
    navigate(`/profile/${targetID}`, {
      state: { prevPage: "/meetnewfriends" },
    });
  };

  return (
    <div className="friend-request-card">
      <Card
        borderWidth={"1px"}
        borderColor={"#363636"}
        width={"100vh"}
        maxH={"135px"}
        left={"20px"}
        rounded={"2xl"}
        marginLeft={"20px"}
      >
        <CardHeader>
          <div className="friend-request-card-content">
            <div className="user-invite-avatar">
              <Avatar bg="grey" src={profilePic} />
            </div>
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
                  ? t("Language Learner")
                  : t("Native Speaker")}
              </Text>
              {interests && (
                <Text maxW={"400px"} marginTop={"0.25rem"} fontSize={"sm"}>
                  {t("Interests: ") + interests.join(", ")}
                </Text>
              )}
            </div>
            <div className="user-invite-buttongroup">
              <ButtonGroup
                buttonTypeList={["tertiary", "secondary", "primary"]}
                textList={[t("View Profile"), t("Ignore"), t("Accept")]}
                isDisabledList={[false, false, false]}
                onClickList={[
                  () => handleClickViewProfile(userId),
                  (event) => onClickIgnore(event, userId),
                  (event) => onClickAccept(event, userId),
                ]}
                spacing={4}
                width={"105px"}
                height={"45px"}
                marginLeft={"48px"}
              />
            </div>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
}
