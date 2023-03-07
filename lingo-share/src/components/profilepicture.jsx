import { UserAuth } from "../contexts/AuthContext";
import { useTranslation } from "react-i18next";
import {
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from "firebase/storage";
import { ref as dbRef, set } from "firebase/database";
import { rtdb, storage } from "../firebase";
import React, { useState } from "react";

export default function ProfilePicture() {
  const [photoBinary, setPhotoBinary] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = UserAuth();
  const { t } = useTranslation();

  const uploadProfilePicture = (file) => {
    const fileRef = storageRef(storage, `profile_pics/${user.uid}_profile`);
    setLoading(true);
    uploadBytes(fileRef, file).then((snapshot) => {
      getDownloadURL(fileRef)
        .then((url) => {
          console.log(url);
          set(dbRef(rtdb, `users/${user.uid}/profilePic`), url);
        })
        .catch((error) => {
          console.log(error);
        });
      setLoading(false);
      setPhotoBinary(null);
      console.log("Uploaded a profile pic!");
    });
  };

  const handleChange = (event) => {
    if (event.target.files[0]) {
      setPhotoBinary(event.target.files[0]);
    }
  };

  const handleClick = () => {
    uploadProfilePicture(photoBinary);
  };

  return (
    <div>
      <input type="file" onChange={handleChange} />
      <button disabled={loading || !photoBinary} onClick={handleClick}>
        {t("Upload")}
      </button>
    </div>
  );
}
