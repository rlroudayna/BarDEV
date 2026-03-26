package com.FEV.SmartTest.Repository;

import com.FEV.SmartTest.Entity.ValidationConducteur;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ValidationConducteurRepository extends JpaRepository<ValidationConducteur, Long> {
    List<ValidationConducteur> findByUserId(Long Id);
    List<ValidationConducteur> findByDemandeEssaiId(Long Id);
}