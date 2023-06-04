import React from "react";

const Modal = (props: any) => {
  return (
    <div className="modal-container">
      <div className="modal-inner"> {props.children}</div>
    </div>
  );
};

export default Modal;
