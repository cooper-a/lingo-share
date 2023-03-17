import React from "react";
import { Card, CardHeader, Avatar, Box, Text, Flex } from "@chakra-ui/react";
import PrimaryButton from "./primarybutton";
import SecondaryButton from "./secondarybutton";
import TertiaryButton from "./tertiarybutton";
import { useTranslation } from "react-i18next";

export default function CompactProfileCard({
  profileURL,
  displayNameText,
  subheadingText,
  moreSubheadingText,
  disableButton,
  primaryButtonWidth,
  secondaryButtonWidth,
  primaryButtonText,
  secondaryButtonText,
  tertiaryButtonText,
  primaryButtonClick,
  secondaryButtonClick,
  tertiaryButtonClick,
  marginLeft,
  marginRight,
  marginTop,
  marginBottom,
}) {
  const { t } = useTranslation();

  return (
    <div>
      <Card
        className="call-card"
        borderWidth={"1px"}
        borderColor={"#363636"}
        width={"700px"}
        height={"115px"}
        rounded={"2xl"}
      >
        <CardHeader>
          <Flex spacing="4">
            <Flex flex="1" gap="4" alignItems="center" flexWrap="wrap">
              <Avatar bg="grey" src={profileURL} />

              <div className="card-name-heading">
                {displayNameText && (
                  <Text float={"left"} fontWeight={"bold"} fontSize="lg">
                    {displayNameText}
                  </Text>
                )}
                <Text>{subheadingText}</Text>
                <Text className="font" float={"left"}>
                  {moreSubheadingText}
                </Text>
              </div>
            </Flex>
            <Box alignSelf={"center"}>
              {tertiaryButtonText && (
                <TertiaryButton
                  onClick={tertiaryButtonClick}
                  marginRight={"15px"}
                  text={tertiaryButtonText}
                />
              )}
              {secondaryButtonText && (
                <SecondaryButton
                  marginLeft={"20px"}
                  marginRight={"15px"}
                  width={secondaryButtonWidth}
                  text={secondaryButtonText}
                  onClick={secondaryButtonClick}
                />
              )}
              {primaryButtonText && (
                <PrimaryButton
                  marginLeft={"20px"}
                  marginRight={"15px"}
                  width={primaryButtonWidth}
                  text={primaryButtonText}
                  onClick={primaryButtonClick}
                />
              )}
            </Box>
          </Flex>
        </CardHeader>
      </Card>
    </div>
  );
}
