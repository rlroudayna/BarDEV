package com.FEV.SmartTest.Entity;

import com.FEV.SmartTest.Enum.*;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "demandes_essai")
public class DemandeEssai {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nomAuto;
    private String demandeur;

    private java.time.LocalDate datePlanification;

    @Enumerated(EnumType.STRING)
    private Shift shift;

    private Long numerProjet;

    @Enumerated(EnumType.STRING)
    private StatutGlobal statutGlobal;

    @Enumerated(EnumType.STRING)
    private StatutDemande statutDemande;

    @ManyToOne
    @JoinColumn(name = "vehicule_id")
    private Vehicule vehicule;

    @ManyToOne
    @JoinColumn(name = "cycle_conduite_id")
    private CycleConduite cycleConduite;

    @ManyToOne
    @JoinColumn(name = "calage_id")
    private Calage calage;

    @Enumerated(EnumType.STRING)
    private TypeProjet typeProjet;

    @Enumerated(EnumType.STRING)
    private Banc banc;

    private Boolean besoinMaceration;
    private Float temperatureMaceration;
    private Float temperatureEau;
    private Boolean activationSTT;
    private Float temperatureEssai;
    private Float hygrometrieEssai;

    @Enumerated(EnumType.STRING)
    private ListeGestionBatterie12V gestionBatterie12V;

    private Float socDepart12V;
    private Boolean activationClim;
    private Float temperatureRegulationClim;
    private Boolean chauffageHabitable;

    @Enumerated(EnumType.STRING)
    private TypeEssai typeEssai;

    private Boolean verificationCoastDown;
    private Integer nombreDecelerations;
    private String commentaire;

    private Boolean donneesINCA;
    private Boolean mesuresAuxiliaires;
    private Boolean gazBrutes;
    private Boolean gazDilues;
    private Boolean bag;

    @Enumerated(EnumType.STRING)
    private CapotListe capot;

    @Enumerated(EnumType.STRING)
    private SoufflanteListe soufflante;

    private Float qCvs;
    private Boolean carflow;
    private Boolean mesureSAC;

    private Float debitCVsPhase1;
    private Float debitCVsPhase2;
    private Float debitCVsPhase3;
    private Float debitCVsPhase4;
    private Float debitCVsPhase5;
    private Float debitCVsPhase6;
    private Float debitCVsPhase7;
    private Float debitCVsPhase8;
    private Float debitCVsPhase9;
    private Float debitCVsPhase10;

    private Boolean pm;
    private Float debitPrelevement;
    private Boolean pn10Nano;
    private Float facteurDilutionPN10;
    private Boolean pn23Nano;
    private Float facteurDilutionPN23;

    private Boolean ligne1;
    private String pointPrelevementL1;
    private Boolean ligne2;
    private String pointPrelevementL2;
    private Boolean ligne3;
    private String pointPrelevementL3;

    private Boolean qcl1;
    private String pointPrelevementQCL1;
    private Boolean qcl2;
    private String pointPrelevementQCL2;

    private Boolean pn1;
    private String pointPrelevementPN1;
    private Boolean pn2;
    private String pointPrelevementPN2;

    private Boolean egr;
    private Boolean microsot;
    private Boolean xcu1;
    private String software1;
    private String calibration1;
    private String experiment1;
    private Boolean xcu2;
    private String software2;
    private String calibration2;
    private Boolean xcu3;
    private String software3;
    private String calibration3;

    private Boolean acquisitionEOBD;
    private String typeAcquisition;
    private Boolean mesureCourant;
    private Integer indiceCourant;
    private Integer numeroTermocoupleCourant;
    private Boolean mesureTension;
    private Integer indiceTension;
    private Integer numeroTermocoupleTension;
    private Integer typeMesureTension;
    private Boolean thermocouples;
    private Boolean sondeLambdaLA4;
}
