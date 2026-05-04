import { useEffect, useState } from "react";
import { Search, Plus, Eye, Edit, Trash2 } from "lucide-react";
import { authFetch } from "../api";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/Dialog";

export enum Client {
  RENAULT = "RENAULT",
  STELLANTIS = "STELLANTIS",
  FEV = "FEV",
}
export interface LoiRoute {
  id: number;
  nom: string;
}
export interface Vehicule {
  id: number;
  identificateur: string;
}
export interface Calage {
  id?: number;
  nom: string;
  client: Client;
  temperature: number;
  vehiculeAssocie?: Vehicule;
  loiRouteAssocie?: LoiRoute;
  a: number;
  b: number;
  c: number;
  description: string;
}

export function Calages() {
  const [calages, setCalages] = useState<Calage[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filterVehicule, setFilterVehicule] = useState("Tous");
  const [filterLoi, setFilterLoi] = useState("Tous");
  const [filterMode, setFilterMode] = useState("Tous");

  const [modalMode, setModalMode] = useState<"view" | "edit" | "add">("add");

  const [selectedCalage, setSelectedCalage] = useState<Calage | null>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const [clientFilter, setClientFilter] = useState("Tous");

  const [vehicules, setVehicules] = useState<any[]>([]);
  const [loisRoutes, setLoisRoutes] = useState<any[]>([]);
  const filteredCalages = calages.filter((c) => {
    const matchSearch =
      c.nom?.toLowerCase().includes(searchText.toLowerCase()) ||
      c.vehiculeAssocie?.identificateur
        ?.toLowerCase()
        .includes(searchText.toLowerCase()) ||
      c.loiRouteAssocie?.nom?.toLowerCase().includes(searchText.toLowerCase());

    const matchesClient = clientFilter === "Tous" || c.client === clientFilter;

    const matchVehicule =
      filterVehicule === "Tous" ||
      c.vehiculeAssocie?.id === Number(filterVehicule);

    const matchLoi =
      filterLoi === "Tous" || c.loiRouteAssocie?.id === Number(filterLoi);

    return matchSearch && matchesClient && matchVehicule && matchLoi;
  });
  const INITIAL_CALAGE: Calage = {
    nom: "",
    client: Client.RENAULT,
    temperature: 0,
    vehiculeAssocie: undefined,
    loiRouteAssocie: undefined,
    a: 0,
    b: 0,
    c: 0,

    description: "",
  };

  const [newCalage, setNewCalage] = useState<Calage>({
    nom: "",
    client: "" as Client,
    temperature: 0,
    vehiculeAssocie: undefined,
    loiRouteAssocie: undefined,
    a: 0,
    b: 0,
    c: 0,
    description: "",
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        const vehiculesData = await authFetch("/vehicules");
        const loisData = await authFetch("/lois-route");

        await fetchCalages();

        setVehicules(vehiculesData ?? []);
        setLoisRoutes(loisData ?? []);
      } catch (err) {
        toast.error("Erreur lors du chargement des données");
      }
    };

    fetchData();
  }, []);
  const fetchCalages = async () => {
    try {
      const calagesData = await authFetch("/calages");
      setCalages(calagesData ?? []);
    } catch (err) {
      toast.error("Erreur lors du chargement des calages");
    }
  };
  const fillForm = (calage: any) => {
    const fillForm = (calage: Calage) => {
      setNewCalage({
        ...calage,
      });
    };
  };
  const handleChange = (field: keyof Calage, value: any) => {
    setNewCalage((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (modalMode === "edit" && selectedCalage?.id) {
        const updated = await authFetch(`/calages/${selectedCalage.id}`, {
          method: "PUT",
          body: JSON.stringify(newCalage),
        });

        setCalages((prev) =>
          prev.map((c) => (c.id === updated.id ? updated : c)),
        );

        toast.success("Calage modifié !");
        await fetchCalages();
      } else {
        const created = await authFetch("/calages", {
          method: "POST",
          body: JSON.stringify(newCalage),
        });

        setCalages((prev) => [...prev, created]);

        toast.success("Calage ajouté !");
        await fetchCalages();
      }

      setShowModal(false);
      setNewCalage(INITIAL_CALAGE);
    } catch (err) {
      console.error(err);
      toast.error("Erreur !");
    }
  };

  const deleteCalage = async (id: number) => {
    try {
      await authFetch(`/calages/${id}`, { method: "DELETE" });
      setCalages((prev) => prev.filter((c) => c.id !== id));
      toast.success("Calage supprimé !");
      await fetchCalages();
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de la suppression !");
    }
  };

  return (
    <div className="space-y-5  p-3">
      <div className="flex items-center justify-between">
        {" "}
        <div>
          <h1 className="text-3xl font-semibold text-black text-left">
            Gestion des calages
          </h1>
          <p className="text-gray-600 py-2">
            Gérer les configurations de calage pour les essais
          </p>
        </div>
        <button
          onClick={() => {
            setModalMode("add");
            setNewCalage(INITIAL_CALAGE);
            setSelectedCalage(null);
            setShowModal(true);
          }}
          className="h-11 px-6 bg-[#E30613] text-white rounded-lg hover:brightness-110 flex items-center gap-2 transition-all shadow-md"
        >
          <Plus className="w-5 h-5" />
          Ajouter un calage
        </button>
      </div>

      <div className="p-5 bg-white rounded-xl border border-gray-250 shadow-sm flex items-center gap-4">
        {/* Recherche */}
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 transition-colors group-focus-within:text-[#E30613]" />
          <input
            type="text"
            placeholder="Rechercher par nom..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full h-11 pl-10 pr-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E30613]/50  transition"
          />
        </div>

        {/* Filtre véhicule */}
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
        <select
          value={filterVehicule}
          onChange={(e) => setFilterVehicule(e.target.value)}
          className="w-full sm:w-48 h-12 px-4 border border-gray-200 rounded-lg shadow-sm text-sm"
        >
          <option value="Tous">Tous les véhicules</option>

          {vehicules.map((v) => (
            <option key={v.id} value={v.id}>
              {v.identificateur}
            </option>
          ))}
        </select>

        {/* Filtre loi de route */}
        <select
          value={filterLoi}
          onChange={(e) => setFilterLoi(e.target.value)}
          className="w-full sm:w-48 h-12 px-4 border border-gray-200 rounded-lg shadow-sm text-sm"
        >
          <option value="Tous">Toutes les lois</option>

          {loisRoutes.map((l) => (
            <option key={l.id} value={l.id}>
              {l.nom}
            </option>
          ))}
        </select>
        {/* Bouton ajouter */}
      </div>
      <Dialog open={showConfirmDelete} onOpenChange={setShowConfirmDelete}>
        {/* On active le mode transparent ici */}
        <DialogContent className="max-w-md" hideOverlay={true}>
          <DialogHeader>
            <DialogTitle>Confirmation de suppression</DialogTitle>
          </DialogHeader>
          <p className="py-4 text-gray-700">
            Voulez-vous vraiment supprimer le véhicule{" "}
            <span className="font-bold">{selectedCalage?.nom}</span> ?
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
                if (selectedCalage?.id != null) {
                  deleteCalage(selectedCalage.id);
                }
                setShowConfirmDelete(false);
                setSelectedCalage(null);
              }}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm"
            >
              Confirmer suppression
            </button>
          </div>
        </DialogContent>
      </Dialog>
      {/* Tableau des calages */}
      <div className="bg-white rounded-xl border border-gray-250 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-sm text-left">
            {/* Header */}
            <thead className="bg-[#F1F5F9] border-b border-gray-300">
              <tr>
                <th className="px-3 py-4 font-semibold text-gray-600">
                  Nom du calage
                </th>
                <th className="px-3 py-4 text-left font-semibold text-gray-600">
                  Client
                </th>
                <th className="px-4 py-4 font-semibold text-gray-600">
                  Véhicule associé
                </th>
                <th className="px-4 py-4 text-left font-semibold text-gray-600">
                  Loi de route
                </th>
                <th className="px-1 py-4 font-semibold text-gray-600">
                  Température (°C)
                </th>
                <th className="px-4 py-4 font-semibold text-gray-600">A (N)</th>
                <th className="px-4 py-4 font-semibold text-gray-600">
                  B (N/km/h)
                </th>
                <th className="px-5 py-4 font-semibold text-gray-600">
                  C (N/(km/h)²)
                </th>
                <th className="px-2 py-4 font-semibold text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>

            {/* Body */}
            <tbody>
              {filteredCalages.map((calages) => (
                <tr
                  key={calages.id}
                  className="border-b border-gray-100 hover:bg-[#F9FBFD] transition-colors group"
                >
                  {/* Nom */}
                  <td className="px-5 py-4 font-medium text-gray-800">
                    {calages.nom}
                  </td>
                  {/* client */}
                  <td className="px-4 py-4 text-gray-600">{calages.client}</td>

                  <td className="px-5 py-4 text-gray-600">
                    {calages.vehiculeAssocie?.identificateur}
                  </td>

                  <td className="px-5 py-4 text-gray-600">
                    {calages.loiRouteAssocie?.nom}{" "}
                  </td>

                  {/* Mode */}
                  <td className="px-5 py-4 text-gray-600">
                    <span className="px-3 py-1 text-gray-600 rounded-full text-xs font-medium">
                      {calages.temperature}
                    </span>
                  </td>

                  {/* A */}
                  <td className="px-5 py-4 text-gray-600">{calages.a}</td>

                  {/* B */}
                  <td className="px-5 py-4 text-gray-600">{calages.b}</td>

                  {/* C */}
                  <td className="px-5 py-4 text-gray-600">{calages.c}</td>

                  {/* Actions */}
                  {/* Actions */}
                  <td className="px-2 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Eye
                        className="cursor-pointer w-4 h-4 text-blue-600"
                        onClick={() => {
                          setSelectedCalage(calages);
                          setNewCalage(calages);
                          fillForm(calages);
                          setModalMode("view");
                          setShowModal(true);
                        }}
                      />
                      <Edit
                        className="cursor-pointer w-4 h-4 text-green-600"
                        onClick={() => {
                          setSelectedCalage(calages);
                          setNewCalage(calages);
                          fillForm(calages);
                          setModalMode("edit");
                          setShowModal(true);
                        }}
                      />
                      <button className="p-1.5 hover:bg-red-50 rounded-lg transition text-red-600 hover:text-red-800">
                        <Trash2
                          className="cursor-pointer w-4 h-4 text-red-600"
                          onClick={() => {
                            setSelectedCalage(calages);
                            setShowConfirmDelete(true);
                          }}
                        />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {/* Aucun résultat */}
              {filteredCalages.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-gray-400">
                    Aucun calage trouvé
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* Modal formulaire */}
      {showModal && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-[500px] max-h-[95vh] overflow-hidden rounded-2xl shadow-2xl flex flex-col">
            {/* HEADER */}
            <div className="flex justify-between items-center py-3.5 px-6 border-b bg-gray-90">
              <h2 className="text-xl font-bold text-slate-800">
                {modalMode === "add" && "Ajouter un calage"}
                {modalMode === "edit" && "Modifier le calage"}
                {modalMode === "view" && "Détails du calage"}
              </h2>

              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* BODY */}
            <form
              onSubmit={handleSubmit}
              noValidate={false}
              className="overflow-y-auto px-6 py-6 space-y-4"
            >
              {/* SECTION 1 : Identification */}
              <section>
                <h3 className="font-semibold text-[#E30613] uppercase text-sm tracking-wider mb-2">
                  Identification
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Nom */}
                  <div className="flex flex-col gap-1.5 py-2">
                    <label className="text-xs font-medium text-gray-900 gap-1">
                      Nom du calage
                      <span className="text-red-500 ml-1">*</span>
                    </label>

                    <input
                      type="text"
                      placeholder="ClioV_WLTP_01"
                      value={newCalage.nom}
                      required
                      onChange={(e) => handleChange("nom", e.target.value)}
                      disabled={modalMode === "view"}
                      className="h-11 px-4 border border-gray-300 rounded-lg
                focus:ring-2 focus:ring-[#E30613]/30 outline-none"
                    />
                  </div>

                  {/* Client */}
                  <div className="flex flex-col gap-1.5 py-2">
                    <label className="text-xs font-medium text-gray-900">
                      Client
                      <span className="text-red-500 ml-1">*</span>
                    </label>

                    <select
                      value={newCalage.client}
                      required
                      onChange={(e) =>
                        handleChange("client", e.target.value as Client)
                      }
                      disabled={modalMode === "view"}
                      className="h-11 px-4 border border-gray-300 rounded-lg
                      focus:ring-2 focus:ring-[#E30613]/30 bg-white outline-none"
                    >
                      <option value="">Sélectionner client</option>

                      {Object.values(Client).map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5  md:col-span-1">
                    <label className="text-xs font-medium text-gray-900">
                      Température (°C)
                      <span className="text-red-500 ml-1">*</span>
                    </label>

                    <input
                      type="number"
                      placeholder=""
                      required
                      value={newCalage.temperature}
                      onChange={(e) =>
                        handleChange("temperature", Number(e.target.value))
                      }
                      disabled={modalMode === "view"}
                      className="h-11 px-4 border border-gray-300 rounded-lg
                focus:ring-2 focus:ring-[#E30613]/30 outline-none"
                    />
                  </div>
                </div>
              </section>

              {/* SECTION 2 : Associations */}
              <section>
                <h3 className="font-semibold text-[#E30613] uppercase text-sm tracking-wider  mb-4">
                  Associations
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Véhicule */}
                  <div className="flex flex-col gap-1.5 ">
                    <label className="text-xs font-medium text-gray-900">
                      Véhicule
                      <span className="text-red-500 ml-1">*</span>
                    </label>

                    <select
                      value={newCalage.vehiculeAssocie?.id || ""}
                      onChange={(e) =>
                        handleChange("vehiculeAssocie", {
                          id: Number(e.target.value),
                        })
                      }
                      disabled={modalMode === "view"}
                      required
                      className="h-11 px-4 border border-gray-300 rounded-lg
  focus:ring-2 focus:ring-[#E30613]/30 bg-white outline-none"
                    >
                      <option value="">Sélectionner véhicule</option>

                      {vehicules.map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.identificateur}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Loi de route */}
                  <div className="flex flex-col gap-1.5 ">
                    <label className="text-xs font-medium text-gray-900">
                      Loi de route
                      <span className="text-red-500 ml-1">*</span>
                    </label>

                    <select
                      value={newCalage.loiRouteAssocie?.id || ""}
                      onChange={(e) =>
                        handleChange("loiRouteAssocie", {
                          id: Number(e.target.value),
                        })
                      }
                      disabled={modalMode === "view"}
                      required
                      className="h-11 px-4 border border-gray-300 rounded-lg
    focus:ring-2 focus:ring-[#E30613]/30 bg-white outline-none"
                    >
                      <option value="">Sélectionner loi</option>

                      {loisRoutes.map((l) => (
                        <option key={l.id} value={l.id}>
                          {l.nom}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </section>

              {/* SECTION 3 : Coefficients */}
              <section>
                <h3 className="font-semibold text-[#E30613] uppercase text-sm tracking-wider mb-1 py-4">
                  Coefficients provisoires
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="flex flex-col gap-1.5 ">
                    <label className="text-xs font-medium text-gray-900">
                      A (N)
                      <span className="text-red-500 ml-1">*</span>
                    </label>

                    <input
                      type="number"
                      value={newCalage.a}
                      onChange={(e) =>
                        handleChange("a", Number(e.target.value))
                      }
                      disabled={modalMode === "view"}
                      required
                      className="h-11 px-4 border border-gray-300 rounded-lg
                focus:ring-2 focus:ring-[#E30613]/30 outline-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-gray-900">
                      B (N/km/h)
                      <span className="text-red-500 ml-1">*</span>
                    </label>

                    <input
                      type="number"
                      value={newCalage.b}
                      onChange={(e) =>
                        handleChange("b", Number(e.target.value))
                      }
                      required
                      disabled={modalMode === "view"}
                      className="h-11 px-4 border border-gray-300 rounded-lg
                focus:ring-2 focus:ring-[#E30613]/30 outline-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-gray-900">
                      C (N/(km/h)²)
                      <span className="text-red-500 ml-1">*</span>
                    </label>

                    <input
                      type="number"
                      value={newCalage.c}
                      onChange={(e) =>
                        handleChange("c", Number(e.target.value))
                      }
                      disabled={modalMode === "view"}
                      required
                      className="h-11 px-4 border border-gray-300 rounded-lg
                focus:ring-2 focus:ring-[#E30613]/30 outline-none"
                    />
                  </div>
                </div>
              </section>

              {/* SECTION 4 : Description */}
              <section>
                <label className="text-xs font-medium text-gray-900 block mb-2">
                  Description
                </label>

                <textarea
                  placeholder="Informations supplémentaires..."
                  value={newCalage.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  disabled={modalMode === "view"}
                  className="w-full h-28 p-4 border border-gray-300 rounded-lg
            focus:ring-2 focus:ring-[#E30613]/30 outline-none resize-none"
                />
              </section>

              {modalMode !== "view" && (
                <div className="flex justify-end gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-5 py-2 border rounded-lg"
                  >
                    Annuler
                  </button>

                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#E30613] text-white rounded-lg"
                  >
                    {modalMode === "edit" ? "Modifier" : "Ajouter"}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
