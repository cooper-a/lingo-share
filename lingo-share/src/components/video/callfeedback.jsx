import { Textarea, Text } from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { UserAuth } from "../../contexts/AuthContext";
import SelectionButton from "../lingoshare-components/selectionbutton";
import PrimaryButton from "../lingoshare-components/primarybutton";
import "../../styles/feedback.css";
import Navbar from "../navbar";
import { ref, set } from "firebase/database";
import { rtdb } from "../../firebase";

export default function CallFeedback() {
  const { user } = UserAuth();
  const navigate = useNavigate();
  const { state } = useLocation();
  const { callID, roomName } = state;
  const [submit, setSubmit] = useState(false);
  const [callQuality, setCallQuality] = useState(null);
  const [conversationQuality, setConversationQuality] = useState(null);
  const [comment, setComment] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    if (callQuality !== null || conversationQuality !== null) {
      setSubmit(true);
    }
  }, [callQuality, conversationQuality]);

  const handleSubmit = () => {
    if (submit === true) {
      const feedbackRef = ref(
        rtdb,
        `calls/${roomName}/${callID}/feedback/${user.uid}`
      );
      const feedbackObj = {
        callQuality: callQuality,
        conversationQuality: conversationQuality,
        comment: comment,
        displayName: user.displayName,
      };
      set(feedbackRef, feedbackObj);
      console.log(feedbackObj);
    }
    navigate("/dashboard");
  };

  return (
    <div>
      <Navbar currPage="/callfeedback" callID={callID} roomName={roomName} />
      <div className="feedback-pg">
        <Text className="font" fontSize="3xl">
          {t("How was the call quality?")}
        </Text>
        <div className="feedback-btn-group">
          <SelectionButton
            onClick={() => setCallQuality(true)}
            isSelected={callQuality}
            text={t("Good")}
          />
          <SelectionButton
            onClick={() => setCallQuality(false)}
            isSelected={callQuality !== null && callQuality === false}
            text={t("Bad")}
          />
        </div>
        <Text marginTop={"2rem"} fontSize="3xl">
          {t("How did your conversation go?")}
        </Text>
        <div className="feedback-btn-group">
          <SelectionButton
            onClick={() => setConversationQuality(true)}
            isSelected={conversationQuality}
            text={t("Good")}
          />
          <SelectionButton
            onClick={() => setConversationQuality(false)}
            isSelected={
              conversationQuality !== null && conversationQuality === false
            }
            text={t("Bad")}
          />
        </div>
        {submit ? (
          <Textarea
            marginTop={"3rem"}
            borderColor={"#393939"}
            width={"500px"}
            placeholder="Can you tell us more? (optional)"
            onChange={(e) => setComment(e.target.value)}
          />
        ) : null}
        <div className="skip-submit-btn">
          <PrimaryButton
            onClick={() => handleSubmit()}
            text={submit ? t("Submit") : t("Skip")}
          />
        </div>
      </div>
    </div>
  );
}
