import { ChakraProvider, Text } from "@chakra-ui/react";
import { onValue, ref, set } from "firebase/database";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { UserAuth } from "../../contexts/AuthContext";
import { rtdb } from "../../firebase";
import "../../styles/onboarding.css";
import PrimaryButton from "../lingoshare-components/primarybutton";
import Navbar from "../navbar";

export default function LanguageProficiency() {
  const navigate = useNavigate();
  const [userType, setUserType] = useState("");
  const [snapshotData, setSnapshotData] = useState({});
  const { user } = UserAuth();
  const user_documents = ref(rtdb, "users/" + user.uid);
  const { t } = useTranslation();

  const navigateOnboarding = () => {
    navigate("/languagepreference");
  };

  const handleSelection = (proficiency) => {
    let newData = { ...snapshotData };
    newData["proficiency"] = proficiency;
    console.log(newData);
    const userTypeRef = ref(rtdb, "users/" + user.uid);
    set(userTypeRef, newData);
    navigateOnboarding();
  };

  useEffect(() => {
    onValue(user_documents, (snapshot) => {
      const snapshotVal = snapshot.val();
      setSnapshotData(snapshotVal);
      console.log(snapshotVal);
      const { type } = snapshotVal;
      setUserType(type);
    });
  }, []);

  return (
    <div>
      <Navbar currPage={"/languageproficiency"} />
      <ChakraProvider>
        <div className="onboard-grid">
          <div className="grid-item">
            <Text fontSize="4xl">
              {t("How well can you speak")}{" "}
              {userType === "native" ? t("English") : t("Mandarin")}?
            </Text>
          </div>
          <div className="grid-btns">
            <div className="grid-item-btn">
              <PrimaryButton
                width={"280px"}
                height={"50px"}
                text={t("Can speak it well")}
                onClick={() => handleSelection("well")}
              />
            </div>
            <div className="grid-item-btn">
              <PrimaryButton
                width={"280px"}
                height={"50px"}
                text={t("Can speak some of it")}
                onClick={() => handleSelection("okay")}
              />
            </div>
            <div className="grid-item-btn">
              <PrimaryButton
                width={"280px"}
                height={"50px"}
                text={t("Getting started with it")}
                onClick={() => handleSelection("poor")}
              />
            </div>
          </div>
        </div>
      </ChakraProvider>
    </div>
  );
}
