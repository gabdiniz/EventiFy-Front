import { Card } from "react-bootstrap";
import { FaTrash } from "react-icons/fa";
import "./CardChat.css";
import { useState } from "react";

export function CardChat(props) {
    const [show, setShow] = useState(false);

    return (
        <Card className={props.className} style={{ width: "18rem" }}>
            <div className="card-chat-thumb-container" onClick={() => setShow(true)}>
                <div className="card-chat-summary">
                    <span className="card-chat-summary-description">
                        {props.message ? props.message : "Descrição ..."}
                    </span>
                    {props.myMessage && (
                        <FaTrash className="icons-card-chat" onClick={() => props.handleDelete(props.messageId)} />
                    )}
                </div>
                <div className="card-chat-thumb-footer">
                    <div className="container-date-chat">
                        <span className="card-chat-date-thumb">{props.datePost}</span>
                        <span className="card-chat-date-thumb">Enviada em: </span>
                    </div>

                </div>
            </div>
        </Card>
    );
};

