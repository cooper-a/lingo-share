import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "../firebase";
import {
  ref,
  set,
  onValue,
  serverTimestamp,
  onDisconnect,
} from "firebase/database";
import { rtdb } from "../firebase";

const UserContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState({});

  const createUser = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const logout = () => {
    console.log(user);
    var userStatusDatabaseRef = ref(rtdb, "/status/" + user.uid);
    var isOfflineForDatabase = {
      state: "offline",
      last_changed: serverTimestamp(),
    };
    set(userStatusDatabaseRef, isOfflineForDatabase);
    return signOut(auth);
  };

  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const checkStatus = (user) => {
    console.log(user);
    console.log("checking status");
    if (user && user.uid) {
      var uid = user.uid;
      var userStatusDatabaseRef = ref(rtdb, "/status/" + uid);
      var isOfflineForDatabase = {
        state: "offline",
        last_changed: serverTimestamp(),
      };
      var isOnlineForDatabase = {
        state: "online",
        last_changed: serverTimestamp(),
      };

      const connectedRef = ref(rtdb, ".info/connected");

      onValue(connectedRef, (snapshot) => {
        if (snapshot.val() === true) {
          onDisconnect(userStatusDatabaseRef).set(isOfflineForDatabase);
          set(userStatusDatabaseRef, isOnlineForDatabase);
        }
      });
    }
  };

  useEffect(() => {
    checkStatus(user);
  }, [user]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      // console.log(currentUser);
      // console.log("auth state changed");
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider
      value={{ createUser, user, logout, login, checkStatus }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const UserAuth = () => {
  return useContext(UserContext);
};
