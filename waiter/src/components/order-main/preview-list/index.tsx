import type { Category, Item, OrderItem } from "../../../types/models";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import { QuantityBlink } from "../../../ui/quantity-blink";

type PreviewListProps = {
  orderItems: OrderItem[];
  items: Item[];
  categories: Category[];
};



export function PreviewList({ orderItems, items, categories }: PreviewListProps) {
  console.log("PreviewList orderItems:", orderItems);
  const [location, navigate] = useLocation();


  return (
    <div className="w-full h-full border-l border-gray-300 p-2 overflow-y-auto vh-full" onClick={(e) => {
      navigate("/order/edit")
    }}>
      <h2 className="text-lg font-bold mb-4">Bestellung</h2>
      {orderItems.length === 0 ? (
        <p className="text-gray-500">Leer</p>
      ) : (
        <ul>
          {orderItems.map(orderItem => {
            const item = items?.find(i => i.id === orderItem.itemId);
            if (!item) return null;
            const category = categories.find(cat => cat.id === item.categoryId);
            const color = category?.color || '#000000';
            // Use orderItem.count or fallback to 1
            const quantity = (orderItem.count ?? 1);
            return (
              <li key={`${item.id}__${orderItem.extras ?? ''}`} className="mb-2">
                <div
                  className="flex pl-1"
                  style={{ borderLeft: `5px solid ${color}` }}
                >
                  <QuantityBlink quantity={quantity} color={color} />
                  <div>
                    <span className="font-medium">{item.name}</span>
                    {orderItem.extras && <span className="text-sm text-gray-500"> (Extras: {orderItem.extras})</span>}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}