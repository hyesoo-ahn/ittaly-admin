import React, { useEffect, useState } from "react";

export const useFileUpload = (initialValue: any) => {
  const [file, setFile] = useState<any>(null);
  const [error, setError] = useState<any>(initialValue);

  useEffect(() => {
    if (file) {
      setError(null);
    }
  }, [file]);

  const handleFileChange = (evt: any) => {
    const file = evt.target.files?.[0];

    const fileName = file?.name;

    const getFileExtension: string = fileName?.slice(
      (Math.max(0, fileName.lastIndexOf(".")) || Infinity) + 1
    ) as string;

    if (!file) {
      return;
    }

    // if (!/kml|gml|dxf|png|jpg/.test(getFileExtension)) {
    //   setError("on Error!");
    //   return;
    // }

    // console.log("HOOK File", file);
    // console.log("ERROR!", error);
    setFile(file);
  };

  return [file, error, handleFileChange];
};
