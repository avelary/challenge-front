import React, { useState } from "react";

interface UploadImageProps {
  onUploadComplete: (imageUrl: string) => void;
  initialImageUrl?: string; // opcional, para mostrar imagem já existente
}

export function UploadImage({ onUploadComplete, initialImageUrl }: UploadImageProps) {
  const [preview, setPreview] = useState<string | undefined>(initialImageUrl);
  const [uploading, setUploading] = useState(false);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview local (antes do upload)
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Fazer upload para o backend
    const formData = new FormData();
    formData.append("image", file);

    try {
      setUploading(true);

      const response = await fetch("http://localhost:3333/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Erro no upload da imagem");
      }

      const data = await response.json();

      // data.imageUrl deve ser a URL pública da imagem no backend
      onUploadComplete(data.imageUrl);
    } catch (error) {
      console.error("Upload falhou:", error);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="mt-[1rem] px-[1rem] py-[1rem] border border-[#878789] rounded-md">
      <input type="file" accept="image/*" onChange={handleFileChange} disabled={uploading} />
      {uploading && <p>Enviando imagem...</p>}
      {preview && (
        <img
          src={preview}
          alt="Image preview"
          style={{ maxWidth: "300px", marginTop: "10px", borderRadius: "8px" }}
        />
      )}
    </div>
  );
}
