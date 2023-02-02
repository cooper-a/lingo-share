import {
  Button,
  ChakraProvider,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
// import {
//   AddIcon,
//   EditIcon,
//   ExternalLinkIcon,
//   HamburgerIcon,
//   RepeatIcon,
//   WarningIcon,
// } from "@chakra-ui/icons";
import "../styles/nav.css";
import { useNavigate } from "react-router-dom";
import { UserAuth } from "../contexts/AuthContext";

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
            <Text fontSize={"4xl"}>LingoShare</Text>
          </div>
          {/* <Button className="logout-btn" onClick={handleLogout} variant="link">
            Logout
          </Button> */}
          <div className="logout-btn">
            {/* <Menu className="logout-btn">
              <MenuButton
                as={IconButton}
                aria-label="Options"
                icon={<HamburgerIcon />}
                variant="outline"
              />
              <MenuList>
                <MenuItem icon={<ExternalLinkIcon />} command="⌘N">
                  Account
                </MenuItem>
                <MenuItem icon={<RepeatIcon />} command="⌘⇧N">
                  Open Closed Tab
                </MenuItem>
                <MenuItem icon={<EditIcon />} command="⌘O">
                  Open File...
                </MenuItem>
              </MenuList>
            </Menu> */}
          </div>
        </div>
      </ChakraProvider>
    </div>
  );
}
