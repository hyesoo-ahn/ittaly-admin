import { useState, useCallback } from "react";

function useInput(initialInput: any) {
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

export { useInput };
