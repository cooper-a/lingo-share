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
      "Can speak it well": "Can speak it well",
      "Can speak some of it": "Can speak some of it",
      "Getting started with it": "Getting started with it",
      "Who would you like to call?": "Who would you like to call?",
      "Welcome to LingoShare!": "Welcome to LingoShare!",
      Online: "Online",
      Offline: "Offline",
      Call: "Call",
      Upload: "Upload",
      "It seems like you don't have any friends yet.":
        "It seems like you don't have any friends yet.",
      "Add as Friend": "Add as Friend",
      "Remove Friend": "Remove Friend",
      Profile: "Profile",
      "View Profile": "View Profile",
      "These people are also using LingoShare":
        "These people are also using LingoShare",
      " is calling you": " is calling you",
      Accept: "Accept",
      "Blocked People": "Blocked People",
      "Friend Request Sent": "Friend Request Sent",
      "No interests to show yet": "No interests to show yet",
      "Save Changes": "Save Changes",
      "Native Mandarin Speaker": "Native Mandarin Speaker",
      "Mandarin Learner": "Mandarin Learner",
      "Block User": "Block User",
      Friends: "Friends",
      About: "About",
      "Click here to enter a bio about yourself...":
        "Click here to enter a bio about yourself...",
      Interests: "Interests",
      "Add an interest": "Add an interest",
      Add: "Add",
      "Getting started with ": "Getting started with ",
      "Speaks some ": "Speaks some ",
      "Speaks ": "Speaks ",
      " well": " well",
      "LingoShare is a place where you can meet Mandarin speakers and learners!":
        "LingoShare is a place where you can meet Mandarin speakers and learners!",
      "Connect and form friendships by learning from one another!":
        "Connect and form friendships by learning from one another!",
      Next: "Next",
      "Create an Account": "Create an Account",
      "First, we need to get you set up!": "First, we need to get you set up!",
      "Log in or create an account below": "Log in or create an account below",
      "Upload Photo": "Upload Photo",
      "'s Profile": "'s Profile",
      "You don't have any LingoShare friends yet!":
        "You don't have any LingoShare friends yet!",
      "Your profile changes were saved": "Your profile changes were saved",
      "Success!": "Success!",
      "Your profile picture was updated, please refresh to see changes":
        "Your profile picture was updated, please refresh to see changes",
      "Incoming Friend Request": "Incoming Friend Request",
      "sent you a friend request!": "sent you a friend request!",
      Ignore: "Ignore",
      "Call ": "Call ",
      Yes: "Yes",
      No: "No",
      "Choose a Topic": "Choose a Topic",
      "Turn off Camera": "Turn off Camera",
      "Turn on Camera": "Turn on Camera",
      "Turn off Mic": "Turn off Mic",
      "Turn on Mic": "Turn on Mic",
      "Text Size": "Text Size",
      "Leave Call": "Leave Call",
      "What do you want to talk about": "What do you want to talk about",
      "Chinese Tradition": "Chinese Tradition",
      Family: "Family",
      Food: "Food",
      Good: "Good",
      Bad: "Bad",
      "How was the call quality?": "How was the call quality?",
      "How did your conversation go?": "How did your conversation go?",
      "Can you tell us more? (optional)": "Can you tell us more? (optional)",
      Skip: "Skip",
      Submit: "Submit",
      "Thanks for your feedback!": "Thanks for your feedback!",
      "Back to LingoShare": "Back to LingoShare",
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
      // TODO - translate lines 159 to 161
      "Can speak it well": "Can speak it well",
      "Can speak some of it": "Can speak some of it",
      "Getting started with it": "Getting started with it",
      "Who would you like to call?": "你想与谁通话？",
      "Welcome to LingoShare!": "欢迎来到LingoShare!",
      Online: "在线",
      Offline: "离线",
      Call: "呼叫",
      Upload: "上传",
      "It seems like you don't have any friends yet.": "你还没有任何好友呢",
      "Add as Friend": "添加为好友",
      "Remove Friend": "删除好友",
      Profile: "个人资料",
      "View Profile": "查看用户首页",
      "These people are also using LingoShare": "这些用户也在使用LingoShare",
      " is calling you": " 正在呼叫你",
      Accept: "接受",
      "Friend Request Sent": "好友请求已发送",
      "No interests to show yet": "用户没有输入任何兴趣",
      "Save Changes": "保存更改",
      "Native Mandarin Speaker": "中文是我的母语",
      "Mandarin Learner": "正在学习中文",
      "Block User": "屏蔽用户",
      Friends: "好友",
      About: "简介",
      "Click here to enter a bio about yourself...":
        "点击这里来介绍一下自己...",
      Interests: "爱好",
      "Add an interest": "添加一些爱好",
      Add: "添加",
      "Getting started with ": "只会一点点",
      "Speaks some ": "会说一些",
      "Speaks ": "会说流利的",
      " well": " ",
      "LingoShare is a place where you can meet Mandarin speakers and learners!":
        "LingoShare是一个让你能与中文学习者和中文母语使用者相遇的地方！",
      "Connect and form friendships by learning from one another!":
        "让我们互相学习并结交朋友吧！",
      Next: "下一步",
      "Create an Account": "创建账户",
      "First, we need to get you set up!": "首先，我们需要帮你设立一个账户！",
      "Log in or create an account below": "登录或者创建一个新账户",
      "Upload Photo": "上传照片",
      "'s Profile": "的个人资料",
      "You don't have any LingoShare friends yet!": "你还没有任何好友！",
      "Your profile changes were saved": "你的个人资料更改已保存",
      "Success!": "更改成功！",
      "Your profile picture was updated, please refresh to see changes":
        "你的个人头像已更新，请刷新页面查看",
      "Incoming Friend Request": "收到好友请求",
      "sent you a friend request!": "想要添加你为好友！",
      Ignore: "忽略",
      "Call ": "呼叫 ",
      Yes: "确认",
      No: "取消",
      "Choose a Topic": "选择一个话题",
      "Turn off Camera": "关闭摄像头",
      "Turn on Camera": "打开摄像头",
      "Turn off Mic": "关闭麦克风",
      "Turn on Mic": "打开麦克风",
      "Text Size": "字体大小",
      "Leave Call": "结束通话",
      "What do you want to talk about": "你想聊些什么话题",
      "Blocked People": "屏蔽的用户",
      "Chinese Tradition": "中国传统文化",
      Family: "家庭",
      Food: "饮食文化",
      Good: "好",
      Bad: "差",
      Skip: "跳过",
      Submit: "提交",
      "How was the call quality?": "How was the call quality?",
      "How did your conversation go?": "How did your conversation go?",
      "Can you tell us more? (optional)": "Can you tell us more? (optional)",
      "Thank you for your feedback!": "Thank you for your feedback!",
      "Back to LingoShare": "Back to LingoShare",
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
