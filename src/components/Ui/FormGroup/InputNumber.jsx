import React, { useState } from "react";
import { Form, InputGroup } from "react-bootstrap";
import classnames from "classnames";
import { BsPlus, BsDash } from "react-icons/bs"; // importa os ícones de incremento e decremento

const styles = `
  .form-control:focus {
    box-shadow: none;
    border-color: none;
  }
  .form-control {
    border-radius: 0px;
  }
  .input-group-text {
    border: none;
    background-color: transparent;
    cursor: pointer;
    border-radius:0;
    border-bottom: 1px solid #ced4da99;
  }
`;

export const InputNumber = ({ ...props }) => {
  const [value, setValue] = useState(props.defaultValue || 0);

  const handleIncrement = () => {
    setValue(value + 1);
  };

  const handleDecrement = () => {
    setValue(value - 1);
  };

  return (
    <>
      <style>{styles}</style>
      <Form>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Label>{props.label}</Form.Label>
          <div className="position-relative">
            <InputGroup>
              <InputGroup.Text onClick={handleDecrement}>
                <BsDash />
              </InputGroup.Text>
              <Form.Control
                value={value}
                className={classnames("border-0 border-bottom")}
                {...props}
                onChange={(e) => setValue(e.target.value)}
              />
              <InputGroup.Text onClick={handleIncrement}>
                <BsPlus />
              </InputGroup.Text>
            </InputGroup>
          </div>
        </Form.Group>
      </Form>
    </>
  );
};
