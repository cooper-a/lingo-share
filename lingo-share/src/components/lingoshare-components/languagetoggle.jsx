import * as React from "react";
import { Tag } from "@chakra-ui/react";

export default function LanguageToggle({ isEnglish, handleTranslate }) {
  return (
    <div>
      <Tag
        className="font"
        onClick={() => handleTranslate(isEnglish ? "zh" : "en")}
        size={"lg"}
        variant="solid"
        bgColor={isEnglish ? "#363636" : "white"}
        color={isEnglish ? "white" : "#363636"}
      >
        English
      </Tag>
      <Tag
        className="font"
        onClick={() => handleTranslate(isEnglish ? "zh" : "en")}
        size={"lg"}
        variant="solid"
        bgColor={isEnglish ? "white" : "#363636"}
        color={isEnglish ? "#363636" : "white"}
      >
        中文
      </Tag>
    </div>
  );
}
