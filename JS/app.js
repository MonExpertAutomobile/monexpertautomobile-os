// ========================================
// MonExpertAutomobile OS
// Application principale
// ========================================

const App = {

  currentPage: "dashboard",

  // ======================================
  // INITIALISATION
  // ======================================

  init() {
    this.setupNavigation();
    this.showPage("dashboard");
  },

  // ======================================
  // NAVIGATION
  // ======================================

  setupNavigation() {
    window.show = (page) => {
      this.showPage(page);
    };
  },

  showPage(page) {

    const sections = document.querySelectorAll("section");

    sections.forEach((section) => {
      section.classList.add("hidden");
    });

    const target = document.getElementById(page);

    if (!target) {
      console.error("Page introuvable :", page);
      return;
    }

    target.classList.remove("hidden");

    this.currentPage = page;

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  },

  // ======================================
  // CLIENT
  // ======================================

  saveClient() {

    const prenom =
      document.getElementById("prenom").value.trim();

    const nom =
      document.getElementById("nom").value.trim();

    const telephone =
      document.getElementById("telephone").value.trim();

    const email =
      document.getElementById("email").value.trim();

    if (!prenom || !nom) {

      this.showMessage(
        "clientStatus",
        "⚠️ Le prénom et le nom sont obligatoires.",
        "error"
      );

      return;
    }

    console.log("Client :", {
      prenom,
      nom,
      telephone,
      email
    });

    this.showMessage(
      "clientStatus",
      "✅ Client prêt à être enregistré dans Supabase.",
      "success"
    );
  },

  // ======================================
  // VEHICULE
  // ======================================

  saveVehicle() {

    const immatriculation =
      document.getElementById("immatriculation").value.trim();

    const vin =
      document.getElementById("vin").value.trim();

    const marque =
      document.getElementById("marque").value.trim();

    const modele =
      document.getElementById("modele").value.trim();

    const annee =
      document.getElementById("annee").value;

    const kilometrage =
      document.getElementById("kilometrage").value;

    const carburant =
      document.getElementById("carburant").value;

    if (!immatriculation || !marque || !modele) {

      this.showMessage(
        "vehicleStatus",
        "⚠️ Immatriculation, marque et modèle sont obligatoires.",
        "error"
      );

      return;
    }

    console.log("Véhicule :", {
      immatriculation,
      vin,
      marque,
      modele,
      annee,
      kilometrage,
      carburant
    });

    this.showMessage(
      "vehicleStatus",
      "✅ Véhicule prêt à être enregistré dans Supabase.",
      "success"
    );
  },

  // ======================================
  // INSPECTION
  // ======================================

  runInspection() {

    const anomalies = [];

    const moteur =
      document.getElementById("moteur").value;

    const boite =
      document.getElementById("boite").value;

    const freins =
      document.getElementById("freins").value;

    const essai =
      document.getElementById("essai").value;

    if (moteur === "Anomalie détectée") {
      anomalies.push("Anomalie moteur détectée.");
    }

    if (boite === "Anomalie détectée") {
      anomalies.push(
        "Anomalie de boîte de vitesses détectée."
      );
    }

    if (freins === "Anomalie détectée") {
      anomalies.push(
        "Anomalie de freinage détectée."
      );
    }

    if (essai === "Anomalie détectée") {
      anomalies.push(
        "Anomalie détectée pendant l'essai routier."
      );
    }

    let html =
      "<h3>Résultat de l'inspection</h3>";

    if (anomalies.length === 0) {

      html += `
        <div class="status">
          ✅ Aucune anomalie saisie lors de cette inspection.
        </div>
      `;

    } else {

      anomalies.forEach((anomalie) => {

        html += `
          <div class="anomaly">
            ⚠️ ${anomalie}
          </div>
        `;

      });
    }

    document.getElementById(
      "inspectionResult"
    ).innerHTML = html;
  },

  // ======================================
  // ANALYSE IA
  // ======================================

  startAI() {

    const result =
      document.getElementById("aiResult");

    result.innerHTML = `
      <div class="status">
        🤖 Documents reçus.
        Le moteur IA pourra ensuite extraire les données
        et les comparer automatiquement.
      </div>
    `;

    console.log(
      "Analyse documentaire IA démarrée."
    );
  },

  // ======================================
  // MESSAGES
  // ======================================

  showMessage(elementId, message, type) {

    const element =
      document.getElementById(elementId);

    if (!element) {
      return;
    }

    if (type === "error") {

      element.innerHTML = `
        <div class="anomaly">
          ${message}
        </div>
      `;

      return;
    }

    element.innerHTML = `
      <div class="status">
        ${message}
      </div>
    `;
  }
};


// ========================================
// COMPATIBILITÉ AVEC LES BOUTONS HTML
// ========================================

window.saveClient = () => {
  App.saveClient();
};

window.saveVehicle = () => {
  App.saveVehicle();
};

window.runInspection = () => {
  App.runInspection();
};

window.startAI = () => {
  App.startAI();
};


// ========================================
// DÉMARRAGE
// ========================================

document.addEventListener(
  "DOMContentLoaded",
  () => {
    App.init();
  }
);