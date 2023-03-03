import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// the translations
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = {
  en: {
    translation: {
      "Call a Friend": "Call a Friend",
      "How to Use this App": "How to Use this App",
      "Meet New Friends": "Meet New Friends",
      "Your Friends": "Your Friends",
      Logout: "Logout",
      Settings: "Settings",
      Language: "Change to Chinese",
      "Your Profile": "Your Profile",
      "Page Not Found": "Page Not Found",
      "The page you are looking for does not exist.":
        "The page you are looking for does not exist.",
      "Go to Home": "Go to Home",
      "User not found": "User not found",
      "Incorrect password": "Incorrect password",
      "Please enter a valid email": "Please enter a valid email",
      Email: "Email",
      "password...": "password...",
      "Log In": "Log In",
      Login: "Login",
    },
  },
  zh: {
    translation: {
      "Call a Friend": "呼叫朋友",
      "How to Use this App": "如何使用此应用程序",
      "Meet New Friends": "认识新朋友",
      "Your Friends": "你的朋友",
      Logout: "登出",
      Settings: "设置",
      Language: "切换到英文",
      "Your Profile": "你的个人资料",
      "Page Not Found": "页面未找到",
      "The page you are looking for does not exist.": "您要查找的页面不存在。",
      "Go to Home": "回到主页",
      "User not found": "用户未找到",
      "Incorrect password": "密码错误",
      "Please enter a valid email": "请输入有效的电子邮件地址",
      Email: "电子邮件",
      "password...": "密码...",
      "Log In": "登录",
      Login: "登录",
    },
  },
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: "en", // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
    // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
    // if you're using a language detector, do not define the lng option

    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
