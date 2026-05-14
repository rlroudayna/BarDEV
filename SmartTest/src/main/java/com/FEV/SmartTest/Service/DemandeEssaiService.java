package com.FEV.SmartTest.Service;

import com.FEV.SmartTest.DTO.DemandeEssaiRequest;
import com.FEV.SmartTest.Entity.DemandeEssai;
import com.FEV.SmartTest.Entity.User;
import com.FEV.SmartTest.Enum.*;
import com.FEV.SmartTest.Repository.*;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;

@Service
public class DemandeEssaiService {

    private final DemandeEssaiRepository demandRepository;
    private final CustomUserDetailsService userDetailsService;
    private final ValidationTechnicienRepository validationTechnicienRepo;
    private final ValidationChargeRepository validationChargeRepo;
    private final VehiculeRepository vehiculeRepository;
    private final CalageRepository calageRepository;
    private final CycleConduiteRepository cycleRepository;

    public DemandeEssaiService(
            DemandeEssaiRepository demandRepository,
            CustomUserDetailsService userDetailsService,
            ValidationTechnicienRepository validationTechnicienRepo,
            ValidationChargeRepository validationChargeRepo,
            VehiculeRepository vehiculeRepository,
            CalageRepository calageRepository,
            CycleConduiteRepository cycleRepository
    ) {
        this.demandRepository = demandRepository;
        this.userDetailsService = userDetailsService;
        this.validationTechnicienRepo = validationTechnicienRepo;
        this.validationChargeRepo = validationChargeRepo;
        this.vehiculeRepository = vehiculeRepository;
        this.calageRepository = calageRepository;
        this.cycleRepository = cycleRepository;
    }


    // ------------------ CREATE ------------------
    public DemandeEssai createDemande(DemandeEssai demande) {

        return demandRepository.save(demande);
    }
    public DemandeEssai create(DemandeEssaiRequest dto) {

        DemandeEssai demande = new DemandeEssai();

        /* =========================
           RELATIONS
        ========================= */
        demande.setVehicule(
                vehiculeRepository.findById(dto.getVehiculeId())
                        .orElseThrow(() -> new RuntimeException("Vehicule introuvable"))
        );

        demande.setCalage(
                calageRepository.findById(dto.getCalageId())
                        .orElseThrow(() -> new RuntimeException("Calage introuvable"))
        );

        demande.setCycle(
                cycleRepository.findById(dto.getCycleId())
                        .orElseThrow(() -> new RuntimeException("Cycle introuvable"))
        );

        /* =========================
           INFOS PRINCIPALES
        ========================= */
        demande.setNomAuto(dto.getNomAuto());
        demande.setNumeroProjet(dto.getNumerProjet());
        demande.setDemandeur(dto.getDemandeur());
        demande.setTechnicien(dto.getTechnicien());

        /* =========================
           ENUMS (conversion String → Enum)
        ========================= */
        if (dto.getStatutDemande() != null)
            demande.setStatutDemande(StatutDemande.valueOf(dto.getStatutDemande()));

        if (dto.getStatutGlobal() != null)
            demande.setStatutGlobal(StatutGlobal.valueOf(dto.getStatutGlobal()));

        if (dto.getTypeProjet() != null)
            demande.setTypeProjet(TypeProjet.valueOf(dto.getTypeProjet()));

        if (dto.getClient() != null)
            demande.setClient(Client.valueOf(dto.getClient()));

        if (dto.getBanc() != null)
            demande.setBanc(Banc.valueOf(dto.getBanc()));

        if (dto.getShift() != null)
            demande.setShift(Shift.valueOf(dto.getShift()));

        if (dto.getTypeEssai() != null)
            demande.setTypeEssai(TypeEssai.valueOf(dto.getTypeEssai()));

        if (dto.getCapot() != null)
            demande.setCapot(CapotListe.valueOf(dto.getCapot()));

        if (dto.getSoufflante() != null)
            demande.setSoufflante(SoufflanteListe.valueOf(dto.getSoufflante()));

        if (dto.getGestionBatterie12V() != null)
            demande.setGestionBatterie12V(ListeGestionBatterie12V.valueOf(dto.getGestionBatterie12V()));

        /* =========================
           DATES
        ========================= */
        demande.setDatePlanification(dto.getDatePlanification());

        /* =========================
           CONDITIONS ESSAI
        ========================= */
        demande.setBesoinMaceration(dto.getBesoinMaceration());
        demande.setTemperatureMaceration(dto.getTemperatureMaceration());
        demande.setTemperatureEau(dto.getTemperatureEau());
        demande.setHygrometrieEssai(dto.getHygrometrieEssai());
        demande.setActivationSTT(dto.getActivationSTT());
        demande.setTemperatureEssai(dto.getTemperatureEssai());

        demande.setSocDepart12V(dto.getSocDepart12V());
        demande.setActivationClim(dto.getActivationClim());
        demande.setTemperatureRegulationClim(dto.getTemperatureRegulationClim());
        demande.setChauffageHabitable(dto.getChauffageHabitable());

        demande.setVerificationCoastDown(dto.getVerificationCoastDown());
        demande.setNombreDecelerations(dto.getNombreDecelerations());
        demande.setCommentaire(dto.getCommentaire());

        /* =========================
           MESURES
        ========================= */
        demande.setMesureSAC(dto.getMesureSAC());
        demande.setDebitCVsPhase1(dto.getDebitCVsPhase1());
        demande.setDebitCVsPhase2(dto.getDebitCVsPhase2());
        demande.setDebitCVsPhase3(dto.getDebitCVsPhase3());
        demande.setDebitCVsPhase4(dto.getDebitCVsPhase4());
        demande.setDebitCVsPhase5(dto.getDebitCVsPhase5());
        demande.setDebitCVsPhase6(dto.getDebitCVsPhase6());
        demande.setDebitCVsPhase7(dto.getDebitCVsPhase7());
        demande.setDebitCVsPhase8(dto.getDebitCVsPhase8());
        demande.setDebitCVsPhase9(dto.getDebitCVsPhase9());
        demande.setDebitCVsPhase10(dto.getDebitCVsPhase10());

        /* =========================
           SAUVEGARDE
        ========================= */
        return demandRepository.save(demande);
    }


    // ------------------ READ ALL ------------------
    public List<DemandeEssai> getAllDemandes() {
        return demandRepository.findAll();
    }

    // ------------------ READ ONE ------------------
    public DemandeEssai getById(Long id) {
        return demandRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Demande non trouvée avec id : " + id));
    }

    // ------------------ UPDATE ------------------
    public DemandeEssai updateDemande(Long id, DemandeEssai updated) {


        return demandRepository.findById(id).map(d -> {

            // Informations générales
            d.setNomAuto(updated.getNomAuto());
            d.setNumeroProjet(updated.getNumeroProjet());
            d.setStatutGlobal(updated.getStatutGlobal());
            d.setStatutDemande(updated.getStatutDemande());
            d.setDemandeur(updated.getDemandeur());
            d.setTechnicien(updated.getTechnicien());
            d.setClient(updated.getClient());

            // Relations
            d.setVehicule(updated.getVehicule());
            d.setCycle(updated.getCycle());
            d.setCalage(updated.getCalage());

            // Planification
            d.setDatePlanification(updated.getDatePlanification());
            d.setShift(updated.getShift());
            d.setBanc(updated.getBanc());
            d.setTypeProjet(updated.getTypeProjet());

            // Conditions essai
            d.setBesoinMaceration(updated.getBesoinMaceration());
            d.setTemperatureMaceration(updated.getTemperatureMaceration());
            d.setTemperatureEau(updated.getTemperatureEau());
            d.setHygrometrieEssai(updated.getHygrometrieEssai());
            d.setActivationSTT(updated.getActivationSTT());
            d.setTemperatureEssai(updated.getTemperatureEssai());

            // Batterie / clim
            d.setGestionBatterie12V(updated.getGestionBatterie12V());
            d.setSocDepart12V(updated.getSocDepart12V());
            d.setActivationClim(updated.getActivationClim());
            d.setTemperatureRegulationClim(updated.getTemperatureRegulationClim());
            d.setChauffageHabitable(updated.getChauffageHabitable());

            // Type essai
            d.setTypeEssai(updated.getTypeEssai());
            d.setVerificationCoastDown(updated.getVerificationCoastDown());
            d.setNombreDecelerations(updated.getNombreDecelerations());
            d.setCommentaire(updated.getCommentaire());

            // Débits CVS
            d.setMesureSAC(updated.getMesureSAC());
            d.setDebitCVsPhase1(updated.getDebitCVsPhase1());
            d.setDebitCVsPhase2(updated.getDebitCVsPhase2());
            d.setDebitCVsPhase3(updated.getDebitCVsPhase3());
            d.setDebitCVsPhase4(updated.getDebitCVsPhase4());
            d.setDebitCVsPhase5(updated.getDebitCVsPhase5());
            d.setDebitCVsPhase6(updated.getDebitCVsPhase6());
            d.setDebitCVsPhase7(updated.getDebitCVsPhase7());
            d.setDebitCVsPhase8(updated.getDebitCVsPhase8());
            d.setDebitCVsPhase9(updated.getDebitCVsPhase9());
            d.setDebitCVsPhase10(updated.getDebitCVsPhase10());

            // Particules
            d.setPm(updated.getPm());
            d.setDebitPrelevement(updated.getDebitPrelevement());
            d.setPn10Nano(updated.getPn10Nano());
            d.setFacteurDilutionPN10(updated.getFacteurDilutionPN10());
            d.setPn23Nano(updated.getPn23Nano());
            d.setFacteurDilutionPN23(updated.getFacteurDilutionPN23());

            // Lignes
            d.setLigne1(updated.getLigne1());
            d.setPointPrelevementL1(updated.getPointPrelevementL1());
            d.setLigne2(updated.getLigne2());
            d.setPointPrelevementL2(updated.getPointPrelevementL2());
            d.setLigne3(updated.getLigne3());
            d.setPointPrelevementL3(updated.getPointPrelevementL3());

            // Microsot / QCL
            d.setMicrosot(updated.getMicrosot());
            d.setPointPrelevementMicrosot(updated.getPointPrelevementMicrosot());

            d.setQcl1(updated.getQcl1());
            d.setPointPrelevementQCL1(updated.getPointPrelevementQCL1());
            d.setQcl2(updated.getQcl2());
            d.setPointPrelevementQCL2(updated.getPointPrelevementQCL2());

            d.setFITR(updated.getFITR());
            d.setPointPrelevementFITR(updated.getPointPrelevementFITR());

            d.setEgr(updated.getEgr());

            // ECU
            d.setXcu1(updated.getXcu1());
            d.setSoftware1(updated.getSoftware1());
            d.setCalibration1(updated.getCalibration1());
            d.setExperiment1(updated.getExperiment1());

            d.setXcu2(updated.getXcu2());
            d.setSoftware2(updated.getSoftware2());
            d.setCalibration2(updated.getCalibration2());

            d.setXcu3(updated.getXcu3());
            d.setSoftware3(updated.getSoftware3());
            d.setCalibration3(updated.getCalibration3());

            // Acquisition
            d.setAcquisitionEOBD(updated.getAcquisitionEOBD());
            d.setTypeAcquisition(updated.getTypeAcquisition());

            // Mesure courant
            d.setMesureCourant(updated.getMesureCourant());
            d.setIndiceCourant(updated.getIndiceCourant());
            d.setNumeroTermocoupleCourant(updated.getNumeroTermocoupleCourant());
            d.setTypeMesureCourant(updated.getTypeMesureCourant());

            // Capot / soufflante
            d.setCapot(updated.getCapot());
            d.setSoufflante(updated.getSoufflante());

            // CVS
            d.setQCvs(updated.getQCvs());
            d.setCarflow(updated.getCarflow());

            // Mesure tension
            d.setMesureTension(updated.getMesureTension());
            d.setIndiceTension(updated.getIndiceTension());
            d.setNumeroTermocoupleTension(updated.getNumeroTermocoupleTension());
            d.setTypeMesureTension(updated.getTypeMesureTension());

            // Thermocouples
            d.setThermocouples(updated.getThermocouples());
            d.setIndicethermocouples(updated.getIndicethermocouples());
            d.setNumeroTermocouple(updated.getNumeroTermocouple());
            d.setTypeMesurethermocouples(updated.getTypeMesurethermocouples());

            // Sonde Lambda
            d.setSondeLambdaLA4(updated.getSondeLambdaLA4());
            d.setIndicesondeLambdaLA4(updated.getIndicesondeLambdaLA4());
            d.setNumerosondeLambdaLA4(updated.getNumerosondeLambdaLA4());
            d.setTypeMesuresondeLambdaLA4(updated.getTypeMesuresondeLambdaLA4());

            return demandRepository.save(updated);

        }).orElseThrow(() -> new RuntimeException("Demande non trouvée avec id : " + id));
    }
    // ------------------ DELETE ------------------
    public void deleteDemande(Long id) {

        demandRepository.deleteById(id);
    }
    public DemandeEssai duplicateDemande(Long id) {



        DemandeEssai original = demandRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Demande introuvable"));

        DemandeEssai copy = new DemandeEssai();

        // copier toutes les propriétés sauf l'id
        BeanUtils.copyProperties(original, copy, "id");

        // Optionnel : modifier certaines valeurs pour la nouvelle demande
        copy.setStatutGlobal(StatutGlobal.PAS_FAIT);

        return demandRepository.save(copy);
    }
    public  void mettreAJourStatut(Long demandeId) {

        DemandeEssai demande = demandRepository.findById(demandeId)
                .orElseThrow(() -> new RuntimeException("Demande introuvable"));

        boolean validationTech =
                validationTechnicienRepo.existsByDemandeEssaiId(demandeId);

        boolean validationCharge =
                validationChargeRepo.existsByDemandeEssaiId(demandeId);

        if (validationTech && validationCharge) {
            demande.setStatutGlobal(StatutGlobal.FAIT);
        }
        else if (validationTech || validationCharge) {
            demande.setStatutGlobal(StatutGlobal.EN_COURS);
        }
        else {
            demande.setStatutGlobal(StatutGlobal.PAS_FAIT);
        }

        demandRepository.save(demande);
    }
    public Map<String, Long> countDemandesByStatut() {

        long fait = demandRepository.countByStatutGlobal(StatutGlobal.FAIT);
        long encours = demandRepository.countByStatutGlobal(StatutGlobal.EN_COURS);
        long pasFait = demandRepository.countByStatutGlobal(StatutGlobal.PAS_FAIT);

        Map<String, Long> stats = new HashMap<>();
        stats.put("fait", fait);
        stats.put("encours", encours);
        stats.put("pasFait", pasFait);

        return stats;
    }

    public List<Map<String, Object>> evolutionEssais12Mois(Client clientParam) {

        int year = LocalDate.now().getYear();

        User user = userDetailsService.getCurrentUser()
                .orElseThrow(() -> new RuntimeException("Utilisateur non authentifié"));

        Client client;

        if (user.getRole() == Role.ADMIN) {
            client = clientParam;
        }
        else {
            client = user.getClient();
        }

        List<Object[]> results = (client == null)
                ? demandRepository.countByMonthAndStatut(year)
                : demandRepository.countByMonthAndStatutAndClient(year, client);

        Map<Integer, Map<String, Object>> data = new HashMap<>();

        String[] mois = {"Jan","Fév","Mars","Avr","Mai","Juin","Juil","Août","Sep","Oct","Nov","Déc"};

        for (int i = 1; i <= 12; i++) {
            Map<String, Object> m = new HashMap<>();
            m.put("month", mois[i - 1]);
            m.put("Fait", 0L);
            m.put("Pas_fait", 0L);
            m.put("En_cours", 0L);
            data.put(i, m);
        }

        for (Object[] r : results) {

            int month = (Integer) r[0];
            StatutGlobal statut = (StatutGlobal) r[1];
            Long count = (Long) r[2];

            Map<String, Object> m = data.get(month);

            if (statut == StatutGlobal.FAIT) {
                m.put("Fait", count);
            } else if (statut == StatutGlobal.PAS_FAIT) {
                m.put("Pas_fait", count);
            } else if (statut == StatutGlobal.EN_COURS) {
                m.put("En_cours", count);
            }
        }

        return data.entrySet()
                .stream()
                .sorted(Map.Entry.comparingByKey())
                .map(Map.Entry::getValue)
                .toList();
    }

    public int convertMonth(String m) {
        return switch (m) {
            case "Jan" -> 1;
            case "Feb" -> 2;
            case "Mar" -> 3;
            case "Apr" -> 4;
            case "May" -> 5;
            case "Jun" -> 6;
            case "Jul" -> 7;
            case "Aug" -> 8;
            case "Sep" -> 9;
            case "Oct" -> 10;
            case "Nov" -> 11;
            case "Dec" -> 12;
            default -> throw new IllegalArgumentException("Mois invalide");
        };
    }
    public List<Map<String, Object>> evolutionEssaisParSemaine(int month, Client client) {

        int year = LocalDate.now().getYear();

        List<Object[]> results =
                demandRepository.countByWeekAndStatut(year, month, client);

        List<Map<String, Object>> weeks = new ArrayList<>();


        for (int i = 1; i <= 5; i++) {
            Map<String, Object> w = new HashMap<>();
            w.put("week", "S" + i);
            w.put("Fait", 0);
            w.put("Pas_fait", 0);
            w.put("En_cours", 0);
            weeks.add(w);
        }

        for (Object[] r : results) {
            int week = ((Number) r[0]).intValue();
            StatutGlobal statut = (StatutGlobal) r[1];
            Long count = (Long) r[2];

            int index = week - 1;

            Map<String, Object> w = weeks.get(index);

            switch (statut) {
                case FAIT -> w.put("Fait", count);
                case PAS_FAIT -> w.put("Pas_fait", count);
                case EN_COURS -> w.put("En_cours", count);
            }
        }

        return weeks;
    }
    public long getTotalDemandes() {

        User user = userDetailsService.getCurrentUser()
                .orElseThrow(() -> new RuntimeException("Utilisateur non authentifié"));

        if (user.getRole() == Role.ADMIN) {
            return demandRepository.count();
        }

        return demandRepository.countByClient(user.getClient());
    }


    public List<DemandeEssai> getAllDemandeClient() {

        User currentUser = userDetailsService.getCurrentUser()
                .orElseThrow(() -> new RuntimeException("Utilisateur non authentifié"));

        return currentUser.getRole() == Role.ADMIN
                ? demandRepository.findAll()
                : demandRepository.findByClient(currentUser.getClient());
    }
    public long getTotalDemandes(Optional<Client> clientOpt) {

        User user = userDetailsService.getCurrentUser()
                .orElseThrow(() -> new RuntimeException("Utilisateur non authentifié"));

        Client client;

        if (user.getRole() == Role.ADMIN) {
            client = clientOpt.orElse(null);
        } else {
            client = user.getClient();
        }

        if (client == null) {
            return demandRepository.count();
        }

        return demandRepository.countByClient(client);
    }


    public Map<String, Long> countDemandesByStatut(Optional<Client> clientOpt) {

        User user = userDetailsService.getCurrentUser()
                .orElseThrow(() -> new RuntimeException("Utilisateur non authentifié"));

        Client client;

        if (user.getRole() == Role.ADMIN) {
            client = clientOpt.orElse(null);
        }
        else {
            client = user.getClient();
        }

        long fait = (client == null)
                ? demandRepository.countByStatutGlobal(StatutGlobal.FAIT)
                : demandRepository.countByStatutGlobalAndClient(StatutGlobal.FAIT, client);

        long encours = (client == null)
                ? demandRepository.countByStatutGlobal(StatutGlobal.EN_COURS)
                : demandRepository.countByStatutGlobalAndClient(StatutGlobal.EN_COURS, client);

        long pasFait = (client == null)
                ? demandRepository.countByStatutGlobal(StatutGlobal.PAS_FAIT)
                : demandRepository.countByStatutGlobalAndClient(StatutGlobal.PAS_FAIT, client);

        Map<String, Long> stats = new HashMap<>();
        stats.put("fait", fait);
        stats.put("encours", encours);
        stats.put("pasFait", pasFait);

        return stats;
    }
}
