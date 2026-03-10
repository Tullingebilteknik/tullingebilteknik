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
  const leadStatus = (booking.lead as { status?: string })?.status || "booked";
  const colorClass = statusColors[leadStatus] || statusColors.booked;

  return (
    <button
      onClick={onClick}
      style={style}
      className={`absolute left-0.5 right-0.5 rounded border px-2 py-1 text-left cursor-pointer transition-opacity hover:opacity-90 overflow-hidden ${colorClass}`}
    >
      <p className="text-xs font-semibold truncate leading-tight">
        {booking.lead.name}
      </p>
      {booking.lead.reg_number && (
        <p className="text-[10px] font-mono opacity-70 truncate leading-tight">
          {booking.lead.reg_number}
        </p>
      )}
      <p className="text-[10px] opacity-60 truncate leading-tight">
        {booking.start_time.slice(0, 5)}–{booking.end_time.slice(0, 5)}
      </p>
    </button>
  );
}
