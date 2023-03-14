import { Text } from "@chakra-ui/react";
import { UserAuth } from "../contexts/AuthContext";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from "firebase/storage";
import { ref as dbRef, set } from "firebase/database";
import { rtdb, storage } from "../firebase";
import React, { useState } from "react";
import { updateProfile } from "firebase/auth";
import Icon from "@adeira/icons";

export default function ProfilePicture({ curPage, onOpenSuccessAlert }) {
  const [photoBinary, setPhotoBinary] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = UserAuth();
  const { t } = useTranslation();

  const uploadProfilePicture = (file) => {
    const fileRef = storageRef(storage, `profile_pics/${user.uid}_profile`);
    setLoading(true);
    uploadBytes(fileRef, file).then((snapshot) => {
      setLoading(false);
      setPhotoBinary(null);
      console.log("Uploaded a profile pic!");
      saveCompressedPhotoURL();
      window.location.reload();
    });
  };

  const saveCompressedPhotoURL = () => {
    getDownloadURL(
      storageRef(storage, `profile_pics/${user.uid}_profile_150x150`)
    )
      .then((url) => {
        updateProfile(user, {
          photoURL: url, // save the compressed photo url to auth context
        });
        set(dbRef(rtdb, `users/${user.uid}/profilePic`), url);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleChange = (event) => {
    if (event.target.files[0]) {
      setPhotoBinary(event.target.files[0]);
      uploadProfilePicture(event.target.files[0]);
    }
  };

  return (
    <div>
      <label>
        <input type="file" onChange={handleChange} hidden />
        <Text cursor="pointer" className="font" fontSize={"xs"}>
          <Icon cursor="pointer" width="20px" height="20px" name="upload" />
          Upload Photo
        </Text>
        {/* <Icon cursor="pointer" width="30px" height="30px" name="upload" /> */}
      </label>
    </div>
  );
}
