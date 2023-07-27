import React, { useEffect } from "react";

const Modal = (props: any) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);
  return (
    <div className="modal-container">
      <div className={"modal-inner"} style={props.innerStyle && props.innerStyle}>
        {props.children}
      </div>
    </div>
  );
};

export default Modal;
