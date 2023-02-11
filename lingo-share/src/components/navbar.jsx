import {
  ChakraProvider,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import Icon from "@adeira/icons";
import "../styles/nav.css";
import { useNavigate } from "react-router-dom";
import { UserAuth } from "../contexts/AuthContext";
import "@fontsource/handlee";

export default function Navbar() {
  const { user, logout } = UserAuth();
  const navigate = useNavigate();

  const handleClick = (path) => {
    navigate("/" + path);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
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
              {/* <Text paddingLeft={"10px"} fontSize={"4xl"}>
                LingoShare
              </Text> */}
              <span className="title">LingoShare</span>
            </div>
          </div>
          <div className="logout-btn">
            <Menu>
              <MenuButton
                as={IconButton}
                aria-label="Options"
                icon={<Icon className="user-icon" name="user_male" />}
                variant="outline"
              />
              <MenuList>
                <MenuItem
                  icon={<Icon className="menu-user-icon" name="settings" />}
                  onClick={() => handleClick("account")}
                >
                  Account
                </MenuItem>
                <MenuItem
                  icon={<Icon className="menu-user-icon" name="lock" />}
                  onClick={() => handleLogout()}
                >
                  Logout
                </MenuItem>
              </MenuList>
            </Menu>
          </div>
        </div>
      </ChakraProvider>
    </div>
  );
}
