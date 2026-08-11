"use client";

import React, { useState, useEffect } from "react";
import { generateTimeSlots, TimeSlot } from "../../lib/time";

interface DateTimePickerProps {
  onDateTimeSelect: (utcDatetime: string) => void;
  disabled?: boolean;
}

export default function DateTimePicker({ onDateTimeSelect, disabled }: DateTimePickerProps) {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedTimeUtc, setSelectedTimeUtc] = useState<string>("");

  useEffect(() => {
    // Default to today
    const today = new Date();
    const dateStr = today.toISOString().split("T")[0];
    setSelectedDate(dateStr);
  }, []);

  useEffect(() => {
    if (selectedDate) {
      const slots = generateTimeSlots(selectedDate);
      setTimeSlots(slots);
      setSelectedTimeUtc(""); // Reset time when date changes
    }
  }, [selectedDate]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
  };

  const handleTimeSelect = (utcDatetime: string) => {
    setSelectedTimeUtc(utcDatetime);
    onDateTimeSelect(utcDatetime);
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="block text-sm font-medium text-[#172033] mb-1">
          Choose a new date
        </label>
        <input
          type="date"
          value={selectedDate}
          min={new Date().toISOString().split("T")[0]}
          onChange={handleDateChange}
          disabled={disabled}
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B5FEF] text-[#172033]"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#172033] mb-1">
          Choose a new time
        </label>
        <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
          {timeSlots.map((slot) => (
            <button
              key={slot.time}
              type="button"
              disabled={disabled || slot.disabled}
              onClick={() => handleTimeSelect(slot.utcDatetime)}
              className={`py-2 px-1 text-sm rounded-md transition-colors border ${
                slot.disabled 
                  ? "bg-gray-50 text-gray-400 border-gray-100 cursor-not-allowed opacity-50"
                  : selectedTimeUtc === slot.utcDatetime
                  ? "bg-[#5B5FEF] text-white border-[#5B5FEF]"
                  : "bg-white text-[#172033] border-gray-200 hover:border-[#5B5FEF] hover:bg-[#5B5FEF]/5"
              }`}
            >
              {slot.time}
            </button>
          ))}
          {timeSlots.length === 0 && (
            <div className="col-span-3 text-sm text-gray-500 text-center py-2">
              Select a date to view available times.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
