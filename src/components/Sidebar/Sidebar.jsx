import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import {
  BsFillPersonFill,
  BsFillPeopleFill,
  BsHouseDoorFill,
  BsFillChatFill,
  BsPersonVideo3,
  BsBoxArrowRight,
  BsDiagram3Fill,
} from "react-icons/bs";
import { Avatar } from "../../components/Ui/Avatar/Avatar";
import { AuthContext } from "../../context/AuthContext";
import logo from "../../assets/images/logoEvents.png";
import "./Sidebar.scss";
import { TfiHelpAlt } from "react-icons/tfi";

export function Sidebar() {
  const { userLogout } = useContext(AuthContext);
  const { id, role } = JSON.parse(localStorage.getItem("userInfo"));
  const [user, setUser] = useState();
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
 
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_IP}:3001/users/?id=${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((user) => {
        const info = {
          nome: user.data.fullname,
          apelido: user.data.profile.nickname,
          avatar: user.data.profile.avatar,
        };
        setUser(info);
      })
      .catch((error) => {
        toast.error(error.response.data.message, {
          position: "bottom-right",
          duration: 2500,
        });
      });
  }, [id]);

  return (
    <div className="sidebar">
      <div className="logo-container">
        <img src={logo} alt="Logo Events SaaS" />
      </div>
      <div className="avatar-sidebar">
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
      <ul>
        <Link to={"/timeline"}>
          <li>
            <BsHouseDoorFill className="icons-sidebar" />
            Home
          </li>
        </Link>
        {verifyRole && 
        <Link to={"/amigos"}>
        <li>
          <BsFillPeopleFill className="icons-sidebar" />
          Meus amigos
        </li>
      </Link>
      }       
        <Link to={"/perfil"}>
          <li>
            <BsFillPersonFill className="icons-sidebar" />
            Perfil
          </li>
        </Link>
        <Link to="/messages">
          <li>
            <BsFillChatFill className="icons-sidebar" />
            Mensagens
          </li>
        </Link>
        <Link to="/eventos">
          <li>
            <BsPersonVideo3 className="icons-sidebar" />
            Eventos
          </li>
        </Link>
        <Link to="/ajuda">
          <li>
            <TfiHelpAlt className="icons-sidebar" />
            Ajuda
          </li>
        </Link>
        
        {
          superAdmin &&
          <Link to="/superadmin">
            <li>
              <BsDiagram3Fill className="icons-sidebar" />
              SuperAdmin
            </li>
          </Link>
        }
        {
          admin &&
          <Link to="/admin">
            <li>
              <BsDiagram3Fill className="icons-sidebar" />
              Admin
            </li>
          </Link>
        }
        {
          organizator &&
          <Link to="/organizador">
            <li>
              <BsDiagram3Fill className="icons-sidebar" />
              Organizador
            </li>
          </Link>
        }
        <Link onClick={userLogout} to="/">
          <li className="mt-5">
            <BsBoxArrowRight className="icons-sidebar" />
            Sair
          </li>
        </Link>
      </ul>
    </div>
  );
}
