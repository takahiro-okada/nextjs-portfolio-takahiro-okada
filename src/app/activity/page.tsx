import ActivityLog from "@/components/ui/ActivityLog";
import ActivityTimeline from "@/components/ui/ActivityTimeline";
import SectionTitle from "@/components/ui/SectionTitle";
import { getActivityLog } from "@/lib/activityLog";
import { createPageMetadata } from "@/utils/createMetadata";

export const metadata = createPageMetadata("activity");
export const revalidate = 21600;

export default async function ActivityPage() {
  const activityLog = await getActivityLog();

  return (
    <div className="max-w-(--content-width) mx-auto px-5">
      <SectionTitle>Activity</SectionTitle>

      <div className="mt-8">
        <ActivityLog
          monthlyActivities={activityLog.monthlyActivities}
          periodLabel={activityLog.periodLabel}
        />
      </div>

      <section className="mt-14">
        <div className="mb-8 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Timeline</h2>
            <p className="mt-1 text-sm text-gray-500">Latest activity.</p>
          </div>
          <p className="text-sm font-semibold text-gray-700">
            {activityLog.timelineEntries.length} entries
          </p>
        </div>

        <ActivityTimeline entries={activityLog.timelineEntries} />
      </section>
    </div>
  );
}
