import { Container, Card, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Sidebar } from "../../components/Sidebar/Sidebar";
import { useEffect, useState } from "react";
import "./ControllerAdmin.scss";
import speaker from "../../assets/icons/speaker.png";
import organizers from "../../assets/icons/team.png";
import events from "../../assets/icons/events.png";
import listAdmin from "../../assets/icons/listAdmin.png";
import presentation from "../../assets/icons/presentation.png";
import location from "../../assets/icons/location.png";
import { Loader } from "../../components/Loader/Loader";

export function ControllerAdmins() {

  const [admin, setAdmin] = useState(false);
  const [load, setLoad] = useState(true);
  const { role } = JSON.parse(localStorage.getItem("userInfo"));

  useEffect(() => {
    setLoad(true);

    setTimeout(() =>{
      setAdmin(role !== "admin" && role !== "superAdmin" ? false : true);
      setLoad(false);
  }, 500) ;
  }, [role]);

  return (
    <div>
      <Sidebar />
      <div>
        <Container className="container-buttons">
          {load ? (
            <Loader />
          ): admin ? (
 <div className="box-container">
              <Row>
                <Col xs={12} sm={6}>
                  <Link to="/organizador/registrar">
                    <Card className="box-admins-container">
                      <img src={listAdmin} alt="registro de organizadores" />
                      <p>Registro de Organizadores</p>
                    </Card>
                  </Link>
                </Col>
                <Col xs={12} sm={6}>
                  <Link to="/organizadores/listar">
                    <Card className="box-admins-container">
                      <img src={organizers} alt="Organizadores" />
                      <p>Organizadores</p>
                    </Card>
                  </Link>
                </Col>
                <Col xs={12} sm={6}>
                  <Link to="/palestrantes/listar">
                    <Card className="box-admins-container">
                      <img src={speaker} alt="Palestrantes" />
                      <p>Palestrantes</p>
                    </Card>
                  </Link>
                </Col>
                <Col xs={12} sm={6}>
                  <Link to="/eventos/listar">
                    <Card className="box-admins-container">
                      <img src={events} alt="Eventos" />
                      <p>Eventos</p>
                    </Card>
                  </Link>
                </Col>
                <Col xs={12} sm={6}>
                  <Link to="/palestras/listar">
                    <Card className="box-admins-container">
                      <img src={presentation} alt="Palestras" />
                      <p>Palestras</p>
                    </Card>
                  </Link>
                </Col>
                <Col xs={12} sm={6}>
                  <Link to="/localizacoes/listar">
                    <Card className="box-admins-container">
                      <img src={location} alt="Localizações" />
                      <p>Localizações</p>
                    </Card>
                  </Link>
                </Col>
              </Row>
            </div>
          ) : (
            <div>
              <Container className="negacao">
                <div>
                  <h5>
                    Acesso negado. Você não possui permissão para acessar esta
                    página.
                  </h5>
                </div>
              </Container>
            </div>
          ) 
          }
        </Container>
      </div>
    </div>
  );
}
