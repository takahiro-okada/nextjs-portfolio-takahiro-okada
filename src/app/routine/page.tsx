import RoutineDashboard from "@/components/ui/RoutineDashboard";
import SectionTitle from "@/components/ui/SectionTitle";
import { getRoutineList } from "@/lib/microcms";
import { createPageMetadata } from "@/utils/createMetadata";

export const metadata = createPageMetadata("routine");
export const revalidate = 21600;

export default async function RoutinePage() {
  const routineList = await getRoutineList();

  return (
    <div className="max-w-(--content-width) mx-auto px-5">
      <SectionTitle>Routine</SectionTitle>

      <p className="mt-4 max-w-[680px] text-sm leading-7 text-gray-500">
        A quiet place to keep daily health and habit records.
      </p>

      <div className="mt-8">
        <RoutineDashboard routines={routineList.contents} />
      </div>
    </div>
  );
}
