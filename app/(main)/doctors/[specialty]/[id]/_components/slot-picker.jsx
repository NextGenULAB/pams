"use client";

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";

const SlotPicker = ({ days, onSelectSlot }) => {
  const [selectedSlot, setSelectedSlot] = useState(null);
  const firstDaysWithSlots =
    days.find((day) => day.slots.length > 0)?.date || days[0]?.date;

  const [activeTab, setActiveTab] = useState(firstDaysWithSlots);

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
  };

  const confirmSelection = () => {
    if (selectedSlot) {
      onSelectSlot(selectedSlot);
    }
  };

  return (
    <div className="space-y-6">
      <Tabs
        defaultValue={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="w-full justify-start">
          {days.map((day) => {
            return (
              <TabsTrigger
                key={day.date}
                value={day.date}
                disabled={day.slots.length === 0}
                className={
                  day.slots.length === 0 ? "opacity-50 cursor-not-allowed" : ""
                }
              >
                <div className="flex gap-2">
                  <div className="opacity-80">
                    {format(new Date(day.date), "MMM d")}
                  </div>
                  <div>({format(new Date(day.date), "EEE")})</div>
                </div>

                {day.slots.length > 0 && (
                  <div className="ml-2 bg-emerald-900/30 text-emerald-400 text-xs px-2 py-1 rounded">
                    {day.slots.length}
                  </div>
                )}
              </TabsTrigger>
            );
          })} 
        </TabsList>
        <TabsContent value="account">
          Make changes to your account here.
        </TabsContent>
        <TabsContent value="password">Change your password here.</TabsContent>
      </Tabs>
    </div>
  );
};

export default SlotPicker;
