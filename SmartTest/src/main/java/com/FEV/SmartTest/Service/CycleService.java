package com.FEV.SmartTest.Service;

import com.FEV.SmartTest.Entity.CycleConduite;
import com.FEV.SmartTest.Entity.User;
import com.FEV.SmartTest.Entity.Vehicule;
import com.FEV.SmartTest.Enum.Client;
import com.FEV.SmartTest.Repository.CycleConduiteRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CycleService {

    private final CycleConduiteRepository cycleConduiteRepository;
    private final CustomUserDetailsService userDetailsService;



    public CycleService(CycleConduiteRepository cycleConduiteRepository, CustomUserDetailsService userDetailsService) {
        this.cycleConduiteRepository = cycleConduiteRepository;
        this.userDetailsService = userDetailsService;
    }

    private void checkCharge() {
        User currentUser = userDetailsService.getCurrentUser()
                .orElseThrow(() -> new RuntimeException("Utilisateur non authentifié"));

        if (!"CHARGE_ESSAI".equals(currentUser.getRole().name())) {
            throw new RuntimeException("Action réservée aux conducteurs");
        }
    }

    // CREATE
    public CycleConduite createTest(CycleConduite cycleConduite) {
        checkCharge();
        return cycleConduiteRepository.save(cycleConduite);
    }

    // READ ALL
    public List<CycleConduite> getAllTests() {
        return cycleConduiteRepository.findAll();
    }

    // UPDATE
    public CycleConduite updateTest(Long id, CycleConduite updatedCycleConduite) {
        checkCharge();
        return cycleConduiteRepository.findById(id).map(t -> {
            t.setNom(updatedCycleConduite.getNom());
            t.setFamilleTest(updatedCycleConduite.getFamilleTest());
            t.setDuree(updatedCycleConduite.getDuree());
            t.setClient(updatedCycleConduite.getClient());
            t.setNombrePhase(updatedCycleConduite.getNombrePhase());
            t.setNombreStabilises(updatedCycleConduite.getNombreStabilises());
            t.setTraceFilePath(updatedCycleConduite.getTraceFilePath());
            return cycleConduiteRepository.save(t);
        }).orElseThrow(() -> new RuntimeException("Test non trouvé avec id : " + id));
    }

    // DELETE
    public void deleteTest(Long id) {
        checkCharge();
        cycleConduiteRepository.deleteById(id);
    }

    public long getCycleCount() {
        return cycleConduiteRepository.count();
    }
    public List<CycleConduite> getAllCycleClient() {
        User currentUser = userDetailsService.getCurrentUser()
                .orElseThrow(() -> new RuntimeException("Utilisateur non authentifié"));

        Client client = currentUser.getClient();

        return cycleConduiteRepository.findByClient(client);
    }

}
