package com.FEV.SmartTest.Service;

import com.FEV.SmartTest.Entity.DemandeEssai;
import com.FEV.SmartTest.Entity.User;
import com.FEV.SmartTest.Entity.ValidationCharge;
import com.FEV.SmartTest.Enum.DecisionValidation;
import com.FEV.SmartTest.Repository.DemandeEssaiRepository;
import com.FEV.SmartTest.Repository.UserRepository;
import com.FEV.SmartTest.Repository.ValidationChargeRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
@Service
public class ValidationChargeService {
    private final ValidationChargeRepository validationRepo;
    private final DemandeEssaiRepository demandeRepo;
    private final UserRepository userRepo;
    private final DemandeEssaiService demandeEssaiService;

    public ValidationChargeService(
            ValidationChargeRepository validationRepo,
            DemandeEssaiRepository demandeRepo,
            UserRepository userRepo,
            DemandeEssaiService demandeEssaiService
    ) {
        this.validationRepo = validationRepo;
        this.demandeRepo = demandeRepo;
        this.userRepo = userRepo;
        this.demandeEssaiService =demandeEssaiService;
    }
    public ValidationCharge validerDemande(
            Long demandeId,
            ValidationCharge validationCharge
    ) {

        DemandeEssai demande = demandeRepo.findById(demandeId)
                .orElseThrow(() -> new RuntimeException("Demande non trouvée"));

        validationCharge.setDemandeEssai(demande);
        validationCharge.setDateValidation(LocalDate.now());

        ValidationCharge saved = validationRepo.save(validationCharge);

        demandeEssaiService.mettreAJourStatut(demandeId);

        return saved;
    }
}

