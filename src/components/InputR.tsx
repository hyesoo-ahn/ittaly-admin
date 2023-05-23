import React from "react";

interface IProps {
  onChange: any;
  value: string;
  styleClass?: string;
  size?: string;
  placeholer?: string;
}

const InputR = (props: IProps) => {
  return (
    <div>
      <input
        value={props.value}
        onChange={props.onChange}
        className={`input-r ${props.styleClass} ${props.size === "small" && "input-s-width"} ${
          !props.size && "input-r-width"
        }`}
        placeholder={props.placeholer}
      />
    </div>
  );
};

export default InputR;
