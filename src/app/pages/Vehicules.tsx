import { useEffect, useState } from "react";
import {
  Search,
  Plus,
  Eye,
  Edit,
  Copy,
  Trash2,
  Flame,
  Zap,
  Battery,
  Filter,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/Dialog";
import { authFetch } from "../api";
import { toast } from "sonner";
// --- Types ---

export enum TypeMotorisation {
  ICE = "ICE",
  HEV = "HEV",
  BEV = "BEV",
  PHEV = "PHEV",
}

export enum Client {
  RENAULT = "RENAULT",
  STELLANTIS = "STELLANTIS",
  FEV = "FEV",
}
export enum Localisation {
  CA001 = "CA001",
  CA002 = "CA002",
  CA003 = "CA003",
  OZ001 = "OZ001",
}
export enum TypeCarburant {
  E10 = "E10",
  E3 = "E3",
  BPVR = "BPVR",
}
export enum ModeConduite {
  TRACTION = "TRACTION",
  QUATRE_X_QUATRE = "QUATRE_X_QUATRE",
  AUTRE = "AUTRE",
}
export enum Type_catalyseur {
  SCR = "SCR",
  FAP = "FAP",
  DOC = "DOC",
}

interface Vehicle {
  id: number;
  nomAppliImmat: string;
  identificateur: string;
  marque: string;
  immatriculation: string;
  vin: string;
  site: string;
  responsable: string;
  moteur: string;
  boiteVitesse: string;
  couleur: string;
  familleVehicule: string;
  dimensionsPneus: string;
  pressionPneus: Number;
  puissance: Number;
  densite: Number;
  empattement: Number;
  localisation: Localisation;
  client: Client;
  motorisation: TypeMotorisation;
  carburant: TypeCarburant;
  modeConduite: ModeConduite;
  typeCatalyseur: Type_catalyseur;
}

const motorisationIcons: { [key: string]: any } = {
  ICE: { icon: Flame, color: "#C62828" },
  HEV: { icon: Battery, color: "#ED6C02" },
  BEV: { icon: Zap, color: "#2E7D32" },
};

export function Vehicules() {
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [modalMode, setModalMode] = useState<"view" | "edit" | "add">("add");
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  // États pour les filtres
  const [filterMotorisation, setFilterMotorisation] = useState("Tous");
  const [clientFilter, setClientFilter] = useState("Tous");

  const [filterLocalisation, setFilterLocalisation] = useState("Tous");
  const [filterCatalyseur, setFilterCatalyseur] = useState("Tous");
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const clients = ["RENAULT", "STELLANTIS", "FEV"];

  useEffect(() => {
    // Récupération des véhicules
    const fetchVehicles = async () => {
      try {
        const data = await authFetch("/vehicules");
        setVehicles(data ?? []); // ⚡ Si data est null, on met un tableau vide
      } catch (err) {
        console.error("Erreur fetch véhicules :", err);
        setVehicles([]); // ⚡ fallback en cas d'erreur
      }
    };

    fetchVehicles();
  }, []);

  const handleAddVehicle = async (vehicle: any) => {
    try {
      const data = await authFetch("/vehicules", {
        method: "POST",
        body: JSON.stringify(vehicle),
      });

      setVehicles((prev) => [...prev, data]);
      setShowModal(false);
    } catch (err) {
      console.error(err);
    }
  };
  // Logique de filtrage
  const filteredVehicles = vehicles.filter((v) => {
    const immat = (v.immatriculation ?? "").toLowerCase();
    const vin = (v.vin ?? "").toLowerCase();

    const search = searchTerm.toLowerCase();

    const matchSearch =
      (v.immatriculation ?? "").toLowerCase().includes(search) ||
      (v.vin ?? "").toLowerCase().includes(search) ||
      (v.nomAppliImmat ?? "").toLowerCase().includes(search) ||
      (v.identificateur ?? "").toLowerCase().includes(search) ||
      (v.marque ?? "").toLowerCase().includes(search);
    // const matchesClient = clientFilter === "Tous" || v.client === clientFilter;

    const matchMoto =
      filterMotorisation === "Tous" || v.motorisation === filterMotorisation;

    const matchLoc =
      filterLocalisation === "Tous" || v.localisation === filterLocalisation;

    const matchCata =
      filterCatalyseur === "Tous" || v.typeCatalyseur === filterCatalyseur;

    // return matchesClient && matchSearch && matchMoto && matchLoc && matchCata;
     return  matchSearch && matchMoto && matchLoc && matchCata;
  });

  // Initial fetch

  const addVehicle = async (newVehicle: Vehicle) => {
    try {
      const created = await authFetch("/vehicules", {
        method: "POST",
        body: JSON.stringify(newVehicle),
      });
      setVehicles((prev) => [...prev, created]);
      setShowModal(false);
      toast.success("Véhicule créé avec succès !"); // ✅ succès
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de la création du véhicule !"); // ❌ erreur
    }
  };
  const deleteVehicle = async (id: number) => {
    try {
      await authFetch(`/vehicules/${id}`, { method: "DELETE" });
      setVehicles((prev) => prev.filter((v) => v.id !== id));
      toast.success("Véhicule supprimé avec succès !");
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de la suppression !");
    }
  };

  const duplicateVehicle = async (id: number) => {
    try {
      const duplicated = await authFetch(`/vehicules/duplicate/${id}`, {
        method: "POST",
      });
      setVehicles((prev) => [...prev, duplicated]);
      toast.success("Véhicule dupliqué !");
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de la duplication !");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData) as any;

    // Conversion des nombres
    const vehicleData = {
      ...data,
      puissance: Number(data.puissance) || 0,
      pressionPneus: Number(data.pressionPneus) || 0,
      densite: Number(data.densite) || 0,
      empattement: Number(data.empattement) || 0,
      dimensionsPneus: Number(data.dimensionsPneus) || 0,
    };
    if (!form.checkValidity()) {
      form.reportValidity(); // affiche erreurs navigateur
      return;
    }

    try {
      if (modalMode === "edit" && selectedVehicle) {
        // APPEL PUT pour modification
        const updated = await authFetch(`/vehicules/${selectedVehicle.id}`, {
          method: "PUT",
          body: JSON.stringify(vehicleData),
        });
        setVehicles((prev) =>
          prev.map((v) => (v.id === updated.id ? updated : v)),
        );
        toast.success("Véhicule modifié avec succès !");
      } else {
        // APPEL POST pour ajout
        await addVehicle(vehicleData);
      }
      setShowModal(false);
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de la modification !");
    }
  };

  return (
    <div className="space-y-5  p-3">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-semibold text-black mb-2">
            Gestion des Véhicules
          </h1>
          <p className="text-gray-600">Gérer vos véhicules</p>
        </div>
        <button
          onClick={() => {
            setSelectedVehicle(null);
            setModalMode("add");
            setShowModal(true);
          }}
          className="ml-auto h-11 px-6 bg-[#E30613] text-white rounded-lg hover:brightness-110 flex items-center gap-2 transition-all shadow-md"
        >
          <Plus className="w-5 h-5" />
          Ajouter un véhicule
        </button>
      </div>

      {/* Barre de Recherche et Filtres améliorée */}
      <div className="p-5 bg-white rounded-xl border border-gray-250 shadow-sm flex items-center gap-4">
        <div className="flex flex-wrap gap-2 items-center">
          {/* Barre de recherche */}
          <div className="relative flex-1 w-[300px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 transition-colors group-focus-within:text-[#E30613]" />
            <input
              type="text"
              placeholder="nom, identificateur, immatriculation, marque"
              className="w-full h-11 pl-10 pr-3  border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E30613]/30"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/*<select
            className="w-full sm:w-48 h-12 px-4 border border-gray-200 rounded-lg shadow-sm text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#E30613]/30 transition"
            value={clientFilter}
            onChange={(e) => setClientFilter(e.target.value)}
          >
            <option value="Tous">Client (Tous)</option>
            <option value="RENAULT">RENAULT</option>
            <option value="STELLANTIS">STELLANTIS</option>
            <option value="FEV">FEV</option>
          </select>*/}
          {/* Filtre motorisation */}
          <select
            className="w-full sm:w-48 h-12 px-4 border border-gray-200 rounded-lg shadow-sm text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#E30613]/30 transition"
            onChange={(e) => setFilterMotorisation(e.target.value)}
          >
            <option value="Tous">Motorisation (Tous)</option>
            <option value="ICE">ICE (Thermique)</option>
            <option value="HEV">HEV (Hybride)</option>
            <option value="BEV">BEV (Électrique)</option>
          </select>

          {/* Filtre localisation */}
          <select
            className="w-full sm:w-48 h-12 px-4 border border-gray-200 rounded-lg shadow-sm text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#E30613]/30  transition"
            onChange={(e) => setFilterLocalisation(e.target.value)}
          >
            <option value="Tous">Localisation (Toutes)</option>
            <option value="casablanca">ca-001</option>
            <option value="ouad zem">ca-002</option>
            <option value="ouad zem">OZ-003</option>
          </select>

          {/* Filtre catalyseur */}
          <select
            className="w-full sm:w-48 h-12 px-4 border border-gray-200 rounded-lg shadow-sm text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#E30613]/30 transition"
            onChange={(e) => setFilterCatalyseur(e.target.value)}
          >
            <option value="Tous">Catalyseur (Tous)</option>
            <option value="SCR">SCR</option>
            <option value="FAP">FAP</option>
          </select>
        </div>
      </div>
      {/* Tableau des résultats */}
      {/* Tableau véhicules */}
      <div className="bg-white rounded-xl border border-gray-250 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-sm text-left">
            {/* Header */}
            <thead className="bg-[#F1F5F9] border-b border-gray-300">
              <tr>
                <th className="px-4 py-5 font-semibold text-gray-600">
                  Véhicule
                </th>
                <th className="px-2 py-5  font-semibold text-gray-600">
                  Identificateur
                </th>
                <th className="px-4 py-5  font-semibold text-gray-600">
                  Client
                </th>

                <th className="px-4 py-5 font-semibold text-gray-600">
                  Immatriculation
                </th>
                <th className="px-4 py-5 font-semibold text-gray-600">
                  Marque
                </th>

                <th className="px-4 py-5 font-semibold text-gray-600">
                  Motorisation
                </th>
                <th className="px-4 py-5 font-semibold text-gray-600">
                  Localisation
                </th>
                <th className="px-2 py-5 font-semibold text-gray-600">
                  Catalyseur
                </th>
                <th className="px-1 py-5 font-semibold text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>

            {/* Body */}
            <tbody>
              {filteredVehicles.map((v) => {
                const MotoIcon =
                  motorisationIcons[v.motorisation]?.icon || Flame;

                return (
                  <tr
                    key={v.id}
                    className="border-b border-gray-100 hover:bg-[#F9FBFD] transition-colors"
                  >
                    {/* Véhicule */}
                    <td className="px-3 py-4 font-medium text-gray-800">
                      {v.nomAppliImmat}
                    </td>

                    {/* Identificateur  */}
                    <td className="px-4 py-4 text-gray-600">
                      {v.identificateur}
                    </td>
                    {/* Client  */}
                    <td className="px-3 py-4 text-gray-600">{v.client}</td>

                    {/* Immatriculation */}
                    <td className="px-5 py-4 text-gray-600">
                      {v.immatriculation}
                    </td>
                    {/* Marque  */}
                    <td className="px-4 py-4 text-gray-600">{v.marque}</td>

                    {/* Motorisation */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <MotoIcon
                          className="w-4 h-4"
                          style={{
                            color: motorisationIcons[v.motorisation]?.color,
                          }}
                        />
                        <span className="text-gray-700">{v.motorisation}</span>
                      </div>
                    </td>

                    {/* Localisation */}
                    <td className="px-4 py-4 text-gray-600">
                      {v.localisation}
                    </td>

                    {/* Catalyseur */}
                    <td className="px-1 py-4">
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                        {v.typeCatalyseur}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className=" px-1 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Eye
                          className="cursor-pointer w-4 h-4 text-blue-500"
                          onClick={() => {
                            setSelectedVehicle(v);
                            setModalMode("view");
                            setShowModal(true);
                          }}
                        />
                        <Edit
                          className="cursor-pointer w-4 h-4 text-green-600"
                          onClick={() => {
                            setSelectedVehicle(v);
                            setModalMode("edit");
                            setShowModal(true);
                          }}
                        />
                        <Copy
                          className="cursor-pointer w-4 h-4 text-black"
                          onClick={() => duplicateVehicle(v.id)}
                        />
                        <Trash2
                          className="cursor-pointer w-4 h-4 text-red-600"
                          onClick={() => {
                            setSelectedVehicle(v);
                            setShowConfirmDelete(true);
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}

              {/* Aucun résultat */}
              {filteredVehicles.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-gray-400">
                    Aucun véhicule trouvé
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <Dialog open={showConfirmDelete} onOpenChange={setShowConfirmDelete}>
        {/* On active le mode transparent ici */}
        <DialogContent className="max-w-md" hideOverlay={true}>
          <DialogHeader>
            <DialogTitle>Confirmation de suppression</DialogTitle>
          </DialogHeader>
          <p className="py-4 text-gray-700">
            Voulez-vous vraiment supprimer le véhicule{" "}
            <span className="font-bold">{selectedVehicle?.nomAppliImmat}</span>{" "}
            ?
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
                if (selectedVehicle) {
                  deleteVehicle(selectedVehicle.id);
                }
                setShowConfirmDelete(false);
                setSelectedVehicle(null);
              }}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm"
            >
              Confirmer suppression
            </button>
          </div>
        </DialogContent>
      </Dialog>
      {/* MODAL D'AJOUT (CAHIER DES CHARGES COMPLET) */}

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold text-gray-800">
              <div className="flex justify-between items-center p-2 border-b bg-gray-90">
                {modalMode === "add" && "Ajouter un véhicule"}
                {modalMode === "edit" && "Modifier un véhicule"}
                {modalMode === "view" && "Détails du véhicule"}
              </div>
            </DialogTitle>
          </DialogHeader>
          <form className="space-y-10 mt-6" onSubmit={handleSubmit}>
            {" "}
            {/* SECTION IDENTIFICATION */}
            <p className="text-xs text-gray-500"></p>
            <div>
              <h3 className="text-sm font-semibold text-[#E30613] mb-5 uppercase tracking-wide">
                Identification du véhicule
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {[
                  {
                    label: "Nom (Appli_Immat)",
                    key: "nomAppliImmat",
                    required: true,
                  },
                  {
                    label: "Identificateur",
                    key: "identificateur",
                    required: true,
                  },
                  {
                    label: "Immatriculation",
                    key: "immatriculation",
                    required: true,
                  },
                  {
                    label: "Marque",
                    key: "marque",
                    required: true,
                  },
                  { label: "VIN", key: "vin", required: true },
                  {
                    label: "Site",
                    key: "site",
                    required: true,
                  },
                  {
                    label: "Responsable",
                    key: "responsable",
                  },
                ].map((field) => (
                  <div key={field.key} className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-gray-530">
                      {field.label}
                      {field.required && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </label>

                    <input
                      name={field.key}
                      required={field.required} // ✅ IMPORTANT
                      defaultValue={
                        selectedVehicle?.[
                          field.key as keyof Vehicle
                        ]?.toString() ?? ""
                      }
                      disabled={modalMode === "view"}
                      className="h-11 px-3 rounded-lg border border-gray-300
    focus:outline-none focus:ring-2 focus:ring-[#E30613]/30"
                    />
                  </div>
                ))}

                {/* Client */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-gray-530">
                    Client
                    <span className="text-red-500 ml-1">*</span>
                  </label>

                  <select
                    name="client"
                    required // ✅ bloque si vide
                    defaultValue={selectedVehicle?.client ?? ""}
                    disabled={modalMode === "view"}
                    className="h-11 px-3 rounded-lg border border-gray-300"
                  >
                    <option value="">Sélectionner un client</option>
                    {clients.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Localisation */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-gray-530">
                    Localisation
                    <span className="text-red-500 ml-1">*</span>
                  </label>

                  <select
                    name="localisation"
                    required // ✅ bloque si vide
                    disabled={modalMode === "view"}
                    className="h-11 px-3 rounded-lg border border-gray-300
              focus:outline-none focus:ring-2 focus:ring-[#E30613]/30
             "
                  >
                    {["CA001", "CA002", "CA003", "OZ001"].map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            {/* MOTORISATION */}
            <div>
              <h3 className="text-sm font-semibold text-[#E30613] mb-5 uppercase tracking-wide">
                Motorisation
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-gray-530">
                    Type moteur
                    <span className="text-red-500 ml-1">*</span>
                  </label>

                  <select
                    name="motorisation"
                    required // ✅ bloque si vide
                    disabled={modalMode === "view"}
                    className="h-11 px-3 rounded-lg border border-gray-300
              focus:ring-2 focus:ring-[#E30613]/30 "
                  >
                    {["ICE", "HEV", "PHEV", "BEV"].map((opt) => (
                      <option key={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-gray-530">
                    Carburant
                    <span className="text-red-500 ml-1">*</span>
                  </label>

                  <select
                    name="carburant"
                    required // ✅ bloque si vide
                    disabled={modalMode === "view"}
                    className="h-11 px-3 rounded-lg border border-gray-300
              focus:ring-2 focus:ring-[#E30613]/30 "
                  >
                    {["E10", "E3", "BPVR"].map((opt) => (
                      <option key={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                {[
                  {
                    label: "Code moteur",
                    key: "moteur",
                    required: true,
                  },
                  {
                    label: "Boite vitesse",
                    key: "boiteVitesse",
                    required: true,
                  },
                ].map((field) => (
                  <div key={field.key} className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-gray-500">
                      {field.label}
                      {field.required && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </label>
                    <input
                      name={field.key}
                      required={field.required} // ✅ IMPORTANT
                      defaultValue={
                        selectedVehicle?.[
                          field.key as keyof Vehicle
                        ]?.toString() ?? ""
                      }
                      disabled={modalMode === "view"}
                      className="h-11 px-3 rounded-lg border border-gray-300
                focus:ring-2 focus:ring-[#E30613]/30 "
                    />
                  </div>
                ))}
              </div>
            </div>
            {/* CARACTERISTIQUES */}
            {/* CARACTERISTIQUES */}
            <div>
              <h3 className="text-sm font-semibold text-[#E30613] mb-5 uppercase tracking-wide">
                Caractéristiques
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                {[
                  {
                    label: "Pneus",
                    key: "dimensionsPneus",
                    required: true,
                  },
                  {
                    required: true,
                    label: "Pression pneus",
                    key: "pressionPneus",
                  },
                  { required: true, label: "Puissance", key: "puissance" },
                  { required: true, label: "Densité", key: "densite" },
                  {
                    label: "Empattement",
                    key: "empattement",
                    required: true,
                  },
                  { label: "Couleur", key: "couleur", required: true },
                  {
                    label: "Famille",
                    key: "familleVehicule",
                    required: true,
                  },
                  {
                    label: "Catalyseur",
                    key: "typeCatalyseur",
                    required: true,
                  },
                ].map((field) => (
                  <div key={field.key} className="flex flex-col gap-1">
                    <label className="text-xs text-gray-530">
                      {field.label}
                      <span className="text-red-500 ml-1">*</span>
                    </label>

                    {field.key === "typeCatalyseur" ? (
                      <select
                        defaultValue={
                          selectedVehicle?.[
                            field.key as keyof Vehicle
                          ]?.toString() ?? ""
                        }
                        name="typeCatalyseur" // ✅ OBLIGATOIRE
                        required // ✅ bloque si vide
                        disabled={modalMode === "view"}
                        className="h-11 px-3 rounded-lg border border-gray-300
            focus:ring-2 focus:ring-[#E30613]/30 bg-white"
                      >
                        <option value="">Sélectionner</option>
                        <option value="SCR">SCR</option>
                        <option value="FAP">FAP</option>
                      </select>
                    ) : (
                      <input
                        name={field.key}
                        required={field.required} // ✅ IMPORTANT
                        defaultValue={
                          selectedVehicle?.[
                            field.key as keyof Vehicle
                          ]?.toString() ?? ""
                        }
                        disabled={modalMode === "view"}
                        className="h-11 px-3 rounded-lg border border-gray-300
            focus:ring-2 focus:ring-[#E30613]/30"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
            {/* FOOTER */}
            {modalMode !== "view" && (
              <div className="flex justify-end gap-3 ">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedVehicle(null);
                    setModalMode("add");
                    setShowModal(false);
                  }}
                  className="px-5 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Annuler
                </button>

                <button
                  type="submit"
                  className="px-6 py-2 bg-[#E30613] text-white rounded-lg
            hover:brightness-110 transition shadow"
                >
                  Enregistrer
                </button>
              </div>
            )}
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
