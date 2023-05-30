import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Loader } from '../../components/Loader/Loader';
import { Container, Modal } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { Avatar } from '../../components/Ui/Avatar/Avatar';
import { ButtonRadius } from '../../components/Ui/ButtoRadius';
import { format } from "date-fns";
import { toast } from 'react-hot-toast';



export function ValidateEventSpeaker() {
  const { speakerId, eventId } = useParams();
  const [speakerData, setSpeakerData] = useState(null);

  useEffect(() => {
    axios
    .get(`${process.env.REACT_APP_IP}:3001/eventspeakers/checkin/${speakerId}/${eventId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
    .then(response => {
        const data = response.data;
        setSpeakerData(data);
      })
      .catch(error => {
        console.error(error);
      });
  }, [speakerId, eventId]);


  function confirmSpeaker(){
    toast.success("Entrada confirmada",{position:"bottom-right", duration:2500});
    closeModal();
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
      {speakerData ? (
        <div className='dataArea d-flex flex-column'>
          <h2 className='align-self-center'>Dados do palestrante:</h2>
          <div className="userInfo d-flex">
          <Avatar className=""
              size={{
                width: 70,
                height: 70,
              }}
              displayName={speakerData?.speaker.fullname}
              photoURL={speakerData?.speaker.avatar}
              showDisplayName={true}
              />
            <div className="d-flex flex-wrap">
            <div className="d-flex flex-column justify-content-start mx-3">
              <p><b>Nome:</b></p>
              <p>{speakerData.speaker.fullname}</p>
              </div>
              <div className="d-flex flex-column justify-content-start mx-3">
              <p><b>Email:</b></p>
              <p> {speakerData.speaker.email}</p>
              </div>
              <div className="d-flex flex-column justify-content-start mx-3">
              <p><b>Empresa:</b> </p>
              <p>{speakerData.speaker.company}</p>
              </div>
            </div>
          </div>

          <h2 className='align-self-center'>Dados do Evento:</h2>
            <p><b>Nome:</b> {speakerData.event.name}</p>
            <p><b>Início do evento:</b> {format(new Date(speakerData.event.startDate), "dd/MM/yyyy HH:mm")}</p>
            <p><b>Fim do Evento:</b> {format(new Date(speakerData.event.endDate), "dd/MM/yyyy HH:mm")}</p>
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
          onClick={() => confirmSpeaker() }
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