if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

let currentUser = null;
let isPremium = false;

if ("Notification" in window) {
  Notification.requestPermission();
}

auth.onAuthStateChanged(user => {
  if (user) {
    currentUser = user;
    document.getElementById('userName').innerText = user.displayName || user.email;
    document.getElementById('authBtn').innerText = "Sair";
    checkAdminRights(user.email);
    listenUserData(user.uid);
  } else {
    currentUser = null;
    isPremium = false;
    document.getElementById('userName').innerText = "Não conectado";
    document.getElementById('authBtn').innerText = "Entrar com Google";
    updateUserStatusUI();
  }
});

function handleAuth() {
  if (currentUser) {
    auth.signOut();
  } else {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider).catch(err => alert("Erro ao autenticar: " + err.message));
  }
}

function checkAdminRights(email) {
  if (adminEmails.includes(email)) {
    document.getElementById('adminLink').style.display = 'block';
  } else {
    document.getElementById('adminLink').style.display = 'none';
  }
}

function listenUserData(uid) {
  db.collection('users').doc(uid).onSnapshot(doc => {
    if (doc.exists) {
      isPremium = doc.data().isPremium || false;
    } else {
      db.collection('users').doc(uid).set({
        email: currentUser.email,
        name: currentUser.displayName,
        isPremium: false,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      isPremium = false;
    }
    updateUserStatusUI();
  });
}

function updateUserStatusUI() {
  const statusBadge = document.getElementById('userStatus');
  const btnSend = document.getElementById('btnSend');
  const btnSchedule = document.getElementById('btnSchedule');

  if (isPremium) {
    statusBadge.innerText = "Premium";
    statusBadge.classList.add("premium");
    btnSend.classList.remove("btn-disabled");
    btnSchedule.classList.remove("btn-disabled");
    btnSend.innerText = "Enviar Agora";
    btnSchedule.innerText = "Agendar Notificação";
  } else {
    statusBadge.innerText = "Gratuito";
    statusBadge.classList.remove("premium");
    btnSend.classList.add("btn-disabled");
    btnSchedule.classList.add("btn-disabled");
    btnSend.innerText = "Enviar Agora (Premium)";
    btnSchedule.innerText = "Agendar Notificação (Premium)";
  }
}

function updatePreview() {
  const title = document.getElementById('notifTitle').value;
  const body = document.getElementById('notifBody').value;

  document.getElementById('prevTitle').innerText = title || "Título da Notificação";
  document.getElementById('prevBody').innerText = body || "Sua mensagem vai aparecer aqui...";
}

function handleSend() {
  if (!isPremium) {
    alert('Disparo instantâneo é restrito a contas Premium.');
    openPixModal();
    return;
  }

  const title = document.getElementById('notifTitle').value;
  const body = document.getElementById('notifBody').value;

  if (Notification.permission === "granted") {
    new Notification(title, {
      body: body,
      icon: 'https://cdn-icons-png.flaticon.com/512/3602/3602145.png'
    });
  } else {
    alert("Ative as permissões de notificação do seu navegador.");
  }
}

function handleSchedule() {
  if (!isPremium) {
    alert('Agendamento local é restrito a contas Premium.');
    openPixModal();
    return;
  }

  const title = document.getElementById('notifTitle').value;
  const body = document.getElementById('notifBody').value;
  const timeVal = document.getElementById('scheduleTime').value;

  if (!timeVal) {
    alert('Selecione a data e o horário para o agendamento.');
    return;
  }

  const scheduleDate = new Date(timeVal).getTime();
  const now = new Date().getTime();
  const delay = scheduleDate - now;

  if (delay <= 0) {
    alert('Escolha uma data e horário no futuro.');
    return;
  }

  alert(`Notificação agendada para ${new Date(timeVal).toLocaleString('pt-BR')}!`);

  setTimeout(() => {
    if (Notification.permission === "granted") {
      new Notification(title, {
        body: body,
        icon: 'https://cdn-icons-png.flaticon.com/512/3602/3602145.png'
      });
    }
  }, delay);
}

function openPixModal() {
  document.getElementById('pixModal').style.display = 'flex';
}

function closePixModal() {
  document.getElementById('pixModal').style.display = 'none';
}

function copyPix() {
  const key = document.getElementById('pixKey');
  key.select();
  document.execCommand('copy');
  alert('Chave Pix copiada!');
}

function submitProof() {
  if (!currentUser) {
    alert("Por favor, faça login antes de enviar o comprovante.");
    return;
  }

  const fileInput = document.getElementById('proofFile');
  if (fileInput.files.length === 0) {
    alert('Por favor, selecione o comprovante.');
    return;
  }

  const file = fileInput.files[0];
  const storageRef = storage.ref(`comprovantes/${currentUser.uid}_${Date.now()}`);

  storageRef.put(file).then(snapshot => {
    return snapshot.ref.getDownloadURL();
  }).then(downloadURL => {
    return db.collection('payments').add({
      userId: currentUser.uid,
      userEmail: currentUser.email,
      userName: currentUser.displayName,
      proofUrl: downloadURL,
      status: 'PENDENTE',
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
  }).then(() => {
    alert('Comprovante enviado com sucesso! Status: PENDENTE.');
    closePixModal();
  }).catch(err => {
    alert('Erro ao enviar comprovante: ' + err.message);
  });
}

function openAdminPanel() {
  if (currentUser && adminEmails.includes(currentUser.email)) {
    document.getElementById('adminModal').style.display = 'flex';
  } else {
    alert("Acesso restrito aos administradores.");
  }
}

function closeAdminPanel() {
  document.getElementById('adminModal').style.display = 'none';
}

function updateBgStyle(type, val) {
  if (type === 'blur') {
    document.getElementById('blurVal').innerText = val + 'px';
    document.documentElement.style.setProperty('--bg-blur', val + 'px');
  } else if (type === 'brightness') {
    document.getElementById('brightVal').innerText = val + '%';
    document.documentElement.style.setProperty('--bg-brightness', (val / 100));
  }
}

function applyCustomBg() {
  const url = document.getElementById('bgUrlInput').value;
  if (url) {
    document.getElementById('customBgLayer').style.backgroundImage = `url('${url}')`;
  }
  closeAdminPanel();
}

function resetBg() {
  document.getElementById('customBgLayer').style.backgroundImage = 'none';
  updateBgStyle('blur', 16);
  updateBgStyle('brightness', 100);
  closeAdminPanel();
  }
