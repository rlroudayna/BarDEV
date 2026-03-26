package com.FEV.SmartTest.Repository;

import com.FEV.SmartTest.Entity.Vehicule;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VehiculeRepository  extends JpaRepository<Vehicule, Long> {
}
