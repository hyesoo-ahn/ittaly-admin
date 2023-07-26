import React from "react";

interface IProps {
  onChange?: any;
  value?: string;
  styleClass?: string;
  size?: string;
  placeholer?: string;
  innerStyle?: any;
  type?: string;
  onKeyDown?: any;
}

const InputR = (props: IProps) => {
  return (
    // <div>
    <input
      onKeyDown={props.onKeyDown}
      type={props.type ? props.type : ""}
      style={{ ...props.innerStyle }}
      value={props.value}
      onChange={props.onChange}
      className={`input-r ${props.styleClass} ${props.size === "small" && "input-s-width"} ${
        !props.size && "input-r-width"
      } ${props.size === "full" && "input-f-width"}`}
      placeholder={props.placeholer}
    />
    // </div>
  );
};

export default InputR;
