package com.FEV.SmartTest.Service;

import com.FEV.SmartTest.Entity.User;
import com.FEV.SmartTest.Repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder; // 🔑 injecter le PasswordEncoder

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // Créer un utilisateur avec mot de passe encodé
    public User createUser(User user) {
        // Encoder le mot de passe avant sauvegarde
        user.setMotDePasse(passwordEncoder.encode(user.getMotDePasse()));
        return userRepository.save(user);
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
        return userRepository.findById(id).map(user -> {
            user.setNom(updatedUser.getNom());
            user.setPrenom(updatedUser.getPrenom());
            user.setEmail(updatedUser.getEmail());
            user.setRole(updatedUser.getRole());
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
        userRepository.deleteById(id);
    }
}
