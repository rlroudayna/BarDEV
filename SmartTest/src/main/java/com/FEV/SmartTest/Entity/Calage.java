package com.FEV.SmartTest.Entity;

import com.FEV.SmartTest.Enum.ModeConduite;
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
@Table(name = "calages")
public class Calage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;

    @ManyToOne
    @JoinColumn(name = "vehicule_id")
    private Vehicule vehiculeAssocie;

    @ManyToOne
    @JoinColumn(name = "loi_route_id")
    private LoiRoute loiRouteAssocie;

    @Enumerated(EnumType.STRING)
    private ModeConduite modeConduite;

    private Float a;
    private Float b;
    private Float c;
    private String description;
}


