import React, { useState, useRef, useEffect, useCallback } from "react";
import { Sidebar } from "../../components/Sidebar/Sidebar";
import { Avatar } from "../../components/Ui/Avatar/Avatar";
import { BsSearch } from "react-icons/bs";
import { Container } from "react-bootstrap";
import { FriendBox } from "../../components/FriendBox/FriendBox";
import axios from "axios";
import { ButtonBackTop } from "../../components/Ui/ButtonBackTop/ButtonBackTop";
import { useParams } from "react-router-dom";
import "./Participants.scss"
import { toast } from "react-hot-toast";
import { Loader } from "../../components/Loader/Loader";

export function Participants() {
    const [load, setLoad] = useState(true);
    const [Participants, setParticipants] = useState([]);
    const [searchValue, setSearchValue] = useState("");
    const [filtered, setFiltered] = useState([]);
    const [user, setUser] = useState();
    const [friends, setFriends] = useState([]);
    const [friendAdd, setFriendAdd] = useState(false);



    const Objectid = JSON.parse(localStorage.getItem("userInfo"));
    const idUser = Objectid.id;
    const { id } = useParams();


    useEffect(() => {
        setLoad(true);
        setTimeout(() => {
            setLoad(false);
        }, 500);
    }, []);

    useEffect(() => {
        axios
            .get(`${process.env.REACT_APP_IP}:3001/users/?id=${idUser}`, {
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

    useEffect(() => {
        listParticipants();
    }, [id, friendAdd]);

    async function listParticipants() {
        await axios
            .get(`${process.env.REACT_APP_IP}:3001/registrations/participantes/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            })
            .then((e) => {
                setParticipants(e.data)
            });
    }

    useEffect(() => {
        async function listFriends() {
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_IP}:3001/friendships/?blocked=true&id=${idUser}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                );
                const friends = response.data;
                setFriends(friends);
            } catch (error) {
                console.error(error);
            }
        }
        setFriendAdd(false)
        listFriends();
    }, [idUser, friendAdd]);
    const changeParticipants = useCallback(
        (event) => {
            setSearchValue(event.target.value);
            const filtered = Participants.filter((participant) => {
                const displayName =
                    participant.user.fullname
                const nickname =
                    participant.profile.nickname

                const lowerCaseSearchValue = event.target.value.toLowerCase();
                return (
                    displayName.toLowerCase().includes(lowerCaseSearchValue) ||
                    nickname.toLowerCase().includes(lowerCaseSearchValue)
                );
            });
            setFiltered(filtered);
        },
        [Participants, id]
    );
    const inputRef = useRef(null);


    return (
        <div className="section-styler">
            <Sidebar />
            {load ? (
                <Loader />
            ) : (
                <>
                    <div className="subheader-profile">
                        <div className="profile-informations">
                            <div className="space-div-header"></div>
                            <div className="search-box-mobile">
                                <input
                                    ref={inputRef}
                                    placeholder="Pesquisar..."
                                    className="input-search-mobile"
                                    type="text"
                                    value={searchValue}
                                    onChange={changeParticipants}
                                />
                                <BsSearch className="icon-search-mobile" />
                            </div>
                            <Avatar
                                className="current-img"
                                size={{
                                    width: 60,
                                    height: 60,
                                }}
                                photoURL={user?.avatar}
                            />
                        </div>
                    </div>
                    <Container className="container-participants-informations">
                        <div className="search-box-desktop">
                            <input
                                ref={inputRef}
                                placeholder="Pesquisar..."
                                className="input-search-desktop"
                                type="text"
                                value={searchValue}
                                onChange={changeParticipants}
                            />
                            <BsSearch className="icon-search-desktop" />
                        </div>
                        <div className="grid-container">
                            {filtered.length > 0
                                ?
                                filtered.map((Participant) => {
                                    const friendship = friends.filter((friendship) => {
                                        if (friendship.receiverId === Participant.user.id) {
                                            return friendship.id
                                        }
                                    })
                                    if ((friendship[0] === undefined ? true : (friendship[0].blocked ? false : true))) {
                                        return (
                                            <FriendBox
                                                isFriend={friendship[0] === undefined ? false : true}
                                                key={Participant.userId}
                                                friendshipId={friendship[0] === undefined ? null : friendship[0].id}
                                                id={idUser}
                                                friendId={
                                                    Participant.userId
                                                }
                                                currentUser={
                                                    Participant.userId
                                                }
                                                displayName={
                                                    Participant.user.fullname
                                                }
                                                nickname={
                                                    Participant.profile.nickname
                                                }
                                                photoURL={
                                                    Participant.profile.avatar
                                                }
                                                onFriendshipApp={() => {
                                                    setFriendAdd(true)
                                                }}
                                                onFriendshipRemoved={() => { }}
                                                listParticipants={listParticipants}
                                            />
                                        );
                                    }
                                })
                                :
                                Participants.map((Participant) => {
                                    const friendship = friends.filter((friendship) => {
                                        if (friendship.receiverId === Participant.user.id) {
                                            return friendship.id
                                        }
                                    })
                                    if ((friendship[0] === undefined ? true : (friendship[0].blocked ? false : true))) {
                                        return (
                                            <FriendBox
                                                isFriend={friendship[0] === undefined ? false : true}
                                                key={Participant.userId}
                                                friendshipId={friendship[0] === undefined ? null : friendship[0].id}
                                                id={idUser}
                                                friendId={
                                                    Participant.userId
                                                }
                                                currentUser={
                                                    Participant.userId
                                                }
                                                displayName={
                                                    Participant.user.fullname
                                                }
                                                nickname={
                                                    Participant.profile.nickname
                                                }
                                                photoURL={
                                                    Participant.profile.avatar
                                                }
                                                onFriendshipApp={() => {
                                                    setFriendAdd(true)
                                                }}
                                                onFriendshipRemoved={() => { }}
                                                listParticipants={listParticipants}
                                            />
                                        );
                                    }
                                })
                            }
                        </div>
                    </Container>
                </>
            )}
            <ButtonBackTop scrollOffset={100} />
        </div>
    );
}
