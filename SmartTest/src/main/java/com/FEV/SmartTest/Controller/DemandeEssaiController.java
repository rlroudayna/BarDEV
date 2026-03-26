package com.FEV.SmartTest.Controller;

import com.FEV.SmartTest.Entity.DemandeEssai;
import com.FEV.SmartTest.Service.DemandeEssaiService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/demandes-essai")
@CrossOrigin(origins = "http://localhost:5173")

public class DemandeEssaiController {

    private final DemandeEssaiService demandeEssaiService;

    public DemandeEssaiController(DemandeEssaiService demandeEssaiService) {
        this.demandeEssaiService = demandeEssaiService;
    }

    // ------------------ CREATE ------------------
    @PostMapping
    public ResponseEntity<DemandeEssai> createDemande(@RequestBody DemandeEssai demande) {
        return ResponseEntity.ok(demandeEssaiService.createDemande(demande));
    }

    // ------------------ READ ALL ------------------
    @GetMapping
    public ResponseEntity<List<DemandeEssai>> getAllDemandes() {
        return ResponseEntity.ok(demandeEssaiService.getAllDemandes());
    }

    // ------------------ READ ONE ------------------
    @GetMapping("/{id}")
    public ResponseEntity<DemandeEssai> getDemandeById(@PathVariable Long id) {
        return ResponseEntity.ok(demandeEssaiService.getById(id));
    }

    // ------------------ UPDATE ------------------
    @PutMapping("/{id}")
    public ResponseEntity<DemandeEssai> updateDemande(
            @PathVariable Long id,
            @RequestBody DemandeEssai updatedDemande
    ) {
        return ResponseEntity.ok(demandeEssaiService.updateDemande(id, updatedDemande));
    }

    // ------------------ DELETE ------------------
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDemande(@PathVariable Long id) {
        demandeEssaiService.deleteDemande(id);
        return ResponseEntity.noContent().build();
    }
}
