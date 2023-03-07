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
      "You are...": "You are...",
      "A native Mandarin speaker": "A native Mandarin speaker",
      "Learning to speak Mandarin": "Learning to speak Mandarin",
      "All done! We hope you enjoy LingoShare":
        "All done! We hope you enjoy LingoShare",
      "Get Started": "Get Started",
      "User Email": "User Email",
      Account: "Account",
      "Welcome to LingoShare": "Welcome to LingoShare",
      "Sign Up": "Sign Up",
      "First name missing": "First name missing",
      "Last name missing": "Last name missing",
      "Email is already in use": "Email is already in use",
      "First Name": "First Name",
      "Last Name": "Last Name",
      Show: "Show",
      Hide: "Hide",
      "Enter password": "Enter password",
      "How well can you speak": "How well can you speak",
      English: "English",
      Mandarin: "Mandarin",
      Well: "Well",
      Okay: "Okay",
      Poorly: "Poorly",
      "Who would you like to call?": "Who would you like to call?",
      "Welcome to LingoShare!": "Welcome to LingoShare!",
      Online: "Online",
      Offline: "Offline",
      Call: "Call",
    },
  },
  zh: {
    translation: {
      "Call a Friend": "呼叫好友",
      "How to Use this App": "如何使用此应用程序",
      "Meet New Friends": "探索新朋友",
      "Your Friends": "你的好友",
      Logout: "登出",
      Settings: "设置",
      Language: "切换到英文",
      "Your Profile": "个人资料",
      "Page Not Found": "页面未找到",
      "The page you are looking for does not exist.": "您要查找的页面不存在",
      "Go to Home": "回到主页",
      "User not found": "用户未找到",
      "Incorrect password": "密码错误",
      "Please enter a valid email": "请输入有效的电子邮件地址",
      Email: "电子邮件",
      "password...": "密码...",
      "Log In": "登录",
      Login: "登录",
      "You are...": "你是...",
      "A native Mandarin speaker": "中文是我的母语",
      "Learning to speak Mandarin": "正在学习中文",
      "All done! We hope you enjoy LingoShare": "完成！希望你会喜欢LingoShare",
      "Get Started": "开始",
      "User Email": "用户电子邮件",
      Account: "帐户",
      "Welcome to LingoShare": "欢迎来到LingoShare",
      "Sign Up": "注册",
      "First name missing": "缺少名字",
      "Last name missing": "缺少姓氏",
      "Email is already in use": "电子邮件已被使用",
      "First Name": "名字",
      "Last Name": "姓氏",
      Show: "显示",
      Hide: "隐藏",
      "Enter password": "输入密码",
      "How well can you speak": "你的中文水平如何",
      English: "英语",
      Mandarin: "中文",
      Okay: "一般般",
      Well: "流利",
      Poorly: "差",
      "Who would you like to call?": "你想与谁通话？",
      "Welcome to LingoShare!": "欢迎来到LingoShare！",
      // TODO - translate these
      Online: "在线",
      Offline: "离线",
      Call: "呼叫",
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