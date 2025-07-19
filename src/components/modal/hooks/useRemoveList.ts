import { useState } from "react";
import { ProductFormInput } from "../types/product"; 

export function useRemoveList(setFormState: React.Dispatch<React.SetStateAction<ProductFormInput>>) {
  const [remover, setRemover] = useState([{ ingrediente: "" }]);

  const handleAddRemover = () => {
    setRemover((prev) => [...prev, { ingrediente: "" }]);
  };

  const handleRemoveRemover = (index: number) => {
    setRemover((prev) => prev.filter((_, i) => i !== index));
  };

  const handleChangeRemover = (
    index: number,
    field: "ingrediente",
    value: string
  ) => {
    const updated = [...remover];
    updated[index][field] = value;
    setRemover(updated);
  };

  const handleSaveRemover = () => {
    const formatado = remover
      .filter((item) => item.ingrediente.trim())
      .map((item) => item.ingrediente.trim())
      .join(", ");

    setFormState((prev) => ({
      ...prev,
      remove: formatado || null,
    }));
  };

  return {
    remover,
    handleAddRemover,
    handleRemoveRemover,
    handleChangeRemover,
    handleSaveRemover,
  };
}
