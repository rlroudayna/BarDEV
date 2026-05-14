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
    long countByClient(Client client);
    List<DemandeEssai> findByVehiculeId(Long vehiculeId);
    List<DemandeEssai> findByCycleId(Long cycleId);
    List<DemandeEssai> findByStatutGlobal(StatutGlobal statutGlobal);
    long countByStatutGlobal(StatutGlobal statutGlobal);
    long countByStatutGlobalAndClient(StatutGlobal statutGlobal ,Client client) ;
    @Query("""
    SELECT MONTH(d.datePlanification), d.statutGlobal, COUNT(d)
    FROM DemandeEssai d
    WHERE YEAR(d.datePlanification) = :year
    AND (:client IS NULL OR d.client = :client)
    GROUP BY MONTH(d.datePlanification), d.statutGlobal
    ORDER BY MONTH(d.datePlanification)
""")
    List<Object[]> countByMonthAndStatutAndClient(
            @Param("year") int year,
            @Param("client") Client client
    );
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
(EXTRACT(WEEK FROM d.datePlanification) - 
 EXTRACT(WEEK FROM DATE_TRUNC('month', d.datePlanification)) + 1),
d.statutGlobal,
COUNT(d.id)
FROM DemandeEssai d
WHERE EXTRACT(YEAR FROM d.datePlanification) = :year
AND EXTRACT(MONTH FROM d.datePlanification) = :month
AND (:client IS NULL OR d.client = :client)
GROUP BY 1, d.statutGlobal
ORDER BY 1
""")
    List<Object[]> countByWeekAndStatut(int year, int month, Client client);

    long countByDatePlanification(LocalDate date);


}
