package com.FEV.SmartTest.Entity;

import com.FEV.SmartTest.Enum.DecisionValidation;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "validation_charge")
public class ValidationCharge {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fichierINCA;
    private String fichierBaR;
    private String fichierChecklist;

    @Enumerated(EnumType.STRING)
    private DecisionValidation validation;

    private Boolean oetbRenseigne;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @OneToOne
    @JoinColumn(name = "demande_essai_id")
    private DemandeEssai demandeEssai;

}
