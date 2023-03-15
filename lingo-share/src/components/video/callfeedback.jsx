import { Button, Input, Text } from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { UserAuth } from "../../contexts/AuthContext";
import "../../styles/homepage.css";
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
    navigate("/dashboard");
  };

  return (
    <div>
      <Navbar currPage="/callfeedback" />
      <div className="welcome-pg">
        <Text className="font" fontSize="3xl">
          {t("How was the call quality?")}
        </Text>
        <Button h="2.75rem" size="lg" onClick={() => setCallQuality(true)}>
          {t("Good")}
        </Button>
        <Button h="2.75rem" size="lg" onClick={() => setCallQuality(false)}>
          {t("Bad")}
        </Button>
        <Text className="font" fontSize="3xl">
          {t("How did your conversation go?")}
        </Text>
        <Button
          h="2.75rem"
          size="lg"
          onClick={() => setConversationQuality(true)}
        >
          {t("Good")}
        </Button>
        <Button
          h="2.75rem"
          size="lg"
          onClick={() => setConversationQuality(false)}
        >
          {t("Bad")}
        </Button>
        {submit ? (
          <Input
            placeholder={t("Can you tell us more? (optional)")}
            onChange={(e) => setComment(e.target.value)}
          />
        ) : null}

        <div>
          <Button onClick={() => handleSubmit()}>
            {submit ? t("Submit") : t("Skip")}
          </Button>
        </div>
      </div>
    </div>
  );
}
