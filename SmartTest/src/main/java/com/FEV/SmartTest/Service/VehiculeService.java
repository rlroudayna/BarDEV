package com.FEV.SmartTest.Service;

import com.FEV.SmartTest.Entity.User;
import com.FEV.SmartTest.Entity.Vehicule;
import com.FEV.SmartTest.Enum.Client;
import com.FEV.SmartTest.Repository.VehiculeRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VehiculeService {

    private final VehiculeRepository vehiculeRepository;
    private final CustomUserDetailsService userDetailsService;

    public VehiculeService(VehiculeRepository vehiculeRepository, CustomUserDetailsService userDetailsService) {
        this.vehiculeRepository = vehiculeRepository;
        this.userDetailsService = userDetailsService;
    }
    // Vérifie si l'utilisateur connecté est conducteur
    private void checkCharge() {
        User currentUser = userDetailsService.getCurrentUser()
                .orElseThrow(() -> new RuntimeException("Utilisateur non authentifié"));

        if (!"CHARGE_ESSAI".equals(currentUser.getRole().name())) {
            throw new RuntimeException("Action réservée aux conducteurs");
        }
    }
    public Vehicule createVehicule(Vehicule vehicule) {
        //checkCharge();
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
        checkCharge();
        return vehiculeRepository.findById(id).map(v -> {
            v.setNomAppliImmat(updatedVehicule.getNomAppliImmat());
            v.setIdentificateur(updatedVehicule.getIdentificateur());
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
        checkCharge();
        vehiculeRepository.deleteById(id);
    }

    public Vehicule duplicateVehicule(Long id) {
        checkCharge();
        Vehicule v = vehiculeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Véhicule non trouvé avec id : " + id));
        Vehicule duplicate = new Vehicule();
        BeanUtils.copyProperties(v, duplicate, "id"); // copier tout sauf l'ID
        return vehiculeRepository.save(duplicate);
    }

    public long getVehiculeCount() {
        return vehiculeRepository.count();
    }


    public List<Vehicule> getAllVehiculesClient() {
        User currentUser = userDetailsService.getCurrentUser()
                .orElseThrow(() -> new RuntimeException("Utilisateur non authentifié"));

        Client client = currentUser.getClient();

        return vehiculeRepository.findByClient(client);
    }
}