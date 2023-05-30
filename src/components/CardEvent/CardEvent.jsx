import { Button, Card } from "react-bootstrap";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { BsCalendar3 } from "react-icons/bs";
import { BsInfoCircle } from "react-icons/bs";
import { BsQrCode } from "react-icons/bs";
import { BsPeopleFill } from "react-icons/bs";

import "./CardEvent.scss"
import { Link } from "react-router-dom";

export function CardEvent(props) {
    const { image, title, startDate, endDate, location, info, className, onClickFunction, onClickFunctionDois, idEvento, agenda } = props


    return (
        <Card className={`card-event ${className}`}>
            <div className="card-event-thumb-container">
                <Card.Img src={image} className="card-event-img" />
            </div>
            <div className="card-event-thumb-footer">
                <div className="card-event-header">
                    <span className="card-event-title">
                        <strong>{title}</strong>
                    </span>
                    {info && (
                        <div className="d-flex">
                            <Button className="info-card-evento"
                                onClick={onClickFunction}
                                style={{ backgroundColor: "transparent", border: "none" }}
                            >
                                <BsInfoCircle className="card-icon-b" size={20}/>
                            </Button>
                            <Button className="info-card-evento"
                                onClick={onClickFunctionDois}
                                style={{ backgroundColor: "transparent", border: "none" }}
                            >
                                <BsQrCode className="card-icon-b" size={20}/>
                            </Button>
                            <Button className="info-card-evento"
                                style={{ backgroundColor: "transparent", border: "none" }}
                            >
                                <Link to={`/participantes/listar/${idEvento}`}>  <BsPeopleFill className="card-icon-b" size={20}/></Link>
                            </Button>
                            <Button className="info-card-evento"
                                style={{ backgroundColor: "transparent", border: "none" }}
                            >
                                <Link to={`/agenda/${idEvento}`}>  <BsCalendar3 className="card-icon-b" size={20}/></Link>
                            </Button>
                        </div>
                    )}
                    {agenda && (
                        <div className="d-flex">
                            <Button className="info-card-evento"
                                style={{ backgroundColor: "transparent", border: "none" }}
                            >
                                <Link to={`/agenda/${idEvento}`}>  <BsCalendar3 className="card-icon-b" size={20}/></Link>
                            </Button>
                        </div>
                    )}
                </div>
                <div className="card-event-info-thumb mt-3">
                    {startDate && endDate && (
                        <span className="info-card-evento">
                            <BsCalendar3 className="card-icon-a" size={20}/> {startDate} - {endDate}
                        </span>
                    )}

                    {location && (
                        <span className="info-card-evento">
                            <HiOutlineLocationMarker className="card-icon-b" size={20}/> {location}
                        </span>
                    )}
                </div>
            </div>
        </Card>

    );
}