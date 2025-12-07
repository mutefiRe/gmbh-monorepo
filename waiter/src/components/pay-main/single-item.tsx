import React from "react";

export type PayDetailSingleItemProps = {
  orderitem: any;
  type: "open" | "paid";
  css?: string;
  onIncrementMarked?: () => void;
  onDecrementMarked?: () => void;
};

export function PayDetailSingleItem({ orderitem, type, css = "", onIncrementMarked, onDecrementMarked }: PayDetailSingleItemProps) {
  // Compute count logic
  const computedCount = (() => {
    if (type === "paid") return orderitem.countPaid;
    if (type === "open") return orderitem.count - (orderitem.countMarked || 0) - (orderitem.countPaid || 0);
    return orderitem.count - (orderitem.countMarked || 0) - (orderitem.countPaid || 0);
  })();

  const sumTotal = computedCount * orderitem.price;
  const sumMarked = (orderitem.countMarked || 0) * orderitem.price;

  // Style for category color
  const borderColor = orderitem.item?.category?.color || "#ccc";
  const style = { borderLeft: `${borderColor} 5px solid` };

  // Show amount helper
  function showAmount(amount: string) {
    const parsed = parseFloat(amount);
    if (isNaN(parsed)) return amount;
    return Number.isInteger(parsed) ? parsed : parsed.toFixed(2).replace(/\.00$/, "").replace(/(\.[1-9]*)0$/, "$1");
  }

  // Show currency helper
  function showCurrency(amount: number) {
    return amount.toFixed(2);
  }

  if (type === "paid") {
    return (
      <div className="item pay-detail_single-item paid" style={style}>
        <div className="countmarked">{computedCount} x</div>
        <div className="description">
          {orderitem.item?.name}
          {orderitem.item?.category?.showAmount && (
            <> {showAmount(orderitem.item.amount)} {orderitem.item.unit?.name}</>
          )}
          <span> {orderitem.extras}</span>
        </div>
        <div className="price">
          € {showCurrency(sumTotal)}
          {orderitem.countFree ? (
            <span> ({orderitem.countFree} mit Gutschein)</span>
          ) : null}
        </div>
      </div>
    );
  }

  // type === "open"
  return (
    <div
      className={`item pay-detail_single-item ${orderitem.countMarked ? "topay" : ""} ${css}`}
      style={style}
      onClick={onIncrementMarked}
    >
      <div className="countmarked">
        {orderitem.countMarked ? `${orderitem.countMarked} x` : `${computedCount} x`}
      </div>
      <div className="description">
        {orderitem.item?.name}
        {orderitem.item?.category?.showAmount && (
          <> {showAmount(orderitem.item.amount)} {orderitem.item.unit?.name}</>
        )}
        <span> {orderitem.extras}</span>
      </div>
      <div className="price">
        € {orderitem.countMarked ? showCurrency(sumMarked) : showCurrency(sumTotal)}
      </div>
      {/* Decrement button for marked items */}
      {orderitem.countMarked ? (
        <div className="countOpen" onClick={e => { e.stopPropagation(); onDecrementMarked && onDecrementMarked(); }}>
          {computedCount} x
        </div>
      ) : null}
    </div>
  );
}
