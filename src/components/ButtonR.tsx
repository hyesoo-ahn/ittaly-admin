import React from "react";

interface IProps {
  onClick: any;
  name: string;
  styleClass?: string;
  size?: string;
  placeholer?: string;
}

const ButtonR = (props: IProps) => {
  return (
    <div>
      <button onClick={props.onClick} className={`button-r`}>
        <p>{props.name}</p>
      </button>
    </div>
  );
};

export default ButtonR;
