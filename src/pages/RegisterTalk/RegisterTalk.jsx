import { Form } from "react-bootstrap";
import { Sidebar } from "../../components/Sidebar/Sidebar";
import { InputDefault } from "../../components/Ui/FormGroup/InputDefault";
import { useRef, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { ButtonRadius } from "../../components/Ui/ButtoRadius";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import "./RegisterTalk.scss";
import { Loader } from "../../components/Loader/Loader";

export function RegisterTalk() {
  const schema = yup.object().shape({
    name: yup
      .string()
      .min(3, "O nome deve ter pelo menos 3 caracteres")
      .required("O nome é obrigatório"),
    startDate: yup
      .date()
      .nullable()
      .required("Por favor, escolha uma data e um horário")
      .transform(transformValue)
      .min(new Date(), "Por favor, escolha um(a) data/horário válido(a)"),
    endDate: yup
      .date()
      .nullable()
      .required("Por favor, escolha uma data e um horário")
      .transform(transformValue)
      .test(
        "endDate",
        "O horário de término deve ser maior que o horário de início",
        isEndDateValid
      ),
    eventId: yup.string().required("Por favor, selecione um evento"),
    speakerId: yup.string().required("Por favor, selecione um palestrante"),
  });

  const formRef = useRef(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });
  const navigate = useNavigate();
  const [events, setEvents] = useState(null);
  const [speakers, setSpeakers] = useState(null);
  const [load, setLoad] = useState(true);
  const config = {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  };

  useEffect(() => {
    setLoad(true);

    setTimeout(() => {
      listarEvents();
      listarSpeakers();
      setLoad(false);
    }, 500);
  }, []);

  async function listarEvents() {
    await axios
      .get(process.env.REACT_APP_IP+":3001/events", config)
      .then((response) => {
        setEvents(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async function listarSpeakers() {
    await axios
      .get(process.env.REACT_APP_IP+":3001/speakers", config)
      .then((response) => {
        setSpeakers(response.data);
      })
      .catch((error) => {
        console.log(error);
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

  async function onSubmit(data) {
    try {
      await schema.validate(data);
      axios
        .post(process.env.REACT_APP_IP+":3001/talks", data, config)
        .then(() => {
          toast.success("Palestra cadastrada com sucesso!", {
            position: "bottom-right",
            duration: 2500,
          });
          navigate("/palestras/listar");
        })
        .catch((error) => {
          toast.error(error.response.data.message, {
            position: "bottom-right",
            duration: 2500,
          });
        });
    } catch (error) {
      if (error.inner) {
        const validationErrors = {};
        error.inner.forEach((err) => {
          validationErrors[err.path] = err.message;
        });
        formRef.current && formRef.current.setError(validationErrors);
      }
    }

    try {
      const eventData = {
        eventId: data.eventId,
        speakerId: data.speakerId
      }
      await axios.post(process.env.REACT_APP_IP+":3001/eventspeakers", eventData, config)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div>
      <Sidebar />
      <div className="container-talk">
        {load ? (
          <Loader />
        ) : (
          <div className="register-talk">
            <Form onSubmit={handleSubmit(onSubmit)}>
              <InputDefault
                label="Nome da Palestra"
                type="text"
                ref={formRef}
                controlid="name"
                {...register("name")}
              />
              {errors?.name && (
                <span className="talk-span-error">{errors.name.message}</span>
              )}
              <InputDefault
                className="talk-datetime-local-input"
                label="Horário de início"
                type="datetime-local"
                ref={formRef}
                controlid="startDate"
                {...register("startDate")}
              />
              {errors?.startDate && (
                <span className="talk-span-error">
                  {errors.startDate.message}
                </span>
              )}
              <InputDefault
                className="talk-datetime-local-input"
                label="Horário de término"
                type="datetime-local"
                ref={formRef}
                controlid="endDate"
                {...register("endDate")}
              />
              {errors?.endDate && (
                <span className="talk-span-error">{errors.endDate.message}</span>
              )}
              <Form.Group className="mb-3">
                <Form.Label>Evento</Form.Label>
                <Form.Select
                  className="talk-input-select"
                  {...register("eventId")}
                >
                  <option value="">Selecione um evento</option>
                  {events &&
                    events.map((event) => (
                      <option key={event.id} value={event.id}>
                        {event.name}
                      </option>
                    ))}
                </Form.Select>
              </Form.Group>
              {errors?.eventId && (
                <span className="talk-span-error">{errors.eventId.message}</span>
              )}
              <Form.Group className="mb-3">
                <Form.Label>Palestrante</Form.Label>
                <Form.Select
                  className="talk-input-select"
                  {...register("speakerId")}
                >
                  <option value="">Selecione um palestrante</option>
                  {speakers &&
                    speakers.map((speaker) => (
                      <option key={speaker.id} value={speaker.id}>
                        {speaker.fullname}
                      </option>
                    ))}
                </Form.Select>
              </Form.Group>
              {errors?.speakerId && (
                <span className="talk-span-error">
                  {errors.speakerId.message}
                </span>
              )}
              <div className="botao-talk">
                <ButtonRadius
                  className="btn rounded-pill bg-success border-success btn-talk"
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
