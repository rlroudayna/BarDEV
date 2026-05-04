package com.FEV.SmartTest.Controller;

import com.FEV.SmartTest.Entity.ValidationCharge;
import com.FEV.SmartTest.Service.ValidationChargeService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/validation_charge")
public class ValidationChargeController {
    private final ValidationChargeService validationService;

    public ValidationChargeController(ValidationChargeService validationService) {
        this.validationService = validationService;
    }

    @PostMapping("/valider/{demandeId}")
    public ValidationCharge validerDemande(
            @PathVariable Long demandeId,
            @RequestBody ValidationCharge validation
    ) {
        return validationService.validerDemande(demandeId, validation);
    }
}



