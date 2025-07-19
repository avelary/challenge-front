import { useState } from "react";
import { ProductFormInput } from "../types/product";

export function useOpcionalList(setFormState: React.Dispatch<React.SetStateAction<ProductFormInput>>) {
  const [opcionais, setOpcionais] = useState([{ ingrediente: "", valor: "" }]);

  const handleAddOpcional = () => {
    setOpcionais((prev) => [...prev, { ingrediente: "", valor: "" }]);
  };

  const handleRemoveOpcional = (index: number) => {
    setOpcionais((prev) => prev.filter((_, i) => i !== index));
  };

  const handleChangeOpcional = (
    index: number,
    field: "ingrediente" | "valor",
    value: string
  ) => {
    const updated = [...opcionais];
    updated[index][field] = value;
    setOpcionais(updated);
  };

  const handleSaveOpcionais = () => {
    const formatado = opcionais
      .filter((op) => op.ingrediente.trim() && op.valor.trim())
      .map((op) => `${op.ingrediente} = ${op.valor}`)
      .join(", ");

    setFormState((prev) => ({
      ...prev,
      include: formatado || null,
    }));
  };

  return {
    opcionais,
    handleAddOpcional,
    handleRemoveOpcional,
    handleChangeOpcional,
    handleSaveOpcionais,
  };
}
