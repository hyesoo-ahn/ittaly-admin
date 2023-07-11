import React from "react";
import Select from "react-select";

interface ISelectbox {
  placeholder: string;
  value?: any;
  options: any[];
  onChange: any;
  noOptionsMessage: string;
  containerStyles?: any;
  defaultValue?: any;
}

const SelectBox = (props: ISelectbox) => {
  return (
    <div style={{ width: 280, ...props.containerStyles }}>
      <Select
        classNamePrefix="react-select"
        placeholder={props.placeholder}
        value={props.value}
        defaultValue={props.defaultValue}
        options={props.options}
        onChange={props.onChange}
        noOptionsMessage={({ inputValue }) => props.noOptionsMessage}
        classNames={{
          control: (state) => (state.isFocused ? "border-reset" : ""),
        }}
      />
    </div>
  );
};

export default SelectBox;
