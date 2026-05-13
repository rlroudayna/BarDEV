package com.FEV.SmartTest.Service;

import com.FEV.SmartTest.Entity.Calage;
import com.FEV.SmartTest.Entity.User;
import com.FEV.SmartTest.Enum.Client;
import com.FEV.SmartTest.Enum.Role;
import com.FEV.SmartTest.Repository.CalageRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CalageService {
    private final CalageRepository calageRepository;
    private final CustomUserDetailsService userDetailsService;

    public CalageService(CalageRepository calageRepository, CustomUserDetailsService userDetailsService) {
        this.calageRepository = calageRepository;
        this.userDetailsService = userDetailsService;
    }



    // CREATE
    public Calage createCalage(Calage calage) {
        return calageRepository.save(calage);
    }

    // READ ALL
    public List<Calage> getAllCalages() {
        return calageRepository.findAll();
    }

    // UPDATE
    public Calage updateCalage(Long id, Calage updatedCalage) {
        return calageRepository.findById(id).map(c -> {
            c.setNom(updatedCalage.getNom());
            c.setClient(updatedCalage.getClient());
            c.setTemperature(updatedCalage.getTemperature());
            c.setVehiculeAssocie(updatedCalage.getVehiculeAssocie());
            c.setLoiRouteAssocie(updatedCalage.getLoiRouteAssocie());
            c.setModeConduite(updatedCalage.getModeConduite());
            c.setA(updatedCalage.getA());
            c.setB(updatedCalage.getB());
            c.setC(updatedCalage.getC());
            c.setDescription(updatedCalage.getDescription());
            return calageRepository.save(c);
        }).orElseThrow(() -> new RuntimeException("Calage non trouvé avec id : " + id));
    }

    // DELETE
    public void deleteCalage(Long id) {

        calageRepository.deleteById(id);
    }
    public long getCalageCount(Optional<Client> clientOpt) {

        User currentUser = userDetailsService.getCurrentUser()
                .orElseThrow(() -> new RuntimeException("Utilisateur non authentifié"));

        Client client;

        if (currentUser.getRole() == Role.ADMIN) {
            client = clientOpt.orElse(null); // admin peut filtrer
        } else {
            client = currentUser.getClient(); // user → son client
        }

        if (client == null) {
            return calageRepository.count();
        }

        return calageRepository.countByClient(client);
    }

    public List<Calage> getAllCalagesClient() {

        User currentUser = userDetailsService.getCurrentUser()
                .orElseThrow(() -> new RuntimeException("Utilisateur non authentifié"));

        return currentUser.getRole() == Role.ADMIN
                ? calageRepository.findAll()
                : calageRepository.findByClient(currentUser.getClient());
    }


}
