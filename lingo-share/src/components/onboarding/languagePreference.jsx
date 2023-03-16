import { ChakraProvider, Stack, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { UserAuth } from "../../contexts/AuthContext";
import React from "react";
import { rtdb } from "../../firebase";
import { ref, set } from "firebase/database";
import { useTranslation } from "react-i18next";
import Navbar from "../navbar";
import PrimaryButton from "../lingoshare-components/primarybutton";

export default function LanguagePreference() {
  const navigate = useNavigate();
  const { user } = UserAuth();
  const { t } = useTranslation();

  const handleClick = (lang, path) => {
    console.log("language preference selected");
    const languageRef = ref(rtdb, `users/${user.uid}/language`);
    set(languageRef, lang);
    navigate("/" + path);
  };

  return (
    <div>
      <Navbar currPage={"/languagepreference"} />
      <ChakraProvider>
        <div className="welcome-pg">
          <Text fontSize="2xl">
            {t("Would you prefer to use LingoShare in English or Mandarin?")}
          </Text>
          <Text fontSize="xl">
            {t("You can always change the language later!")}
          </Text>
          <Stack
            direction={"row"}
            spacing={4}
            align={"center"}
            marginTop={"50px"}
          >
            <PrimaryButton
              className="btn"
              width={"180px"}
              height={"50px"}
              text={t("English")}
              onClick={() => handleClick("en", "welcomepage")}
            />
            <PrimaryButton
              className="btn"
              width={"180px"}
              height={"50px"}
              text={t("中文")}
              onClick={() => handleClick("zh", "welcomepage")}
            />
          </Stack>
        </div>
      </ChakraProvider>
    </div>
  );
}
