import SectionTitle from "@/components/ui/SectionTitle";
import TravelExplorer from "@/components/ui/TravelExplorer";
import { getTravelLogList } from "@/lib/microcms";
import { createPageMetadata } from "@/utils/createMetadata";

export const metadata = createPageMetadata("travel");
export const revalidate = 21600;

export default async function TravelPage() {
  const travelLogs = await getTravelLogList();

  return (
    <div className="max-w-(--content-width) mx-auto px-5">
      <SectionTitle>Travel</SectionTitle>

      <div className="mt-8">
        <TravelExplorer
          logs={travelLogs.contents}
          googleMapsApiKey={process.env.GOOGLE_MAP_API_KEY}
        />
      </div>
    </div>
  );
}
