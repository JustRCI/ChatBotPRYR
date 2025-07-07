let database = [];
let userName = "";

// Muat database JSON
async function loadDatabase() {
  try {
    const response = await fetch('database.json');
    database = await response.json();
  } catch (error) {
    console.error("Gagal memuat database:", error);
    alert("Web tidak bisa dimuat. Pastikan Anda menjalankannya via server lokal.");
  }
}

// Mulai chat setelah pengguna memasukkan nama
function startChat() {
  const input = document.getElementById("userNameInput");
  userName = input.value.trim();

  if (!userName) {
    alert("Silakan masukkan nama Anda!");
    return;
  }

  document.getElementById("name-form-container").classList.add("hidden");
  document.getElementById("chat-container").classList.remove("hidden");
  document.getElementById("userInput").disabled = false;
  document.querySelector(".chat-input button").disabled = false;

  showWelcomeMessage(userName);
}

// Menampilkan welcome message
function showWelcomeMessage(name) {
  appendMessage("bot", `Halo ${name}! 👋`);
  appendMessage("bot", `Saya siap untuk menjawab pertanyaan Anda seputar PRYR Education.`);
  appendMessage("bot", `Silakan tanyakan hal-hal yang ingin kamu tanya seputar Crypto.`);
}

// Fungsi preprocessing teks
function preprocess(text) {
  return text.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/);
}

// Cari respons terbaik
function findBestResponse(userInputText) {
  const tokens = preprocess(userInputText);
  let bestScore = 0;
  let bestResponse = null;

  for (const entry of database) {
    for (const pattern of entry.patterns) {
      const patternTokens = preprocess(pattern);
      const commonWords = tokens.filter(word => patternTokens.includes(word));
      const score = commonWords.length / (patternTokens.length + 1);

      if (score > bestScore) {
        bestScore = score;
        bestResponse = entry.response;
      }
    }
  }

  return bestScore > 0.3 ? bestResponse : "Maaf, saya belum bisa menjawab pertanyaan tersebut, silakan tanyakan hal lain.";
}

// Kirim pesan
function sendMessage() {
  const userText = document.getElementById("userInput").value.trim();
  if (!userText) return;

  appendMessage("user", userText);
  document.getElementById("userInput").value = "";

  setTimeout(() => {
    const response = findBestResponse(userText);
    appendMessage("bot", response);
  }, 800);
}

// Tambah pesan ke chatbox
function appendMessage(sender, message) {
  const msgDiv = document.createElement("div");
  msgDiv.className = `message ${sender}`;
  msgDiv.textContent = message;
  document.getElementById("chat-box").appendChild(msgDiv);
  const chatBox = document.getElementById("chat-box");
  chatBox.scrollTop = chatBox.scrollHeight;
}

window.onload = () => {
  loadDatabase();
};

document.addEventListener('DOMContentLoaded', () => {
    const interBubble = document.querySelector('.interactive');
    let curX = 0;
    let curY = 0;
    let tgX = 0;
    let tgY = 0;

    const move = () => {
        curX += (tgX - curX) / 20;
        curY += (tgY - curY) / 20;
        interBubble.style.transform = `translate(${Math.round(curX)}px, ${Math.round(curY)}px)`;
        requestAnimationFrame(move);
    };

    window.addEventListener('mousemove', (event) => {
        tgX = event.clientX;
        tgY = event.clientY;
    });

    move();
});