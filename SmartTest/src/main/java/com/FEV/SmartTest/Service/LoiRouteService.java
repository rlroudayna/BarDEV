package com.FEV.SmartTest.Service;

import com.FEV.SmartTest.Entity.LoiRoute;
import com.FEV.SmartTest.Entity.User;
import com.FEV.SmartTest.Enum.Client;
import com.FEV.SmartTest.Repository.LoiRouteRepository;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class LoiRouteService {
    private final LoiRouteRepository loiRouteRepository;
    private final CustomUserDetailsService userDetailsService;

    public LoiRouteService(LoiRouteRepository loiRouteRepository, CustomUserDetailsService userDetailsService) {
        this.loiRouteRepository = loiRouteRepository;
        this.userDetailsService = userDetailsService;
    }


    // Vérifie si l'utilisateur connecté a le droit de créer/éditer
    private void checkCharge() {
        User currentUser = userDetailsService.getCurrentUser()
                .orElseThrow(() -> new RuntimeException("Utilisateur non authentifié"));

        if (!"CHARGE_ESSAI".equals(currentUser.getRole().name())) {
            throw new RuntimeException("Action réservée aux chargé d'essai");
        }
    }

    // Créer une loi de route
    public LoiRoute createLoiRoute(LoiRoute loiRoute) {
        // checkCharge();
        return loiRouteRepository.save(loiRoute);
    }

    // Récupérer toutes les lois de route
    public List<LoiRoute> getAllLoisRoute() {
        return loiRouteRepository.findAll();
    }

    // Mettre à jour une loi de route
    public LoiRoute updateLoiRoute(Long id, LoiRoute updatedLoiRoute) {
        //checkCharge();
        return loiRouteRepository.findById(id).map(lr -> {
            lr.setNom(updatedLoiRoute.getNom());
            lr.setTemperature(updatedLoiRoute.getTemperature());
            lr.setClient(updatedLoiRoute.getClient());
            lr.setNorme(updatedLoiRoute.getNorme());
            lr.setInertieKg(updatedLoiRoute.getInertieKg());
            lr.setMasseEssaiKg(updatedLoiRoute.getMasseEssaiKg());
            lr.setInertieRotativeTNRKg(updatedLoiRoute.getInertieRotativeTNRKg());
            lr.setInertieRotativeDeuxTrainsKg(updatedLoiRoute.getInertieRotativeDeuxTrainsKg());
            lr.setF0(updatedLoiRoute.getF0());
            lr.setF1(updatedLoiRoute.getF1());
            lr.setF2(updatedLoiRoute.getF2());
            lr.setDescription(updatedLoiRoute.getDescription());
            return loiRouteRepository.save(lr);
        }).orElseThrow(() -> new RuntimeException("Loi de route non trouvée avec id : " + id));
    }

    // Supprimer une loi de route
    public void deleteLoiRoute(Long id) {
        // checkCharge();
        loiRouteRepository.deleteById(id);
    }

    public long getLoiCount() {
        return loiRouteRepository.count();
    }

    public List<LoiRoute> getAllLoisRouteClient() {

        User currentUser = userDetailsService.getCurrentUser()
                .orElseThrow(() -> new RuntimeException("Utilisateur non authentifié"));

        Client client = currentUser.getClient();

        return loiRouteRepository.findByClient(client);
    }
}
