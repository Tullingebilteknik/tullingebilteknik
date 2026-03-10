"use client";

import type { BookingWithDetails } from "@/lib/types";

const statusColors: Record<string, string> = {
  new: "bg-amber-100 border-amber-300 text-amber-900",
  booked: "bg-blue-50 border-blue-300 text-blue-900",
  in_progress: "bg-purple-50 border-purple-300 text-purple-900",
  completed: "bg-green-50 border-green-300 text-green-900",
};

interface BookingCardProps {
  booking: BookingWithDetails;
  onClick: () => void;
  style?: React.CSSProperties;
}

export function BookingCard({ booking, onClick, style }: BookingCardProps) {
  const leadStatus = booking.lead.status || "booked";
  const colorClass = statusColors[leadStatus] || statusColors.booked;
  const orderNum = booking.order_number
    ? `#${String(booking.order_number).padStart(4, "0")}`
    : "";
  const service = booking.lead.selected_services?.[0] || booking.lead.service_interest || "";

  return (
    <button
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      style={style}
      className={`absolute left-0.5 right-0.5 z-10 rounded border px-2 py-1 text-left cursor-pointer transition-opacity hover:opacity-90 overflow-hidden ${colorClass}`}
    >
      <div className="flex items-center gap-1">
        {orderNum && (
          <span className="text-[9px] font-mono opacity-50">{orderNum}</span>
        )}
        <p className="text-xs font-semibold truncate leading-tight flex-1">
          {booking.lead.name}
        </p>
      </div>
      {booking.lead.reg_number && (
        <p className="text-[10px] font-mono opacity-70 truncate leading-tight">
          {booking.lead.reg_number}
          {booking.lead.car_model ? ` · ${booking.lead.car_model}` : ""}
        </p>
      )}
      {service && (
        <p className="text-[10px] opacity-60 truncate leading-tight">
          {service}
        </p>
      )}
    </button>
  );
}
