import { useState, useCallback } from "react";

function usePriceInput(initialInput: any) {
  const [input, setInput] = useState(initialInput);
  const onChange = useCallback((name: string, e: any) => {
    let { value } = e.target;

    const numValue = value.replaceAll(",", "");
    const numCheck: boolean = /^\d+$/.test(numValue);

    if (!numCheck && value) return;
    if (numCheck) {
      value = numValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    setInput((input: any) => ({ ...input, [name]: value }));
  }, []);
  const reset = useCallback(() => setInput(initialInput), [initialInput]);
  return [input, onChange, reset];
}

function useInput(initialInput: any, txtLengthLimit: number) {
  const [input, setInput] = useState(initialInput);
  const [txtLength, setTxtLength] = useState<any>({});
  const onChange = useCallback((name: string, e: any) => {
    let { value } = e.target;

    if (value.length > txtLengthLimit) {
      return;
    }
    setTxtLength((prev: any) => ({ ...prev, [name]: value.length }));
    setInput((input: any) => ({ ...input, [name]: value }));
  }, []);
  const reset = useCallback(() => setInput(initialInput), [initialInput]);
  return [input, txtLength, onChange, reset];
}

export { usePriceInput, useInput };
