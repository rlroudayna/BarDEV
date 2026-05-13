package com.FEV.SmartTest.Service;

import com.FEV.SmartTest.Entity.User;
import com.FEV.SmartTest.Entity.Vehicule;
import com.FEV.SmartTest.Enum.Client;
import com.FEV.SmartTest.Enum.Role;
import com.FEV.SmartTest.Repository.VehiculeRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class VehiculeService {

    private final VehiculeRepository vehiculeRepository;
    private final CustomUserDetailsService userDetailsService;

    public VehiculeService(VehiculeRepository vehiculeRepository, CustomUserDetailsService userDetailsService) {
        this.vehiculeRepository = vehiculeRepository;
        this.userDetailsService = userDetailsService;
    }
    // Vérifie si l'utilisateur connecté est conducteur

    public Vehicule createVehicule(Vehicule vehicule) {

        vehicule.setIdentificateur(generateIdentificateur());

        return vehiculeRepository.save(vehicule);
    }
    public Vehicule getVehiculeById(Long id) {
        return vehiculeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vehicule non trouvé avec id : " + id));
    }

    public List<Vehicule> getAllVehicules() {
        return vehiculeRepository.findAll();
    }

    public Vehicule updateVehicule(Long id, Vehicule updatedVehicule) {

        return vehiculeRepository.findById(id).map(v -> {
            v.setNomAppliImmat(updatedVehicule.getNomAppliImmat());
            v.setImmatriculation(updatedVehicule.getImmatriculation());
            v.setMarque(updatedVehicule.getMarque());
            v.setVin(updatedVehicule.getVin());
            v.setSite(updatedVehicule.getSite());
            v.setResponsable(updatedVehicule.getResponsable());
            v.setClient(updatedVehicule.getClient());
            v.setLocalisation(updatedVehicule.getLocalisation());
            v.setMotorisation(updatedVehicule.getMotorisation());
            v.setMoteur(updatedVehicule.getMoteur());
            v.setBoiteVitesse(updatedVehicule.getBoiteVitesse());
            v.setCarburant(updatedVehicule.getCarburant());
            v.setCouleur(updatedVehicule.getCouleur());
            v.setFamilleVehicule(updatedVehicule.getFamilleVehicule());
            v.setModeConduite(updatedVehicule.getModeConduite());
            v.setDimensionsPneus(updatedVehicule.getDimensionsPneus());
            v.setPressionPneus(updatedVehicule.getPressionPneus());
            v.setPuissance(updatedVehicule.getPuissance());
            v.setDensite(updatedVehicule.getDensite());
            v.setEmpattement(updatedVehicule.getEmpattement());
            v.setTypeCatalyseur(updatedVehicule.getTypeCatalyseur());
            return vehiculeRepository.save(v);
        }).orElseThrow(() -> new RuntimeException("Véhicule non trouvé avec id : " + id));
    }

    public void deleteVehicule(Long id) {

        vehiculeRepository.deleteById(id);
    }

    public Vehicule duplicateVehicule(Long id) {

        Vehicule v = vehiculeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Véhicule non trouvé avec id : " + id));

        Vehicule duplicate = new Vehicule();

        // ne pas copier id et identificateur
        BeanUtils.copyProperties(v, duplicate, "id", "identificateur");

        // générer un nouvel identificateur
        duplicate.setIdentificateur(generateIdentificateur());

        return vehiculeRepository.save(duplicate);
    }

    public long getVehiculeCount(Optional<Client> clientOpt) {

        User currentUser = userDetailsService.getCurrentUser()
                .orElseThrow(() -> new RuntimeException("Utilisateur non authentifié"));

        Client client;

        if (currentUser.getRole() == Role.ADMIN) {
            client = clientOpt.orElse(null);
        } else {
            client = currentUser.getClient();
        }

        if (client == null) {
            return vehiculeRepository.count();
        }

        return vehiculeRepository.countByClient(client);
    }

    public List<Vehicule> getVehiculesSelonRole() {
        User currentUser = userDetailsService.getCurrentUser()
                .orElseThrow(() -> new RuntimeException("Utilisateur non authentifié"));

        // Si l'utilisateur est ADMIN → accès à tout
        if (currentUser.getRole() == Role.ADMIN) {
            return vehiculeRepository.findAll();
        }

        // Sinon → filtrer par client
        Client client = currentUser.getClient();
        return vehiculeRepository.findByClient(client);
    }
    private String generateIdentificateur() {

        Vehicule lastVehicule = vehiculeRepository.findTopByOrderByIdDesc().orElse(null);

        int nextNumber = 1;

        if (lastVehicule != null && lastVehicule.getIdentificateur() != null) {
            String lastId = lastVehicule.getIdentificateur();
            if (lastId.contains("-")) {

                String[] parts = lastId.split("-");

                if (parts.length == 2) {
                    nextNumber = Integer.parseInt(parts[1]) + 1;
                }
            }
        }
        return String.format("AB-%04d", nextNumber);
    }
}