import React, { useEffect } from "react";
import logo from "../../assets/images/logoEvents.png";
import { ButtonRadius } from "../../components/Ui/ButtoRadius";
import { Link, useNavigate } from "react-router-dom";
import "./SignIn.scss";

export function SignIn() {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token")) navigate("/timeline");
  }, [navigate]);

  return (
    <div className="signIn">
      <div className="logo-signIn">
        <div className="logo-img">
          <img src={logo} alt="Logo Events" />
        </div>
      </div>
      <div className="buttons-group-singIn">
        <div className="buttonOne">
          <ButtonRadius
            as={Link}
            to="/login"
            label="Login"
            backgroundColor="success"
            borderColor="#3E1946"
            textColor="light"
            boxShadow={true}
          />
        </div>
        <div className="buttonTwo">
          <ButtonRadius
            as={Link}
            to="/cadastrar"
            label="Cadastrar"
            boxShadow={true}
            backgroundColor="transparent"
            borderColor="white"
            textColor="white"
          />
        </div>
      </div>
    </div>
  );
}
