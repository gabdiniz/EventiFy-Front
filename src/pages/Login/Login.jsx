import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Container, Form, Modal } from "react-bootstrap";
import { AiOutlineLinkedin } from "react-icons/ai";
import { InputDefault } from "../../components/Ui/FormGroup/InputDefault";
import { InputPassword } from "../../components/Ui/FormGroup/InputPassword";
import { ButtonRadius } from "../../components/Ui/ButtoRadius";
import { useContext, useEffect, useRef, useState } from "react";
import logo from "../../assets/images/logoEvents.png";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-hot-toast";
import axios from "axios";
import { Loader } from "../../components/Loader/Loader";
import "./Login.scss"



export function Login() {


  const [resetEmail, setResetEmail] = useState(false); // estado criado para mudar a tela do modal de recuperar senha.
  const [loading, setLoading] = useState(false); // estado criado para controlar a exibição do Loader.
  const navigate = useNavigate();
  const { userLogin } = useContext(AuthContext);
  const formRefDesktop = useRef(null);
  const formRefMobile = useRef(null);
  const formEsqueciSenha = useRef(null);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);


  useEffect(() => {
    if (localStorage.getItem("token")) navigate("/timeline");
  }, [navigate]);

  const { register: registerMobile, handleSubmit: handleSubmitMobile, formState: { errors: errorsMobile } } = useForm();
  const { register: registerDesktop, handleSubmit: handleSubmitDesktop, formState: { errors: errorsDesktop } } = useForm();
  const { register: registerEsqueciSenha, handleSubmit: handleEsqueciSenha, formState: { errors: errorsEsqueciSenha, isSubmitted } } = useForm();

  async function submitForm(data) {
    const error = await userLogin(data);
    if (error) {
      toast.error(error.response.data.message, {
        position: "bottom-right",
        duration: 2500
      });
    } else {
      navigate("/timeline");
    }
  }

  function submitFormMobile(data) {
    submitForm(data);
  }

  function submitFormDesktop(data) {
    submitForm(data);
  }

  async function onSubmitEsqueciSenha(data) {
    setLoading(true);
    axios
      .post(process.env.REACT_APP_IP+":3001/auth/reset-password", data)
      .then(response => {
        setResetEmail(data.email);
        setTimeout(() => {
          handleClose();
          navigate("/");
        }, 5000);
      })
      .catch(error => {
        toast.error(error.response.data.message, {
          position: "bottom-right",
          duration: 3500
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="container-login">
      <Container className="container-center-login">
        <Form
          className="form-container"
          onSubmit={handleSubmitDesktop(submitFormDesktop)}
        >
          <div className="logo-mobile-forms">
            <img src={logo} alt="Logo Events" />
          </div>
          <div className="form-container-group">
            <InputDefault
              className={errorsDesktop.email && "is-invalid"}
              placeholder="Email"
              type="email"
              ref={formRefDesktop}
              controlid="1"
              {...registerDesktop("email")}
            />
            <InputPassword
              className="login-field"
              placeholder="Senha"
              size="md"
              controlid="password-mobile"
              ref={formRefDesktop}
              {...registerDesktop("password")}
            />
            <div className="text-end link-password">
              <Link onClick={handleShow}>Esqueci minha senha</Link>
            </div>

            <div className="buttons mt-5">
              <ButtonRadius
                type="submit"
                label="Entrar"
                backgroundColor="success"
                borderColor="#3E1946"
                textColor="light"
                boxShadow={true}
              />
              <ButtonRadius
                onClick={() => navigate("/cadastrar")}
                label="Cadastrar"
                boxShadow={true}
                backgroundColor="transparent"
                borderColor="primary"
                textColor="primary"
              />
              <div className="botao-desabilitado">
                <ButtonRadius
                  label="Entrar com Linkedin"
                  backgroundColor="info"
                  borderColor="info"
                  textColor="light"
                  position="relative"
                  disabled={true}
                >
                  <AiOutlineLinkedin
                    style={{ position: "absolute", fontSize: 30, left: 10, bottom: 3 }}
                  />
                </ButtonRadius>
              </div>
            </div>
          </div>
        </Form>
      </Container>

      {/* formMobile */}

      <Form
        className="form-container-mobile"
        onSubmit={handleSubmitMobile(submitFormMobile)}
      >
        <div className="logo-mobile-forms">
          <img src={logo} alt="Logo Events" />
        </div>
        <div className="form-container-group">
          <InputDefault
            ref={formRefMobile}
            className={errorsMobile.nome && "is-invalid"}
            placeholder="Email"
            type="email"
            controlid="3"
            {...registerMobile("email")}
          />
          <InputPassword
            ref={formRefMobile}
            className="login-field"
            placeholder="Senha"
            controlid="4"
            size="md"
            {...registerMobile("password")}
          />
          <div className="text-end link-password">
            <span onClick={handleShow}>Esqueci minha senha</span>
          </div>
          <div className="buttons mt-5">
            <ButtonRadius
              type="submit"
              label="Entrar"
              backgroundColor="success"
              borderColor="#3E1946"
              textColor="light"
              boxShadow={true}
              size="sx"
            />
            <ButtonRadius
              onClick={() => navigate("/cadastrar")}
              label="Cadastrar"
              boxShadow={true}
              backgroundColor="transparent"
              borderColor="primary"
              textColor="primary"
            />
            <div className="mt-3 botao-desabilitado">
              <ButtonRadius
                label="Entrar com Linkedin"
                backgroundColor="info"
                borderColor="info"
                textColor="light"
                position="relative"
                type="submit"
                disabled={true}
              >
                <AiOutlineLinkedin
                  style={{ position: "absolute", fontSize: 30, left: 10, bottom:3 }}
                />
              </ButtonRadius>
            </div>
          </div>
        </div>
      </Form>

      <Modal show={show} onHide={handleClose} animation={false} centered={true}>
        <Modal.Header closeButton className="mb-3 mt-4">
          <div className="esquerda-header-modal-esqueci-senha"></div>
          <span>Esqueci minha senha</span>
        </Modal.Header>
        <Modal.Body>
          <div>
            {resetEmail ? (
              <div className="row d-flex align-items-center mb-4">
                <div className="col-2">
                  <i className="bi bi-check-circle-fill fs-3"></i>
                </div>
                <div className="col-10">
                  <div className="row">
                    E-mail enviado com sucesso para {resetEmail}.
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <Form onSubmit={handleEsqueciSenha(onSubmitEsqueciSenha)}>
                  <InputDefault
                    ref={formEsqueciSenha}
                    placeholder="Email"
                    type="email"
                    controlid="5"
                    {...registerEsqueciSenha("email", {
                      required: "O email é obrigatório",
                    })}
                    className={
                      !isSubmitted
                        ? "form-control"
                        : errorsEsqueciSenha.email
                        ? "is-invalid"
                        : "is-valid"
                    }
                  />
                  <Form.Text className="invalid-feedback">
                    {errorsEsqueciSenha.email?.message}
                  </Form.Text>
                  <Form.Text className="text-muted text-justify">
                    Informe um email válido para que possamos encaminhar um
                    e-mail contendo o link para recuperação da senha.
                  </Form.Text>
                  <div className="d-flex justify-content-center p-3 mt-5">
                    {loading ? (
                      <Loader message={"Enviando"} />
                    ) : (
                      <ButtonRadius
                        type="submit"
                        label="Enviar"
                        backgroundColor="primary"
                        borderColor="#3E1946"
                        textColor="light"
                        boxShadow={true}
                        size="lg"
                      />
                    )}
                  </div>
                </Form>
              </div>
            )}
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
