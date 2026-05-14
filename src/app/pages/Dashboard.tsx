import { useEffect, useState } from "react";
import {
  Car,
  BarChart3,
  Settings,
  Repeat,
  Calendar,
  CheckCircle,
  ClipboardCheck,
  Clock,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { authFetch } from "../api";

const pieData = [];
const pieChargeData = [
  { name: "OK", value: 8, color: "#2E7D32" },
  { name: "NOK", value: 24, color: "#C62828" },
  { name: "Sous réserve", value: 6, color: "#ED6C02" },
];

const pieTeschnicienData = [
  { name: "OK", value: 12, color: "#2E7D32" },
  { name: "NOK", value: 6, color: "#C62828" },
  { name: "Sous réserve", value: 16, color: "#ED6C02" },
];

const techniciens = [
  "Tous les techniciens",
  "Technicien 1",
  "Technicien 2",
  "Technicien 3",
  "Technicien 4",
];
const charges = [
  "Tous les chargés d'essai",
  "Chargé 1",
  "Chargé 2",
  "Chargé 3",
];
const technicienValidationData = {};
const clients = ["Tous les clients", "RENAULT", "STELLANTIS", "FEV"];
const pieDataByClient = {};
const groupedValidationData = [
  {
    month: "Jan",
    OK: 10,
    NOK: 4,
    SousReserve: 1,
    type: "charge",
  },
];
const chargeValidationData = {
  "Tous les chargés d'essai": [
    { name: "OK", value: 8, color: "#2E7D32" },
    { name: "NOK", value: 24, color: "#C62828" },
    { name: "Sous réserve", value: 6, color: "#ED6C02" },
  ],
};

export function Dashboard() {
  const [selectedTechnicien, setSelectedTechnicien] = useState(
    "Tous les techniciens",
  );
  const [selectedCharge, setSelectedCharge] = useState(
    "Tous les chargés d'essai",
  );
  const [selectedClient, setSelectedClient] = useState("Tous les clients");
  const [vehiculeCount, setVehiculeCount] = useState(0);
  const [loiRouteCount, setLoiRouteCount] = useState(0);
  const [calageCount, setCalageCount] = useState(0);
  const [cycleCount, setCycleCount] = useState(0);
  const [totalEssais, setTotalEssais] = useState(0);
  const [loadingWeekly, setLoadingWeekly] = useState(false);
  const [barData, setBarData] = useState([]);
  const [role, setRole] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(1);
 

  const months = [
    { label: "Janvier", value: 1 },
    { label: "Février", value: 2 },
    { label: "Mars", value: 3 },
    { label: "Avril", value: 4 },
    { label: "Mai", value: 5 },
    { label: "Juin", value: 6 },
    { label: "Juillet", value: 7 },
    { label: "Août", value: 8 },
    { label: "Septembre", value: 9 },
    { label: "Octobre", value: 10 },
    { label: "Novembre", value: 11 },
    { label: "Décembre", value: 12 },
  ];
  const [weeklyData, setWeeklyData] = useState([]);
  const getClientParam = () =>
    selectedClient === "Tous les clients" ? null : selectedClient;
  const isAdmin = role === "ADMIN";
  type WeeklyDataByClientType = {
    [client: string]: {
      [month: string]: any;
    };
  };
  const weeklyDataByClient: WeeklyDataByClientType = {};

  type PieDataItem = {
    name: string;
    value: number;
    color: string;
  };
  const [pieData, setPieData] = useState<PieDataItem[]>([]);

  const fetchVehicules = async () => {
    try {
      const client =
        selectedClient === "Tous les clients"
          ? ""
          : `?client=${selectedClient}`;

      const data = await authFetch(`/vehicules/count${client}`);

      setVehiculeCount(data);
    } catch (err) {
      console.error("Erreur fetch vehicules:", err);
    }
  };
  useEffect(() => {
    fetchVehicules();
  }, [selectedClient]);

  useEffect(() => {
    const fetchLoiCount = async () => {
      try {
        const client =
          selectedClient === "Tous les clients"
            ? ""
            : `?client=${selectedClient}`;

        const data = await authFetch(`/lois-route/count${client}`);

        setLoiRouteCount(data);
      } catch (err) {
        console.error("Erreur fetch du nombre de loi :", err);
      }
    };

    fetchLoiCount();
  }, [selectedClient]);

  useEffect(() => {
    const fetchCalageCount = async () => {
      try {
        const client =
          selectedClient === "Tous les clients"
            ? ""
            : `?client=${selectedClient}`;

        const data = await authFetch(`/calages/count${client}`);

        setCalageCount(data);
      } catch (err) {
        console.error("Erreur fetch du nombre de calage :", err);
      }
    };

    fetchCalageCount();
  }, [selectedClient]);

  useEffect(() => {
    const fetchCycleCount = async () => {
      try {
        const client =
          selectedClient === "Tous les clients"
            ? ""
            : `?client=${selectedClient}`;

        const data = await authFetch(`/cycles/count${client}`);

        setCycleCount(data);
      } catch (err) {
        console.error("Erreur fetch du nombre de cycle :", err);
      }
    };

    fetchCycleCount();
  }, [selectedClient]);

  useEffect(() => {
    const fetchWeekly = async () => {
      const client =
        selectedClient === "Tous les clients" ? "" : selectedClient;

      const monthNumber = selectedMonth;

      const data = await authFetch(
        `/demandes-essai/evolution-semaine?client=${client}&month=${monthNumber}`,
      );

      setWeeklyData(data);
    };

    fetchWeekly();
  }, [selectedClient, selectedMonth]);

  useEffect(() => {
    const fetchTotalEssais = async () => {
      try {
        const client =
          selectedClient === "Tous les clients"
            ? ""
            : `?client=${selectedClient}`;

        const data = await authFetch(`/demandes-essai/countTotal${client}`);

        setTotalEssais(data);
      } catch (err) {
        console.error("Erreur fetch total essais :", err);
      }
    };

    fetchTotalEssais();
  }, [selectedClient]);

  const inventoryCards = [
    {
      icon: Car,
      bgColor: "#E3F2FD",
      title: "Véhicules",
      value: vehiculeCount,
      subtitle: "Nombre de véhicules ",
      color: "#0288D1",
    },
    {
      icon: BarChart3,
      title: "Lois de route",
      bgColor: "#FFF3E0",
      value: loiRouteCount,
      subtitle: "Nombre de lois ",
      color: "#FB8C00",
    },
    {
      icon: Settings,
      title: "Calages",
      bgColor: "#E8F5E9",
      value: calageCount,
      subtitle: "Nombre de calages",
      color: "#2E7D32",
    },
    {
      icon: Repeat,
      title: "Cycles conduite",
      bgColor: "#FFEBEE",
      value: cycleCount,
      subtitle: "Nombre de Cycles ",
      color: "#C62828",
    },
    {
      icon: ClipboardCheck,
      title: "Essais",
      bgColor: "#F3E5F5",
      value: totalEssais,
      subtitle: "Nombre des essais",
      color: "#8E24AA",
    },
  ];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const client =
          selectedClient === "Tous les clients" ? null : selectedClient;

        const url = client
          ? `/demandes-essai/demandesBystatus?client=${encodeURIComponent(client)}`
          : `/demandes-essai/demandesBystatus`;

        const data = await authFetch(url);

        setPieData([
          { name: "Fait", value: data.fait, color: "#2E7D32" },
          { name: "Pas fait", value: data.pasFait, color: "#C62828" },
          { name: "En cours", value: data.encours, color: "#ED6C02" },
        ]);
      } catch (err) {
        console.error(err);
      }
    };

    fetchStats();
  }, [selectedClient]);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await authFetch("/users/me");
        setRole(user.role);
      } catch (err) {
        console.error(err);
      }
    };

    loadUser();
  }, []);
  useEffect(() => {
    const fetchEvolution12Mois = async () => {
      try {
        const clientParam =
          selectedClient !== "Tous les clients"
            ? `?client=${selectedClient}`
            : "";

        const data = await authFetch(
          `/demandes-essai/evolution-12-mois${clientParam}`,
        );

        setBarData(data);
      } catch (err) {
        console.error("Erreur evolution 12 mois :", err);
      }
    };

    fetchEvolution12Mois();
  }, [selectedClient]);

  return (
    <div className="space-y-5 p-3">
      <div className="flex items-end justify-between">
        {/* Partie gauche : titre + description */}
        <div>
          <h1 className="text-3xl font-semibold text-foreground mb-1">
            Dashboard
          </h1>
          <p className="text-muted-foreground">Vue d'ensemble de l'activité</p>
        </div>

        {/* Partie droite : filtre client */}
        {isAdmin && (
          <div className="flex items-center gap-2">
            <select
              value={selectedClient}
              onChange={(e) => setSelectedClient(e.target.value)}
              className="bg-card text-foreground border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {clients.map((client) => (
                <option key={client} value={client}>
                  {client}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Inventory Cards - version Quick Summary style */}
      {/* Inventory Cards - Icône + nombre sur la même ligne */}
      <div className="flex gap-6">
        {inventoryCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={`inventory-${card.subtitle || index}`}
              className="bg-[var(--card)] text-[var(--card-foreground)] rounded-xl p-5 shadow-sm flex flex-col items-start gap-3 flex-1 hover:shadow-md transition-shadow"
            >
              {/* Ligne Icône + Nombre */}
              <div className="flex items-center gap-3 w-full">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: card.bgColor }}
                >
                  <Icon className="w-7 h-7" style={{ color: card.color }} />
                </div>
                <div
                  className="text-3xl font-semibold text-foreground
"
                >
                  {card.value}
                </div>
              </div>

              {/* Texte sur la ligne suivante */}
              <div className="w-full">
                <div className="text-muted-foreground">{card.subtitle}</div>
                {card.detail && (
                  <div className="text-sm text-gray-500">{card.detail}</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {/* Statistics */}
      <div className="grid grid-cols-3 gap-6">
        {/* Pie Chart - 1/3 */}
        <div className="bg-card rounded-xl p-6 shadow-sm col-span-1">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold">Répartition des essais</h3>
          </div>

          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  key="main-pie"
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`pie-cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            {pieData.map((item, index) => (
              <div
                key={`pie-legend-${index}`}
                className="flex items-center gap-2"
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm">
                  {item.name} ({item.value})
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bar Chart - 2/3 */}
        <div className="bg-card rounded-xl p-4 shadow-sm col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">
              Évolution des essais sur 12 mois
            </h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                key="bar-ok"
                dataKey="Fait"
                stackId="a"
                fill="#2E7D32"
                name="Fait"
              />
              <Bar
                key="bar-nok"
                dataKey="Pas_fait"
                stackId="a"
                fill="#C62828"
                name="Pas fait"
              />
              <Bar
                key="bar-reserve"
                dataKey="En_cours"
                stackId="a"
                fill="#ED6C02"
                name="En cours"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div>
        <div className="grid grid-cols-3 gap-6">
          {/* ===================== PIE / BAR WEEKLY ===================== */}
          <div className="bg-card rounded-xl p-6 shadow-sm col-span-1">
            {/* HEADER */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">
                Évolution des essais par semaine
              </h3>
            </div>

            {/* SELECTS EN LIGNE */}
            <div className="flex gap-2 mb-6">
              <select
  value={selectedMonth}
  onChange={(e) => setSelectedMonth(Number(e.target.value))}
  className="bg-card text-foreground border border-border rounded-lg px-1 py-2 w-1/2"
>
  {months.map((m) => (
    <option key={m.value} value={m.value}>
      {m.label}
    </option>
  ))}
</select>
            </div>

            {/* GRAPHIQUE */}
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Legend />

                <Bar dataKey="Fait" stackId="a" fill="#2E7D32" />
                <Bar dataKey="Pas_fait" stackId="a" fill="#C62828" />
                <Bar dataKey="En_cours" stackId="a" fill="#ED6C02" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* ===================== TECHNICIEN ===================== */}
          <div className="bg-card rounded-xl p-6 shadow-sm col-span-1">
            <h3 className="text-xl font-semibold mb-6">
              Validation technicien d'essai
            </h3>

            <select
              value={selectedTechnicien}
              onChange={(e) => setSelectedTechnicien(e.target.value)}
              className="bg-card text-foreground border border-border rounded-lg px-1 py-2 mb-6 w-full focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {techniciens.map((tech) => (
                <option key={tech} value={tech}>
                  {tech}
                </option>
              ))}
            </select>

            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={pieTeschnicienData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieTeschnicienData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="flex justify-center gap-6 mt-4">
              {pieTeschnicienData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm">
                    {item.name} ({item.value})
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ===================== CHARGE ===================== */}
          <div className="bg-card rounded-xl p-6 shadow-sm col-span-1">
            <h3 className="text-xl font-semibold mb-6">
              Validation Chargé d'essai
            </h3>

            <select
              value={selectedCharge}
              onChange={(e) => setSelectedCharge(e.target.value)}
              className="bg-card text-foreground border border-border rounded-lg px-3 py-2 mb-6 w-full focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {charges.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={pieChargeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieChargeData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="flex justify-center gap-6 mt-4">
              {pieChargeData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm">
                    {item.name} ({item.value})
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Quick Summary */}
    </div>
  );
}
