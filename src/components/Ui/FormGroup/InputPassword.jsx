import React, { forwardRef, useState } from "react";
import { Form } from "react-bootstrap";
import classnames from "classnames";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";

const styles = `
  .form-control:focus {
    box-shadow: none;
    border-color: none;
  }
  .form-control {
    border-radius: 0px;
  }
`;

export const InputPassword = forwardRef(({ iconRight, placeholder, paddingLeft, controlid, label, ...props}, ref) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };



  return (
    <>
      <style>{styles}</style>

        <Form.Group className="mb-3" controlId={controlid}>
          <Form.Label>{label}</Form.Label>
          <div className="position-relative">
            <Form.Control
            ref={ref}
              type={showPassword ? "text" : "password"}
              className={classnames("border-0 border-bottom", {
                "pl-0": !paddingLeft,
              })}
              {...props}
              placeholder={placeholder ? placeholder : null}
              style={{ paddingLeft: paddingLeft }}
            />
            <span
              className="position-absolute end-0 top-50 translate-middle-y"
              style={{ height: "70%", width: "50px", cursor:"pointer" }}
              onClick={handleShowPassword}
            >
              {showPassword ? (
                <AiFillEyeInvisible size={28} />
              ) : (
                <AiFillEye size={28} />
              )}
            </span>
          </div>
        </Form.Group>
    </>
  );
});
