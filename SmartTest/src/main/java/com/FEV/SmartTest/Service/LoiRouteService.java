package com.FEV.SmartTest.Service;

import com.FEV.SmartTest.Entity.LoiRoute;
import com.FEV.SmartTest.Entity.User;
import com.FEV.SmartTest.Enum.Client;
import com.FEV.SmartTest.Enum.Role;
import com.FEV.SmartTest.Repository.LoiRouteRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class LoiRouteService {
    private final LoiRouteRepository loiRouteRepository;
    private final CustomUserDetailsService userDetailsService;

    public LoiRouteService(LoiRouteRepository loiRouteRepository, CustomUserDetailsService userDetailsService) {
        this.loiRouteRepository = loiRouteRepository;
        this.userDetailsService = userDetailsService;
    }




    // Créer une loi de route
    public LoiRoute createLoiRoute(LoiRoute loiRoute) {

        return loiRouteRepository.save(loiRoute);
    }

    // Récupérer toutes les lois de route
    public List<LoiRoute> getAllLoisRoute() {
        return loiRouteRepository.findAll();
    }

    // Mettre à jour une loi de route
    public LoiRoute updateLoiRoute(Long id, LoiRoute updatedLoiRoute) {

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

    public void deleteLoiRoute(Long id) {

        loiRouteRepository.deleteById(id);
    }

    public long getLoiCount(Optional<Client> clientOpt) {

        User currentUser = userDetailsService.getCurrentUser()
                .orElseThrow(() -> new RuntimeException("Utilisateur non authentifié"));

        Client client;

        if (currentUser.getRole() == Role.ADMIN) {
            client = clientOpt.orElse(null);
        } else {
            client = currentUser.getClient();
        }

        if (client == null) {
            return loiRouteRepository.count();
        }

        return loiRouteRepository.countByClient(client);
    }
    public List<LoiRoute> getAllLoisRouteClient() {

        User currentUser = userDetailsService.getCurrentUser()
                .orElseThrow(() -> new RuntimeException("Utilisateur non authentifié"));
        // Si ADMIN → toutes les lois de route
        if (currentUser.getRole() == Role.ADMIN) {
            return loiRouteRepository.findAll();
        }
        // Sinon → seulement celles du client
        Client client = currentUser.getClient();
        return loiRouteRepository.findByClient(client);
    }
}
