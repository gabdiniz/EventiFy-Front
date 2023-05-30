import React, { useState, useRef, useEffect, useCallback } from "react";
import { Sidebar } from "../../components/Sidebar/Sidebar";
import { Avatar } from "../../components/Ui/Avatar/Avatar";
import { BsSearch } from "react-icons/bs";
import { Container } from "react-bootstrap";
import { FriendBox } from "../../components/FriendBox/FriendBox";
import axios from "axios";
import { toast } from "react-hot-toast";
import { ButtonBackTop } from "../../components/Ui/ButtonBackTop/ButtonBackTop";
import "./Friends.scss";
import { Loader } from "../../components/Loader/Loader";

export function Friends(props) {
  const [friends, setFriends] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [user, setUser] = useState();
  const [load, setLoad] = useState(true);

  const inputRef = useRef(null);
  const { id, role } = JSON.parse(localStorage.getItem("userInfo"));
  const [admins, setAdmins] = useState(false);

  useEffect(() => {
    setLoad(true);

    setTimeout(() => {
      setAdmins(role !== "superAdmin" && role !== "admin" ? true : false);
      setLoad(false);
    }, 500);
  }, [role]);


  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_IP}:3001/users/?id=${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((user) => {
        const info = {
          nome: user.data.fullname,
          apelido: user.data.profile.nickname,
          avatar: user.data.profile.avatar,
        };
        setUser(info);
      })
      .catch((error) => {
        toast.error(error.response.data.message, {
          position: "bottom-right",
          duration: 2500,
        });
      });
  }, [id]);

  async function listFriends() {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_IP}:3001/friendships?id=${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const friends = response.data;
      setFriends(friends);
      setFiltered(friends);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    listFriends();
  }, [id]);

  const changeFriends = useCallback(
    (event) => {
      setSearchValue(event.target.value);
      const filtered = friends.filter((friend) => {
        const displayName =
          friend.receiverId === id
            ? friend.sender.fullname
            : friend.receiver.fullname;
        const nickname =
          friend.receiverId === id
            ? friend.sender.profile.nickname
            : friend.receiver.profile.nickname;

        const lowerCaseSearchValue = event.target.value.toLowerCase();
        return (
          displayName.toLowerCase().includes(lowerCaseSearchValue) ||
          nickname.toLowerCase().includes(lowerCaseSearchValue)
        );
      });
      setFiltered(filtered);
    },
    [friends, id]
  );

  const handleFriendshipRemoved = (friendshipId) => {
    setFriends((prevFriends) =>
      prevFriends.filter((friend) => friend.id !== friendshipId)
    );
    setFiltered((prevFiltered) =>
      prevFiltered.filter((friend) => friend.id !== friendshipId)
    );
  };

  return (
    <div className="section-styler">
      <Sidebar />
      {load ? (
        <Loader />
      ) : (
        <>
          {admins
            ?
            <>
              <div className="subheader-profile">
                <div className="profile-informations">
                  <div className="search-box-mobile">
                    <input
                      ref={inputRef}
                      placeholder="Pesquisar..."
                      className="input-search-mobile"
                      type="text"
                      value={searchValue}
                      onChange={changeFriends}
                    />
                    <BsSearch className="icon-search-mobile" />
                  </div>
                  <Avatar
                    className="current-img"
                    size={{
                      width: 60,
                      height: 60,
                    }}
                    showDisplayName={true}
                    displayName={user?.nome}
                    photoURL={user?.avatar}
                  />
                </div>
              </div>
              <Container className="container-friends-informations">
                <div className="search-box-desktop">
                  <input
                    ref={inputRef}
                    placeholder="Pesquisar..."
                    className="input-search-desktop"
                    type="text"
                    value={searchValue}
                    onChange={changeFriends}
                  />
                  <BsSearch className="icon-search-desktop" />
                </div>
                <div className="grid-container">
                  {filtered.length > 0
                    ? filtered.map((friend) => {
                      return (
                        <FriendBox
                          isFriend
                          key={friend.id}
                          friendshipId={friend.id}
                          id={id}
                          friendId={
                            friend.receiverId === id
                              ? friend.sender.id
                              : friend.receiver.id
                          }
                          photoURL={
                            friend.receiverId === id
                              ? friend.sender.profile.avatar
                              : friend.receiver.profile.avatar
                          }
                          displayName={
                            friend.receiverId === id
                              ? friend.sender.fullname
                              : friend.receiver.fullname
                          }
                          nickname={
                            friend.receiverId === id
                              ? friend.sender.profile.nickname
                              : friend.receiver.profile.nickname
                          }
                          listFriends={listFriends}
                          onFriendshipRemoved={handleFriendshipRemoved}
                          showBlock={true}
                        />
                      );
                    })
                    : friends.map((friend) => {
                      return (
                        <FriendBox
                          isFriend
                          key={friend.id}
                          friendshipId={friend.id}
                          id={id}
                          friendId={
                            friend.receiverId === id
                              ? friend.sender.id
                              : friend.receiver.id
                          }
                          photoURL={
                            friend.receiverId === id
                              ? friend.sender.profile.avatar
                              : friend.receiver.profile.avatar
                          }
                          displayName={
                            friend.receiverId === id
                              ? friend.sender.fullname
                              : friend.receiver.fullname
                          }
                          nickname={
                            friend.receiverId === id
                              ? friend.sender.profile.nickname
                              : friend.receiver.profile.nickname
                          }
                          listFriends={listFriends}
                          showBlock={true}
                        />
                      );
                    })}
                </div>
              </Container>
              <ButtonBackTop scrollOffset={100} />
            </>
            :
            <Container className="negacao-friends">
              <h5>
                Página não disponível para seu papel dentro da aplicação.
              </h5>
            </Container>
          }
        </>
      )}
    </div>
  );
}
