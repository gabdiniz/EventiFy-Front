import { Modal, Form } from "react-bootstrap";
import { InputDefault } from "../Ui/FormGroup/InputDefault";
import { useForm } from "react-hook-form";
import { ButtonRadius } from "../Ui/ButtoRadius";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import "./CardEditProfile.scss";

export function CardEditFullName(props) {
  const schemaProfile = yup.object().shape({
    fullname: yup.string().nullable().transform(transformEmptyString),
  });

  function transformEmptyString(value) {
    if (typeof value === "string" && value.trim() === "") {
      return null;
    }
    return value;
  }

  const { register: registerEditFullname, handleSubmit } =
    useForm({ resolver: yupResolver(schemaProfile) });

  return (
    <Modal show={props.show} onHide={props.handleClose} centered>
      <Modal.Header closeButton className="card-edit-close-btn">
        <Modal.Title>Edite seu nome</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit(props.onSubmit)}>
          <div>
            <InputDefault
              placeholder="Nome"
              type="text"
              controlid="nome-editar-perfil"
              {...registerEditFullname("fullname", { required: false })}
              defaultValue={props.user ? props.user.nome : ""}
            />
          </div>
          <div className="btn-profile-edit">
            <ButtonRadius
              type="submit"
              label="Salvar"
              backgroundColor="success"
              textColor="light"
              boxShadow={true}
            />
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}