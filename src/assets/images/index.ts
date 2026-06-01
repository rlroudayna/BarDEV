// Import des images locales (fichiers physiques)
// Placez vos fichiers image dans ce dossier et décommentez les lignes ci-dessous

// Exemple avec des fichiers locaux :
// import smartTestLogo from "./smarttest-logo.png";
// import vehicleIcon from "./vehicle-icon.svg";

// Export centralisé des assets
export const images = {
  logo: {
    // smartTest: smartTestLogo,
    // Pour l'instant, utiliser une image temporaire ou un placeholder
    smartTest: "https://via.placeholder.com/160x60/4CAF50/FFFFFF?text=SmartTest", // Placeholder temporaire
  },
  // Ajoutez d'autres catégories ici
  // icons: {
  //   vehicle: vehicleIcon,
  // },
};

// Export par défaut pour faciliter l'importation
export default images;
