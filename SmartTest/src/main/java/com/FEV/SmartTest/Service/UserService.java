package com.FEV.SmartTest.Service;

import com.FEV.SmartTest.Entity.User;
import com.FEV.SmartTest.Repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private  final CustomUserDetailsService userDetailsService;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, CustomUserDetailsService userDetailsService1) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.userDetailsService = userDetailsService1;
    }
    public void checkAdmin() {
        User currentUser = userDetailsService.getCurrentUser()
                .orElseThrow(() -> new RuntimeException("Utilisateur non authentifié"));

        if (!"ADMIN".equals(currentUser.getRole().name())) {
            throw new RuntimeException("Action réservée aux Admin");
        }
    }

    // Récupérer tous les utilisateurs
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Récupérer un utilisateur par id
    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    // Mettre à jour un utilisateur
    public User updateUser(Long id, User updatedUser) {
        // checkAdmin();
        return userRepository.findById(id).map(user -> {
            user.setNom(updatedUser.getNom());
            user.setPrenom(updatedUser.getPrenom());
            user.setEmail(updatedUser.getEmail());
            user.setRole(updatedUser.getRole());
            user.setClient(updatedUser.getClient());
            // Encoder le mot de passe si il est modifié
            if(updatedUser.getMotDePasse() != null && !updatedUser.getMotDePasse().isEmpty()){
                user.setMotDePasse(passwordEncoder.encode(updatedUser.getMotDePasse()));
            }
            user.setNumeroTelephone(updatedUser.getNumeroTelephone());
            user.setImage(updatedUser.getImage());
            return userRepository.save(user);
        }).orElseThrow(() -> new RuntimeException("Utilisateur non trouvé avec id : " + id));
    }

    // Supprimer un utilisateur
    public void deleteUser(Long id) {
        //checkAdmin();
        userRepository.deleteById(id);
    }

    public User updateProfileImage(Long id, String image) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        user.setImage(image);
        return userRepository.save(user);
    }
    public User updatePhone(Long id, String phone) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        user.setNumeroTelephone(phone);

        return userRepository.save(user);
    }
}
