import { useEffect, useState } from "react";
import { authFetch } from "../api";
import {
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  FileSpreadsheet,
  Upload,
  CheckCircle2,
} from "lucide-react";
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

export enum FamilleTest {
  WLTC = "WLTC",
  RDE = "RDE",
}

interface cycle {
  id?: number;
  nom: string;
  familleTest: FamilleTest;
  client: Client;
  duree: number | null;
  dureeUnit: string;
  nombrePhase: number | null;
  nombreStabilises: number | null;
  traceFilePath: string;
}

const familleColors: { [key: string]: string } = {
  WLTC: "bg-[#E3F2FD] text-[#1565C0]",
  RDE: "bg-[#E8F5E9] text-[#2E7D32]",
};

export function Cycles() {
  const [cycles, setCycles] = useState<cycle[]>([]);
  const [searchText, setSearchText] = useState("");
  const [familleFilter, setFamilleFilter] = useState("Tous");
  const [userClient, setUserClient] = useState<string>("");
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"view" | "edit" | "add">("add");
  const [role, setRole] = useState<string>("");
  const canEdit = role?.includes("ADMIN") || role?.includes("CHARGE_ESSAI");
  const [selectedCycle, setSelectedCycle] = useState<cycle | null>(null);
  const [traceFilePath, setTraceFilePath] = useState<File | null>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const [form, setForm] = useState({
    nom: "",
    client: null as Client | null,
    famille: FamilleTest.WLTC,
    duree: "",
    dureeUnit: "s",
    nombrePhase: "",
    nombreStabilite: "",
  });

  // ================= LOAD =================
  const loadCycles = async () => {
    try {
      const data = await authFetch("/cycles");
      setCycles(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadCycles();
  }, []);

  // ================= OPEN MODAL =================
  const openModal = (mode: "add" | "edit" | "view", cycle?: cycle) => {
    // 1. RESET complet d'abord
    if (mode === "add") {
      setSelectedCycle(null);

      setForm({
        nom: "",
        client: userClient as Client,
        famille: FamilleTest.WLTC,
        duree: "",
        dureeUnit: "s",
        nombrePhase: "",
        nombreStabilite: "",
      });

      setTraceFilePath(null);
    }

    // 2. ensuite seulement edit/view
    if (cycle && mode !== "add") {
      setSelectedCycle(cycle);

      setForm({
        nom: cycle.nom ?? "",
        client: cycle.client ?? null,
        famille: cycle.familleTest ?? FamilleTest.WLTC,
        duree: cycle.duree?.toString() ?? "",
        dureeUnit: cycle.dureeUnit ?? "s",
        nombrePhase: cycle.nombrePhase?.toString() ?? "",
        nombreStabilite: cycle.nombreStabilises?.toString() ?? "",
      });

      setTraceFilePath(null);
    }

    setModalMode(mode);
    setShowModal(true);
  };
  // ================= ADD =================
  const handleAddCycle = async () => {
    const payload = {
      nom: form.nom,
      client: form.client ?? userClient,
      familleTest: form.famille,
      duree: Number(form.duree),
      dureeUnit: form.dureeUnit,
      nombrePhase: Number(form.nombrePhase),
      nombreStabilises: Number(form.nombreStabilite),
      traceFilePath: traceFilePath?.name || "",
    };

    try {
      const created = await authFetch("/cycles", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      setCycles([...cycles, created]);
      setShowModal(false);
      toast.success("Cycle ajouté avec succées");
    } catch (err) {
      console.error(err);
      toast.error("Erreur ajout");
    }
  };

  // ================= UPDATE =================
  const updateCycle = async () => {
    if (!selectedCycle?.id) return;

    const payload = {
      nom: form.nom,
      client: form.client,
      familleTest: form.famille,
      duree: Number(form.duree),
      dureeUnit: form.dureeUnit,
      nombrePhase: Number(form.nombrePhase),
      nombreStabilises: Number(form.nombreStabilite),
      traceFilePath: traceFilePath?.name || selectedCycle.traceFilePath,
    };

    try {
      const updated = await authFetch(`/cycles/${selectedCycle.id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });

      setCycles((prev) =>
        prev.map((c) => (c.id === selectedCycle.id ? updated : c)),
      );

      setShowModal(false);
      toast.success("Cycle modifié");
    } catch (err) {
      console.error(err);
      toast.error("Erreur update");
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (modalMode === "edit") {
      await updateCycle();
    } else {
      await handleAddCycle();
    }
  };
  // ================= DELETE =================
  const deleteCycle = async (id: number) => {
    try {
      await authFetch(`/cycles/${id}`, { method: "DELETE" });
      setCycles((prev) => prev.filter((c) => c.id !== id));
      toast.success("Cycle supprimé");
    } catch (err) {
      console.error(err);
      toast.error("Erreur delete");
    }
  };

  // ================= FILTER =================
  const filteredCycles = cycles.filter((c) => {
    const matchText =
      c.nom.toLowerCase().includes(searchText.toLowerCase()) ||
      c.familleTest.toLowerCase().includes(searchText.toLowerCase());

    const matchFamille =
      familleFilter === "Tous" || c.familleTest === familleFilter;

    return matchText && matchFamille;
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await authFetch("/users/me");
        setRole(user.role);
        setUserClient(user.client);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUser();
  }, []);
  return (
    <div className="space-y-5 p-3">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-foreground mb-2">
          Gestion des cycles
        </h1>
        <p className="text-muted-foreground-600">
          Gérer les cycles de roulage pour les essais
        </p>
      </div>
      <div className="p-4 bg-card rounded-xl shadow-sm border border-gray-200 flex items-center gap-4 w-full">
        {/* Recherche - On lui donne plus de poids visuel */}
        <div className="flex flex-col sm:flex-row gap-3 items-center">
          {/* Recherche par nom */}
          <div className="relative flex-1 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground-400  transition-colors" />
            <input
              type="text"
              placeholder="Rechercher par nom..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full h-11 pl-30 pr-4 bg-background border border-border rounded-lg text-sm text-foreground outline-none focus:ring-2 focus:ring-ring transition"
            />
          </div>

          {/* Filtre famille */}
          <div className="relative w-48">
            <select
              value={familleFilter}
              onChange={(e) => setFamilleFilter(e.target.value)}
              className="w-full bg-background border border-border rounded-lg px-3 py-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring appearance-none transition"
            >
              <option value="Tous">Toutes les familles</option>

              {Object.values(FamilleTest).map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>

            {/* flèche */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground-400">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>
        {/* On active le mode transparent ici */}
        {showConfirmDelete && (
          <Dialog open={showConfirmDelete}>
            {" "}
            <DialogContent className="max-w-md" hideOverlay={true}>
              <DialogHeader>
                <DialogTitle>Confirmation de suppression</DialogTitle>
              </DialogHeader>
              <p className="py-4 text-muted-foreground-700">
                Voulez-vous vraiment supprimer le cycle{" "}
                <span className="font-bold">{selectedCycle?.nom}</span> ?
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
                    if (selectedCycle?.id != null) {
                      deleteCycle(selectedCycle.id);
                    }
                    setShowConfirmDelete(false);
                    setSelectedCycle(null);
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm"
                >
                  Confirmer suppression
                </button>
              </div>
            </DialogContent>
          </Dialog>
        )}{" "}
        {/* Bouton - Plus d'impact avec une ombre portée */}
        {canEdit && (
          <button
            onClick={() => openModal("add")}
            className="ml-auto h-11 px-6 bg-[#E30613] text-white rounded-lg hover:brightness-110 flex items-center gap-2 transition-all shadow-md"
          >
            <Plus className="w-5 h-5" />
            <span>Ajouter un cycle</span>
          </button>
        )}
      </div>
      {/* Tableau des cycles */}
      <div className="bg-card rounded-xl border border-gray-300 shadow-sm overflow-x-auto">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-sm text-left border-collapse">
            {/* Header */}
            <thead className="bg-[#E30613] border-b border-gray-400">
              <tr>
                {[
                  "Nom du cycle",
                  "Client",
                  "Famille",
                  "Durée",
                  "Unité",
                  "Nombre de phase",
                  "Trace ",
                  "Actions",
                ].map((title) => (
                  <th
                    key={title}
                    className="px-4 py-5 text-left font-semibold text-white"
                  >
                    {title}
                  </th>
                ))}
              </tr>
            </thead>

            {/* Body */}
            <tbody>
              {filteredCycles.map((c) => (
                <tr
                  key={c.id}
                  className="border-b border-gray-200 hover:bg-[#E30613]/3 transition-colors"
                >
                  {/* Nom */}
                  <td className="px-4 py-4 font-bold text-muted-foreground-800">
                    {c.nom}
                  </td>
                  {/* Nom */}
                  <td className="px-2 py-4 text-muted-foreground-800">
                    {c.client}
                  </td>

                  {/* Famille */}
                  <td className="px-5 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${familleColors[c.familleTest]}`}
                    >
                      {c.familleTest}
                    </span>
                  </td>

                  {/* Durée */}
                  <td className="px-5 py-4 text-muted-foreground-800">
                    {c.duree}
                  </td>
                  <td className="px-5 py-4 text-muted-foreground-800">
                    {c.dureeUnit}
                  </td>

                  {/* nombrePhase */}
                  <td className="px-16 py-4 text-muted-foreground-800">
                    {c.nombrePhase}
                  </td>

                  {/* traceFilePathPath */}
                  <td className="px-5 py-4">
                    {c.traceFilePath ? (
                      <div className="flex items-center gap-2 text-muted-foreground-800 max-w-[200px]">
                        <FileSpreadsheet className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">{c.traceFilePath}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground-400">—</span>
                    )}
                  </td>
                  {/* Actions */}
                  <td className="px-4 py-4 text-right">
                    <div className="flex items-center gap-2 justify-end">
                      {/* Voir : tout le monde */}
                      <button
                        onClick={() => {
                          openModal("view", c);
                          setSelectedCycle(c);
                          setShowModal(true);
                        }}
                        className="p-1 rounded-lg bg-blue-100 hover:bg-blue-200"
                      >
                        <Eye className="w-4 h-4 text-blue-700" />
                      </button>

                      {/* Actions seulement ADMIN ou CHARGE_ESSAI */}
                      {canEdit && (
                        <>
                          {/* Modifier */}
                          <button
                            onClick={() => {
                              openModal("edit", c);
                              setSelectedCycle(c);
                              setShowModal(true);
                            }}
                            className="p-1 rounded-lg bg-green-100 hover:bg-green-200"
                          >
                            <Edit className="w-4 h-4 text-green-700" />
                          </button>

                          {/* Supprimer */}
                          <button
                            onClick={() => {
                              setSelectedCycle(c);
                              setShowConfirmDelete(true);
                            }}
                            className="p-1 rounded-lg bg-red-100 hover:bg-red-200"
                          >
                            <Trash2 className="w-4 h-4 text-red-700" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* MODAL OPTIMISÉ */}
      {showModal && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card w-full max-w-[500px] max-h-[95vh] overflow-hidden rounded-2xl shadow-2xl flex flex-col">
            {/* HEADER */}
            <div className="px-6 py-3.5 border-b border-slate-300 flex justify-between items-center bg-card">
              <h2 className="text-xl font-semibold text-muted-foreground-800">
                {modalMode === "add" && "Ajouter un cycle"}
                {modalMode === "edit" && "Modifier un cycle"}
                {modalMode === "view" && "Détails d'un cycle"}
              </h2>

              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>
            {/* BODY */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Section 1: Identification */}
              <section>
                <h3 className="flex items-center gap-2 text-sm font-semibold text-[#E30613] uppercase tracking-wider mb-1">
                  Identification
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-muted-foreground-900">
                      Nom du cycle
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      value={form.nom}
                      disabled={modalMode === "view"}
                      required
                      placeholder="Nom du cycle"
                      onChange={(e) =>
                        setForm({
                          ...form,
                          nom: e.target.value,
                        })
                      }
                      className="h-11 px-4 rounded-lg border border-border bg-background text-foreground
focus:outline-none focus:ring-2 focus:ring-ring transition"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-muted-foreground-530">
                      Client <span className="text-red-500 ml-1">*</span>
                    </label>

                    <input
                      name="client"
                      value={userClient}
                      readOnly
                      className="h-11 px-3 rounded-lg border border-border bg-background text-foreground
focus:outline-none focus:ring-2 focus:ring-ring transition"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-muted-foreground-900">
                      Famille
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <select
                      value={form.famille}
                      required
                      disabled={modalMode === "view"}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          famille: e.target.value as FamilleTest,
                        })
                      }
                      className="h-11 px-4 rounded-lg border border-border bg-background text-foreground
focus:outline-none focus:ring-2 focus:ring-ring transition"
                    >
                      {Object.values(FamilleTest).map((f) => (
                        <option key={f} value={f}>
                          {f}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </section>

              {/* Section: Caractéristiques */}
              <section>
                <h3 className="flex items-center gap-2 text-sm font-semibold text-[#E30613] uppercase tracking-wider mb-1">
                  Caractéristiques
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Durée */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-muted-foreground-900">
                      Durée <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      value={form.duree}
                      disabled={modalMode === "view"}
                      onChange={(e) =>
                        setForm({ ...form, duree: e.target.value })
                      }
                      className="h-11 px-4 rounded-lg border border-border bg-background text-foreground
        focus:outline-none focus:ring-2 focus:ring-ring transition"
                    />
                  </div>

                  {/* Unité */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-muted-foreground-900">
                      Unité <span className="text-red-500 ml-1">*</span>
                    </label>
                    <select
                      disabled={modalMode === "view"}
                      required
                      onChange={(e) =>
                        setForm({ ...form, dureeUnit: e.target.value })
                      }
                      className="h-11 px-4 rounded-lg border border-border bg-background text-foreground
        focus:outline-none focus:ring-2 focus:ring-ring transition"
                    >
                      <option value="s">sec</option>
                      <option value="min">min</option>
                      <option value="heure">heure</option>
                    </select>
                  </div>

                  {/* Nombre de phases */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-muted-foreground-900">
                      Nombre Phase <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      value={form.nombrePhase}
                      disabled={modalMode === "view"}
                      onChange={(e) =>
                        setForm({ ...form, nombrePhase: e.target.value })
                      }
                      className="h-11 px-4 rounded-lg border border-border bg-background text-foreground
        focus:outline-none focus:ring-2 focus:ring-ring transition"
                    />
                  </div>

                  {/* Nombre de stabilités */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-muted-foreground-900">
                      Nombre stabilités
                    </label>
                    <input
                      type="number"
                      value={form.nombreStabilite}
                      disabled={modalMode === "view"}
                      onChange={(e) =>
                        setForm({ ...form, nombreStabilite: e.target.value })
                      }
                      className="h-11 px-4 rounded-lg border border-border bg-background text-foreground
        focus:outline-none focus:ring-2 focus:ring-ring transition"
                    />
                  </div>

                  {/* Upload fichier (prend toute la ligne) */}
                  <div className="md:col-span-2">
                    <h4 className="text-xs font-medium text-muted-foreground-900">
                      Données de trace{" "}
                      <span className="text-red-500 ml-1">*</span>
                    </h4>

                    <div
                      className={`border border-dashed rounded-lg min-h-2 flex flex-col items-center justify-center cursor-pointer transition-all
        ${
          traceFilePath
            ? "border-emerald-400 bg-emerald-50/30"
            : "border-gray-300 hover:border-gray-600 hover:bg-gray-50"
        }`}
                    >
                      <input
                        type="file"
                        className="hidden"
                        id="file-upload"
                        accept=".xls,.xlsx"
                        onChange={(e) =>
                          setTraceFilePath(e.target.files?.[0] || null)
                        }
                      />

                      <label
                        htmlFor="file-upload"
                        className="cursor-pointer flex flex-col items-center"
                      >
                        {traceFilePath ? (
                          <>
                            <CheckCircle2 className="w-5 h-5 text-emerald-500 mb-1" />
                            <span className="text-emerald-700 text-sm font-semibold">
                              {traceFilePath.name}
                            </span>
                            <span className="text-emerald-500 text-[10px] mt-0.5">
                              Fichier prêt à l'import
                            </span>
                          </>
                        ) : (
                          <>
                            <div className="w-10 h-10 flex items-center justify-center rounded-lg border border-border bg-background">
                              <Upload className="w-4 h-4" />
                            </div>
                            <span className="text-muted-foreground text-xs font-medium text-center mt-2">
                              Cliquez pour importer ou glissez un fichier
                            </span>
                          </>
                        )}
                      </label>
                    </div>
                  </div>
                </div>
              </section>
              <div className="flex justify-end gap-38 mt-8">
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
              </div>
            </form>

            {/* FOOTER */}
          </div>
        </div>
      )}
    </div>
  );
}
