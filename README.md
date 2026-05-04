# TAURUS V2

Application web de gestion de banc d'essai dynamométrique.

## Fonctionnalités

### Pages d'authentification
- **Page d'accueil** : Introduction à l'application
- **Connexion** : Authentification des utilisateurs
- **Création de compte** : Inscription de nouveaux utilisateurs

### Pages de l'application

#### Dashboard
- Vue d'ensemble avec indicateurs clés (véhicules, lois de route, calages, cycles, essais)
- Graphiques de répartition des essais (camembert)
- Évolution sur 12 mois (graphique en barres empilées)
- Récapitulatif rapide des essais du jour

#### Gestion
- **Véhicules** : Gestion de la base de données des véhicules
- **Lois de route** : Paramétrage des lois de simulation des efforts routiers
- **Calages** : Configuration des calages pour les essais
- **Cycles de conduite** : Gestion des cycles de roulage (WLTC, NEDC, RDE, etc.)

#### Demandes et Planning
- **Demandes d'essai** : Création et gestion des demandes d'utilisation du banc
- **Planning hebdomadaire** : Visualisation calendrier des essais planifiés

#### Validation
- **Validation** : Vue d'ensemble des validations
- **Validation Conducteur** : Validation du point de vue déroulement
- **Validation Chargé d'essai** : Validation du point de vue analyse

#### Reporting
- Analyses et rapports d'activité
- KPIs et graphiques d'évolution
- Export de rapports

## Design System

### Couleurs
- **Primaire** : #0A2647 (bleu foncé) - Navigation
- **Accent** : #0288D1 (bleu) - Boutons, liens
- **Fond** : #F5F5F5 (gris clair)
- **Cartes** : #FFFFFF (blanc)
- **Succès** : #2E7D32 (vert)
- **Erreur** : #C62828 (rouge)
- **Avertissement** : #ED6C02 (orange)

### Typographie
- Police : Inter (400, 500, 600)
- Tailles : 12px - 48px

### Composants
- Cards avec coins arrondis (12px)
- Ombres légères
- Badges colorés selon le statut
- Tableaux avec alternance de couleurs
- Formulaires avec validation

## Technologies

- React 18
- React Router 7
- Recharts (graphiques)
- Radix UI (composants)
- Tailwind CSS v4
- TypeScript
- Lucide React (icônes)

## Navigation

L'application utilise une navigation latérale fixe avec les sections principales :
- Dashboard
- Véhicules
- Lois de route
- Calages
- Cycles
- Demandes
- Planning
- Validation
- Reporting

## Données

Actuellement, l'application utilise des données mockées pour la démonstration. Pour une utilisation en production, il faudrait connecter une base de données réelle.
