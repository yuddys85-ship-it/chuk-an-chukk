// =========================
// CHUK AN CHUKK APP JS
// =========================

const BASE_URL =
"https://chuk-an-chukk-beckend.vercel.app/api";

let currentUser = null;

// WALLET DATA
let wallet = {
  chuk: 50000,
  pi: 10,
  locked: 5000
};

// HISTORY
let historyList = [];


// =========================
// INIT
// =========================

document.addEventListener(
  "DOMContentLoaded",
  () => {

    initPi();

    detectBrowser();

    registerSW();

    updateUI();

  }
);


// =========================
// PI SDK INIT
// =========================

function initPi(){

  if(typeof Pi !== "undefined"){

    Pi.init({
      version:"2.0",
      sandbox:true
    });

    console.log("Pi SDK Ready");

  }else{

    console.log("Not in Pi Browser");

  }

}


// =========================
// DETECT BROWSER
// =========================

function detectBrowser(){

  const isPiBrowser =
  navigator.userAgent.includes(
    "PiBrowser"
  );

  if(isPiBrowser){

    console.log("Running in Pi Browser");

  }else{

    console.log("Running in Chrome");

  }

}


// =========================
// LOGIN
// =========================

async function login(){

  try{

    const auth =
    await Pi.authenticate(
      ["username"]
    );

    currentUser = auth.user;

    document.getElementById(
      "username"
    ).innerText =
    "Welcome " +
    currentUser.username;

    document.getElementById(
      "loginPage"
    ).style.display = "none";

    document.getElementById(
      "appPage"
    ).style.display = "block";

    notify("Login Success");

  }catch(err){

    console.error(err);

    alert("Login Failed");

  }

}


// =========================
// LOGOUT
// =========================

function logout(){

  currentUser = null;

  document.getElementById(
    "loginPage"
  ).style.display = "block";

  document.getElementById(
    "appPage"
  ).style.display = "none";

  notify("Logout Success");

}


// =========================
// UPDATE UI
// =========================

function updateUI(){

  document.getElementById(
    "chukBalance"
  ).innerText = wallet.chuk;

  document.getElementById(
    "piBalance"
  ).innerText = wallet.pi;

  document.getElementById(
    "lockedBalance"
  ).innerText = wallet.locked;

  document.getElementById(
    "totalBalance"
  ).innerText =
  wallet.chuk + wallet.locked;

}


// =========================
// NOTIFICATION
// =========================

function notify(text){

  const notif =
  document.getElementById(
    "notification"
  );

  notif.innerText = text;

  notif.style.display = "block";

  setTimeout(()=>{

    notif.style.display = "none";

  },3000);

}


// =========================
// EARN CHUK
// =========================

function earnChuk(){

  wallet.chuk += 1000;

  addHistory(
    "Earned 1000 CHUK"
  );

  updateUI();

  saveData();

  notify("+1000 CHUK");

}


// =========================
// EXCHANGE
// =========================

function exchangeChuk(){

  const amount =
  parseInt(
    document.getElementById(
      "exchangeInput"
    ).value
  );

  if(!amount || amount <=0){

    alert("Invalid amount");

    return;

  }

  if(amount > wallet.chuk){

    alert("Not enough balance");

    return;

  }

  wallet.chuk -= amount;

  wallet.pi += amount / 1000;

  addHistory(
    "Exchange " +
    amount +
    " CHUK"
  );

  updateUI();

  saveData();

  notify("Exchange Success");

}


// =========================
// HISTORY
// =========================

function addHistory(text){

  historyList.unshift(text);

  renderHistory();

}


function renderHistory(){

  const history =
  document.getElementById(
    "history"
  );

  history.innerHTML = "";

  historyList.forEach(item=>{

    history.innerHTML += `
      <div class="history-item">
        ${item}
      </div>
    `;

  });

}


// =========================
// SAVE LOCAL DATA
// =========================

function saveData(){

  localStorage.setItem(
    "wallet",
    JSON.stringify(wallet)
  );

  localStorage.setItem(
    "history",
    JSON.stringify(historyList)
  );

}


// =========================
// LOAD LOCAL DATA
// =========================

function loadData(){

  const savedWallet =
  localStorage.getItem("wallet");

  const savedHistory =
  localStorage.getItem("history");

  if(savedWallet){

    wallet =
    JSON.parse(savedWallet);

  }

  if(savedHistory){

    historyList =
    JSON.parse(savedHistory);

    renderHistory();

  }

}


// =========================
// LOADING
// =========================

function showLoading(show){

  document.getElementById(
    "loading"
  ).style.display =
  show ? "block" : "none";

}


// =========================
// PAYMENT
// =========================

async function payWithPi(){

  if(typeof Pi === "undefined"){

    alert("Open in Pi Browser");

    return;

  }

  try{

    showLoading(true);

    await Pi.createPayment({

      amount:0.01,

      memo:"Buy CHUK",

      metadata:{
        user:
        currentUser?.username ||
        "guest"
      }

    },{

      onReadyForServerApproval:
      async(paymentId)=>{

        await fetch(
          BASE_URL + "/approve",
          {
            method:"POST",

            headers:{
              "Content-Type":
              "application/json"
            },

            body:JSON.stringify({
              paymentId
            })

          }
        );

      },

      onReadyForServerCompletion:
      async(paymentId,txid)=>{

        await fetch(
          BASE_URL + "/complete",
          {
            method:"POST",

            headers:{
              "Content-Type":
              "application/json"
            },

            body:JSON.stringify({
              paymentId,
              txid
            })

          }
        );

        wallet.chuk += 1000;

        updateUI();

        saveData();

        addHistory(
          "Bought 1000 CHUK"
        );

        notify(
          "Payment Success"
        );

        showLoading(false);

      },

      onCancel:()=>{

        showLoading(false);

        notify(
          "Payment Cancelled"
        );

      },

      onError:(err)=>{

        console.error(err);

        showLoading(false);

        notify("Payment Error");

      }

    });

  }catch(err){

    console.error(err);

    showLoading(false);

  }

}


// =========================
// INSTALL APP
// =========================

let deferredPrompt;

window.addEventListener(
  "beforeinstallprompt",
  (e)=>{

    e.preventDefault();

    deferredPrompt = e;

    const installBtn =
    document.getElementById(
      "installBtn"
    );

    if(installBtn){

      installBtn.style.display =
      "block";

    }

  }
);


const installBtn =
document.getElementById(
  "installBtn"
);

if(installBtn){

  installBtn.addEventListener(
    "click",
    async()=>{

      if(deferredPrompt){

        deferredPrompt.prompt();

        await deferredPrompt.userChoice;

        deferredPrompt = null;

      }

    }
  );

}


// =========================
// SERVICE WORKER
// =========================

function registerSW(){

  if("serviceWorker"
    in navigator){

    navigator.serviceWorker
    .register(
      "service-worker.js"
    )

    .then(()=>{

      console.log(
        "Service Worker Registered"
      );

    });

  }

}


// =========================
// LOAD SAVED DATA
// =========================

loadData();
