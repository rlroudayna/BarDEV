import { useEffect, useState } from "react";
import { authFetch } from "../api";
import {
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  UserCircle,
  Mail,
  Phone,
  ShieldCheck,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/Dialog";


import { toast } from "sonner";

// Mock Data basée sur votre classe Utilisateur

const roleColors: Record<string, string> = {
  ADMIN: "bg-purple-100 text-purple-700",
  CHARGE_ESSAI: "bg-blue-100 text-blue-700",
  TECHNICIEN_ESSAI: "bg-green-100 text-green-700",
  EXTERNE: "bg-red-100 text-red-700",
};
const ALL_ROLES = "ALL";
const roles = [
  { label: "ADMIN", value: "ADMIN" },
  { label: "CHARGE_ESSAI", value: "CHARGE_ESSAI" },
  { label: "TECHNICIEN_ESSAI", value: "TECHNICIEN_ESSAI" },
  { label: "EXTERNE", value: "EXTERNE" },
];
export enum Client {
  RENAULT = "RENAULT",
  STELLANTIS = "STELLANTIS",
  FEV = "FEV",
}
export enum Role {
  ADMIN = "ADMIN",
  CHARGE_ESSAI = "CHARGE_ESSAI",
  TECHNICIEN_ESSAI = "TECHNICIEN_ESSAI",
  EXTERNE = "EXTERNE",
}
interface User {
  id?: number;
  nom: string;
  prenom: string;
  client: Client;
  email: string;
  role: Role;
  numeroTelephone?: string;
  motDePasse?: string;
  image?: string;
}
export function Users() {
  const [searchText, setSearchText] = useState("");
  const [clientFilter, setClientFilter] = useState("Tous");
  const [showModal, setShowModal] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const clients = ["RENAULT", "STELLANTIS", "FEV"];
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit" | "view">("add");
  const [roleFilter, setRoleFilter] = useState("Tous");
  // add | view | edit
  // Form State
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    role: "",
    client: "",
    numeroTelephone: "",
    motDePasse: "",
  });
  const isViewMode = modalMode === "view";
  const isEditMode = modalMode === "edit";
  const isAddMode = modalMode === "add";
  /* ---------------- FILTER ---------------- */
  const filteredUsers = users.filter((u) => {
    const fullName = `${u.prenom} ${u.nom}`.toLowerCase();

    const matchesText =
      fullName.includes(searchText.toLowerCase()) ||
      u.email.toLowerCase().includes(searchText.toLowerCase());

    const matchesRole =
      roleFilter === "Tous" || roleFilter === "Tous les roles"
        ? true
        : u.role === roleFilter;

    const matchesClient =
      clientFilter === "Tous" ? true : u.client === clientFilter;

    return matchesText && matchesRole && matchesClient;
  });
  const resetForm = () => {
    setFormData({
      nom: "",
      prenom: "",
      email: "",
      role: "",
      client: "",
      numeroTelephone: "",
      motDePasse: "",
    });

    setSelectedUser(null);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data: User[] = await authFetch("/users");
      setUsers(data);
    } catch (error) {
      console.error("Erreur chargement users", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;

    const payload = {
      nom: formData.nom,
      prenom: formData.prenom,
      email: formData.email,
      role: formData.role,
      client: formData.client,
      numeroTelephone: formData.numeroTelephone,
      motDePasse: formData.motDePasse,
    };

    // validation custom
    if (!formData.nom || !formData.prenom || !formData.email) {
      toast.error("Veuillez remplir les champs obligatoires");
      return;
    }

    try {
      if (modalMode === "add") {
        await authFetch("/auth/register", {
          method: "POST",
          body: JSON.stringify(payload),
        });

        toast.success("Utilisateur ajouté avec succès");
      } else if (modalMode === "edit" && selectedUser?.id) {
        const updated = await authFetch(`/users/${selectedUser.id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });

        setUsers((prev) =>
          prev.map((u) => (u.id === selectedUser.id ? updated : u)),
        );

        toast.success("Utilisateur modifié avec succès");
      }

      setShowModal(false);
      resetForm();
      fetchUsers();
    } catch (err: any) {
      const message = err?.message || "Erreur opération utilisateur";

      toast.error(message);
    }
  };
  const handleDeleteUser = async (id: number) => {
    try {
      await authFetch(`/users/${id}`, { method: "DELETE" });
      setUsers((prev) => prev.filter((u) => u.id !== id));
      toast.success("Utilisateur supprimé avec succès !");
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de la suppression !");
    }
  };

  return (
    <div className="space-y-5 p-3">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-black mb-2 text-left">
          Gestion des Utilisateurs
        </h1>
        <p className="text-gray-600 text-left">
          Administrez les comptes et les accès de la plateforme
        </p>
      </div>
      {/* Barre de recherche et filtres */}
      <div className="p-5 bg-white rounded-xl border border-gray-250 shadow-sm flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher par nom ,email"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full h-11 pl-10 pr-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E30613]/30 "
          />
        </div>

        <select
          value={clientFilter}
          onChange={(e) => setClientFilter(e.target.value)}
          className="w-48 h-11 px-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E30613]/30"
        >
          <option value="Tous">Tous les clients</option>

          {clients.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          className="w-48 h-11 px-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E30613]/30"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="Tous">Role (Tous)</option>
          {roles.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>

        <button
          onClick={() => {
            resetForm();
            resetForm();
            setModalMode("add");
            setShowModal(true);
          }}
          className="h-11 px-6 bg-[#E30613] text-white rounded-lg hover:brightness-110 flex items-center gap-2 transition-all shadow-md"
        >
          <Plus className="w-5 h-5" />
          Nouvel Utilisateur
        </button>
      </div>
      {/* Tableau des utilisateurs */}
      <div className="bg-white rounded-xl border border-gray-250 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-sm text-left">
            {/* Header */}
            <thead className=" px-4 py-10 bg-[#F1F5F9] border-b border-gray-300">
              <tr>
                <th className="px-8 py-4 font-semibold text-gray-600">
                  Utilisateur
                </th>
                <th className="px-9 py-4 font-semibold text-gray-600">Rôle</th>
                <th className="px-4 py-4 font-semibold text-gray-600">
                  Client
                </th>
                <th className="px-8 py-4 font-semibold text-gray-600">Email</th>
                <th className="px-8 py-4 font-semibold text-gray-600">
                  Téléphone
                </th>
                <th className="px-8 py-4 text-right font-semibold text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>

            {/* Body */}
            <tbody>
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-gray-100 hover:bg-[#F9FBFD] transition-colors group"
                >
                  {/* Colonne Identité avec Avatar */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div>
                        <div className="font-bold text-gray-800">
                          {user.prenom} {user.nom}
                        </div>
                        <div className="text-xs text-gray-400 font-normal"></div>
                      </div>
                    </div>
                  </td>

                  {/* Colonne Rôle avec Badge */}
                  <td className="px-5 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        roleColors[user.role] || "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  {/* Colonne client */}
                  <td className="px-5 py-4 text-gray-600">
                    <div className="flex items-center gap-2">{user.client}</div>
                  </td>

                  {/* Colonne Email */}
                  <td className="px-5 py-4 text-gray-600">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      {user.email}
                    </div>
                  </td>

                  {/* Colonne Téléphone */}
                  <td className="px-5 py-4 text-gray-600">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      {user.numeroTelephone || "—"}
                    </div>
                  </td>

                  {/* Colonne Actions */}
                  {/* Actions */}
                  <td className="px-4 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Eye
                        className="cursor-pointer w-4 h-4 text-blue-500"
                        onClick={() => {
                          setSelectedUser(user);

                          setFormData({
                            nom: user.nom,
                            prenom: user.prenom,
                            email: user.email,
                            role: user.role,
                            client: user.client,
                            numeroTelephone: user.numeroTelephone ?? "",
                            motDePasse: "",
                          });

                          setModalMode("view");
                          setShowModal(true);
                        }}
                      />
                      <Edit
                        className="cursor-pointer w-4 h-4 text-green-600"
                        onClick={() => {
                          setSelectedUser(user);

                          setFormData({
                            nom: user.nom,
                            prenom: user.prenom,
                            email: user.email,
                            role: user.role,
                            client: user.client,
                            numeroTelephone: user.numeroTelephone ?? "",
                            motDePasse: "",
                          });

                          setModalMode("edit");
                          setShowModal(true);
                        }}
                      />
                      <button className="p-1.5 hover:bg-red-50 rounded-lg transition text-red-600 hover:text-red-800">
                        <Trash2
                          className="cursor-pointer w-4 h-4 text-red-600"
                          onClick={() => {
                            setSelectedUser(user);
                            setShowDeleteModal(true);
                            setShowConfirmDelete(true);
                          }}
                        />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Message si aucun résultat */}
        {filteredUsers.length === 0 && (
          <div className="p-10 text-center text-gray-500">
            Aucun utilisateur ne correspond à votre recherche.
          </div>
        )}
      </div>
      <Dialog open={showConfirmDelete} onOpenChange={setShowConfirmDelete}>
        {/* On active le mode transparent ici */}
        <DialogContent className="max-w-md" hideOverlay={true}>
          <DialogHeader>
            <DialogTitle>Confirmation de suppression</DialogTitle>
          </DialogHeader>
          <p className="py-4 text-gray-700">
            Voulez-vous vraiment supprimer le véhicule{" "}
            <span className="font-bold">{selectedUser?.nom}</span> ?
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
                if (selectedUser) {
                  handleDeleteUser(selectedUser.id!);
                }
                setShowConfirmDelete(false);
                setSelectedUser(null);
              }}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm"
            >
              Confirmer suppression
            </button>
          </div>
        </DialogContent>
      </Dialog>
      {/* Modal d'ajout */}
      {/* ================= USER FORM MODAL ================= */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-[400px] max-h-[95vh]">
          {/* HEADER */}
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold text-gray-800 border-b pb-1">
              {modalMode === "add" && "Ajouter un utilisateur"}
              {modalMode === "edit" && "Modifier un utilisateur"}
              {modalMode === "view" && "Détails utilisateur"}
            </DialogTitle>
          </DialogHeader>

          {/* FORMULAIRE UNIQUE */}
          <form onSubmit={handleSubmit} className="space-y-2 mt-6">
            {/* GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* PRENOM */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">
                  Prénom <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  value={formData.prenom}
                  disabled={modalMode === "view"}
                  onChange={(e) =>
                    setFormData({ ...formData, prenom: e.target.value })
                  }
                  className="h-11 px-3 border rounded-lg"
                  required
                />
              </div>

              {/* NOM */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">
                  Nom <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  value={formData.nom}
                  disabled={modalMode === "view"}
                  onChange={(e) =>
                    setFormData({ ...formData, nom: e.target.value })
                  }
                  className="h-11 px-3 border rounded-lg"
                  required
                />
              </div>
            </div>

            {/* EMAIL */}
            <div className="flex flex-col gap-1.5">
              <label>
                Email <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="email"
                value={formData.email}
                disabled={modalMode === "view"}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="h-11 px-3 border rounded-lg"
                required
              />
            </div>

            {/* TELEPHONE */}
            <div className="flex flex-col gap-1.5">
              <label>Téléphone</label>
              <input
                value={formData.numeroTelephone}
                disabled={modalMode === "view"}
                onChange={(e) =>
                  setFormData({ ...formData, numeroTelephone: e.target.value })
                }
                className="h-11 px-3 border rounded-lg"
              />
            </div>

            {/* ROLE + CLIENT */}
            <div className="flex gap-4">
              {/* ROLE */}
              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-sm font-medium">
                  Rôle <span className="text-red-500">*</span>
                </label>

                <select
                  value={formData.role}
                  disabled={modalMode === "view"}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value as Role })
                  }
                  className="h-11 px-3 border rounded-lg"
                  required
                >
                  <option value="">Choisir un rôle</option>
                  {roles.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* CLIENT */}
              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-sm font-medium">
                  Client <span className="text-red-500">*</span>
                </label>

                <select
                  value={formData.client}
                  disabled={modalMode === "view"}
                  onChange={(e) =>
                    setFormData({ ...formData, client: e.target.value })
                  }
                  className="h-11 px-3 border rounded-lg"
                  required
                >
                  <option value="">Client</option>
                  {Object.values(Client).map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {/* PASSWORD */}
            {modalMode === "add" && (
              <div className="flex flex-col gap-1.5">
                <label>
                  Mot de passe <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="password"
                  value={formData.motDePasse}
                  onChange={(e) =>
                    setFormData({ ...formData, motDePasse: e.target.value })
                  }
                  className="h-11 px-3 border rounded-lg"
                  required
                />
              </div>
            )}

            {/* ACTIONS */}
            <div className="flex justify-end gap-32 pt-4">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-5 py-2 border rounded-lg"
              >
                Annuler
              </button>

              {modalMode !== "view" && (
                <button
                  type="submit"
                  className="px-5 py-2 bg-red-600 text-white rounded-lg"
                >
                  Enregistrer
                </button>
              )}
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* ================= DELETE CONFIRMATION MODAL ================= */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmation de suppression</DialogTitle>
          </DialogHeader>

          <p className="py-4 text-gray-700">
            Voulez-vous supprimer l'utilisateur{" "}
            <span className="font-bold">
              {selectedUser?.prenom} {selectedUser?.nom}
            </span>{" "}
            ?
          </p>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="px-4 py-2 border rounded-lg"
            >
              Annuler
            </button>

            <button
              onClick={() => {
                if (!selectedUser) return;

                setUsers(users.filter((u) => u.id !== selectedUser.id));
                setShowDeleteModal(false);
                setSelectedUser(null);
              }}
              className="px-4 py-2 bg-red-600 text-white rounded-lg"
            >
              Supprimer
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
