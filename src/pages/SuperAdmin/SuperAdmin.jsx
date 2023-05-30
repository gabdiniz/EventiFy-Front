import { useForm } from "react-hook-form";
import { Container, Form, Modal } from "react-bootstrap";
import { Sidebar } from "../../components/Sidebar/Sidebar";
import { InputDefault } from "../../components/Ui/FormGroup/InputDefault";
import { InputPassword } from "../../components/Ui/FormGroup/InputPassword";
import { ButtonRadius } from "../../components/Ui/ButtoRadius";
import { toast } from "react-hot-toast";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { object, string } from "yup";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Loader } from "../../components/Loader/Loader";
import "./SuperAdmin.scss";

export function SuperAdmin() {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [superAdmin, setSuperAdmin] = useState(false);
  const { role } = JSON.parse(localStorage.getItem("userInfo"));
  const [loader, setLoader] = useState(true);


  useEffect(() => {
    setSuperAdmin(role !== "superAdmin" ? false : true);
    setLoader(false);
  }, [role]);

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

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  async function onSubmit(data) {
    if (data.role === "")
      return toast.error("Escolha o papel que deseja cadastrar.", {
        position: "bottom-right",
        duration: 2500,
      });
    if (data.password !== data.repetirSenha)
      return toast.error("As senhas devem ser iguais.", {
        position: "bottom-right",
        duration: 2500,
      });
    await schema.validate(data);
    if (data.role === "admin") {
      delete data.role;
      delete data.repetirSenha;
      axios
        .post(process.env.REACT_APP_IP+":3001/admins", data, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        .then((e) => {
          toast.success("Admin cadastrado.", {
            position: "bottom-right",
            duration: 2500,
          });
          reset();
        })
        .catch((error) => {
          toast.error(error.response.data.message, {
            position: "bottom-right",
            duration: 2500,
          });
        });
    } else if (data.role === "organizador") {
      delete data.role;
      delete data.repetirSenha;
      axios
        .post(process.env.REACT_APP_IP+":3001/organizadores", data, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        .then(() => {
          toast.success("Organizador cadastrado.", {
            position: "bottom-right",
            duration: 2500,
          });
          reset();
        })
        .catch((error) => {
          toast.error(error.response.data.message, {
            position: "bottom-right",
            duration: 2500,
          });
        });
    } else {
      return toast.error("Role invalida.", {
        position: "bottom-right",
        duration: 2500,
      });
    }
  }

  return (
    <div>
      <Sidebar />
      <div className="super-admin d-flex justify-content-center align-items-center">
        {loader ? (
          <Loader />
        ) : superAdmin ? (
          <>
            <Container className="m-auto px-auto super-admin-form">
              <Form className="px-3 " onSubmit={handleSubmit(onSubmit)}>
                <Form.Group className="mb-3">
                  <Form.Select
                    className={`select-cadastro-tela-superadmin`}
                    {...register("role")}
                  >
                    <option value="">Role</option>
                    <option value="admin">Admin</option>
                    <option value="organizador">Organizador</option>
                  </Form.Select>
                </Form.Group>
                <InputDefault
                  placeholder="Nome"
                  type="text"
                  {...register("fullname")}
                />
                <InputDefault
                  placeholder="E-mail"
                  type="email"
                  {...register("email")}
                />
                <InputPassword placeholder="Senha" {...register("password")} />
                <InputPassword
                  placeholder="Repetir senha"
                  {...register("repetirSenha")}
                />
                {errors?.password && (
                  <Link size="sm" className="text-muted" onClick={handleShow}>
                    Senha incorreta: Política de senha
                  </Link>
                )}
                <div className="d-flex justify-content-center mt-5 buttons px-3">
                  <ButtonRadius
                    type="submit"
                    label="Cadastrar"
                    backgroundColor="success"
                    borderColor="#3E1946"
                    textColor="light"
                    boxShadow={true}
                  />
                </div>
              </Form>
            </Container>
          </>
        ) : (
          <div>
            <Container className="m-auto ">
              <div>
                <h5>
                  Acesso negado. Você não possui permissão para acessar esta
                  página.
                </h5>
              </div>
            </Container>
          </div>
        )}
      </div>
      <Modal show={show} onHide={handleClose} animation={false} centered="true">
        <Modal.Body>
          <Form.Text className="text-muted ms-2 text-redefinir-senha">
            <b>A senha deve conter:</b>
            <br />
            <div className="mx-3 mt-2">
              * letra minúscula
              <br />
              * letra maiúscula
              <br />
              * número
              <br />
              * caractere especial
              <br />* ter no minimo 8 digitos
            </div>
          </Form.Text>
        </Modal.Body>
      </Modal>
    </div>
  );
}
