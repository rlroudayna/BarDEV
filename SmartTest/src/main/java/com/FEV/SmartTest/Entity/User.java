package com.FEV.SmartTest.Entity;

import com.FEV.SmartTest.Enum.Role;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;
    private String prenom;
    private String email;

    @Enumerated(EnumType.STRING)
    private Role role;

    private String motDePasse;
    private String numeroTelephone;
    private String image;
}


