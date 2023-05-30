import React, { useEffect, useState, useRef, useCallback } from "react";
import { Button, CloseButton, Container, Form, Modal } from "react-bootstrap";
import { Avatar } from "../../components/Ui/Avatar/Avatar";
import { Link } from "react-router-dom";
import { Sidebar } from "../../components/Sidebar/Sidebar";
import { CardChat } from "../../components/Chat/CardChat/CardChat";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Default } from "../../components/Chat/Default/Default";
import { ButtonRadius } from "../../components/Ui/ButtoRadius";
import axios from "axios";
import { format } from "date-fns";
import Offcanvas from 'react-bootstrap/Offcanvas';
import "./Messages.css";
import { BsFillPeopleFill, BsSearch } from "react-icons/bs";
import { IoMdSend } from "react-icons/io";

export function Messages() {
    const [messages, setMessages] = useState([]);
    const [amigos, setAmigos] = useState([]);
    const [friendshipId, setFriendshipId] = useState(null);
    const [searchValue, setSearchValue] = useState("");
    const { id } = JSON.parse(localStorage.getItem("userInfo"));
    const [filtered, setFiltered] = useState([]);
    const [showDeleteConfirmation, setShowDelete] = useState(false);
    const [messageDelete, setMessageDelete] = useState(null);
    const [show, setShow] = useState(false);
    const [mensagensNaTela, setMensagensNaTela] = useState(0);
    const { register, handleSubmit, reset } = useForm();
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);


    const Close = () => setShow(false);
    const Show = () => setShow(true);


    useEffect(() => {
        listarAmigos();
    }, []);

    useEffect(() => {
        const idSetInterval = setInterval(() => {
            listarMessages(friendshipId);
        }, 2500);
        return () => {
            clearInterval(idSetInterval);
        };
    }, [friendshipId]);

    useEffect(() => {
        const idSetIntervalBottom = setInterval(() => {
            if (messages.length > mensagensNaTela) {
                setMensagensNaTela(messages.length);
                scrollToBottom();
            }
        }, 500);
        return () => {
            clearInterval(idSetIntervalBottom);
        };
    }, [messages])

    async function listarAmigos() {
        try {
            const response = await axios.get(`${process.env.REACT_APP_IP}:3001/friendships?id=${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
            setAmigos(response.data);
            setFiltered(response.data);

        } catch (error) {
            console.error(error);
        }
    }

    const changeFriends = useCallback(
        (event) => {
            setSearchValue(event.target.value);
            const filtered = amigos.filter((amigo) => {
                const displayName =
                    amigo.receiverId === id
                        ? amigo.sender.fullname
                        : amigo.receiver.fullname;
                const nickname =
                    amigo.receiverId === id
                        ? amigo.sender.profile.nickname
                        : amigo.receiver.profile.nickname;

                const lowerCaseSearchValue = event.target.value.toLowerCase();
                return (
                    displayName.toLowerCase().includes(lowerCaseSearchValue) ||
                    nickname.toLowerCase().includes(lowerCaseSearchValue)
                );
            });
            setFiltered(filtered);
        },
        [amigos, id]
    );

    function setFriendship(id) {
        setFriendshipId(id);
        listarMessages(id);
    }

    async function enviarMensagem(data) {
        data.sender = id;
        try {
            await axios.post(`${process.env.REACT_APP_IP}:3001/messages?friendshipId=${friendshipId}`, data, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
            listarMessages(friendshipId);
            reset();
        } catch (error) {
            console.log(error)
            toast.error("Não foi possível enviar a mensagem", {
                position: "bottom-right",
                duration: 2500
            });
        }
    }

    function deleteMyMessage(messageId) {
        axios
            .delete(`${process.env.REACT_APP_IP}:3001/messages/${messageId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            })
            .then((response) => {
                closeDelete();
                listarMessages(friendshipId);
                setMensagensNaTela(mensagensNaTela-1)
            });
    }

    async function listarMessages(friendshipId) {
        try {
            const response = await axios.get(`${process.env.REACT_APP_IP}:3001/messages?friendshipId=${friendshipId}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
            setMessages(response.data);
        } catch (error) {
            console.error(error);
        }
    }

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    function OpenMessage(messageId) {
        setMessageDelete(messageId);
        setShowDelete(true);
    }

    function closeDelete() {
        setMessageDelete(null);
        setShowDelete(false);
    }

    return (
        <div>
            <div className={!friendshipId ? "chat-container" : "chat-container bg={styles.primary} mb-5"}>
                <Sidebar className="sidebarChatMessage" />
                {!friendshipId ? (
                    <div className="default-messages d-flex">
                        <Default/>
                        <Button className="offCanvasButton-default" variant="primary" onClick={Show}>
                            <BsFillPeopleFill className="icons-navbar" />
                            Amigos
                        </Button>
                        <Offcanvas className="bg-primary" show={show} onHide={Close}>
                                <Offcanvas.Header className="d-flex justify-content-end" closeButton>
                                </Offcanvas.Header>
                                <div className="search-box-mobile-messages">
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
                                <Offcanvas.Body className="body-canvas-message">
                                    <ul>
                                        {filtered.length > 0
                                            ? filtered.map((e) => {
                                                return (
                                                    <Link key={e.id} onClick={() => setFriendship(e.id)}>
                                                        <li>
                                                            <div className="card-message-header">
                                                                <Avatar
                                                                    className="current-img"
                                                                    size={{
                                                                        width: 45,
                                                                        height: 45,
                                                                    }}
                                                                    showDisplayName={true}
                                                                    displayName={e.receiverId === id ? e.sender.fullname : e.receiver.fullname}
                                                                    photoURL={e.receiverId === id ? e.sender.profile.avatar : e.receiver.profile.avatar}
                                                                />

                                                                <div className="card-message-name-nickname">
                                                                    <span className="card-message-name card-message-overflow">{e.receiverId === id ? e.sender.fullname : e.receiver.fullname}</span>
                                                                    <span className="card-message-nickname card-message-overflow">{e.receiverId === id ? e.sender.profile.nickname : e.receiver.profile.nickname}</span>
                                                                </div>
                                                            </div>
                                                        </li>
                                                    </Link>
                                                );
                                            })
                                            : amigos && amigos.map((e) => {
                                                return (
                                                    <Link key={e.id} onClick={() => setFriendship(e.id)}>
                                                        <li>
                                                            <div className="card-message-header">
                                                                <Avatar
                                                                    className="current-img"
                                                                    size={{
                                                                        width: 45,
                                                                        height: 45,
                                                                    }}
                                                                    showDisplayName={true}
                                                                    displayName={e.receiverId === id ? e.sender.fullname : e.receiver.fullname}
                                                                    photoURL={e.receiverId === id ? e.sender.profile.avatar : e.receiver.profile.avatar}
                                                                />

                                                                <div className="card-message-name-nickname">
                                                                    <span className="card-message-name card-message-overflow">{e.receiverId === id ? e.sender.fullname : e.receiver.fullname}</span>
                                                                    <span className="card-message-nickname card-message-overflow">{e.receiverId === id ? e.sender.profile.nickname : e.receiver.profile.nickname}</span>
                                                                </div>
                                                            </div>
                                                        </li>
                                                    </Link>
                                                );
                                            })}


                                    </ul>
                                </Offcanvas.Body>
                            </Offcanvas>
                    </div>
                ) :
                    <Container className="body-chat">
                        <div className="contents">
                            <div className="content-container">
                                {messages &&
                                    messages
                                        .sort((a, b) => new Date(a.date) - new Date(b.date))
                                        .map((message) => {
                                            const myMessage = id === message.sender;
                                            const data = new Date(message.date);
                                            const dataFormatada = format(data, "dd/MM/yyyy HH:mm");
                                            return (
                                                <div className="linha" key={message.id}>
                                                    <div className={message.sender === id ? "me" : "ele"}>
                                                        <CardChat
                                                            className={message.sender === id ? "card-chat" : "card-chat-ele"}
                                                            datePost={dataFormatada}
                                                            message={message.message}
                                                            messageId={message.id}
                                                            myMessage={myMessage}
                                                            handleDelete={OpenMessage}
                                                        />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                <div ref={messagesEndRef} />
                            </div>
                        </div>
                        <Form className="input-chat px-3" onSubmit={handleSubmit(enviarMensagem)}>
                            <Button className="offCanvasButton me-1" variant="primary" onClick={Show}>
                                <BsFillPeopleFill className="icons-navbar" />
                                Amigos
                            </Button>
                            <input className="input-chatmessage" type="text" placeholder="Digite sua mensagem" {...register("message")} />
                            <input type="hidden" defaultValue={id} {...register("sender")} />
                            <Button className="enviar-message me-1" type="submit">
                                <IoMdSend />
                            </Button>
                            <Offcanvas className="bg-primary" show={show} onHide={Close}>
                                <Offcanvas.Header className="d-flex justify-content-end"  closeButton>
                                </Offcanvas.Header>
                                <div className="search-box-mobile-messages">
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
                                <Offcanvas.Body className="body-canvas-message">
                                    <ul>
                                        {filtered.length > 0
                                            ? filtered.map((e) => {
                                                return (
                                                    <Link key={e.id} onClick={() => setFriendship(e.id)}>
                                                        <li>
                                                            <div className="card-message-header">
                                                                <Avatar
                                                                    className="current-img"
                                                                    size={{
                                                                        width: 45,
                                                                        height: 45,
                                                                    }}
                                                                    showDisplayName={true}
                                                                    displayName={e.receiverId === id ? e.sender.fullname : e.receiver.fullname}
                                                                    photoURL={e.receiverId === id ? e.sender.profile.avatar : e.receiver.profile.avatar}
                                                                />

                                                                <div className="card-message-name-nickname">
                                                                    <span className="card-message-name card-message-overflow">{e.receiverId === id ? e.sender.fullname : e.receiver.fullname}</span>
                                                                    <span className="card-message-nickname card-message-overflow">{e.receiverId === id ? e.sender.profile.nickname : e.receiver.profile.nickname}</span>
                                                                </div>
                                                            </div>
                                                        </li>
                                                    </Link>
                                                );
                                            })
                                            : amigos && amigos.map((e) => {
                                                return (
                                                    <Link key={e.id} onClick={() => setFriendship(e.id)}>
                                                        <li>
                                                            <div className="card-message-header">
                                                                <Avatar
                                                                    className="current-img"
                                                                    size={{
                                                                        width: 45,
                                                                        height: 45,
                                                                    }}
                                                                    showDisplayName={true}
                                                                    displayName={e.receiverId === id ? e.sender.fullname : e.receiver.fullname}
                                                                    photoURL={e.receiverId === id ? e.sender.profile.avatar : e.receiver.profile.avatar}
                                                                />

                                                                <div className="card-message-name-nickname">
                                                                    <span className="card-message-name card-message-overflow">{e.receiverId === id ? e.sender.fullname : e.receiver.fullname}</span>
                                                                    <span className="card-message-nickname card-message-overflow">{e.receiverId === id ? e.sender.profile.nickname : e.receiver.profile.nickname}</span>
                                                                </div>
                                                            </div>
                                                        </li>
                                                    </Link>
                                                );
                                            })}


                                    </ul>
                                </Offcanvas.Body>
                            </Offcanvas>
                        </Form>
                    </Container>}

                {/* Sidebar */}

                <div className="sidebarMessage">
                    <div className="teste">

                    <div className="search-box-desktop-messages">
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
                            </div>
                    <ul>
                        {filtered.length > 0
                            ? filtered.map((e) => {
                                return (
                                    <Link key={e.id} onClick={() => setFriendship(e.id)}>
                                        <li>
                                            <div className="card-message-header">
                                                <Avatar
                                                    className="current-img"
                                                    size={{
                                                        width: 45,
                                                        height: 45,
                                                    }}
                                                    showDisplayName={true}
                                                    displayName={e.receiverId === id ? e.sender.fullname : e.receiver.fullname}
                                                    photoURL={e.receiverId === id ? e.sender.profile.avatar : e.receiver.profile.avatar}
                                                />

                                                <div className="card-message-name-nickname">
                                                    <span className="card-message-name">{e.receiverId === id ? e.sender.fullname : e.receiver.fullname}</span>
                                                    <span className="card-message-nickname" >{e.receiverId === id ? e.sender.profile.nickname : e.receiver.profile.nickname}</span>
                                                </div>
                                            </div>
                                        </li>
                                    </Link>
                                );
                            })
                            : amigos && amigos.map((e) => {
                                return (
                                    <Link key={e.id} onClick={() => setFriendship(e.id)}>
                                        <li>
                                            <div className="card-message-header">
                                                <Avatar
                                                    className="current-img"
                                                    size={{
                                                        width: 45,
                                                        height: 45,
                                                    }}
                                                    showDisplayName={true}
                                                    displayName={e.receiverId === id ? e.sender.fullname : e.receiver.fullname}
                                                    photoURL={e.receiverId === id ? e.sender.profile.avatar : e.receiver.profile.avatar}
                                                />

                                                <div className="card-message-name-nickname">
                                                    <span className="card-message-name">{e.receiverId === id ? e.sender.fullname : e.receiver.fullname}</span>
                                                    <span className="card-message-nickname">{e.receiverId === id ? e.sender.profile.nickname : e.receiver.profile.nickname}</span>
                                                </div>
                                            </div>
                                        </li>
                                    </Link>
                                );
                            })}
                    </ul>
                </div>
            </div>

            {/* Modal */}

            <Modal
                show={showDeleteConfirmation}
                onHide={closeDelete}
                centered={true}
                animation={false}
            >
                <Modal.Header closeButton></Modal.Header>
                <Modal.Body>
                    <div className="d-flex justify-content-center">
                        <p>Deseja excluir essa mensagem?</p>
                    </div>
                    <div className="d-flex justify-content-center">
                        <ButtonRadius
                            className="btn rounded-pill bg-success border-success btn-speaker"
                            label="Não"
                            type="submit"
                            onClick={closeDelete}
                        />
                        <ButtonRadius
                            className="btn rounded-pill btn-modal-deletar-sim btn-speaker"
                            label="Sim"
                            type="submit"
                            onClick={() => deleteMyMessage(messageDelete)}
                        />
                    </div>
                </Modal.Body>
            </Modal>

        </div>
    );
}
