import { Container, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { InputDefault } from "../../components/Ui/FormGroup/InputDefault";
import { ButtonRadius } from "../../components/Ui/ButtoRadius";
import { InputPassword } from "../../components/Ui/FormGroup/InputPassword";
import axios from "axios";
import { toast } from "react-hot-toast";
import { object, string } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { Sidebar } from "../../components/Sidebar/Sidebar";
import "./RegisterOrganizers.scss";
import { Loader } from "../../components/Loader/Loader";

export function RegisterOrganizers() {
  const [load, setLoad] = useState(true);
  const [authToken, setAuthToken] = useState();

  useEffect(() => {
    setLoad(true);
    setTimeout(() => {
      setLoad(false);
    }, 500);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setAuthToken(token);
  }, []);

  const user = JSON.parse(localStorage.getItem("userInfo"));
  let cadastroOrganizador;
  if (user.role === "participante" || user.role === "organizador") {
    cadastroOrganizador = false;
  } else {
    cadastroOrganizador = true;
  }

  //validação yup
  const schema = object({
    fullname: string()
      .min(3, "O nome deve ter no mínimo 3 caracteres")
      .required(),
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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  function onSubmit(data) {
    if (data.password !== data.repetirPassword)
      return toast.error("As senhas devem ser iguais.", {
        position: "bottom-right",
        duration: 2500,
      });
    delete data.repetirPassword;
    axios
      .post(process.env.REACT_APP_IP+":3001/organizadores", data, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
      .then((response) => {
        toast.success("Organizador cadastrado com sucesso.", {
          position: "bottom-right",
          duration: 2000,
        });
      })
      .catch((error) => {
        toast.error("Erro ao cadastrar organizador.", {
          position: "bottom-right",
          duration: 2000,
        });
        console.log(error);
      });
  }

  return (
    <div>
      <Sidebar />
      <div className="organizator-register d-flex justify-content-center align-items-center">
        {load ? (
          <Loader />
        ) : (
          <>
            {cadastroOrganizador ? (
              <Container className="m-auto px-auto organizator-form">
                <Form onSubmit={handleSubmit(onSubmit)}>
                  <InputDefault
                    placeholder="Nome"
                    type="text"
                    controlid="nome-cadastro"
                    {...register("fullname")}
                  />
                  <span className="erro">{errors.fullname?.message}</span>
                  <InputDefault
                    placeholder="Email"
                    type="email"
                    controlid="email"
                    {...register("email")}
                  />
                  <span className="erro">{errors.email?.message}</span>

                  <InputPassword
                    placeholder="Senha"
                    controlid="senha-organizador"
                    {...register("password")}
                  />
                  <span className="erro">{errors.password?.message}</span>
                  <InputPassword
                    placeholder="Repetir senha"
                    controlid="repetir-senha-cadastro-desktop"
                    {...register("repetirPassword")}
                  />

                  <div className="botao-speaker">
                    <ButtonRadius
                      className="btn rounded-pill bg-success border-success btn-speaker"
                      label="Cadastrar"
                      type="submit"
                    />
                  </div>
                </Form>
              </Container>
            ) : (
              <div className="container-organizator register">
                <Container className="m-auto">
                  <div className="container-formOrganizator">
                    <h5>
                      Acesso negado. Você não possui permissão para acessar esta
                      página.
                    </h5>
                  </div>
                </Container>
              </div>
            )}
          </>
        )
        }
      </div>
    </div>
  );
}
