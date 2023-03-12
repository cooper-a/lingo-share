import * as React from "react";
import {
  Menu,
  MenuButton,
  HStack,
  Avatar,
  VStack,
  Box,
  MenuDivider,
  MenuList,
  MenuItem,
  Text,
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
            <Avatar size={"sm"} bg="grey" src={user.photoURL} />
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
              <Icon name={"chevron_down"} width={"30px"} height={"30px"} />
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
  );
}
