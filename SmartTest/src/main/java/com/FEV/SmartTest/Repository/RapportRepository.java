package com.FEV.SmartTest.Repository;

import com.FEV.SmartTest.Entity.Rapport;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RapportRepository extends JpaRepository<Rapport, Long> {
    List<Rapport> findByTitleContainingIgnoreCase(String title);

}
