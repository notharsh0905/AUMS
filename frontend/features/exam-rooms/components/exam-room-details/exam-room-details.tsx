"use client";

import React from 'react';
import { ExamRoom } from '../../types';
import { cn } from '@/lib/utils';
import { Check, X } from 'lucide-react';

interface ExamRoomDetailsProps {
  room: ExamRoom;
}

export function ExamRoomDetails({ room }: ExamRoomDetailsProps) {
  const details = [
    { label: 'Room ID', value: room.examRoomId },
    { label: 'Building', value: room.building },
    { label: 'Room Number', value: room.roomNumber },
    { label: 'Room Name', value: room.roomName },
    { label: 'Floor', value: `Floor ${room.floor}` },
    { label: 'Block / Wing', value: room.block || 'Main Block' },
    { label: 'Seating Capacity', value: `${room.capacity} seats` },
    { label: 'Room Type', value: room.roomType },
    { label: 'Institution ID', value: room.institutionId },
  ];

  const amenities = [
    { label: 'Projector Enabled', value: room.hasProjector },
    { label: 'Air Conditioning (AC)', value: room.hasAc },
    { label: 'Wheelchair Accessible', value: room.wheelchairAccessible },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Profile Header */}
      <div className="flex items-center gap-4 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800">
        <div className="h-12 w-12 rounded-full bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-950 flex items-center justify-center font-bold text-lg select-none">
          {room.building.charAt(0)}
          {room.roomNumber.charAt(0)}
        </div>
        <div className="flex flex-col min-w-0">
          <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-50 truncate">
            {room.building} - Room {room.roomNumber}
          </h4>
          <span
            className={cn(
              "inline-flex items-center self-start rounded-md px-2 py-0.5 mt-1 text-[10px] font-semibold ring-1 ring-inset uppercase tracking-wide",
              room.status === 'ACTIVE' &&
                "bg-emerald-50 text-emerald-700 ring-emerald-600/10 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20",
              room.status === 'INACTIVE' &&
                "bg-zinc-50 text-zinc-650 ring-zinc-500/10 dark:bg-zinc-500/10 dark:text-zinc-400 dark:ring-zinc-500/20",
              room.status === 'MAINTENANCE' &&
                "bg-amber-50 text-amber-700 ring-amber-600/10 dark:bg-amber-500/10 dark:text-amber-400 dark:ring-amber-500/20"
            )}
          >
            {room.status}
          </span>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4.5 border-t border-zinc-100 dark:border-zinc-900 pt-4">
        {details.map((detail) => (
          <div key={detail.label} className="flex flex-col gap-1">
            <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
              {detail.label}
            </span>
            <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
              {detail.value || 'N/A'}
            </span>
          </div>
        ))}
      </div>

      {/* Amenities Section */}
      <div className="border-t border-zinc-100 dark:border-zinc-900 pt-4">
        <h5 className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-3">
          Facilities & Amenities
        </h5>
        <div className="flex flex-col gap-2.5">
          {amenities.map((item) => (
            <div key={item.label} className="flex items-center justify-between text-sm py-1">
              <span className="text-zinc-600 dark:text-zinc-400">{item.label}</span>
              <div className="flex items-center gap-1.5 font-semibold">
                {item.value ? (
                  <>
                    <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-450" />
                    <span className="text-emerald-700 dark:text-emerald-450 text-xs">Available</span>
                  </>
                ) : (
                  <>
                    <X className="h-4 w-4 text-zinc-400" />
                    <span className="text-zinc-400 text-xs">Not Available</span>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
