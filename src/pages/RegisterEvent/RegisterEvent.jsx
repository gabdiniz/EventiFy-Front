import { React, useEffect, useRef } from "react";
import { useState } from "react";
import { Container, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { ButtonRadius } from "../../components/Ui/ButtoRadius";
import { InputDefault } from "../../components/Ui/FormGroup/InputDefault";
import { Sidebar } from "../../components/Sidebar/Sidebar";
import { toast } from "react-hot-toast";
import axios from "axios";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { uploadFoto } from "../../firebase/media";
import { BsFillGeoAltFill } from "react-icons/bs";
import { ModalCadastroLocation } from "../../components/ModalCadastroLocation/ModalCadastroLocation";
import { InputMultipleFiles } from "../../components/Ui/InputMultipleFiles/InputMultipleFiles";
import "./RegisterEvent.scss";

export function RegisterEvent() {
  const schema = yup.object().shape({
    name: yup
      .string()
      .min(2, "O nome deve ter no mínimo dois caracteres")
      .required(),
    startDate: yup
      .date()
      .required("Por favor, escolha uma data e um horário")
      .transform(transformValue)
      .min(new Date(), "Por favor, escolha um(a) data/horário válido(a)"),
    endDate: yup
      .date()
      .required("Por favor, escolha uma data e um horário")
      .transform(transformValue)
      .test(
        "endDate",
        "A data e hora de término deve ser posterior a data e hora de início.",
        isEndDateValid
      ),
    segment: yup
      .string()
      .min(3, "Este campo deve ter no mínimo três caracteres")
      .required(),
    description: yup.string().nullable().required("Este campo é obrigatório"),
    userId: yup.string().required("Por favor, selecione um organizador"),
    locationId: yup.string().required("Por favor, adicione uma localização"),
    vacancies: yup.string().required("Número de vagas insuficientes"),
    
  });

  const navigate = useNavigate();
  const [locations, setLocations] = useState(null);
  const [organizadores, setOrganizadores] = useState(null);
  const [showCadastroLocation, setShowCadastroLocation] = useState(false);
  const [cadastrouLocation, setCadastrouLocation] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedFileNames, setSelectedFileNames] = useState([]);
  const [imagesArray, setImagesArray] = useState([]);
  
   const {
     register,
     setValue,
     handleSubmit,
     formState: { errors },
   } = useForm({ resolver: yupResolver(schema) });
 
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
    validaTipoArquivos(e);
  };

  const formRef = useRef(null);

  useEffect(() => {
    getOrganizadores();
    getLocations();
  }, [cadastrouLocation]);

  async function getOrganizadores() {
    axios
      .get(process.env.REACT_APP_IP+":3001/organizadores", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => {
        setOrganizadores(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  async function getLocations() {
    axios
      .get(process.env.REACT_APP_IP+":3001/locations", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => {
        setLocations(response.data);
        setCadastrouLocation(false);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  async function onRegister(data) {
    let dataValid = await schema.validate(data);

    const toastId = toast.loading("Carregando imagem...", {
      position: "top-right",
    });
    const img = imagesArray[0];
    await uploadFoto(img, "eventos")
      .then(async (url) => {
        dataValid.header = url;
        delete dataValid.arquivos;
        await axios
          .post(process.env.REACT_APP_IP+":3001/events", dataValid, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          })
          .then((response) => {
            toast.success("Evento cadastrado com sucesso.", {
              position: "bottom-right",
              duration: 2500,
            });
          })
          .catch((error) => {
            console.log(error);
            toast.error(error.response.data.message, {
              position: "bottom-right",
              duration: 2500,
            });
          })
          .finally(() => {
            navigate("/eventos");
          });
      })
      .finally(() => {
        toast.dismiss(toastId);
      });
  }

  function transformValue(currentValue, originalValue) {
    if (
      originalValue === undefined ||
      originalValue === null ||
      originalValue === ""
    ) {
      return undefined;
    }
    return new Date(originalValue);
  }

  function isEndDateValid(value, context) {
    const { startDate } = context.parent;
    return !startDate || !value || value > startDate;
  }

  function validaTipoArquivos(e) {
    const files = Array.from(e.target.files);
    const imageTypes = ["image/png", "image/jpeg", "image/gif"];

    for (let i = 0; i < files.length; i++) {
      if (!imageTypes.includes(files[i].type)) {
        alert(
          "Formato de arquivo não suportado. Suporte apenas para .png, .jpg, .jpeg, .gif."
        );
        setValue("arquivos", null);
        return;
      }
    }
  }

  function openCadastroLocation() {
    setShowCadastroLocation(true);
  }

  function closeCadastroLocation() {
    setCadastrouLocation(true);
    setShowCadastroLocation(false);
  }

  return (
    <div>
      <Sidebar />
      <div className="master">
        <Container className="box">
          <Form onSubmit={handleSubmit(onRegister)}>
            <InputDefault
              placeholder="Nome do Evento"
              type="text"
              {...register("name")}
            />
            <span className="event-span-error">
              {errors.name?.message}
            </span>

            <div className="row">
              <div className="col m-auto">
                <InputDefault
                  type="datetime-local"
                  label="Data e hora de início"
                  {...register("startDate")}
                />
                <span className="event-span-error">
                  {errors.startDate?.message}
                </span>
              </div>

              <div className="col m-auto">
                <InputDefault
                  type="datetime-local"
                  label="Data e hora de término"
                  {...register("endDate")}
                />
                <span className="event-span-error">
                  {errors.endDate?.message}
                </span>
              </div>
            </div>

            <InputDefault
              className="segmenttInpu"
              placeholder="Segmento"
              type="text"
              {...register("segment")}
            />
            <span className="event-span-error">
              {errors.segment?.message}
            </span>

            <InputDefault
              placeholder="Descrição"
              type="text-area"
              {...register("description")}
            />
            <span className="event-span-error">
              {errors.description?.message}
            </span>

            <div className="formStyle">
              <Form.Group className="">
                <InputMultipleFiles
                  label="Selecione a foto do evento"
                  ref={formRef}
                  multiple={false}
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
              <span className="event-span-error">
                {errors.arquivos?.message}
              </span>
            </div>

            <div className="betweenOne formStyle">
              {organizadores && (
                <Form.Group className="formStyle">
                  <Form.Label className="txt">Organizador</Form.Label>
                  <Form.Select
                    aria-label="Default select example"
                    {...register("userId")}
                  >
                    <option value="">Selecione</option>
                    {organizadores.map((organizador) => (
                      <option key={organizador.id} value={organizador.id}>
                        {organizador.fullname}
                      </option>
                    ))}
                  </Form.Select>
                  <span className="event-span-error">
                    {errors.userId?.message}
                  </span>
                </Form.Group>
              )}

              {locations && (
                <Form.Group className="formStyle">
                  <Form.Label className="txt">Localização</Form.Label>
                  <Form.Select
                    aria-label="Default select example"
                    {...register("locationId")}
                  >
                    <option value="">Selecione</option>
                    {locations.map((location) => (
                      <option key={location.id} value={location.id}>
                        {location.name}
                      </option>
                    ))}
                  </Form.Select>
                  <span className="event-span-error">
                    {errors.locationId?.message}
                  </span>
                </Form.Group>
              )}
            </div>
            <div className="buttonRegisterLocation">
              <ButtonRadius
                label="Adicionar nova localização"
                backgroundColor="success"
                onClick={openCadastroLocation}
              >
                <BsFillGeoAltFill className="pencil" />
              </ButtonRadius>
            </div>

            <Form.Group className="formNumber">
              <Form.Label className="txt">Número de Vagas</Form.Label>
              <Form.Control
                {...register("vacancies")}
                type="number"
              />
            </Form.Group>
            <span className="event-span-error">
              {errors.vacancies?.message}
            </span>

            <div className="buttonDiv">
              <ButtonRadius
                type="submit"
                label="CADASTRAR"
                backgroundColor="success"
                textColor="light"
                boxShadow={true}
              />
            </div>
          </Form>
          <div>
            <ModalCadastroLocation
              show={showCadastroLocation}
              handleClose={closeCadastroLocation}
              tonavigate="/evento/cadastrar"
            />
          </div>
        </Container>
      </div>
      <div></div>
    </div>
  );
}
