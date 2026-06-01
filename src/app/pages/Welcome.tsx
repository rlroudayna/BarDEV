import { Link } from "react-router";

export function Welcome() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-1xl w-full text-center">
        {/* Logo animé */}
        {/*   <div className="mb-1 flex justify-center">
          <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm animate-pulse-slow">
            <img
              src={images.logo.smartTest}
              alt="SmartTest Logo"
              className="w-40 h-auto"
            />
          </div>
        </div>*/}

        {/* Titres */}
        <h1 className="text-5xl font-semibold text-[#E30613] mb-4 drop-shadow-lg">
          Bienvenue sur SmartTest
        </h1>
        <p className="text-xl text-[#E30613] mb-12 drop-shadow-sm">
          Gestion complète de vos bancs d'essai
        </p>

        {/* Boutons */}
        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            to="/login"
            className="px-20 py-4  text-white rounded-lg bg-[#E30613] hover:bg-[#E30613]/75 transition-all duration-300 shadow-md hover:shadow-xl font-medium"
          >
            Accéder à la plateforme{" "}
          </Link>
        </div>
      </div>
    </div>
  );
}