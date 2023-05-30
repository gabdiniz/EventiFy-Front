import React, { useState, useEffect, useContext } from "react";
import { Avatar } from "../../components/Ui/Avatar/Avatar";
import { Sidebar } from "../../components/Sidebar/Sidebar";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import {
  BsQrCodeScan,
  BsPeople,
  BsEnvelope,
  BsPencilFill,
} from "react-icons/bs";
import { Button, Container, Modal} from "react-bootstrap";
import { CardEditProfile } from "../../components/CardEditProfile/CardEditProfile";
import { CardEditFullName } from "../../components/CardEditProfile/CardEditFullName";
import { CardEditBio } from "../../components/CardEditProfile/CardEditBio";
import { CardSecurity } from "../../components/CardSecurity/CardSecurity";
import { ButtonRadius } from "../../components/Ui/ButtoRadius";
import { Loader } from "../../components/Loader/Loader";
import { AuthContext } from "../../context/AuthContext";
import "./Profile.scss";

export function Profile() {
  const [load, setLoad] = useState(true);
  const [showEditProfil, setShowEditProfile] = useState(false);
  const [showEditFullName, setShowEditFullName] = useState(false);
  const [showEditBio, setShowEditBio] = useState(false);
  const [showSecurity, setShowSecurity] = useState(false);
  const [isDataUpdated, setIsDataUpdated] = useState(false);
  const [user, setUser] = useState();
  const [open, setOpen] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const [showDeleteConfirmation, setShowDelete] = useState(false);
  const { userLogout, updateUser } = useContext(AuthContext);
  const { reset } = useForm();
  const navigate = useNavigate();

  useEffect(() => {
    setLoad(true);
    setTimeout(() => {
      setLoad(false);
    }, 500);
  }, []);

  function closeDelete() {
    setShowDelete(false);
  }
  const handleShow = (id) => {
    setShowEditProfile(true);
  };

  const handleShowEditFullName = (id) => {
    setShowEditFullName(true);
  };

  const handleClose = () => {
    setShowEditProfile(false);
  };

  const handleShowBio = (id) => {
    setShowEditBio(true);
  };

  const handleCloseBio = () => {
    setShowEditBio(false);
  };

  const handleCloseEditFullName = () => {
    setShowEditFullName(false);
  };

  const handleShowSecurity = (id) => {
    setShowSecurity(true);
  };

  const handleCloseSecurity = () => {
    setShowSecurity(false);
  };

  const { id } = JSON.parse(localStorage.getItem("userInfo"));
  const [showQRCode, setShowQRCode] = useState(false);

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
          cidade: user.data.profile.city,
          empresa: user.data.bio.company,
          cargo: user.data.bio.position,
          descricao: user.data.bio.description,
        };

        reset(info);
        setUser(info);

        if (isDataUpdated) {
          setIsDataUpdated(false);
          axios
            .get(`${process.env.REACT_APP_IP}:3001/users/?id=${id}`, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            })
            .then((user) => {
              const info = {
                nome: user.data.name,
                apelido: user.data.profile.nickname,
                avatar: user.data.profile.avatar,
                cidade: user.data.profile.city,
                empresa: user.data.bio.company,
                cargo: user.data.bio.position,
                descricao: user.data.bio.description,
              };
              reset(info);
              setUser(info);
              updateUser();
            })
            .catch((error) => {
              console.error();
            });
        }
      })
      .catch((error) => {
        toast.error(error.response.data.message, {
          position: "bottom-right",
          duration: 2500,
        });
      });
  }, [id, reset, isDataUpdated]);

  function handleEdit(data) {
    
    if (data.nickname === user.apelido) {
      delete data.nickname
    }
    axios
      .put(`${process.env.REACT_APP_IP}:3001/users/${id}/profile`, data, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } })
      .then((response) => {

        updateUser();
        
        toast.success("Seus dados foram editados.", {
          position: "bottom-right",
          duration: 2000,
        });
        setIsDataUpdated(true);
        setShowEditProfile(false);
        navigate("/perfil");
      })
      .catch((error) => {
        toast.error("Algo deu errado.", {
          position: "bottom-right",
          duration: 2000,
        });
        console.log(error);
      });
  }

  function handleEditFullName(data) {

    axios
      .put(`${process.env.REACT_APP_IP}:3001/users/${id}`, data, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } })
      .then((response) => {

        updateUser();
        
        toast.success("Seus dados foram editados.", {
          position: "bottom-right",
          duration: 2000,
        });
        setIsDataUpdated(true);
        setShowEditFullName(false);
        navigate("/perfil");
      })
      .catch((error) => {
        toast.error("Algo deu errado.", {
          position: "bottom-right",
          duration: 2000,
        });
        console.log(error);
      });
  }

  function deleteMyAccount(id) {
    axios
      .delete(`${process.env.REACT_APP_IP}:3001/users/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => {
        userLogout();
        closeDelete();
        navigate("/");
      });
    toast.success("A conta foi removida.", {
      position: "bottom-right",
      duration: 2500,
    });
  }

  function handleEditBio(data) {
    axios
      .put(`${process.env.REACT_APP_IP}:3001/users/${id}/bio`, data, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => {
        toast.success("Seus dados foram editados.", {
          position: "bottom-right",
          duration: 2000,
        });
        setIsDataUpdated(true);
        setShowEditBio(false);
        navigate("/perfil");
      })
      .catch((error) => {
        toast.error("Algo deu errado.", {
          position: "bottom-right",
          duration: 2000,
        });
        console.log(error);
      });
  }


  function handleEditSecurity(data) {
    const user = JSON.parse(localStorage.getItem('userInfo'));
    let rota;
    if (user.role === 'participante') {
      rota = `${process.env.REACT_APP_IP}:3001/users/${user.id}`
    } else if (user.role === 'organizador') {
      rota = `${process.env.REACT_APP_IP}:3001/organizadores/${user.id}`
    } else if (user.role === 'admin') {
      rota = `${process.env.REACT_APP_IP}:3001/admins/${user.id}`
    } else {
      rota = `${process.env.REACT_APP_IP}:3001/superadmin/${user.id}`
    };

    axios
    .put(rota, data, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
    .then((response) => {
      toast.success("Sua senha foi alterada com sucesso.", {
        position: "bottom-right",
        duration: 2000,
      });
      setTimeout(() => {
        handleCloseSecurity();
        navigate("/perfil");
      }, 500);
    })
    .catch((error) => {
      toast.error("Não foi possível alterar a senha.", {
        position: "bottom-right",
        duration: 2000,
      });
      console.log(error);
    });
  }

  function handleEditAvatar() {
    setIsDataUpdated(true)
  }

  function openModal() {
    setShowQRCode(true);
  }

  function closeModal() {
    setShowQRCode(false);
  }


  useEffect(() => {
    function validCodes() {
      if (user) {
        axios
          .get(`${process.env.REACT_APP_IP}:3001/registrations/user/${id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          })
          .then((response) => {
            const currentDate = new Date();
            const filteredRegistrations = response.data.filter(
              (registration) => new Date(registration.event.endDate) > currentDate
            );
            setRegistrations(filteredRegistrations);
          })
          .catch((err) => {
            toast.error("Erro ao recuperar QRCodes.", {
              position: "bottom-right",
              duration: 2500,
            });
          });
      }
    }
    validCodes();
  }, [id, user]);

  const generatePDF = (userId, eventId) => {
    setGeneratingPDF(true);
    axios
      .get(`${process.env.REACT_APP_IP}:3001/registrations/pdf/${userId}/${eventId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        responseType: "blob",
      })
      .then((response) => {
        const pdfUrl = URL.createObjectURL(response.data);
        window.open(pdfUrl);
        setGeneratingPDF(false);
      })
      .catch((err) => {
        toast.error("Erro ao gerar PDF.", {
          position: "bottom-right",
          duration: 2500,
        });
        setGeneratingPDF(false);
      });
  };


  return (
    <div className="section-styler section-profile-informations">
      <Sidebar />
      {load ? (
        <Loader />
      ) : (
        <>
          <div className="profile-container">
            <div className="subheader-profile">
              <div className="profile-informations">
                <div className="profile-informations-name">
                  <span>Olá,</span>
                  <span>
                    <strong>{user ? user.nome : ""}</strong>
                  </span>
                </div>
                <Avatar
                  className="current-img"
                  size={{
                    width: 70,
                    height: 70,
                  }}
                  displayName={user?.nome}
                  photoURL={user?.avatar}
                  showDisplayName={true}
                  upload={true}
                  handleEdit={handleEditAvatar}
                />
              </div>
            </div>
            <div className="links-container-profile">
              <Link>
                <div
                  className="link-icons-profile"
                  onClick={showQRCode === false ? openModal : closeModal}
                >
                  <BsQrCodeScan size="25" />
                  <span>QRcode</span>
                </div>
              </Link>
              <Link to="/amigos">
                <div className="link-icons-profile">
                  <BsPeople size="25" />
                  <span>Amigos</span>
                </div>
              </Link>
              <Link to="/messages">
                <div className="link-icons-profile">
                  <BsEnvelope size="25" />
                  <span>Mensagens</span>
                </div>
              </Link>
            </div>
          </div>
          <Container className="section-styler container-data-profile mb-5">
            <div className="profile-informations profile-informations-desktop mb-5">
              <div className="profile-informations-name">
                <span>Olá,</span>
                <span>
                  <strong>{user ? user.nome : ""}</strong>
                </span>
              </div>
              <Avatar
                className="current-img"
                size={{
                  width: 70,
                  height: 70,
                }}
                displayName={user?.nome}
                photoURL={user?.avatar}
                showDisplayName={true}
                upload={true}
                handleEdit={handleEditAvatar}
              />
            </div>
            <div className="profile-header-informations mt-5">
              <div className="container-group-profile-informations mb-3">
                <span>
                  <strong>Nome completo :</strong>
                </span>
                <button onClick={() => handleShowEditFullName()}>
                  <BsPencilFill />
                </button>
              </div>
              <div className="group-profile-informations">
                <span>{user ? user.nome : ""}</span>
              </div>
            </div>
            <div className="profile-header-informations">
              <div className="container-group-profile-informations mb-3">
                <span>
                  <strong>Dados do perfil:</strong>
                </span>
                <button onClick={() => handleShow()}>
                  <BsPencilFill />
                </button>
              </div>
              <div className="group-profile-informations">
                <label className="mb-2">Apelido :</label>
                <span>{user ? user.apelido : ""}</span>
              </div>
              <div className="group-profile-informations">
                <label className="mb-2">Cidade:</label>
                <span>{user ? user.cidade : ""}</span>
              </div>
            </div>
            <div className="profile-header-informations">
              <div className="container-group-profile-informations mb-3">
                <span>
                  <strong>Sobre:</strong>
                </span>
                <button onClick={() => handleShowBio()}>
                  <BsPencilFill />
                </button>
              </div>
              <div className="group-profile-informations">
                <label className="mb-2">Cargo:</label>
                <span>{user ? user.cargo : ""}</span>
              </div>
              <div className="group-profile-informations">
                <label className="mb-2">Empresa:</label>
                <span>{user ? user.empresa : ""}</span>
              </div>
              <div className="group-profile-informations group-profile-informations-description">
                <label className="mb-2">Descrição:</label>
                <p className="pl">{user ? user.descricao : ""}</p>
              </div>
            </div>

            <div className="profile-header-informations">
              <div className="container-group-profile-informations mb-53">
                <span>
                  <strong>Senha e Segurança:</strong>
                </span>
                <button onClick={() => handleShowSecurity()}>
                  <BsPencilFill />
                </button>
              </div>
              <div className="group-profile-informations ">
                <label className="mb-2">Senha:</label>
                <span>{user ? user.password : ""}</span>
              </div>
            </div>
            <div className="profile-header-informations">
              <div className="container-group-profile-informations mb-53">
                <Link
                  className="text-decoration-none text-dark"
                  onClick={() => setShowDelete(true)}
                >
                  <strong>Excluir conta</strong>
                </Link>
              </div>
            </div>
          </Container>
          <button className="btn-add btn-profile-none" onClick={openModal}>
            <BsQrCodeScan size="25" />
          </button>
          <CardEditProfile
            user={user}
            show={showEditProfil}
            handleClose={handleClose}
            onSubmit={handleEdit}
          />
          <CardEditFullName
            user={user}
            show={showEditFullName}
            handleClose={handleCloseEditFullName}
            onSubmit={handleEditFullName}
          />
          <CardEditBio
            user={user}
            show={showEditBio}
            handleClose={handleCloseBio}
            onSubmit={handleEditBio}
          />
          <CardSecurity
            user={user}
            show={showSecurity}
            handleClose={handleCloseSecurity}
            onSubmit={handleEditSecurity}
          />
          <Modal
            show={showQRCode}
            onHide={closeModal}
            centered={true}
            animation={false}
          >
            <Modal.Header closeButton></Modal.Header>
            <Modal.Body>
              <h4 className="mb-4">Eventos com QR Code válidos:</h4>
              <div className="d-flex flex-column align-items-center">
                {registrations &&
                  registrations.map((registration) => (
                    <div key={registration.id} className="mb-3 w-100">
                      <Button
                        className="w-100 bg-transparent border-primary"
                        variant="success"
                        onClick={() =>
                          setOpen((prevOpen) =>
                            prevOpen === registration.id
                              ? null
                              : registration.id
                          )
                        }
                        aria-expanded={open === registration.id}
                      >
                        <p className="dataName m-0">
                          {registration.event.name}
                        </p>
                      </Button>
                      {open === registration.id && (
                        <div className="info d-flex justify-content-between mt-1">
                          <div className="qrcode d-flex flex-column ms-3">
                            <span className="dataName">QR Code:</span>
                            <img src={registration.qrCode} alt="QR Code" />
                          </div>
                          <div className="checkin d-flex flex-column me-3 mt-1">
                            <span className="DataName">Check-in:</span>
                            <span
                              className={
                                registration.checkin
                                  ? "isCheckinTrue"
                                  : "isCheckinFalse"
                              }
                            >
                              {registration.checkin
                                ? "Efetuado"
                                : "Não efetuado"}
                            </span>
                          </div>
                        </div>
                      )}
                      {open === registration.id && (
                        <div className="generatePDFQRCode w-100 d-flex justify-content-center">
                          <Button
                            className="w-100 "
                            variant="primary"
                            disabled={generatingPDF}
                            onClick={() =>
                              generatePDF(
                                registration.userId,
                                registration.eventId
                              )
                            }
                          >
                            {generatingPDF ? "Gerando PDF..." : "Gerar PDF"}
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
              <div className="d-flex mx-auto ">
                <ButtonRadius
                  className="btn  rounded-pill bg-success border-success mx-auto w-50 btn-speaker"
                  label="Fechar"
                  type="submit"
                  onClick={closeModal}
                />
              </div>
            </Modal.Body>
          </Modal>
          <Modal
            show={showDeleteConfirmation}
            onHide={closeDelete}
            centered={true}
            animation={false}
          >
            <Modal.Header closeButton></Modal.Header>
            <Modal.Body>
              <div className="d-flex justify-content-center">
                <p>Deseja excluir sua conta?</p>
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
                  onClick={() => deleteMyAccount(id)}
                />
              </div>
            </Modal.Body>
          </Modal>
        </>
      )}
    </div>
  );
}
