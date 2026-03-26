package com.FEV.SmartTest.Repository;

import com.FEV.SmartTest.Entity.DemandeEssai;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DemandeEssaiRepository extends JpaRepository<DemandeEssai, Long> {
    List<DemandeEssai> findByVehiculeId(Long vehiculeId);
    List<DemandeEssai> findByCycleConduiteId(Long cycleConduiteId);
}
