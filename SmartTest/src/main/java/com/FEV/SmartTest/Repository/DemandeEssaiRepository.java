package com.FEV.SmartTest.Repository;

import com.FEV.SmartTest.Entity.DemandeEssai;
import com.FEV.SmartTest.Enum.Client;
import com.FEV.SmartTest.Enum.StatutGlobal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface DemandeEssaiRepository extends JpaRepository<DemandeEssai, Long> {
    List<DemandeEssai> findByClient(Client client);

    List<DemandeEssai> findByVehiculeId(Long vehiculeId);
    List<DemandeEssai> findByCycleId(Long cycleId);
    List<DemandeEssai> findByStatutGlobal(StatutGlobal statutGlobal);
    long countByStatutGlobal(StatutGlobal statutGlobal);
    @Query("""
        SELECT MONTH(d.datePlanification), d.statutGlobal, COUNT(d)
        FROM DemandeEssai d
        WHERE YEAR(d.datePlanification) = :year
        GROUP BY MONTH(d.datePlanification), d.statutGlobal
        ORDER BY MONTH(d.datePlanification)
    """)
    List<Object[]> countByMonthAndStatut(@Param("year") int year);

    @Query("""
    SELECT 
      WEEK(d.datePlanification),
      d.statutGlobal,
      COUNT(d)
    FROM DemandeEssai d
    WHERE YEAR(d.datePlanification) = :year
    AND MONTH(d.datePlanification) = :month
    GROUP BY WEEK(d.datePlanification), d.statutGlobal
    ORDER BY WEEK(d.datePlanification)
    """)
    List<Object[]> countByWeekAndStatut(int year, int month);

    long countByDatePlanification(LocalDate date);


}
