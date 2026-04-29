// ==============================
// INIT PI SDK
// ==============================
document.addEventListener("DOMContentLoaded", function () {
  if (typeof Pi !== "undefined") {
    Pi.init({
      version: "2.0",
      sandbox: true // TESTNET MODE
    });
  } else {
    alert("⚠️ Buka aplikasi di Pi Browser!");
  }

  loadWallet();
});

// ==============================
// GLOBAL STATE
// ==============================
let currentUser = null;

let wallet = {
  chuk: 0,
  locked: 0,
  testPi: 10
};

// ==============================
// LOGIN PI (FIXED)
// ==============================
async function login() {
  try {
    if (typeof Pi === "undefined") {
      notify("Harus buka di Pi Browser!");
      return;
    }

    const scopes = ["username"];

    const auth = await Pi.authenticate(scopes, function(payment) {
      console.log("Incomplete payment:", payment);
    });

    currentUser = auth.user;

    document.getElementById("username").innerText =
      "👤 " + currentUser.username;

    showSection("app");

    notify("✅ Login berhasil!");

  } catch (err) {
    console.error(err);
    notify("❌ Login gagal");
  }
}

// ==============================
// WALLET SYSTEM
// ==============================
function loadWallet() {
  const saved = localStorage.getItem("chuk_wallet");

  if (saved) {
    wallet = JSON.parse(saved);
  } else {
    wallet.chuk = 50000;
    wallet.locked = 25000;
    wallet.testPi = 10;
    saveWallet();
  }

  updateUI();
}

function saveWallet() {
  localStorage.setItem("chuk_wallet", JSON.stringify(wallet));
}

function updateUI() {
  document.getElementById("chukBalance").innerText = wallet.chuk;
  document.getElementById("lockedBalance").innerText = wallet.locked;
  document.getElementById("piBalance").innerText = wallet.testPi;
}

// ==============================
// UNLOCK SYSTEM
// ==============================
function unlockChuk() {
  if (wallet.locked <= 0) {
    notify("Tidak ada Chuk terkunci");
    return;
  }

  wallet.chuk += wallet.locked;
  wallet.locked = 0;

  saveWallet();
  updateUI();

  notify("🔓 Chuk berhasil di-unlock!");
}

// ==============================
// EXCHANGE (SIMULASI)
// ==============================
function exchangeChuk() {
  const amount = parseInt(prompt("Masukkan jumlah Chuk:"));

  if (!amount || amount <= 0) {
    notify("Jumlah tidak valid");
    return;
  }

  if (amount > wallet.chuk) {
    notify("Saldo tidak cukup");
    return;
  }

  const pi = amount / 10000;

  const confirmTx = confirm(
    `Tukar ${amount} Chuk menjadi ${pi} Pi?\n\nTransaksi tidak dapat dibatalkan.`
  );

  if (!confirmTx) return;

  wallet.chuk -= amount;
  wallet.testPi += pi;

  saveWallet();
  updateUI();

  notify("✅ Berhasil tukar ke Pi!");
}

// ==============================
// DEMO TAMBAH CHUK
// ==============================
function earnChuk() {
  wallet.chuk += 1000;

  saveWallet();
  updateUI();

  notify("🎁 +1000 Chuk didapat!");
}

// ==============================
// PAYMENT PI (REAL FLOW)
// ==============================
async function payWithPi() {
  try {
    const payment = await Pi.createPayment({
      amount: 0.01,
      memo: "Buy CHUK",
      metadata: { type: "chuk_purchase" }
    }, {
      onReadyForServerApproval: async function(paymentId) {
        await fetch("https://YOUR-BACKEND-URL/approve", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ paymentId })
        });
      },

      onReadyForServerCompletion: async function(paymentId, txid) {
        await fetch("https://YOUR-BACKEND-URL/complete", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ paymentId })
        });

        notify("💸 Pembayaran berhasil!");
      },

      onCancel: function() {
        notify("❌ Pembayaran dibatalkan");
      },

      onError: function(err) {
        console.error(err);
        notify("⚠️ Error pembayaran");
      }
    });

  } catch (err) {
    console.error(err);
  }
}

// ==============================
// UI CONTROL
// ==============================
function showSection(id) {
  document.getElementById("loginPage").style.display = "none";
  document.getElementById("appPage").style.display = "none";

  document.getElementById(id + "Page").style.display = "block";
}

// ==============================
// NOTIFICATION
// ==============================
function notify(msg) {
  alert(msg);
}
