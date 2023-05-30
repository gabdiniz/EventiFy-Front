import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Container, Form, Modal } from "react-bootstrap";
import { InputDefault } from "../../components/Ui/FormGroup/InputDefault";
import { InputPassword } from "../../components/Ui/FormGroup/InputPassword";
import { ButtonRadius } from "../../components/Ui/ButtoRadius";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { yupResolver } from "@hookform/resolvers/yup";
import { object, string } from "yup";
import logo from "../../assets/images/logoEvents.png";
import "./Register.scss";

export function Register() {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const schema = object({
    fullname: string().min(3).required(),
    email: string().email().required("O email é obrigatório"),
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

  const navigate = useNavigate();

  const onSubmitMobile = (data) => {
    onRegister(data);
  };
  const onSubmitDesktop = (data) => {
    onRegister(data);
  };

  function onRegister(data) {
    if (!data.termosDeUso) {
      toast.error("Os termos de uso são obrigatórios.", {
        position: "bottom-right",
        duration: 2500,
      });
      return null;
    }
    if (data.password !== data.repetirPassword) {
      toast.error("As senhas devem ser iguais.", {
        position: "bottom-right",
        duration: 2500,
      });
      return null;
    }
    axios
      .post(process.env.REACT_APP_IP+":3001/auth/cadastro", data)
      .then(() => {
        toast.success("Usuario cadastrado com sucesso.", {
          position: "bottom-right",
          duration: 2500,
        });
        navigate("/login");
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.response.data.message, {
          position: "bottom-right",
          duration: 2500,
        });
      });
  }

  return (
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
            <InputDefault
              placeholder="Nome"
              type="text"
              {...form1.register("fullname")}
            />
            <InputDefault
              placeholder="Email"
              type="email"
              {...form1.register("email")}
            />
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
                <Link size="sm" className="senha-incorreta-politica" onClick={handleShow}>
                  Senha incorreta: Política de senha
                </Link>
              )}
            </div>

            <Form.Text className="text-danger"></Form.Text>

            <div className="text-end link-password">
              <Link size="sm" className="text-muted" to={"/login"}>
                Voltar para login
              </Link>
            </div>
            <div className="d-flex flex-column align-items-center mt-2 mb-4">
              <div className="d-flex flex-column align-items-start ">
                <Form.Check
                  className="switch-cadastro"
                  type="switch"
                  label="Aceitar termos de uso"
                  {...form1.register("termosDeUso")}
                />

                <Form.Check
                  className="switch-cadastro mt-2"
                  type="switch"
                  label="Receber Newsletter"
                  {...form1.register("newsLetter")}
                />
              </div>
            </div>
            <div className="buttons mt-3px-4">
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
        <div className="logo-mobile-forms register-page">
          <img src={logo} alt="Logo Events" />
        </div>
        <div className="form-container-group">
          <InputDefault
            placeholder="Nome"
            type="text"
            {...form2.register("fullname")}
          />
          <InputDefault
            placeholder="Email"
            type="email"
            {...form2.register("email")}
          />
          <InputPassword placeholder="Senha" {...form2.register("password")} />
          <InputPassword
            placeholder="Repetir senha"
            {...form2.register("repetirPassword")}
          />
          <div>
            {form2.formState.errors?.password && (
              <Link size="sm" className="senha-incorreta-politica" onClick={handleShow}>
                Senha incorreta: Política de senha
              </Link>
            )}
          </div>
          <div className="invalid-feedback"></div>
          <div className="text-end link-password">
            <Link size="sm" className="text-muted" to={"/login"}>
              Voltar para login
            </Link>
          </div>
          <div className="d-flex flex-column align-items-center mt-2 mb-4">
            <div className="d-flex flex-column align-items-start ">
              <Form.Check
                className="switch-cadastro"
                type="switch"
                label="Aceitar termos de uso"
                {...form2.register("termosDeUso")}
              />

              <Form.Check
                className="switch-cadastro mt-2"
                type="switch"
                label="Receber Newsletter"
                {...form2.register("newsLetter")}
              />
            </div>
          </div>
          <div className="buttons mt-3  mb-3 px-4">
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
      <Modal show={show} onHide={handleClose} animation={false} centered="true">
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
  );
}
