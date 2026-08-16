"use client";

import { useState } from "react";

import type { ActivitySourceKey, MonthlyActivity } from "@/lib/activityLog";

type ActivitySource = {
  key: ActivitySourceKey;
  label: string;
  color: string;
};

type ActivityLogProps = {
  monthlyActivities: MonthlyActivity[];
  periodLabel: string;
};

const activitySources = [
  { key: "github", label: "GitHub", color: "#4b5563" },
  { key: "note", label: "note", color: "#2fbf9f" },
  { key: "okalog", label: "okalog", color: "#f59e0b" },
  { key: "youtube", label: "YouTube", color: "#ef4444" },
] satisfies ActivitySource[];

const chart = {
  width: 760,
  height: 360,
  paddingTop: 24,
  paddingRight: 20,
  paddingBottom: 48,
  paddingLeft: 44,
  barWidth: 24,
};

const tooltip = {
  width: 150,
  rowHeight: 18,
  paddingX: 12,
  paddingY: 10,
};

const tickCount = 6;
const plotWidth = chart.width - chart.paddingLeft - chart.paddingRight;
const plotHeight = chart.height - chart.paddingTop - chart.paddingBottom;

const getY = (value: number, yMax: number) =>
  chart.paddingTop + plotHeight - (value / yMax) * plotHeight;

export default function ActivityLog({
  monthlyActivities,
  periodLabel,
}: ActivityLogProps) {
  const [activeMonthIndex, setActiveMonthIndex] = useState<number | null>(null);
  const totals = monthlyActivities.map((activity) =>
    activitySources.reduce(
      (sum, source) => sum + activity.values[source.key],
      0,
    ),
  );
  const maxTotal = Math.max(...totals, 1);
  const yMax = Math.max(Math.ceil(maxTotal / 6) * 6, 6);
  const barSlotWidth = plotWidth / monthlyActivities.length;
  const ticks = Array.from({ length: tickCount + 1 }, (_, index) =>
    Math.round((yMax / tickCount) * index),
  );
  const activeIndex = activeMonthIndex;
  const activeActivity =
    activeIndex === null ? undefined : monthlyActivities[activeIndex];
  const activeTotal = activeIndex === null ? undefined : totals[activeIndex];
  const activeTooltip =
    activeIndex !== null && activeActivity && activeTotal !== undefined
      ? (() => {
          const rowCount = activitySources.length + 2;
          const height = tooltip.paddingY * 2 + rowCount * tooltip.rowHeight;
          const x =
            chart.paddingLeft + barSlotWidth * activeIndex + barSlotWidth / 2;
          const y = getY(activeTotal, yMax);
          const left =
            x + tooltip.width + 16 > chart.width
              ? x - tooltip.width - 16
              : x + 16;
          const top = Math.max(
            chart.paddingTop,
            Math.min(
              y - height - 12,
              chart.height - chart.paddingBottom - height,
            ),
          );

          return {
            activity: activeActivity,
            height,
            left,
            top,
            total: activeTotal,
          };
        })()
      : undefined;

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm md:p-8">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-normal text-gray-900">
            Activity Log
          </h2>
          <p className="mt-1 text-sm text-gray-500">{periodLabel}</p>
        </div>
        <p className="text-sm font-semibold text-gray-700">
          {totals.reduce((sum, value) => sum + value, 0)} logs
        </p>
      </div>

      <div className="mt-8 overflow-x-auto pb-2">
        <svg
          role="img"
          aria-labelledby="activity-log-title activity-log-description"
          viewBox={`0 0 ${chart.width} ${chart.height}`}
          className="h-auto min-w-[680px] max-w-full"
        >
          <title id="activity-log-title">Activity Log</title>
          <desc id="activity-log-description">
            Monthly stacked bar chart for GitHub, note, okalog, and YouTube
            activity.
          </desc>

          {ticks.map((tick) => {
            const y = getY(tick, yMax);

            return (
              <g key={tick}>
                <line
                  x1={chart.paddingLeft}
                  x2={chart.width - chart.paddingRight}
                  y1={y}
                  y2={y}
                  stroke="#e5e7eb"
                  strokeWidth="1"
                />
                <text
                  x={chart.paddingLeft - 12}
                  y={y + 5}
                  textAnchor="end"
                  className="fill-gray-500 text-[13px]"
                >
                  {tick}
                </text>
              </g>
            );
          })}

          <line
            x1={chart.paddingLeft}
            x2={chart.paddingLeft}
            y1={chart.paddingTop}
            y2={chart.paddingTop + plotHeight}
            stroke="#d1d5db"
            strokeWidth="1"
          />

          {monthlyActivities.map((activity, index) => {
            const x =
              chart.paddingLeft +
              barSlotWidth * index +
              (barSlotWidth - chart.barWidth) / 2;
            let stackedValue = 0;
            const total = totals[index];
            const barHeight = Math.max(
              getY(0, yMax) - getY(total, yMax),
              total > 0 ? 2 : 0,
            );

            return (
              <g key={activity.month}>
                {activitySources.map((source) => {
                  const value = activity.values[source.key];
                  const yTop = getY(stackedValue + value, yMax);
                  const yBottom = getY(stackedValue, yMax);
                  const height = Math.max(yBottom - yTop, value > 0 ? 2 : 0);

                  stackedValue += value;

                  return (
                    <rect
                      key={source.key}
                      x={x}
                      y={yTop}
                      width={chart.barWidth}
                      height={height}
                      fill={source.color}
                    />
                  );
                })}
                <a
                  aria-label={`${activity.month}: ${total} logs`}
                  href={`#activity-log-${index}`}
                  onBlur={() => setActiveMonthIndex(null)}
                  onClick={(event) => event.preventDefault()}
                  onFocus={() => setActiveMonthIndex(index)}
                  onMouseEnter={() => setActiveMonthIndex(index)}
                  onMouseLeave={() => setActiveMonthIndex(null)}
                >
                  <rect
                    className="cursor-pointer fill-transparent outline-none focus-visible:stroke-gray-900"
                    height={plotHeight}
                    pointerEvents="all"
                    width={barSlotWidth}
                    x={chart.paddingLeft + barSlotWidth * index}
                    y={chart.paddingTop}
                  />
                </a>
                {total > 0 && (
                  <rect
                    fill="none"
                    height={barHeight + 8}
                    opacity={activeMonthIndex === index ? 1 : 0}
                    rx="3"
                    stroke="#111827"
                    strokeWidth="1.5"
                    width={chart.barWidth + 8}
                    x={x - 4}
                    y={getY(total, yMax) - 4}
                  />
                )}
                <text
                  x={x + chart.barWidth / 2}
                  y={chart.height - 16}
                  textAnchor="middle"
                  className="fill-gray-600 text-[14px] font-semibold"
                >
                  {activity.month}
                </text>
              </g>
            );
          })}

          {activeTooltip && (
            <g className="pointer-events-none">
              <rect
                fill="#111827"
                height={activeTooltip.height}
                rx="6"
                width={tooltip.width}
                x={activeTooltip.left}
                y={activeTooltip.top}
              />
              <text
                className="fill-white text-[13px] font-bold"
                x={activeTooltip.left + tooltip.paddingX}
                y={activeTooltip.top + tooltip.paddingY + 13}
              >
                {activeTooltip.activity.month}
              </text>
              <text
                className="fill-gray-200 text-[12px] font-semibold"
                textAnchor="end"
                x={activeTooltip.left + tooltip.width - tooltip.paddingX}
                y={activeTooltip.top + tooltip.paddingY + 13}
              >
                {activeTooltip.total} logs
              </text>
              {activitySources.map((source, index) => (
                <g key={source.key}>
                  <rect
                    fill={source.color}
                    height="8"
                    rx="2"
                    width="8"
                    x={activeTooltip.left + tooltip.paddingX}
                    y={
                      activeTooltip.top +
                      tooltip.paddingY +
                      tooltip.rowHeight * (index + 1) +
                      5
                    }
                  />
                  <text
                    className="fill-gray-100 text-[12px]"
                    x={activeTooltip.left + tooltip.paddingX + 16}
                    y={
                      activeTooltip.top +
                      tooltip.paddingY +
                      tooltip.rowHeight * (index + 2) -
                      1
                    }
                  >
                    {source.label}
                  </text>
                  <text
                    className="fill-white text-[12px] font-semibold"
                    textAnchor="end"
                    x={activeTooltip.left + tooltip.width - tooltip.paddingX}
                    y={
                      activeTooltip.top +
                      tooltip.paddingY +
                      tooltip.rowHeight * (index + 2) -
                      1
                    }
                  >
                    {activeTooltip.activity.values[source.key]}
                  </text>
                </g>
              ))}
            </g>
          )}
        </svg>
      </div>

      <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-3">
        {activitySources.map((source) => (
          <li
            key={source.key}
            className="flex items-center gap-2 text-sm font-semibold text-gray-600"
          >
            <span
              className="size-3 rounded-[3px]"
              style={{ backgroundColor: source.color }}
            />
            {source.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
