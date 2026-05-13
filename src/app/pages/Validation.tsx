import { useMemo, useState, useEffect } from "react";
import { Link } from "react-router";
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  User,
  UserCog,
  Eye,
  Plus,
  Search,
} from "lucide-react";
import { authFetch } from "../api";

import { toast } from "sonner";

import { Menu, MenuItem, MenuButton, MenuItems } from "@headlessui/react";
import { MoreVertical } from "lucide-react";
import { Cycles } from "./Cycles";

export enum DecisionValidation {
  OK = "OK",
  NOK = "NOK",
  OK_SOUS_RESERVE = "OK_SOUS_RESERVE",
}
export enum Client {
  RENAULT = "RENAULT",
  STELLANTIS = "STELLANTIS",
  FEV = "FEV",
}
interface Vehicule {
  id: number;
  nomAppliImmat?: string;
  identificateur?: string;
  nomAuto?: string;
  codeInterne?: string;
}
// AVANT le composant — avec MesureKey, Vehicule, DemandeEssai
interface Cycle {
  id: number;
  nom?: string;
  famille?: string;
}

interface Calage {
  id: number;
  nom?: string;
  temperature?: number;
}

interface LoiRoute {
  id: number;
  nom?: string;
  testMass?: number;
  f0?: number;
  f1?: number;
  f2?: number;
}
interface ValidationTechnicien {
  id: number;
  decision?: DecisionValidation;
}
interface ValidationCharge {
  id?: number;
  validation?: DecisionValidation;
}
interface DemandeEssai {
  // =====================
  // IDENTITÉ
  // =====================
  id?: number;
  nomAuto?: string;
  numerProjet?: number;

  statutGlobal?: "EN_COURS" | "FAIT" | "REJETEE";
  statutDemande?: "EN_CREATION" | "VALIDEE";

  // =====================
  // RELATIONS (BACKEND)
  // =====================
  vehicule?: { id: number };
  cycle?: { id: number };
  calage?: { id: number };

  // =====================
  // PROJET
  // =====================
  typeProjet?: string;
  client?: "RENAULT" | "STELLANTIS" | "FEV";

  demandeur?: string;
  technicien?: string;

  banc?: string;
  datePlanification?: string;
  shift?: "MATIN" | "SOIR" | "NUIT";

  // =====================
  // CONDITIONS ESSAI
  // =====================
  besoinMaceration?: boolean;
  temperatureMaceration?: number;
  temperatureEau?: number;
  hygrometrieEssai?: number;
  activationSTT?: boolean;
  temperatureEssai?: number;

  // =====================
  // BATTERIE / CLIM
  // =====================
  gestionBatterie12V?: string;
  socDepart12V?: number;

  activationClim?: boolean;
  temperatureRegulationClim?: number;
  chauffageHabitable?: boolean;

  // =====================
  // TYPE ESSAI
  // =====================
  typeEssai?: string;
  verificationCoastDown?: boolean;
  nombreDecelerations?: number;
  commentaire?: string;

  // =====================
  // SAC / DÉBITS
  // =====================
  mesureSAC?: boolean;
  debitCVsPhase1?: number;
  debitCVsPhase2?: number;
  debitCVsPhase3?: number;
  debitCVsPhase4?: number;
  debitCVsPhase5?: number;
  debitCVsPhase6?: number;
  debitCVsPhase7?: number;
  debitCVsPhase8?: number;
  debitCVsPhase9?: number;
  debitCVsPhase10?: number;

  // =====================
  // PM / PN
  // =====================
  pm?: boolean;
  debitPrelevement?: number;

  pn10Nano?: boolean;
  facteurDilutionPN10?: number;

  pn23Nano?: boolean;
  facteurDilutionPN23?: number;

  // =====================
  // GAZ BRUTS
  // =====================
  ligne1?: boolean;
  pointPrelevementL1?: string;

  ligne2?: boolean;
  pointPrelevementL2?: string;

  ligne3?: boolean;
  pointPrelevementL3?: string;

  microsot?: boolean;
  pointPrelevementMicrosot?: string;

  qcl1?: boolean;
  pointPrelevementQCL1?: string;

  qcl2?: boolean;
  pointPrelevementQCL2?: string;

  FITR?: boolean;
  pointPrelevementFITR?: string;

  egr?: boolean;

  // =====================
  // XCU
  // =====================
  xcu1?: boolean;
  software1?: string;
  calibration1?: string;
  experiment1?: string;

  xcu2?: boolean;
  software2?: string;
  calibration2?: string;

  xcu3?: boolean;
  software3?: string;
  calibration3?: string;

  acquisitionEOBD?: boolean;
  typeAcquisition?: string;

  // =====================
  // MESURE COURANT
  // =====================
  mesureCourant?: boolean;
  indiceCourant?: number;
  numeroTermocoupleCourant?: number;
  typeMesureCourant?: number;

  // =====================
  // CONFIG BANC
  // =====================
  capot?: "OUVERT" | "FERME";
  soufflante?: string;
  qCvs?: number;
  carflow?: boolean;

  // =====================
  // MESURE TENSION
  // =====================
  mesureTension?: boolean;
  indiceTension?: number;
  numeroTermocoupleTension?: number;
  typeMesureTension?: string;

  // =====================
  // THERMOCOUPLES
  // =====================
  thermocouples?: boolean;
  indicethermocouples?: number;
  numeroTermocouple?: number;
  typeMesurethermocouples?: string;

  // =====================
  // SONDE LAMBDA
  // =====================
  sondeLambdaLA4?: boolean;
  indicesondeLambdaLA4?: number;
  numerosondeLambdaLA4?: number;
  typeMesuresondeLambdaLA4?: string;
}

// Données structurées pour permettre le calcul dynamique

// Fonction utilitaire pour calculer le statut global (Cahier des charges Screenshot 105702)
const getGlobalStatus = (validationTech?: any, validationCharge?: any) => {
  const techExists = !!validationTech;
  const chargeExists = !!validationCharge;

  if (techExists && chargeExists) return "FAIT";
  if (techExists || chargeExists) return "EN_COURS";
  return "PAS_FAIT";
};
// Fonction pour le style des badges
const getStatusStyle = (status?: string) => {
  switch (status) {
    case "FAIT":
      return "bg-[#E8F5E9] text-[#2E7D32]";
    case "EN_COURS":
      return "bg-[#FFF9C4] text-[#FBC02D]";
    case "PAS_FAIT":
      return "bg-[#FFEBEE] text-[#C62828]";
    default:
      return "bg-gray-100 text-muted-foreground-600";
  }
};
const getValidationStyle = (status?: string) => {
  switch (status) {
    case "OK":
      return "bg-[#E8F5E9] text-[#2E7D32]";
    case "NOK":
      return "bg-[#FFF9C4] text-[#FBC02D]";
    case "OK_SOUS_RESERVE":
      return "bg-[#FFEBEE] text-[#C62828]";
    default:
      return "bg-gray-100 text-muted-foreground-600";
  }
};

export function Validation() {
  const [demandes, setDemandes] = useState<DemandeEssai[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [filterDate, setFilterDate] = useState("");
  const [filterProjet, setFilterProjet] = useState("");
  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [client, setClient] = useState("");
  const [vehicules, setVehicules] = useState<any[]>([]);
  const [filterVehicule, setFilterVehicule] = useState("Tous");
  const [filterCycle, setFilterCycle] = useState("Tous");

  const [clientFilter, setClientFilter] = useState("Tous");

  const clients = ["Renault", "Stellantis", "Peugeot", "Toyota"];

  const filteredData = useMemo(() => {
    const safeData = Array.isArray(demandes) ? demandes : [];

    return safeData.filter((row) => {
      const matchesSearch =
        !search ||
        (row.nomAuto ?? "").toLowerCase().includes(search.toLowerCase()) ||
        (row.technicien ?? "").toLowerCase().includes(search.toLowerCase());

      const matchesVehicule =
        filterVehicule === "Tous" ||
        String(row.vehicule?.id ?? row.vehicule) === filterVehicule;
      const matchesCycle =
        !filterCycle || filterCycle === "Tous"
          ? true
          : row.cycle?.id?.toString() === filterCycle;

      const matchesProjet = !filterProjet
        ? true
        : (row.numerProjet ?? row.numerProjet)
            ?.toString()
            .includes(filterProjet);

      const matchesClient =
        clientFilter === "Tous" ? true : row.client === clientFilter;

      const matchesDate = !filterDate
        ? true
        : row.datePlanification?.split("T")[0] === filterDate;

      return (
        matchesSearch &&
        matchesVehicule &&
        matchesCycle &&
        matchesProjet &&
        matchesClient &&
        matchesDate
      );
    });
  }, [
    demandes,
    search,
    filterVehicule,
    filterCycle,
    filterProjet,
    filterDate,
    clientFilter,
  ]);

  const fetchDemandes = async () => {
    try {
      setLoading(true);

      const res = await authFetch("/demandes-essai");

      const data = res?.data ?? res?.content ?? res?._embedded?.demandes ?? res;

      setDemandes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erreur chargement demandes", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchVehicules = async () => {
    try {
      const data = await authFetch("/vehicules");
      setVehicules(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    }
  };
  useEffect(() => {
    fetchDemandes();
    fetchVehicules();
    fetchCycles();
    fetchCurrentUser();
  }, []);

  const fetchCycles = async () => {
    try {
      const data = await authFetch("/cycles");
      setCycles(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    }
  };
  const fetchCurrentUser = async () => {
    try {
      const user = await authFetch("/users/me");
      setCurrentUser(user);
    } catch (error) {
      console.error("Erreur récupération utilisateur", error);
    }
  };
  return (
    <>
      <div className="p-3 space-y-5 bg-gray-10 min-h-screen">
        <div className="flex items-center justify-between">
          {/* Titre + description */}
          <div>
            <h1 className="text-3xl font-semibold text-foreground">
              Gestion des validations
            </h1>
            <p className="text-muted-foreground-600">Valider vos essais</p>
          </div>
        </div>

        <div className="p-5 bg-card rounded-xl border border-gray-250 shadow-sm flex items-center gap-4">
          <div className="flex flex-wrap gap-4 items-center">
            {/* Recherche */}
            <div className="relative flex-1 min-w-[220px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground-400" />
              <input
                type="text"
                placeholder="Rechercher par nom de demande..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-12 pl-14 pr-3 bg-background text-foreground border border-border rounded-lg shadow-sm text-sm outline-none focus:ring-2 focus:ring-muted transition"
              />
            </div>

            {/* Filtre client */}
            {/*<select
className="w-full sm:w-48 h-12 px-4 bg-background text-foreground border border-border rounded-lg shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-muted transition"              value={clientFilter}
              onChange={(e) => setClientFilter(e.target.value)}
            >
              <option value="Tous">Client (Tous)</option>
              <option value="RENAULT">RENAULT</option>
              <option value="STELLANTIS">STELLANTIS</option>
              <option value="FEV">FEV</option>
            </select>*/}

            {/* Filtre véhicule (CORRIGÉ) */}
            <select
              value={filterVehicule}
              onChange={(e) => setFilterVehicule(e.target.value)}
              className="w-full sm:w-48 h-12 px-4 bg-background text-foreground border border-border rounded-lg shadow-sm text-sm outline-none focus:ring-2 focus:ring-muted transition"
            >
              <option value="Tous">Tous les véhicules</option>

              {vehicules.map((v) => (
                <option key={v.id} value={v.id.toString()}>
                  {v.identificateur}
                </option>
              ))}
            </select>

            {/* Filtre N° projet */}
            <input
              type="text"
              placeholder="N° de projet"
              value={filterProjet}
              onChange={(e) => setFilterProjet(e.target.value)}
              className="w-full sm:w-48 h-12 px-4 bg-background text-foreground border border-border rounded-lg shadow-sm text-sm outline-none focus:ring-2 focus:ring-muted transition"
            />

            {/* Filtre date */}
            <div className="relative w-full sm:w-48">
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
className="w-full h-12 px-4 pr-10 bg-background text-foreground border border-border rounded-lg shadow-sm text-sm outline-none focus:ring-2 focus:ring-muted transition"              />

              {filterDate && (
                <button
                  type="button"
                  onClick={() => setFilterDate("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground-400 hover:text-red-500"
                  title="Réinitialiser la date"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-gray-300 shadow-sm overflow-x-auto">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-sm text-left border-collapse">
              {/* Header */}
              <thead className="bg-[#E30613] border-b border-gray-400">
                <tr>
                  <th className="px-5 py-4 font-semibold text-white">
                    Demande d'essai
                  </th>
                  <th className="px-3 py-4 font-semibold text-white">Date</th>
                  <th className="px-4 py-4 font-semibold text-white">
                    N°_Projet
                  </th>
                  <th className="px-8 py-4 font-semibold text-white">Client</th>
                  <th className="px-4 py-4 font-semibold text-white">
                    Véhicule
                  </th>
                  {/* <th className="px-4 py-4 font-semibold text-white">Cycle</th>*/}
                  <th className="px-2 py-4 font-semibold text-white">
                    Validation Technicien
                  </th>
                  <th className="px-2 py-4 font-semibold text-white">
                    Validation Chargé
                  </th>
                  <th className="px-3 py-4 font-semibold text-white">
                    Statut Global
                  </th>
                  <th className="px-3 py-4 font-semibold text-white">
                    Validation
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {(filteredData ?? []).map((row) => {
                  const globalStatus = getGlobalStatus(
                    row.validationTechnicien,
                    row.validationCharge,
                  );
                  return (
                    <tr
                      key={row.id}
                      className="border-b border-gray-200 hover:bg-[#E30613]/3 transition-colors"
                    >
                      <td className="px-5 py-4 text-muted-foreground-800 font-bold ">
                        {row.nomAuto}
                      </td>

                      <td className="px-2 py-4 text-muted-foreground-800">
                        {row.datePlanification}
                      </td>
                      <td className="px-3 py-4 text-muted-foreground-800">
                        {row.numerProjet}
                      </td>
                      <td className="px-2 py-4 text-muted-foreground-800">
                        {row.client}
                      </td>
                      <td className="px-4 py-4 text-muted-foreground-800">
                        {row.vehicule?.identificateur}
                      </td>
                      {/*<td className="px-4 py-4 text-muted-foreground-800">
                        {row.cycle?.nom}
                      </td>*/}
                      <td className="px-4 py-4 text-muted-foreground-800">
                        <span
                          className={`px-3 py-1 rounded-full text-xs ${getValidationStyle(row.validationTechnicien?.decision)}`}
                        >
                          {row.validationTechnicien?.decision}
                        </span>
                      </td>
                      <td className="px-2 py-4 text-muted-foreground-800">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${getValidationStyle(row.validationCharge?.validation)}`}
                        >
                          {row.validationCharge?.validation}
                        </span>
                      </td>
                      <td className="px-1 py-4 text-muted-foreground-800">
                        <span
                          className={`px-1 py-1 rounded-lg font-bold shadow-sm ${getStatusStyle(globalStatus)}`}
                        >
                          {globalStatus}
                        </span>
                      </td>

                      <td className="px-3 py-4 text-muted-foreground-800">
                        {currentUser?.role === "TECHNICIEN_ESSAI" && (
                          <Link
                            to={`/app/validation/conducteur/${row.id}`}
                            className="px-3 py-1 bg-green-600 text-white rounded-md text-xs hover:bg-green-700"
                          >
                            Valider
                          </Link>
                        )}

                        {currentUser?.role === "CHARGE_ESSAI" && (
                          <Link
                            to={`/app/validation/charge/${row.id}`}
                            className="px-3 py-1 bg-green-600 text-white rounded-md text-xs hover:bg-green-700"
                          >
                            Valider
                          </Link>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
