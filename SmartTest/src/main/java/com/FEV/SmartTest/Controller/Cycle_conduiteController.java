package com.FEV.SmartTest.Controller;

import com.FEV.SmartTest.Entity.CycleConduite;
import com.FEV.SmartTest.Service.CycleService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cycles")
@CrossOrigin(origins = "http://localhost:5173")

public class Cycle_conduiteController {
    private final CycleService cycleService;

    public Cycle_conduiteController(CycleService cycleService) {
        this.cycleService = cycleService;
    }

    // CREATE
    @PostMapping
    public ResponseEntity<CycleConduite> createCycle(@RequestBody CycleConduite cycle) {
        CycleConduite created = cycleService.createTest(cycle);
        return ResponseEntity.ok(created);
    }

    // READ ALL
    @GetMapping
    public ResponseEntity<List<CycleConduite>> getAllCycles() {
        return ResponseEntity.ok(cycleService.getAllTests());
    }

    // READ ONE
    @GetMapping("/{id}")
    public ResponseEntity<CycleConduite> getCycleById(@PathVariable Long id) {
        CycleConduite cycle = cycleService.getAllTests().stream()
                .filter(c -> c.getId().equals(id))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Cycle non trouvé avec id : " + id));
        return ResponseEntity.ok(cycle);
    }

    // UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<CycleConduite> updateCycle(@PathVariable Long id, @RequestBody CycleConduite updatedCycle) {
        CycleConduite updated = cycleService.updateTest(id, updatedCycle);
        return ResponseEntity.ok(updated);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCycle(@PathVariable Long id) {
        cycleService.deleteTest(id);
        return ResponseEntity.noContent().build();
    }
}
