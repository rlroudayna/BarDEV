import { Link } from "react-router";
import { useState } from "react";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";

export function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Ici, vous appellerez votre API pour envoyer l'email
    console.log("Demande de réinitialisation pour:", email);
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-sm p-8">
          {!isSubmitted ? (
            <>
              <h2 className="text-2xl font-bold text-black mb-2">
                Mot de passe oublié ?
              </h2>
              <p className="text-gray-600 mb-6 text-sm">
                Entrez votre adresse email. Nous vous enverrons
                un lien pour réinitialiser votre mot de passe.
              </p>

              <form
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full h-11 px-4 border border-[#E0E0E0] rounded-lg focus:outline-none focus:border-[#E30613]"
                      placeholder="votre.email@exemple.com"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full h-12 bg-[#E30613] text-white rounded-lg  transition-colors font-medium"
                >
                  Envoyer le lien
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="flex justify-center mb-4">
                <CheckCircle className="w-12 h-12 text-green-500" />
              </div>
              <h2 className="text-xl font-bold text-black mb-2">
                Email envoyé !
              </h2>
              <p className="text-gray-600 mb-6 text-sm">
                Si un compte existe pour{" "}
                <strong>{email}</strong>, vous recevrez un email
                sous peu.
              </p>
              <button
                onClick={() => setIsSubmitted(false)}
                className="text-black text-sm hover:underline"
              >
                Renvoyer l'email
              </button>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-black"
            >
              <ArrowLeft size={16} /> Retour à la connexion
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}