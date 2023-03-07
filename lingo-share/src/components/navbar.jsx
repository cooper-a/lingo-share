import {
  Avatar,
  Box,
  ChakraProvider,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  HStack,
  VStack,
  Text,
  Tag,
} from "@chakra-ui/react";
import Icon from "@adeira/icons";
import React, { useEffect, useState } from "react";
import "../styles/nav.css";
import { useNavigate } from "react-router-dom";
import { UserAuth } from "../contexts/AuthContext";
import "@fontsource/inter";
import { useTranslation } from "react-i18next";
import { ref as storageRef, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase";

export default function Navbar() {
  const { user, logout } = UserAuth();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { t, i18n } = useTranslation();
  const [isEnglish, setIsEnglish] = useState(true);
  const [profilePicSrc, setProfilePicSrc] = useState(null);
  // const usersRef = ref(rtdb, "/users");

  useEffect(() => {
    if (user === null || Object.keys(user).length === 0) return;
    setIsLoggedIn(true);
    checkIfProfilePicExists();
  }, [user]);

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
  };

  const checkIfProfilePicExists = () => {
    getDownloadURL(
      storageRef(storage, `profile_pics/${user.uid}_profile_150x150`)
    )
      .then((url) => {
        setProfilePicSrc(url);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div>
      <ChakraProvider>
        <div className="navbar">
          <div className="logo" onClick={() => handleClick("")}>
            <div className="homepage-logo">
              <span className="title">LingoShare</span>
            </div>
          </div>
          <div className="top-right-settings">
            <div className="translate-btn">
              <Tag
                onClick={() => handleTranslate("en")}
                size={"lg"}
                variant="solid"
                bgColor={isEnglish ? "black" : "white"}
                color={isEnglish ? "white" : "black"}
              >
                English
              </Tag>
              <Tag
                onClick={() => handleTranslate("zh")}
                size={"lg"}
                variant="solid"
                bgColor={isEnglish ? "white" : "black"}
                color={isEnglish ? "black" : "white"}
              >
                中文
              </Tag>
            </div>
            {isLoggedIn && (
              <div className="logout-btn">
                <Menu>
                  <MenuButton>
                    <HStack className={"avatar"}>
                      <Avatar size={"sm"} src={profilePicSrc} bg="grey" />
                      <VStack
                        display={{ base: "none", md: "flex" }}
                        alignItems="flex-start"
                        spacing="1px"
                        ml="2"
                      >
                        <Text fontSize="sm">{user.displayName}</Text>
                        <Text fontSize="xs" color="gray.600">
                          {user.email}
                        </Text>
                      </VStack>
                      <Box display={{ base: "none", md: "flex" }}>
                        <Icon
                          name={"chevron_down"}
                          width={"30px"}
                          height={"30px"}
                        />
                      </Box>
                    </HStack>
                  </MenuButton>
                  <MenuList>
                    <MenuItem
                      icon={<Icon className="menu-user-icon" name="settings" />}
                      onClick={() => handleClick("account")}
                    >
                      {t("Account")}
                    </MenuItem>
                    <MenuDivider />
                    <MenuItem
                      paddingLeft={"13px"}
                      icon={<Icon name="lock" width={"19px"} height={"19px"} />}
                      onClick={() => handleLogout()}
                    >
                      {t("Logout")}
                    </MenuItem>
                  </MenuList>
                </Menu>
              </div>
            )}
          </div>
        </div>
      </ChakraProvider>
    </div>
  );
}
