import { Link, useNavigate } from "react-router";
import { useState } from "react";
import { images } from "../../assets";
import { Mail, Lock, ArrowLeft, Loader2, Eye, EyeOff } from "lucide-react";
export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          motDePasse: motDePasse,
        }),
      });

      let data;

      const contentType = res.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        data = await res.text();
      }
      if (!res.ok) {
        throw new Error(
          typeof data === "string"
            ? data
            : data?.message || "Email ou mot de passe incorrect",
        );
      }

      localStorage.setItem("token", data.token);
      navigate("/app");
    } catch (err: any) {
      setError(err.message || "Email ou mot de passe incorrect");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-2">
      <div className="w-full max-w-md">
        {/* Logo Section - Décommentée et stylisée */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4">
            {/* Remplacer par ton vrai chemin d'image */}
            {/*<h2 className="text-2xl font-bold text-gray-800">
              Smart<span className="text-[#E30613]">Test</span>
            </h2>*/}
          </div>
        </div>

        <div className="bg-white shadow-2xl rounded-3xl p-8 md:p-10 border-3 border-gray-100">
          <h1 className="text-3xl font-extrabold text-[#E30613] text-center mb-8">
            Connexion
          </h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email professionnel <span className="text-[#E30613]">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full h-12 px-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E30613]/20 focus:border-[#E30613] transition-all"
                placeholder="nom@entreprise.com"
              />
            </div>
            {/* Mot de passe */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-semibold text-gray-700">
                  Mot de passe <span className="text-[#E30613]">*</span>
                </label>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={motDePasse}
                  onChange={(e) => setMotDePasse(e.target.value)}
                  required
                  className="w-full h-12 px-4 pr-12 border border-gray-300 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-[#E30613]/20 focus:border-[#E30613] transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#E30613]"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <Link
                to="/forgot-password"
                className="text-xs font-medium text-gray-500 hover:text-[#E30613] transition-colors"
              >
                Mot de passe oublié ?
              </Link>
            </div>
            {/* Bouton de soumission */}
            <div className="min-h-[20px]">
              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}
            </div>{" "}
            <button
              type="submit"
              className="w-full py-3.5 bg-[#c40510] text-white rounded-xl font-bold text-lg hover:bg-[#E30613] active:scale-[0.98] transition-all shadow-lg shadow-red-200 mt-1"
            >
              Se connecter
            </button>
            {/*<div className="text-center">
              <Link
                to="/signup"
                className="text-sm text-gray-600 hover:text-black"
              >
                Pas encore de compte ?{" "}
                <span className="font-medium">
                  Créer un compte
                </span>
              </Link>
            </div>
            */}
          </form>
        </div>

        <div className="text-center mt-4">
          <Link to="/" className="text-sm text-gray-600 hover:text-black">
            ← Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
