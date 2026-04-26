// Menu Mobile
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });
}

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Navbar Scroll Effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(30, 60, 114, 0.95)';
    } else {
        header.style.background = 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)';
    }
});

// Formulaire Inscription (pour inscription.html)
const inscriptionForm = document.getElementById('inscriptionForm');
if (inscriptionForm) {
    const urlParams = new URLSearchParams(window.location.search);
    const niveau = urlParams.get('niveau');
    const paiementSection = document.getElementById('paiementSection');
    const submitBtn = document.getElementById('submitBtn');
    const message = document.getElementById('message');

    // Afficher paiement si niveau payant
    if (niveau && niveau != '1') {
        paiementSection.style.display = 'block';
        submitBtn.textContent = `دفع ${niveau == '2' ? '99€' : '199€'} وإتمام`;
    }

    inscriptionForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const data = {
            nom: document.getElementById('nom').value,
            email: document.getElementById('email').value,
            telephone: document.getElementById('telephone').value,
            password: document.getElementById('password').value,
            niveau: niveau,
            date: new Date().toISOString()
        };

        submitBtn.textContent = '⏳ جاري المعالجة...';
        submitBtn.disabled = true;

        // Simulation API + Email
        setTimeout(() => {
            localStorage.setItem('clientData', JSON.stringify(data));
            
            message.style.display = 'block';
            message.className = 'success';
            message.innerHTML = `
                ✅ <strong>تم التسجيل بنجاح!</strong><br>
                📧 تحقق من بريدك الإلكتروني للحصول على:<br>
                👤 <strong>Identifiant:</strong> ${data.email}<br>
                🔑 <strong>Mot de passe:</strong> ${data.password}<br><br>
                <a href="client.html?id=${data.email}" class="cta-button">🚀 دخول لوحة التحكم</a>
            `;
            
            // Scroll vers message
            message.scrollIntoView({ behavior: 'smooth' });
        }, 2000);
    });
}

// Interface Client (client.html)
const clientSection = document.getElementById('clientInfo');
if (clientSection) {
    const urlParams = new URLSearchParams(window.location.search);
    const clientId = urlParams.get('id');
    const clientData = JSON.parse(localStorage.getItem('clientData') || '{}');

    if (clientId && clientData.email === clientId) {
        // Remplir infos
        document.getElementById('nomUser').textContent = clientData.nom;
        document.getElementById('emailUser').textContent = clientData.email;
        document.getElementById('telUser').textContent = clientData.telephone;
        document.getElementById('dateUser').textContent = new Date(clientData.date).toLocaleDateString('ar');
        document.getElementById('niveauUser').textContent = `المستوى ${clientData.niveau}`;

        // Cours disponibles
        const cours = {
            1: ['تجويد أساسي', 'تلاوة سور قصيرة', 'مخارج الحروف'],
            2: ['تجويد متقدم', 'حفظ السور المتوسطة', 'قواعد التجويد'],
            3: ['حفظ كامل', 'تفسير القرآن', 'تجويد احترافي']
        };

        const list = document.getElementById('coursList');
        cours[clientData.niveau].forEach(coursName => {
            list.innerHTML += `
                <div style="background: #f8f9fa; padding: 1rem; border-radius: 10px; margin-bottom: 0.5rem; border-right: 4px solid #4CAF50; cursor: pointer; transition: all 0.3s;">
                    📚 ${coursName}
                </div>
            `;
        });
    } else {
        clientSection.innerHTML = `
            <div style="text-align: center; padding: 3rem;">
                <i class="fas fa-exclamation-triangle" style="font-size: 4rem; color: #ff6b35; margin-bottom: 1rem;"></i>
                <h3>❌ بيانات غير صحيحة</h3>
                <p>يرجى تسجيل الدخول من جديد</p>
                <a href="index.html" class="cta-button">🏠 العودة للصفحة الرئيسية</a>
            </div>
        `;
    }
}

// Animations au scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observer tous les éléments animés
document.querySelectorAll('.feature-card, .section').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease';
    observer.observe(el);
});
