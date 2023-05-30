import React, { useRef } from "react";
import Image from "react-bootstrap/Image";
import { BsPencilFill } from "react-icons/bs";
import "./Avatar.scss";
import { uploadFoto } from "../../../firebase/media";
import { toast } from "react-hot-toast";
import axios from "axios";

export const Avatar = (props) => {
  const fileInputRef = useRef(null);
  const { id } = JSON.parse(localStorage.getItem("userInfo"));
  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  let displayName = "";
  let nickName = "";
  if (props.showDisplayName) {
    displayName = props.displayName;
    nickName = props.nickName;
  }

  let initials = "";
  if (!props.photoURL && displayName) {
    const nameArray = displayName.split(" ");
    initials =
      nameArray[0].charAt(0) +
      (nameArray.length > 1 ? nameArray[1].charAt(0) : "");
  }

  const handleFileChange = async (e) => {
    const img = e.target.files[0];
    if (img) {
      const toastId = toast.loading("Upload da imagem...", {
        position: "top-right",
      });
      uploadFoto(img, "/avatares")
        .then((url) => {
          toast.dismiss(toastId);
          axios
            .put(`${process.env.REACT_APP_IP}:3001/users/${id}/profile`, { avatar: url }, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } })
            .then((response) => {
              toast.success("Seus dados foram editados.", {
                position: "bottom-right",
                duration: 2000,
              });
              props.handleEdit()
            })
            .catch((error) => {
              toast.error("Algo deu errado.", {
                position: "bottom-right",
                duration: 2000,
              });
              console.log(error);
            });
        })
    }
  }

  return (
    <div className="avatar-container" onClick={props.onClick || undefined}>
      {props.upload ? (
        <div className="edit-icon" onClick={handleAvatarClick}>
          <BsPencilFill />
        </div>
      ) : null}
      <div className="circle">
        <div
          className="avatar-image"
          onClick={props.upload ? handleAvatarClick : null}
          style={{
            cursor: props.onClick ? "pointer" : "initial",
            ...props.size,
          }}
        >
          {props.photoURL ? (
            <Image
              roundedCircle
              src={props.photoURL}
              referrerPolicy="no-referrer"
            />
          ) : (
            <span className="avatar-initials">{initials}</span>
          )}
        </div>
      </div>
      <input
        type="file"
        accept=".png,.jpg,.jpeg,.gif"
        id="avatar-input"
        ref={fileInputRef}
        style={{ display: "none", cursor: "pointer" }}
        onChange={handleFileChange}
      />
    </div>
  );
};
