import React, { forwardRef } from "react";
import { Form } from "react-bootstrap";
import classnames from "classnames";

const styles = `
  .form-control:focus {
    box-shadow: none;
    border-color: none;
  }
  .form-control {
    border-radius: 0px;
    background: transparent !important;
    border-top: none !important;
    border-left: none !important;
    border-right: none !important;
    font-weight: 500;
  }
  .form-control:active{
    border-radius: 0px;
    background: transparent !important;
    border-top: none !important;
    border-left: none !important;
    border-right: none !important;
  }
  .form-control:focus{
    border-radius: 0px;
    background: transparent !important;
    border-top: none !important;
    border-left: none !important;
    border-right: none !important;
  }
  .form-control:-webkit-autofill,
  .form-control:-webkit-autofill:hover,
  .form-control:-webkit-autofill:focus,
  .form-control:-webkit-autofill:active {
    -webkit-box-shadow: 0 0 0 30px white inset;
  }

`;

export const InputDefault = forwardRef(({ iconRight, placeholder, paddingLeft, controlid, label, ...props}, ref) => {
  return (
    <>
      <style>{styles}</style>
        <Form.Group className="mb-3" controlId={controlid}>
          <Form.Label>{label}</Form.Label>
          <div className="position-relative">
            <Form.Control
              ref={ref}
              className={classnames("border-0 border-bottom", {
                "pl-0": !paddingLeft,
              })}
              {...props}
              placeholder={placeholder ? placeholder : null}
            />
            {iconRight && (
              <span
                className="position-absolute end-0 top-50 translate-middle-y"
                style={{ height: "70%", width: "50px", right: "0" }}
              >
                {iconRight}
              </span>
            )}
          </div>
        </Form.Group>
    </>
  );
});
