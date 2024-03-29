import { ChakraProvider, Stack, Text } from "@chakra-ui/react";
import { rtdb } from "../../firebase";
import { set, ref } from "firebase/database";
import { useNavigate } from "react-router-dom";
import { UserAuth } from "../../contexts/AuthContext";
import Navbar from "../navbar";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import PrimaryButton from "../lingoshare-components/primarybutton";

export default function UserSelect() {
  const { user } = UserAuth();
  const [data, setData] = useState({
    isOnboarded: false,
    userDisplayName: user.displayName,
  });
  const navigate = useNavigate();
  const { t } = useTranslation();

  const navigateOnboarding = () => {
    navigate("/languageproficiency");
  };

  const handleSelection = (type) => {
    let userType = "";
    let newData = { ...data };
    if (type === "native") {
      userType = "native";
    } else {
      userType = "learner";
    }
    newData["userType"] = userType;
    console.log(newData);
    const userTypeRef = ref(rtdb, "users/" + user.uid);
    set(userTypeRef, newData);
    navigateOnboarding();
  };

  useEffect(() => {
    // create the default fields for the user
    let newData = {};
    newData["userType"] = null;
    newData["proficiency"] = null;
    newData["isOnboarded"] = false;
    const userRef = ref(rtdb, "users/" + user.uid);
    set(userRef, newData);
  }, []);

  return (
    <div>
      <Navbar currPage={"/userselect"} />
      <ChakraProvider>
        <div className="welcome-pg">
          <Text fontSize="4xl">{t("You are...")}</Text>
          <Stack
            direction={"row"}
            spacing={4}
            align={"center"}
            marginTop={"50px"}
          >
            <PrimaryButton
              className="selection-btn"
              width={"260px"}
              height={"50px"}
              text={t("A native Mandarin speaker")}
              onClick={() => handleSelection("native")}
            />
            <PrimaryButton
              className="selection-btn"
              width={"260px"}
              height={"50px"}
              text={t("Learning to speak Mandarin")}
              onClick={() => handleSelection("learner")}
            />
          </Stack>
        </div>
      </ChakraProvider>
    </div>
  );
}
