package com.FEV.SmartTest.Controller;


import com.FEV.SmartTest.Entity.LoiRoute;
import com.FEV.SmartTest.Service.LoiRouteService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lois-route")
@CrossOrigin(origins = "http://localhost:5173")

   public class LoiRouteController {

    private final LoiRouteService loiRouteService;

        public LoiRouteController(LoiRouteService loiRouteService) {
            this.loiRouteService = loiRouteService;
        }

        @PostMapping
        public ResponseEntity<LoiRoute> createLoiRoute(@RequestBody LoiRoute loiRoute) {
            LoiRoute created = loiRouteService.createLoiRoute(loiRoute);
            return ResponseEntity.ok(created);
        }

        @GetMapping
        public ResponseEntity<List<LoiRoute>> getAllLoisRoute() {
            List<LoiRoute> lois = loiRouteService.getAllLoisRouteClient();
            return ResponseEntity.ok(lois);
        }
       @GetMapping("/count")
       public long getLoiCount() {
         return loiRouteService.getLoiCount();
       }

        @GetMapping("/{id}")
        public ResponseEntity<LoiRoute> getLoiRouteById(@PathVariable Long id) {
            LoiRoute lr = loiRouteService.getAllLoisRoute().stream()
                    .filter(l -> l.getId().equals(id))
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("Loi de route non trouvée avec id : " + id));
            return ResponseEntity.ok(lr);
        }

        @PutMapping("/{id}")
        public ResponseEntity<LoiRoute> updateLoiRoute(@PathVariable Long id, @RequestBody LoiRoute updatedLoiRoute) {
            LoiRoute lr = loiRouteService.updateLoiRoute(id, updatedLoiRoute);
            return ResponseEntity.ok(lr);
        }

        @DeleteMapping("/{id}")
        public ResponseEntity<Void> deleteLoiRoute(@PathVariable Long id) {
            loiRouteService.deleteLoiRoute(id);
            return ResponseEntity.noContent().build();
        }






    }