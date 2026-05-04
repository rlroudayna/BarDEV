package com.FEV.SmartTest.Service;

import com.FEV.SmartTest.Entity.DemandeEssai;
import com.FEV.SmartTest.Entity.User;
import com.FEV.SmartTest.Entity.ValidationTechnicien;
import com.FEV.SmartTest.Enum.DecisionValidation;
import com.FEV.SmartTest.Repository.DemandeEssaiRepository;
import com.FEV.SmartTest.Repository.UserRepository;
import com.FEV.SmartTest.Repository.ValidationTechnicienRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


@Service
public class ValidationTechnicienService {

    private final ValidationTechnicienRepository validationTechnicienRepo;
    private final DemandeEssaiRepository demandeRepo;
    private final DemandeEssaiService demandeEssaiService;

    public ValidationTechnicienService(
            ValidationTechnicienRepository validationTechnicienRepo,
            DemandeEssaiRepository demandeRepo,
            DemandeEssaiService demandeEssaiService
    ) {
        this.validationTechnicienRepo = validationTechnicienRepo;
        this.demandeRepo = demandeRepo;
        this.demandeEssaiService = demandeEssaiService;
    }

    public ValidationTechnicien validerDemande(
            Long demandeId,
            DecisionValidation decision,
            String commentaire
    ) {

        DemandeEssai demande = demandeRepo.findById(demandeId)
                .orElseThrow(() -> new RuntimeException("Demande non trouvée"));

        ValidationTechnicien validation = new ValidationTechnicien();
        validation.setDemandeEssai(demande);
        validation.setDecision(decision);
        validation.setCommentaire(commentaire);
        validation.setDateValidation(LocalDate.now());

        ValidationTechnicien saved = validationTechnicienRepo.save(validation);

        // Mise à jour du statut global
        demandeEssaiService.mettreAJourStatut(demandeId);

        return saved;
    }

  {/* public List<Map<String, Object>> getTechnicienValidationStats(Long technicienId) {

        List<Object[]> results;

        if (technicienId == null) {
            results = validationTechnicienRepo.countByStatutValidation();
        } else {
            results = validationTechnicienRepo.countValidationByTechnicien(technicienId);
        }

        Map<String, Integer> stats = new HashMap<>();
        stats.put("OK", 0);
        stats.put("NOK", 0);
        stats.put("Sous réserve", 0);

        for (Object[] r : results) {
            DecisionValidation decision = (DecisionValidation) r[0];
            Long count = (Long) r[1];

            if (decision == DecisionValidation.OK) {
                stats.put("OK", count.intValue());
            } else if (decision == DecisionValidation.NOK) {
                stats.put("NOK", count.intValue());
            } else if (decision == DecisionValidation.OK_SOUS_RESERVE) {
                stats.put("Sous réserve", count.intValue());
            }
        }

        List<Map<String, Object>> response = new ArrayList<>();
        response.add(Map.of("name", "OK", "value", stats.get("OK"), "color", "#2E7D32"));
        response.add(Map.of("name", "NOK", "value", stats.get("NOK"), "color", "#C62828"));
        response.add(Map.of("name", "Sous réserve", "value", stats.get("Sous réserve"), "color", "#ED6C02"));

        return response;
    }*/}
}

