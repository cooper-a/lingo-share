import * as React from "react";
import { Tag } from "@chakra-ui/react";

export default function LanguageToggle({ isEnglish, handleTranslate }) {
  return (
    <div>
      <Tag
        className="font"
        onClick={() => handleTranslate("en")}
        size={"lg"}
        variant="solid"
        bgColor={isEnglish ? "black" : "white"}
        color={isEnglish ? "white" : "black"}
      >
        English
      </Tag>
      <Tag
        className="font"
        onClick={() => handleTranslate("zh")}
        size={"lg"}
        variant="solid"
        bgColor={isEnglish ? "white" : "black"}
        color={isEnglish ? "black" : "white"}
      >
        中文
      </Tag>
    </div>
  );
}
