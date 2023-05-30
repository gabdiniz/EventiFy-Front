import { Modal, Form } from "react-bootstrap";
import { InputDefault } from "../Ui/FormGroup/InputDefault";
import { useForm } from "react-hook-form";
import { ButtonRadius } from "../Ui/ButtoRadius";


export function CardSecurity(props) {

  const { register: registerSecurity,handleSubmit} =
    useForm();

  return (
    <Modal
      show={props.show}
      onHide={props.handleClose}
      className="card-edit-close-btn"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Senha e Segurança</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit(props.onSubmit)}>
          <div>
            <InputDefault
              placeholder="Alterar Senha"
              type="password"
              controlid="password"
              {...registerSecurity("password", { required: false })}
              defaultValue={props.user ? props.user.password : ""}
            />
          </div>

          <div>
            <InputDefault
              placeholder="Repetir senha"
              type="password"
              controlid="password"
              {...registerSecurity("password", { required: false })}
              defaultValue={props.user ? props.user.password : ""}
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
