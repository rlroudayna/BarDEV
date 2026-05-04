import { useState, useEffect } from "react";
import {
  User,
  Phone,
  Mail,
  Edit2,
  Eye,
  EyeOff,
  Building,
  Shield,
  Edit,
  Check,
} from "lucide-react";
import { authFetch } from "../api";

export function Profile() {
  const [isEditingPhoto, setIsEditingPhoto] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [phone, setPhone] = useState("");
  const [newImageUrl, setNewImageUrl] = useState("");
  const [newImageFile, setNewImageFile] = useState(null);
  const [profileData, setProfileData] = useState({
    id: "",
    nom: "",
    prenom: "",
    numeroTelephone: "",
    email: "",
    role: "",
    client: "",
    image: "",
  });

  useEffect(() => {
    async function loadProfile() {
      try {
        const user = await authFetch("/users/me");

        setProfileData({
          id: user.id,
          nom: user.nom,
          prenom: user.prenom,
          numeroTelephone: user.numeroTelephone,
          email: user.email,
          role: user.role,
          client: user.client,
          image:
            user.imageUrl ||
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
        });

        setPhone(user.numeroTelephone);
      } catch (err) {
        console.error("Erreur chargement profil", err);
      }
    }

    loadProfile();
  }, []);

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const handleSavePhoto = async () => {
    try {
      const updatedUser = await authFetch(`/users/${profileData.id}/image`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newImageUrl), // ✔ STRING PURE
      });

      setProfileData(updatedUser);
      setIsEditingPhoto(false);
    } catch (err) {
      console.error("Erreur update photo", err);
    }
  };

  
  return (
    <div className="max-w-4xl mx-auto  space-y-6">
      {/* TITLE */}
      <div>
        <h1 className="text-2xl font-bold">Mon Profil</h1>
        <p className="text-gray-500 text-sm">
          Gestion de vos informations personnelles
        </p>
      </div>

      {/* CARD */}
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        {/* HEADER PROFILE */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-600 p-4 flex items-center gap-5 text-white">
          <div className="relative">
            <img
              src={profileData.image}
              className="w-18 h-18 rounded-full border-4 border-white object-cover"
            />

            <button
              onClick={() => setIsEditingPhoto(true)}
              className="absolute bottom-0 right-0 bg-black p-2 rounded-full hover:scale-105"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          </div>

          <div>
            <h2 className="text-xl font-bold">
              {profileData.nom} {profileData.prenom}
            </h2>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-gray-200" />
              <p className="text-sm text-gray-200">{profileData.role}</p>
            </div>
          </div>
        </div>

        {/* BODY */}
        <div className="p-6 space-y-8">
          {/* INFOS */}
          <div>
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <User className="w-4 h-4" />
              Informations personnelles
            </h3>

            <div className="grid md:grid-cols-3 gap-6">
              <Info
                className="border rounded-lg outline-none"
                label="Prénom"
                value={profileData.nom}
                icon={User}
              />

              <Info
                className="border rounded-lg outline-none"
                label="Nom"
                value={profileData.prenom}
                icon={User}
              />

              <div className="border rounded-lg p-3 flex items-center justify-between">
                {/* LEFT SIDE */}
                <div className="flex items-center gap-2">
                  <Phone className="text-gray-500" />

                  <div>
                    <p className="text-xs text-gray-500">Téléphone</p>

                    {isEditingPhone ? (
                      <input
                        className="border rounded px-2 py-1 text-sm outline-none"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    ) : (
                      <p className="text-sm font-medium">{phone}</p>
                    )}
                  </div>
                </div>

                {/* RIGHT SIDE ICON */}
                <div className="flex items-center gap-2">
                  {isEditingPhone ? (
                    <Check
                      className="cursor-pointer text-green-600"
                      onClick={async () => {
                        try {
                          const updatedUser = await authFetch(
                            `/users/${profileData.id}`,
                            {
                              method: "PUT",
                              body: JSON.stringify({
                                ...profileData,
                                phone: phone,
                              }),
                            },
                          );

                          setProfileData(updatedUser);
                          setPhone(updatedUser.numeroTelephone);
                          setIsEditingPhone(false);
                        } catch (err) {
                          console.error("Erreur update téléphone", err);
                        }
                      }}
                    />
                  ) : (
                    <Edit
                      className="cursor-pointer text-gray-500 hover:text-red-600"
                      onClick={() => setIsEditingPhone(true)}
                    />
                  )}
                </div>
              </div>

              <Info
                className="border rounded-lg outline-none"
                label="Email"
                value={profileData.email}
                icon={Mail}
              />

              <Info
                className="border rounded-lg outline-none"
                label="Role"
                value={profileData.role}
                icon={Shield}
              />

              <Info
                className="border rounded-lg outline-none"
                label="Société"
                value={profileData.client}
                icon={Building}
              />
            </div>
          </div>
          {/* PASSWORD */}
          <div className="border-t pt-6">
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-semibold text-lg">Sécurité</h3>

              {!isChangingPassword && (
                <button
                  onClick={() => setIsChangingPassword(true)}
                  className="text-[#E30613] text-sm font-medium hover:underline"
                >
                  Modifier le mot de passe
                </button>
              )}
            </div>

            {isChangingPassword && (
              <div className="bg-gray-50 border rounded-xl p-5 space-y-5 shadow-sm">
                {/* Inputs */}
                <div className="grid md:grid-cols-3 gap-4">
                  <input
                    type={showPass ? "text" : "password"}
                    placeholder="Mot de passe actuel"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#E30613]/10 outline-none"
                    onChange={(e) =>
                      setPasswords({
                        ...passwords,
                        current: e.target.value,
                      })
                    }
                  />

                  <input
                    type={showPass ? "text" : "password"}
                    placeholder="Nouveau mot de passe"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#E30613]/10 outline-none"
                    onChange={(e) =>
                      setPasswords({
                        ...passwords,
                        new: e.target.value,
                      })
                    }
                  />

                  <input
                    type={showPass ? "text" : "password"}
                    placeholder="Confirmer le mot de passe"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#E30613]/10 outline-none"
                    onChange={(e) =>
                      setPasswords({
                        ...passwords,
                        confirm: e.target.value,
                      })
                    }
                  />
                </div>

                {/* Actions */}
                {/* ACTIONS PASSWORD */}
                <div className="flex justify-between items-center">
                  {/* Show password */}
                  <button
                    onClick={() => setShowPass(!showPass)}
                    className="text-xs text-gray-500 flex items-center gap-2 hover:text-gray-700 transition"
                  >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    {showPass ? "Masquer" : "Afficher"}
                  </button>

                  {/* Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => setIsChangingPassword(false)}
                      className="px-4 py-2 border border-[#E30613] text-[#E30613] rounded-lg hover:bg-red-50 transition"
                    >
                      Annuler
                    </button>

                    <button className="px-4 py-2 bg-[#E30613] text-white rounded-lg hover:bg-red-700 transition">
                      Mettre à jour
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* PHOTO MODAL */}
      {isEditingPhoto && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 space-y-5">
            <h3 className="text-lg font-semibold">
              Changer la photo de profil
            </h3>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;

                const reader = new FileReader();
                reader.onloadend = () => {
                  setNewImageUrl(reader.result as string); // base64
                };
                reader.readAsDataURL(file);
              }}
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsEditingPhoto(false)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-100 transition"
              >
                Annuler
              </button>

              <button
                onClick={handleSavePhoto}
                className="px-4 py-2 bg-[#E30613] text-white rounded-lg hover:bg-red-700 transition"
              >
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Info({
  label,
  value,
  icon: Icon,
  className = "",
}: {
  label: string;
  value: string;
  icon: any;
  className?: string;
}) {
  return (
    <div className={`p-2 bg-gray-50 border rounded-lg ${className}`}>
      <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
        <Icon className="w-3 h-3" />
        <span>{label}</span>
      </div>

      <p className="font-medium text-gray-800">{value}</p>
    </div>
  );
}
