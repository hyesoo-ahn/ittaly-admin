import React, { useState } from "react";
import { PAGINATION_NUM_LIMIT } from "../common/utils";

export default function Pagination({
  numPagesTotal,
  numOffset,
  numLimit = PAGINATION_NUM_LIMIT,
  numPage,
  setNumPage,
  paginationNumbering,
  page,
  setPage,
}: any) {
  return (
    <div className="flex pagination">
      <p
        className="font-lightgray"
        onClick={() => {
          if (numPage > 1) {
            setNumPage((prev: number) => {
              return prev - 1;
            });
            setPage(numOffset);
          }
        }}
      >
        {"<"}
      </p>
      {paginationNumbering()?.map((num: number, i: number) => (
        <p
          onClick={() => {
            setPage(num);
          }}
          key={i}
          className={`${num === page ? "font-bold text-underline" : ""}`}
        >
          {num}
        </p>
      ))}

      <p
        onClick={() => {
          if (paginationNumbering().length === 5 && numPagesTotal > paginationNumbering()[4]) {
            setNumPage((prev: number) => prev + 1);
            setPage(numLimit * numPage + 1);
          }
        }}
        className="font-lightgray"
      >
        {">"}
      </p>
    </div>
  );
}
