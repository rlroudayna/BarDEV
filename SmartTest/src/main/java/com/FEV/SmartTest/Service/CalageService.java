package com.FEV.SmartTest.Service;

import com.FEV.SmartTest.Entity.Calage;
import com.FEV.SmartTest.Entity.User;
import com.FEV.SmartTest.Repository.CalageRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CalageService {
    private final CalageRepository calageRepository;
    private final CustomUserDetailsService userDetailsService;

    public CalageService(CalageRepository calageRepository, CustomUserDetailsService userDetailsService) {
        this.calageRepository = calageRepository;
        this.userDetailsService = userDetailsService;
    }

    // Vérifie si l'utilisateur connecté a le rôle CHARGE_ESSAI
    private void checkCharge() {
        User currentUser = userDetailsService.getCurrentUser()
                .orElseThrow(() -> new RuntimeException("Utilisateur non authentifié"));

        if (!"CHARGE_ESSAI".equals(currentUser.getRole().name())) {
            throw new RuntimeException("Action réservée aux conducteurs");
        }
    }

    // CREATE
    public Calage createCalage(Calage calage) {
        checkCharge();
        return calageRepository.save(calage);
    }

    // READ ALL
    public List<Calage> getAllCalages() {
        return calageRepository.findAll();
    }

    // UPDATE
    public Calage updateCalage(Long id, Calage updatedCalage) {
        // checkCharge();
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
        //checkCharge();
        calageRepository.deleteById(id);
    }

    public long getCalageCount() {
        return calageRepository.count();
    }

    public List<Calage> getAllCalagesClient() {

        User currentUser = userDetailsService.getCurrentUser()
                .orElseThrow(() -> new RuntimeException("Utilisateur non authentifié"));

        return calageRepository.findByClient(currentUser.getClient());
    }


}
