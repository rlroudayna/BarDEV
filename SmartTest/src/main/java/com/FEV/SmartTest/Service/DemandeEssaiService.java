package com.FEV.SmartTest.Service;

import com.FEV.SmartTest.Entity.DemandeEssai;
import com.FEV.SmartTest.Entity.User;
import com.FEV.SmartTest.Repository.DemandeEssaiRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DemandeEssaiService {

    private final DemandeEssaiRepository repository;
    private final CustomUserDetailsService userDetailsService;

    public DemandeEssaiService(DemandeEssaiRepository repository,
                               CustomUserDetailsService userDetailsService) {
        this.repository = repository;
        this.userDetailsService = userDetailsService;
    }

    // 🔒 Vérification rôle
    private void checkCharge() {
        User currentUser = userDetailsService.getCurrentUser()
                .orElseThrow(() -> new RuntimeException("Utilisateur non authentifié"));

        if (!"CHARGE_ESSAI".equals(currentUser.getRole().name())) {
            throw new RuntimeException("Action réservée aux conducteurs");
        }
    }

    // ------------------ CREATE ------------------
    public DemandeEssai createDemande(DemandeEssai demande) {
        checkCharge();
        return repository.save(demande);
    }

    // ------------------ READ ALL ------------------
    public List<DemandeEssai> getAllDemandes() {
        return repository.findAll();
    }

    // ------------------ READ ONE ------------------
    public DemandeEssai getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Demande non trouvée avec id : " + id));
    }

    // ------------------ UPDATE ------------------
    public DemandeEssai updateDemande(Long id, DemandeEssai updated) {
        checkCharge();

        return repository.findById(id).map(d -> {

            // 🟢 Informations générales
            d.setNomAuto(updated.getNomAuto());
            d.setDemandeur(updated.getDemandeur());
            d.setDatePlanification(updated.getDatePlanification());
            d.setShift(updated.getShift());
            d.setNumerProjet(updated.getNumerProjet());
            d.setStatutGlobal(updated.getStatutGlobal());
            d.setStatutDemande(updated.getStatutDemande());

            // 🟢 Relations
            d.setVehicule(updated.getVehicule());
            d.setCycleConduite(updated.getCycleConduite());
            d.setCalage(updated.getCalage());

            // 🟢 Paramètres projet
            d.setTypeProjet(updated.getTypeProjet());
            d.setBanc(updated.getBanc());

            // 🟢 Conditions essai
            d.setBesoinMaceration(updated.getBesoinMaceration());
            d.setTemperatureMaceration(updated.getTemperatureMaceration());
            d.setTemperatureEau(updated.getTemperatureEau());
            d.setActivationSTT(updated.getActivationSTT());
            d.setTemperatureEssai(updated.getTemperatureEssai());
            d.setHygrometrieEssai(updated.getHygrometrieEssai());

            // 🟢 Batterie / clim
            d.setGestionBatterie12V(updated.getGestionBatterie12V());
            d.setSocDepart12V(updated.getSocDepart12V());
            d.setActivationClim(updated.getActivationClim());
            d.setTemperatureRegulationClim(updated.getTemperatureRegulationClim());
            d.setChauffageHabitable(updated.getChauffageHabitable());

            // 🟢 Type essai
            d.setTypeEssai(updated.getTypeEssai());
            d.setVerificationCoastDown(updated.getVerificationCoastDown());
            d.setNombreDecelerations(updated.getNombreDecelerations());
            d.setCommentaire(updated.getCommentaire());

            // 🟢 Mesures
            d.setDonneesINCA(updated.getDonneesINCA());
            d.setMesuresAuxiliaires(updated.getMesuresAuxiliaires());
            d.setGazBrutes(updated.getGazBrutes());
            d.setGazDilues(updated.getGazDilues());
            d.setBag(updated.getBag());

            d.setCapot(updated.getCapot());
            d.setSoufflante(updated.getSoufflante());

            d.setQCvs(updated.getQCvs());
            d.setCarflow(updated.getCarflow());
            d.setMesureSAC(updated.getMesureSAC());

            // 🟢 Débits
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

            // 🟢 Particules
            d.setPm(updated.getPm());
            d.setDebitPrelevement(updated.getDebitPrelevement());
            d.setPn10Nano(updated.getPn10Nano());
            d.setFacteurDilutionPN10(updated.getFacteurDilutionPN10());
            d.setPn23Nano(updated.getPn23Nano());
            d.setFacteurDilutionPN23(updated.getFacteurDilutionPN23());

            // 🟢 Lignes
            d.setLigne1(updated.getLigne1());
            d.setPointPrelevementL1(updated.getPointPrelevementL1());
            d.setLigne2(updated.getLigne2());
            d.setPointPrelevementL2(updated.getPointPrelevementL2());
            d.setLigne3(updated.getLigne3());
            d.setPointPrelevementL3(updated.getPointPrelevementL3());

            // 🟢 QCL / PN
            d.setQcl1(updated.getQcl1());
            d.setPointPrelevementQCL1(updated.getPointPrelevementQCL1());
            d.setQcl2(updated.getQcl2());
            d.setPointPrelevementQCL2(updated.getPointPrelevementQCL2());

            d.setPn1(updated.getPn1());
            d.setPointPrelevementPN1(updated.getPointPrelevementPN1());
            d.setPn2(updated.getPn2());
            d.setPointPrelevementPN2(updated.getPointPrelevementPN2());

            // 🟢 ECU
            d.setEgr(updated.getEgr());
            d.setMicrosot(updated.getMicrosot());
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

            // 🟢 Acquisition
            d.setAcquisitionEOBD(updated.getAcquisitionEOBD());
            d.setTypeAcquisition(updated.getTypeAcquisition());
            d.setMesureCourant(updated.getMesureCourant());
            d.setIndiceCourant(updated.getIndiceCourant());
            d.setNumeroTermocoupleCourant(updated.getNumeroTermocoupleCourant());

            d.setMesureTension(updated.getMesureTension());
            d.setIndiceTension(updated.getIndiceTension());
            d.setNumeroTermocoupleTension(updated.getNumeroTermocoupleTension());
            d.setTypeMesureTension(updated.getTypeMesureTension());

            d.setThermocouples(updated.getThermocouples());
            d.setSondeLambdaLA4(updated.getSondeLambdaLA4());

            return repository.save(d);

        }).orElseThrow(() -> new RuntimeException("Demande non trouvée avec id : " + id));
    }

    // ------------------ DELETE ------------------
    public void deleteDemande(Long id) {
        checkCharge();
        repository.deleteById(id);
    }


}
