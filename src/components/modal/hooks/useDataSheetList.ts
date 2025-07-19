import { Dispatch, SetStateAction, useState } from "react";
import { ProductFormInput } from "../types/product";

export interface DatasheetItem {
  tipo?: string;
  quantidade?: string;
  unidade?: string;
  variacao?: string;
  estoque?: string;
}

type FormStateSetter = Dispatch<SetStateAction<ProductFormInput>>;

export const useDatasheetList = (
  setFormState: FormStateSetter,
  productType: string
) => {
  const [datasheet, setDatasheet] = useState<DatasheetItem[]>([
    productType === "menu"
      ? { tipo: "", quantidade: "", unidade: "" }
      : { variacao: "", estoque: "" },
  ]);

  const handleAddDatasheet = () => {
    setDatasheet((prev) => [
      ...prev,
      productType === "menu"
        ? { tipo: "", quantidade: "", unidade: "" }
        : { variacao: "", estoque: "" },
    ]);
  };

  const handleRemoveDatasheet = (index: number) => {
    setDatasheet((prev) => prev.filter((_, i) => i !== index));
  };

  const handleChangeDatasheet = (
    index: number,
    field: keyof DatasheetItem,
    value: string
  ) => {
    const updated = [...datasheet];
    updated[index][field] = value;
    setDatasheet(updated);
  };

  const handleSaveDatasheet = () => {
  let formatado = "";

  if (productType === "menu") {
    formatado = datasheet
      .filter(
        (item) =>
          item.tipo?.trim() && item.quantidade?.trim() && item.unidade?.trim()
      )
      .map((item) => `${item.tipo} = ${item.quantidade} ${item.unidade}`)
      .join(", ");
  } else {
    formatado = datasheet
      .filter((item) => item.variacao?.trim() && item.estoque?.trim())
      .map((item) => `${item.variacao} = ${item.estoque}`)
      .join(", ");
  }

  setFormState((prev) => ({
    ...prev,
    datasheet: formatado || null,
  }));
};

  return {
    datasheet,
    handleAddDatasheet,
    handleRemoveDatasheet,
    handleChangeDatasheet,
    handleSaveDatasheet,
  };
};
