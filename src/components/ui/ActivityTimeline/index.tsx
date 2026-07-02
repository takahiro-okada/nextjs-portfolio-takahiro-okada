"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

import type {
  ActivitySourceKey,
  ActivityTimelineEntry,
} from "@/lib/activityLog";

type ActivityTimelineProps = {
  entries: ActivityTimelineEntry[];
};

type ActivityFilterKey = ActivitySourceKey | "all";

type SourceMeta = {
  className: string;
  icon: ActivitySourceKey;
  label: string;
};

const sourceStyles = {
  github: {
    label: "GitHub",
    className: "bg-gray-800 text-white",
    icon: "github",
  },
  note: {
    label: "note",
    className: "bg-emerald-500 text-white",
    icon: "note",
  },
  okalog: {
    label: "okalog",
    className: "bg-amber-500 text-white",
    icon: "okalog",
  },
  youtube: {
    label: "YouTube",
    className: "bg-red-500 text-white",
    icon: "youtube",
  },
} satisfies Record<ActivitySourceKey, SourceMeta>;

const filterOptions = [
  { key: "all", label: "All" },
  { key: "github", label: sourceStyles.github.label },
  { key: "note", label: sourceStyles.note.label },
  { key: "okalog", label: sourceStyles.okalog.label },
  { key: "youtube", label: sourceStyles.youtube.label },
] satisfies Array<{ key: ActivityFilterKey; label: string }>;

const formatTimelineDate = (dateString: string) =>
  new Intl.DateTimeFormat("ja-JP", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(dateString));

const SourceIcon = ({
  source,
  size = 24,
}: {
  source: ActivitySourceKey;
  size?: number;
}) => {
  const baseClassName =
    "inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-gray-200 bg-white";
  const style = { height: size, width: size };

  if (source === "github") {
    return (
      <span className={baseClassName} style={style}>
        <Image
          src="/images/icon-github.svg"
          alt="GitHub"
          width={size}
          height={size}
        />
      </span>
    );
  }

  if (source === "youtube") {
    return (
      <span className={baseClassName} style={style}>
        <Image
          src="/images/icon-youtube-red.png"
          alt="YouTube"
          width={size}
          height={size}
          className="scale-125"
        />
      </span>
    );
  }

  if (source === "okalog") {
    return (
      <span className={baseClassName} style={style}>
        <Image
          src="/images/icon-oka.png"
          alt="okalog"
          width={size}
          height={size}
        />
      </span>
    );
  }

  return (
    <span className={baseClassName} style={style}>
      <Image
        src="/images/icon-note.png"
        alt="note"
        width={size}
        height={size}
      />
    </span>
  );
};

export default function ActivityTimeline({ entries }: ActivityTimelineProps) {
  const [activeFilter, setActiveFilter] = useState<ActivityFilterKey>("all");
  const countsBySource = useMemo(
    () =>
      entries.reduce(
        (counts, entry) => {
          counts[entry.source] += 1;

          return counts;
        },
        {
          github: 0,
          note: 0,
          okalog: 0,
          youtube: 0,
        } satisfies Record<ActivitySourceKey, number>,
      ),
    [entries],
  );
  const filteredEntries = useMemo(
    () =>
      activeFilter === "all"
        ? entries
        : entries.filter((entry) => entry.source === activeFilter),
    [activeFilter, entries],
  );

  if (entries.length === 0) {
    return (
      <p className="rounded-lg border border-gray-200 px-5 py-8 text-center text-sm text-gray-500">
        Activity is not available yet.
      </p>
    );
  }

  return (
    <div>
      <fieldset className="mb-8 flex flex-wrap gap-2">
        <legend className="sr-only">Timeline filters</legend>
        {filterOptions.map((option) => {
          const count =
            option.key === "all" ? entries.length : countsBySource[option.key];
          const isActive = option.key === activeFilter;
          const source =
            option.key === "all" ? undefined : sourceStyles[option.key];

          return (
            <button
              key={option.key}
              type="button"
              onClick={() => setActiveFilter(option.key)}
              className={`inline-flex min-h-10 items-center gap-2 rounded-full border px-3 py-2 text-sm font-bold transition ${
                isActive
                  ? "border-gray-900 bg-gray-900 text-white"
                  : "border-gray-200 bg-white text-gray-700 hover:border-gray-400"
              }`}
            >
              {source && <SourceIcon source={source.icon} size={20} />}
              <span>{option.label}</span>
              <span className={isActive ? "text-white/70" : "text-gray-400"}>
                {count}
              </span>
            </button>
          );
        })}
      </fieldset>

      {filteredEntries.length === 0 ? (
        <p className="rounded-lg border border-gray-200 px-5 py-8 text-center text-sm text-gray-500">
          No activity found.
        </p>
      ) : (
        <ol className="relative border-l border-gray-200 pl-5">
          {filteredEntries.map((entry) => {
            const source = sourceStyles[entry.source];
            const title = (
              <>
                <SourceIcon source={source.icon} />
                <span
                  className={`inline-flex shrink-0 items-center rounded px-2 py-1 text-xs font-bold ${source.className}`}
                >
                  {source.label}
                </span>
                <span className="text-base font-bold text-gray-900">
                  {entry.title}
                </span>
              </>
            );

            return (
              <li key={entry.id} className="relative pb-8 last:pb-0">
                <span className="-left-[27px] absolute mt-1 size-3 rounded-full border-2 border-white bg-gray-900" />
                <time className="text-sm font-semibold text-gray-500">
                  {formatTimelineDate(entry.date)}
                </time>

                <div className="mt-2 flex flex-wrap items-center gap-2">
                  {entry.href ? (
                    <a
                      href={entry.href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex flex-wrap items-center gap-2 hover:opacity-70"
                    >
                      {title}
                    </a>
                  ) : (
                    <div className="inline-flex flex-wrap items-center gap-2">
                      {title}
                    </div>
                  )}
                </div>

                {entry.thumbnailUrl ? (
                  <div className="mt-3 overflow-hidden rounded border border-gray-200 bg-gray-50 md:max-w-sm">
                    <Image
                      src={entry.thumbnailUrl}
                      alt=""
                      width={384}
                      height={216}
                      className="aspect-video w-full object-cover"
                    />
                  </div>
                ) : null}

                {entry.description && (
                  <p className="mt-3 break-words text-sm leading-6 text-gray-600">
                    {entry.description}
                  </p>
                )}
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
