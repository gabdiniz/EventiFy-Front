import { Container, Modal, ModalBody, Carousel } from "react-bootstrap";
import { Sidebar } from "../../components/Sidebar/Sidebar";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { format } from "date-fns";
import { ButtonRadius } from "../../components/Ui/ButtoRadius";
import { Avatar } from "../../components/Ui/Avatar/Avatar";
import { Loader } from "../../components/Loader/Loader";
import { CardPost } from "../../components/CardPost/CardPost";
import { Link } from "react-router-dom";
import { ModalPost } from "../../components/ModalPost/ModalPost";
import { toast } from "react-hot-toast";
import { CardEvent } from "../../components/CardEvent/CardEvent";
import "./Event.scss";

export function Event() {
  const [evento, setEvento] = useState(null);
  const [eventSpeaker, setEventSpeaker] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [speaker, setSpeaker] = useState(null);
  const [showPage, setShowPage] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loader, setLoader] = useState(true);
  const [container, setContainer] = useState(false);
  const [user, setUser] = useState(); // armazena os user logado
  const [showNewPost, setShowNewPost] = useState(false); // controla o estado do modal
  const usuario = JSON.parse(localStorage.getItem("userInfo"));
  const [postou, setPostou] = useState(false);
  const [showDetails, setshowDetails] = useState(false);
  const [showDeleteConfirmation, setShowDelete] = useState(false); // modal confirmação delete
  const [postDelete, setPostDelete] = useState(null);
  const [showQrCode, setShowQrCode] = useState(false);
  const [talks, setTalks] = useState([]);
  const [qrCode, setQrCode] = useState(null);
  const { id } = useParams(); // id do evento
  const userId = JSON.parse(localStorage.getItem("userInfo")).id;
  const { role } = JSON.parse(localStorage.getItem('userInfo'))
  const [acesso, setAcesso] = useState(false);

  useEffect(() => {
    listarEvent();
    listarEventSpeaker(id);
    listarTalks(id);
    listarRegistrations();
    listPosts(id);
    setAcesso((role !== 'superAdmin' && role !== 'admin' && role !== 'organizador') ? false : true);
  }, [postou, role]);

  useEffect(() => {
    if (evento !== null && eventSpeaker !== null) {
      setLoader(false);
    }
  }, [evento, eventSpeaker]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_IP}:3001/events/?id=${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((e) => {
        setEvento(e.data);
      });
  }, [id]);

  useEffect(() => {
    if (usuario) {
      getUser(usuario.id);
    }
  }, [usuario?.id]);

  function listarEvent() {
    axios
      .get(`${process.env.REACT_APP_IP}:3001/events?id=${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((e) => {
        setEvento(e.data);
      });
  }

  function listarEventSpeaker(id) {
    axios
      .get(`${process.env.REACT_APP_IP}:3001/eventspeakers?eventId=${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((e) => {
        setEventSpeaker(e.data);
      });
  }

  function listarTalks(id) {
    axios.get(`${process.env.REACT_APP_IP}:3001/talks?eventId=${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }).then((response) => {
        setTalks(response.data);
    });
}

  function listarRegistrations() {
    axios
      .get(
        `${process.env.REACT_APP_IP}:3001/registrations/event/${id}/user/${usuario.id}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      )
      .then((response) => {
        if (response.data !== null) {
          setShowPage(true);
          setQrCode(response.data.qrCode)
        } else {
          setContainer(true);
        }
      });
  }

  function listPosts(id) {
    axios
      .get(`${process.env.REACT_APP_IP}:3001/posts/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => {
        setPosts(response.data);
        setPostou(false);
      });
  }

  function getUser(id) {
    axios
      .get(`${process.env.REACT_APP_IP}:3001/users?id=${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function deletePost(postId) {
    axios.delete(`${process.env.REACT_APP_IP}:3001/posts/${postId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }).then(() => {
      closeDelete();
      listPosts(id);
      toast.success("Postagem excluída!", {
        position: "bottom-right",
        duration: 2500,
      });
    })
  }

  function OpenPost(postId) {
    setPostDelete(postId);
    setShowDelete(true);
  }

  function closeDelete() {
    setPostDelete(null);
    setShowDelete(false);
  }

  const openModal = (speaker) => {
    setSpeaker(speaker);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setShowQrCode(false);
  };

  const openDetails = () => {
    setshowDetails(true);
  };
  const closeDetails = () => setshowDetails(false);

  function openNewPost(user) {
    setUser(user);
    setShowNewPost(true);
  }

  function closeNewPost() {
    setShowNewPost(false);
    setPostou(true);
  }

  function updateEdit() {
    setPostou(true);
  }

  function openQrCode() {
    setShowQrCode(true);
  }
  const [eventData, setEventData] = useState([]);
  const [checkins, setCheckins] = useState(-1);

  useEffect(() => {
   if(acesso){
    axios.get(`${process.env.REACT_APP_IP}:3001/registrations/participantes/total/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then(response => {
        setEventData(response.data);
      })
      .catch(err => {
        console.log(err);
        toast.error("Erro ao acessar dados do evento", { position: "bottom-right", duration: 2500 });
      })
   }
  }, [id, acesso])

  useEffect(() => {
    setCheckins(eventData.filter(el => el.checkin === true));
  }, [eventData]);

  function onRegister() {
    axios
      .post(
        process.env.REACT_APP_IP+":3001/registrations",
        { userId: userId, eventId: id },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      )
      .then(() => {
        listarRegistrations();
        toast.success("Registrado em evento com sucesso.", {
          position: "bottom-right",
          duration: 2500,
        });
      })
      .catch((e) => {
        toast.error(e.response.data.message, {
          position: "bottom-right",
          duration: 2500,
        });
      });
  }

  return (
    <div>
      <Sidebar />
      <div className="container-evento-principal ">
        {loader ? (
          <Loader />
        ) : showPage ? (
          <div className="d-flex flex-column m-auto container-evento">
            <CardEvent
              className="mb-3 card-event-eventos mt-4"
              title={evento?.name}
              image={evento?.header}
              info={true}
              onClickFunction={openDetails}
              onClickFunctionDois={openQrCode}
              idEvento={id}

              style={{
                display: "flex",
                alignItems: "space-between",
                justifyContent: "space-between",
              }}
            ></CardEvent>
            <div className="d-flex justify-content-center mt-5 flex-column align-items-center gap-4">
              <Modal show={showDetails} centered>
                <Modal.Body>
                  <div className="info-evento d-flex justify-content-center">
                    <div className="d-flex justify-content-center py-3">
                      <h3 className="m-0">{evento?.name}</h3>
                    </div>
                    <strong className="mb-1">Descrição</strong>
                    <span className="mb-2">{evento?.description}</span>
                    <strong className="mb-1">Categoria</strong>
                    <span className="mb-2">{evento?.segment}</span>
                    <strong className="mb-1">Vagas</strong>
                    <span className="mb-2">{evento?.vacancies + " vagas"}</span>
                    <strong className="mb-1">De</strong>
                    <span className="mb-2">
                      {evento?.startDate &&
                        format(new Date(evento?.startDate), "dd/MM/yyyy HH:mm")}
                    </span>
                    <strong className="mb-1">Até</strong>
                    <span className="mb-2">
                      {evento?.endDate &&
                        format(new Date(evento?.endDate), "dd/MM/yyyy HH:mm")}
                    </span>
                    <strong className="mb-1">Nome do espaço</strong>
                    <span className="mb-2">{evento?.location?.name}</span>
                    <strong className="mb-1">Cidade - UF </strong>
                    <span className="mb-2">{`${evento?.location?.cidade} - ${evento?.location?.uf}`}</span>
                    <strong className="mb-1">Endereço</strong>
                    <span className="mb-2">{evento?.location?.endereco}</span>
                    <strong className="mb-1">Cep</strong>
                    <span className="mb-2">{evento?.location?.cep}</span>
                    {acesso &&
                      <div className="dadosCheckin d-flex mt-2 mb-3 p-2 border border-success rounded justify-content-around">
                        <div className="totalRegistrations d-flex flex-column ">
                          <strong className="mb-1 data-title">Inscritos:</strong>
                          <span className="mb-2 inscritos-numero">{eventData.length}</span>
                        </div>
                        <div className="totalCheckin d-flex flex-column">
                          <strong className="mb-1 data-title">Check-in:</strong>
                          <span className="mb-2 checkin-numero">{checkins.length}</span>
                        </div>
                      </div>
                    }
                    <div className="d-flex  div-button-registrar-evento">
                      <ButtonRadius
                        label="Fechar"
                        backgroundColor="success"
                        borderColor="#3E1946"
                        textColor="light"
                        boxShadow={true}
                        onClick={closeDetails}
                      />
                    </div>
                  </div>
                </Modal.Body>
              </Modal>
              <Modal show={showQrCode} onHide={closeModal} centered>
                <Modal.Body>
                  <img src={qrCode} alt="QRCode" style={{
                    display: 'block',
                    margin: '0 auto',
                    maxWidth: '100%',
                    maxHeight: '100%',
                  }}></img>
                </Modal.Body>
              </Modal>
              <div className="avatar-largura d-flex flex-column align-items-center mt-4 mb-2 w-100">
                {eventSpeaker && eventSpeaker.length > 0 && talks && talks.length > 0 && (
                  <>
                    <h4>Nossos palestrantes</h4>
                    <div className="avatar-largura d-flex flex-row justify-content-center mt-4 mb-2 w-100">
                      <Carousel variant="dark" className="w-100" indicators={false}>
                        {eventSpeaker.filter((speaker) =>
                        talks?.find((talk) => talk.speakerId === speaker.speakerId)).map((e) => {
                          return (
                            <Carousel.Item key={e.id}>
                              <div className="d-flex flex-column align-items-center">
                                <Avatar
                                  onClick={() => {
                                    openModal(e.speaker);
                                  }}
                                  showDisplayName={true}
                                  displayName={e.speaker.fullname}
                                  photoURL={e.speaker.avatar}
                                  size={{ width: 100, height: 100 }}
                                />
                                <div className="d-flex flex-column align-items-center">
                                  <span className="texto-avatar-span">
                                    <strong>{e.speaker.fullname}</strong>
                                  </span>
                                  <span className="texto-avatar-span">
                                    {e.speaker.position}
                                  </span>
                                </div>
                              </div>
                            </Carousel.Item>
                          );
                        })}
                      </Carousel>
                    </div>
                  </>
                )}
              </div>
              {posts.map((post) => {
                const myPost = userId === post.user.id;
                const data = new Date(post.date);
                const dataFormatada = format(data, "dd/MM/yyyy HH:mm");
                return (
                  <React.Fragment key={post.id}>
                    <CardPost
                      key={post.id}
                      postId={post.id}
                      midia={
                        post.media.length > 0
                          ? post.media.map((e) => e.link)
                          : null
                      }
                      name={post.user.fullname}
                      nickname={post.profile.nickname}
                      myPost={myPost}
                      eventName={post.event?.name}
                      message={post.message}
                      datePost={dataFormatada}
                      avatar={post.profile.avatar}
                      handleEdit={updateEdit}
                      handleDelete={OpenPost}

                    />
                    <Modal
                      show={showDeleteConfirmation}
                      onHide={closeDelete}
                      centered={true}
                      animation={false}
                    >
                      <Modal.Header closeButton></Modal.Header>
                      <Modal.Body>
                        <div className="d-flex justify-content-center">
                          <p>Excluir postagem?</p>
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
                            onClick={() => deletePost(postDelete)}
                          />
                        </div>
                      </Modal.Body>
                    </Modal>
                  </React.Fragment>

                );
              })}
              <Link to>
                <button className="btn-add" onClick={() => openNewPost(user)}>
                  +
                </button>
              </Link>
              <div>
                <ModalPost
                  evento={evento.id}
                  user={user}
                  show={showNewPost}
                  handleClose={closeNewPost}
                />
              </div>
            </div>
          </div>
        ) : (
          container && (
            <Container className="d-flex flex-column m-auto container-evento">
              <CardEvent
                className="mb-3 card-event-eventos mt-5"
                title={evento?.name}
                image={evento?.header}
                agenda={true}
                idEvento={id}
              ></CardEvent>
              <div className="px-2 w-100">
                <div>
                  <div className="info-evento d-flex justify-content-center">
                    <div className="avatar-largura d-flex flex-column align-items-center mt-4 mb-2 w-100">
                      {eventSpeaker && eventSpeaker.length > 0 && talks && talks.length > 0 && (
                        <>
                          <h4>Nossos palestrantes</h4>
                          <div className="avatar-largura d-flex flex-row justify-content-center mt-4 mb-2 w-100">
                            <Carousel variant="dark" className="w-100" indicators={false}>
                              {eventSpeaker.filter((speaker) =>
                        talks?.find((talk) => talk.speakerId === speaker.speakerId)).map((e) => {
                                return (
                                  <Carousel.Item key={e.id}>
                                    <div className="d-flex flex-column align-items-center">
                                      <Avatar
                                        onClick={() => {
                                          openModal(e.speaker);
                                        }}
                                        showDisplayName={true}
                                        displayName={e.speaker.fullname}
                                        photoURL={e.speaker.avatar}
                                        size={{ width: 100, height: 100 }}
                                      />
                                      <div className="d-flex flex-column align-items-center">
                                        <span className="texto-avatar-span">
                                          <strong>{e.speaker.fullname}</strong>
                                        </span>
                                        <span className="texto-avatar-span">
                                          {e.speaker.position}
                                        </span>
                                      </div>
                                    </div>
                                  </Carousel.Item>
                                );
                              })}
                            </Carousel>
                          </div>
                        </>
                      )}
                    </div>
                    <div className="d-flex justify-content-center py-3">
                      <h3 className="m-0">{evento?.name}</h3>
                    </div>
                    <strong className="mb-1">Descrição</strong>
                    <span className="mb-2">{evento?.description}</span>
                    <strong className="mb-1">Categoria</strong>
                    <span className="mb-2">{evento?.segment}</span>
                    <strong className="mb-1">Vagas</strong>
                    <span className="mb-2">{evento?.vacancies + " vagas"}</span>
                    <strong className="mb-1">De</strong>
                    <span className="mb-2">
                      {evento?.startDate &&
                        format(new Date(evento?.startDate), "dd/MM/yyyy HH:mm")}
                    </span>
                    <strong className="mb-1">Até</strong>
                    <span className="mb-2">
                      {evento?.endDate &&
                        format(new Date(evento?.endDate), "dd/MM/yyyy HH:mm")}
                    </span>
                    <strong className="mb-1">Nome do espaço</strong>
                    <span className="mb-2">{evento?.location?.name}</span>
                    <strong className="mb-1">Cidade - UF </strong>
                    <span className="mb-2">{`${evento?.location?.cidade} - ${evento?.location?.uf}`}</span>
                    <strong className="mb-1">Endereço</strong>
                    <span className="mb-2">{evento?.location?.endereco}</span>
                    <strong className="mb-1">Cep</strong>
                    <span className="mb-2">{evento?.location?.cep}</span>
                    <div className="d-flex  div-button-registrar-evento">
                      <ButtonRadius
                        onClick={onRegister}
                        label="Registre-se"
                        backgroundColor="primary"
                        borderColor="primary"
                        textColor="light"
                        size="md"
                      />
                    </div>
                  </div>
                </div>
                <div></div>
              </div>
            </Container>
          )
        )}
      </div>
      <div></div>
      <Modal show={showModal} onHide={closeModal} className="mt-5">
        <Modal.Header closeButton>
          {speaker && (
            <Avatar
              showDisplayName={true}
              displayName={speaker.fullname}
              photoURL={speaker.avatar}
              size={{
                width: 70,
                height: 70,
              }}
            />
          )}
          <Modal.Title>
            <b>{speaker?.fullname}</b>
          </Modal.Title>
        </Modal.Header>
        <ModalBody>
          <strong className="px-md-3 ">Descrição </strong>
          <br />
          <span className="px-md-3 d-flex">
            {speaker?.description}
          </span>
          <br />
          <strong className="px-md-3">Cargo </strong>
          <br />
          <span className="px-md-3 d-flex ">{speaker?.position}</span>
          <br />
          {speaker && speaker.company !== null && typeof speaker.company === 'string' && speaker.company !== '' &&
          <>
          <strong className="px-md-3">Empresa </strong>
          <br />
          <span className="px-md-3 d-flex ">{speaker?.company}</span>
          <br /></>
          }
          {speaker && speaker.education !== null && typeof speaker.education === 'string' && speaker.education !== '' &&
          <>
          <strong className="px-md-3">Formação Acadêmica </strong>
          <br />
          <span className="px-md-3 d-flex ">{speaker?.education}</span>
          <br /></>
          }
        </ModalBody>
      </Modal>
    </div>
  );
}