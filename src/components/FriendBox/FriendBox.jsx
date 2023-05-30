import { Card, Image, Modal, Button } from "react-bootstrap";
import { useState } from "react";
import axios from "axios";
import "./FriendBox.scss";
import { ButtonRadius } from "../Ui/ButtoRadius";
import { ImBlocked } from "react-icons/im";
import { toast } from "react-hot-toast";

export function FriendBox(props) {
  const [isFriend, setIsFriend] = useState(props.isFriend);
  const [showModal, setShowModal] = useState(false);
  const [showModalBlock, setShowModalBlock] = useState(false);

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const openModalBlock = () => {
    setShowModalBlock(true);
  };

  const closeModalBlock = () => {
    setShowModalBlock(false);
  };

  let initials = "";
  if (!props.photoURL && props.displayName) {
    const nameArray = props.displayName.split(" ");
    initials =
      nameArray[0].charAt(0) +
      (nameArray.length > 1 ? nameArray[1].charAt(0) : "");
  }

  function onBlock() {
    axios.put(`${process.env.REACT_APP_IP}:3001/friendships/${props.friendshipId}`, { blocked: true }, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } })
      .then((response) => {
        toast.success("Usuário bloqueado.", {
          position: "bottom-right",
          duration: 2500,
        })
        if (props.listFriends) {
          props.listFriends();
        }
      })
      .catch((error) => {
        toast.error(error.response.data.message, {
          position: "bottom-right",
          duration: 2500,
        })
      })
  }

  const createFriendship = async (senderId, receiverId, blocked) => {

    try {
      const response = await axios.post(
        process.env.REACT_APP_IP+":3001/friendships",
        {
          senderId,
          receiverId,
          blocked,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const novoFriendship = response.data;
    } catch (error) {
      console.error("Erro ao criar amizade:", error);
    }
  };

  const removeFriendship = async (friendshipId) => {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_IP}:3001/friendships/${friendshipId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setIsFriend(false);
      props.onFriendshipRemoved(friendshipId);
    } catch (error) {
      console.error("Erro ao remover amizade:", error);
    }
  };

  const handleFollow = () => {
    setIsFriend(true);
    createFriendship(props.id, props.friendId, false);
  };

  const handleUnfollow = () => {
    if (props.onFriendshipApp) {
      props.onFriendshipApp()
    }
    openModal();
  };
  return (
    <>
      <Card className="box-friends-container">
        <div className="d-flex justify-content-between">
          <div className="icon-esquerda-friendbox-inv"></div>
          <div className="box-friends-profile">
            {props.photoURL ? (
              <Image
                roundedCircle
                src={props.photoURL}
                referrerPolicy="no-referrer"
              />
            ) : (
              <span className="friends-initials">{initials}</span>
            )}
          </div>
          {
            props.id !== props.friendId &&
            isFriend &&
            props.showBlock &&
            <div onClick={openModalBlock} className="icon-block-friendbox-div"><ImBlocked className="icon-block-friendbox" /></div>
          }
        </div>
        <div className="name-box">{props.displayName}</div>
        <div className="user-nickname-box">{props.nickname}</div>
        {
          props.id !== props.friendId ?
            isFriend ? (
              <div className="btn-unfollow" onClick={handleUnfollow}>
                Parar de seguir
              </div>
            ) : (
              <div className="btn-follow" onClick={handleFollow}>
                Seguir
              </div>
            ) : (<div></div>)

        }
      </Card>
      <Modal
        show={showModal}
        onHide={closeModal}
        centered={true}
        animation={false}
      >
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <div className="d-flex justify-content-center">
            <p>Parar de seguir {props.displayName}?</p>
          </div>
          <div className="d-flex justify-content-center">
            <ButtonRadius
              className="btn rounded-pill bg-success border-success btn-speaker"
              label="Não"
              type="submit"
              onClick={closeModal}
            />
            <ButtonRadius
              className="btn rounded-pill btn-modal-deletar-sim btn-speaker"
              label="Sim"
              type="submit"
              onClick={() => {
                closeModal();
                removeFriendship(props.friendshipId);
              }}
            />
          </div>
        </Modal.Body>
      </Modal>
      <Modal show={showModalBlock} onHide={closeModalBlock} centered={true} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmação</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="mb-3">Tem certeza que deseja bloquear esse usuario?</p>
          <div className="d-flex justify-content-center">
            <ButtonRadius
              className="btn rounded-pill bg-success border-success btn-speaker mt-4"
              label="Não"
              type="submit"
              onClick={closeModalBlock}
            />
            <ButtonRadius
              className="btn rounded-pill btn-modal-deletar-sim btn-speaker mt-4"
              label="Sim"
              type="submit"
              onClick={onBlock}
            />
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
