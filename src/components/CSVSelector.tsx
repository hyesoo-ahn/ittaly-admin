import React, { forwardRef, useRef } from "react";
import { csvToJSON } from "../common/utils";

type Props = {
  onChange(data: string[][]): void;
  csvType?: string;
};

const CSVSelector = forwardRef((props: Props, ref: any) => {
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      try {
        const file = e.target.files[0];

        // 1. create url from the file
        const fileUrl = URL.createObjectURL(file);

        // 2. use fetch API to read the file
        const response = await fetch(fileUrl);

        // 3. get the text from the response
        const previousData: any = await response.text();

        const _data: any = csvToJSON(previousData);

        // 4. split the text by newline
        // const lines = text.split("\n");

        // 5. map through all the lines and split each line by comma.
        // const _data = lines.map((line) => line.split(","));

        // 6. call the onChange event
        // console.log(_data);

        let temp: any = [];

        if (props.csvType === "addProduct") {
          for (let i in _data) {
            if (!isNaN(parseInt(_data[i].추가금액.replace(/,/gi, "")))) {
              temp.push({ ..._data[i], status: true });
            } else {
              temp.push({ ..._data[i], status: false });
            }
          }
        }
        if (props.csvType === "invoice") {
          for (let i in _data) {
            if (!isNaN(parseInt(_data[i].송장번호.replace(/,/gi, "")))) {
              temp.push({ ..._data[i], status: true, _id: _data[i]._id });
            } else {
              temp.push({ ..._data[i], status: false, _id: _data[i]._id });
            }
          }
        }

        props.onChange(temp);
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <input
      ref={ref}
      style={{ display: "none" }}
      type="file"
      accept=".csv"
      onChange={handleFileChange}
    />
  );
});

export default CSVSelector;
