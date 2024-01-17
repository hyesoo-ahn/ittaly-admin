import React, { CSSProperties, useEffect, useRef, useState } from "react";

interface ILabel {
  label: string;
  value: string;
}
interface IProps {
  selected: ILabel;
  setSelected: React.Dispatch<any>;
  noDataMessage: string;
  data: ILabel[];
  style?: CSSProperties;
}

export function CustomSelectbox(props: IProps) {
  const selectboxRef = useRef<HTMLDivElement>(null);
  const [orderCancelPathSelect, setOrderCancelPathSelect] = useState<boolean>(false);

  useEffect(() => {
    const handleOutsideClose = (e: MouseEvent) => {
      if (orderCancelPathSelect && !selectboxRef?.current?.contains(e.target as HTMLElement))
        setOrderCancelPathSelect(false);
    };
    document.addEventListener("click", handleOutsideClose);

    return () => document.removeEventListener("click", handleOutsideClose);
  }, [orderCancelPathSelect]);

  return (
    <div ref={selectboxRef} className="relative">
      <div
        onClick={() => setOrderCancelPathSelect(true)}
        className="selectbox-custom-wrapper"
        style={{
          width: 280,
          height: 32,
          ...props.style,
          cursor: "default",
          border: orderCancelPathSelect ? "1px solid #979797" : "",
        }}
      >
        <p className={`${Object.keys(props.selected).length === 0 && "font-gray"}`}>
          {Object.keys(props.selected).length === 0 ? props.noDataMessage : props.selected.label}
        </p>
        <p>▼</p>
      </div>

      {orderCancelPathSelect && (
        <div
          className="mt-4 selectbox-custom-list"
          style={{ width: props.style?.width ? props.style.width : 280 }}
        >
          {props.data?.map((item: ILabel, i: number) => (
            <div
              onClick={() => {
                props.setSelected(item);
                setOrderCancelPathSelect(false);
              }}
              style={{ cursor: "default" }}
              key={i}
              className={`${item === props.selected && "selectbox-custom-selected"}`}
            >
              <p className={`font-12`}>{item.label}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
