import { useState, useEffect, useMemo } from "react";
import { ChevronLeft, ChevronRight, Calendar, List } from "lucide-react";
import { authFetch } from "../api";

/* ================= TYPES ================= */

type Slot = {
  time: string;
  numeroProjet: string;
  date: string;
  NomDemande: string;
  driver: string;
  shift?: "MATIN" | "SOIR" | "NUIT";
};

type DayPlanning = {
  day: string;
  slots: Slot[];
};

/* ================= UTIL ================= */

function getWeekDateRange(offsetWeeks: number = 0) {
  const now = new Date();
  now.setDate(now.getDate() + offsetWeeks * 7);

  const dayOfWeek = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((dayOfWeek + 6) % 7));

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  const format = (d: Date) =>
    `${String(d.getDate()).padStart(2, "0")}/${String(
      d.getMonth() + 1
    ).padStart(2, "0")}/${d.getFullYear()}`;

  return { monday: format(monday), sunday: format(sunday) };
}

/* ================= COLOR LOGIC ================= */

function getSlotColor(shift?: string) {
  switch (shift) {
    case "MATIN":
      return "bg-green-100 border-green-300";
    case "SOIR":
      return "bg-yellow-100 border-yellow-300";
    case "NUIT":
      return "bg-indigo-100 border-indigo-300";
    default:
      return "bg-gray-100 border-gray-300";
  }
}

/* ================= MAIN COMPONENT ================= */

export function Planning() {
  const [demandes, setDemandes] = useState<any[]>([]);
  const [weekOffset, setWeekOffset] = useState(0);

  const [filterMine, setFilterMine] = useState(false);
  const [filterDate, setFilterDate] = useState("");
  const [numeroProjetFilter, setNumeroProjetFilter] = useState("");
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar");
  const [selectedDriver, setSelectedDriver] = useState("");

  const daysMap = [
    "Dimanche",
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi",
  ];

  const { monday } = getWeekDateRange(weekOffset);

  /* ================= FETCH ================= */

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await authFetch("/demandes-essai");
        setDemandes(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error(e);
      }
    };

    fetchData();
  }, []);

  /* ================= TRANSFORM DATA ================= */

  const planningData: DayPlanning[] = useMemo(() => {
    const map: Record<string, DayPlanning> = {};

    daysMap.forEach((day) => {
      map[day] = { day, slots: [] };
    });

    demandes.forEach((d) => {
      if (!d.datePlanification) return;

      const date = new Date(d.datePlanification);
      const dayName = daysMap[date.getDay()];

      map[dayName].slots.push({
        time: d.shift ?? "MATIN",
        numeroProjet: d.numerProjet?.toString() ?? "",
        date: d.datePlanification,
        NomDemande: d.nomAuto ?? "",
        driver: d.demandeur ?? "",
        shift: d.shift,
      });
    });

    return Object.values(map);
  }, [demandes]);

  /* ================= FILTER ================= */

  const filteredPlanning = planningData.map((day) => ({
    ...day,
    slots: day.slots.filter((slot) => {
      if (filterMine && slot.driver !== "Karim") return false;

      if (selectedDriver && slot.driver !== selectedDriver) return false;

      if (
        numeroProjetFilter &&
        !slot.numeroProjet
          ?.toLowerCase()
          .includes(numeroProjetFilter.toLowerCase())
      )
        return false;

      if (filterDate && slot.date !== filterDate) return false;

      return true;
    }),
  }));

  /* ================= DRIVERS ================= */

  const drivers = useMemo(() => {
    return Array.from(
      new Set(
        planningData.flatMap((d) =>
          d.slots.map((s) => s.driver).filter(Boolean)
        )
      )
    );
  }, [planningData]);

  /* ================= RENDER ================= */
/* ================= RENDER ================= */

return (
  <div className="space-y-6 p-3">
    {/* HEADER */}
    <div>
      <h1 className="text-3xl font-semibold">Planning hebdomadaire</h1>
      <p className="text-gray-600">Visualisation des essais planifiés</p>
    </div>

    {/* FILTER BAR */}
    <div className="bg-white p-5 sm:p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col lg:flex-row lg:items-center gap-4">

      {/* Navigation semaine */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setWeekOffset(weekOffset - 1)}
          className="p-2 rounded-md hover:bg-gray-100 transition"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg border">
          <Calendar className="w-8 h-4 text-gray-500" />
          <span className="text-sm font-medium">Semaine du {monday}</span>
        </div>

        <button
          onClick={() => setWeekOffset(weekOffset + 1)}
          className="p-2 rounded-md hover:bg-gray-100 transition"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center w-full">

        {/* Projet */}
        <input
          type="text"
          placeholder="Projet"
          value={numeroProjetFilter}
          onChange={(e) => setNumeroProjetFilter(e.target.value)}
          className="h-10 px-4 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#E30613]/30 outline-none w-full sm:w-[160px]"
        />

        {/* Date */}
        <div className="relative w-full sm:w-[160px]">
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="h-10 px-4 pr-8 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#E30613]/30 outline-none w-full"
          />

          {/* bouton reset date */}
          {filterDate && (
            <button
              onClick={() => setFilterDate("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500"
              title="Réinitialiser la date"
            >
              ✕
            </button>
          )}
        </div>

        {/* Technicien */}
        <select
          value={selectedDriver}
          onChange={(e) => setSelectedDriver(e.target.value)}
          className="h-10 px-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#E30613]/30 outline-none w-full sm:w-[180px]"
        >
          <option value="">Tous techniciens</option>
          {drivers.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>

        {/* View mode */}
        <button
          onClick={() =>
            setViewMode(viewMode === "calendar" ? "list" : "calendar")
          }
          className="h-10 px-3 border border-gray-200 rounded-lg flex items-center gap-2 hover:bg-gray-50 transition"
        >
          <List className="w-4 h-4" />
          <span className="text-sm capitalize">{viewMode}</span>
        </button>
      </div>
    </div>

    {/* VIEW */}
    {viewMode === "calendar" ? (
      <CalendarView planning={filteredPlanning} />
    ) : (
      <ListView planning={filteredPlanning} />
    )}
  </div>
);
/* ================= CALENDAR VIEW ================= */

function CalendarView({ planning }: { planning: DayPlanning[] }) {
  return (
    <div className="grid grid-cols-7 gap-1 bg-white rounded-xl overflow-hidden border">
      {planning.map((day) => (
        <div key={day.day} className="border p-2 min-h-[250px]">
          <div className="font-bold text-center mb-2">{day.day}</div>

          {day.slots.length === 0 ? (
            <div className="text-xs text-gray-400 text-center">
              Aucun essai
            </div>
          ) : (
            day.slots.map((slot, i) => (
              <div
                key={i}
                className={`p-2 mb-2 rounded border ${getSlotColor(
                  slot.shift
                )}`}
              >
                <div className="text-xs font-bold">{slot.time}</div>
                <div className="text-sm">{slot.NomDemande}</div>
                <div className="text-xs text-gray-600">{slot.driver}</div>
              </div>
            ))
          )}
        </div>
      ))}
    </div>
  );
}

/* ================= LIST VIEW ================= */

function ListView({ planning }: { planning: DayPlanning[] }) {
  return (
    <div className="space-y-4">
      {planning.map((day) => (
        <div key={day.day} className="bg-white p-3 rounded shadow">
          <h2 className="font-bold mb-2">{day.day}</h2>

          {day.slots.map((slot, i) => (
            <div
              key={i}
              className={`p-2 mb-2 rounded border ${getSlotColor(
                slot.shift
              )}`}
            >
              {slot.time} - {slot.NomDemande} - {slot.driver}
            </div>
          ))}
        </div>
      ))}
    </div>
    
  );
}};