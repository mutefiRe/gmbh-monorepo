type OrderItemActionsProps = {
  onDecrement: () => void;
  onDelete: () => void;
};

export function OrderItemActions({ onDecrement, onDelete }: OrderItemActionsProps) {
  return (
    <>
      <button
        type="button"
        className="rounded-md border border-slate-200 bg-white px-3 py-2 text-slate-700 hover:bg-slate-50"
        onClick={(event) => {
          event.stopPropagation();
          onDecrement();
        }}
        title="-1"
      >
        -1
      </button>
      <button
        type="button"
        className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-red-600 hover:bg-red-100"
        onClick={(event) => {
          event.stopPropagation();
          onDelete();
        }}
        title="Löschen"
      >
        Löschen
      </button>
    </>
  );
}
