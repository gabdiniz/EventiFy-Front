import { useContext, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { Container, Nav, Navbar, Offcanvas } from 'react-bootstrap';
import { Avatar } from "../Ui/Avatar/Avatar";
import { BsPersonVideo3, BsFillPeopleFill, BsChevronLeft, BsHouseDoorFill, BsFillChatFill, BsBoxArrowRight, BsFillPersonFill, BsDiagram3 } from "react-icons/bs";
import { TfiHelpAlt } from "react-icons/tfi";
import { AuthContext } from "../../context/AuthContext";
import logo from "../../assets/images/logoEvents.png";
import { useNavigate, useLocation } from 'react-router-dom';
import "./Header.scss";

export function Header() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);

  const { userLogout, user, updateUser } = useContext(AuthContext);
  
  const { id, role } = JSON.parse(localStorage.getItem('userInfo'))
  //const [user, setUser] = useState();

  const [verifyRole, setVerifyRole] = useState(false);
  const [superAdmin, setSuperAdmin] = useState(false);
  const [admin, setAdmin] = useState(false);
  const [organizator, setOrganizator] = useState(false);
  //superAdmin
  useEffect(() => {
    setSuperAdmin((role !== 'superAdmin') ? false : true)
    setAdmin((role !== 'admin') ? false : true)
    setOrganizator((role !== 'organizador') ? false : true)
    setVerifyRole(role !== 'superAdmin' && role !== 'admin' ? true : false)
  }, [role])

const navigate = useNavigate();

  useEffect(() => {
    updateUser();
  }, [id]);
  
  const handleVoltar = () => {

    navigate(-1);
  };
  const location = useLocation();
  
  return (
    <>
      <Navbar bg="primary" expand={"xl"} className="header">
        <Container fluid className="cont">
          <div className="btn-voltar">
            {(location.pathname !== '/timeline' && <BsChevronLeft onClick={handleVoltar} />)}
          </div>
          <div className="esquerda-header"></div>
          <Link to="/timeline" className="logo-nav">
            <div className="logo-container-header">
              <img src={logo} alt="logo eventsaas" />
            </div>
          </Link>
          <div className="direita-header"></div>
          <Navbar.Toggle
            onClick={() => setShow(!show)}
            aria-controls={`offcanvasNavbar-expand-${"xl"}`}
          />
          <Navbar.Offcanvas
            show={show}
            onHide={handleClose}
            className="bg-primary"
            id={`offcanvasNavbar-expand-${"xl"}`}
            aria-labelledby={`offcanvasNavbarLabel-expand-${"xl"}`}
            placement="end"
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title
                className="m-auto"
                id={`offcanvasNavbarLabel-expand-${"xl"}`}
              >
                <div className="logo-container-header logo-offcanvas">
                  <img src={logo} alt="logo eventsaas" />
                </div>
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav className="flex-grow-1 pe-3 nav">
                <div className="item-offcanvas">
                  <Avatar
                    showDisplayName={true}
                    displayName={user?.nome}
                    photoURL={user?.avatar}
                    size={{
                      width: 70,
                      height: 70,
                    }}
                  />
                </div>
                <span className="item-offcanvas text-muted">
                  {user?.apelido}
                </span>
                <span className="item-offcanvas text-muted mb-4">
                  {user?.nome}
                </span>
                <Nav.Link
                  as={Link}
                  onClick={handleClose}
                  to="/timeline"
                  className="item-offcanvas text-offcanvas"
                >
                  <BsHouseDoorFill className="icons-navbar" />
                  Home
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/perfil"
                  onClick={handleClose}
                  className="item-offcanvas text-offcanvas"
                >
                  <BsFillPersonFill className="icons-navbar" />
                  Perfil
                </Nav.Link>

                {verifyRole &&
                  <Nav.Link
                    onClick={handleClose}
                    as={Link}
                    to="/amigos"
                    className="item-offcanvas text-offcanvas"
                  >
                    <BsFillPeopleFill className="icons-navbar" />
                    Amigos
                  </Nav.Link>
                }

                <Nav.Link
                  onClick={handleClose}
                  as={Link}
                  to="/messages"
                  className="item-offcanvas text-offcanvas"
                >
                  <BsFillChatFill className="icons-navbar" />
                  Mensagens
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  onClick={handleClose}
                  to="/eventos"
                  className="item-offcanvas text-offcanvas"
                >
                  <BsPersonVideo3 className="icons-navbar" />
                  Eventos
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  onClick={handleClose}
                  to="/ajuda"
                  className="item-offcanvas text-offcanvas"
                >
                  <TfiHelpAlt className="icons-navbar" />
                  Ajuda
                </Nav.Link>
                {superAdmin && (
                  <Nav.Link
                    as={Link}
                    onClick={handleClose}
                    to="/superadmin"
                    className="item-offcanvas text-offcanvas mb-5"
                  >
                    <BsDiagram3 className="icons-navbar" />
                    SuperAdmin
                  </Nav.Link>
                )}
                {admin && (
                  <Nav.Link
                    as={Link}
                    onClick={handleClose}
                    to="/admin"
                    className="item-offcanvas text-offcanvas mb-5"
                  >
                    <BsDiagram3 className="icons-navbar" />
                    Admin
                  </Nav.Link>
                )}
                {organizator && (
                  <Nav.Link
                    as={Link}
                    onClick={handleClose}
                    to="/organizador"
                    className="item-offcanvas text-offcanvas mb-5"
                  >
                    <BsDiagram3 className="icons-navbar" />
                    Organizador
                  </Nav.Link>
                )}

                <Nav.Link
                  onClick={userLogout}
                  as={Link}
                  to="/"
                  className="item-offcanvas text-offcanvas btn-sair"
                >
                  <BsBoxArrowRight className="icons-navbar" />
                  Sair
                </Nav.Link>
              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>
    </>
  );
}