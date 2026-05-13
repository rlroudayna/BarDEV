package com.FEV.SmartTest.Controller;

import com.FEV.SmartTest.Entity.DemandeEssai;
import com.FEV.SmartTest.Enum.Client;
import com.FEV.SmartTest.Service.DemandeEssaiService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

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
        return ResponseEntity.ok(demandeEssaiService.getAllDemandeClient());
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

    @PostMapping("/{id}/duplicate")
    public ResponseEntity<DemandeEssai> duplicateDemande(@PathVariable Long id) {
        return ResponseEntity.ok(demandeEssaiService.duplicateDemande(id));
    }

    @GetMapping("/RépartitionEssais")
    public Map<String, Long> getStatistiquesDemandes() {
        return demandeEssaiService.countDemandesByStatut();
    }

    @GetMapping("/evolution-12-mois")
    public ResponseEntity<List<Map<String, Object>>> evolution12Mois(
            @RequestParam(required = false) Client client
    ) {
        return ResponseEntity.ok(
                demandeEssaiService.evolutionEssais12Mois(client)
        );
    }
    @GetMapping("/evolution-semaine")
    public List<Map<String, Object>> evolutionParSemaine(
            @RequestParam int month,
            @RequestParam(required = false) Client client
    ) {
        return demandeEssaiService.evolutionEssaisParSemaine(month, client);
    }

    @GetMapping("/countTotal")
    public long getTotalDemandes(
            @RequestParam(required = false) Client client
    ) {
        return demandeEssaiService.getTotalDemandes(Optional.ofNullable(client));
    }
    @GetMapping("/demandesBystatus")
    public Map<String, Long> getStats(
            @RequestParam(required = false) Client client) {

        return demandeEssaiService.countDemandesByStatut(Optional.ofNullable(client));
    }
}
