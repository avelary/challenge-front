// components/RemoveList.tsx
import { Input } from "../../input/input";
import { CirclePlus, X } from "lucide-react";

interface Remover {
  ingrediente: string;
}

interface RemoveListProps {
  remover: Remover[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onChange: (index: number, field: "ingrediente", value: string) => void;
  onSaveToForm: () => void;
}

export const RemoveList = ({
  remover,
  onAdd,
  onRemove,
  onChange,
  onSaveToForm,
}: RemoveListProps) => {
  return (
    <div className="mt-[1rem] px-[1rem] py-[1rem] border border-[#878789] rounded-md">
      <div className="pb-[1rem]">
        <h1 className="font-semibold">Remover</h1>
      </div>

      <div className="flex flex-col border border-[#878789] p-2 rounded-md">
        <button
          type="button"
          onClick={onAdd}
          className="flex items-center gap-2 text-sm mb-3 hover:text-blue-600 transition"
        >
          <CirclePlus size={16} />
          <h3>Remover</h3>
        </button>

        <div className="flex flex-col gap-3">
          {remover.map((item, index) => (
            <div key={index} className="grid grid-cols-2 gap-3 w-full">
              <Input
                placeholder="Ingrediente"
                value={item.ingrediente}
                onChange={(e) => onChange(index, "ingrediente", e.target.value)}
              />
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="text-red-600 w-[1.2rem] items-center"
              >
                <X size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>
      <button
        type="button"
        onClick={onSaveToForm}
        className="self-end mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Remover
      </button>
    </div>
  );
};
