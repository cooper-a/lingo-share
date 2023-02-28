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
} from "@chakra-ui/react";
import Icon from "@adeira/icons";
import React, { useEffect, useState } from "react";
import "../styles/nav.css";
import { useNavigate } from "react-router-dom";
import { UserAuth } from "../contexts/AuthContext";
import "@fontsource/inter";

export default function Navbar() {
  const { user, logout } = UserAuth();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (user === null || Object.keys(user).length === 0) return;
    setIsLoggedIn(true);
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

  return (
    <div>
      <ChakraProvider>
        <div className="navbar">
          <div className="logo" onClick={() => handleClick("")}>
            <div className="homepage-logo">
              <span className="title">LingoShare</span>
            </div>
          </div>
          {isLoggedIn && (
            <div className="logout-btn">
              <Menu>
                <MenuButton>
                  <HStack className={"avatar"}>
                    <Avatar size={"sm"} bg="grey" />
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
                    Account
                  </MenuItem>
                  <MenuDivider />
                  <MenuItem
                    paddingLeft={"13px"}
                    icon={<Icon name="lock" width={"19px"} height={"19px"} />}
                    onClick={() => handleLogout()}
                  >
                    Logout
                  </MenuItem>
                </MenuList>
              </Menu>
            </div>
          )}
        </div>
      </ChakraProvider>
    </div>
  );
}
