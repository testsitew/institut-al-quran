
// EmailJS (votre clé publique EmailJS)
emailjs.init("YOUR_PUBLIC_KEY"); // Remplacez

// Toggle Login (avec switch register/login)
function toggleLogin() {
    const modal = new bootstrap.Modal(document.getElementById('authModal'));
    modal.show();
}

// Register avec validation + email réel
document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('regName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const pass = document.getElementById('regPass').value;
    
    if (!name || !email || pass.length < 6) {
        alert('يرجى ملء جميع الحقول (كلمة سر 6+ أحرف)');
        return;
    }
    
    const templateParams = {
        to_name: name,
        to_email: email,
        message: `مرحباً ${name}!\nكلمة السر الخاصة بك: ${pass}\nسجل الدخول الآن: [lien site]`
    };
    
    emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", templateParams)
        .then(() => {
            alert('تم الإرسال! تحقق من بريدك.');
            localStorage.setItem('user', JSON.stringify({name, email}));
        }, () => alert('خطأ في الإرسال - تحقق من EmailJS'))
        .finally(() => {
            bootstrap.Modal.getInstance(document.getElementById('authModal')).hide();
            this.reset();
        });
});

// Login avec localStorage
document.getElementById('loginForm').querySelector('button').addEventListener('click', function(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const pass = document.getElementById('loginPass').value;
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (user.email === email) {
        alert(`مرحباً ${user.name}!`);
        toggleChat();
        document.querySelector('#authModal .modal-body form').style.display = 'none';
        document.querySelector('#authModal .modal-body').innerHTML += '<p class="text-success">تم الدخول ✓</p>';
    } else {
        alert('بيانات خاطئة');
    }
});

// Exercices interactifs (exemple niveau 1 arabe)
document.querySelectorAll('.exercise input, .exercise textarea').forEach(el => {
    el.addEventListener('blur', function() {
        const expected = this.parentElement.querySelector('p').textContent.trim();
        if (this.value.trim() === expected) {
            this.style.borderColor = '#198754';
            this.parentElement.innerHTML += '<span class="badge bg-success ms-2">صحيح! 🎉</span>';
        } else {
            this.style.borderColor = '#dc3545';
        }
    });
});

// Teacher questions avec localStorage
function postQuestion() {
    const q = document.getElementById('teacherQuestion').value.trim();
    if (!q) return;
    const questions = JSON.parse(localStorage.getItem('questions') || '[]');
    questions.push(q);
    localStorage.setItem('questions', JSON.stringify(questions));
    renderQuestions();
    document.getElementById('teacherQuestion').value = '';
}
function renderQuestions() {
    const questions = JSON.parse(localStorage.getItem('questions') || '[]');
    document.getElementById('questionsList').innerHTML = 
        questions.map(q => `<div class="alert alert-info d-flex justify-content-between">
            ${q} <button class="btn btn-sm btn-danger" onclick="this.parentElement.remove(); updateStorage();">حذف</button>
        </div>`).join('');
}
function updateStorage() {
    const alerts = document.querySelectorAll('#questionsList .alert');
    const questions = Array.from(alerts).map(a => a.textContent.replace('حذف', '').trim());
    localStorage.setItem('questions', JSON.stringify(questions));
}
renderQuestions(); // Load on start

// Paiement avec validation
document.getElementById('paymentForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const card = this.querySelector('input[placeholder*="رقم"]').value;
    if (card.length !== 16 || !/^\d+$/.test(card)) {
        alert('رقم بطاقة غير صحيح (16 رقم)');
        return;
    }
    alert('تم الدفع! 📱 (Intégrez Stripe pour réel)');
});

// Chat amélioré avec timestamps
function sendMessage() {
    const msg = document.getElementById('chatInput').value.trim();
    if (!msg) return;
    const time = new Date().toLocaleTimeString('ar');
    document.getElementById('chatBox').innerHTML += `
        <div class="d-flex mb-2">
            <strong class="me-2">أنت (${time}):</strong> <span>${msg}</span>
        </div>`;
    // Réponse auto simulée
    setTimeout(() => {
        document.getElementById('chatBox').innerHTML += `
            <div class="d-flex mb-2 text-muted">
                <strong class="me-2">المعلم:</strong> <span>شكراً! سأرد قريباً 😊</span>
            </div>`;
        document.getElementById('chatBox').scrollTop = document.getElementById('chatBox').scrollHeight;
    }, 1000);
    document.getElementById('chatInput').value = '';
    document.getElementById('chatBox').scrollTop = document.getElementById('chatBox').scrollHeight;
}

// Smooth scroll + active nav
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
    });
});

// Navbar active on scroll
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (scrollY >= sectionTop - 200) current = section.getAttribute('id');
    });
    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
    document.querySelector(`a[href="#${current}"]`)?.classList.add('active');
});
