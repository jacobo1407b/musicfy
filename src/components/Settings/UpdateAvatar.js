import React, { useState, useCallback } from "react";
import { Image } from "semantic-ui-react";
import { useDropzone } from "react-dropzone";
import NoAvatar from "../../assets/png/original.png";
import { toast } from "react-toastify";
import firebase from "../../utils/Firebase";
import "firebase/storage";
import "firebase/auth";

export default function UpdateAvatar(props) {
  const { user, setReloadApp } = props;
  const [avatarUrl, setAvatarUrl] = useState(user.photoURL);

  const onDrop = useCallback(
    (acceptedFiles) => {
      const uploadImage = (file) => {
        const ref = firebase.storage().ref().child(`avatar/${user.uid}`);
        return ref.put(file);
      };
      const updateUserAvatar = () => {
        firebase
          .storage()
          .ref(`avatar/${user.uid}`)
          .getDownloadURL()
          .then(async (res) => {
            console.log(res);
            await firebase.auth().currentUser.updateProfile({ photoURL: res });
            setReloadApp((prev) => !prev);
          })
          .catch(() => {
            toast.error("Error al actualizar el avatar");
          });
      };
      const file = acceptedFiles[0];
      setAvatarUrl(URL.createObjectURL(file));
      uploadImage(file).then(() => {
        updateUserAvatar();
      });
    },
    [setReloadApp, user.uid]
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: "image/jpeg, image/png",
    noKeyboard: true,
    onDrop,
  });

  return (
    <div className="user-avatar" {...getRootProps()}>
      <input {...getInputProps()} />
      {isDragActive ? (
        <Image src={NoAvatar} />
      ) : (
        <Image src={avatarUrl ? avatarUrl : NoAvatar} />
      )}
    </div>
  );
}
