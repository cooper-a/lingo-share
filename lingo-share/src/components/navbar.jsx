import { ChakraProvider } from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserAuth } from "../contexts/AuthContext";
import "@fontsource/inter";
import { useTranslation } from "react-i18next";
import { ref, onValue, get, set } from "firebase/database";
import { rtdb } from "../firebase";
import LanguageToggle from "./lingoshare-components/languagetoggle";
import AccountOptions from "./lingoshare-components/accountoptions";
import "../styles/nav.css";

export default function Navbar({ currPage }) {
  const { user, logout } = UserAuth();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { t, i18n } = useTranslation();
  const [isEnglish, setIsEnglish] = useState(true);
  const pageTitles = {
    "/callfriend": t("Call a Friend"),
    "/meetnewfriends": t("Meet New Friends"),
    "/account": t("Profile"),
  };
  const showLogoPages = new Set([
    "/dashboard",
    "/login",
    "/signup",
    "/",
    "/home",
  ]);

  useEffect(() => {
    setIsEnglish(i18n.language === "en");
    if (user === null || Object.keys(user).length === 0) return;
    setIsLoggedIn(true);
  }, [user, i18n.language]);

  const handleClick = (path) => {
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
    navigate(currPage);
  };

  return (
    <div>
      <ChakraProvider>
        <div className="navbar">
          <div className="logo" onClick={() => handleClick("")}>
            {showLogoPages.has(currPage) ? (
              <div className="homepage-logo">
                <span className="title">LingoShare</span>
              </div>
            ) : (
              <div className="homepage-logo">
                {currPage in pageTitles && (
                  <span className="nav-title">
                    {" "}
                    <ArrowBackIcon
                      width={"25px"}
                      height={"25px"}
                      marginRight={"15px"}
                    />
                    {pageTitles[currPage]}
                  </span>
                )}
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
                  handleClick={handleClick}
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
