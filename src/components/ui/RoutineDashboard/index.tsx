import type { Routine } from "@/lib/microcms";

type RoutineDashboardProps = {
  routines: Routine[];
};

type HabitKey = "readingBook" | "journaling" | "stretch";

const habitItems = [
  { key: "readingBook", label: "Reading" },
  { key: "journaling", label: "Journaling" },
  { key: "stretch", label: "Stretch" },
] satisfies Array<{ key: HabitKey; label: string }>;

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  day: "numeric",
  month: "short",
  timeZone: "UTC",
  year: "numeric",
});

const numberFormatter = new Intl.NumberFormat("en-US");

const formatRoutineDate = (dateString: string) =>
  dateFormatter.format(new Date(dateString));

const formatSteps = (steps: number | undefined) =>
  typeof steps === "number" && Number.isFinite(steps)
    ? numberFormatter.format(steps)
    : "--";

const formatWeight = (weight: number | undefined) =>
  typeof weight === "number" && Number.isFinite(weight)
    ? `${weight.toFixed(1)} kg`
    : "--";

const getHabitDoneCount = (routine: Routine) =>
  habitItems.filter((habit) => routine[habit.key] === true).length;

const getRecordLabel = (count: number) =>
  `${count} routine ${count === 1 ? "record" : "records"}`;

function HabitStatus({ done, label }: { done: boolean; label: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-gray-200 border-t py-3">
      <span className="text-sm text-gray-600">{label}</span>
      <span
        className={`inline-flex min-h-7 items-center gap-2 rounded-full px-2.5 py-1 text-xs font-semibold ${
          done ? "text-gray-900" : "text-gray-400"
        }`}
      >
        <span
          className={`size-2 rounded-full border ${
            done ? "border-gray-900 bg-gray-900" : "border-gray-300"
          }`}
        />
        {done ? "Done" : "Not done"}
      </span>
    </div>
  );
}

function CompactHabitStatus({ done, label }: { done: boolean; label: string }) {
  return (
    <span
      className={`inline-flex min-h-7 items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-semibold ${
        done
          ? "border-gray-900 bg-gray-900 text-white"
          : "border-gray-200 bg-white text-gray-400"
      }`}
    >
      <span
        className={`size-1.5 rounded-full ${done ? "bg-white" : "bg-gray-300"}`}
      />
      <span>{label}</span>
      <span className={done ? "text-white/70" : "text-gray-400"}>
        {done ? "Done" : "Not done"}
      </span>
    </span>
  );
}

export default function RoutineDashboard({ routines }: RoutineDashboardProps) {
  const sortedRoutines = [...routines].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
  const latestRoutine = sortedRoutines[0];
  const recentRoutines = sortedRoutines.slice(0, 30);

  if (!latestRoutine) {
    return (
      <div className="border-gray-200 border-y px-2 py-14 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Latest record</h2>
        <p className="mt-3 text-sm leading-7 text-gray-500">
          Routine data is not available yet.
        </p>
      </div>
    );
  }

  const latestDoneCount = getHabitDoneCount(latestRoutine);

  return (
    <div className="mx-auto max-w-[680px]">
      <section className="border-gray-200 border-y py-8 md:py-10">
        <div className="grid gap-8 md:grid-cols-[1fr_220px] md:items-start">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] text-gray-400 uppercase">
              Latest record
            </p>
            <div>
              <time
                dateTime={latestRoutine.date}
                className="mt-4 block text-4xl font-bold leading-tight text-gray-900 md:text-5xl"
              >
                {formatRoutineDate(latestRoutine.date)}
              </time>
            </div>

            <p className="mt-5 max-w-md text-sm leading-7 text-gray-500">
              A quiet snapshot of steps, weight, and small daily habits.
            </p>

            <dl className="mt-8 grid grid-cols-2 gap-x-8 gap-y-5">
              <div>
                <dt className="text-xs font-semibold tracking-[0.16em] text-gray-400 uppercase">
                  Steps
                </dt>
                <dd className="mt-2 text-3xl font-bold text-gray-900">
                  {formatSteps(latestRoutine.walking)}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold tracking-[0.16em] text-gray-400 uppercase">
                  Weight
                </dt>
                <dd className="mt-2 text-3xl font-bold text-gray-900">
                  {formatWeight(latestRoutine.weight)}
                </dd>
              </div>
            </dl>
          </div>

          <div>
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="text-lg font-bold text-gray-900">Habits</h2>
              <p className="text-xs font-semibold text-gray-400">
                {latestDoneCount} / {habitItems.length}
              </p>
            </div>
            <div className="mt-4">
              {habitItems.map((habit) => (
                <HabitStatus
                  key={habit.key}
                  label={habit.label}
                  done={latestRoutine[habit.key] === true}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-14">
        <div className="mb-1 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Recent activity
            </h2>
            <p className="mt-2 text-sm leading-7 text-gray-500">
              {getRecordLabel(recentRoutines.length)} from the latest entries.
            </p>
          </div>
          <p className="text-xs font-semibold tracking-[0.16em] text-gray-400 uppercase">
            Up to 30 days
          </p>
        </div>

        <ol className="mt-6 border-gray-200 border-t">
          {recentRoutines.map((routine) => (
            <li key={routine.id} className="border-gray-200 border-b py-5">
              <div className="grid gap-4 md:grid-cols-[140px_1fr]">
                <time
                  dateTime={routine.date}
                  className="text-sm font-bold text-gray-900"
                >
                  {formatRoutineDate(routine.date)}
                </time>

                <div>
                  <dl className="grid grid-cols-2 gap-5 text-sm">
                    <div>
                      <dt className="text-xs font-semibold tracking-[0.16em] text-gray-400 uppercase">
                        Steps
                      </dt>
                      <dd className="mt-1 font-bold text-gray-900">
                        {formatSteps(routine.walking)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs font-semibold tracking-[0.16em] text-gray-400 uppercase">
                        Weight
                      </dt>
                      <dd className="mt-1 font-bold text-gray-900">
                        {formatWeight(routine.weight)}
                      </dd>
                    </div>
                  </dl>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {habitItems.map((habit) => (
                      <CompactHabitStatus
                        key={habit.key}
                        label={habit.label}
                        done={routine[habit.key] === true}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
