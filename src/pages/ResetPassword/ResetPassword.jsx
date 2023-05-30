import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Card, Container, Form, Modal } from "react-bootstrap";
import { InputPassword } from "../../components/Ui/FormGroup/InputPassword";
import { ButtonRadius } from "../../components/Ui/ButtoRadius";
import logo from "../../assets/images/logoEvents.png";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import jwtDecode from "jwt-decode";
import { yupResolver } from "@hookform/resolvers/yup";
import { object, string } from "yup";
import "./ResetPassword.scss";

export function ResetPassword() {
  const schema = object({
    password: string()
      .min(8, "A senha deve ter no mínimo 8 caracteres")
      .matches(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula")
      .matches(/[a-z]/, "A senha deve conter pelo menos uma letra minúscula")
      .matches(/[0-9]/, "A senha deve conter pelo menos um numero")
      .matches(
        /[!@#$%^&*(),.?":{}|<>]/,
        "A senha deve conter pelo menos um caractere especial"
      )
      .required("A senha é obrigatória"),
  });

  const form1 = useForm({ resolver: yupResolver(schema) });
  const form2 = useForm({ resolver: yupResolver(schema) });

  const [show, setShow] = useState(false); // estado do modal
  const [tokenValid, setTokenValid] = useState(false); // estado que controla a exibição ou não do form
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token"); // extrai o token da url
  const navigate = useNavigate();

  /* Função para abrir e fechar o modal */
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const onSubmitMobile = (data) => {
    onRegister(data);
  };
  const onSubmitDesktop = (data) => {
    onRegister(data);
  };

  useEffect(() => {
    isValidToken(token);
  }, [token]);

  /* Função responsavel por validar o token e controlar o estado de exibição da tela */
  function isValidToken(token) {
    try {
      const decodedToken = jwtDecode(token);
      const expirationTime = decodedToken.exp * 1000; // Multiplica por 1000 para converter segundos para milissegundos
      const currentTime = Date.now();

      if (currentTime > expirationTime) {
        return setTokenValid(false);
      } else {
        return setTokenValid(true);
      }
    } catch (error) {
      console.error(error.message);
      return setTokenValid(false);
    }
  }

  function onRegister(data) {
    data.token = token; // add o token para que o mesmo seja validado se a secret key é válida no back-end

    if (data.password !== data.repetirPassword) {
      toast.error("As senhas devem ser iguais.", {
        position: "bottom-right",
        duration: 2500,
      });
      return;
    }

    axios
      .post(process.env.REACT_APP_IP+":3001/auth/change-password", data)
      .then((response) => {
        toast.success(response.data.message, {
          position: "bottom-right",
          duration: 3500,
        });
        setTimeout(() => {
          // depois de trocar a senha o usuário será direcionado para o login
          navigate("/login");
        }, 3500);
      })
      .catch((error) => {
        toast.error(error.response.data.message, {
          position: "bottom-right",
          duration: 2500,
        });
      });
  }

  return (
    <div>
      {tokenValid ? (
        <div className="container-login register">
          <Container className="container-center-login">
            <Form
              className="form-container"
              onSubmit={form1.handleSubmit(onSubmitDesktop)}
            >
              <div className="logo-mobile-forms">
                <img src={logo} alt="Logo Events" />
              </div>
              <div className="form-container-group">
                <InputPassword
                  placeholder="Senha"
                  {...form1.register("password")}
                />
                <InputPassword
                  placeholder="Repetir senha"
                  {...form1.register("repetirPassword")}
                />
                <div>
                  {form1.formState.errors?.password && (
                    <span
                      size="sm"
                      className="text-muted"
                      onClick={handleShow}
                      style={{ cursor: "pointer" }}
                    >
                      Senha incorreta: Política de senha
                    </span>
                  )}
                </div>
                <div className="buttons mt-3 px-4">
                  <ButtonRadius
                    type="submit"
                    label="Cadastrar"
                    backgroundColor="success"
                    borderColor="#3E1946"
                    textColor="light"
                    boxShadow={true}
                    size="sx"
                  />
                </div>
              </div>
            </Form>
          </Container>

          {/* formMobile */}

          <Form
            className="form-container-mobile"
            onSubmit={form2.handleSubmit(onSubmitMobile)}
          >
            <div className="logo-mobile-forms logo-mobile-resetPassword">
              <img src={logo} alt="Logo Events" />
            </div>
            <div className="form-container-group">
              <InputPassword
                placeholder="Senha"
                {...form2.register("password")}
              />
              <InputPassword
                placeholder="Repetir senha"
                {...form2.register("repetirPassword")}
              />
              <div>
                {form2.formState.errors?.password && (
                  <span
                    size="sm"
                    className="text-muted"
                    onClick={handleShow}
                    style={{ cursor: "pointer" }}
                  >
                    Senha incorreta: Política de senha
                  </span>
                )}
              </div>
              <div className="buttons mt-5 px-4">
                <ButtonRadius
                  type="submit"
                  label="Cadastrar"
                  backgroundColor="success"
                  borderColor="#3E1946"
                  textColor="light"
                  boxShadow={true}
                  size="sx"
                />
              </div>
            </div>
          </Form>
          <Modal
            show={show}
            onHide={handleClose}
            animation={false}
            centered="true"
          >
            <Modal.Body>
              <Form.Text className="text-muted ms-2 text-redefinir-senha">
                <b>A senha deve conter:</b>
                <br />
                * letra minúscula
                <br />
                * letra maiúscula
                <br />
                * número
                <br />
                * caractere especial
                <br />* ter no minimo 8 digitos
              </Form.Text>
            </Modal.Body>
          </Modal>
        </div>
      ) : (
        <Container className="container-mobile-alert">
          <Card className="d-flex align-items-center justify-content-center">
            <div className="d-flex flex-column align-items-center justify-content-center gap-3 mx-3">
              <i className="bi bi-exclamation-triangle-fill"></i>
              <p className="text-justify">
                O token fornecido na url é inválido ou está expirado, faça uma
                nova solicitação de recuperação de senha.
              </p>
              <div className="text-end link-password mb-3">
                <Link size="sm" className="text-muted" to={"/login"}>
                  Voltar para login
                </Link>
              </div>
            </div>
          </Card>
        </Container>
      )}
    </div>
  );
}
