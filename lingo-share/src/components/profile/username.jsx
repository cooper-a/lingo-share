import {
  Avatar,
  Editable,
  EditableInput,
  EditablePreview,
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import "@fontsource/atkinson-hyperlegible";
import { updateProfile } from "firebase/auth";
import { ref as dbRef, set } from "firebase/database";
import { getDownloadURL, ref as storageRef } from "firebase/storage";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { UserAuth } from "../../contexts/AuthContext";
import { rtdb, storage } from "../../firebase";
import "../../styles/profilepage.css";
import {
  generateCallStatusEntryAndNavigate,
  handleBlockUser,
} from "../../utils/userutils";
import ButtonGroup from "../lingoshare-components/buttongroup";
import InputModal from "../lingoshare-components/inputmodal";
import PrimaryButton from "../lingoshare-components/primarybutton";
import SecondaryButton from "../lingoshare-components/secondarybutton";
import ProfilePicture from "../profilepicture";
import EditableControls from "./editablecontrols";

const ConfirmationModal = ({
  isOpen,
  displayName,
  handleCallConfirm,
  userId,
  onClose,
  activeCallsRef,
  user,
  navigate,
}) => {
  const { t } = useTranslation();
  return (
    <div>
      <Modal isCentered onClose={onClose} size={"md"} isOpen={isOpen}>
        <ModalOverlay />
        <ModalContent borderRadius={"2xl"}>
          <ModalHeader marginTop={"1rem"} className="font" alignSelf={"center"}>
            {t("Call ") + displayName + "?"}
          </ModalHeader>
          <ModalFooter marginBottom={"1.5rem"} alignSelf={"center"}>
            <PrimaryButton
              text={t("Yes")}
              marginRight={"15px"}
              onClick={() =>
                handleCallConfirm(userId, activeCallsRef, user, navigate)
              }
              width={"150px"}
            />
            <SecondaryButton
              text={t("No")}
              onClick={onClose}
              marginleft={"15px"}
              width={"150px"}
            />
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default function UserName({
  blockedUsers,
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
  const [blockedReason, setBlockedReason] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenCallModal,
    onOpen: onOpenCallModal,
    onClose: onCloseCallModal,
  } = useDisclosure();
  const isBlocked = params.id in blockedUsers;
  const activeCallsRef = dbRef(rtdb, "/active_calls");

  let isUserFriendRequested = false;
  friendRequests.forEach((request) => {
    if (request.hasOwnProperty(params.id)) {
      isUserFriendRequested = true;
      return;
    }
  });

  const saveCompressedPhotoURL = () => {
    getDownloadURL(storageRef(storage, `profile_pics/${user.uid}_profile`))
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
        console.log("Error getting compressed photo url");
      });
    setAlertText(
      t("Your profile picture was updated, please refresh to see changes")
    );
    onOpenSuccessAlert();
  };

  const handleOpenBlockedReasonInput = () => {
    onOpen();
  };

  const handleClickBlockFriend = async (targetID) => {
    handleBlockUser(targetID, blockedReason, user);
    onClose();
    navigate("/profile/" + params.id);
  };

  const handleClickCallFriend = (callerID) => {
    generateCallStatusEntryAndNavigate(
      callerID,
      activeCallsRef,
      user,
      navigate
    );
  };

  let buttonGroupRender = <div></div>;
  if (isBlocked) {
    buttonGroupRender = (
      <SecondaryButton
        onClick={() => navigate("/blockedpeople")}
        text={t("User Blocked")}
        width={"400px"}
        height={"45px"}
        marginTop={"10px"}
        marginLeft={"48px"}
      />
    );
  } else if (isRequestIncoming) {
    buttonGroupRender = (
      <ButtonGroup
        buttonTypeList={["primary", "secondary"]}
        textList={[t("Accept Friend Request"), t("Ignore Friend Request")]}
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
        onClickList={[() => {}, () => handleOpenBlockedReasonInput()]}
        isDisabledList={[true, false]}
        spacing={4}
        width={"200px"}
        height={"45px"}
        marginTop={"10px"}
        marginLeft={"48px"}
      />
    );
  } else if (params.id in userFriends && isOnline === "online") {
    buttonGroupRender = (
      <ButtonGroup
        buttonTypeList={["primary", "secondary"]}
        textList={[t("Call"), t("Block User")]}
        isDisabledList={[false, false]}
        onClickList={[
          () => onOpenCallModal(),
          () => handleOpenBlockedReasonInput(),
        ]}
        rightIconList={[<></>, <></>]}
        spacing={4}
        width={"200px"}
        height={"45px"}
        marginTop={"10px"}
        marginLeft={"48px"}
      />
    );
  } else if (params.id in userFriends && isOnline === "offline") {
    buttonGroupRender = (
      <ButtonGroup
        buttonTypeList={["primary", "secondary"]}
        textList={[t("Call"), t("Block User")]}
        isDisabledList={[true, false]}
        onClickList={[
          () =>
            handleClickCallFriend(params.id, activeCallsRef, user, navigate),
          () => handleOpenBlockedReasonInput(),
        ]}
        rightIconList={[<></>, <></>]}
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
          () => handleOpenBlockedReasonInput(),
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
      <ConfirmationModal
        isOpen={isOpenCallModal}
        onClose={onCloseCallModal}
        handleCallConfirm={handleClickCallFriend}
        displayName={displayName}
        userId={params.id}
        activeCallsRef={activeCallsRef}
        user={user}
        navigate={navigate}
      />
      <InputModal
        onClose={onClose}
        isOpen={isOpen}
        inputPrompt={t("Why are you blocking this user?")}
        onSubmitInput={() => handleClickBlockFriend(params.id)}
        setText={setBlockedReason}
      />
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
