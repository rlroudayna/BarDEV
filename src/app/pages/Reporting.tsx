import { useState } from "react";
import {
  Download,
  Search,
  Calendar,
  Trash2,
  Edit,
  FileText,
  Eye,
} from "lucide-react";

type Report = {
  id: number;
  title: string;
  numeroDemande: string;
  client: string;
  date: string;
  chargeEssai: string;
  commentaire: string;
  FileText: string;
};

const reports: Report[] = [
  {
    id: 1,
    title: "Rapport moteur thermique",
    numeroDemande: "Projet Demandeur Véhicule Cycle 001",
    client: "Fev",
    date: "2026-04-05",
    chargeEssai: "Ahmed Benali",
    commentaire: "Analyse des performances du moteur",
    FileText: "url",
  },
  {
    id: 2,
    title: "Rapport batterie",
    numeroDemande: "Projet Demandeur Véhicule Cycle 002",
    client: "Stellentis",
    date: "2026-04-06",
    chargeEssai: "Fatima Zahra",
    commentaire: "Test de durabilité batterie",
    FileText: "url",
  },
];

export function Reporting() {
  const [searchText, setSearchText] = useState("");
  const [clientFilter, setClientFilter] = useState("Tous");
  const [selectedDriver, setSelectedDriver] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [commentaire, setCommentaire] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [numeroDemande, setNumeroDemande] = useState("");
  const [client, setClient] = useState("");
  const [date, setDate] = useState("");
  const [chargeEssai, setChargeEssai] = useState("");

  const clients = ["Renault", "Stellantis", "Fev"];
  const drivers = Array.from(
    new Set(reports.map((r) => r.chargeEssai).filter(Boolean)),
  );

  const handleExport = () => {
    if (
      !title ||
      !numeroDemande ||
      !client ||
      !date ||
      !chargeEssai
    ) {
      alert("Veuillez remplir tous les champs");
      return;
    }

    const newReport = {
      id: reports.length + 1,
      title,
      numeroDemande,
      client,
      date,
      chargeEssai,
      commentaire,
      file,
    };

    console.log(newReport);

    alert("Rapport ajouté avec succès");

    setModalOpen(false);
    setTitle("");
    setNumeroDemande("");
    setClient("");
    setDate("");
    setChargeEssai("");
    setCommentaire("");
    setFile(null);
    setShowModal("");
  };
  const handleEdit = (report: Report) => {
    console.log("Modifier :", report);
  };

  const handleDelete = (id: number) => {
    console.log("Supprimer :", id);
  };

  const filteredReports = reports.filter((r) => {
    const matchSearch = r.title
      .toLowerCase()
      .includes(searchText.toLowerCase());

    const matchClient =
      clientFilter === "Tous" || r.client === clientFilter;

    const matchDate = !filterDate || r.date === filterDate;

    const matchDriver =
      !selectedDriver || r.chargeEssai === selectedDriver;

    return (
      matchSearch && matchClient && matchDate && matchDriver
    );
  });

  return (
    <div className="space-y-5 p-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold mb-2">
            Reporting
          </h1>
          <p className="text-gray-600">
            Analyses et rapports d'activité
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="h-11 px-6 bg-[#E30613] text-white rounded-lg flex items-center gap-2 hover:brightness-110 shadow-md"
        >
          <Download className="w-5 h-5" />
          Exporter rapport
        </button>
      </div>

      {/* Barre filtres */}
      <div className="p-5 bg-white rounded-xl border shadow-sm flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Rechercher par titre"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full h-11 pl-10 pr-4 border rounded-lg focus:ring-2 focus:ring-[#E30613]/30 outline-none"
          />
        </div>

        <select
          value={clientFilter}
          onChange={(e) => setClientFilter(e.target.value)}
          className="w-48 h-11 px-4 border rounded-lg focus:ring-2 focus:ring-[#E30613]/30"
        >
          <option value="Tous">Tous les clients</option>

          {clients.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <select
          value={selectedDriver}
          onChange={(e) => setSelectedDriver(e.target.value)}
          className="w-48 h-11 px-4 border rounded-lg focus:ring-2 focus:ring-[#E30613]/30"
        >
          <option value="">Chargé d'essai</option>
          {drivers.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>

        <div
          className="w-48 h-11 px-3 border border-gray-300 rounded-lg
flex items-center gap-2
focus-within:ring-2 focus-within:ring-[#E30613]/30 bg-white"
        >
          <Calendar
            size={16}
            className="text-gray-400 flex-shrink-0"
          />

          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="w-full h-full outline-none text-sm bg-transparent"
          />
        </div>
      </div>

      {/* Tableau */}
      <div className="bg-white rounded-xl border border-gray-250 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-sm text-left">
            {/* Header */}
            <thead className=" px-4 py-10 bg-[#F1F5F9] border-b border-gray-300">
              <tr>
                <th className="px-8 py-4 font-semibold text-gray-600">
                  Titre
                </th>
                <th className="px-8 py-4 font-semibold text-gray-600">
                  Nom de demande
                </th>
                <th className="px-8 py-4 font-semibold text-gray-600">
                  Client
                </th>
                <th className="px-8 py-4 font-semibold text-gray-600">
                  Date d'essai
                </th>
                <th className="px-4 py-4 font-semibold text-gray-600">
                  Chargé d'essai
                </th>

                <th className="px-10 py-4 font-semibold text-gray-600">
                  Fichier
                </th>
                <th className="px-8 py-4 font-semibold text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredReports.map((report) => (
                <tr
                  key={report.id}
                  className="border-b border-gray-100 hover:bg-[#F9FBFD] transition-colors group"
                >
                  <td className="px-5 py-4 font-bold text-gray-800">
                    {report.title}
                  </td>

                  <td className="px-5 py-4 text-gray-600">
                    {report.numeroDemande}
                  </td>

                  <td className="px-3 py-4 text-gray-600">
                    {report.client}
                  </td>

                  <td className="px-4 py-4 text-gray-600">
                    {report.date}
                  </td>

                  <td className="px-5 py-4 text-gray-600">
                    {report.chargeEssai}
                  </td>

                  {/* Nouvelle cellule rapport */}
                  <td className="px-9 py-4 text-gray-600">
                    <button className="flex items-center gap-1 text-[#E30613] hover:underline">
                      <FileText className="w-4 h-4" />
                      Voir
                    </button>
                  </td>

                  <td className="px-4 py-4 text-right">
                    <div className="flex justify-end gap-3">
                      <Eye
                        className="cursor-pointer w-4 h-4 text-blue-600"
                        onClick={() => {
                          setShowModal(true);
                        }}
                      />
                      <Edit
                        className="cursor-pointer text-green-600 w-4 h-4"
                        onClick={() => handleEdit(report)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal export */}
      {/* Modal export */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-[520px] max-h-[95vh] overflow-hidden rounded-2xl shadow-2xl flex flex-col">
            {/* HEADER */}
            <div className="flex justify-between items-center py-3.5 px-6 border-b bg-gray-90">
              <h2 className="text-xl font-bold text-slate-800">
                Ajouter un rapport
              </h2>

              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition"
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
            <div className="overflow-y-auto px-6 py-6 space-y-6">
              {/* SECTION IDENTIFICATION */}
              <section>
                <h3 className="font-semibold text-[#E30613] uppercase text-sm tracking-wider mb-4">
                  Identification du rapport
                </h3>

                {/* GRID PRINCIPALE */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Titre */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-gray-900">
                      Titre du rapport{" "}
                      <span className="text-red-500 ml-1">
                        *
                      </span>
                    </label>
                    <input
                      type="text"
                      placeholder="Rapport essais moteur"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="h-11 px-4 border border-gray-300 rounded-lg
          focus:ring-2 focus:ring-[#E30613]/30 outline-none"
                    />
                  </div>

                  {/* Numéro demande */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-gray-900">
                      Nom demande d'essai{" "}
                      <span className="text-red-500 ml-1">
                        *
                      </span>
                    </label>
                    <input
                      type="text"
                      placeholder="DE-001"
                      value={numeroDemande}
                      onChange={(e) =>
                        setNumeroDemande(e.target.value)
                      }
                      className="h-11 px-4 border border-gray-300 rounded-lg
          focus:ring-2 focus:ring-[#E30613]/30 outline-none"
                    />
                  </div>

                  {/* Client */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-gray-900">
                      Client{" "}
                      <span className="text-red-500 ml-1">
                        *
                      </span>
                    </label>
                    <select
                      value={client}
                      onChange={(e) =>
                        setClient(e.target.value)
                      }
                      className="h-11 px-4 border border-gray-300 rounded-lg
          focus:ring-2 focus:ring-[#E30613]/30 bg-white outline-none"
                    >
                      <option value="">
                        Sélectionner client
                      </option>
                      {clients.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Date */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-gray-900">
                      Date du rapport{" "}
                      <span className="text-red-500 ml-1">
                        *
                      </span>
                    </label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="h-11 px-4 border border-gray-300 rounded-lg
          focus:ring-2 focus:ring-[#E30613]/30 outline-none"
                    />
                  </div>

                  {/* Chargé d'essai */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-gray-900">
                      Chargé d'essai{" "}
                      <span className="text-red-500 ml-1">
                        *
                      </span>
                    </label>
                    <input
                      type="text"
                      placeholder="Nom du chargé d'essai"
                      value={chargeEssai}
                      onChange={(e) =>
                        setChargeEssai(e.target.value)
                      }
                      className="h-11 px-4 border border-gray-300 rounded-lg
          focus:ring-2 focus:ring-[#E30613]/30 outline-none"
                    />
                  </div>

                  {/* Rapport */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-gray-900">
                      Rapport{" "}
                      <span className="text-red-500 ml-1">
                        *
                      </span>
                    </label>
                    <input
                      type="file"
                      onChange={(e) =>
                        setFile(e.target.files?.[0] || null)
                      }
                      className="h-11 px-3 border border-gray-300 rounded-lg
          focus:ring-2 focus:ring-[#E30613]/30 outline-none bg-white"
                    />
                  </div>
                </div>
              </section>

              {/* SECTION DESCRIPTION */}
              <section>
                <h3 className="font-semibold text-[#E30613] uppercase text-sm tracking-wider mb-3">
                  Commentaire
                </h3>

                <textarea
                  placeholder="Informations sur le rapport..."
                  value={commentaire}
                  onChange={(e) =>
                    setCommentaire(e.target.value)
                  }
                  className="w-full h-28 p-4 border border-gray-300 rounded-lg
            focus:ring-2 focus:ring-[#E30613]/30 outline-none resize-none"
                />
              </section>

              {/* SECTION FICHIER */}

              {/* BOUTONS */}
              <div className="flex justify-end gap-34 mt-8">
                <button
                  onClick={() => setModalOpen(false)}
                  className="px-8 py-2.5 bg-white border-2 border-[#E30613] text-[#E30613] font-semibold rounded-lg transition shadow-sm"
                >
                  Annuler
                </button>

                <button
                  onClick={handleExport}
                  className="px-12 py-2.5 bg-[#E30613] text-white rounded-lg font-bold hover:bg-[#c70511] transition shadow-sm"
                >
                  Enregistrer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}