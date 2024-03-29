import React, { useEffect, useRef, useState } from "react";

export function CustomSelectbox(props: any) {
  const selectboxRef = useRef<HTMLDivElement>(null);
  const [orderCancelPathSelect, setOrderCancelPathSelect] = useState<boolean>(false);

  useEffect(() => {
    const handleOutsideClose = (e: { target: any }) => {
      // useRef current에 담긴 엘리먼트 바깥을 클릭 시 드롭메뉴 닫힘
      if (orderCancelPathSelect && !selectboxRef?.current?.contains(e.target))
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
        style={{ width: 280, height: 32, ...props.style }}
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
          {props.data?.map((item: any, i: number) => (
            <div
              onClick={() => {
                props.setSelected(item);
                setOrderCancelPathSelect(false);
              }}
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
