import { Button } from "react-bootstrap";
import classNames from "classnames";

export const ButtonRadius = ({
  primary,
  backgroundColor,
  borderColor,
  textColor,
  icon,
  size,
  boxShadow,
  position,
  label,
  padding,
  onClickFunction,
  disabled,
  ...props
}) => {
  const btnClasses = classNames("btn", "rounded-pill", {
    "bg-primary": primary,
    "bg-secondary": backgroundColor === "secondary",
    "bg-white": backgroundColor === "white",
    "bg-success": backgroundColor === "success",
    "bg-danger": backgroundColor === "danger",
    "bg-warning": backgroundColor === "warning",
    "bg-info": backgroundColor === "info",
    "bg-light": backgroundColor === "light",
    "bg-dark": backgroundColor === "dark",
    "border-primary": backgroundColor === "primary",
    "border-secondary": backgroundColor === "secondary",
    "border-success": backgroundColor === "success",
    "border-danger": backgroundColor === "danger",
    "border-warning": backgroundColor === "warning",
    "border-info": backgroundColor === "info",
    "border-light": backgroundColor === "light",
    "border-dark": backgroundColor === "dark",
    [`text-${textColor}`]: textColor !== undefined,
    "btn-box-shadow": boxShadow !== undefined,
    "bg-transparent": backgroundColor === "transparent",
  });

  return (
    <Button
      className={btnClasses}
      style={{
        borderColor: borderColor,
        position: position,
        boxShadow: boxShadow && "0px 4px 4px 2px rgba(0, 0, 0, 0.25)",
        backgroundColor:
          backgroundColor === "transparent" ? "transparent" : undefined,
        padding: padding,
        disabled: disabled,
      
      }}
      disabled={(disabled) ? disabled : false}
      size={size}
      onClick={onClickFunction}
      {...props}
    >
      {props.children} {label}
    </Button>
  );
};
