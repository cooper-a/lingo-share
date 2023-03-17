import {
  Avatar,
  Editable,
  EditableInput,
  EditablePreview,
  Text,
} from "@chakra-ui/react";
import React, { useState } from "react";
import Icon from "@adeira/icons";
import "@fontsource/atkinson-hyperlegible";
import "../../styles/profilepage.css";
import ProfilePicture from "../profilepicture";
import ButtonGroup from "../lingoshare-components/buttongroup";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { getDownloadURL, ref as storageRef } from "firebase/storage";
import { rtdb, storage } from "../../firebase";
import { ref as dbRef, set } from "firebase/database";
import { updateProfile } from "firebase/auth";
import { UserAuth } from "../../contexts/AuthContext";
import EditableControls from "./editablecontrols";

export default function UserName({
  curPage,
  displayName,
  handleAcceptRequest,
  handleIgnoreRequest,
  friendRequests,
  isRequestIncoming,
  userObj,
  isPrimaryUser,
  setDisplayName,
  userType,
  isOnline,
  proficiencyMap,
  params,
  profilePic,
  onOpenSuccessAlert,
  setAlertText,
  userFriends,
  handleClickManageFriend,
}) {
  const { t } = useTranslation();
  const { user } = UserAuth();
  const [pfp, setPfp] = useState(null);
  const navigate = useNavigate();
  let isUserFriendRequested = false;
  friendRequests.forEach((request) => {
    if (request.hasOwnProperty(params.id)) {
      isUserFriendRequested = true;
      return;
    }
  });

  console.log(userFriends);

  const saveCompressedPhotoURL = () => {
    getDownloadURL(
      storageRef(storage, `profile_pics/${user.uid}_profile_150x150`)
    )
      .then((url) => {
        setPfp(url);
        set(dbRef(rtdb, `users/${user.uid}/profilePic`), url);
        updateProfile(user, {
          photoURL: url, // save the compressed photo url to auth context
        });
        navigate(curPage);
      })
      .catch((error) => {
        console.log(error);
      });
    setAlertText(
      t("Your profile picture was updated, please refresh to see changes")
    );
    onOpenSuccessAlert();
  };

  let buttonGroupRender = <div></div>;
  if (isRequestIncoming) {
    buttonGroupRender = (
      <ButtonGroup
        buttonTypeList={["primary", "secondary"]}
        textList={["Accept Friend Request", "Ignore Friend Request"]}
        isDisabledList={[false, false]}
        onClickList={[
          (event) => handleAcceptRequest(event, params.id),
          (event) => handleIgnoreRequest(event, params.id),
        ]}
        spacing={4}
        width={"200px"}
        height={"45px"}
        marginTop={"10px"}
        marginLeft={"48px"}
      />
    );
  } else if (isUserFriendRequested) {
    buttonGroupRender = (
      <ButtonGroup
        buttonTypeList={["secondary", "secondary"]}
        textList={[t("Friend Request Sent"), t("Block User")]}
        onClickList={[
          () => {},
          () => {
            console.log("TODO: block user button functional");
          },
        ]}
        isDisabledList={[true, false]}
        spacing={4}
        width={"200px"}
        height={"45px"}
        marginTop={"10px"}
        marginLeft={"48px"}
      />
    );
  } else if (params.id in userFriends) {
    buttonGroupRender = (
      <ButtonGroup
        buttonTypeList={["secondary", "secondary"]}
        textList={[t("Friends"), t("Block User")]}
        isDisabledList={[false, false]}
        onClickList={[
          () => handleClickManageFriend(params.id, !(params.id in userFriends)),
          () => {},
        ]} // TODO: block user button functional
        rightIconList={[<Icon name="check_circle" />, <></>]}
        spacing={4}
        width={"200px"}
        height={"45px"}
        marginTop={"10px"}
        marginLeft={"48px"}
      />
    );
  } else {
    buttonGroupRender = (
      <ButtonGroup
        buttonTypeList={["primary", "secondary"]}
        textList={[t("Add as Friend"), t("Block User")]}
        isDisabledList={[false, false]}
        onClickList={[
          () => handleClickManageFriend(params.id, !(params.id in userFriends)),
          () => {},
        ]}
        spacing={4}
        width={"200px"}
        height={"45px"}
        marginTop={"10px"}
        marginLeft={"48px"}
      />
    );
  }
  return (
    <div className="profile-pic">
      <div className="picture">
        <div>
          <Avatar
            width={"150px"}
            height={"150px"}
            bg="grey"
            src={pfp ? pfp : profilePic}
          />
        </div>
        {isPrimaryUser && (
          <div className="picture-upload-btn">
            <ProfilePicture saveCompressedPhotoURL={saveCompressedPhotoURL} />
          </div>
        )}
      </div>
      {isPrimaryUser ? (
        <div className="user-name">
          <div className="heading">
            <Editable
              value={displayName}
              float={"left"}
              marginLeft={"48px"}
              marginTop={"24px"}
              fontSize="4xl"
              fontWeight={"bold"}
            >
              <EditablePreview />
              <EditableInput
                onChange={(e) => setDisplayName(e.target.value)}
                maxWidth={"275px"}
              />
              <EditableControls />
            </Editable>
          </div>
          <div className="heading">
            <Text fontSize={"lg"} marginLeft={"48px"}>
              {userType === "native"
                ? t("Native Mandarin Speaker")
                : t("Mandarin Learner")}{" "}
              • {proficiencyMap[userObj.proficiency]}
            </Text>
          </div>
        </div>
      ) : (
        <div>
          <div className="user-name">
            <div className="heading">
              <div className="heading-child">
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
              <div className="heading-child-online">
                {params.id in userFriends && (
                  <Text
                    fontSize={"sm"}
                    fontWeight={"bold"}
                    alignContent={"center"}
                  >
                    {isOnline === "online"
                      ? `(${t("Online")})`
                      : `(${t("Offline")})`}
                  </Text>
                )}
              </div>
            </div>
            <div>
              <Text className="heading" fontSize={"lg"} marginLeft={"50px"}>
                {userObj.userType === "native"
                  ? t("Native Mandarin Speaker")
                  : t("Mandarin Learner")}{" "}
                • {proficiencyMap[userObj.proficiency]}
              </Text>
            </div>
            {buttonGroupRender}
          </div>
        </div>
      )}
    </div>
  );
}
