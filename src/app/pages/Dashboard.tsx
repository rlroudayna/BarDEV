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

const pieData = [
  { name: "Fait", value: 20, color: "#2E7D32" },
  { name: "Pas fait", value: 4, color: "#C62828" },
  { name: "En cours", value: 30, color: "#ED6C02" },
];
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

const barDataByClient = {
  "Tous les clients": [
    { month: "Jan", Fait: 4, Pas_fait: 4, En_cours: 3 },
    { month: "Fév", Fait: 6, Pas_fait: 3, En_cours: 4 },
    { month: "Mars", Fait: 8, Pas_fait: 4, En_cours: 6 },
    { month: "Avr", Fait: 2, Pas_fait: 2, En_cours: 4 },
    { month: "Mai", Fait: 7, Pas_fait: 3, En_cours: 5 },
    { month: "Juin", Fait: 9, Pas_fait: 2, En_cours: 3 },
    { month: "Juil", Fait: 6, Pas_fait: 4, En_cours: 4 },
    { month: "Août", Fait: 4, Pas_fait: 3, En_cours: 5 },
    { month: "Sep", Fait: 15, Pas_fait: 4, En_cours: 7 },
    { month: "Oct", Fait: 12, Pas_fait: 5, En_cours: 6 },
    { month: "Nov", Fait: 8, Pas_fait: 13, En_cours: 23 },
    { month: "Déc", Fait: 8, Pas_fait: 2, En_cours: 5 },
  ],

  Renault: [
    { month: "Jan", Fait: 2, Pas_fait: 1, En_cours: 2 },
    { month: "Fév", Fait: 3, Pas_fait: 1, En_cours: 3 },
    { month: "Mars", Fait: 5, Pas_fait: 2, En_cours: 4 },
    { month: "Avr", Fait: 1, Pas_fait: 1, En_cours: 2 },
    { month: "Mai", Fait: 4, Pas_fait: 2, En_cours: 3 },
    { month: "Juin", Fait: 6, Pas_fait: 1, En_cours: 2 },
    { month: "Juil", Fait: 6, Pas_fait: 4, En_cours: 4 },
    { month: "Août", Fait: 4, Pas_fait: 3, En_cours: 5 },
    { month: "Sep", Fait: 5, Pas_fait: 2, En_cours: 4 },
    { month: "Oct", Fait: 2, Pas_fait: 2, En_cours: 3 },
    { month: "Nov", Fait: 15, Pas_fait: 3, En_cours: 4 },
    { month: "Déc", Fait: 8, Pas_fait: 2, En_cours: 15 },
  ],

  Stellantis: [
    { month: "Jan", Fait: 1, Pas_fait: 2, En_cours: 1 },
    { month: "Fév", Fait: 2, Pas_fait: 1, En_cours: 2 },
    { month: "Mars", Fait: 3, Pas_fait: 1, En_cours: 2 },
    { month: "Avr", Fait: 1, Pas_fait: 0, En_cours: 1 },
    { month: "Mai", Fait: 2, Pas_fait: 1, En_cours: 2 },
    { month: "Juin", Fait: 2, Pas_fait: 1, En_cours: 1 },
    { month: "Juil", Fait: 6, Pas_fait: 4, En_cours: 4 },
    { month: "Août", Fait: 4, Pas_fait: 3, En_cours: 5 },
    { month: "Sep", Fait: 5, Pas_fait: 2, En_cours: 4 },
    { month: "Oct", Fait: 2, Pas_fait: 2, En_cours: 3 },
    { month: "Nov", Fait: 5, Pas_fait: 3, En_cours: 4 },
    { month: "Déc", Fait: 8, Pas_fait: 2, En_cours: 5 },
  ],

  Porsche: [
    { month: "Jan", Fait: 1, Pas_fait: 1, En_cours: 1 },
    { month: "Fév", Fait: 1, Pas_fait: 1, En_cours: 1 },
    { month: "Mars", Fait: 0, Pas_fait: 1, En_cours: 0 },
    { month: "Avr", Fait: 0, Pas_fait: 1, En_cours: 1 },
    { month: "Mai", Fait: 1, Pas_fait: 0, En_cours: 0 },
    { month: "Juin", Fait: 1, Pas_fait: 0, En_cours: 0 },
    { month: "Juil", Fait: 6, Pas_fait: 4, En_cours: 4 },
    { month: "Août", Fait: 4, Pas_fait: 3, En_cours: 5 },
    { month: "Sep", Fait: 5, Pas_fait: 2, En_cours: 4 },
    { month: "Oct", Fait: 2, Pas_fait: 2, En_cours: 3 },
    { month: "Nov", Fait: 5, Pas_fait: 3, En_cours: 4 },
    { month: "Déc", Fait: 8, Pas_fait: 2, En_cours: 5 },
  ],
};
const barData = [
  { month: "Jan", Fait: 4, Pas_fait: 4, En_cours: 3 },
  { month: "Fév", Fait: 6, Pas_fait: 3, En_cours: 4 },
  { month: "Mars", Fait: 8, Pas_fait: 4, En_cours: 6 },
  { month: "Avr", Fait: 2, Pas_fait: 2, En_cours: 4 },
  { month: "Mai", Fait: 7, Pas_fait: 3, En_cours: 5 },
  { month: "Juin", Fait: 9, Pas_fait: 2, En_cours: 3 },
  { month: "Juil", Fait: 6, Pas_fait: 4, En_cours: 4 },
  { month: "Août", Fait: 4, Pas_fait: 3, En_cours: 5 },
  { month: "Sep", Fait: 5, Pas_fait: 2, En_cours: 4 },
  { month: "Oct", Fait: 2, Pas_fait: 2, En_cours: 3 },
  { month: "Nov", Fait: 5, Pas_fait: 3, En_cours: 4 },
  { month: "Déc", Fait: 8, Pas_fait: 2, En_cours: 5 },
];
const weeklyDataByClient = {
  "Tous les clients": {
    Jan: [
      { week: "S1", Fait: 2, Pas_fait: 1, En_cours: 3 },
      { week: "S2", Fait: 4, Pas_fait: 2, En_cours: 2 },
      { week: "S3", Fait: 3, Pas_fait: 1, En_cours: 4 },
      { week: "S4", Fait: 5, Pas_fait: 2, En_cours: 3 },
    ],

    Fév: [
      { week: "S1", Fait: 3, Pas_fait: 2, En_cours: 2 },
      { week: "S2", Fait: 5, Pas_fait: 1, En_cours: 3 },
      { week: "S3", Fait: 2, Pas_fait: 1, En_cours: 4 },
      { week: "S4", Fait: 4, Pas_fait: 2, En_cours: 2 },
    ],

    Mars: [
      { week: "S1", Fait: 4, Pas_fait: 1, En_cours: 3 },
      { week: "S2", Fait: 3, Pas_fait: 2, En_cours: 2 },
      { week: "S3", Fait: 6, Pas_fait: 1, En_cours: 3 },
      { week: "S4", Fait: 5, Pas_fait: 2, En_cours: 1 },
    ],
    Avril: [
      { week: "S1", Fait: 2, Pas_fait: 1, En_cours: 3 },
      { week: "S2", Fait: 4, Pas_fait: 2, En_cours: 2 },
      { week: "S3", Fait: 3, Pas_fait: 1, En_cours: 4 },
      { week: "S4", Fait: 5, Pas_fait: 2, En_cours: 3 },
    ],

    Mai: [
      { week: "S1", Fait: 3, Pas_fait: 2, En_cours: 2 },
      { week: "S2", Fait: 5, Pas_fait: 1, En_cours: 3 },
      { week: "S3", Fait: 2, Pas_fait: 1, En_cours: 4 },
      { week: "S4", Fait: 4, Pas_fait: 2, En_cours: 2 },
    ],

    Juin: [
      { week: "S1", Fait: 4, Pas_fait: 1, En_cours: 3 },
      { week: "S2", Fait: 3, Pas_fait: 2, En_cours: 2 },
      { week: "S3", Fait: 6, Pas_fait: 1, En_cours: 3 },
      { week: "S4", Fait: 5, Pas_fait: 2, En_cours: 1 },
    ],
    Juillet: [
      { week: "S1", Fait: 2, Pas_fait: 1, En_cours: 3 },
      { week: "S2", Fait: 4, Pas_fait: 2, En_cours: 2 },
      { week: "S3", Fait: 3, Pas_fait: 1, En_cours: 4 },
      { week: "S4", Fait: 5, Pas_fait: 2, En_cours: 3 },
    ],

    Aout: [
      { week: "S1", Fait: 3, Pas_fait: 2, En_cours: 2 },
      { week: "S2", Fait: 5, Pas_fait: 1, En_cours: 3 },
      { week: "S3", Fait: 2, Pas_fait: 1, En_cours: 4 },
      { week: "S4", Fait: 4, Pas_fait: 2, En_cours: 2 },
    ],

    Septembre: [
      { week: "S1", Fait: 4, Pas_fait: 1, En_cours: 3 },
      { week: "S2", Fait: 3, Pas_fait: 2, En_cours: 2 },
      { week: "S3", Fait: 6, Pas_fait: 1, En_cours: 3 },
      { week: "S4", Fait: 5, Pas_fait: 2, En_cours: 1 },
    ],
    Octobre: [
      { week: "S1", Fait: 4, Pas_fait: 1, En_cours: 3 },
      { week: "S2", Fait: 3, Pas_fait: 2, En_cours: 2 },
      { week: "S3", Fait: 6, Pas_fait: 1, En_cours: 3 },
      { week: "S4", Fait: 5, Pas_fait: 2, En_cours: 1 },
    ],
    Novembre: [
      { week: "S1", Fait: 4, Pas_fait: 1, En_cours: 3 },
      { week: "S2", Fait: 3, Pas_fait: 2, En_cours: 2 },
      { week: "S3", Fait: 6, Pas_fait: 1, En_cours: 3 },
      { week: "S4", Fait: 5, Pas_fait: 2, En_cours: 1 },
    ],
    Decembre: [
      { week: "S1", Fait: 4, Pas_fait: 1, En_cours: 3 },
      { week: "S2", Fait: 3, Pas_fait: 2, En_cours: 2 },
      { week: "S3", Fait: 6, Pas_fait: 1, En_cours: 3 },
      { week: "S4", Fait: 5, Pas_fait: 2, En_cours: 1 },
    ],
  },
  Porshe: {
    Jan: [
      { week: "S1", Fait: 2, Pas_fait: 1, En_cours: 3 },
      { week: "S2", Fait: 4, Pas_fait: 2, En_cours: 2 },
      { week: "S3", Fait: 3, Pas_fait: 1, En_cours: 4 },
      { week: "S4", Fait: 5, Pas_fait: 2, En_cours: 3 },
    ],

    Fév: [
      { week: "S1", Fait: 3, Pas_fait: 2, En_cours: 2 },
      { week: "S2", Fait: 5, Pas_fait: 1, En_cours: 3 },
      { week: "S3", Fait: 2, Pas_fait: 1, En_cours: 4 },
      { week: "S4", Fait: 4, Pas_fait: 2, En_cours: 2 },
    ],

    Mars: [
      { week: "S1", Fait: 4, Pas_fait: 1, En_cours: 3 },
      { week: "S2", Fait: 3, Pas_fait: 2, En_cours: 2 },
      { week: "S3", Fait: 6, Pas_fait: 1, En_cours: 3 },
      { week: "S4", Fait: 5, Pas_fait: 2, En_cours: 1 },
    ],
    Avril: [
      { week: "S1", Fait: 2, Pas_fait: 1, En_cours: 3 },
      { week: "S2", Fait: 4, Pas_fait: 2, En_cours: 2 },
      { week: "S3", Fait: 3, Pas_fait: 1, En_cours: 4 },
      { week: "S4", Fait: 5, Pas_fait: 2, En_cours: 3 },
    ],

    Mai: [
      { week: "S1", Fait: 3, Pas_fait: 2, En_cours: 2 },
      { week: "S2", Fait: 5, Pas_fait: 1, En_cours: 3 },
      { week: "S3", Fait: 2, Pas_fait: 1, En_cours: 4 },
      { week: "S4", Fait: 4, Pas_fait: 2, En_cours: 2 },
    ],

    Juin: [
      { week: "S1", Fait: 4, Pas_fait: 1, En_cours: 3 },
      { week: "S2", Fait: 3, Pas_fait: 2, En_cours: 2 },
      { week: "S3", Fait: 6, Pas_fait: 1, En_cours: 3 },
      { week: "S4", Fait: 5, Pas_fait: 2, En_cours: 1 },
    ],
    Juillet: [
      { week: "S1", Fait: 2, Pas_fait: 1, En_cours: 3 },
      { week: "S2", Fait: 4, Pas_fait: 2, En_cours: 2 },
      { week: "S3", Fait: 3, Pas_fait: 1, En_cours: 4 },
      { week: "S4", Fait: 5, Pas_fait: 2, En_cours: 3 },
    ],

    Aout: [
      { week: "S1", Fait: 3, Pas_fait: 2, En_cours: 2 },
      { week: "S2", Fait: 5, Pas_fait: 1, En_cours: 3 },
      { week: "S3", Fait: 2, Pas_fait: 1, En_cours: 4 },
      { week: "S4", Fait: 4, Pas_fait: 2, En_cours: 2 },
    ],

    Septembre: [
      { week: "S1", Fait: 4, Pas_fait: 1, En_cours: 3 },
      { week: "S2", Fait: 3, Pas_fait: 2, En_cours: 2 },
      { week: "S3", Fait: 6, Pas_fait: 1, En_cours: 3 },
      { week: "S4", Fait: 5, Pas_fait: 2, En_cours: 1 },
    ],
    Octobre: [
      { week: "S1", Fait: 4, Pas_fait: 1, En_cours: 3 },
      { week: "S2", Fait: 3, Pas_fait: 2, En_cours: 2 },
      { week: "S3", Fait: 6, Pas_fait: 1, En_cours: 3 },
      { week: "S4", Fait: 5, Pas_fait: 2, En_cours: 1 },
    ],
    Novembre: [
      { week: "S1", Fait: 4, Pas_fait: 1, En_cours: 3 },
      { week: "S2", Fait: 3, Pas_fait: 2, En_cours: 2 },
      { week: "S3", Fait: 6, Pas_fait: 1, En_cours: 3 },
      { week: "S4", Fait: 5, Pas_fait: 2, En_cours: 1 },
    ],
    Decembre: [
      { week: "S1", Fait: 4, Pas_fait: 1, En_cours: 3 },
      { week: "S2", Fait: 3, Pas_fait: 2, En_cours: 2 },
      { week: "S3", Fait: 6, Pas_fait: 1, En_cours: 3 },
      { week: "S4", Fait: 5, Pas_fait: 2, En_cours: 1 },
    ],
  },
  Stellantis: {
    Jan: [
      { week: "S1", Fait: 2, Pas_fait: 1, En_cours: 3 },
      { week: "S2", Fait: 4, Pas_fait: 2, En_cours: 2 },
      { week: "S3", Fait: 3, Pas_fait: 1, En_cours: 4 },
      { week: "S4", Fait: 5, Pas_fait: 2, En_cours: 3 },
    ],

    Fév: [
      { week: "S1", Fait: 3, Pas_fait: 2, En_cours: 2 },
      { week: "S2", Fait: 5, Pas_fait: 1, En_cours: 3 },
      { week: "S3", Fait: 2, Pas_fait: 1, En_cours: 4 },
      { week: "S4", Fait: 4, Pas_fait: 2, En_cours: 2 },
    ],

    Mars: [
      { week: "S1", Fait: 4, Pas_fait: 1, En_cours: 3 },
      { week: "S2", Fait: 3, Pas_fait: 2, En_cours: 2 },
      { week: "S3", Fait: 6, Pas_fait: 1, En_cours: 3 },
      { week: "S4", Fait: 5, Pas_fait: 2, En_cours: 1 },
    ],
    Avril: [
      { week: "S1", Fait: 2, Pas_fait: 1, En_cours: 3 },
      { week: "S2", Fait: 4, Pas_fait: 2, En_cours: 2 },
      { week: "S3", Fait: 3, Pas_fait: 1, En_cours: 4 },
      { week: "S4", Fait: 5, Pas_fait: 2, En_cours: 3 },
    ],

    Mai: [
      { week: "S1", Fait: 3, Pas_fait: 2, En_cours: 2 },
      { week: "S2", Fait: 5, Pas_fait: 1, En_cours: 3 },
      { week: "S3", Fait: 2, Pas_fait: 1, En_cours: 4 },
      { week: "S4", Fait: 4, Pas_fait: 2, En_cours: 2 },
    ],

    Juin: [
      { week: "S1", Fait: 4, Pas_fait: 1, En_cours: 3 },
      { week: "S2", Fait: 3, Pas_fait: 2, En_cours: 2 },
      { week: "S3", Fait: 6, Pas_fait: 1, En_cours: 3 },
      { week: "S4", Fait: 5, Pas_fait: 2, En_cours: 1 },
    ],
    Juillet: [
      { week: "S1", Fait: 2, Pas_fait: 1, En_cours: 3 },
      { week: "S2", Fait: 4, Pas_fait: 2, En_cours: 2 },
      { week: "S3", Fait: 3, Pas_fait: 1, En_cours: 4 },
      { week: "S4", Fait: 5, Pas_fait: 2, En_cours: 3 },
    ],

    Aout: [
      { week: "S1", Fait: 3, Pas_fait: 2, En_cours: 2 },
      { week: "S2", Fait: 5, Pas_fait: 1, En_cours: 3 },
      { week: "S3", Fait: 2, Pas_fait: 1, En_cours: 4 },
      { week: "S4", Fait: 4, Pas_fait: 2, En_cours: 2 },
    ],

    Septembre: [
      { week: "S1", Fait: 4, Pas_fait: 1, En_cours: 3 },
      { week: "S2", Fait: 3, Pas_fait: 2, En_cours: 2 },
      { week: "S3", Fait: 6, Pas_fait: 1, En_cours: 3 },
      { week: "S4", Fait: 5, Pas_fait: 2, En_cours: 1 },
    ],
    Octobre: [
      { week: "S1", Fait: 4, Pas_fait: 1, En_cours: 3 },
      { week: "S2", Fait: 3, Pas_fait: 2, En_cours: 2 },
      { week: "S3", Fait: 6, Pas_fait: 1, En_cours: 3 },
      { week: "S4", Fait: 5, Pas_fait: 2, En_cours: 1 },
    ],
    Novembre: [
      { week: "S1", Fait: 4, Pas_fait: 1, En_cours: 3 },
      { week: "S2", Fait: 3, Pas_fait: 2, En_cours: 2 },
      { week: "S3", Fait: 6, Pas_fait: 1, En_cours: 3 },
      { week: "S4", Fait: 5, Pas_fait: 2, En_cours: 1 },
    ],
    Decembre: [
      { week: "S1", Fait: 4, Pas_fait: 1, En_cours: 3 },
      { week: "S2", Fait: 3, Pas_fait: 2, En_cours: 2 },
      { week: "S3", Fait: 6, Pas_fait: 1, En_cours: 3 },
      { week: "S4", Fait: 5, Pas_fait: 2, En_cours: 1 },
    ],
  },
  " Renault": {
    Jan: [
      { week: "S1", Fait: 2, Pas_fait: 1, En_cours: 3 },
      { week: "S2", Fait: 4, Pas_fait: 2, En_cours: 2 },
      { week: "S3", Fait: 3, Pas_fait: 1, En_cours: 4 },
      { week: "S4", Fait: 5, Pas_fait: 2, En_cours: 3 },
    ],

    Fév: [
      { week: "S1", Fait: 3, Pas_fait: 2, En_cours: 2 },
      { week: "S2", Fait: 5, Pas_fait: 1, En_cours: 3 },
      { week: "S3", Fait: 2, Pas_fait: 1, En_cours: 4 },
      { week: "S4", Fait: 4, Pas_fait: 2, En_cours: 2 },
    ],

    Mars: [
      { week: "S1", Fait: 4, Pas_fait: 1, En_cours: 3 },
      { week: "S2", Fait: 3, Pas_fait: 2, En_cours: 2 },
      { week: "S3", Fait: 6, Pas_fait: 1, En_cours: 3 },
      { week: "S4", Fait: 5, Pas_fait: 2, En_cours: 1 },
    ],
    Avril: [
      { week: "S1", Fait: 2, Pas_fait: 1, En_cours: 3 },
      { week: "S2", Fait: 4, Pas_fait: 2, En_cours: 2 },
      { week: "S3", Fait: 3, Pas_fait: 1, En_cours: 4 },
      { week: "S4", Fait: 5, Pas_fait: 2, En_cours: 3 },
    ],

    Mai: [
      { week: "S1", Fait: 3, Pas_fait: 2, En_cours: 2 },
      { week: "S2", Fait: 5, Pas_fait: 1, En_cours: 3 },
      { week: "S3", Fait: 2, Pas_fait: 1, En_cours: 4 },
      { week: "S4", Fait: 4, Pas_fait: 2, En_cours: 2 },
    ],

    Juin: [
      { week: "S1", Fait: 4, Pas_fait: 1, En_cours: 3 },
      { week: "S2", Fait: 3, Pas_fait: 2, En_cours: 2 },
      { week: "S3", Fait: 6, Pas_fait: 1, En_cours: 3 },
      { week: "S4", Fait: 5, Pas_fait: 2, En_cours: 1 },
    ],
    Juillet: [
      { week: "S1", Fait: 2, Pas_fait: 1, En_cours: 3 },
      { week: "S2", Fait: 4, Pas_fait: 2, En_cours: 2 },
      { week: "S3", Fait: 3, Pas_fait: 1, En_cours: 4 },
      { week: "S4", Fait: 5, Pas_fait: 2, En_cours: 3 },
    ],

    Aout: [
      { week: "S1", Fait: 3, Pas_fait: 2, En_cours: 2 },
      { week: "S2", Fait: 5, Pas_fait: 1, En_cours: 3 },
      { week: "S3", Fait: 2, Pas_fait: 1, En_cours: 4 },
      { week: "S4", Fait: 4, Pas_fait: 2, En_cours: 2 },
    ],

    Septembre: [
      { week: "S1", Fait: 4, Pas_fait: 1, En_cours: 3 },
      { week: "S2", Fait: 3, Pas_fait: 2, En_cours: 2 },
      { week: "S3", Fait: 6, Pas_fait: 1, En_cours: 3 },
      { week: "S4", Fait: 5, Pas_fait: 2, En_cours: 1 },
    ],
    Octobre: [
      { week: "S1", Fait: 4, Pas_fait: 1, En_cours: 3 },
      { week: "S2", Fait: 3, Pas_fait: 2, En_cours: 2 },
      { week: "S3", Fait: 6, Pas_fait: 1, En_cours: 3 },
      { week: "S4", Fait: 5, Pas_fait: 2, En_cours: 1 },
    ],
    Novembre: [
      { week: "S1", Fait: 4, Pas_fait: 1, En_cours: 3 },
      { week: "S2", Fait: 3, Pas_fait: 2, En_cours: 2 },
      { week: "S3", Fait: 6, Pas_fait: 1, En_cours: 3 },
      { week: "S4", Fait: 5, Pas_fait: 2, En_cours: 1 },
    ],
    Decembre: [
      { week: "S1", Fait: 4, Pas_fait: 1, En_cours: 3 },
      { week: "S2", Fait: 3, Pas_fait: 2, En_cours: 2 },
      { week: "S3", Fait: 6, Pas_fait: 1, En_cours: 3 },
      { week: "S4", Fait: 5, Pas_fait: 2, En_cours: 1 },
    ],
  },
};
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
const technicienValidationData = {
  "Tous les techniciens": [
    { name: "OK", value: 12, color: "#2E7D32" },
    { name: "NOK", value: 6, color: "#C62828" },
    { name: "Sous réserve", value: 16, color: "#ED6C02" },
  ],

  "Technicien 1": [
    { name: "OK", value: 8, color: "#2E7D32" },
    { name: "NOK", value: 3, color: "#C62828" },
    { name: "Sous réserve", value: 5, color: "#ED6C02" },
  ],

  "Technicien 2": [
    { name: "OK", value: 10, color: "#2E7D32" },
    { name: "NOK", value: 4, color: "#C62828" },
    { name: "Sous réserve", value: 6, color: "#ED6C02" },
  ],

  "Technicien 3": [
    { name: "OK", value: 6, color: "#2E7D32" },
    { name: "NOK", value: 5, color: "#C62828" },
    { name: "Sous réserve", value: 7, color: "#ED6C02" },
  ],

  "Technicien 4": [
    { name: "OK", value: 12, color: "#2E7D32" },
    { name: "NOK", value: 2, color: "#C62828" },
    { name: "Sous réserve", value: 4, color: "#ED6C02" },
  ],
};
const clients = ["Tous les clients", "Renault", "Stellantis", "Porsche"];
const pieDataByClient = {
  "Tous les clients": [
    { name: "Fait", value: 20, color: "#2E7D32" },
    { name: "Pas fait", value: 4, color: "#C62828" },
    { name: "En cours", value: 30, color: "#ED6C02" },
  ],

  Renault: [
    { name: "Fait", value: 10, color: "#2E7D32" },
    { name: "Pas fait", value: 2, color: "#C62828" },
    { name: "En cours", value: 12, color: "#ED6C02" },
  ],

  Stellantis: [
    { name: "Fait", value: 6, color: "#2E7D32" },
    { name: "Pas fait", value: 1, color: "#C62828" },
    { name: "En cours", value: 10, color: "#ED6C02" },
  ],

  Porsche: [
    { name: "Fait", value: 4, color: "#2E7D32" },
    { name: "Pas fait", value: 1, color: "#C62828" },
    { name: "En cours", value: 8, color: "#ED6C02" },
  ],
};
const groupedValidationData = [
  {
    month: "Jan",
    OK: 10,
    NOK: 4,
    SousReserve: 1,
    type: "charge",
  },
  {
    month: "Jan",
    OK: 12,
    NOK: 2,
    SousReserve: 1,
    type: "tech",
  },
  {
    month: "Fév",
    OK: 12,
    NOK: 3,
    SousReserve: 3,
    type: "charge",
  },
  {
    month: "Fév",
    OK: 15,
    NOK: 1,
    SousReserve: 2,
    type: "tech",
  },
  {
    month: "Mar",
    OK: 8,
    NOK: 6,
    SousReserve: 3,
    type: "charge",
  },
  {
    month: "Mar",
    OK: 10,
    NOK: 4,
    SousReserve: 3,
    type: "tech",
  },
  {
    month: "Avr",
    OK: 16,
    NOK: 1,
    SousReserve: 2,
    type: "charge",
  },
  {
    month: "Avr",
    OK: 18,
    NOK: 0,
    SousReserve: 1,
    type: "tech",
  },
  {
    month: "Mai",
    OK: 13,
    NOK: 3,
    SousReserve: 2,
    type: "charge",
  },
  {
    month: "Mai",
    OK: 14,
    NOK: 2,
    SousReserve: 2,
    type: "tech",
  },
  {
    month: "Juin",
    OK: 18,
    NOK: 2,
    SousReserve: 1,
    type: "charge",
  },
  {
    month: "Juin",
    OK: 20,
    NOK: 1,
    SousReserve: 0,
    type: "tech",
  },
];
const chargeValidationData = {
  "Tous les chargés d'essai": [
    { name: "OK", value: 8, color: "#2E7D32" },
    { name: "NOK", value: 24, color: "#C62828" },
    { name: "Sous réserve", value: 6, color: "#ED6C02" },
  ],

  "Chargé 1": [
    { name: "OK", value: 8, color: "#2E7D32" },
    { name: "NOK", value: 3, color: "#C62828" },
    { name: "Sous réserve", value: 4, color: "#ED6C02" },
  ],

  "Chargé 2": [
    { name: "OK", value: 12, color: "#2E7D32" },
    { name: "NOK", value: 2, color: "#C62828" },
    { name: "Sous réserve", value: 5, color: "#ED6C02" },
  ],

  "Chargé 3": [
    { name: "OK", value: 6, color: "#2E7D32" },
    { name: "NOK", value: 4, color: "#C62828" },
    { name: "Sous réserve", value: 3, color: "#ED6C02" },
  ],
};

export function Dashboard() {
  const [selectedMonth, setSelectedMonth] = useState("Jan");
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
  const pieData = pieDataByClient[selectedClient] || [];
  const pieChargeData = chargeValidationData[selectedCharge] || [];
  const barData = barDataByClient[selectedClient] || [];
  const pieTeschnicienData = technicienValidationData[selectedTechnicien] || [];
  const weeklyData =
    (weeklyDataByClient[selectedClient] &&
      weeklyDataByClient[selectedClient][selectedMonth]) ||
    [];

  useEffect(() => {
    const fetchVehiculeCount = async () => {
      try {
        const data = await authFetch("/vehicules/count"); // endpoint côté backend
        setVehiculeCount(data);
      } catch (err) {
        console.error("Erreur fetch du nombre de véhicules :", err);
      }
    };
    fetchVehiculeCount();
  }, []);

  useEffect(() => {
    const fetchLoiCount = async () => {
      try {
        const data = await authFetch("/lois-route/count"); // endpoint côté backend
        setLoiRouteCount(data);
      } catch (err) {
        console.error("Erreur fetch du nombre de loi :", err);
      }
    };
    fetchLoiCount();
  }, []);

  useEffect(() => {
    const fetchCalageCount = async () => {
      try {
        const data = await authFetch("/calages/count"); // endpoint côté backend
        setCalageCount(data);
      } catch (err) {
        console.error("Erreur fetch du nombre de calage :", err);
      }
    };
    fetchCalageCount();
  }, []);

  useEffect(() => {
    const fetchCycleCount = async () => {
      try {
        const data = await authFetch("/cycles/count"); // endpoint côté backend
        setCycleCount(data);
      } catch (err) {
        console.error("Erreur fetch du nombre de cycle :", err);
      }
    };
    fetchCycleCount();
  }, []);

  useEffect(() => {
  const fetchTotalEssais = async () => {
    try {
      const data = await authFetch("/demandes-essai/countTotal");
      setTotalEssais(data);
    } catch (err) {
      console.error("Erreur fetch total essais :", err);
    }
  };

  fetchTotalEssais();
}, []);

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
  ];

  return (
    <div className="space-y-5 p-3">
      <div>
        <h1 className="text-3xl font-semibold text-black mb-2">Dashboard</h1>
        <p className="text-gray-600">Vue d'ensemble de l'activité</p>
      </div>
      {/* Inventory Cards - version Quick Summary style */}
      {/* Inventory Cards - Icône + nombre sur la même ligne */}
      <div className="flex gap-6">
        {inventoryCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={`inventory-${card.subtitle || index}`}
              className="bg-white rounded-xl p-5 shadow-sm flex flex-col items-start gap-3 flex-1 hover:shadow-md transition-shadow"
            >
              {/* Ligne Icône + Nombre */}
              <div className="flex items-center gap-3 w-full">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: card.bgColor }}
                >
                  <Icon className="w-7 h-7" style={{ color: card.color }} />
                </div>
                <div className="text-3xl font-semibold text-black">
                  {card.value}
                </div>
              </div>

              {/* Texte sur la ligne suivante */}
              <div className="w-full">
                <div className="text-gray-600">{card.subtitle}</div>
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
        <div className="bg-white rounded-xl p-6 shadow-sm col-span-1">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold">Répartition des essais</h3>
          </div>
          <select
            value={selectedClient}
            onChange={(e) => setSelectedClient(e.target.value)}
            className="border rounded-lg px-3 py-2"
          >
            {clients.map((client) => (
              <option key={client} value={client}>
                {client}
              </option>
            ))}
          </select>

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
        <div className="bg-white rounded-xl p-4 shadow-sm col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">
              Évolution des essais sur 12 mois
            </h3>

            <select
              value={selectedClient}
              onChange={(e) => setSelectedClient(e.target.value)}
              className="border rounded-lg px-3 py-2"
            >
              {clients.map((client) => (
                <option key={client} value={client}>
                  {client}
                </option>
              ))}
            </select>
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
          <div className="bg-white rounded-xl p-6 shadow-sm col-span-1">
            {/* HEADER */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">
                Évolution des essais par semaine
              </h3>
            </div>

            {/* SELECTS EN LIGNE */}
            <div className="flex gap-2 mb-6">
              <select
                value={selectedClient}
                onChange={(e) => setSelectedClient(e.target.value)}
                className="border rounded-lg px-1 py-2 w-1/2"
              >
                {clients.map((client) => (
                  <option key={client} value={client}>
                    {client}
                  </option>
                ))}
              </select>

              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="border rounded-lg px-1 py-2 w-1/2"
              >
                {Object.keys(weeklyDataByClient[selectedClient] || {}).map(
                  (month) => (
                    <option key={month} value={month}>
                      {month}
                    </option>
                  ),
                )}
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
          <div className="bg-white rounded-xl p-6 shadow-sm col-span-1">
            <h3 className="text-xl font-semibold mb-6">
              Validation technicien d'essai
            </h3>

            <select
              value={selectedTechnicien}
              onChange={(e) => setSelectedTechnicien(e.target.value)}
              className="border rounded-lg px-1 py-2 mb-6 w-full"
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
          <div className="bg-white rounded-xl p-6 shadow-sm col-span-1">
            <h3 className="text-xl font-semibold mb-6">
              Validation Chargé d'essai
            </h3>

            <select
              value={selectedCharge}
              onChange={(e) => setSelectedCharge(e.target.value)}
              className="border rounded-lg px-3 py-2 mb-6 w-full"
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

      <div className="flex gap-9">
        <div className="bg-white rounded-xl p-6 shadow-sm flex items-center gap-4 flex-1">
          <div className="w-12 h-12 bg-[#E8F5E9] rounded-full flex items-center justify-center">
            <ClipboardCheck className="w-6 h-6 text-[#2E7D32]" />
          </div>
          <div>
            <div className="text-2xl font-semibold">{totalEssais}</div>
            <div className="text-gray-600">Nombre total des essais</div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm flex items-center gap-4 flex-1">
          <div className="w-12 h-12 bg-[#E3F2FD] rounded-full flex items-center justify-center">
            <Calendar className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <div className="text-2xl font-semibold">3</div>
            <div className="text-gray-600">
              Nombre d'essais planifiés aujourd'hui{" "}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm flex items-center gap-4 flex-1">
          <div className="w-12 h-12 bg-[#E8F5E9] rounded-full flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-[#2E7D32]" />
          </div>
          <div>
            <div className="text-2xl font-semibold">5</div>
            <div className="text-gray-600">Essais à valider</div>
          </div>
        </div>
      </div>
    </div>
  );
}
