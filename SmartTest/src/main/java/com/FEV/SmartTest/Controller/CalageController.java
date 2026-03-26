package com.FEV.SmartTest.Controller;

import com.FEV.SmartTest.Entity.Calage;
import com.FEV.SmartTest.Service.CalageService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/calages")
@CrossOrigin(origins = "http://localhost:5173")

public class CalageController {
    private final CalageService calageService;

    public CalageController(CalageService calageService) {
        this.calageService = calageService;
    }

    // CREATE
    @PostMapping
    public ResponseEntity<Calage> createCalage(@RequestBody Calage calage) {
        Calage created = calageService.createCalage(calage);
        return ResponseEntity.ok(created);
    }

    // READ ALL
    @GetMapping
    public ResponseEntity<List<Calage>> getAllCalages() {
        return ResponseEntity.ok(calageService.getAllCalages());
    }

    // READ ONE
    @GetMapping("/{id}")
    public ResponseEntity<Calage> getCalageById(@PathVariable Long id) {
        Calage c = calageService.getAllCalages().stream()
                .filter(cal -> cal.getId().equals(id))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Calage non trouvé avec id : " + id));
        return ResponseEntity.ok(c);
    }

    // UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<Calage> updateCalage(@PathVariable Long id, @RequestBody Calage updatedCalage) {
        Calage updated = calageService.updateCalage(id, updatedCalage);
        return ResponseEntity.ok(updated);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCalage(@PathVariable Long id) {
        calageService.deleteCalage(id);
        return ResponseEntity.noContent().build();
    }


}
