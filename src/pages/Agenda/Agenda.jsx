import { useEffect, useState } from "react";
import { Sidebar } from "../../components/Sidebar/Sidebar";
import axios from "axios";
import { Container, Tab, Tabs, Card, Collapse } from "react-bootstrap";
import "./Agenda.scss";
import { useParams, useNavigate } from "react-router-dom";
import { ButtonRadius } from "../../components/Ui/ButtoRadius";
import { Avatar } from "../../components/Ui/Avatar/Avatar";
import { toast } from "react-hot-toast";
import { Loader } from "../../components/Loader/Loader";


export function Agenda() {
    const [talks, setTalks] = useState([]);
    const [diasEvento, setDiasEvento] = useState([]);
    const [evento, setEvento] = useState();
    const [mostrarInfo, setMostrarInfo] = useState(false);
    const [eventSpeaker, setEventSpeaker] = useState([]);
    const [registration, setRegistration] = useState([]);
    const [showAgenda, setShowAgenda] = useState(false);
    const [loader, setLoader] = useState(true);
    const [emptyAgenda, setEmptyAgenda] = useState(false);
    const userId = JSON.parse(localStorage.getItem("userInfo")).id;
    const { id } = useParams(); // id do evento
    const navigate = useNavigate();

    useEffect(() => {
        listarTalks();
        listarEvents();
        listarEventSpeaker();
        listarRegistration();
    }, []);

    useEffect(() => {
        if (talks !== null && talks.length > 0) {
            setLoader(false);
            setShowAgenda(true);
        } 
    }, [talks])

    async function listarTalks() {
        await axios.get(`${process.env.REACT_APP_IP}:3001/talks?eventId=${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            }).then((response) => {
                if (response.data !== null && response.data.length > 0) {
                    setTalks(response.data);
                    setShowAgenda(true);
                } else {
                    setLoader(false);
                    setEmptyAgenda(true);
                }             
            });
    }

    async function listarEvents() {
        try {
            const response = await axios.get(`${process.env.REACT_APP_IP}:3001/events?id=${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            const dataInicial = new Date(response.data.startDate);
            const dataFinal = new Date(response.data.endDate);
            setEvento(dataInicial);
            getDatesBetween(dataInicial, dataFinal);

        } catch (error) {
            console.log(error);
        }
    }

    async function listarEventSpeaker() {
        try {
            const response = await axios.get(`${process.env.REACT_APP_IP}:3001/eventspeakers?eventId=${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            setEventSpeaker(response.data);
        } catch (error) {
            console.log(error);
        }
    }

    async function listarRegistration() {
        try {
            const response = await axios.get(`${process.env.REACT_APP_IP}:3001/registrations/event/${id}/user/${userId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            setRegistration(response.data);
        } catch (error) {
            console.log(error);
        }
    }

    function getDatesBetween(startDate, endDate) {
        var dates = [];
        var currentDate = new Date(startDate);

        while (currentDate <= endDate) {
            dates.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
        }
        setDiasEvento(dates);
    }

    function handleCardClick(talkId) {
        setMostrarInfo(talkId === mostrarInfo ? false : talkId);
    }

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
                toast.success("Registrado em evento com sucesso.", {
                    position: "bottom-right",
                    duration: 2500,
                });
                navigate(`/eventos/${id}`)
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
            <div className="agenda">
                <Container className="container-agenda">
                    {loader ? (
                        <Loader />
                    ) : showAgenda ? (
                        <div className="div-agenda">
                            <h3>Programação</h3>
                            <Tabs
                                className="mb-3 d-flex justify-content-center tabs-agenda"
                                defaultActiveKey={evento?.toLocaleDateString('pt-br')}
                                id="uncontrolled-tab-example"
                            >
                                {diasEvento.map((data, index) => {
                                    const filteredTalks = talks.filter((talk) => {
                                        const talkDate = new Date(talk.startDate);
                                        return talkDate.toDateString() === data.toDateString();
                                    });

                                    return (
                                        <Tab
                                            className="tab-agenda"
                                            eventKey={data.toLocaleDateString('pt-br')}
                                            title={data.toLocaleDateString('pt-br')}
                                            key={index}
                                        >
                                            {filteredTalks.map((talk) => {
                                                const dataConvertidaInicial = new Date(talk.startDate);
                                                const dataConvertidaFinal = new Date(talk.endDate);
                                                const horaInicial = dataConvertidaInicial.toLocaleTimeString('pt-br', { hour: "2-digit", minute: "2-digit" });
                                                const horaFinal = dataConvertidaFinal.toLocaleTimeString('pt-br', { hour: "2-digit", minute: "2-digit" });
                                                const info = talk.id === mostrarInfo;
                                                const speakers = eventSpeaker.filter((speaker) => speaker.speakerId === talk.speakerId)
                                                console.log(speakers)
                                                return (
                                                    <Card key={talk.id} className="d-flex justify-content-center gap-4 card-agenda" onClick={() => handleCardClick(talk.id)}>
                                                        <p>{talk.name}</p>
                                                        <div className="spanflex">
                                                            <span>{`${horaInicial}-${horaFinal}`}</span>
                                                        </div>
                                                        <Collapse in={info}>
                                                            <div className="collapse-info-agenda">
                                                                <Card.Body id="card-body-info-agenda">
                                                                    <div>
                                                                        {speakers.map((speaker) => {
                                                                            return (
                                                                                <div className="card-info-agenda">
                                                                                    <div className="card-info-agenda-speaker">
                                                                                        <Avatar
                                                                                            size={{
                                                                                                width: 70,
                                                                                                height: 70,
                                                                                            }}
                                                                                            photoURL={speaker.speaker.avatar}
                                                                                        />
                                                                                        <div className="info-speaker-agenda">
                                                                                            <span><strong>{speaker.speaker.fullname}</strong></span>
                                                                                            <span id="span-description-agenda">{speaker.speaker.description}</span>
                                                                                        </div>
                                                                                    </div>
                                                                                    <span id="span-speaker"><small><strong>Palestrante</strong></small></span>
                                                                                </div>
                                                                            )
                                                                        })}
                                                                    </div>
                                                                </Card.Body>
                                                            </div>
                                                        </Collapse>
                                                    </Card>
                                                )
                                            })}
                                            {!registration &&
                                                <ButtonRadius
                                                    className="btn-agenda"
                                                    label="Registre-se no evento"
                                                    onClick={onRegister}
                                                />
                                            }
                                        </Tab>
                                    );
                                })}
                            </Tabs>
                        </div>
                    ) : (
                        emptyAgenda && (
                            <h4><small>Ainda não há programação para esse evento.</small></h4>
                        )
                    )}
                </Container>
            </div>
        </div>
    );
}
