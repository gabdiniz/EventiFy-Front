import { Container, Card, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Sidebar } from "../../components/Sidebar/Sidebar";
import { useEffect, useState } from "react";
import "./ControllerOrganizators.scss";
import speaker from "../../assets/icons/speaker.png";
import events from "../../assets/icons/events.png";
import presentation from "../../assets/icons/presentation.png";
import location from "../../assets/icons/location.png";
import { Loader } from "../../components/Loader/Loader";

export function ControllerOrganizators() {
  const [load, setLoad] = useState(true);
  const [organizator, setOrganizator] = useState(false);
  const { role } = JSON.parse(localStorage.getItem("userInfo"));

  useEffect(() => {
    setLoad(true);

    setTimeout(() => {
      setOrganizator(
        role !== "organizador" || role !== "admin" || role !== "superAdmin"
          ? true
          : false
      );
      setLoad(false);
    }, 500)



  }, [role]);

  return (
    <div>
      <Sidebar />
      <div>
        <Container className="container-buttons">
          {load ? (
            <Loader />
          ) : organizator ? (
            <div className="box-container">
              <Row>
                <Col xs={12} sm={6}>
                  <Link to="/eventos/listar">
                    <Card className="box-admins-container px-5">
                      <img src={events} alt="Eventos" />
                      <p>Eventos</p>
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
