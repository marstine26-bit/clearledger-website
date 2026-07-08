'use client';

import { useEffect, useRef } from 'react';
import { Activity, Goal, TimeBlock } from '@/lib/planner/types';
import { formatDateLabel, minutesToTime, timeToMinutes, todayStr } from '@/lib/planner/scheduling';

const HOUR_START = 6; // 06:00
const HOUR_END = 22; // 22:00
const HOUR_HEIGHT = 52;
const TOTAL_HOURS = HOUR_END - HOUR_START;

export interface EnrichedBlock extends TimeBlock {
  activity: Activity | undefined;
  goal: Goal | undefined;
}

interface LaidOutBlock {
  block: EnrichedBlock;
  col: number;
  totalCols: number;
}

/**
 * Assigns each block a column index within its overlap cluster so simultaneous blocks
 * render side-by-side instead of fully stacked (which silently hides all but the top one).
 */
function layoutDayBlocks(blocks: EnrichedBlock[]): LaidOutBlock[] {
  const sorted = [...blocks].sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));
  const results: LaidOutBlock[] = [];
  let cluster: LaidOutBlock[] = [];
  let clusterEnd = -1;

  const flushCluster = () => {
    if (cluster.length === 0) return;
    const columnEnds: number[] = [];
    for (const item of cluster) {
      const start = timeToMinutes(item.block.startTime);
      let placedCol = -1;
      for (let c = 0; c < columnEnds.length; c++) {
        if (columnEnds[c] <= start) {
          placedCol = c;
          columnEnds[c] = start + item.block.durationMinutes;
          break;
        }
      }
      if (placedCol === -1) {
        placedCol = columnEnds.length;
        columnEnds.push(start + item.block.durationMinutes);
      }
      item.col = placedCol;
    }
    const totalCols = columnEnds.length;
    for (const item of cluster) item.totalCols = totalCols;
    results.push(...cluster);
    cluster = [];
  };

  for (const block of sorted) {
    const start = timeToMinutes(block.startTime);
    if (cluster.length > 0 && start >= clusterEnd) {
      flushCluster();
      clusterEnd = -1;
    }
    cluster.push({ block, col: 0, totalCols: 1 });
    clusterEnd = Math.max(clusterEnd, start + block.durationMinutes);
  }
  flushCluster();
  return results;
}

export default function WeekCalendar({
  weekDates,
  blocksByDate,
  onSlotClick,
  onBlockClick,
}: {
  weekDates: string[];
  blocksByDate: Map<string, EnrichedBlock[]>;
  onSlotClick: (date: string, time: string) => void;
  onBlockClick: (block: EnrichedBlock) => void;
}) {
  const today = todayStr();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Land on today's column instead of always opening on Monday — on a phone-width screen
  // only 2-3 columns are visible at once, so without this "today" could be scrolled off.
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    const todayCol = container.querySelector<HTMLElement>(`[data-date="${today}"]`);
    todayCol?.scrollIntoView({ block: 'nearest', inline: 'start' });
  }, [today]);

  return (
    <div style={{ display: 'flex', border: '1px solid #e5e7eb', borderRadius: 10, overflow: 'hidden', background: '#fff' }}>
      {/* time gutter */}
      <div className="cal-gutter" style={{ width: 52, flexShrink: 0, borderRight: '1px solid #f3f4f6' }}>
        <div style={{ height: 36, borderBottom: '1px solid #f3f4f6' }} />
        {Array.from({ length: TOTAL_HOURS }, (_, i) => (
          <div key={i} style={{ height: HOUR_HEIGHT, borderBottom: '1px solid #f9fafb', position: 'relative' }}>
            <span style={{ position: 'absolute', top: -7, right: 6, fontSize: '0.68rem', color: '#9ca3af' }}>
              {(HOUR_START + i) % 24}:00
            </span>
          </div>
        ))}
      </div>

      {/* day columns */}
      <div ref={scrollRef} style={{ display: 'flex', flex: 1, minWidth: 0, overflowX: 'auto', scrollSnapType: 'x proximity' }}>
        {weekDates.map((date) => {
          const isToday = date === today;
          const blocks = blocksByDate.get(date) ?? [];
          return (
            <div key={date} data-date={date} className="cal-day-col" style={{ flex: '1 0 120px', minWidth: 120, borderRight: '1px solid #f3f4f6', position: 'relative' }}>
              <div style={{
                height: 36, borderBottom: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.75rem', fontWeight: 700, color: isToday ? '#4338ca' : '#374151', background: isToday ? '#eef2ff' : '#fafafa',
              }}>
                {formatDateLabel(date)}
              </div>

              <div style={{ position: 'relative', height: TOTAL_HOURS * HOUR_HEIGHT }}>
                {Array.from({ length: TOTAL_HOURS * 2 }, (_, i) => {
                  const mins = HOUR_START * 60 + i * 30;
                  return (
                    <div
                      key={i}
                      onClick={() => onSlotClick(date, minutesToTime(mins))}
                      style={{
                        position: 'absolute', top: (i * 30 / 60) * HOUR_HEIGHT, left: 0, right: 0, height: HOUR_HEIGHT / 2,
                        borderBottom: i % 2 === 1 ? '1px solid #f9fafb' : 'none',
                        cursor: 'pointer',
                      }}
                      className="cal-slot"
                    />
                  );
                })}

                {layoutDayBlocks(blocks).map(({ block, col, totalCols }) => {
                  const startMins = timeToMinutes(block.startTime) - HOUR_START * 60;
                  const top = Math.max(0, (startMins / 60) * HOUR_HEIGHT);
                  const height = Math.max(20, (block.durationMinutes / 60) * HOUR_HEIGHT - 2);
                  const color = block.goal?.color ?? '#6b7280';
                  const widthPct = 100 / totalCols;
                  const leftPct = widthPct * col;
                  return (
                    <div
                      key={block.id}
                      onClick={(e) => { e.stopPropagation(); onBlockClick(block); }}
                      style={{
                        position: 'absolute', top, height,
                        left: `calc(${leftPct}% + 2px)`, width: `calc(${widthPct}% - 4px)`,
                        background: block.status === 'done' ? `${color}33` : block.status === 'skipped' ? '#fee2e2' : `${color}22`,
                        borderLeft: `3px solid ${color}`, borderRadius: 5, padding: '3px 6px', overflow: 'hidden', cursor: 'pointer',
                        opacity: block.status === 'skipped' ? 0.6 : 1,
                        zIndex: 2,
                      }}
                    >
                      <div style={{
                        fontSize: '0.68rem', fontWeight: 700, color: '#111827', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                        textDecoration: block.status === 'skipped' ? 'line-through' : 'none',
                      }}>
                        {block.activity?.title ?? 'Activity'}
                      </div>
                      <div style={{ fontSize: '0.62rem', color: '#6b7280' }}>{block.startTime}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        .cal-slot:hover { background: #f5f5ff; }
        @media (max-width: 700px) {
          .cal-gutter { width: 40px !important; }
          .cal-day-col { flex-basis: 92px !important; min-width: 92px !important; scroll-snap-align: start; }
        }
      `}</style>
    </div>
  );
}
