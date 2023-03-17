import { ChakraProvider } from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserAuth } from "../contexts/AuthContext";
import { useTranslation } from "react-i18next";
import { ref, set } from "firebase/database";
import { rtdb } from "../firebase";
import LanguageToggle from "./lingoshare-components/languagetoggle";
import AccountOptions from "./lingoshare-components/accountoptions";
import "../styles/nav.css";

export default function Navbar({
  currPage,
  topLeftDisplay,
  prevPage,
  ...props
}) {
  const { user, logout } = UserAuth();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { t, i18n } = useTranslation();
  const [isEnglish, setIsEnglish] = useState(true);

  useEffect(() => {
    setIsEnglish(i18n.language === "en");
    if (user === null || Object.keys(user).length === 0) return;
    setIsLoggedIn(true);
  }, [user, i18n.language]);

  const handleNavigateClick = (path) => {
    if (prevPage) {
      navigate(prevPage);
      return;
    }
    navigate("/" + path);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
      setIsLoggedIn(false);
      console.log("logged out");
    } catch (e) {
      console.log(e.message);
    }
  };

  const handleTranslate = (lang) => {
    console.log("translate");
    // i18n.changeLanguage(i18n.language === "en" ? "zh" : "en");
    setIsEnglish(!isEnglish);
    i18n.changeLanguage(lang);
    if (user === null || Object.keys(user).length === 0) return;
    const languageRef = ref(rtdb, `users/${user.uid}/language`);
    set(languageRef, lang);
    console.log(currPage);
    if (currPage === "/callfeedback") {
      navigate("/callfeedback", {
        state: { roomName: props.roomName, callID: props.callID },
      });
      return;
    }
    navigate(currPage);
  };

  return (
    <div>
      <ChakraProvider>
        <div className="navbar">
          <div className="logo" onClick={() => handleNavigateClick("")}>
            {!topLeftDisplay ? (
              <div className="homepage-logo">
                <span className="title">LingoShare</span>
              </div>
            ) : (
              <div className="homepage-logo">
                <span className="nav-title">
                  {" "}
                  <ArrowBackIcon
                    width={"25px"}
                    height={"25px"}
                    marginRight={"15px"}
                  />
                  {topLeftDisplay}
                </span>
              </div>
            )}
          </div>
          <div className="top-right-settings">
            <div className="translate-btn">
              <LanguageToggle
                isEnglish={isEnglish}
                handleTranslate={handleTranslate}
              />
            </div>
            {isLoggedIn && (
              <div className="logout-btn">
                <AccountOptions
                  user={user}
                  handleClick={handleNavigateClick}
                  handleLogout={handleLogout}
                />
              </div>
            )}
          </div>
        </div>
      </ChakraProvider>
    </div>
  );
}
