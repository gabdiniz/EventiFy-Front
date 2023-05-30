import React, { useEffect, useRef, useState } from "react";
import { Form, Modal } from "react-bootstrap";
import axios from "axios";
import { Loader } from "../Loader/Loader";
import { Avatar } from "../Ui/Avatar/Avatar";
import { useForm } from "react-hook-form";
import { ButtonRadius } from "../Ui/ButtoRadius";
import * as yup from "yup";
import { uploadFoto } from "../../firebase/media";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { InputMultipleFiles } from "../Ui/InputMultipleFiles/InputMultipleFiles";
import "./ModalPost.scss"

export function ModalPost({ evento, user, show, handleClose }) {
    const [selectedImages, setSelectedImages] = useState([]);
    const [selectedFileNames, setSelectedFileNames] = useState([]);
    const [imagesArray, setImagesArray] = useState([]);
    const [numCaractere, setNumCaractere] = useState(255);
    const formRef = useRef(null);

    const onSelectFile = (e) => {
        const selectedFiles = e.target.files;
        const selectedFilesArray = Array.from(selectedFiles);
        const imagesArray = selectedFilesArray.map((file) => {
            return URL.createObjectURL(file);
        });
        setSelectedImages(imagesArray);
        const fileNames = selectedFilesArray.map((file) => file.name);
        setSelectedFileNames(fileNames);
        setImagesArray(selectedFilesArray);
    };

    const schema = yup.object().shape({
        message: yup.string().min(3).required(),
        eventId: yup.string().nullable().transform(transformEmptyString),
    });
    const { register, handleSubmit, reset } = useForm({
        defaultValues: { eventId: "" },
    });
    const [event, setEvent] = useState(null);
    const [registrations, setRegistrations] = useState(null);
    const navigate = useNavigate();

    async function onSubmit(data) {
        data.userId = user.id;
        data.profileId = user.profile.id;
        if (evento) {
            data.eventId = evento;
        }
        const formValidado = await schema.validate(data);
        axios
            .post(`${process.env.REACT_APP_IP}:3001/posts`, formValidado, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            })
            .then((response) => {
                if (imagesArray.length > 0) {
                    const toastId = toast.loading("Carregando arquivos...", {
                        position: "top-right",
                    });
                    for (let i = 0; i < imagesArray.length; i++) {
                        const element = imagesArray[i];
                        uploadFoto(element, "posts")
                            .then(async (url) => {
                                const media = { link: url, postId: response.data.id };
                                try {
                                    await axios.post(process.env.REACT_APP_IP+":3001/medias", media, {
                                        headers: {
                                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                                        },
                                    });
                                } catch (error) {
                                    console.error(error);
                                }
                            })
                            .finally(() => {
                                toast.dismiss(toastId);
                                handleClose();
                                if (evento) {
                                    navigate(`/eventos/${evento}`, { state: { postou: true } });
                                    reset();
                                } else {
                                    navigate("/timeline", { state: { postou: true } });
                                    reset();
                                }
                                resetForm();
                            });
                    }
                } else {
                    handleClose();
                    if (evento) {
                        navigate(`/eventos/${evento}`, { state: { postou: true } });
                        reset();
                    } else {
                        navigate("/timeline", { state: { postou: true } });
                        reset();
                    }
                    resetForm();
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }

    function transformEmptyString(value) {
        if (typeof value === "string" && value.trim() === "") {
            return null;
        } else {
            return value;
        }
    }

    function listarEventosInscrito(id) {
        axios
            .get(`${process.env.REACT_APP_IP}:3001/registrations/user/${user.id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            })
            .then((response) => {
                setRegistrations(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    function litarEvent(id) {
        axios
            .get(`${process.env.REACT_APP_IP}:3001/events?id=${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            })
            .then((response) => {
                setEvent(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    const resetForm = () => {
        setSelectedImages([]);
        reset();
    };


    useEffect(() => {
        if (show) {
            listarEventosInscrito(user.id);
        }
    }, [user?.id, show]);

    function contadorCaractere(e) {
        setNumCaractere(e.target.value.length)
    }


    useEffect(() => {
        if (show && evento) {
            litarEvent(evento);
        }
    }, [evento, show]);

    return (
      <>
        {!registrations && show ? (
          <Loader />
        ) : (
          <Modal
            centered
            size="lg"
            className=""
            show={show}
            onHide={handleClose}
          >
            <Modal.Header className="d-flex flex-wrap">
              <div className="d-flex align-items-center gap-2 mb-2">
                <Avatar
                  showDisplayName={true}
                  displayName={user?.fullname}
                  photoURL={user?.profile.avatar}
                  size={{
                    width: 70,
                    height: 70,
                  }}
                />
                <div className="mx-2 d-flex flex-column">
                  <span>{user?.fullname}</span>
                  <span>{user?.profile.nickname}</span>
                </div>
              </div>
              {evento !== undefined && evento !== null ? (
                <div className="d-flex justify-content-center">
                  <h2>{event?.name}</h2>
                </div>
              ) : (
                <Form.Select {...register("eventId")} className="mt-3">
                  <option value="">Marcar evento</option>
                  {registrations &&
                    registrations.map((registration) => (
                      <option
                        key={registration.event.id}
                        value={registration.event.id}
                      >
                        {registration.event.name}
                      </option>
                    ))}
                </Form.Select>
              )}
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Digite sua mensagem</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    {...register("message", { required: "Campo obrigatório." })}
                    onChange={(e) => contadorCaractere(e)}
                  />
                  <div className="d-flex justify-content-end">
                    <span
                      className={`pe-1 ${
                        255 - numCaractere < 0 && "text-danger border-danger"
                      }`}
                    >
                      {255 - numCaractere}
                    </span>
                  </div>
                </Form.Group>
                <Form.Group controlId="formFileMultiple" className="mb-3">
                  <Form.Label>Selecione as fotos</Form.Label>
                  <InputMultipleFiles
                    label="Selecione suas imagens"
                    ref={formRef}
                    {...register("arquivos")}
                    onChange={onSelectFile}
                    onClick={(image) => {
                      setSelectedImages(
                        selectedImages.filter((e) => e !== image)
                      );
                      const indexToRemove = selectedImages.findIndex(
                        (url) => url === image
                      );
                      if (indexToRemove !== -1) {
                        const updatedArray = [...imagesArray];
                        updatedArray.splice(indexToRemove, 1);
                        setImagesArray(updatedArray);
                      }
                      const fileNameToRemove = selectedFileNames[indexToRemove];
                      const updatedFileNames = selectedFileNames.filter(
                        (fileName) => fileName !== fileNameToRemove
                      );
                      setSelectedFileNames(updatedFileNames);
                    }}
                    selectedImages={selectedImages}
                  />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer className="footer-btn-modal-post">
              <ButtonRadius
                label="Cancelar"
                backgroundColor="transparent"
                borderColor="primary"
                textColor="primary"
                boxShadow={true}
                onClick={handleClose}
              />
              <ButtonRadius
                type="submit"
                label="Compartilhar"
                backgroundColor="success"
                borderColor="#3E1946"
                textColor="light"
                boxShadow={true}
                onClick={handleSubmit(onSubmit)}
                disabled={numCaractere > 255 ? true : false}
              />
            </Modal.Footer>
          </Modal>
        )}
      </>
    );

}
