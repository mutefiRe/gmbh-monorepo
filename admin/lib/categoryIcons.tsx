import React from 'react';
import {
  Beer,
  Coffee,
  CupSoda,
  GlassWater,
  IceCream,
  Martini,
  Pizza,
  Salad,
  Sandwich,
  Soup,
  UtensilsCrossed,
  Wine
} from 'lucide-react';

export const CATEGORY_ICON_OPTIONS = [
  { value: 'utensils', label: 'Allgemein', Icon: UtensilsCrossed },
  { value: 'coffee', label: 'Kaffee', Icon: Coffee },
  { value: 'beer', label: 'Bier', Icon: Beer },
  { value: 'wine', label: 'Wein', Icon: Wine },
  { value: 'martini', label: 'Cocktail', Icon: Martini },
  { value: 'cup-soda', label: 'Softdrink', Icon: CupSoda },
  { value: 'glass-water', label: 'Wasser', Icon: GlassWater },
  { value: 'pizza', label: 'Pizza', Icon: Pizza },
  { value: 'sandwich', label: 'Sandwich', Icon: Sandwich },
  { value: 'salad', label: 'Salat', Icon: Salad },
  { value: 'soup', label: 'Suppe', Icon: Soup },
  { value: 'ice-cream', label: 'Eis', Icon: IceCream }
];

export function CategoryIcon({
  name,
  className,
  size = 22,
  style
}: {
  name?: string | null;
  className?: string;
  size?: number;
  style?: React.CSSProperties;
}) {
  if (name && /\p{Extended_Pictographic}/u.test(name)) {
    return (
      <span className={className} style={{ fontSize: size, lineHeight: 1, ...style }}>
        {name}
      </span>
    );
  }
  const option = CATEGORY_ICON_OPTIONS.find((item) => item.value === name);
  const Icon = option?.Icon || UtensilsCrossed;
  return <Icon size={size} className={className} style={style} />;
}
