import { useState } from "react";
import { PayDetailSingleItem } from "./single-item";
import { useOrder } from "../../types/queries";

export function PayDetail({
  orderId,
  orderitems = [],
  paidOrderitems = [],
  markedOrderitems = [],
  markedAmount = 0,
  openAmount = 0,
  open,
  forFree,
  onToggleMarkAll,
  onPaySelected,
  onGoToPayMain,
  onGoToOrderMain,
  onPrintBill,
}) {
  // Helper to check if all are marked
  const allMarked = markedOrderitems.length === orderitems.length;
  const orderQuery = useOrder(orderId);

  if (orderQuery.isLoading) {
    return <div>Lade...</div>;
  }

  if (orderQuery.isError) {
    return <div>Fehler beim Laden der Bestellung.</div>;
  }

  const order = orderQuery.data?.order;

  if (!order) {
    return <div>Bestellung nicht gefunden.</div>;
  }

  return (
    <div>
      {/* Mark all toggle */}
      <div className="marktoggle--mobile" onClick={onToggleMarkAll}>
        <input type="checkbox" checked={allMarked} readOnly />
      </div>

      {/* Order header */}
      {order.type === "table" ? (
        <h2>Tisch {order.name}</h2>
      ) : order.table ? (
        <h2>Bestellung #{order.showNumber}</h2>
      ) : (
        <h2>Kasse #{order.showNumber}</h2>
      )}

      {/* Paid/Open status */}
      {open ? (
        <h2 className="notPaid">Nicht bezahlt</h2>
      ) : (
        <h2 className="isPaid">Bezahlt</h2>
      )}

      {/* Items */}
      <div className="scrollable">
        {orderitems.map(orderitem => (
          <PayDetailSingleItem key={orderitem.id} orderitem={orderitem} type="open" css="notpaid" />
        ))}
        {paidOrderitems.map(orderitem => (
          <PayDetailSingleItem key={orderitem.id} orderitem={orderitem} type="paid" css="paid" />
        ))}
      </div>

      {/* Table sum */}
      <div className="flexcontainer table_sum">
        {order.table ? (
          <p className="tablebutton">Tisch: {order.table.shortname}</p>
        ) : order.type !== "table" ? (
          <p>Kassenbeleg</p>
        ) : null}
        {markedOrderitems.length > 0 ? (
          <p className="sum">Ausgewählte Summe: € {markedAmount.toFixed(2)}</p>
        ) : (
          <p className="sum">Summe: € {openAmount.toFixed(2)}</p>
        )}
      </div>
      <br />

      {/* Desktop menu */}
      <div className="menu--desktop">
        {open && (
          <div>
            <input id="voucher" type="checkbox" checked={forFree} readOnly />
            <label htmlFor="voucher">Mit Gutschein bezahlen</label>
          </div>
        )}
        {markedOrderitems.length > 0 && (
          <div className="flexcontainer">
            <button className="bigbutton default-btn" onClick={onPaySelected}>
              Ausgewählte bezahlen
            </button>
          </div>
        )}
        <div className="flexcontainer">
          <button className="smallbutton-grey" onClick={onGoToPayMain}>
            Bestellungen anzeigen
          </button>
          {open ? (
            !allMarked ? (
              <button className="smallbutton-blue" onClick={onToggleMarkAll}>
                Alle markieren
              </button>
            ) : (
              <button className="smallbutton-blue" onClick={onToggleMarkAll}>
                Markierung aufheben
              </button>
            )
          ) : order.type === "order" ? (
            <button className="smallbutton-blue" onClick={onPrintBill}>
              Rechnung drucken
            </button>
          ) : null}
        </div>
        <div className="flexcontainer">
          <button className="bigbutton default-btn" onClick={onGoToOrderMain}>
            Neue Bestellung starten
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="menu--mobile">
        <button className="smallbutton default-btn" onClick={onGoToPayMain}>
          <span className="icon icon-return"></span>
        </button>
        <button className="smallbutton smallbutton--new default-btn" onClick={onGoToOrderMain}>
          <span className="icon icon-new_order"></span>
        </button>
        {markedOrderitems.length > 0 ? (
          <button className="smallbutton smallbutton--submit default-btn" onClick={onPaySelected}>
            <span className="icon icon-pay"></span>
          </button>
        ) : !open ? (
          order.type === "order" ? (
            <button className="smallbutton default-btn" onClick={onPrintBill}>
              <span className="icon icon-invoice"></span>
            </button>
          ) : (
            <button className="smallbutton default-btn" disabled>
              <span className="icon icon-prohibited"></span>
            </button>
          )
        ) : (
          <button className="smallbutton default-btn" disabled>
            <span className="icon icon-prohibited"></span>
          </button>
        )}
      </div>
    </div>
  );
}

// You need to implement or import SingleItem for rendering order items.