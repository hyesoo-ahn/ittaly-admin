import React from "react";

const CheckboxS = ({ name, id, onChange, checked }: any) => {
  return (
    <input
      checked={checked}
      onChange={onChange}
      name={name}
      id={id}
      type="checkbox"
      className="mr-4 cursor"
    />
  );
};

export default CheckboxS;
