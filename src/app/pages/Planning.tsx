import { useState, useEffect, useMemo } from "react";
import { ChevronLeft, ChevronRight, Calendar, List } from "lucide-react";
import { authFetch } from "../api";

/* ================= TYPES ================= */

type Slot = {
  time: string;
  numeroProjet: string;
  date: string;
  NomDemande: string;
  technicienId?: number;
  shift?: "MATIN" | "SOIR" | "NUIT";
};

type DayPlanning = {
  day: string;
  slots: Slot[];
};
type Technicien = {
  id: number;
  nom: string;
  prenom: string;
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
      d.getMonth() + 1,
    ).padStart(2, "0")}/${d.getFullYear()}`;

  return { monday: format(monday), sunday: format(sunday) };
}

/* ================= COLOR LOGIC ================= */

function getSlotColor(shift?: string) {
  switch (shift) {
    case "MATIN":
      return "bg-green-100 border-green-300 dark:bg-green-900/40 dark:border-green-700";
    case "SOIR":
      return "bg-yellow-100 border-yellow-300 dark:bg-yellow-900/40 dark:border-yellow-700";
    case "NUIT":
      return "bg-indigo-100 border-indigo-300 dark:bg-indigo-900/40 dark:border-indigo-700";
    case "APRES_MIDI":
      return "bg-orange-100 border-orange-300 dark:bg-orange-900/40 dark:border-orange-700";
    default:
      return "bg-gray-100 border-gray-300 dark:bg-gray-800 dark:border-gray-600";
  }
}

/* ================= MAIN COMPONENT ================= */

export function Planning() {
  const [demandes, setDemandes] = useState<any[]>([]);
  const [weekOffset, setWeekOffset] = useState(0);
  const [techniciens, setTechniciens] = useState<Technicien[]>([]);

  const [filterMine, setFilterMine] = useState(false);
  const [filterDate, setFilterDate] = useState("");
  const [numeroProjetFilter, setNumeroProjetFilter] = useState("");

  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar");
  const [selectedTechnicienId, setSelectedTechnicienId] = useState<number | "">(
    "",
  );

  const daysMap = [
    "Dimanche",
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi",
  ];
  function getWeekDays(offsetWeeks: number = 0) {
    const now = new Date();

    const monday = new Date(now);
    const day = monday.getDay();
    const diff = (day === 0 ? -6 : 1) - day;
    monday.setDate(monday.getDate() + diff + offsetWeeks * 7);

    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);

      return {
        dayName: d.toLocaleDateString("fr-FR", { weekday: "long" }),
        date: d.toISOString().split("T")[0], // format YYYY-MM-DD
        label: `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1)
          .toString()
          .padStart(2, "0")}`,
      };
    });
  }
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

  const weekDays = useMemo(() => getWeekDays(weekOffset), [weekOffset]);

  const planningData: DayPlanning[] = useMemo(() => {
    return weekDays.map((d) => {
      const slots = demandes
        .filter((x) => x.datePlanification?.startsWith(d.date))
        .map((d) => ({
          time: d.shift ?? "MATIN",
          numeroProjet: d.numeroProjet?.toString() ?? "",
          date: d.datePlanification,
          NomDemande: d.nomAuto ?? "",
          driver: d.demandeur ?? "",
          technicienId: d.technicienId, // 👈 AJOUT

          shift: d.shift,
        }));

      return {
        day: `${d.dayName} ${d.label}`, // 👈 JOUR + DATE
        slots,
      };
    });
  }, [demandes, weekDays]);

  /* ================= FILTER ================= */

  const filteredPlanning = planningData.map((day) => ({
    ...day,
    slots: day.slots.filter((slot) => {
      if (filterMine && slot.technicienId !== 4) return false;

      if (selectedTechnicienId && slot.technicienId !== selectedTechnicienId)
        return false;

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

  /* ================= RENDER ================= */
  /* ================= RENDER ================= */
  useEffect(() => {
    const fetchTechniciens = async () => {
      try {
        const data = await authFetch("/users/techniciens");
        setTechniciens(Array.isArray(data) ? data : []); // ✅ données brutes avec id, nom, prenom
      } catch (err) {
        console.error("Erreur chargement techniciens", err);
      }
    };

    fetchTechniciens();
  }, []);
  const technicienMap = useMemo(() => {
    return new Map(
      techniciens.map((t) => [t.id, `${t.nom ?? ""} ${t.prenom ?? ""}`.trim()]),
    );
  }, [techniciens]);

  return (
    <div className="space-y-6 p-3">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-semibold text-foreground mb-2">
          Planning hebdomadaire
        </h1>
        <p className="text-muted-foreground">
          Visualisation des essais planifiés
        </p>
      </div>

      {/* FILTER BAR */}
      <div className="bg-card p-5 sm:p-5 rounded-xl border border-border shadow-sm flex flex-col lg:flex-row lg:items-center gap-4">
        {/* Navigation semaine */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setWeekOffset(weekOffset - 1)}
            className="p-2 rounded-md hover:bg-muted transition"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 bg-background px-3 py-2 rounded-lg border border-border">
            {" "}
            <Calendar className="w-8 h-4 text-muted-foreground-500" />
            <span className="text-sm font-medium">Semaine du {monday}</span>
          </div>

          <button
            onClick={() => setWeekOffset(weekOffset + 1)}
            className="p-2 rounded-md hover:bg-muted transition"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
        <button
          onClick={() => setWeekOffset(0)}
          className="h-12 px-6 bg-[#B9032C] text-white rounded-lg hover:bg-[#B9032C]/90 transition text-sm"
        >
          Aujourd’hui
        </button>
        {/* Filters */}
        <div className="flex flex-wrap gap-3 items-center w-full">
          {/* Projet */}
          <input
            type="text"
            placeholder="Projet"
            value={numeroProjetFilter}
            onChange={(e) => setNumeroProjetFilter(e.target.value)}
            className="h-12 px-6 bg-background text-foreground border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus-within:ring-ring transition w-full sm:w-[160px] transition"
          />

          {/* Date */}
          <div className="relative w-full sm:w-[160px]">
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="h-12 px-4 bg-background text-foreground border border-border rounded-lg text-sm focus:outline-none focus:ring-2focus-within:ring-ring w-full sm:w-[160px] transition"
            />
          </div>

          {/* Technicien */}
          <select
            value={selectedTechnicienId}
            onChange={(e) =>
              setSelectedTechnicienId(
                e.target.value ? Number(e.target.value) : "",
              )
            }
            className="h-12 px-4 bg-background text-foreground border border-border rounded-lg text-sm"
          >
            <option value="">Tous techniciens</option>

            {techniciens.map((t) => (
              <option key={t.id} value={t.id}>
                {t.nom} {t.prenom}
              </option>
            ))}
          </select>
          {/* View mode */}
          <button
            onClick={() =>
              setViewMode(viewMode === "calendar" ? "list" : "calendar")
            }
            className="h-12 px-8 bg-background text-foreground border border-border rounded-lg flex items-center gap-2 hover:bg-muted transition"
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
      <div className="grid grid-cols-7 gap-2 bg-card rounded-xl border border-border overflow-hidden shadow-sm">
        {planning.map((day) => (
          <div
            key={day.day}
            className="flex flex-col bg-card border-r border-border last:border-r-0 min-h-[260px]"
          >
            {/* HEADER JOUR */}
            <div className="sticky top-0 z-10 bg-[#B9032C] text-white text-center py-3 font-semibold text-sm tracking-wide shadow-sm">
              {day.day}
            </div>

            {/* CONTENT */}
            <div className="p-2 space-y-2 overflow-y-auto">
              {day.slots.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[180px] text-muted-foreground text-xs">
                  <span>Aucun essai</span>
                </div>
              ) : (
                day.slots.map((slot, i) => (
                  <div
                    key={i}
                    className={`
                    rounded-lg border border-border p-2 shadow-sm
                    bg-card hover:shadow-md transition-all
                    ${getSlotColor(slot.shift)}
                  `}
                  >
                    {/* TOP ROW */}
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/10 text-foreground/70">
                        {slot.shift}
                      </span>
                    </div>

                    {/* PROJECT */}
                    <div className="text-xs font-semibold text-foreground">
                      {slot.NomDemande}
                    </div>

                    {/* PROJET ID */}
                    <div className="text-[11px] text-muted-foreground mt-0.5">
                      Projet : {slot.numeroProjet}
                    </div>

                    {/* DRIVER */}
                    <div className="mt-1 text-[11px] text-muted-foreground flex items-center gap-1">
                      <span>
                        👤{" "}
                        {slot.technicienId != null
                          ? (technicienMap.get(slot.technicienId) ??
                            "Non assigné")
                          : "Non assigné"}
                      </span>{" "}
                    </div>
                  </div>
                ))
              )}
            </div>
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
          <div
            key={day.day}
            className="bg-card border border-border p-3 rounded-xl shadow-sm"
          >
            <h2 className="font-bold mb-2 text-foreground">{day.day}</h2>

            {day.slots.map((slot, i) => (
              <div
                key={i}
                className={`p-2 mb-2 rounded border border-border bg-background text-foreground ${getSlotColor(
                  slot.shift,
                )}`}
              >
                <span className="text-xs font-semibold text-foreground/90">
                  {slot.time}
                </span>

                {" - "}

                <span className="text-sm font-medium text-foreground">
                  {slot.NomDemande}
                </span>

                {" - "}

                <span className="text-xs text-muted-foreground">
                  {technicienMap.get(slot.technicienId) ?? "Non assigné"}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }
}
