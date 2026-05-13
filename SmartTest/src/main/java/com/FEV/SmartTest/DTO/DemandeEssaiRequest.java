package com.FEV.SmartTest.DTO;

import lombok.Data;

import java.time.LocalDate;

@Data
public class DemandeEssaiRequest {

    private Long vehiculeId;
    private Long calageId;
    private Long cycleId;

    private String nomAuto;
    private Long numerProjet;

    private String statutGlobal;
    private String statutDemande;

    private String typeProjet;
    private String client;

    private String demandeur;
    private String technicien;

    private String banc;
    private LocalDate datePlanification;
    private String shift;

    private Boolean besoinMaceration;
    private Float temperatureMaceration;
    private Float temperatureEau;
    private Float hygrometrieEssai;
    private Boolean activationSTT;
    private Float temperatureEssai;

    private String gestionBatterie12V;

    private Float socDepart12V;
    private Boolean activationClim;
    private Float temperatureRegulationClim;
    private Boolean chauffageHabitable;

    private String typeEssai;
    private Boolean verificationCoastDown;
    private Integer nombreDecelerations;
    private String commentaire;

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
    private Boolean microsot;
    private String pointPrelevementMicrosot;

    private Boolean qcl1;
    private String pointPrelevementQCL1;
    private Boolean qcl2;
    private String pointPrelevementQCL2;

    private Boolean FITR;
    private String pointPrelevementFITR;
    private Boolean egr;

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
    private Integer typeMesureCourant;

    private String capot;
    private String soufflante;

    private Float qCvs;
    private Boolean carflow;

    private Boolean mesureTension;
    private Integer indiceTension;
    private Integer numeroTermocoupleTension;

    private String typeMesureTension;

    private Boolean thermocouples;
    private Integer indicethermocouples;
    private Integer numeroTermocouple;

    private String typeMesurethermocouples;

    private Boolean sondeLambdaLA4;
    private Integer indicesondeLambdaLA4;
    private Integer numerosondeLambdaLA4;

    private String typeMesuresondeLambdaLA4;
}