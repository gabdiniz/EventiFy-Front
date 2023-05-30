import { useRef, useEffect, useState } from "react";
import { InputDefault } from "../../components/Ui/FormGroup/InputDefault";
import { ButtonRadius } from "../../components/Ui/ButtoRadius";
import { useForm } from "react-hook-form";
import { Form } from "react-bootstrap";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "../../components/Sidebar/Sidebar";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { uploadFoto } from "../../firebase/media";
import "./RegisterSpeaker.scss";
import { Loader } from "../../components/Loader/Loader";
import { InputMultipleFiles } from "../../components/Ui/InputMultipleFiles/InputMultipleFiles";

export function RegisterSpeaker() {
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedFileNames, setSelectedFileNames] = useState([]);
  const [imagesArray, setImagesArray] = useState([]);
  
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
    fullname: yup
      .string()
      .min(3, "O nome deve ter pelo menos 3 caracteres")
      .required("O nome é obrigatório"),
    description: yup
      .string()
      .min(10, "A descrição deve ter pelo menos 10 caracteres")
      .required(),
    position: yup
      .string()
      .min(3, "O cargo/ocupação deve ter pelo menos 3 caracteres")
      .required(),
    company: yup.string().nullable().transform(transformEmptyString),
    education: yup.string().nullable().transform(transformEmptyString),
    avatar: yup.string().nullable().transform(transformEmptyString),
  });

  const formRef = useRef(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });
  const navigate = useNavigate();
  const [authToken, setAuthToken] = useState();
  const [load, setLoad] = useState(true);

  useEffect(() => {
    setLoad(true);
    setTimeout(() => {
      setLoad(false);
    }, 500);
  }, []);

  function transformEmptyString(value) {
    if (typeof value === "string" && value.trim() === "") {
      return null;
    } else if (typeof value === "string" && value === "[object FileList]") {
      return null;
    }
    return value;
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    setAuthToken(token);
  }, []);

  const config = { headers: { Authorization: `Bearer ${authToken}` } };

  async function onSubmit(data) {
    let img = imagesArray[0];
    await schema.validate(data);
    if (img) {
      const toastId = toast.loading("Upload da imagem...", {
        position: "top-right",
      });
      uploadFoto(img, "speaker").then((url) => {
        toast.dismiss(toastId);
        delete data.imagem;
        data.avatar = url;
        post(data);
      });
    } else {
      delete data.imagem;
      post(data);
    }
  }

  function post(data) {
    console.log(data)
    axios
      .post(process.env.REACT_APP_IP+":3001/speakers", data, config)
      .then(() => {
        toast.success("Palestrante cadastrato com sucesso!", {
          position: "bottom-right",
          duration: 2500,
        });
        navigate("/palestrantes/listar");
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.response.data.message, {
          position: "bottom-right",
          duration: 2500,
        });
      });
  }



  return (
    <div>
      <Sidebar />
      <div className="container-speaker">
        {load ? (
          <Loader />
        ) : (
          <div className="register-speaker">
            <Form onSubmit={handleSubmit(onSubmit)}>
              <InputDefault
                placeholder="Nome"
                type="text"
                ref={formRef}
                controlid="nome-cadastro"
                {...register("fullname")}
              />
              {errors?.fullname && (
                <span className="speaker-span-error">
                  {errors.fullname.message}
                </span>
              )}
              <InputDefault
                placeholder="Descrição"
                type="text"
                ref={formRef}
                controlid="description"
                {...register("description")}
              />
              {errors?.description && (
                <span className="speaker-span-error">
                  {errors.description.message}
                </span>
              )}
              <InputDefault
                placeholder="Cargo"
                type="text"
                ref={formRef}
                controlid="position"
                {...register("position")}
              />
              {errors?.position && (
                <span className="speaker-span-error">
                  {errors.position.message}
                </span>
              )}
              <InputDefault
                placeholder="Empresa"
                type="text"
                ref={formRef}
                controlid="company"
                {...register("company")}
              />
              <InputDefault
                placeholder="Formação Acadêmica"
                type="text"
                ref={formRef}
                controlid="education"
                {...register("education")}
              />
              <div className="mt-4">
                <InputMultipleFiles
                  label="Selecione a foto do palestrante"
                  ref={formRef}
                  multiple={false}
                  {...register("imagem")}
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
              </div>
              <div className="botao-speaker">
                <ButtonRadius
                  className="btn rounded-pill bg-success border-success btn-speaker"
                  label="Cadastrar"
                  type="submit"
                />
              </div>
            </Form>
          </div>
        )}
      </div>
    </div>
  );
}
