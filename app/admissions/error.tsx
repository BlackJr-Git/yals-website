// Créez un fichier error.tsx dans le dossier /app/admissions/
"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Une erreur s'est produite</h2>
      <p className="mb-4">Message d'erreur : {error.message}</p>
      <button
        onClick={() => reset()}
        className="bg-primary text-white px-4 py-2 rounded"
      >
        Réessayer
      </button>
    </div>
  );
}
