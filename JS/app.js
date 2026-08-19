// ============================================================
// MONEXPERTAUTOMOBILE OS
// APPLICATION PRINCIPALE
// ============================================================

const App = {

  currentPage: "dashboard",

  storageKeys: {
    clients: "mea_clients",
    vehicles: "mea_vehicles",
    missions: "mea_missions"
  },

  pageTitles: {
    dashboard: [
      "Tableau de bord",
      "Vue d'ensemble de votre activité"
    ],
    missions: [
      "Missions",
      "Gérez toutes vos inspections automobiles"
    ],
    calendar: [
      "Calendrier",
      "Planification des missions"
    ],
    inspectors: [
      "Inspecteurs",
      "Gérez votre réseau d'experts"
    ],
    clients: [
      "Clients",
      "Gérez votre portefeuille clients"
    ],
    vehicles: [
      "Véhicules",
      "Base de données des véhicules"
    ],
    reports: [
      "Rapports",
      "Rapports d'inspection"
    ],
    ai: [
      "Analyse IA",
      "Analyse documentaire intelligente"
    ],
    validations: [
      "Validations",
      "Contrôle des rapports avant envoi"
    ],
    reviews: [
      "Avis clients",
      "Suivez la satisfaction client"
    ],
    billing: [
      "Facturation",
      "Paiements et factures"
    ],
    statistics: [
      "Statistiques",
      "Analyse de votre activité"
    ],
    settings: [
      "Paramètres",
      "Configuration de la plateforme"
    ],
    notifications: [
      "Notifications",
      "Centre de notifications"
    ],
    support: [
      "Support",
      "Assistance MonExpertAutomobile"
    ],
    newMission: [
      "Nouvelle mission",
      "Créer une mission d'inspection"
    ],
    newClient: [
      "Nouveau client",
      "Créer une fiche client"
    ],
    newVehicle: [
      "Nouveau véhicule",
      "Créer une fiche véhicule"
    ]
  },


  // ==========================================================
  // INITIALISATION
  // ==========================================================

  init() {

    this.setupNavigation();

    this.bindEvents();

    this.showPage("dashboard");

    this.refreshDashboard();

    this.refreshClients();

    this.refreshVehicles();

    this.refreshMissions();

  },


  // ==========================================================
  // NAVIGATION
  // ==========================================================

  setupNavigation() {

    window.show = (page) => {
      this.showPage(page);
    };

  },


  showPage(page) {

    const sections =
      document.querySelectorAll(".page-section");

    sections.forEach(section => {
      section.classList.add("hidden");
    });


    const target =
      document.getElementById(page);

    if (!target) {

      console.error(
        "Page introuvable :",
        page
      );

      return;
    }


    target.classList.remove("hidden");

    this.currentPage = page;


    // ------------------------------------------------------
    // TITRE
    // ------------------------------------------------------

    const title =
      this.pageTitles[page];


    const pageTitle =
      document.getElementById("pageTitle");

    const pageSubtitle =
      document.getElementById("pageSubtitle");


    if (title) {

      if (pageTitle) {
        pageTitle.textContent = title[0];
      }

      if (pageSubtitle) {
        pageSubtitle.textContent = title[1];
      }

    }


    // ------------------------------------------------------
    // NAVIGATION ACTIVE
    // ------------------------------------------------------

    document
      .querySelectorAll(".nav-item")
      .forEach(button => {

        button.classList.remove("active");

        if (
          button.dataset.page === page
        ) {
          button.classList.add("active");
        }

      });


    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });


    // ------------------------------------------------------
    // ACTUALISATION
    // ------------------------------------------------------

    if (page === "dashboard") {
      this.refreshDashboard();
    }

    if (page === "clients") {
      this.refreshClients();
    }

    if (page === "vehicles") {
      this.refreshVehicles();
    }

    if (page === "missions") {
      this.refreshMissions();
    }

    if (page === "newMission") {
      this.populateMissionSelects();
    }

  },


  // ==========================================================
  // EVENTS
  // ==========================================================

  bindEvents() {

    const missionSearch =
      document.getElementById("missionSearch");

    if (missionSearch) {

      missionSearch.addEventListener(
        "input",
        () => this.refreshMissions()
      );

    }


    const missionFilter =
      document.getElementById(
        "missionStatusFilter"
      );

    if (missionFilter) {

      missionFilter.addEventListener(
        "change",
        () => this.refreshMissions()
      );

    }

  },


  // ==========================================================
  // STORAGE
  // ==========================================================

  getData(key) {

    try {

      return JSON.parse(
        localStorage.getItem(key)
      ) || [];

    } catch (error) {

      console.error(
        "Erreur lecture stockage :",
        error
      );

      return [];

    }

  },


  setData(key, data) {

    localStorage.setItem(
      key,
      JSON.stringify(data)
    );

  },


  generateId(prefix) {

    return (
      prefix +
      "-" +
      Date.now() +
      "-" +
      Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase()
    );

  },


  // ==========================================================
  // CLIENTS
  // ==========================================================

  saveClient() {

    const prenom =
      this.value("prenom");

    const nom =
      this.value("nom");

    const telephone =
      this.value("telephone");

    const email =
      this.value("email");

    const adresse =
      this.value("adresseClient");


    if (!prenom || !nom) {

      this.showMessage(
        "clientStatus",
        "Le prénom et le nom sont obligatoires.",
        "error"
      );

      return;

    }


    const clients =
      this.getData(
        this.storageKeys.clients
      );


    const client = {

      id: this.generateId("CLI"),

      prenom,

      nom,

      telephone,

      email,

      adresse,

      createdAt:
        new Date().toISOString()

    };


    clients.push(client);


    this.setData(
      this.storageKeys.clients,
      clients
    );


    this.showMessage(
      "clientStatus",
      "Client enregistré avec succès.",
      "success"
    );


    this.clearFields([
      "prenom",
      "nom",
      "telephone",
      "email",
      "adresseClient"
    ]);


    this.refreshClients();

    this.populateMissionSelects();

  },


  refreshClients() {

    const clients =
      this.getData(
        this.storageKeys.clients
      );


    const container =
      document.getElementById(
        "clientsList"
      );


    if (!container) {
      return;
    }


    if (clients.length === 0) {

      container.innerHTML = `

        <div class="empty-state">

          <div class="empty-icon">
            ♙
          </div>

          <h3>
            Aucun client
          </h3>

          <p>
            Votre base clients est actuellement vide.
          </p>

          <button
            class="primary-button"
            onclick="show('newClient')"
          >
            Créer un client
          </button>

        </div>

      `;

      return;

    }


    container.className = "data-list";


    container.innerHTML =
      clients.map(client => `

        <article class="data-card">

          <div>

            <strong>
              ${this.escape(
                client.prenom
              )}
              ${this.escape(
                client.nom
              )}
            </strong>

            <small>
              ${this.escape(
                client.telephone || "Téléphone non renseigné"
              )}
            </small>

            <small>
              ${this.escape(
                client.email || "Email non renseigné"
              )}
            </small>

          </div>

          <span class="badge">
            Client
          </span>

        </article>

      `).join("");

  },


  // ==========================================================
  // VEHICULES
  // ==========================================================

  saveVehicle() {

    const immatriculation =
      this.value(
        "immatriculation"
      ).toUpperCase();

    const vin =
      this.value("vin").toUpperCase();

    const marque =
      this.value("marque");

    const modele =
      this.value("modele");

    const annee =
      this.value("annee");

    const kilometrage =
      this.value("kilometrage");

    const carburant =
      this.value("carburant");


    if (
      !immatriculation ||
      !marque ||
      !modele
    ) {

      this.showMessage(
        "vehicleStatus",
        "L'immatriculation, la marque et le modèle sont obligatoires.",
        "error"
      );

      return;

    }


    const vehicles =
      this.getData(
        this.storageKeys.vehicles
      );


    const vehicle = {

      id: this.generateId("VEH"),

      immatriculation,

      vin,

      marque,

      modele,

      annee,

      kilometrage,

      carburant,

      createdAt:
        new Date().toISOString()

    };


    vehicles.push(vehicle);


    this.setData(
      this.storageKeys.vehicles,
      vehicles
    );


    this.showMessage(
      "vehicleStatus",
      "Véhicule enregistré avec succès.",
      "success"
    );


    this.clearFields([
      "immatriculation",
      "vin",
      "marque",
      "modele",
      "annee",
      "kilometrage"
    ]);


    this.refreshVehicles();

    this.populateMissionSelects();

  },


  refreshVehicles() {

    const vehicles =
      this.getData(
        this.storageKeys.vehicles
      );


    const container =
      document.getElementById(
        "vehiclesList"
      );


    if (!container) {
      return;
    }


    if (vehicles.length === 0) {

      container.className =
        "empty-state";

      container.innerHTML = `

        <div class="empty-icon">
          🚗
        </div>

        <h3>
          Aucun véhicule
        </h3>

        <p>
          Votre base véhicules est actuellement vide.
        </p>

        <button
          class="primary-button"
          onclick="show('newVehicle')"
        >
          Ajouter un véhicule
        </button>

      `;

      return;

    }


    container.className =
      "data-list";


    container.innerHTML =
      vehicles.map(vehicle => `

        <article class="data-card">

          <div>

            <strong>
              ${this.escape(
                vehicle.marque
              )}
              ${this.escape(
                vehicle.modele
              )}
            </strong>

            <small>
              ${this.escape(
                vehicle.immatriculation
              )}
            </small>

            <small>
              ${vehicle.kilometrage
                ? this.escape(
                    vehicle.kilometrage
                  ) + " km"
                : "Kilométrage non renseigné"
              }
            </small>

          </div>

          <span class="badge">
            Véhicule
          </span>

        </article>

      `).join("");

  },


  // ==========================================================
  // MISSIONS
  // ==========================================================

  createMission() {

    const clientId =
      this.value("missionClient");

    const vehicleId =
      this.value("missionVehicle");

    const type =
      this.value("missionType");

    const plan =
      this.value("missionPlan");

    const date =
      this.value("missionDate");

    const time =
      this.value("missionTime");

    const location =
      this.value("missionLocation");


    if (
      !clientId ||
      !vehicleId ||
      !date
    ) {

      this.showMessage(
        "missionStatus",
        "Le client, le véhicule et la date sont obligatoires.",
        "error"
      );

      return;

    }


    const clients =
      this.getData(
        this.storageKeys.clients
      );


    const vehicles =
      this.getData(
        this.storageKeys.vehicles
      );


    const client =
      clients.find(
        item => item.id === clientId
      );


    const vehicle =
      vehicles.find(
        item => item.id === vehicleId
      );


    if (!client || !vehicle) {

      this.showMessage(
        "missionStatus",
        "Client ou véhicule introuvable.",
        "error"
      );

      return;

    }


    const missions =
      this.getData(
        this.storageKeys.missions
      );


    const mission = {

      id: this.generateId("MEA"),

      clientId,

      vehicleId,

      clientName:
        `${client.prenom} ${client.nom}`,

      vehicleName:
        `${vehicle.marque} ${vehicle.modele}`,

      immatriculation:
        vehicle.immatriculation,

      type,

      plan,

      date,

      time,

      location,

      status: "pending",

      createdAt:
        new Date().toISOString()

    };


    missions.push(mission);


    this.setData(
      this.storageKeys.missions,
      missions
    );


    this.showMessage(
      "missionStatus",
      "Mission créée avec succès.",
      "success"
    );


    this.refreshMissions();

    this.refreshDashboard();


    setTimeout(() => {

      this.show("missions");

    }, 700);

  },


  refreshMissions() {

    const missions =
      this.getData(
        this.storageKeys.missions
      );


    const container =
      document.getElementById(
        "missionsList"
      );


    if (!container) {
      return;
    }


    const searchInput =
      document.getElementById(
        "missionSearch"
      );


    const filter =
      document.getElementById(
        "missionStatusFilter"
      );


    const search =
      searchInput
        ? searchInput.value
            .trim()
            .toLowerCase()
        : "";


    const selectedStatus =
      filter
        ? filter.value
        : "all";


    let filtered =
      missions.filter(mission => {

        const text = `

          ${mission.id}
          ${mission.clientName}
          ${mission.vehicleName}
          ${mission.immatriculation}

        `.toLowerCase();


        const matchesSearch =
          !search ||
          text.includes(search);


        const matchesStatus =
          selectedStatus === "all" ||
          mission.status === selectedStatus;


        return (
          matchesSearch &&
          matchesStatus
        );

      });


    if (filtered.length === 0) {

      container.className =
        "empty-state";

      container.innerHTML = `

        <div class="empty-icon">
          ▣
        </div>

        <h3>
          Aucune mission
        </h3>

        <p>
          Aucune mission ne correspond à votre recherche.
        </p>

        <button
          class="primary-button"
          onclick="show('newMission')"
        >
          Créer une mission
        </button>

      `;

      return;

    }


    container.className =
      "data-list";


    container.innerHTML =
      filtered
        .sort(
          (a, b) =>
            new Date(a.date) -
            new Date(b.date)
        )
        .map(mission => `

          <article class="mission-card">

            <div class="mission-main">

              <strong>
                ${this.escape(
                  mission.vehicleName
                )}
              </strong>

              <span>
                ${this.escape(
                  mission.immatriculation
                )}
              </span>

            </div>


            <div>

              <small>
                Client
              </small>

              <strong>
                ${this.escape(
                  mission.clientName
                )}
              </strong>

            </div>


            <div>

              <small>
                Date
              </small>

              <strong>
                ${this.formatDate(
                  mission.date
                )}
              </strong>

            </div>


            <div>

              <small>
                Prestation
              </small>

              <strong>
                ${this.escape(
                  mission.type
                )}
              </strong>

            </div>


            <span class="status-badge ${mission.status}">
              ${this.statusLabel(
                mission.status
              )}
            </span>

          </article>

        `).join("");

  },


  // ==========================================================
  // SELECTS MISSION
  // ==========================================================

  populateMissionSelects() {

    const clientSelect =
      document.getElementById(
        "missionClient"
      );


    const vehicleSelect =
      document.getElementById(
        "missionVehicle"
      );


    if (!clientSelect ||
        !vehicleSelect) {

      return;

    }


    const clients =
      this.getData(
        this.storageKeys.clients
      );


    const vehicles =
      this.getData(
        this.storageKeys.vehicles
      );


    clientSelect.innerHTML = `

      <option value="">
        Sélectionner un client
      </option>

      ${clients.map(client => `

        <option value="${client.id}">
          ${this.escape(
            client.prenom
          )}
          ${this.escape(
            client.nom
          )}
        </option>

      `).join("")}

    `;


    vehicleSelect.innerHTML = `

      <option value="">
        Sélectionner un véhicule
      </option>

      ${vehicles.map(vehicle => `

        <option value="${vehicle.id}">
          ${this.escape(
            vehicle.marque
          )}
          ${this.escape(
            vehicle.modele
          )}
          — ${this.escape(
            vehicle.immatriculation
          )}
        </option>

      `).join("")}

    `;

  },


  // ==========================================================
  // DASHBOARD
  // ==========================================================

  refreshDashboard() {

    const clients =
      this.getData(
        this.storageKeys.clients
      );


    const vehicles =
      this.getData(
        this.storageKeys.vehicles
      );


    const missions =
      this.getData(
        this.storageKeys.missions
      );


    this.setText(
      "dashboardMissions",
      missions.length
    );


    this.setText(
      "dashboardReports",
      0
    );


    this.setText(
      "dashboardActive",

      missions.filter(
        mission =>
          mission.status === "active"
      ).length

    );


    this.setText(
      "dashboardRevenue",
      "—"
    );


    this.setText(
      "dashboardRating",
      "—"
    );


    const list =
      document.getElementById(
        "dashboardMissionList"
      );


    if (!list) {
      return;
    }


    const upcoming =
      missions
        .filter(
          mission =>
            mission.status !== "completed"
        )
        .sort(
          (a, b) =>
            new Date(a.date) -
            new Date(b.date)
        )
        .slice(0, 5);


    if (upcoming.length === 0) {

      list.innerHTML = `

        <div class="empty-state small">

          <div class="empty-icon">
            ▣
          </div>

          <p>
            Aucune mission actuellement.
          </p>

          <button
            class="primary-button"
            onclick="show('newMission')"
          >
            Créer une mission
          </button>

        </div>

      `;

      return;

    }


    list.innerHTML =
      upcoming.map(mission => `

        <div class="mini-mission">

          <strong>
            ${this.escape(
              mission.vehicleName
            )}
          </strong>

          <span>
            ${this.formatDate(
              mission.date
            )}
            ${mission.time || ""}
          </span>

          <small>
            ${this.escape(
              mission.clientName
            )}
          </small>

        </div>

      `).join("");

  },


  // ==========================================================
  // IA
  // ==========================================================

  startAI() {

    const result =
      document.getElementById(
        "aiResult"
      );


    if (!result) {
      return;
    }


    const documents = [

      "documentCarteGrise",
      "documentCT",
      "documentFactures",
      "documentCarnet",
      "documentHistorique"

    ];


    let count = 0;


    documents.forEach(id => {

      const input =
        document.getElementById(id);


      if (
        input &&
        input.files &&
        input.files.length
      ) {

        count += input.files.length;

      }

    });


    if (count === 0) {

      result.innerHTML = `

        <div class="anomaly">
          Aucun document sélectionné.
          Ajoutez les documents avant de lancer l'analyse.
        </div>

      `;

      return;

    }


    result.innerHTML = `

      <div class="status">

        Analyse documentaire préparée.

        <br><br>

        ${count} document(s) sélectionné(s).

        <br><br>

        Le moteur IA connecté permettra ensuite
        d'extraire et de comparer les informations.

      </div>

    `;

  },


  // ==========================================================
  // OUTILS
  // ==========================================================

  value(id) {

    const element =
      document.getElementById(id);


    if (!element) {
      return "";
    }


    return element.value.trim();

  },


  setText(id, value) {

    const element =
      document.getElementById(id);


    if (element) {
      element.textContent = value;
    }

  },


  clearFields(ids) {

    ids.forEach(id => {

      const element =
        document.getElementById(id);


      if (element) {
        element.value = "";
      }

    });

  },


  showMessage(
    elementId,
    message,
    type = "success"
  ) {

    const element =
      document.getElementById(
        elementId
      );


    if (!element) {
      return;
    }


    element.innerHTML = `

      <div class="${
        type === "error"
          ? "anomaly"
          : "status"
      }">

        ${this.escape(message)}

      </div>

    `;

  },


  formatDate(date) {

    if (!date) {
      return "—";
    }


    try {

      return new Intl.DateTimeFormat(
        "fr-FR",
        {
          day: "2-digit",
          month: "2-digit",
          year: "numeric"
        }
      ).format(
        new Date(date)
      );

    } catch {

      return date;

    }

  },


  statusLabel(status) {

    const labels = {

      pending: "À planifier",

      active: "En cours",

      report: "Rapport",

      completed: "Terminée"

    };


    return (
      labels[status] ||
      status
    );

  },


  escape(value) {

    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");

  }

};


// ============================================================
// COMPATIBILITÉ HTML
// ============================================================

window.saveClient = () => {

  App.saveClient();

};


window.saveVehicle = () => {

  App.saveVehicle();

};


window.createMission = () => {

  App.createMission();

};


window.startAI = () => {

  App.startAI();

};


// ============================================================
// DÉMARRAGE
// ============================================================

document.addEventListener(
  "DOMContentLoaded",
  () => {

    App.init();

  }
);