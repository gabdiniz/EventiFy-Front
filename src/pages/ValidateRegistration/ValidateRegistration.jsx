  import React, { useEffect, useState } from 'react';
  import axios from 'axios';
  import "./ValidateRegistration.scss"
  import { Loader } from '../../components/Loader/Loader';
  import { Container, Modal } from 'react-bootstrap';
  import { useParams } from 'react-router-dom';
  import { Avatar } from '../../components/Ui/Avatar/Avatar';
  import { ButtonRadius } from '../../components/Ui/ButtoRadius';
  import { format } from "date-fns";
  import { toast } from 'react-hot-toast';


  export function ValidateRegistration() {
    const { userId, eventId } = useParams();
    const [userData, setUserData] = useState(null);

    useEffect(() => {
      axios
      .get(`${process.env.REACT_APP_IP}:3001/registrations/checkin/${userId}/${eventId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
      .then(response => {
          const data = response.data;
          setUserData(data);
        })
        .catch(error => {
          console.error(error);
        });
    }, [userId, eventId]);

    function confirmCheckin(data){
      axios.put(`${process.env.REACT_APP_IP}:3001/registrations/checkin/${userId}/${eventId}`,data,{
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }).then(response =>{
        toast.success("Check-in efetuado", {
          position:"bottom-right",
          duration:2500
        })
      }).catch(err =>{
        console.log(err)
        toast.error("Erro ao efetuador o check-in",{
          position:"bottom-right",
          duration:2500
        })
      })
    }

    function openModal() {
      setConfirmDelete(true);
    }
    
    function closeModal() {
      setConfirmDelete(false);
    }
    const [confirmDelete, setConfirmDelete] = useState(false);

    return (
      <Container className='confirmation d-flex flex-column align-items-center'>
        {userData ? (
          <div className='dataArea d-flex flex-column'>
            <h2 className='align-self-center'>Dados do usuário</h2>
            <div className="userInfo d-flex">
            <Avatar className=""
                size={{
                  width: 70,
                  height: 70,
                }}
                displayName={userData?.user.name}
                photoURL={userData?.profile.avatar}
                showDisplayName={true}
                />
              <div className="d-flex flex-wrap">
              <div className="d-flex flex-column justify-content-start mx-3">
                <p><b>Nome:</b></p>
                <p>{userData.user.fullname}</p>
                </div>
                <div className="d-flex flex-column justify-content-start mx-3">
                <p><b>Email:</b></p>
                <p> {userData.user.email}</p>
                </div>
                <div className="d-flex flex-column justify-content-start mx-3">
                <p><b>Check-in:</b> </p>
                <p>{userData?.checkin.toString() === 'false' ? "Não realizado" :  "Realizado"}</p>
                </div>
              </div>
            </div>

            <h2 className='align-self-center'>Dados do Evento:</h2>
              <p><b>Nome:</b> {userData.event.name}</p>
              <p><b>Início do evento:</b> {format(new Date(userData.event.startDate), "dd/MM/yyyy HH:mm")}</p>
              <p><b>Fim do Evento:</b> {format(new Date(userData.event.endDate), "dd/MM/yyyy HH:mm")}</p>
                <ButtonRadius className="success" onClick={() => openModal()}>Confirmar check-in </ButtonRadius>
                
          </div>

          
        ) : (
          <Loader/>
        )}
    <Modal
    show={confirmDelete}
    onHide={closeModal}
    centered={true}
    animation={false}
    >
      <Modal.Header closeButton></Modal.Header>
      <Modal.Body>
        <div className="d-flex justify-content-center">
          <p>Confirmar check-in?</p>
        </div>
        <div className="d-flex justify-content-center">
        <ButtonRadius
            className="btn rounded-pill bg-success border-success btn-speaker"
            label="Sim"
            type="submit"
            onClick={() => confirmCheckin()}
          />
          <ButtonRadius
            className="btn rounded-pill bg-success border-success btn-speaker"
            label="Não"
            type="submit"
            onClick={closeModal}
          />
        </div>
      </Modal.Body>
    </Modal>
      </Container>
    );
  }