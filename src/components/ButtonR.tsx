import React from "react";

interface IProps {
  onClick: any;
  name: string;
  styleClass?: string;
  size?: string;
  placeholer?: string;
  color?: string;
  styles?: any;
  ref?: any;
}

const ButtonR = (props: IProps) => {
  return (
    <div ref={props.ref}>
      <button
        style={{ ...props.styles }}
        onClick={props.onClick}
        className={`${props.color === "white" ? "btn-add" : "btn-add-b"} ${props.styleClass}`}
      >
        <p>{props.name}</p>
      </button>
    </div>
  );
};

export default ButtonR;
