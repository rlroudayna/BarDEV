import { useState, useEffect } from "react";
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
export enum Norme {
  WLTP = "WLTP",
  NEDC = "NEDC",
  RDE = "RDE",
}

interface Lois {
  id?: number;
  nom: string;
  temperature: number | null;
  client: Client | "";
  norme: Norme | "";
  inertieKg: number | null;
  masseEssaiKg: number | null;
  inertieRotativeTNRKg: number | null;
  inertieRotativeDeuxTrainsKg: number | null;
  f0: number | null;
  f1: number | null;
  f2: number | null;
  description: string;
}
const INITIAL_LOIS: Lois = {
  nom: "",
  temperature: null,
  client: "",
  norme: "",
  inertieKg: null,
  masseEssaiKg: null,
  inertieRotativeTNRKg: null,
  inertieRotativeDeuxTrainsKg: null,
  f0: null,
  f1: null,
  f2: null,
  description: "",
};
export function LoisDeRoute() {
  const [lois, setLois] = useState<any[]>([]);
  const [LoisToDelete, setVehicleToDelete] = useState<Lois | null>(null);
  const [modalMode, setModalMode] = useState<"view" | "edit" | "add">("add");
  const [selectedLois, setSelectedLois] = useState<Lois | null>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [loisToDelete, setLoisToDelete] = useState<Lois | null>(null);
  const isReadOnly = modalMode === "view";
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInertie, setSearchInertie] = useState("");
  const [clientFilter, setClientFilter] = useState("Tous");

  const clients = ["RENAULT", "STELLANTIS", "FEV"];
  const filteredLois = lois.filter((loi) => {
      const matchNom =
  searchTerm === "" ||
  loi.nom?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClient =
      clientFilter === "Tous" || loi.client === clientFilter;

    const matchInertie =
      searchInertie === "" || loi.inertieKg?.toString().includes(searchInertie);

    return matchNom && matchesClient && matchInertie;
  });
  useEffect(() => {
    // Récupération des véhicules
    const fetchVehicles = async () => {
      try {
        const data = await authFetch("/lois-route");
        setLois(data ?? []); // ⚡ Si data est null, on met un tableau vide
      } catch (err) {
        console.error("Erreur fetch véhicules :", err);
        setLois([]); // ⚡ fallback en cas d'erreur
      }
    };
    fetchVehicles();
  }, []);
  const handleAddLois = async (vehicle: any) => {
    try {
      const data = await authFetch("/lois-route", {
        method: "POST",
        body: JSON.stringify(vehicle),
      });

      setLois((prev) => [...prev, data]);
      setShowModal(false);
    } catch (err) {
      console.error(err);
    }
  };
  const addLois = async (newLois: Lois) => {
    try {
      const created = await authFetch("/lois-route", {
        method: "POST",
        body: JSON.stringify(newLois),
      });
      setLois((prev) => [...prev, created]);
      setShowModal(false);
      toast.success("Lois de route créé avec succès !"); // ✅ succès
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de la création du lois !"); // ❌ erreur
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (modalMode === "edit" && selectedLois?.id) {
        const updated = await authFetch(`/lois-route/${selectedLois.id}`, {
          method: "PUT",
          body: JSON.stringify(newLois),
        });

        setLois((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));

        toast.success("Loi modifiée avec succès !");
      } else {
        const created = await authFetch("/lois-route", {
          method: "POST",
          body: JSON.stringify(newLois),
        });

        setLois((prev) => [...prev, created]);

        toast.success("Loi ajoutée avec succès !");
      }

      setShowModal(false);
      setNewLois(INITIAL_LOIS);
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de l'enregistrement !");
    }
  };
  const deleteLois = async (id: number) => {
    try {
      await authFetch(`/lois-route/${id}`, { method: "DELETE" });
      setLois((prev) => prev.filter((l) => l.id !== id));
      toast.success("Lois de route supprimé !");
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de la suppression !");
    }
  };
  const [newLois, setNewLois] = useState<Lois>({
    nom: "",
    temperature: 0,
    client: "" as Client,
    norme: Norme.WLTP,
    inertieKg: 0,
    masseEssaiKg: 0,
    inertieRotativeTNRKg: 0,
    inertieRotativeDeuxTrainsKg: 0,
    f0: 0,
    f1: 0,
    f2: 0,
    description: "",
  });

  const handleChange = (field: keyof Lois, value: any) => {
    setNewLois((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  return (
    <div className="space-y-5  p-3">
      <div>
        <h1 className="text-3xl font-semibold text-black mb-2">
          Gestion de lois de route
        </h1>
        <p className="text-gray-600">
          Paramétrer les lois de simulation des efforts routiers
        </p>
      </div>

      <div className="p-5 bg-white rounded-xl border border-gray-250 shadow-sm flex items-center gap-4">
        {/* Recherche nom */}
        <div className="flex-1 relative ">
          <Search className="absolute  bg-white left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

          <input
            type="text"
            placeholder="Rechercher par nom"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-11 pl-10 pr-4 border border-[#E0E0E0] rounded-lg focus:outline-none focus:border-[#0288D1]"
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

        {/* Recherche inertie */}
        <div className="w-64 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

          <input
            type="number"
            placeholder="Rechercher par inertie"
            value={searchInertie}
            onChange={(e) => setSearchInertie(e.target.value)}
            className="w-62 h-11 px-8 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E30613]/30 "
          />
        </div>

        {/* Bouton */}
        {/* Bouton Ajouter */}
        <button
          onClick={() => {
            setNewLois(INITIAL_LOIS); // <--- On vide le formulaire ici
            setModalMode("add"); // <--- On s'assure d'être en mode ajout
            setShowModal(true);
          }}
          className="h-11 px-6 bg-[#E30613] text-white rounded-lg hover:brightness-110 flex items-center gap-2 transition-all shadow-md"
        >
          <Plus className="w-5 h-5" />
          Ajouter une loi de route
        </button>
      </div>
      {/* Tableau des lois */}
      <div className="bg-white rounded-xl border border-gray-250 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-sm text-left">
            {/* Header */}
            <thead className="bg-[#F1F5F9] border-b border-gray-300">
              <tr>
                <th className="px-8 py-4 font-semibold text-gray-600">
                  Nom de la loi
                </th>
                <th className="px-6 py-4 font-semibold text-gray-600">
                  Client
                </th>

                <th className="px-3 py-4 font-semibold text-gray-600">Norme</th>
                <th className="px-5 py-4 font-semibold text-gray-600">
                  Temperature(°C)
                </th>
                <th className="px-4 py-4 font-semibold text-gray-600">
                  Inertie(kg)
                </th>
                <th className="px-4 py-4 font-semibold text-gray-600">
                  Masse d’essai(kg)
                </th>
                <th className="px-4 py-4 font-semibold text-gray-600">
                  Inertie TNR(kg)
                </th>
                <th className="px-4 py-4 font-semibold text-gray-600">
                  Inertie 2T(kg)
                </th>

                <th className="px-3 py-4 font-semibold text-gray-600">F0(N)</th>
                <th className="px-4 py-4 font-semibold text-gray-600">
                  F1(N/km/h){" "}
                </th>
                <th className="px-4 py-4 font-semibold text-gray-600">
                  F2(N/(km/h)²)
                </th>
                <th className="px-4 py-4 font-semibold text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            {/* Body */}
            <tbody>
              {filteredLois.map((loi) => (
                <tr
                  key={loi.id}
                  className="border-b border-gray-100 hover:bg-[#F9FBFD] transition-colors group"
                >
                  {/* Nom - truncate pour éviter de casser la ligne si le nom est trop long */}
                  <td className="px-5 py-4 text-gray-800 font-bold ">
                    {loi.nom}
                  </td>
                  <td className="px-5 py-4 text-gray-600">{loi.client}</td>

                  <td className="px-2 py-4">
                    <span className="px-2 py-1 bg-[#E8F5E9] text-[#2E7D32] rounded-full text-[10px] font-bold uppercase tracking-wider">
                      {loi.norme}
                    </span>
                  </td>

                  <td className="px-10 py-4 text-gray-600">
                    {loi.temperature}
                  </td>

                  {/* Valeurs numériques - réduction des paddings pour gagner de la place */}
                  <td className="px-5 py-4 text-gray-600">
                    {loi.inertieKg}
                  </td>
                  <td className="px-4 py-4 text-gray-600">
                    {loi.masseEssaiKg}
                  </td>
                  <td className="px-4 py-4 text-gray-600">
                    {loi.inertieRotativeTNRKg} 
                  </td>
                  <td className="px-4 py-4 text-gray-600">
                    {loi.inertieRotativeDeuxTrainsKg}
                  </td>
                  <td className="px-3 py-4 text-gray-600">{loi.f0}</td>
                  <td className="px-4 py-4 text-gray-600">{loi.f1}</td>
                  <td className="px-4 py-4 text-gray-600">{loi.f2}</td>

                  {/* On active le mode transparent ici */}
                  <Dialog
                    open={showConfirmDelete}
                    onOpenChange={setShowConfirmDelete}
                  >
                    {/* On active le mode transparent ici */}
                    <DialogContent className="max-w-md" hideOverlay={true}>
                      <DialogHeader>
                        <DialogTitle>Confirmation de suppression</DialogTitle>
                      </DialogHeader>
                      <p className="py-4 text-gray-700">
                        Voulez-vous vraiment supprimer le véhicule{" "}
                        <span className="font-bold">{selectedLois?.nom}</span> ?
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
                            if (selectedLois?.id != null) {
                              deleteLois(selectedLois.id);
                            }
                            setShowConfirmDelete(false);
                            setSelectedLois(null);
                          }}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm"
                        >
                          Confirmer suppression
                        </button>
                      </div>
                    </DialogContent>
                  </Dialog>
                  {/* Actions */}
                  {/* Actions */}
                  <td className="px-4 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Eye
                        className="cursor-pointer w-4 h-4 text-blue-600"
                        onClick={() => {
                          setSelectedLois(loi);
                          setNewLois(loi);
                          setModalMode("view");
                          setShowModal(true);
                        }}
                      />
                      <Edit
                        className="cursor-pointer w-4 h-4 text-green-600"
                        onClick={() => {
                          setSelectedLois(loi);
                          setNewLois(loi);
                          setModalMode("edit");
                          setShowModal(true);
                        }}
                      />
                      <button className="p-1.5 hover:bg-red-50 rounded-lg transition text-red-600 hover:text-red-800">
                        <Trash2
                          className="cursor-pointer w-4 h-4 text-red-600"
                          onClick={() => {
                            setSelectedLois(loi);
                            setShowConfirmDelete(true);
                          }}
                        />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {/* Aucun résultat */}
              {filteredLois.length === 0 && (
                <tr>
                  <td colSpan={9} className="text-center py-10 text-gray-400">
                    Aucune loi trouvée
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white w-full max-w-[500px] max-h-[95vh] overflow-hidden rounded-2xl shadow-2xl flex flex-col">
              {/* HEADER */}
              <div className="px-6 py-3.5 border-b border-slate-300 flex justify-between items-center bg-white">
                <h2 className="text-xl font-semibold text-gray-800">
                  {modalMode === "add" && "Ajouter une loi de route"}
                  {modalMode === "edit" && "Modifier la loi de route"}
                  {modalMode === "view" && "Détails de la loi de route"}
                </h2>

                <button
                  onClick={() => setShowModal(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              </div>

              {/* BODY */}

              <form
                onSubmit={handleSubmit}
                className="overflow-y-auto p-6 space-y-6 bg-white"
              >
                {" "}
                {/* SECTION 1: Identification */}
                <section className="">
                  <div className="flex items-center gap-2 mb-6">
                    <h3 className="font-semibold text-[#E30613] uppercase text-sm tracking-wider">
                      {" "}
                      Identification
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      {
                        label: "Nom de la loi",
                        type: "text",
                        required: true,
                        placeholder: "ex: Loi  A1",
                        field: "nom",
                      },
                      {
                        label: "Température (°C)",
                        type: "number",
                        required: true,
                        placeholder: "23",
                        field: "temperature",
                      },
                    ].map((field, i) => (
                      <div key={i} className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-gray-530">
                          {field.label}
                          {field.required && (
                            <span className="text-red-500 ml-1">*</span>
                          )}
                        </label>

                        <input
                          type={field.type}
                          placeholder={field.placeholder}
                          disabled={isReadOnly}
                          required={field.required} // ✅ IMPORTANT
                          value={(newLois as any)[field.field]}
                          onChange={(e) =>
                            handleChange(
                              field.field as keyof Lois,
                              field.type === "number"
                                ? Number(e.target.value)
                                : e.target.value,
                            )
                          }
                          className="h-11 px-4 border border-gray-300 rounded-lg
      focus:ring-2 focus:ring-[#E30613]/30 transition-all outline-none"
                        />
                      </div>
                    ))}

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium text-gray-900">
                        Client
                        <span className="text-red-500 ml-1">*</span>
                      </label>

                      <select
                        value={newLois.client}
                        disabled={isReadOnly}
                        required
                        onChange={(e) =>
                          handleChange("client", e.target.value as Client)
                        }
                         className="h-11 px-4 border border-gray-300 rounded-lg
  focus:ring-2 focus:ring-[#E30613]/30 transition-all outline-none bg-white w-full"
>
                      
                        <option value="">Sélectionner un client</option>

                        {clients.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium text-gray-900">
                        Norme
                        <span className="text-red-500 ml-1">*</span>
                      </label>

                      <select
                        value={newLois.norme}
                        disabled={isReadOnly}
                        required
                        onChange={(e) =>
                          handleChange("norme", e.target.value as Norme)
                        }
                         className="h-11 px-4 border border-gray-300 rounded-lg
  focus:ring-2 focus:ring-[#E30613]/30 transition-all outline-none bg-white w-full"

                      >
                        <option value="">Choisir...</option>
                        <option>WLTP</option>
                        <option>NEDC</option>
                        <option>RDE</option>
                      </select>
                    </div>
                  </div>
                </section>
                {/* SECTION 2: Paramètres d'inertie */}
                <section className="">
                  <div className="flex items-center gap-3 mb-6">
                    <h3 className="font-semibold text-[#E30613] uppercase text-sm tracking-wider">
                      Paramètres d'inertie
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      { label: "Inertie (kg)", field: "inertieKg" },
                      { label: "Masse d'essai (kg)", field: "masseEssaiKg" },
                      {
                        label: "Inertie Rot. (1 train)",
                        field: "inertieRotativeTNRKg",
                      },
                      {
                        label: "Inertie Rot. (2 trains)",
                        field: "inertieRotativeDeuxTrainsKg",
                      },
                    ].map((item, i) => (
                      <div key={i} className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-gray-530">
                          {item.label}
                          <span className="text-red-500 ml-1">*</span>
                        </label>

                        <input
                          type="number"
                          disabled={isReadOnly}
                          required   
                          value={(newLois as any)[item.field]}
                          onChange={(e) =>
                            handleChange(
                              item.field as keyof Lois,
                              Number(e.target.value),
                            )
                          }
                          className="h-11 px-4 border border-gray-300 rounded-lg
      focus:ring-2 focus:ring-[#E30613]/30 outline-none"
                        />
                      </div>
                    ))}
                  </div>
                </section>
                {/* SECTION 3: Coefficients */}
                <section className="">
                  <div className="flex items-center gap-3 mb-6">
                    <h3 className="font-semibold text-[#E30613] uppercase text-sm tracking-wider">
                      Coefficients de résistance
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                      { label: "F0 (N)", field: "f0" },
                      { label: "F1 (N/km/h)", field: "f1" },
                      { label: "F2 (N/(km/h)²)", field: "f2" },
                    ].map((item, i) => (
                      <div key={i} className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-gray-530">
                          {item.label}
                          <span className="text-red-500 ml-1">*</span>
                        </label>

                        <input
                          type="number"
                          disabled={isReadOnly}
                          required   
                          value={(newLois as any)[item.field]}
                          onChange={(e) =>
                            handleChange(
                              item.field as keyof Lois,
                              Number(e.target.value),
                            )
                          }
                          className="h-11 px-4 border border-gray-300 rounded-lg
      focus:ring-2 focus:ring-[#E30613]/30 outline-none"
                        />
                      </div>
                    ))}
                  </div>
                </section>
                {/* SECTION 4: Commentaires */}
                <section className="">
                  <label className="text-xs font-medium text-gray-900 block mb-2">
                    Commentaires
                  </label>

                  <textarea
                    value={newLois.description}
                    disabled={isReadOnly}
                    onChange={(e) =>
                      handleChange("description", e.target.value)
                    }
                    className="w-full h-28 p-4 border border-gray-300 rounded-lg
  focus:ring-2 focus:ring-[#E30613]/30 outline-none resize-none"
                    placeholder="Informations additionnelles..."
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
                      className="px-6 py-2 bg-[#E30613] text-white rounded-lg"
                    >
                      {modalMode === "edit" ? "Modifier" : "Enregistrer"}
                    </button>
                  </div>
                )}
              </form>
              {/* BOUTONS */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
