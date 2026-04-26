// Initialisation EmailJS (remplacez par vos vraies clés)
emailjs.init("VOTRE_PUBLIC_KEY"); // À remplacer pour prod

// État de l'application
let currentUser = null;
let messages = [];

// DOM Ready
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(212,175,55,0.95)';
            navbar.style.backdropFilter = 'blur(10px)';
        } else {
            navbar.style.background = 'linear-gradient(135deg, var(--primary-gold), var(--primary-green))';
            navbar.style.backdropFilter = 'none';
        }
    });

    // Forms handlers
    initForms();
});

// Gestion des formulaires
function initForms() {
    // Inscription
    document.getElementById('registerForm').addEventListener('submit', function(e) {
        e.preventDefault();
        registerUser();
    });

    // Connexion
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        loginUser();
    });

    // Paiement (simulé)
    document.getElementById('paymentForm').addEventListener('submit', function(e) {
        e.preventDefault();
        processPayment();
    });
}

// Inscription utilisateur
function registerUser() {
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const age = document.getElementById('studentAge').value;

    // Génération mot de passe sécurisé (en prod: hash + DB)
    const userId = 'USER_' + Date.now();
    const credentials = {
        userId: userId,
        name: name,
        email: email,
        password: password // En prod: hasher !
    };

    // Sauvegarde local (en prod: base de données)
    localStorage.setItem('currentUser', JSON.stringify(credentials));
    
    // Envoi email avec credentials (EmailJS)
    sendWelcomeEmail(credentials);
    
    // Succès
    showAlert('Inscription réussie! Vérifiez votre email.', 'success');
    bootstrap.Modal.getInstance(document.getElementById('registerModal')).hide();
    setTimeout(() => showLoginModal(), 1500);
}

// Connexion utilisateur
function loginUser() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const savedUser = JSON.parse(localStorage.getItem('currentUser'));

    if (savedUser && savedUser.email === email && savedUser.password === password) {
        currentUser = savedUser;
        showDashboard();
        showAlert('Connexion réussie!', 'success');
        bootstrap.Modal.getInstance(document.getElementById('loginModal')).hide();
    } else {
        showAlert('Email ou mot de passe incorrect.', 'danger');
    }
}

// Envoi email de bienvenue (EmailJS)
function sendWelcomeEmail(user) {
    // Template EmailJS (créez-le sur emailjs.com)
    emailjs.send("VOTRE_SERVICE_ID", "VOTRE_TEMPLATE_ID", {
        to_name: user.name,
        to_email: user.email,
        user_id: user.userId,
        password: user.password,
        message: `Bienvenue ${user.name} dans مدرسة القرآن!

Vos identifiants:
ID: ${user.userId}
Email: ${user.email}
Mot de passe: ${user.password}

Commencez vos cours dès maintenant!`
    }).then(() => {
        console.log('Email envoyé!');
    }).catch(err => {
        console.error('Erreur email:', err);
        // Fallback: alerte utilisateur
        showAlert('Compte créé! Vos identifiants ont été sauvegardés.', 'success');
    });
}

// Affichage Dashboard
function showDashboard() {
    document.getElementById('dashboard').classList.remove('d-none');
    document.body.style.overflow = 'hidden';
    loadDashboardHome();
}

// Masquer Dashboard
function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    document.getElementById('dashboard').classList.add('d-none');
    document.body.style.overflow = 'auto';
    showAlert('Déconnexion réussie', 'info');
}

// Sections Dashboard
function showSection(section) {
    const mainContent = document.getElementById('mainContent');
    const sidebarLinks = document.querySelectorAll('.nav-link-dashboard');
    
    // Update active link
    sidebarLinks.forEach(link => link.classList.remove('active'));
    event.target.classList.add('active');
    
    switch(section
