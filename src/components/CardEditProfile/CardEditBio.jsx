import { Modal, Form } from "react-bootstrap";
import { InputDefault } from "../Ui/FormGroup/InputDefault";
import { useForm } from "react-hook-form";
import { ButtonRadius } from "../Ui/ButtoRadius";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import "./CardEditProfile.scss";

export function CardEditBio(props) {
  const schemaBio = yup.object().shape({
    company: yup.string().nullable().transform(transformEmptyString),
    position: yup.string().nullable().transform(transformEmptyString),
    description: yup.string().nullable().transform(transformEmptyString),
  });

  function transformEmptyString(value) {
    if (typeof value === "string" && value.trim() === "") {
      return null;
    }
    return value;
  }
  const { register: registerEditProfile, handleSubmit } = useForm({ resolver: yupResolver(schemaBio)});

  

  return (
    <Modal show={props.show} onHide={props.handleClose} centered>
      <Modal.Header closeButton className="card-edit-close-btn">
        <Modal.Title>Editar dados sobre você:</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit(props.onSubmit)}>
          <div>
            <InputDefault
              placeholder="Empresa"
              type="text"
              controlid="empresa-editar-perfil"
              {...registerEditProfile("company", { required: false })}
              defaultValue={props.user ? props.user.empresa : ""}
            />
            <InputDefault
              placeholder="Cargo"
              type="text"
              controlid="cargo-editar-perfil"
              {...registerEditProfile("position", { required: false })}
              defaultValue={props.user ? props.user.cargo : ""}
            />
            <Form.Control
              as="textarea"
              className="mt-5 mb-3"
              placeholder="Descrição"
              style={{ height: "100px" }}
              {...registerEditProfile("description", { required: false })}
              defaultValue={props.user ? props.user.descricao : ""}
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
