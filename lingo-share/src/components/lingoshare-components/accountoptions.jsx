import * as React from "react";
import {
  Menu,
  MenuButton,
  HStack,
  Avatar,
  MenuDivider,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import Icon from "@adeira/icons";

export default function AccountOptions({ user, handleClick, handleLogout }) {
  const { t, i18n } = useTranslation();

  return (
    <div>
      <Menu>
        <MenuButton>
          <HStack className={"avatar"}>
            <Avatar size={"md"} bg="grey" src={user.photoURL} />
          </HStack>
        </MenuButton>
        <MenuList>
          <MenuItem
            icon={<Icon className="menu-user-icon" name="settings" />}
            onClick={() => handleClick("profile/" + user.uid)}
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
  );
}
