import type {
  MicroCMSImage,
  MicroCMSListContent,
  MicroCMSQueries,
} from "microcms-js-sdk";

import { createClient } from "microcms-js-sdk";

const ENDPOINTS = {
  notes: "notes",
  travel: "travel",
  works: "work",
} as const;

const LATEST_LIMIT = 3;

export type Note = {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
  thumbnail: MicroCMSImage;
  createdAt: string;
  category: Category;
  content: string;
} & MicroCMSListContent;

export type Category = {
  name: string;
} & MicroCMSListContent;

export type Work = {
  id: string;
  publishedAt: string;
  createdAt: string;
  thumbnail: MicroCMSImage;
  title: string;
  url?: string;
  techs?: string[];
  github?: string;
  summary?: string;
  contents?: Array<{
    fieldId: string;
    contentTitle: string;
    contentDescription: string;
  }>;
} & MicroCMSListContent;

export type TravelLog = {
  id: string;
  title?: string;
  place: string;
  country?: string;
  visitedAt: string;
  latitude?: number;
  longitude?: number;
  photos?: MicroCMSImage[];
  photo?: MicroCMSImage;
  description?: string;
} & MicroCMSListContent;

const DEMO_TRAVEL_LOGS = [
  {
    id: "demo-christchurch",
    title: "Botanic Gardens Walk",
    place: "Christchurch",
    country: "New Zealand",
    visitedAt: "2026-06-18T00:00:00.000Z",
    latitude: -43.532,
    longitude: 172.6362,
    photos: [
      {
        url: "/images/travel-demo-christchurch.svg",
        width: 1200,
        height: 900,
      },
    ],
    description:
      "A slow afternoon around Christchurch with green paths, old trees, and a quiet city mood.",
    createdAt: "2026-06-18T00:00:00.000Z",
    updatedAt: "2026-06-18T00:00:00.000Z",
    publishedAt: "2026-06-18T00:00:00.000Z",
    revisedAt: "2026-06-18T00:00:00.000Z",
  },
  {
    id: "demo-queenstown",
    title: "Lake Wakatipu",
    place: "Queenstown",
    country: "New Zealand",
    visitedAt: "2026-05-06T00:00:00.000Z",
    latitude: -45.0312,
    longitude: 168.6626,
    photos: [
      {
        url: "/images/travel-demo-queenstown.svg",
        width: 1200,
        height: 900,
      },
    ],
    description:
      "A mountain and lake stop for the travel log prototype, with enough detail to test map selection.",
    createdAt: "2026-05-06T00:00:00.000Z",
    updatedAt: "2026-05-06T00:00:00.000Z",
    publishedAt: "2026-05-06T00:00:00.000Z",
    revisedAt: "2026-05-06T00:00:00.000Z",
  },
  {
    id: "demo-tokyo",
    title: "Night Walk",
    place: "Tokyo",
    country: "Japan",
    visitedAt: "2026-03-22T00:00:00.000Z",
    latitude: 35.6764,
    longitude: 139.65,
    photos: [
      {
        url: "/images/travel-demo-tokyo.svg",
        width: 1200,
        height: 900,
      },
    ],
    description:
      "A city entry to check how the date list and map pins feel across distant locations.",
    createdAt: "2026-03-22T00:00:00.000Z",
    updatedAt: "2026-03-22T00:00:00.000Z",
    publishedAt: "2026-03-22T00:00:00.000Z",
    revisedAt: "2026-03-22T00:00:00.000Z",
  },
] satisfies TravelLog[];

const createDemoTravelLogList = () => ({
  contents: DEMO_TRAVEL_LOGS,
  limit: 100,
  offset: 0,
  totalCount: DEMO_TRAVEL_LOGS.length,
});

if (!process.env.MICROCMS_SERVICE_DOMAIN) {
  throw new Error("MICROCMS_SERVICE_DOMAIN is required");
}

if (!process.env.MICROCMS_API_KEY) {
  throw new Error("MICROCMS_API_KEY is required");
}

export const client = createClient({
  serviceDomain: process.env.MICROCMS_SERVICE_DOMAIN,
  apiKey: process.env.MICROCMS_API_KEY,
});

const getList = <T extends MicroCMSListContent>(
  endpoint: (typeof ENDPOINTS)[keyof typeof ENDPOINTS],
  queries?: MicroCMSQueries,
) =>
  client.getList<T>({
    endpoint,
    queries,
  });

const getDetail = <T extends MicroCMSListContent>(
  endpoint: (typeof ENDPOINTS)[keyof typeof ENDPOINTS],
  contentId: string,
) =>
  client.getListDetail<T>({
    endpoint,
    contentId,
  });

export const getNoteList = (queries?: MicroCMSQueries) =>
  getList<Note>(ENDPOINTS.notes, queries);

export const getNote = (slug: string) => getDetail<Note>(ENDPOINTS.notes, slug);

export const getLatestNotes = async () => {
  const notes = await getNoteList({
    limit: LATEST_LIMIT,
    orders: "-publishedAt",
  });
  return notes.contents;
};

export const getWorkList = (queries?: MicroCMSQueries) =>
  getList<Work>(ENDPOINTS.works, queries);

export const getLatestWorks = async () => {
  const works = await getWorkList({
    limit: LATEST_LIMIT,
    orders: "-publishedAt",
  });
  return works.contents;
};

export const getWork = (slug: string) => getDetail<Work>(ENDPOINTS.works, slug);

export const getTravelLogList = async (queries?: MicroCMSQueries) => {
  try {
    const travelLogs = await getList<TravelLog>(ENDPOINTS.travel, {
      limit: 100,
      orders: "-visitedAt",
      ...queries,
    });

    if (travelLogs.contents.length === 0) {
      return createDemoTravelLogList();
    }

    return travelLogs;
  } catch {
    return createDemoTravelLogList();
  }
};
