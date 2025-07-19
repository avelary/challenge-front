// modal/components/dataSheetList.tsx

import { Input } from "../../input/input";
import { Select } from "../../select/select";
import { CirclePlus, X } from "lucide-react";

interface DatasheetItem {
  tipo?: string; // tipo do ingrediente
  quantidade?: string;
  unidade?: string;
  variacao?: string;
  estoque?: string;
}

interface DataSheetListProps {
  datasheet: DatasheetItem[];
  productType: string;
  onAdd: () => void;
  onRemove: (index: number) => void;
  onChange: (index: number, field: keyof DatasheetItem, value: string) => void;
  onSaveToForm: () => void;
}

const unidadeOptions = [
  { value: "g", label: "Gramas (g)" },
  { value: "kg", label: "Quilos (kg)" },
  { value: "ml", label: "Mililitros (ml)" },
];

export const DataSheetList = ({
  datasheet,
  productType,
  onAdd,
  onRemove,
  onChange,
  onSaveToForm,
}: DataSheetListProps) => {
  const isMenu = productType === "menu";

  return (
    <div className="mt-4 px-4 py-4 border border-[#878789] rounded-md">
      <div className="pb-4">
        <h1 className="font-semibold">Ficha Técnica</h1>
      </div>
      <div className=" mt-[1rem] px-[1rem] py-[1rem] border border-[#878789] rounded-md">
        <button
          type="button"
          onClick={onAdd}
          className="flex items-center gap-2 text-sm mb-4 hover:text-blue-600 transition"
        >
          <CirclePlus size={16} />
          <span>Adicionar</span>
        </button>
        {datasheet.map((item, index) => (
          <div key={index} className="grid grid-cols gap-3 items-center">
            {isMenu ? (
              <>
                <Input
                  placeholder="Tipo do ingrediente"
                  value={item.tipo ?? ""}
                  onChange={(e) => onChange(index, "tipo", e.target.value)}
                />
                <Input
                  placeholder="Quantidade"
                  value={item.quantidade ?? ""}
                  onChange={(e) =>
                    onChange(index, "quantidade", e.target.value)
                  }
                />
                <Select
                  label=""
                  value={item.unidade ?? ""}
                  options={unidadeOptions}
                  onChange={(value) => onChange(index, "unidade", value)}
                />
              </>
            ) : (
              <>
                <Input
                  placeholder="Variação"
                  value={item.variacao ?? ""}
                  onChange={(e) => onChange(index, "variacao", e.target.value)}
                />
                <Input
                  placeholder="Estoque"
                  value={item.estoque ?? ""}
                  onChange={(e) => onChange(index, "estoque", e.target.value)}
                />
               
              </>
            )}
            <button
              type="button"
              onClick={() => onRemove(index)}
              className="text-red-600 w-[1.5rem]"
            >
              <X size={18} />
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={onSaveToForm}
        className="self-end mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Salvar
      </button>
    </div>
  );
};
