import { useMemo, useState, useEffect, useRef } from "react";
import {
  Search,
  Plus,
  Eye,
  Edit,
  Copy,
  Trash2,
  X,
  Upload,
  Settings, // Ajoutez ceci
  Activity,
  Calendar,
} from "lucide-react";
import { authFetch } from "../api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/Dialog";

import { toast } from "sonner";
export enum Client {
  RENAULT = "RENAULT",
  STELLANTIS = "STELLANTIS",
  FEV = "FEV",
}
export enum TypeMusure {
  ANALOGIQUE = "ANALOGIQUE",
  CAN = "CAN",
  FIBRE_OPTIQUE = "FIBRE_OPTIQUE",
}
export function Demandes() {
  const BASE = "/demandes-essai";

  const [showForm, setShowForm] = useState(false);

  const [activeTab, setActiveTab] = useState("general");
  const [search, setSearch] = useState("");
  const [filterProjet, setFilterProjet] = useState("");
  const [filterStatut, setFilterStatut] = useState("");
  const [filterShift, setFilterShift] = useState("");
  const [filterDemandeur, setFilterDemandeur] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>("add");
  const [showModal, setShowModal] = useState(false);

  type ModalMode = "add" | "edit" | "view";

  type MesureKey =
    | "mesureCourant"
    | "mesureTension"
    | "thermocouples"
    | "sondeLambdaLA4";

  const [vehicules, setVehicules] = useState<Vehicule[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [demandeToDelete, setDemandeToDelete] = useState<number | null>(null);
  const [filterValidation, setFilterValidation] = useState("");
  const clients = ["Renault", "Stellantis", "Peugeot", "Toyota"];
  const [client, setClient] = useState("");
  const [selectedDemande, setSelectedDemande] = useState<DemandeEssai | null>(
    null,
  );

  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [calages, setCalages] = useState<Calage[]>([]);
  const [loisRoute, setLoisRoute] = useState<LoiRoute[]>([]);
  const [demandes, setDemandes] = useState<DemandeEssai[]>([]);
  const [loading, setLoading] = useState(true);
  const [vehiculeDetails, setVehiculeDetails] = useState<Vehicule | null>(null);
  const [calageDetails, setCalageDetails] = useState<Calage | null>(null);
  const [loiDetails, setLoiDetails] = useState<LoiRoute | null>(null);
  const [cycleDetails, setCycleDetails] = useState<Cycle | null>(null);

  const [mesures, setMesures] = useState({
    mesureCourant: [],
    mesureTension: [],
    thermocouples: [],
    sondeLambdaLA4: [],
  });

  // Déclarer DANS le composant, avant le return
  const mesureItems: { id: MesureKey; label: string }[] = [
    { id: "mesureCourant", label: "Mesure Courant" },
    { id: "mesureTension", label: "Mesure Tension" },
    { id: "thermocouples", label: "Thermocouples" },
    { id: "sondeLambdaLA4", label: "Sonde Lambda LA4" },
  ];

  const [mesuresRows, setMesuresRows] = useState({
    mesureCourant: [{ indice: "", numero: "", type: "" }],
    mesureTension: [{ indice: "", numero: "", type: "" }],
    thermocouples: [{ indice: "", numero: "", type: "" }],
    sondeLambdaLA4: [{ indice: "", numero: "", type: "" }],
  });
  // DANS le composant — avec les autres useState

  // Ajouter AVANT le composant, avec MesureKey
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
  interface DemandeEssaiForm extends Omit<
    DemandeEssai,
    "vehicule" | "cycle" | "calage"
  > {
    vehiculeId?: number;
    cycleId?: number;
    calageId?: number;
    loiId?: number;
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
  interface DemandeEssai {
    // =====================
    // IDENTITÉ
    // =====================
    id?: number;
    nomAuto?: string;
    numeroProjet?: number;

    statutGlobal?: "EN_COURS" | "FAIT" | "PAS_FAIT";
    statutDemande?: "En_creation" | "VALIDEE";

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
    client?: Client;

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

  interface DemandeEssaiForm extends Omit<
    DemandeEssai,
    "vehicule" | "cycle" | "calage"
  > {
    vehiculeId?: number;
    cycleId?: number;
    calageId?: number;
    loiId?: number;
  }
  const [form, setForm] = useState<Partial<DemandeEssaiForm>>({
    // ===== IDENTITÉ =====
    nomAuto: "",
    numeroProjet: undefined,
    statutGlobal: "PAS_FAIT",
    statutDemande: "En_creation",

    // ===== RELATIONS =====
    vehiculeId: undefined,
    cycleId: undefined,
    calageId: undefined,
    loiId: undefined,

    // ===== PROJET =====
    typeProjet: "",
    client: Client.RENAULT,
    demandeur: "",
    technicien: "",

    banc: "BANC_1",
    datePlanification: "",
    shift: "MATIN",

    // ===== CONDITIONS ESSAI =====
    besoinMaceration: false,
    temperatureMaceration: 0,
    temperatureEau: 0,
    hygrometrieEssai: 0,
    activationSTT: false,
    temperatureEssai: 0,

    // ===== BATTERIE / CLIM =====
    gestionBatterie12V: "",
    socDepart12V: 0,
    activationClim: false,
    temperatureRegulationClim: 0,
    chauffageHabitable: false,

    // ===== TYPE ESSAI =====
    typeEssai: "",
    verificationCoastDown: false,
    nombreDecelerations: 0,
    commentaire: "",

    // ===== SAC =====
    mesureSAC: false,
    debitCVsPhase1: 0,
    debitCVsPhase2: 0,
    debitCVsPhase3: 0,
    debitCVsPhase4: 0,
    debitCVsPhase5: 0,
    debitCVsPhase6: 0,
    debitCVsPhase7: 0,
    debitCVsPhase8: 0,
    debitCVsPhase9: 0,
    debitCVsPhase10: 0,

    // ===== PM / PN =====
    pm: false,
    debitPrelevement: 0,
    pn10Nano: false,
    facteurDilutionPN10: 0,
    pn23Nano: false,
    facteurDilutionPN23: 0,

    // ===== GAZ BRUTS =====
    ligne1: false,
    pointPrelevementL1: "",
    ligne2: false,
    pointPrelevementL2: "",
    ligne3: false,
    pointPrelevementL3: "",
    microsot: false,
    pointPrelevementMicrosot: "",

    qcl1: false,
    pointPrelevementQCL1: "",
    qcl2: false,
    pointPrelevementQCL2: "",

    FITR: false,
    pointPrelevementFITR: "",
    egr: false,

    // ===== XCU =====
    xcu1: false,
    software1: "",
    calibration1: "",
    experiment1: "",

    xcu2: false,
    software2: "",
    calibration2: "",

    xcu3: false,
    software3: "",
    calibration3: "",

    acquisitionEOBD: false,
    typeAcquisition: "",

    // ===== MESURES COURANT =====
    mesureCourant: false,
    indiceCourant: undefined,
    numeroTermocoupleCourant: undefined,
    typeMesureCourant: undefined,

    capot: "FERME",
    soufflante: "",
    qCvs: 0,
    carflow: false,

    // ===== MESURES TENSION =====
    mesureTension: false,
    indiceTension: undefined,
    numeroTermocoupleTension: undefined,
    typeMesureTension: "",

    // ===== THERMOCOUPLES =====
    thermocouples: false,
    indicethermocouples: undefined,
    numeroTermocouple: undefined,
    typeMesurethermocouples: "",

    // ===== SONDE LAMBDA =====
    sondeLambdaLA4: false,
    indicesondeLambdaLA4: undefined,
    numerosondeLambdaLA4: undefined,
    typeMesureSondeLambdaLA4: "",
  });
  const openModal = (mode: ModalMode, demande?: DemandeEssai) => {
    setModalMode(mode);
    setActiveTab("general");

    if (mode === "add") {
      setSelectedDemande(null);

      setForm({
        nomAuto: "",
        numeroProjet: undefined,
        statutGlobal: "PAS_FAIT",
        statutDemande: "En_creation",

        vehiculeId: undefined,
        cycleId: undefined,
        calageId: undefined,
        loiId: undefined,

        typeProjet: "",
        client: Client.RENAULT,
        demandeur: "",
        technicien: "",
        banc: "BANC_1",
        datePlanification: "",
        shift: "MATIN",

        besoinMaceration: false,
        temperatureMaceration: 0,
        temperatureEau: 0,
        hygrometrieEssai: 0,
        activationSTT: false,
        temperatureEssai: 0,

        gestionBatterie12V: "",
        socDepart12V: 0,
        activationClim: false,
        temperatureRegulationClim: 0,
        chauffageHabitable: false,

        typeEssai: "",
        verificationCoastDown: false,
        nombreDecelerations: 0,
        commentaire: "",

        mesureSAC: false,
        pm: false,
        pn10Nano: false,
        pn23Nano: false,

        ligne1: false,
        ligne2: false,
        ligne3: false,
        microsot: false,
        egr: false,
        FITR: false,

        xcu1: false,
        xcu2: false,
        xcu3: false,
        acquisitionEOBD: false,

        carflow: false,
        mesureCourant: false,
        mesureTension: false,
        thermocouples: false,
        sondeLambdaLA4: false,
      });

      setShowModal(true);
      return;
    }

    // VIEW / EDIT
    if (demande) {
      setSelectedDemande(demande);

      setForm({
        ...demande,
        vehiculeId: demande.vehicule?.id,
        cycleId: demande.cycle?.id,
        calageId: demande.calage?.id,
        loiId: (demande as any)?.loi?.id,
      });

      setShowModal(true);
    }
  };
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
            ? value === ""
              ? undefined
              : parseFloat(value)
            : value,
    }));
  };

  // ✅ GARDER uniquement celles-ci
  const addRow = (type: MesureKey) => {
    setMesuresRows((prev) => ({
      ...prev,
      [type]: [...prev[type], { indice: "", numero: "", type: "" }],
    }));
  };

  const updateRow = (
    type: MesureKey,
    index: number,
    field: keyof { indice: string; numero: string; type: string },
    value: string,
  ) => {
    setMesuresRows((prev) => ({
      ...prev,
      [type]: (prev[type] ?? []).map((row, i) =>
        i === index ? { ...row, [field]: value } : row,
      ),
    }));
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: keyof DemandeEssai,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setForm((prev) => ({
      ...prev,
      [fieldName]: file.name, // on stocke le nom du fichier (string) car DemandeEssai n'a pas de champ File
    }));
  };
  // Fonction pour passer à l'onglet suivant
  const handleNextTab = () => {
    const currentIndex = tabs.findIndex((tab) => tab.id === activeTab);
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1].id);
    }
  };

  // Remplacez votre useEffect principal par :
  useEffect(() => {
    fetchDemandes();
    fetchVehicules();
    fetchCycles();
    fetchCalages();
    fetchLoisRoute();
  }, []);

  const fetchCycles = async () => {
    try {
      const data = await authFetch("/cycles");
      setCycles(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erreur chargement cycles", error);
    }
  };

  const fetchCalages = async () => {
    try {
      const data = await authFetch("/calages");
      setCalages(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erreur chargement calages", error);
    }
  };

  const fetchLoisRoute = async () => {
    try {
      const data = await authFetch("/lois-route");
      setLoisRoute(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erreur chargement lois de route", error);
    }
  };

  // Fonction pour revenir à l'onglet précédent (optionnel mais recommandé)
  const handlePrevTab = () => {
    const currentIndex = tabs.findIndex((tab) => tab.id === activeTab);
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1].id);
    }
  };
  // --- LOGIQUE DE FILTRAGE MISE À JOUR ---
  const filteredDemandes = useMemo(() => {
    return demandes.filter((d) => {
      const matchSearch =
        !search || d.nomAuto?.toLowerCase().includes(search.toLowerCase());

      const matchDemandeur =
        !filterDemandeur ||
        d.demandeur?.toLowerCase().includes(filterDemandeur.toLowerCase());

      const matchProjet =
        !filterProjet || d.numeroProjet?.toString().includes(filterProjet);

      const matchStatut = !filterStatut || d.statutGlobal === filterStatut;

      const matchShift = !filterShift || d.shift === filterShift;

      const matchDate =
        !filterDate || d.datePlanification?.startsWith(filterDate);

      const matchValidation =
        !filterValidation || d.statutDemande === filterValidation;

      return (
        matchSearch &&
        matchDemandeur &&
        matchProjet &&
        matchStatut &&
        matchShift &&
        matchDate &&
        matchValidation
      );
    });
  }, [
    demandes,
    search,
    filterDemandeur,
    filterProjet,
    filterStatut,
    filterShift,
    filterDate,
    filterValidation,
  ]);
  useEffect(() => {
    // On vérifie si les champs nécessaires sont remplis
    if (form.typeProjet || form.demandeur || form.vehiculeId) {
      const name = `${form.typeProjet || "PROJET"}_${form.demandeur || "NOM"}_${form.vehiculeId || "VEH"}_001`;
      setForm((prev) => ({ ...prev, nomAuto: name }));
    }
  }, [form.typeProjet, form.demandeur, form.vehiculeId]);

  const tabs = [
    { id: "general", label: "Informations générales" },
    { id: "vehicle", label: "Véhicule/Calage" },
    { id: "gazDilues", label: "Gaz dilués" },
    { id: "gazBruts", label: "Gaz bruts" },
    { id: "inca", label: "Données INCA" },
    { id: "mesuresAux", label: "Mesures auxiliaires" },
  ];

  // etc.
  // Fonction pour récupérer les véhicules
  const fetchVehicules = async () => {
    try {
      const data = await authFetch("/vehicules"); // Remplacez par votre endpoint réel
      setVehicules(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erreur chargement véhicules", error);
    }
  };

  useEffect(() => {
    if (form.vehiculeId) {
      authFetch(`/vehicules/${form.vehiculeId}`)
        .then(setVehiculeDetails)
        .catch(console.error);
    } else {
      setVehiculeDetails(null);
    }
  }, [form.vehiculeId]);

  useEffect(() => {
    if (form.calageId) {
      authFetch(`/calages/${form.calageId}`)
        .then(setCalageDetails)
        .catch(console.error);
    } else {
      setCalageDetails(null);
    }
  }, [form.calageId]);

  useEffect(() => {
    if (form.loiId) {
      authFetch(`/lois-route/${form.loiId}`)
        .then(setLoiDetails)
        .catch(console.error);
    } else {
      setLoiDetails(null);
    }
  }, [form.loiId]);
  useEffect(() => {
    if (form.cycleId) {
      authFetch(`/cycles/${form.cycleId}`)
        .then((data) => {
          console.log("cycle API =", data);
          setCycleDetails(data);
        })
        .catch(console.error);
    }
  }, [form.cycleId]);

  const fetchDemandes = async () => {
    try {
      setLoading(true);
      const data = await authFetch("/demandes-essai");
      setDemandes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erreur chargement demandes", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteDemande = async (id: number) => {
    try {
      await authFetch(`/demandes-essai/${id}`, {
        method: "DELETE",
      });

      setDemandes((prev) => prev.filter((d) => d.id !== id));
      toast.success("Demande supprimée avec succès");
    } catch (error) {
      console.error("Erreur suppression :", error);
      toast.error("Erreur lors de la suppression");
    }
  };
  useEffect(() => {
    fetchDemandes();
  }, []);

  const duplicateDemande = async (id: number) => {
    try {
      const newDemande: DemandeEssai = await authFetch(
        `/demandes-essai/${id}/duplicate`,
        { method: "POST" },
      );

      setDemandes((prev) => [newDemande, ...prev]);
      toast.success("Demande dupliquée avec succès");
    } catch (error) {
      console.error("Erreur duplication :", error);
      toast.error("Erreur lors de la duplication");
    }
  };
  const getStatutStyle = (status?: string) => {
    switch (status) {
      case "FAIT":
        return "bg-[#E8F5E9] text-[#2E7D32]";
      case "EN_COURS":
        return "bg-[#FFF9C4] text-[#FBC02D]";
      case "PAS_FAIT":
        return "bg-[#FFEBEE] text-[#C62828]";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };
  const handleSubmit = async () => {
    try {
      const payload = {
        ...form,
        id: selectedDemande?.id,

        vehicule: form.vehiculeId ? { id: form.vehiculeId } : undefined,
        cycle: form.cycleId ? { id: form.cycleId } : undefined,
        calage: form.calageId ? { id: form.calageId } : undefined,
        loi: form.loiId ? { id: form.loiId } : undefined,
      };

      if (modalMode === "edit" && selectedDemande?.id) {
        // UPDATE
        const updated = await authFetch(
          `/demandes-essai/${selectedDemande.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          },
        );

        setDemandes((prev) =>
          prev.map((d) => (d.id === selectedDemande.id ? updated : d)),
        );

        toast.success("Demande modifiée avec succès");
      } else {
        // CREATE
        const created = await authFetch("/demandes-essai", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        setDemandes((prev) => [created, ...prev]);

        toast.success("Demande créée avec succès");
      }

      setShowModal(false);
    } catch (error) {
      console.error("Erreur :", error);
      toast.error("Erreur lors de l'enregistrement");
    }
  };

  const validateTab = (tab: string): boolean => {
    if (!formRef.current) return false;

    const form = formRef.current;

    // récupérer uniquement les champs visibles de l'onglet
    const inputs = form.querySelectorAll(
      `[data-tab="${tab}"] input,
     [data-tab="${tab}"] select,
     [data-tab="${tab}"] textarea`,
    );

    for (const input of inputs) {
      if (!(input as HTMLInputElement).checkValidity()) {
        (input as HTMLInputElement).reportValidity();
        return false;
      }
    }

    return true;
  };

  const handleUpdate = async () => {
    if (!selectedDemande?.id) return;

    try {
      const payload = {
        ...form,
        vehicule: form.vehiculeId ? { id: form.vehiculeId } : undefined,
        cycle: form.cycleId ? { id: form.cycleId } : undefined,
        calage: form.calageId ? { id: form.calageId } : undefined,
        loi: form.loiId ? { id: form.loiId } : undefined,
      };

      const updated = await authFetch(`/demandes-essai/${selectedDemande.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      setDemandes((prev) =>
        prev.map((d) => (d.id === updated.id ? updated : d)),
      );

      toast.success("Demande mise à jour avec succès !");
      setShowModal(false);
      setSelectedDemande(null);
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de la mise à jour");
    }
  };
  return (
    <div className="p-3 space-y-5 bg-gray-10 min-h-screen">
      <div className="flex items-center justify-between">
        {/* Titre + description */}
        <div>
          <h1 className="text-3xl font-semibold text-black">
            Gestion des Demandes d'essai
          </h1>
          <p className="text-gray-600">Gérer vos demandes d'essai</p>
        </div>

        <button
          onClick={() => openModal("add")}
          className="h-11 px-6 bg-[#E30613] text-white rounded-lg hover:brightness-110 flex items-center gap-2 transition-all shadow-md"
        >
          <Plus size={18} /> Nouvelle demande
        </button>
      </div>
      {/* --- BARRE DE FILTRES MULTIPLES AMÉLIORÉE --- */}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 bg-white p-4 rounded-xl shadow-md">
        {/* Recherche par nom */}
        <div className="flex items-center border border-gray-350 rounded-lg px-3 py-2 gap-2 focus-within:ring-2 focus-within:ring-[#E30613]/50  transition">
          <Search size={16} className="text-gray-400" />
          <input
            placeholder="Nom de la demande..."
            className="outline-none w-full text-sm text-gray-700"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Filtre Demandeur */}
        <input
          placeholder="Nom du demandeur..."
          className="border border-gray-350 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#E30613]/50 text-gray-700 transition"
          value={filterDemandeur}
          onChange={(e) => setFilterDemandeur(e.target.value)}
        />

        {/* Filtre Projet */}
        <input
          placeholder="N° de projet..."
          className="border border-gray-350 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#E30613]/50 text-gray-700 transition"
          value={filterProjet}
          onChange={(e) => setFilterProjet(e.target.value)}
        />

        {/* Filtre Statut */}
        <select
          className="border border-gray-350 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#E30613]/50 text-gray-700 transition"
          value={filterStatut}
          onChange={(e) => setFilterStatut(e.target.value)}
        >
          <option value="">Tous les statuts</option>
          <option value="VALIDE">VALIDE</option>
          <option value="En_creation">En_creation</option>
        </select>

        {/* Filtre Validation */}
        <select
          className="border border-gray-350 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#E30613]/50 text-gray-700 transition"
          value={filterValidation}
          onChange={(e) => setFilterValidation(e.target.value)}
        >
          <option value="">Tous</option>
          <option value="EN_COURS">En cours</option>
          <option value="FAIT">Fait</option>
          <option value="PAS_FAIT">Pas fait</option>
        </select>

        {/* Filtre Date */}
        <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2 gap-2 focus-within:ring-2 focus-within:ring-[#E30613]/50 transition">
          <Calendar size={16} className="text-gray-400" />
          <input
            type="date"
            className="outline-none w-full text-sm text-gray-700"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          />
        </div>
      </div>

      {/* --- TABLEAU --- */}
      <div className="bg-white rounded-xl border border-gray-250 shadow-sm overflow-hidden">
        <table className="w-full min-w-[800px] text-sm text-left">
          <thead className="bg-[#F1F5F9] border-b border-gray-300">
            <tr>
              <th className="px-6 py-4 font-semibold text-gray-600">Nom</th>
              <th className="px-5 py-4 font-semibold text-gray-600">
                N° de Projet
              </th>
              <th className="px-2 py-4 font-semibold text-gray-600">Client</th>
              <th className="px-4 py-4 font-semibold text-gray-600">
                Demandeur
              </th>
              <th className="px-3 py-4 font-semibold text-gray-600">Statut</th>
              <th className="px-5 py-4 font-semibold text-gray-600">
                Validation
              </th>
              <th className="px-3 py-4 font-semibold text-gray-600">Date</th>
              <th className="px-5 py-4 font-semibold text-gray-600">Shift</th>
              <th className="px-5 py-4 text-right font-semibold text-gray-600">
                Actions
              </th>
            </tr>
          </thead>
          <Dialog open={showConfirmDelete} onOpenChange={setShowConfirmDelete}>
            {/* On active le mode transparent ici */}
            <DialogContent className="max-w-md" hideOverlay={true}>
              <DialogHeader>
                <DialogTitle>Confirmation de suppression</DialogTitle>
              </DialogHeader>
              <p className="py-4 text-gray-700">
                Voulez-vous vraiment supprimer le véhicule{" "}
                <span className="font-bold">{selectedDemande?.nomAuto}</span> ?
              </p>
              <div className="flex justify-end gap-4 mt-4">
                <button
                  onClick={() => setShowConfirmDelete(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Non
                </button>
                <button
                  onClick={() => {
                    if (selectedDemande?.id != null) {
                      deleteDemande(selectedDemande.id);
                    }
                    setShowConfirmDelete(false);
                    setSelectedDemande(null);
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm"
                >
                  Confirmer suppression
                </button>
              </div>
            </DialogContent>
          </Dialog>
          <tbody className="divide-y">
            {filteredDemandes.map((d) => (
              <tr
                key={d.id}
                className="border-b border-gray-100 hover:bg-[#F9FBFD] transition-colors group"
              >
                <td className="p-4 font-medium text-sm text-black">
                  {d.nomAuto}
                </td>
                <td className="px-5 py-4 text-gray-600">
                  <div className="flex items-center gap-2">
                    {d.numeroProjet}{" "}
                  </div>
                </td>
                <td className="px-2 py-4 text-gray-600">
                  <div className="flex items-center gap-2">{d.client} </div>
                </td>
                <td className="px-4 py-4 text-gray-600">
                  <div className="flex items-center gap-2">{d.demandeur} </div>
                </td>
                <td>
                  <span
                    className={`px-1 py-1 rounded-lg font-bold shadow-sm ${getStatutStyle(d?.statutGlobal)}`}
                  >
                    {d.statutGlobal}
                  </span>
                </td>
                <td className="px-3 py-4 text-gray-600">
                  <div className="flex items-center gap-2">
                    {" "}
                    {d.statutDemande}
                  </div>
                </td>
                <td className=" py-4 text-gray-600">
                  <div className="flex items-center gap-2">
                    {d.datePlanification}{" "}
                  </div>
                </td>
                <td className="px-5 py-4 text-gray-600">
                  <div className="flex items-center gap-2">{d.shift} </div>
                </td>
                {/* Actions */}
                <td className="px-2 py-2">
                  <div className="flex items-center justify-end gap-2">
                    <Eye
                      className="cursor-pointer w-4 h-4 text-blue-600"
                      onClick={() => openModal("view", d)}
                    />

                    <Edit
                      className="cursor-pointer w-4 h-4 text-green-600"
                      onClick={() => openModal("edit", d)}
                    />

                    <Copy
                      className="cursor-pointer w-4 h-4 text-black"
                      onClick={() => d.id && duplicateDemande(d.id)}
                    />

                    <Trash2
                      className="cursor-pointer w-4 h-4 text-red-600"
                      onClick={() => {
                        setSelectedDemande(d);
                        setShowConfirmDelete(true);
                      }}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-[700px] max-h-[95vh] overflow-hidden rounded-xl flex flex-col shadow-2xl">
            <div className="flex justify-between items-center p-6 border-b bg-gray-90">
              <h2 className="text-xl font-bold text-black">
                Création Demande d'essai
              </h2>
              <X
                className="cursor-pointer hover:bg-gray-200 rounded-full p-1"
                size={30}
                onClick={() => setShowModal(false)}
              />
            </div>

            {/* Onglets */}
            <div className="flex border-b bg-white sticky top-0 z-10">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    if (!validateTab(activeTab)) {
                      return; // bloque changement
                    }

                    setActiveTab(tab.id);
                  }}
                  className={`px-6 py-3 font-semibold text-sm transition ${
                    activeTab === tab.id
                      ? "border-b-4 border-[#E30613]/50 text-black"
                      : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Scrollable Content Area */}

            <div className="flex-1 overflow-y-auto px-8 bg-white">
              {" "}
              {/* --- ONGLET GÉNÉRAL (Données génériques de la demande) --- */}
              <form
                onSubmit={handleSubmit}
                noValidate={false} // Autorise la validation native
                className="overflow-y-auto px-6 py-3 space-y-4"
              ></form>
              {activeTab === "general" && (
                <div className="space-y-8 animate-in fade-in pb-200">
                  {" "}
                  <div className="grid grid-cols-2 gap-6">
                    {/* Véhicule */}

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">
                        Véhicule
                      </label>
                      <select
                        name="vehiculeId"
                        value={form.vehiculeId ?? ""}
                        required
                        onChange={handleChange}
                        className="border p-2 rounded text-sm w-full"
                      >
                        <option value="">Sélectionner un véhicule</option>
                        {vehicules.map((v) => (
                          <option key={v.id} value={v.id}>
                            {v.nomAppliImmat ||
                              v.identificateur ||
                              `Véhicule ${v.id}`}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Cycle de conduite */}
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">
                        Cycle
                      </label>
                      <select
                        name="cycleId"
                        value={form.cycleId ?? ""}
                        required
                        onChange={handleChange}
                        className="border p-2 rounded text-sm w-full"
                      >
                        <option value="">Sélectionner un cycle</option>
                        {cycles.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.nom || `Cycle ${c.id}`}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Calage */}
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">
                        Calage
                      </label>
                      <select
                        name="calageId"
                        value={form.calageId ?? ""}
                        required
                        onChange={handleChange}
                        className="border p-2 rounded text-sm w-full"
                      >
                        <option value="">Sélectionner un calage</option>
                        {calages.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.nom || `Calage ${c.id}`}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Loi de route */}
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">
                        Loi de route
                      </label>
                      <select
                        name="loiId"
                        value={form.loiId ?? ""}
                        required
                        onChange={handleChange}
                        className="border p-2 rounded text-sm w-full"
                      >
                        <option value="">Sélectionner une loi</option>
                        {loisRoute.map((l) => (
                          <option key={l.id} value={l.id}>
                            {l.nom || `Loi de route ${l.id}`}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Type de projet — ❌ name="projectType" → ✅ name="typeProjet" */}
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">
                        Type de projet
                      </label>
                      <select
                        name="typeProjet"
                        value={form.typeProjet ?? ""}
                        required
                        onChange={handleChange}
                        className="border p-2 rounded text-sm w-full"
                      >
                        <option value="">Sélectionner</option>
                        <option value="COP">COP</option>
                        <option value="ISC">ISC</option>
                        <option value="R&D">R&D</option>
                      </select>
                    </div>
                    {/* Nom (auto-généré) */}
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">
                        Nom de la demande
                      </label>
                      <input
                        name="requestName"
                        value={
                          form.demandeur ||
                          "Projet_Demandeur_Véhicule_Cycle_001"
                        }
                        onChange={handleChange}
                        className="border p-2 rounded text-sm w-full bg-gray-50"
                        readOnly
                      />
                    </div>

                    {/* Statut (auto-défini) */}
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">
                        Statut
                      </label>
                      <select
                        name="statutDemande"
                        required
                        value={form.statutDemande}
                        onChange={handleChange}
                        className="border p-2 rounded text-sm w-full"
                      >
                        <option value="">Sélectionner statut</option>
                        <option value="En_creation">En_creation</option>
                        <option value="VALIDE"> Validé</option>
                      </select>
                    </div>

                    {/* Demandeur */}
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">
                        Demandeur
                      </label>
                      <select
                        name="demandeur"
                        value={form.demandeur}
                        onChange={handleChange}
                        className="border p-2 rounded text-sm w-full"
                      >
                        <option value="">Sélectionner un demandeur</option>
                        <option value="Amin">Amin</option>
                        <option value="Ahmed">Ahmed</option>
                        <option value="Karim">Karim</option>
                        <option value="Hamid">Hamid</option>
                      </select>
                    </div>
                    {/* client */}
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">
                        Client
                      </label>

                      <select
                        name="client"
                        value={form.client ?? ""}
                        required
                        onChange={(e) =>
                          setForm({ ...form, client: e.target.value as Client })
                        }
                        className="border p-2 rounded text-sm w-full"
                      >
                        <option value="">Sélectionner le client</option>
                        <option value="RENAULT">RENAULT</option>
                        <option value="STELLANTIS">STELLANTIS</option>
                        <option value="FEV">FEV</option>
                      </select>
                    </div>
                    {/* client */}
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">
                        Technicien d'essai
                      </label>
                      <select
                        name="technicien"
                        value={form.technicien}
                        onChange={handleChange}
                        className="border p-2 rounded text-sm w-full"
                      >
                        <option value="">Sélectionner un technicien</option>
                        <option value="Amin">Amin</option>
                        <option value="Ahmed">Ahmed</option>
                        <option value="Karim">Karim</option>
                        <option value="Hamid">Hamid</option>
                      </select>
                    </div>

                    {/* Banc */}
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">
                        Banc
                      </label>
                      <select
                        name="banc"
                        required
                        value={form.banc}
                        onChange={handleChange}
                        className="border p-2 rounded text-sm w-full"
                      >
                        <option value="BANC_1">BANC_1</option>
                      </select>
                      <p className="text-xs text-gray-500">
                        Un seul banc disponible actuellement
                      </p>
                    </div>
                  </div>
                  {/* Section Date et Shift (transition vers onglet suivant) */}
                  <div className="border-t pt-6 mt-4">
                    <h3 className="text-md font-bold text-gray-700 mb-4">
                      Planification
                    </h3>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">
                          Date de l'essai
                        </label>
                        <input
                          type="date"
                          required
                          name="datePlanification"
                          value={form.datePlanification}
                          onChange={handleChange}
                          className="border p-2 rounded text-sm w-full"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">
                          Shift
                        </label>
                        <select
                          name="shift"
                          value={form.shift}
                          required
                          onChange={handleChange}
                          className="border p-2 rounded text-sm w-full"
                        >
                          <option value="">Sélectionner</option>
                          <option value="MATIN">MATIN</option>
                          <option value="Après-midi">Après-midi</option>
                          <option value="NUIT">NUIT</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <section className=" p-6 rounded-xl border ">
                    <h3 className="text-base font-bold text-black mb-4 flex items-center gap-2">
                      Conditions d'Essai
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {/* Macération */}
                      <div className="space-y-3 p-4 bg-white rounded-lg border shadow-sm">
                        <label className="flex items-center gap-2 font-bold text-xs cursor-pointer">
                          <input
                            type="checkbox"
                            name="besoinMaceration"
                            checked={form.besoinMaceration}
                            onChange={handleChange}
                            className="w-4 h-4"
                          />
                          Besoin macération
                        </label>
                        {form.besoinMaceration && (
                          <div className="space-y-3 pl-6 animate-in zoom-in-95">
                            <div>
                              <label className="text-xs text-gray-600">
                                Température macération (°C)
                              </label>
                              <input
                                name="temperatureMaceration"
                                type="number"
                                value={form.temperatureMaceration}
                                onChange={handleChange}
                                className="border p-2 rounded text-xs w-full mt-1"
                                placeholder="Ex: 23"
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Température eau */}
                      <div className="space-y-3 p-4 bg-white rounded-lg border shadow-sm">
                        <label className="flex items-center gap-2 font-bold text-xs">
                          Température d'eau (°C)
                        </label>
                        <input
                          name="temperatureEau"
                          type="number"
                          value={form.temperatureEau}
                          onChange={handleChange}
                          className="border p-2 rounded text-xs w-full"
                          placeholder="Ex: 90"
                        />
                      </div>

                      {/* Température et Hygrométrie */}
                      <div className="space-y-3 p-4 bg-white rounded-lg border shadow-sm">
                        <label className="flex items-center gap-2 font-bold text-xs">
                          Température ambiante (°C)
                        </label>
                        <input
                          name="temperatureEssai"
                          type="number"
                          value={form.temperatureEssai}
                          onChange={handleChange}
                          className="border p-2 rounded text-xs w-full"
                          placeholder="Ex: 23"
                        />
                        <label className="flex items-center gap-2 font-bold text-xs mt-2">
                          Hygrométrie (%)
                        </label>
                        <input
                          name="hygrometrieEssai"
                          type="number"
                          value={form.hygrometrieEssai}
                          onChange={handleChange}
                          className="border p-2 rounded text-xs w-full"
                          placeholder="Ex: 50"
                        />
                      </div>

                      {/* STT */}
                      <div className="space-y-3 p-4 bg-white rounded-lg border shadow-sm">
                        <label className="flex items-center gap-2 font-bold text-xs cursor-pointer text-black-700">
                          <input
                            type="checkbox"
                            name="activationSTT"
                            checked={form.activationSTT}
                            onChange={handleChange}
                            className="w-4 h-4"
                          />
                          Activation STT
                        </label>
                      </div>

                      {/* Gestion batterie 12V */}
                      <div className="space-y-3 p-4 bg-white rounded-lg border shadow-sm">
                        <label className="flex items-center gap-2 font-bold text-xs">
                          Gestion batterie 12V
                        </label>
                        <select
                          name="gestionBatterie12V"
                          required
                          value={form.gestionBatterie12V ?? ""}
                          onChange={handleChange}
                          className="border p-2 rounded text-sm w-full"
                        >
                          <option value="">Sélectionner</option>
                          <option value="CHARGEMENT_BATTERIE">
                            Chargement
                          </option>
                          <option value="BBN">BBN</option>
                        </select>

                        <label className="flex items-center gap-2 font-bold text-xs mt-2">
                          SOC départ 12V (%)
                        </label>
                        <input
                          name="socDepart12V"
                          type="number"
                          value={form.socDepart12V}
                          onChange={handleChange}
                          className="border p-2 rounded text-xs w-full"
                          placeholder="Ex: 80"
                        />
                      </div>

                      {/* Climatisation */}
                      <div className="space-y-3 p-4 bg-white rounded-lg border shadow-sm">
                        <label className="flex items-center gap-2 font-bold text-xs cursor-pointer">
                          <input
                            type="checkbox"
                            name="activationClim"
                            checked={form.activationClim}
                            onChange={handleChange}
                            className="w-4 h-4"
                          />
                          Activation Clim
                        </label>
                        {form.temperatureRegulationClim && (
                          <div className="mt-2">
                            <label className="text-xs text-gray-600">
                              Température régulation(°C)
                            </label>
                            <input
                              name="temperatureRegulationClim"
                              type="number"
                              value={form.temperatureRegulationClim}
                              onChange={handleChange}
                              className="border p-2 rounded text-xs w-full mt-1"
                              placeholder="Ex: 21"
                            />
                          </div>
                        )}
                      </div>

                      {/* Chauffage habitacle */}
                      <div className="space-y-3 p-4 bg-white rounded-lg border shadow-sm">
                        <label className="flex items-center gap-2 font-bold text-xs cursor-pointer">
                          <input
                            type="checkbox"
                            name="chauffageHabitable"
                            checked={form.chauffageHabitable}
                            onChange={handleChange}
                            className="w-4 h-4"
                          />
                          Chauffage habitacle
                        </label>
                      </div>

                      {/* Type d'essai */}
                      <div className="space-y-3 p-4 bg-white rounded-lg border shadow-sm">
                        <label className="flex items-center gap-2 font-bold text-xs">
                          Type d'essai
                        </label>
                        <select
                          name="typeEssai"
                          value={form.typeEssai ?? ""}
                          required
                          onChange={(e) =>
                            setForm({
                              ...form,
                              typeEssai: e.target.value || undefined,
                            })
                          }
                          className="border p-2 rounded text-xs w-full"
                        >
                          <option value="">Sélectionner</option>

                          <option value="TIRE_MACERATION">
                            TIRE_MACERATION
                          </option>
                          <option value="PRECON">PRECON</option>
                          <option value="CALAGE">CALAGE</option>
                          <option value="TIR_CHAUD">TIR_CHAUDd</option>
                          <option value="ROULAGE">ROULAGE</option>
                        </select>
                      </div>

                      {/* Vérification Coast Down */}
                      <div className="space-y-3 p-4 bg-white rounded-lg border shadow-sm col-span-1">
                        <label className="flex items-center gap-2 font-bold text-xs cursor-pointer">
                          <input
                            type="checkbox"
                            name="verificationCoastDown"
                            checked={form.verificationCoastDown}
                            onChange={handleChange}
                            className="w-4 h-4"
                          />
                          Vérification Coast Down
                        </label>
                        {form.verificationCoastDown && (
                          <div className="mt-2">
                            <label className="text-xs text-gray-600">
                              Nombre de décélérations
                            </label>
                            <input
                              name="decelCount"
                              type="nombreDecelerations"
                              value={form.nombreDecelerations}
                              onChange={handleChange}
                              className="border p-2 rounded text-xs w-full mt-1"
                              placeholder="Ex: 3"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </section>
                  {/* Commentaires */}
                  <section className="mt-6">
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Commentaire{" "}
                      <span className="text-xs font-normal text-gray-500">
                        (Optionnel)
                      </span>
                    </label>
                    <textarea
                      name="commentaire"
                      value={form.commentaire}
                      onChange={handleChange}
                      rows={4}
                      className="w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-red-300 outline-none"
                      placeholder="Commentaires spécifiques pour le conducteur d'essai..."
                    ></textarea>
                  </section>
                </div>
              )}
              {/* --- ONGLET COMPLÉMENTAIRE : CONFIGURATION BANC (Si inclus dans Mesures Aux ou dédié) --- */}
              {activeTab === "mesuresAux" && (
                <div className="space-y-6">
                  {/* ... (Sondes Lambda déjà faites) ... */}

                  <section className="bg-white p-6 rounded-xl border border-gray-300">
                    <h3 className="text-md font-bold text-gray-700 mb-4 uppercase tracking-tight">
                      Configuration Physique du Banc
                    </h3>
                    <div className="grid grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500">
                          Capot (Sélection)
                        </label>
                        <select
                          name="capot"
                          value={form.capot}
                          required
                          onChange={handleChange}
                          className="w-full border p-2 rounded text-sm bg-white"
                        >
                          <option value="fermé">Fermé</option>
                          <option value="ouvert">Ouvert</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500">
                          Soufflante
                        </label>

                        <select
                          name="soufflante"
                          required
                          value={form.soufflante ?? ""}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              soufflante: e.target.value || undefined,
                            })
                          }
                          className="w-full border p-2 rounded text-sm"
                        >
                          <option value="">Sélectionner</option>

                          <option value="VMAX_SYNCHRO">Vmax</option>
                          <option value="FIXE">Fixe</option>
                        </select>
                      </div>

                      {/* Q_CVS */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500">
                          Q_CVS
                        </label>
                        <input
                          type="text"
                          name="qCvs"
                          value={form.qCvs}
                          placeholder="Entrer la valeur"
                          onChange={handleChange}
                          className="w-full border p-2 rounded text-sm"
                        />
                      </div>

                      {/* Carflow */}
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          name="carflow"
                          className="w-4 h-4 accent-red-600"
                          checked={form.carflow}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              carflow: e.target.checked,
                            })
                          }
                        />
                        <label className="text-xs font-bold text-gray-500">
                          Carflow
                        </label>
                      </div>
                    </div>
                  </section>
                </div>
              )}
              {/* 2ème Onglet : Gaz Dilués */}
              {activeTab === "gazDilues" && (
                <div className="space-y-8 animate-in fade-in p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pl-4  ml-3">
                    {/* Section 1 : Configuration CVS & Sacs */}
                    <section className="space-y-6">
                      <div>
                        <h4 className="text-xs font-black text-black uppercase mb-4 flex items-center gap-2">
                          <Settings size={14} /> Configuration CVS & Phases
                        </h4>

                        <div className="p-4 bg-white border border-red-100 rounded-xl shadow-sm space-y-4">
                          <div
                            className={`flex items-center gap-3 pb-2 transition-colors ${
                              form.mesureSAC
                                ? "border-b border-red-100 mb-4"
                                : ""
                            }`}
                          >
                            <input
                              type="checkbox"
                              id="mesureSAC"
                              name="mesureSAC"
                              checked={form.mesureSAC}
                              onChange={handleChange}
                              className="w-5 h-5 accent-red-600"
                            />
                            <label
                              htmlFor="mesureSAC"
                              className="text-sm font-black text-black uppercase cursor-pointer"
                            >
                              MESURE DES SACS
                            </label>
                          </div>

                          {form.mesureSAC && (
                            <div className="grid grid-cols-2 gap-3 animate-in slide-in-from-top-2 duration-300">
                              <p className="col-span-2 text-[10px] font-bold text-black uppercase tracking-tight mb-1">
                                Débits par Phase (m^3/min)
                              </p>

                              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                                <div key={num} className="flex flex-col gap-1">
                                  <label className="text-[10px] font-bold text-gray-400 uppercase">
                                    Phase {num}
                                  </label>

                                  <div className="relative">
                                    <input
                                      type="number"
                                      step="0.1"
                                      name={`debitCVsPhase${num}`}
                                      value={
                                        (form as any)[`debitCVsPhase${num}`] ||
                                        ""
                                      }
                                      onChange={handleChange}
                                      placeholder="0.0"
                                      className="w-full border-2 border-gray-50 p-2 rounded-lg text-xs focus:ring-2 focus:ring-red-300 outline-none bg-red-50/20"
                                    />

                                    <span className="absolute right-2 top-2 text-[9px] text-gray-400 font-bold">
                                      CVS
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </section>

                    {/* Section 2 : Particules (PM & PN) */}
                    <section className="space-y-6">
                      <h4 className="text-xs font-black text-black uppercase mb-4 flex items-center gap-2">
                        <Activity size={14} /> Mesures Particulaires (PN/PM)
                      </h4>

                      <div className="space-y-4">
                        {/* PM Masse */}
                        <div
                          className={`p-4 border rounded-xl shadow-sm space-y-4
            ${
              form.pm
                ? "bg-white border-red-200 shadow-sm"
                : "bg-white border-red-100"
            }`}
                        >
                          <input
                            type="checkbox"
                            id="pm"
                            name="pm"
                            checked={form.pm}
                            onChange={handleChange}
                            className="w-4 h-4 accent-red-600"
                          />

                          <label htmlFor="pm" className="p-4">
                            Pesée PM (Masse)
                          </label>

                          {form.pm && (
                            <div className="pl-7 animate-in slide-in-from-top-2">
                              <label className="text-[10px] font-bold text-black uppercase">
                                Débit Prélèvement (L/min)
                              </label>

                              <input
                                type="number"
                                name="debitPrelevement"
                                value={form.debitPrelevement}
                                onChange={handleChange}
                                className="w-full mt-1 border p-2 rounded-lg text-sm bg-white focus:ring-2 focus:ring-red-50"
                              />
                            </div>
                          )}
                        </div>

                        {/* PN 23nm */}
                        <div
                          className={`p-4 border rounded-xl shadow-sm space-y-4
            ${
              form.pn23Nano
                ? "bg-white border-red-200 shadow-sm"
                : "bg-white border-red-100"
            }`}
                        >
                          <div className="flex items-center gap-3 mb-3">
                            <input
                              type="checkbox"
                              id="pn23Nano"
                              name="pn23Nano"
                              checked={form.pn23Nano}
                              onChange={handleChange}
                              className="w-4 h-4 accent-red-600"
                            />

                            <label
                              htmlFor="pn23Nano"
                              className="text-sm font-bold text-gray-800 cursor-pointer"
                            >
                              PN 23 nm
                            </label>
                          </div>

                          {form.pn23Nano && (
                            <div className="pl-7 animate-in slide-in-from-top-2">
                              <label className="text-[10px] font-bold text-black uppercase">
                                Facteur Dilution (PNDF)
                              </label>

                              <input
                                type="number"
                                name="facteurDilutionPN23"
                                value={form.facteurDilutionPN23}
                                onChange={handleChange}
                                className="w-full mt-1 border p-2 rounded-lg text-sm bg-white focus:ring-2 focus:ring-red-50"
                              />
                            </div>
                          )}
                        </div>

                        {/* PN 10nm */}
                        <div
                          className={`p-4 border rounded-xl shadow-sm space-y-4
            ${
              form.pn10Nano
                ? "bg-white border-red-200 shadow-sm"
                : "bg-white border-red-100"
            }`}
                        >
                          <div className="flex items-center gap-3 mb-3">
                            <input
                              type="checkbox"
                              id="pn10Nano"
                              name="pn10Nano"
                              checked={form.pn10Nano}
                              onChange={handleChange}
                              className="w-4 h-4 accent-red-600"
                            />

                            <label
                              htmlFor="pn10Nano"
                              className="text-sm font-bold text-gray-800 cursor-pointer"
                            >
                              PN 10 nm
                            </label>
                          </div>

                          {form.pn10Nano && (
                            <div className="pl-7 animate-in slide-in-from-top-2">
                              <label className="text-[10px] font-bold text-black uppercase">
                                Facteur Dilution (PNDF)
                              </label>

                              <input
                                type="number"
                                name="facteurDilutionPN10"
                                value={form.facteurDilutionPN10}
                                onChange={handleChange}
                                className="w-full mt-1 border p-2 rounded-lg text-sm bg-white focus:ring-2 focus:ring-red-50"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </section>
                  </div>
                </div>
              )}
              {activeTab === "vehicle" && (
                <div className="space-y-8 animate-in fade-in">
                  {/* SECTION 1 : VÉHICULE */}
                  <section>
                    <h3 className="text-md font-bold text-gray-700 mb-4 flex items-center gap-2">
                      <div className="w-1 h-4 bg-red-500 rounded-full"></div>
                      Caractéristiques du véhicule
                    </h3>
                    {!vehiculeDetails ? (
                      <p className="text-xs text-gray-400 italic p-4 border border-dashed rounded-lg">
                        Sélectionnez un véhicule dans l'onglet "Informations
                        générales".
                      </p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                          {
                            label: "Nom du véhicule",
                            value:
                              vehiculeDetails.nomAppliImmat ||
                              vehiculeDetails.identificateur ||
                              vehiculeDetails.nomAuto,
                          },
                          {
                            label: "Boîte de vitesse",
                            value: (vehiculeDetails as any).boiteVitesse,
                          },
                          {
                            label: "Type de motorisation",
                            value: (vehiculeDetails as any).motorisation,
                          },
                          {
                            label: "Carburant",
                            value: (vehiculeDetails as any).carburant,
                          },
                        ].map((f) => (
                          <div key={f.label} className="space-y-1">
                            <label className="text-xs font-bold text-gray-600 uppercase">
                              {f.label}
                            </label>
                            <div className="w-full border p-3 rounded text-sm bg-gray-100 font-mono">
                              {f.value ?? "—"}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </section>

                  {/* SECTION 2 : LOI DE ROUTE */}
                  <section>
                    <h3 className="text-md font-bold text-gray-700 mb-4 flex items-center gap-2">
                      <div className="w-1 h-4 bg-red-500 rounded-full"></div>
                      Caractéristiques de la loi de route
                    </h3>
                    {!loiDetails ? (
                      <p className="text-xs text-gray-400 italic p-4 border border-dashed rounded-lg">
                        Sélectionnez une loi de route dans l'onglet
                        "Informations générales".
                      </p>
                    ) : (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                          { label: "Nom", value: loiDetails.nom },
                          {
                            label: "Masse d'essai (kg)",
                            value: loiDetails.masseEssaiKg,
                          },
                          { label: "F0 (N)", value: loiDetails.f0 },
                          { label: "F1 (N/km/h)", value: loiDetails.f1 },
                          { label: "F2 (N/(km/h)²)", value: loiDetails.f2 },
                          {
                            label: "Inertie (kg)",
                            value: (loiDetails as any).inertieKg,
                          },
                          {
                            label: "Inertie Rot. TNR (kg)",
                            value: (loiDetails as any).inertieRotativeTNRKg,
                          },
                          {
                            label: "Inertie Rot. 2T (kg)",
                            value: (loiDetails as any)
                              .inertieRotativeDeuxTrainsKg,
                          },
                        ].map((f) => (
                          <div key={f.label} className="space-y-1">
                            <label className="text-[11px] font-semibold text-gray-500">
                              {f.label}
                            </label>
                            <div className="w-full border p-3 rounded bg-gray-100 font-mono text-sm text-black">
                              {f.value ?? "—"}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </section>

                  {/* SECTION 3 : CALAGE */}
                  <section>
                    <h3 className="text-md font-bold text-gray-700 mb-4 flex items-center gap-2">
                      <div className="w-1 h-4 bg-red-500 rounded-full"></div>
                      Caractéristiques du calage
                    </h3>
                    {!calageDetails ? (
                      <p className="text-xs text-gray-400 italic p-4 border border-dashed rounded-lg">
                        Sélectionnez un calage dans l'onglet "Informations
                        générales".
                      </p>
                    ) : (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                          { label: "Nom du calage", value: calageDetails.nom },
                          {
                            label: "Température (°C)",
                            value: calageDetails.temperature,
                          },
                          { label: "A (N)", value: (calageDetails as any).a },
                          {
                            label: "B (N/km/h)",
                            value: (calageDetails as any).b,
                          },
                          {
                            label: "C (N/(km/h)²)",
                            value: (calageDetails as any).c,
                          },
                        ].map((f) => (
                          <div key={f.label} className="space-y-1">
                            <label className="text-[11px] font-semibold text-gray-500">
                              {f.label}
                            </label>
                            <div className="w-full border p-3 rounded bg-gray-100 font-mono text-sm text-black">
                              {f.value ?? "—"}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </section>

                  {/* SECTION 4 : CYCLE */}
                  <section>
                    <h3 className="text-md font-bold text-gray-700 mb-4 flex items-center gap-2">
                      <div className="w-1 h-4 bg-red-500 rounded-full"></div>
                      Caractéristiques du cycle
                    </h3>
                    {!cycleDetails ? (
                      <p className="text-xs text-gray-400 italic p-4 border border-dashed rounded-lg">
                        Sélectionnez un cycle dans l'onglet "Informations
                        générales".
                      </p>
                    ) : (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                          { label: "Nom du cycle", value: cycleDetails.nom },
                          { label: "Famille", value: cycleDetails.familleTest },
                          {
                            label: "Durée",
                            value: (cycleDetails as any).duree,
                          },
                          {
                            label: "Unité",
                            value: (cycleDetails as any).dureeUnit,
                          },
                        ].map((f) => (
                          <div key={f.label} className="space-y-1">
                            <label className="text-[11px] font-semibold text-gray-500">
                              {f.label}
                            </label>
                            <div className="w-full border p-3 rounded bg-gray-100 font-mono text-sm text-black">
                              {f.value ?? "—"}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </section>
                </div>
              )}
              {/* 3ème Onglet : Gaz Bruts */}
              {activeTab === "gazBruts" && (
                <div className="space-y-8 animate-in fade-in p-4">
                  <h3 className="text-lg font-bold text-black mb-4 border-b pb-2">
                    Configuration des gaz Bruts
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pl-4   ">
                    {/* SECTION 1 : Lignes Standard (L1, L2, L3) */}
                    <section className="space-y-6">
                      <div>
                        <h4 className="text-xs font-black text-black uppercase mb-4 flex items-center gap-2">
                          <Settings size={14} /> Lignes de Prélèvement Standard
                        </h4>
                        <div className="grid grid-cols-1 gap-4">
                          {/* Ligne 1 */}
                          <div className="p-3 bg-white border border-red-200 rounded-xl shadow-sm">
                            <div className="flex items-center gap-3 mb-2">
                              <input
                                type="checkbox"
                                id="ligne1"
                                name="ligne1"
                                checked={!!form.ligne1}
                                onChange={handleChange}
                                className="w-4 h-4 accent-red-600"
                              />
                              <label
                                htmlFor="ligne1"
                                className="text-sm font-bold text-gray-700 uppercase"
                              >
                                Ligne 1
                              </label>
                            </div>
                            {!!form.ligne1 && (
                              <div className="pl-7 animate-in slide-in-from-left-2">
                                <label className="text-[10px] font-bold text-gray-400 uppercase">
                                  Point de prélèvement
                                </label>
                                <select
                                  name="pointPrelevementL1"
                                  value={form.pointPrelevementL1 ?? ""}
                                  onChange={handleChange}
                                  className="w-full mt-1 border p-2 rounded-lg text-sm bg-red-50/30 focus:ring-2 focus:ring-red-50/40"
                                >
                                  <option value="">-- Sélectionner --</option>
                                  <option value="Amont CATA">Amont CATA</option>
                                  <option value="Aval CATA">Aval CATA</option>
                                  <option value="Canule">Canule</option>
                                </select>
                              </div>
                            )}
                          </div>

                          {/* Ligne 2 */}
                          <div className="p-3 bg-white border border-red-200 rounded-xl shadow-sm">
                            <div className="flex items-center gap-3 mb-2">
                              <input
                                type="checkbox"
                                id="ligne2"
                                name="ligne2"
                                checked={!!form.ligne2}
                                onChange={handleChange}
                                className="w-4 h-4 accent-red-600"
                              />
                              <label
                                htmlFor="ligne2"
                                className="text-sm font-bold text-gray-700 uppercase"
                              >
                                Ligne 2
                              </label>
                            </div>
                            {!!form.ligne2 && (
                              <div className="pl-7 animate-in slide-in-from-left-2">
                                <label className="text-[10px] font-bold text-gray-400 uppercase">
                                  Point de prélèvement
                                </label>
                                <select
                                  name="pointPrelevementL2"
                                  value={form.pointPrelevementL2 ?? ""}
                                  onChange={handleChange}
                                  className="w-full mt-1 border p-2 rounded-lg text-sm bg-red-50/30 focus:ring-2 focus:ring-red-50/40"
                                >
                                  <option value="">-- Sélectionner --</option>
                                  <option value="Amont CATA">Amont CATA</option>
                                  <option value="Aval CATA">Aval CATA</option>
                                  <option value="Canule">Canule</option>
                                </select>
                              </div>
                            )}
                          </div>

                          {/* Ligne 3 */}
                          <div className="p-3 bg-white border border-red-200 rounded-xl shadow-sm">
                            <div className="flex items-center gap-3 mb-2">
                              <input
                                type="checkbox"
                                id="ligne3"
                                name="ligne3"
                                checked={!!form.ligne3}
                                onChange={handleChange}
                                className="w-4 h-4 accent-red-600"
                              />
                              <label
                                htmlFor="ligne3"
                                className="text-sm font-bold text-gray-700 uppercase"
                              >
                                Ligne 3
                              </label>
                            </div>
                            {!!form.ligne3 && (
                              <div className="pl-7 animate-in slide-in-from-left-2">
                                <label className="text-[10px] font-bold text-gray-400 uppercase">
                                  Point de prélèvement
                                </label>
                                <select
                                  name="pointPrelevementL3"
                                  value={form.pointPrelevementL3 ?? ""}
                                  onChange={handleChange}
                                  className="w-full mt-1 border p-2 rounded-lg text-sm bg-red-50/30 focus:ring-2 focus:ring-red-50/40"
                                >
                                  <option value="">-- Sélectionner --</option>
                                  <option value="Amont CATA">Amont CATA</option>
                                  <option value="Aval CATA">Aval CATA</option>
                                  <option value="Canule">Canule</option>
                                </select>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </section>

                    {/* SECTION 2 : Lignes Spéciales (QCL & PN) */}
                    <section className="space-y-6">
                      <div>
                        <h4 className="text-xs font-black text-black uppercase mb-4 flex items-center gap-2">
                          <Activity size={14} /> Lignes FTIR
                        </h4>
                        <div className="grid grid-cols-1 gap-4">
                          {/* FTIR — accès direct, pas de tableau inline */}
                          <div className="p-3 bg-white border border-red-200 rounded-xl shadow-sm">
                            <div className="flex items-center gap-3 mb-2">
                              <input
                                type="checkbox"
                                id="FITR"
                                name="FITR"
                                checked={!!form.FITR}
                                onChange={handleChange}
                                className="w-4 h-4 accent-red-600"
                              />
                              <label
                                htmlFor="FITR"
                                className="text-sm font-bold text-gray-700 uppercase"
                              >
                                FTIR
                              </label>
                            </div>
                            {!!form.FITR && (
                              <div className="pl-7 animate-in slide-in-from-left-2">
                                <label className="text-[10px] font-bold text-gray-400 uppercase">
                                  Localisation
                                </label>
                                <input
                                  type="text"
                                  name="pointPrelevementFITR"
                                  value={form.pointPrelevementFITR ?? ""}
                                  onChange={handleChange}
                                  className="w-full mt-1 border p-2 rounded-lg text-sm bg-gray-50 focus:ring-2 focus:ring-red-50"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Microsoot */}
                      <div className="p-3 bg-white border border-red-200 rounded-xl shadow-sm">
                        <div className="flex items-center gap-3 mb-2">
                          <input
                            type="checkbox"
                            id="microsot"
                            name="microsot"
                            checked={!!form.microsot}
                            onChange={handleChange}
                            className="w-4 h-4 accent-red-600"
                          />
                          <label
                            htmlFor="microsot"
                            className="text-sm font-bold text-gray-900 uppercase"
                          >
                            Microsoot
                          </label>
                        </div>
                        {!!form.microsot && (
                          <div className="pl-7 animate-in slide-in-from-left-2">
                            <label className="text-[10px] font-bold text-gray-400 uppercase">
                              Localisation
                            </label>
                            <input
                              type="text"
                              name="pointPrelevementMicrosot"
                              value={form.pointPrelevementMicrosot ?? ""}
                              onChange={handleChange}
                              className="w-full mt-1 border p-2 rounded-lg text-sm bg-gray-50 focus:ring-2 focus:ring-red-50"
                            />
                          </div>
                        )}
                      </div>

                      {/* Analyses Spécifiques */}
                      <div className="p-4 border rounded-xl space-y-4 border-red-200 shadow-sm">
                        <h5 className="text-[11px] font-bold text-black uppercase flex items-center gap-2">
                          Analyses Spécifiques
                        </h5>
                        <div className="flex flex-col gap-3">
                          {/* egr — accès direct, pas de tableau inline */}
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              id="egr"
                              name="egr"
                              checked={!!form.egr}
                              onChange={handleChange}
                              className="w-4 h-4 accent-red-600"
                            />
                            <span className="text-xs font-bold text-gray-500 uppercase">
                              Mesure EGR
                            </span>
                          </div>
                        </div>
                      </div>
                    </section>
                  </div>
                </div>
              )}
              {/* SECTION  : donnée INCA  */}
              {activeTab === "inca" && (
                <div className="space-y-8 animate-in fade-in p-4">
                  <h3 className="text-lg font-bold text-black mb-4 border-b pb-2">
                    Configuration INCA
                  </h3>

                  <div className="grid grid-cols-1 gap-8">
                    {/* SECTION XCU1 */}
                    <div className="p-4 border border-red-200 rounded-xl bg-white shadow-sm">
                      <div className="flex items-center gap-3 mb-4">
                        <input
                          type="checkbox"
                          id="xcu1"
                          name="xcu1"
                          checked={form.xcu1}
                          onChange={handleChange}
                          className="w-5 h-5 accent-red-600"
                        />
                        <label
                          htmlFor="xcu1"
                          className="font-black text-gray-800 uppercase"
                        >
                          XCU 1
                        </label>
                      </div>

                      {form.xcu1 && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pl-8 animate-in slide-in-from-left-2 ">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-500 uppercase">
                              Software1 (.a2l, .srh) *
                            </label>
                            <input
                              type="file"
                              required
                              className="w-full text-xs border p-2 rounded bg-gray-50"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-500 uppercase">
                              Calibration1 (.hex, .s19) *
                            </label>
                            <input
                              type="file"
                              required
                              className="w-full text-xs border p-2 rounded bg-gray-50"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-500 uppercase">
                              Experiment1 (.exp) *
                            </label>
                            <input
                              type="file"
                              required
                              className="w-full text-xs border p-2 rounded bg-gray-50"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* SECTIONS XCU2 & XCU3 */}
                    {([2, 3] as const).map((num) => {
                      const xcuKey = `xcu${num}` as keyof DemandeEssai;

                      return (
                        <div
                          key={`xcu${num}`}
                          className="p-4 border border-red-200 rounded-xl bg-white shadow-sm"
                        >
                          <div className="flex items-center gap-3 mb-4">
                            <input
                              type="checkbox"
                              id={`xcu${num}`}
                              name={`xcu${num}`}
                              checked={!!form[xcuKey]}
                              onChange={handleChange}
                              className="w-5 h-5 accent-red-600"
                            />
                            <label
                              htmlFor={`xcu${num}`}
                              className="font-black text-gray-800 uppercase"
                            >
                              XCU {num}
                            </label>
                          </div>

                          {!!form[xcuKey] && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-8 animate-in slide-in-from-left-2">
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-500 uppercase">
                                  Software{num} *
                                </label>
                                <input
                                  type="file"
                                  required
                                  className="w-full text-xs border p-2 rounded bg-gray-50"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-500 uppercase">
                                  Calibration{num} *
                                </label>
                                <input
                                  type="file"
                                  required
                                  className="w-full text-xs border p-2 rounded bg-gray-50"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {/* SECTION ACQUISITION EOBD */}
                    <div className="p-4 border-2 border border-red-100 rounded-xl">
                      <div className="flex items-center gap-3 mb-4">
                        <input
                          type="checkbox"
                          id="acquisitionEOBD"
                          name="acquisitionEOBD"
                          checked={form.acquisitionEOBD}
                          onChange={handleChange}
                          className="w-5 h-5 accent-red-600"
                        />
                        <label
                          htmlFor="acquisitionEOBD"
                          className="font-black text-black uppercase"
                        >
                          Acquisition EOBD
                        </label>
                      </div>

                      {form.acquisitionEOBD && (
                        <div className="pl-8 animate-in slide-in-from-top-2">
                          <label className="text-[10px] font-bold text-black uppercase">
                            Type d'acquisition *
                          </label>
                          <select
                            name="typeAcquisition"
                            value={form.typeAcquisition}
                            onChange={handleChange}
                            required
                            className="w-full md:w-1/2 border-1  p-2 rounded-lg bg-white outline-none focus:ring-2 focus:ring-red-200"
                          >
                            <option value="">-- Sélectionner --</option>
                            <option value="DiagRa">DiagRa</option>
                            <option value="Scantool">Scantool</option>
                            <option value="DDT 2000">DDT 2000</option>
                          </select>
                        </div>
                      )}
                    </div>

                    {/* SECTION MESURES COURANT & TENSION */}

                    {/* SECTION OPTIONS FINALES */}
                  </div>
                </div>
              )}
              {/* 5ème Onglet Mesures auxiliaires */}
              {activeTab === "mesuresAux" && (
                <div className="space-y-8 animate-in fade-in text-xs">
                  {/* Section 1 : Sélection des mesures */}
                  <section className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
                    {mesureItems.map(
                      (
                        item, // ✅ item.id est MesureKey
                      ) => (
                        <label
                          key={item.id}
                          className={`flex items-center justify-between p-3 border border-gray-650
       rounded-xl cursor-pointer transition-all ${
         form[item.id]
           ? "bg-white border-red-200 shadow-sm ring-1 ring-red-100"
           : "bg-white-50 border-gray-200"
       }`}
                        >
                          <span className="text-xs font-bold text-gray-700 uppercase">
                            {item.label}
                          </span>
                          <input
                            type="checkbox"
                            name={item.id}
                            checked={form[item.id] || false}
                            onChange={handleChange}
                            className="w-4 h-4 accent-red-600"
                          />
                        </label>
                      ),
                    )}
                  </section>
                  {/* Section 2 : Détails dynamiques pour CHAQUE mesure sélectionnée */}
                  {/* Section 2 : Détails dynamiques pour CHAQUE mesure sélectionnée */}
                  <section className="space-y-6">
                    <h3 className="text-sm font-bold text-gray-700 border-b pb-2 uppercase tracking-tight">
                      Configuration des mesures sélectionnées
                    </h3>

                    <div className="space-y-4">
                      {mesureItems.map(
                        (item) =>
                          form[item.id] && (
                            <div
                              key={item.id}
                              className="p-4 border border-gray-200 rounded-xl bg-white shadow-sm"
                            >
                              {/* Header */}
                              <div className="flex justify-between items-center mb-4">
                                <span className="text-xs font-bold text-black uppercase">
                                  {item.label}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => addRow(item.id)}
                                  className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                                >
                                  + Ajouter
                                </button>
                              </div>

                              {/* Rows */}
                              {(mesuresRows[item.id] ?? []).map(
                                (row, index) => (
                                  <div
                                    key={index}
                                    className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3"
                                  >
                                    <div className="flex flex-col gap-1">
                                      <label className="text-[10px] font-black text-gray-400 uppercase">
                                        Indice
                                      </label>
                                      <input
                                        value={row.indice}
                                        onChange={(e) =>
                                          updateRow(
                                            item.id,
                                            index,
                                            "indice",
                                            e.target.value,
                                          )
                                        }
                                        placeholder="Ex: idx-01"
                                        className="border p-2 rounded text-xs outline-none focus:border-red-500"
                                      />
                                    </div>

                                    <div className="flex flex-col gap-1">
                                      <label className="text-[10px] font-black text-gray-400 uppercase">
                                        Numéro
                                      </label>
                                      <input
                                        type="number"
                                        value={row.numero}
                                        onChange={(e) =>
                                          updateRow(
                                            item.id,
                                            index,
                                            "numero",
                                            e.target.value,
                                          )
                                        }
                                        placeholder="Ex: 102"
                                        className="border p-2 rounded text-xs outline-none focus:border-red-500"
                                      />
                                    </div>

                                    <div className="flex flex-col gap-1">
                                      <label className="text-[10px] font-black text-gray-400 uppercase">
                                        Type de mesure
                                      </label>
                                      <select
                                        value={row.type}
                                        onChange={(e) =>
                                          updateRow(
                                            item.id,
                                            index,
                                            "type",
                                            e.target.value,
                                          )
                                        }
                                        className="border p-2 rounded text-xs bg-white outline-none focus:border-red-500"
                                      >
                                        <option value="">
                                          Sélectionner...
                                        </option>
                                        <option value="Analogique">
                                          Analogique
                                        </option>
                                        <option value="CAN">CAN</option>
                                        <option value="Fibre">
                                          Fibre Optique
                                        </option>
                                      </select>
                                    </div>
                                  </div>
                                ),
                              )}
                            </div>
                          ),
                      )}

                      {/* Message si rien n'est sélectionné */}
                      {!form.mesureCourant &&
                        !form.mesureTension &&
                        !form.thermocouples &&
                        !form.sondeLambdaLA4 && (
                          <div className="text-center py-10 border-2 border-dashed border-gray-100 rounded-xl">
                            <p className="text-xs text-gray-400 font-medium">
                              Cochez une mesure pour configurer ses détails.
                            </p>
                          </div>
                        )}
                    </div>
                  </section>
                </div>
              )}
            </div>

            {/* --- FOOTER FIXE AVEC NAVIGATION --- */}
            <div className="p-4 border-t bg-gray-50 flex justify-between items-center sticky bottom-0">
              <button
                onClick={handlePrevTab}
                disabled={activeTab === tabs[0].id}
                className={`px-6 py-2 border-2 border-gray-400 rounded-lg font-medium transition ${
                  activeTab === tabs[0].id
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-gray-600 "
                }`}
              >
                Précédent
              </button>

              <div className="flex gap-3">
                {activeTab !== tabs[tabs.length - 1].id ? (
                  <button
                    onClick={handleNextTab}
                    className="px-10 py-2 bg-[#E30613] text-white rounded-lg font-medium transition-all hover:brightness-110"
                  >
                    Suivant
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    className="px-6 py-2 bg-[#E30613] text-white rounded-lg font-bold shadow-lg hover:brightness-110"
                  >
                    Enregistrer la demande
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
