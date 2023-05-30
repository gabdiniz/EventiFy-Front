import { Form } from "react-bootstrap";
import { Sidebar } from "../../components/Sidebar/Sidebar";
import { InputDefault } from "../../components/Ui/FormGroup/InputDefault";
import { useRef, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { ButtonRadius } from "../../components/Ui/ButtoRadius";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Loader } from "../../components/Loader/Loader";
import { format } from "date-fns";


export function EditTalk() {

    const schema = yup.object().shape({
        name: yup.string().min(3, 'O nome deve ter pelo menos 3 caracteres').required('O nome é obrigatório'),
        startDate: yup.date()
            .nullable()
            .required('Por favor, escolha uma data e um horário')
            .transform(transformValue)
            .min(new Date(), 'Por favor, escolha um(a) data/horário válido(a)'),
        endDate: yup.date()
            .nullable()
            .required('Por favor, escolha uma data e um horário')
            .transform(transformValue)
            .test('endDate', 'O horário de término deve ser maior que o horário de início', isEndDateValid),
        eventId: yup.string().required('Por favor, selecione um evento'),
        speakerId: yup.string().required('Por favor, selecione um palestrante')
    });

    const formRef = useRef(null);
    const { register, handleSubmit, reset, formState: { errors } } = useForm({ resolver: yupResolver(schema) });
    const navigate = useNavigate();
    const [load, setLoad] = useState(true);
    const [events, setEvents] = useState(null);
    const [speakers, setSpeakers] = useState(null);
    const [talks, setTalks] = useState(null);
    const [get, setGet] = useState(null)
    const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
    const { id } = useParams();

    useEffect(() => {
        setLoad(true);
        setTimeout(() => {
            listarEvents();
            listarSpeakers();
            setLoad(false);
        }, 500);
    }, []);


    async function listarEvents() {
        try {
            const response = await axios.get(process.env.REACT_APP_IP+":3001/events", config);
            setEvents(response.data);
        } catch (error) {
            console.log(error);
        }
    }

    async function listarSpeakers() {
        try {
            const response = await axios.get(process.env.REACT_APP_IP+":3001/speakers", config);
            setSpeakers(response.data);
        } catch (error) {
            console.log(error);
        }
    }


    useEffect(() => {
        axios.get(`${process.env.REACT_APP_IP}:3001/talks/?id=${id}`, config)
            .then(response => {
                console.log(response.data);
                response.data.startDate = format(new Date(response.data.startDate), "yyyy-MM-dd HH:mm");
                response.data.endDate = format(new Date(response.data.endDate), "yyyy-MM-dd HH:mm"); 
                reset(response.data)
                setGet(response.data)
            })
            .catch(error => {
                console.error(error);
            });
    }, []);

    function transformValue(currentValue, originalValue) {
        if (originalValue === undefined || originalValue === null || originalValue === '') {
            return undefined;
        }
        return new Date(originalValue);
    }

    function isEndDateValid(value, context) {
        const { startDate } = context.parent;
        return !startDate || !value || value > startDate;
    }

    async function onSubmit(data) {

        await schema.validate(data);
        put(data)
    }

    function put(data) {
        const id = data.id;
        delete data.id;
        delete data.createdAt;
        delete data.updatedAt;
        
        axios
            .put(`${process.env.REACT_APP_IP}:3001/talks/${id}`, data, config)
            .then(response => {
                toast.success("Palestra editada.", { position: "bottom-right", duration: 2000 });
                navigate("/palestras/listar");
            })
            .catch(error => {
                console.error(error);
                toast.error("Erro ao editar a palestra.", { position: "bottom-right", duration: 2000 });
            });
    }

    return (
        <div>
            <Sidebar />
            <div className="container-talk">
                <div className="register-talk">
                    {load ? (
                        <Loader />
                    ) : (
                        <div >
                            {get &&
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
                                        <span className="talk-span-error">{errors.startDate.message}</span>
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
                                    {events && <>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Evento</Form.Label>
                                            <Form.Select
                                                className="talk-input-select"
                                                {...register("eventId")}
                                            >
                                                <option value="">Selecione um evento</option>
                                                {events && events?.map(event => <option key={event.id} value={event.id}>{event.name}</option>)}
                                            </Form.Select>
                                        </Form.Group>
                                        {errors?.eventId && (
                                            <span className="talk-span-error">{errors.eventId.message}</span>
                                        )}
                                    </>
                                    }

                                    {speakers && <>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Palestrante</Form.Label>
                                            <Form.Select
                                                className="talk-input-select"
                                                {...register("speakerId")}
                                            >
                                                <option value="">Selecione um palestrante</option>
                                                {speakers && speakers?.map(speaker => <option key={speaker.id} value={speaker.id}>{speaker.fullname}</option>)}
                                            </Form.Select>
                                        </Form.Group>
                                        {errors?.speakerId && (
                                            <span className="talk-span-error">{errors.speakerId.message}</span>
                                        )}
                                    </>}
                                    <div className="botao-talk">
                                        <ButtonRadius
                                            className="btn rounded-pill bg-success border-success btn-talk"
                                            label="Editar"
                                            type="submit"
                                        />
                                    </div>
                                </Form>
                            }
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}