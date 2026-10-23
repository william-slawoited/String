"use client";

export function DeleteScoreButton({ id, title }: { id: number; title: string }) {
  return (
    <form
      action={`/api/noty/${id}/smazat`}
      method="post"
      onSubmit={(e) => {
        if (!confirm(`Opravdu smazat „${title}“? Tuto akci nelze vrátit.`)) {
          e.preventDefault();
        }
      }}
    >
      <button type="submit" className="text-sm text-red-600 underline">
        Smazat
      </button>
    </form>
  );
}
