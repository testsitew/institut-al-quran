// ============================================
// JAVASCRIPT COMPLET - SITE ÉCOLE CORAN
// ============================================

// État global
let currentUser = null;
let messages = [
    { sender: 'teacher', text: 'As-salamu alaykum! Bienvenue dans votre premier cours de Tajwid.', time: '10:30' },
    { sender: 'student', text: 'Wa alaykum salam! Merci professeur, j\'ai hâte de commencer.', time: '10:32' },
    { sender: 'teacher', text: 'Parfait! Commencez par la sourate Al-Fatiha.', time: '10:35' }
];
let currentLevel = null;
let canvas = null;

// Initialisation
document.addEventListener('DOMContentLoaded', initApp);

// Initialisation complète
function initApp() {
    initSmoothScroll();
    initNavbarScroll();
    initAnimations();
    initForms();
    initHoverEffects();
    initMobileMenu();
}

// 1. SMOOTH SCROLL & NAVIGATION
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });
}

function initNavbarScroll() {
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
}

// 2. ANIMATIONS
function initAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fadeInUp');
            }
        });
    });
    
    document.querySelectorAll('.card-custom, .level-card').forEach(el => {
        observer.observe(el);
    });
}

// 3. EFFECTS HOVER
function initHoverEffects() {
    document.querySelectorAll('.hover-shadow').forEach(el => {
        el.addEventListener('mouseenter', () => el.style.boxShadow = '0 15px 40px rgba(0,0,0,0.2)');
        el.addEventListener('mouseleave', () => el.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)');
    });
}

// 4. MOBILE SIDEBAR
function initMobileMenu() {
    const toggle = document.querySelector('.mobile-menu-toggle');
    const sidebar = document.getElementById('sidebar');
    
    toggle?.addEventListener('click', () => {
        sidebar?.classList.toggle('show');
    });
}

function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('show');
}

// 5. MODALS
function showRegisterModal() {
    new bootstrap.Modal(document.getElementById('registerModal')).show();
}

function showLoginModal() {
    new bootstrap.Modal(document.getElementById('loginModal')).show();
}

// 6. FORMULAIRES
function initForms() {
    const forms = {
        registerForm: registerUser,
        loginForm: loginUser,
        paymentForm: processPayment
    };

    Object.entries(forms).forEach(([id, handler]) => {
        const form = document.getElementById(id);
        form?.addEventListener('submit', (e) => {
            e.preventDefault();
            handler(e);
        });
    });
}

// 7. INSCRIPTION (avec email simulé)
function registerUser() {
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = generateSecurePassword();
    
    const user = {
        id: 'USER_' + Date.now(),
        name: name,
        email: email,
        password: password,
        ageGroup: document.getElementById('studentAge').value,
        joined: new Date().toLocaleDateString('fr-FR'),
        progress: { arabe: 0, tajwid: 0 }
    };

    localStorage.setItem('currentUser', JSON.stringify(user));
    
    // Simulation EmailJS
    simulateEmailSend(user);
    
    showAlert('✅ Inscription réussie! Email envoyé.', 'success');
    bootstrap.Modal.getInstance(document.getElementById('registerModal')).hide();
    setTimeout(showLoginModal, 1500);
}

function generateSecurePassword() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%';
    let password = 'Quran';
    for (let i = 0; i < 8; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
}

function simulateEmailSend(user) {
    setTimeout(() => {
        showWelcomeEmailModal(user);
    }, 800);
}

function showWelcomeEmailModal(user) {
    const modalHTML = `
    <div class="modal fade" id="emailModal" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header bg-success text-white">
                    <h5 class="modal-title">📧 Email envoyé à ${user.email}</h5>
                </div>
                <div class="modal-body text-center p-4">
                    <div class="alert alert-success mb-4">
                        <h6>Vos identifiants:</h6>
                        <strong>ID:</strong> ${user.id}<br>
                        <strong>Email:</strong> ${user.email}<br>
                        <strong>Mot de passe:</strong> <code>${user.password}</code>
                    </div>
                    <button class="btn btn-primary-custom" data-bs-dismiss="modal">Parfait!</button>
                </div>
            </div>
        </div>
    </div>`;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    new bootstrap.Modal(document.getElementById('emailModal')).show();
    
    // Auto-remove
    setTimeout(() => {
        const modal = document.getElementById('emailModal');
        modal?.remove();
    }, 5000);
}

// 8. CONNEXION
function loginUser() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const savedUser = JSON.parse(localStorage.getItem('currentUser'));

    if (savedUser && savedUser.email === email) {
        currentUser = savedUser;
        showDashboard();
        showAlert(`🎉 Bonjour ${savedUser.name}!`, 'success');
        bootstrap.Modal.getInstance(document.getElementById('loginModal')).hide();
    } else {
        showAlert('❌ Identifiants incorrects', 'danger');
        shakeEffect(document.getElementById('loginForm'));
    }
}

// 9. PAIEMENT (simulé)
function processPayment() {
    showAlert('✅ Paiement réussi! Accès Premium activé 🎉', 'success');
    bootstrap.Modal.getInstance(document.getElementById('paymentModal')).hide();
    
    // Update user
    if (currentUser) {
        currentUser.isPremium = true;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }
}

// 10. DASHBOARD COMPLET
function showDashboard() {
    document.getElementById('dashboard').classList.remove('d-none');
    document.body.style.overflow = 'hidden';
    loadDashboardHome();
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    document.getElementById('dashboard').classList.add('d-none');
    document.body.style.overflow = 'auto';
    showAlert('👋 À bientôt!', 'info');
}

// Dashboard Sections
function showSection(section) {
    const mainContent = document.getElementById('mainContent');
    const sections = {
        home: loadDashboardHome,
        courses: loadCoursesSection,
        messages: loadMessagesSection,
        profile: loadProfileSection
    };
    
    sections[section]?.();
    updateActiveNav(section);
}

function updateActiveNav(section) {
    document.querySelectorAll('.nav-link-dashboard').forEach(link => {
        link.classList.remove('active');
    });
    event.target.classList.add('active');
}

// 11. DASHBOARD HOME
function loadDashboardHome() {
    document.getElementById('mainContent').innerHTML = `
    <div class="container-fluid py-5 px-5">
        <div class="row align-items-center mb-5">
            <div class="col-auto">
                <div class="avatar-lg rounded-circle bg-primary d-flex align-items-center justify-content-center">
                    <i class="fas fa-user fa-2x text-white"></i>
                </div>
            </div>
            <div class="col">
                <h1 class="mb-1">As-salamu alaykum ${currentUser.name}!</h1>
                <p class="text-muted mb-0">Continuez votre apprentissage du Coran</p>
            </div>
        </div>
        
        <div class="row g-4">
            <div class="col-lg-4 col-md-6">
                <div class="card card-custom h-100 text-center" style="background: linear-gradient(135deg, rgba(255,255,255,0.95), rgba(248,249,250,0.9));">
                    <div class="card-body p-4">
                        <i class="fas fa-book-open fa-3x text-primary mb-3"></i>
                        <h3>4 Cours</h3>
                        <p class="lead mb-0">En cours</p>
                        <small class="text-success"><i class="fas fa-arrow-up"></i> +2 cette semaine</small>
                    </div>
                </div>
            </div>
            <div class="col-lg-4 col-md-6">
                <div class="card card-custom h-100 text-center" style="background: linear-gradient(135deg, rgba(255,255,255,0.95),
                                <div class="card card-custom h-100 text-center" style="background: linear-gradient(135deg, rgba(255,255,255,0.95), rgba(248,249,250,0.9));">
                    <div class="card-body p-4">
                        <i class="fas fa-comments fa-3x text-success mb-3"></i>
                        <h3>3 Messages</h3>
                        <p class="lead mb-0">Nouveaux</p>
                        <span class="badge bg-danger rounded-pill">Nouveau</span>
                    </div>
                </div>
            </div>
            <div class="col-lg-4 col-md-6">
                <div class="card card-custom h-100 text-center" style="background: linear-gradient(135deg, rgba(255,255,255,0.95), rgba(248,249,250,0.9));">
                    <div class="card-body p-4">
                        <i class="fas fa-chart-line fa-3x text-warning mb-3"></i>
                        <h3>58%</h3>
                        <p class="lead mb-0">Progression globale</p>
                        <div class="progress mt-3" style="height: 8px;">
                            <div class="progress-bar bg-warning" style="width: 58%"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="row mt-5">
            <div class="col-12">
                <h3 class="mb-4">🎯 Cours recommandés</h3>
                <div class="card card-custom p-4">
                    <div class="row align-items-center">
                        <div class="col-md-3 text-center">
                            <div class="arabic-text fs-1 mb-3">الفاتحة</div>
                            <audio controls class="w-100">
                                <source src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAo..." type="audio/wav">
                            </audio>
                        </div>
                        <div class="col-md-9">
                            <h5>سورة الفاتحة - Sourate Al-Fatiha</h5>
                            <p>Exercez le Tajwid sur la première sourate du Coran</p>
                            <button class="btn btn-primary-custom" onclick="startLevel('fatiha')">Commencer l'exercice</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>`;
}

// 12. COURS INTERACTIFS ENFANTS
function loadCoursesSection() {
    document.getElementById('mainContent').innerHTML = `
    <div class="container-fluid py-5 px-5">
        <div class="d-flex align-items-center mb-5">
            <i class="fas fa-book-open fa-2x text-primary me-3"></i>
            <h1>Mes Cours Interactifs</h1>
        </div>
        
        <div class="row g-4">
            <div class="col-lg-6">
                <div class="card card-custom h-100 lesson-card" onclick="startInteractiveLesson('arabe')">
                    <div class="card-body text-center p-5">
                        <i class="fas fa-pen-fancy fa-4x text-primary mb-4"></i>
                        <h3 class="arabic-text mb-2">اللغة العربية</h3>
                        <h5>Langue Arabe - Niveau 1</h5>
                        <p class="text-muted">Alphabet • Écriture • Lecture</p>
                        <div class="progress mt-3 mb-4">
                            <div class="progress-bar bg-primary" style="width: ${currentUser?.progress?.arabe || 35}%"></div>
                        </div>
                        <span class="badge bg-primary">Débutant</span>
                    </div>
                </div>
            </div>
            <div class="col-lg-6">
                <div class="card card-custom h-100 lesson-card" onclick="startInteractiveLesson('tajwid')">
                    <div class="card-body text-center p-5">
                        <i class="fas fa-mosque fa-4x text-success mb-4"></i>
                        <h3 class="arabic-text mb-2">تجويد القرآن</h3>
                        <h5>Tajwid Coran</h5>
                        <p class="text-muted">Règles de récitation • Makharij</p>
                        <div class="progress mt-3 mb-4">
                            <div class="progress-bar bg-success" style="width: ${currentUser?.progress?.tajwid || 22}%"></div>
                        </div>
                        <span class="badge bg-success">Intermédiaire</span>
                    </div>
                </div>
            </div>
        </div>
    </div>`;
}

// 13. LEÇONS INTERACTIVES (ENFANTS)
function startInteractiveLesson(type) {
    currentLevel = type;
    const container = document.querySelector('.container-fluid');
    
    if (type === 'arabe') {
        container.innerHTML = `
        <div class="py-5 px-5">
            <div class="d-flex align-items-center mb-5">
                <button class="btn btn-outline-secondary me-3" onclick="loadCoursesSection()">
                    <i class="fas fa-arrow-left"></i>
                </button>
                <h2>✍️ Exercice d'écriture - بَاءْ (Ba)</h2>
            </div>
            <div class="row justify-content-center">
                <div class="col-lg-8">
                    <div class="card card-custom shadow-lg">
                        <div class="card-body p-5 text-center">
                            <div class="arabic-text fs-1 mb-5 p-4 border rounded-3 model-letter">
                                مِيْمْ • بَاءْ • تَاءْ
                            </div>
                            <canvas id="writeCanvas" width="400" height="250" 
                                    class="border rounded-4 shadow mx-auto d-block mb-4" 
                                    style="cursor: crosshair; background: white;"></canvas>
                            <div class="row g-3 mb-4">
                                <div class="col">
                                    <button class="btn btn-success w-100" onclick="checkWriting()">
                                        <i class="fas fa-check"></i> Vérifier
                                    </button>
                                </div>
                                <div class="col">
                                    <button class="btn btn-warning w-100" onclick="clearCanvas()">
                                        <i class="fas fa-eraser"></i> Effacer
                                    </button>
                                </div>
                            </div>
                            <div id="feedback" class="fs-5 fw-bold"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
        initDrawingCanvas('writeCanvas');
    } else {
        container.innerHTML = `
        <div class="py-5 px-5">
            <div class="d-flex align-items-center mb-5">
                <button class="btn btn-outline-secondary me-3" onclick="loadCoursesSection()">
                    <i class="fas fa-arrow-left"></i>
                </button>
                <h2>🎵 Exercice Tajwid - Qalqalah</h2>
            </div>
            <div class="row justify-content-center">
                <div class="col-lg-10">
                    <div class="card card-custom shadow-lg">
                        <div class="card-body p-5">
                            <div class="row text-center mb-5">
                                <div class="col-md-4">
                                    <div class="arabic-text fs-2 mb-3 p-3 bg-light rounded-3">قَدْ</div>
                                    <audio controls class="mx-auto d-block">
                                        <source src="#" type="audio/mpeg">
                                    </audio>
                                </div>
                                <div class="col-md-4">
                                    <div class="arabic-text fs-2 mb-3 p-3 bg-light rounded-3">صَدَقَ</div>
                                    <audio controls class="mx-auto d-block">
                                        <source src="#" type="audio/mpeg">
                                    </audio>
                                </div>
                                <div class="col-md-4">
                                    <div class="arabic-text fs-2 mb-3 p-3 bg-light rounded-3">تَابَ</div>
                                    <audio controls class="mx-auto d-block">
                                        <source src="#" type="audio/mpeg">
                                    </audio>
                                </div>
                            </div>
                            <div class="text-center">
                                <button class="btn btn-primary-custom btn-lg" onclick="playTajwidExercise()">
                                    <i class="fas fa-play"></i> Écouter & Répéter
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
    }
}

// Canvas pour écriture arabe (enfants)
function initDrawingCanvas(canvasId) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');
    let isDrawing = false;

    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#1B5E20';

    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);

    function startDrawing(e) {
        isDrawing = true;
        draw(e);
    }

    function draw(e) {
        if (!isDrawing) return;
        
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);
    }

    function stopDrawing() {
        if (isDrawing) {
            ctx.beginPath();
            isDrawing = false;
        }
    }

    window.checkWriting = () => {
        // Simulation reconnaissance (en prod: ML model)
        const successChance = Math.random() > 0.3 ? true : false;
        const feedback = document.getElementById('feedback');
        
        if (successChance) {
            feedback.innerHTML = '<i class="fas fa-check-circle text-success"></i> Excellent! بَاءْ parfait!';
            feedback.className = 'text-success fs-4';
            updateProgress('arabe', 5);
        } else {
            feedback.innerHTML = '<i class="fas fa-times-circle text-danger"></i> Réessayez, concentrez-vous sur la courbe!';
            feedback.className = 'text-danger fs-4';
            shakeEffect(canvas);
        }
    };

    window.clearCanvas = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
}

function playTajwidExercise() {
    showAlert('🎵 Écoutez attentivement la prononciation Qalqalah!', 'info');
    // En prod: lecteur audio réel
}

// 14. MESSAGERIE
function loadMessagesSection() {
    document.getElementById('mainContent').innerHTML = `
    <div class="container-fluid py-5 px-5">
        <div class="d-flex align-items-center mb-5">
            <i class="fas fa-comments fa-2x text-success me-3"></i>
            <h1>Messagerie</h1>
        </div>
        
        <div class="row">
            <div class="col-lg-4">
                <div class="card card-custom h-100">
                    <div class="card-header bg-light">
                        <h6>Conversations</h6>
                    </div>
                    <div class="card-body">
                        <div class="conversation-item active" onclick="switchConversation('teacher1')">
                            <div class="d-flex align-items-center">
                                <div class="avatar-sm bg-primary rounded-circle d-flex align-items-center justify-content-center me-3">
                                    <i class="fas fa-user text-white"></i>
                                </div>
                                <div>
                                    <h6>Cheikh Ahmed</h6>
                                    <small class="text-muted">En ligne</small>
                                </div>
                            </div>
                        </div>
                        <div class="conversation-item" onclick="switchConversation('teacher2')">
                            <div class="d-flex align-items-center">
                                <div class="avatar-sm bg-success rounded-circle d-flex align-items-center justify-content-center me-3">
                                    <i class="fas fa-user text-white"></i>
                                </div>
                                <div>
                                    <h6>Oustatha Fatima</h6>
                                    <small class="text-muted">Vu il y a 2h</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-8">
                <div class="card card-custom h-100">
                    <div class="card-header bg-light d-flex justify-content-between">
                        <h6>Cheikh Ahmed</h6>
                        <small class="text-muted">En ligne</small>
                    </div>
                    <div class="card-body p-0">
                        <div id="chatMessages" class="chat-container chat-messages p-3">
                            ${messages.map(msg => `
                                <div class="message ${msg.sender === 'student' ? 'sent' : 'received'}">
                                    <div>${msg.text}</div>
                                    <small class="opacity-75">${msg.time}</small>
                                </div>
                            `).join('')}
                        </div>
                        <div class="card-footer p-3">
                            <div class="input-group">
                                <input type="text" id="messageInput" class="form-control" placeholder="Tapez votre message...">
                                <button class="btn btn-primary-custom" onclick="sendMessage()">
                                    <i class="fas fa-paper-plane"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>`;
    
    // Auto-scroll chat
    setTimeout(() => {
        const chat = document.getElementById('chatMessages');
        chat.scrollTop = chat.scrollHeight;
    }, 100);
}

function sendMessage() {
    const input = document.getElementById('messageInput');
    const text = input.value.trim();
    
    if (!text) return;
    
    // Ajout message étudiant
    messages.push({
        sender: 'student',
        text: text,
        time: new Date().toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit'})
    });
    
    input.value = '';
    
    // Simulation réponse professeur
    setTimeout(() => {
        messages.push({
            sender: 'teacher',
            text: 'Excellent! Continuez comme ça. الله يوفقكم',
            time: new Date().toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit'})
        });
        loadMessagesSection(); // Refresh
    }, 1500);
    
    loadMessagesSection(); // Refresh immédiat
}

// 15. PROFIL
function loadProfileSection() {
    document.getElementById('mainContent').innerHTML = `
    <div class="container-fluid py-5 px-5">
        <div class="row">
            <div class="col-lg-8 mx-auto">
                <div class="card card-custom shadow-lg">
                    <div class="card-header bg-gradient-primary text-white text-center py-4">
                        <i class="fas fa-user-circle fa-5x mb-3"></i>
                        <h3>${currentUser?.name || 'Étudiant'}</h3>
                        <p class="mb-0">${currentUser?.ageGroup || 'Enfant'}</p>
                    </div>
                    <div class="card-body p-5">
                        <div class="row g-4">
                            <div class="col-md-6">
                                <label class="form-label fw-bold">ID Étudiant</label>
                                <input class="form-control" value="${currentUser?.id}" readonly>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label fw-bold">Email</label>
                                <input class="form-control" value="${currentUser?.email}" readonly>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label fw-bold">Inscrit le</label>
                                <input class="form-control" value="${currentUser?.joined}" readonly>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label fw-bold">Statut</label>
                                <div class="form-control">
                                    ${currentUser?.isPremium ? '<span class="badge bg-success">Premium</span>' : '<span class="badge bg-secondary">Gratuit</span>'}
                                </div>
                            </div>
                        </div>
                        
                        <div class="mt-5">
                            <h5>📊 Progression</h5>
                            <div class="row text-center">
                                <div class="col-md-6 mb-4">
                                    <div class="p-3 bg-light rounded-3">
                                        <h4 class="arabic-text">${currentUser?.progress?.arabe || 35}%</h4>
                                        <p>Langue Arabe</p>
                                    </div>
                                </div>
                                <div class="col-md-6 mb-4">
                                    <div class="p-3 bg-light rounded-3">
                                        <h4 class="arabic-text">${currentUser?.progress?.tajwid || 22}%</h4>
                                        <p>Tajwid</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>`;
}

// 16. UTILITAIRES (suite et fin)
function showAlert(message, type = 'info') {
    // Supprimer alertes existantes
    document.querySelectorAll('.custom-alert').forEach(el => el.remove());
    
    const alert = document.createElement('div');
    alert.className = `alert alert-${type === 'success' ? 'success' : type === 'danger' ? 'danger' : 'info'} 
                       custom-alert position-fixed top-0 end-0 m-4 shadow-lg z-3 animate__animated animate__fadeInRight
                       border-0 rounded-3 fs-6`;
    alert.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle text-success' : 
                       type === 'danger' ? 'fa-exclamation-triangle text-danger' : 'fa-info-circle text-info'} me-2"></i>
        ${message}
        <button type="button" class="btn-close btn-close-white ms-3" onclick="this.parentElement.remove()"></button>
    `;
    
    document.body.appendChild(alert);
    
    // Auto-remove après 4s
    setTimeout(() => alert.remove(), 4000);
}

// Effet tremblement
function shakeEffect(element) {
    element.style.animation = 'shake 0.5s ease-in-out';
    setTimeout(() => {
        element.style.animation = '';
    }, 500);
}

// Mise à jour progression
function updateProgress(skill, points) {
    if (currentUser) {
        currentUser.progress[skill] = Math.min(100, (currentUser.progress[skill] || 0) + points);
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        showAlert(`✅ +${points}% en ${skill === 'arabe' ? 'Arabe' : 'Tajwid'}!`, 'success');
    }
}

// 17. NIVEAUX (depuis page d'accueil)
function startLevel(level) {
    if (!currentUser) {
        showAlert('⚠️ Connectez-vous pour accéder aux cours', 'warning');
        showLoginModal();
        return;
    }
    
    showAlert(`🎓 Ouverture du niveau ${level}`, 'info');
    // En prod: navigation vers dashboard + cours spécifique
}

// 18. CSS ANIMATIONS (injectées dynamiquement)
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
    
    @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(30px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    .animate-fadeInUp {
        animation: fadeInUp 0.8s ease forwards;
    }
    
    .lesson-card:hover {
        transform: translateY(-10px) !important;
        box-shadow: 0 20px 60px rgba(0,0,0,0.2) !important;
    }
    
    .sidebar.show {
        transform: translateX(0) !important;
    }
    
    @media (max-width: 992px) {
        .sidebar {
            transform: translateX(-100%);
            transition: transform 0.3s ease;
        }
    }
    
    .avatar-sm {
        width: 40px;
        height: 40px;
        font-size: 0.9rem;
    }
    
    .avatar-lg {
        width: 80px;
        height: 80px;
        font-size: 1.8rem;
    }
    
    .model-letter {
        background: linear-gradient(135deg, #f8f9fa, #e9ecef);
        font-family: 'Cairo', serif;
        font-weight: 700;
    }
`;
document.head.appendChild(style);

// 19. SHORTCUTS GLOBAUX (disponibles partout)
window.showRegisterModal = showRegisterModal;
window.showLoginModal = showLoginModal;
window.startLevel = startLevel;
window.showSection = showSection;
window.toggleSidebar = toggleSidebar;
window.logout = logout;

// 20. SERVICE WORKER (PWA - optionnel)
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
        .then(() => console.log('SW registered'))
        .catch(() => console.log('SW not supported'));
}

// FIN DU JAVASCRIPT 🎉
// ============================================

console.log('🚀 مدرسة القرآن - Site complet chargé avec succès!');
console.log('✅ Fonctionnalités: Inscription/Connexion/Email/Messagerie/Cours interactifs/Paiements/Dashboard');
</script>
Fichier sw.js(bonus PWA)
JavaScript

Copier le code
// sw.js - Service Worker pour PWA
const CACHE_NAME = 'ecolecoran-v1';
const urlsToCache = [
    './',
    './index.html',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
    );
});


// sw.js - Service Worker pour PWA
const CACHE_NAME = 'ecolecoran-v1';
const urlsToCache = [
    './',
    './index.html',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
    );
});
