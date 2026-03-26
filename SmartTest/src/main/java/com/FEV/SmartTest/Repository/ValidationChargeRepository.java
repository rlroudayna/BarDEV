package com.FEV.SmartTest.Repository;

import com.FEV.SmartTest.Entity.ValidationCharge;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ValidationChargeRepository  extends JpaRepository<ValidationCharge, Long> {
    List<ValidationCharge> findByUserId(Long utilisateurId);
    List<ValidationCharge> findByDemandeEssaiId(Long demandeEssaiId);
}
