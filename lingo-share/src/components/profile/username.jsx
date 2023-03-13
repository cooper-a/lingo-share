import {
  Button,
  Avatar,
  Editable,
  EditableInput,
  EditablePreview,
  Text,
  Stack,
} from "@chakra-ui/react";
import React from "react";
import Icon from "@adeira/icons";
import "@fontsource/atkinson-hyperlegible";
import "../../styles/profilepage.css";

export default function UserName({
  userObj,
  isPrimaryUser,
  setDisplayName,
  userType,
  proficiencyMap,
  params,
  userFriends,
  handleClickManageFriend,
}) {
  return (
    <div className="profile-pic">
      <Avatar size={"2xl"} bg="grey" src={userObj.profilePic} />
      {isPrimaryUser ? (
        <div className="user-name">
          <div className="heading">
            <Editable
              float={"left"}
              marginLeft={"48px"}
              marginTop={"27px"}
              fontSize="4xl"
              fontWeight={"bold"}
              defaultValue={userObj.userDisplayName}
            >
              <EditablePreview />
              <EditableInput
                onChange={(e) => setDisplayName(e.target.value)}
                maxWidth={"275px"}
              />
              <Icon className="editable" name="pen" />
            </Editable>
          </div>
          <div className="heading">
            <Text fontSize={"lg"} marginLeft={"48px"}>
              {userType === "native"
                ? "Native Mandarin Speaker"
                : "Mandarin Learner"}{" "}
              • {proficiencyMap[userObj.proficiency]}
            </Text>
          </div>
        </div>
      ) : (
        <div>
          <div className="user-name">
            <div className="heading">
              <Text
                float={"left"}
                marginLeft={"48px"}
                marginBottom={"5px"}
                fontSize="4xl"
                fontWeight={"bold"}
              >
                {userObj.userDisplayName}
              </Text>
            </div>
            <div>
              <Text className="heading" fontSize={"lg"} marginLeft={"48px"}>
                {userObj.userType === "native"
                  ? "Native Mandarin Speaker"
                  : "Mandarin Learner"}{" "}
                • {proficiencyMap[userObj.proficiency]}
              </Text>
            </div>
            <Stack
              direction={"row"}
              spacing={4}
              align={"center"}
              marginTop={"10px"}
              marginLeft={"48px"}
              className="heading"
            >
              <Button
                variant={"outline"}
                onClick={() => handleClickManageFriend(params.id, true)}
                isDisabled={params.id in userFriends}
                bgColor={params.id in userFriends ? "#D9D9D9" : "white"}
                rightIcon={
                  params.id in userFriends ? (
                    <Icon name="check_circle" />
                  ) : (
                    <></>
                  )
                }
              >
                {params.id in userFriends ? "Friends" : "Add as Friend"}
              </Button>
              <Button variant={"outline"}>Block User</Button>
            </Stack>
          </div>
        </div>
      )}
    </div>
  );
}
