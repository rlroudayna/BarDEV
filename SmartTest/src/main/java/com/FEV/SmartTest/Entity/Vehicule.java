package com.FEV.SmartTest.Entity;

import com.FEV.SmartTest.Enum.ModeConduite;
import com.FEV.SmartTest.Enum.TypeCarburant;
import com.FEV.SmartTest.Enum.TypeMotorisation;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "vehicules")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Vehicule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nomAppliImmat;
    private String immatriculation;
    private String vin;
    private String site;
    private String responsable;
    private String localisation;

    @Enumerated(EnumType.STRING)
    private TypeMotorisation motorisation;

    private String moteur;
    private String boiteVitesse;

    @Enumerated(EnumType.STRING)
    private TypeCarburant carburant;

    private String couleur;
    private String familleVehicule;

    @Enumerated(EnumType.STRING)
    private ModeConduite modeConduite;

    private String dimensionsPneus;
    private Float pressionPneus;
    private Float puissance;
    private Float densite;
    private Float empattement;
    private String typeCatalyseur;

}
