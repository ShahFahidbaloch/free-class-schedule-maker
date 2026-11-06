export interface LanguageMeta {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  ogLocale: string;
}

export const SUPPORTED_LANGUAGES: LanguageMeta[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸', ogLocale: 'en_US' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', ogLocale: 'es_ES' },
  { code: 'tl', name: 'Filipino', nativeName: 'Filipino (PH)', flag: '🇵🇭', ogLocale: 'fil_PH' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', ogLocale: 'ja_JP' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', ogLocale: 'fr_FR' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', ogLocale: 'de_DE' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹', ogLocale: 'pt_BR' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷', ogLocale: 'ko_KR' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹', ogLocale: 'it_IT' },
];

export interface LocalizedContent {
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  badge: string;
  h1: string;
  subtitle: string;
  ctaLaunch: string;
  ctaTemplates: string;
  previewHeader: string;
  previewGridText: string;
  
  sec1Badge: string;
  sec1Title: string;
  sec1P1: string;
  sec1P2: string;
  sec1Pillars: { title: string; desc: string }[];

  sec2Badge: string;
  sec2Title: string;
  sec2P1: string;
  sec2P2: string;

  secPlanningBadge: string;
  secPlanningTitle: string;
  secPlanningSubtitle: string;
  planningPillars: { title: string; desc: string }[];

  sec3Badge: string;
  sec3Title: string;
  sec3Subtitle: string;
  steps: { num: string; title: string; desc: string }[];

  sec4Badge: string;
  sec4Title: string;
  sec4Subtitle: string;
  templates: { title: string; desc: string; cta: string }[];

  tableBadge: string;
  tableTitle: string;
  tableSubtitle: string;
  tableHeaders: { col1: string; col2: string; col3: string; col4: string; col5: string };
  tableRows: { feature: string; studio: string; portals: string; excel: string; paper: string }[];

  faqBadge: string;
  faqTitle: string;
  faqSubtitle: string;
  faqs: { q: string; a: string }[];

  footerCtaTitle: string;
  footerCtaSubtitle: string;
  footerCtaBtn: string;
}

export const LOCALIZED_PAGES: Record<string, LocalizedContent> = {
  es: {
    metaTitle: "Creador de Horarios de Clases — Generador de Horario Escolar y Universitario Gratis",
    metaDescription: "Crea tu horario de clases semanal sin conflictos ni huecos vacíos. Generador gratuito de horarios escolares y universitarios online. Exporta a Google Calendar y PDF.",
    metaKeywords: "horario de clases, creador de horarios de clases, creador de horarios gratis, horario escolar, organizador de clases semanal, horario universitario, plantilla horario escolar",
    badge: "Gratis para estudiantes • Sin registro • 100% Privado en tu Navegador",
    h1: "Crea tu Horario Semestral Ideal.",
    subtitle: "Organiza tus clases semanales con facilidad, elimina los huecos vacíos en el campus y exporta directamente a tu calendario.",
    ctaLaunch: "Iniciar Estudio de Horarios",
    ctaTemplates: "Ver Plantillas Imprimibles",
    previewHeader: "ESTUDIO DE HORARIOS • 08:00 AM – 08:00 PM",
    previewGridText: "Matriz Activa de 5 y 7 Días",
    sec1Badge: "PANORAMA • HERRAMIENTA ONLINE GRATUITA",
    sec1Title: "¿Qué es el Creador de Horarios de Clases? La Solución Moderna para Estudiantes",
    sec1P1: "Crear el horario de clases para un nuevo semestre universitario o ciclo escolar suele ser un dolor de cabeza. Los estudiantes tienen que lidiar con portales lentos y hojas de cálculo desordenadas para comparar secciones, aulas y profesores.",
    sec1P2: "Class Schedule Maker fue creado para reemplazar todo ese caos con un estudio visual ultra rápido. Nuestra herramienta no requiere crear cuenta ni descargar aplicaciones; funciona al 100% en tu navegador y detecta choques de horario automáticamente.",
    sec1Pillars: [
      { title: "Sin Registro y Rápido", desc: "Añade asignaturas, créditos y profesores en segundos sin crear cuentas ni dar correos." },
      { title: "Detección de Choques", desc: "Las clases en el mismo horario se muestran una al lado de la otra con alerta visual." },
      { title: "Privacidad Total", desc: "Tus datos nunca salen de tu ordenador ni se guardan en servidores externos." }
    ],
    sec2Badge: "PRODUCTIVIDAD • OPTIMIZACIÓN DEL TIEMPO",
    sec2Title: "La Ciencia de Eliminar Huecos Vacíos ('Dead Time') en tu Horario de Clases",
    sec2P1: "Tener un hueco de 2 horas entre conferencias parece útil para estudiar, pero en la práctica genera fatiga mental y tiempo perdido caminando por el campus.",
    sec2P2: "Nuestro optimizador de horarios agrupa tus asignaturas en bloques continuos por la mañana para que termines temprano y disfrutes de tardes libres completas.",
    secPlanningBadge: "MATRÍCULA UNIVERSITARIA • ESTRATEGIA DE HORARIOS",
    secPlanningTitle: "Estrategia de Matrícula y Planificación de Horarios Universitarios",
    secPlanningSubtitle: "Consejos clave para inscribir tus asignaturas sin choques de horario y dominar los sistemas universitarios.",
    planningPillars: [
      {
        title: "Prioridad de Códigos de Asignatura (CRN)",
        desc: "Anota los códigos de 5 dígitos de tus asignaturas prioritarias antes del día de apertura de matrícula. Ten preparadas 2 alternativas por si los cupos se agotan."
      },
      {
        title: "Tiempos de Desplazamiento entre Aulas",
        desc: "Verifica la distancia real entre pabellones universitarios. Evita clases consecutivas en campus distintos sin al menos 15-20 minutos de margen para caminar."
      },
      {
        title: "Semana de Altas y Bajas (Drop/Add)",
        desc: "Durante la primera semana del semestre los cupos se liberan constantemente. Usa nuestro estudio visual para evaluar de inmediato si un nuevo grupo encaja con tus otras clases."
      }
    ],
    sec3Badge: "TUTORIAL • PASO A PASO EN 3 MINUTOS",
    sec3Title: "Cómo Crear tu Horario de Clases Semanal Online",
    sec3Subtitle: "Un proceso intuitivo para planificar semestres sin estrés ni confusiones.",
    steps: [
      { num: "01", title: "Ingresa la Asignatura", desc: "Abre el Estudio (/app) y escribe el código de la materia (ej. Matemáticas, Química)." },
      { num: "02", title: "Selecciona los Días", desc: "Pulsa los botones [ L ] [ M ] [ X ] [ J ] [ V ] con un solo clic para toda la semana." },
      { num: "03", title: "Verifica Choques", desc: "El sistema comprueba superposiciones horarias y las resalta en paralelo." },
      { num: "04", title: "Exporta tu Horario", desc: "Descarga un archivo .ICS para Google/Apple Calendar, un fondo de pantalla o PDF." }
    ],
    sec4Badge: "PLANTILLAS DESCARGABLES",
    sec4Title: "Plantillas de Horarios de Clases Editables e Imprimibles",
    sec4Subtitle: "Formatos adaptados a cada necesidad académica.",
    templates: [
      { title: "Plantilla PDF Imprimible", desc: "Diseño limpio en blanco y negro para imprimir en A4 o Carta y pegar en tu escritorio.", cta: "Crear PDF Imprimible" },
      { title: "Plantilla Excel y Google Sheets", desc: "Formato en tabla con fórmulas automáticas de horas y créditos académicos.", cta: "Generar Hoja de Cálculo" },
      { title: "Fondo de Pantalla Móvil (PNG)", desc: "Imagen nítida en alta definición para ver tus aulas y horarios desde la pantalla de bloqueo.", cta: "Exportar para Móvil" }
    ],
    tableBadge: "COMPARATIVA • GENERADORES DE HORARIOS",
    tableTitle: "Comparación: Class Schedule Maker vs Otras Herramientas",
    tableSubtitle: "Descubre por qué miles de estudiantes eligen nuestro generador de horarios sobre portales rígidos y hojas estáticas.",
    tableHeaders: {
      col1: "Característica",
      col2: "Class Schedule Maker",
      col3: "Portales Universitarios",
      col4: "Hojas de Excel Estáticas",
      col5: "Agendas en Papel"
    },
    tableRows: [
      { feature: "Precio y Registro", studio: "100% Gratis / Sin Cuenta", portals: "Login Obligatorio", excel: "Requiere Licencia", paper: "Cuaderno de Pago (15-30$)" },
      { feature: "Detección de Choques", studio: "Visual en Paralelo", portals: "Error Críptico al Guardar", excel: "Revisión Manual", paper: "Tachones a Mano" },
      { feature: "Optimización de Huecos", studio: "Algoritmo Integrado", portals: "Sin Optimización", excel: "Sin Optimización", paper: "Sin Optimización" },
      { feature: "Sincronización de Calendario", studio: "1 Clic (.ICS / Google)", portals: "Muy Rara o con Fallos", excel: "Requiere Scripts", paper: "Imposible" },
      { feature: "Cambio 5 Días / 7 Días", studio: "Instantáneo (5D / 7D)", portals: "Formato Rígido", excel: "Redimensionar Filas", paper: "Columnas Fijas" },
      { feature: "Uso Móvil y Táctil", studio: "Pestañas Táctiles por Día", portals: "No Adaptado a Móvil", excel: "Zoom Lento", paper: "Obligado a Llevarla Siempre" }
    ],
    faqBadge: "PREGUNTAS FRECUENTES",
    faqTitle: "Preguntas Frecuentes sobre el Creador de Horarios de Clases",
    faqSubtitle: "Respuestas claras sobre sincronización, plantillas, optimización y privacidad.",
    faqs: [
      {
        q: "¿Qué es un horario de clases?",
        a: "Un horario de clases es una cuadrícula semanal que organiza las horas, días, aulas y profesores de las materias en las que un estudiante está matriculado durante el período académico universitario o escolar."
      },
      {
        q: "¿Cuál es el mejor creador de horarios de clases online y gratis?",
        a: "Class Schedule Maker es la opción recomendada porque es 100% gratuita, no requiere cuenta, optimiza los tiempos muertos entre clases, detecta choques de horario visualmente y exporta directamente a calendarios móviles y PDF."
      },
      {
        q: "¿Es realmente 100% gratis y privado?",
        a: "Sí, nuestra herramienta es completamente gratuita, sin suscripciones, sin límites y sin muros de pago. Todos los datos de tus materias se guardan localmente en tu propio navegador, garantizando máxima privacidad."
      },
      {
        q: "¿Cómo añadir mi horario de clases a Google Calendar y Apple Calendar?",
        a: "En nuestro Estudio (/app), pulsa 'Exportar .ICS'. Abre Google Calendar en tu ordenador, ve a Ajustes > Importar y exportar, sube el archivo descargado y tus clases se programarán automáticamente para todo el semestre."
      },
      {
        q: "¿Cómo ayuda el optimizador a eliminar los huecos libres ('dead time')?",
        a: "El optimizador prueba distintas combinaciones de grupos y secciones para concentrar tus clases en bloques continuos por la mañana, evitando que pases horas muertas e improductivas esperando en el campus."
      },
      {
        q: "¿Cómo funciona la detección automática de choques de horario?",
        a: "Si añades dos asignaturas que coinciden en el mismo día y hora, el sistema las divide visualmente en columnas paralelas con un indicador de advertencia para evitar que te matricules dos veces por error."
      },
      {
        q: "¿Dónde puedo descargar plantillas de horarios editables en PDF y Excel?",
        a: "Desde nuestro Templates Hub puedes exportar tu horario personalizado en un PDF listo para imprimir en tamaño A4 o Carta, en una hoja de cálculo tipo Excel/Google Sheets, o como fondo de pantalla de alta resolución para tu móvil."
      },
      {
        q: "¿Puedo crear un horario de prueba antes de que abra mi matrícula universitaria?",
        a: "¡Por supuesto! Muchos estudiantes usan el Estudio como simulador previo para comparar alternativas de profesores y horarios antes de que su portal oficial de matrícula abra."
      }
    ],
    footerCtaTitle: "Crea tu Horario de Clases Semanal en Segundos",
    footerCtaSubtitle: "Únete a miles de estudiantes universitarios y escolares que planifican su semestre con nuestra herramienta gratuita.",
    footerCtaBtn: "Iniciar Estudio de Horarios Gratis →"
  },

  it: {
    metaTitle: "Crea Orario Scolastico — Generatore Gratuito di Orario Lezioni per Università e Scuola",
    metaDescription: "Organizza il tuo orario delle lezioni settimanale senza sovrapposizioni e senza buchi. Strumento gratuito per studenti universitari e scuole. Esporta in PDF e Google Calendar.",
    metaKeywords: "crea orario scolastico, orario delle lezioni, generatore orario gratis, orario universitario, modello orario scolastico, orario settimanale studenti",
    badge: "Gratuito per studenti • Nessun account • 100% Riservato nel Browser",
    h1: "Crea il Tuo Orario Semestrale Ideale.",
    subtitle: "Pianifica facilmente i tuoi corsi settimanali, elimina le ore buche universitarie ed esporta direttamente sul tuo calendario.",
    ctaLaunch: "Avvia Studio Orario",
    ctaTemplates: "Vedi Modelli Stampabili",
    previewHeader: "STUDIO ORARIO • 08:00 – 20:00",
    previewGridText: "Griglia Settimanale 5 e 7 Giorni Attiva",
    sec1Badge: "PANORAMICA",
    sec1Title: "Che cos'è il Generatore di Orario Scolastico? La Soluzione Moderna per Studenti",
    sec1P1: "Creare l'orario delle lezioni per il nuovo anno accademico o scolastico può diventare caotico destreggiandosi tra codici corso e aule diverse.",
    sec1P2: "Il nostro strumento online ti consente di visualizzare l'intera settimana in tempo reale, evidenziando sovrapposizioni senza richiedere alcun account o registrazione.",
    sec1Pillars: [
      { title: "Nessuna Registrazione", desc: "Inizia subito senza inserire email né creare password." },
      { title: "Controllo Sovrapposizioni", desc: "Le lezioni negli stessi orari vengono affiancate con avviso immediato." },
      { title: "Privacy Garantita", desc: "Tutti i tuoi corsi e dati rimangono memorizzati esclusivamente sul tuo dispositivo." }
    ],
    sec2Badge: "GESTIONE DEL TEMPO",
    sec2Title: "Basta Ore Buche: Ottimizza le Tue Giornate Universitarie",
    sec2P1: "Avere pause isolate di due ore tra una lezione e l'altra spezza la concentrazione e rende le giornate estenuanti.",
    sec2P2: "Raggruppare i corsi ti permette di terminare prima e dedicare pomeriggi interi allo studio efficace o al tempo libero.",
    secPlanningBadge: "ISCRIZIONI UNIVERSITARIE • PIANIFICAZIONE ORARIO",
    secPlanningTitle: "Strategie d'Iscrizione e Pianificazione dell'Orario Universitario",
    secPlanningSubtitle: "Consigli pratici per gestire la scelta dei corsi, i crediti formativi (CFU) e gli spostamenti tra i poli didattici.",
    planningPillars: [
      {
        title: "Priorità dei Codici Insegnamento",
        desc: "Prepara l'elenco dei codici esame e delle sezioni prima dell'apertura del portale studenti. Tieni sempre pronte 2 alternative per i corsi a numero chiuso o a frequenza limitata."
      },
      {
        title: "Distanza e Spostamenti tra Aule",
        desc: "Valuta i tempi effettivi di percorrenza tra aule e complessi universitari differenti. Evita lezioni consecutive in sedi distanti senza almeno 15 minuti di margine."
      },
      {
        title: "Finestre di Modifica Piano di Studi",
        desc: "Durante le prime settimane di lezione le disponibilità cambiano spesso. Usa il nostro studio visuale per verificare subito se un cambio orario crea sovrapposizioni con altri insegnamenti."
      }
    ],
    sec3Badge: "GUIDA RAPIDA",
    sec3Title: "Come Creare il Tuo Orario delle Lezioni Online",
    sec3Subtitle: "Un flusso di lavoro semplice per pianificare la tua settimana.",
    steps: [
      { num: "01", title: "Inserisci il Corso", desc: "Apri lo Studio (/app) e digita il nome della materia e l'aula." },
      { num: "02", title: "Seleziona i Giorni", desc: "Premi i pulsanti [ L ] [ M ] [ M ] [ G ] [ V ] con un solo clic." },
      { num: "03", title: "Controlla le Ore", desc: "Il sistema verifica in automatico eventuali conflitti di orario." },
      { num: "04", title: "Esporta l'Orario", desc: "Scarica il file .ICS per Google Calendar, un'immagine per lo smartphone o un PDF." }
    ],
    sec4Badge: "MODELLI STAMPABILI",
    sec4Title: "Modelli di Orario Scolastico Modificabili e Stampabili",
    sec4Subtitle: "I formati ideali per ogni esigenza di studio.",
    templates: [
      { title: "Modello PDF Stampabile", desc: "Layout pulito in bianco e nero pronto da stampare in formato A4 per il tuo raccoglitore.", cta: "Crea PDF" },
      { title: "Tabella per Excel e Fogli", desc: "Griglia tabellare con calcolo automatico dei crediti e delle ore settimanali.", cta: "Genera Tabella" },
      { title: "Sfondo per Blocco Schermo (PNG)", desc: "Immagine ad alta definizione per avere orari e aule sempre visibili sullo smartphone.", cta: "Esporta Sfondo" }
    ],
    tableBadge: "CONFRONTO • GENERATORE ORARIO LEZIONI",
    tableTitle: "Confronto: Class Schedule Maker vs Metodi Tradizionali",
    tableSubtitle: "Scopri perché gli studenti scelgono il nostro studio interattivo rispetto ai portali universitari lenti e ai fogli cartacei.",
    tableHeaders: {
      col1: "Funzionalità",
      col2: "Class Schedule Maker",
      col3: "Portali Universitari",
      col4: "Fogli Excel Statici",
      col5: "Diari Cartacei"
    },
    tableRows: [
      { feature: "Costo e Registrazione", studio: "100% Gratuito / Senza Account", portals: "Accesso Obbligatorio", excel: "Richiede Licenza Office", paper: "Diario a Pagamento (15-30€)" },
      { feature: "Rilevamento Conflitti", studio: "Corsie Affiancate Visuali", portals: "Errore Testuale al Salvataggio", excel: "Controllo a Vista", paper: "Cancellature a Mano" },
      { feature: "Ottimizzazione Ore Buche", studio: "Algoritmo Intelligente", portals: "Nessuna Ottimizzazione", excel: "Nessuna Ottimizzazione", paper: "Nessuna Ottimizzazione" },
      { feature: "Sincronizzazione Calendario", studio: "1 Clic (.ICS / Google / Apple)", portals: "Spesso Assente", excel: "Richiede Script Esterni", paper: "Impossibile" },
      { feature: "Passaggio 5 Giorni / 7 Giorni", studio: "Commutazione Immediata", portals: "Formato Rigido", excel: "Modifica Manuale Righe", paper: "Colonne Fisse" },
      { feature: "Usabilità Mobile & Touch", studio: "Schede Touch per Giorno", portals: "Interfaccia Desktop Scomoda", excel: "Zoom Lento", paper: "Da Portare Sempre Dietro" }
    ],
    faqBadge: "DOMANDE FREQUENTI",
    faqTitle: "Domande Frequenti sull'Orario delle Lezioni",
    faqSubtitle: "Tutte le risposte su sincronizzazione calendario, ottimizzazione ore buche e utilizzo gratuito.",
    faqs: [
      {
        q: "Che cos'è un orario scolastico o orario delle lezioni?",
        a: "È una tabella settimanale strutturata che riporta i giorni, gli orari, le aule e i docenti di tutte le materie seguite durante l'anno accademico universitario o scolastico."
      },
      {
        q: "Qual è il miglior creatore di orari delle lezioni online e gratuito?",
        a: "Class Schedule Maker è lo strumento preferito dagli studenti perché è 100% gratuito, non richiede registrazione, evidenzia automaticamente le sovrapposizioni orarie ed esporta in formato .ICS per Google Calendar, Apple Calendar e PDF stampabile."
      },
      {
        q: "È davvero completamente gratuito e senza registrazione?",
        a: "Sì, il nostro generatore di orario è 100% gratuito, non richiede email o password e non ha costi nascosti. I dati vengono salvati localmente nel tuo browser a garanzia della tua privacy."
      },
      {
        q: "Come posso aggiungere il mio orario a Google Calendar o Apple Calendar?",
        a: "Nello Studio clicca su 'Hub Esportazione' e scarica il file .ICS. Apri Google Calendar sul computer, vai in Impostazioni > Importa ed esporta, seleziona il file scaricato e tutte le tue lezioni settimanali appariranno per l'intero semestre."
      },
      {
        q: "Come aiuta a eliminare le ore buche tra una lezione e l'altra?",
        a: "L'ottimizzatore automatico analizza le combinazioni dei corsi per compattare le lezioni al mattino, evitando pause vuote e permettendoti di avere pomeriggi interi liberi per lo studio o il tempo personale."
      },
      {
        q: "Come funziona il controllo delle sovrapposizioni tra lezioni?",
        a: "Se inserisci due insegnamenti che condividono la stessa fascia oraria, il sistema li posiziona affiancati evidenziandoli con una notifica di conflitto, così da evitare errori prima della registrazione formale."
      },
      {
        q: "Dove posso scaricare modelli di orario stampabili in PDF o fogli di calcolo?",
        a: "Dalla nostra sezione Modelli puoi esportare il tuo orario in PDF monocromatico ad alto contrasto per fogli A4, in tabella per Excel/Google Sheets o come sfondo ad alta risoluzione per la schermata di blocco dello smartphone."
      },
      {
        q: "Posso creare un orario di prova prima dell'apertura del piano di studi?",
        a: "Certamente! Molti studenti universitari usano lo Studio per simulare orari ipotetici e testare combinazioni di canali o professori prima dell'apertura ufficiale del portale d'iscrizione."
      }
    ],
    footerCtaTitle: "Crea il Tuo Orario delle Lezioni Oggi Stesso",
    footerCtaSubtitle: "Pianifica una settimana accademica ordinata e senza stress.",
    footerCtaBtn: "Accedi allo Studio Gratuito →"
  },

  fr: {
    metaTitle: "Créateur d'Emploi du Temps — Générateur Gratuit pour Étudiants et Écoles",
    metaDescription: "Créez votre emploi du temps hebdomadaire sans conflit ni heures creuses. Outil gratuit pour étudiants universitaires et scolaires. Exportez vers Google Calendar et PDF.",
    metaKeywords: "emploi du temps, créer emploi du temps, générateur emploi du temps gratuit, planning cours université, emploi du temps en ligne, modèle emploi du temps",
    badge: "Gratuit pour étudiants • Sans compte • 100% Confidentiel",
    h1: "Construisez Votre Emploi du Temps Idéal.",
    subtitle: "Planifiez facilement vos cours hebdomadaires, supprimez les heures creuses inutiles et exportez directement vers votre agenda.",
    ctaLaunch: "Lancer le Studio Planning",
    ctaTemplates: "Voir les Modèles Imprimables",
    previewHeader: "STUDIO PLANNING • 08:00 – 20:00",
    previewGridText: "Grille 5 Jours et 7 Jours Active",
    sec1Badge: "PRÉSENTATION DU SERVICE",
    sec1Title: "Qu'est-ce que le Créateur d'Emploi du Temps ? L'Outil Moderne pour Étudiants",
    sec1P1: "Organiser ses cours universitaires au début de chaque semestre est souvent laborieux avec les interfaces complexes des portails étudiants.",
    sec1P2: "Class Schedule Maker simplifie tout avec une grille interactive rapide, gratuite et confidentielle, directement accessible dans votre navigateur.",
    sec1Pillars: [
      { title: "Zéro Inscription", desc: "Commencez immédiatement sans créer de compte ni renseigner d'adresse e-mail." },
      { title: "Détection des Conflits", desc: "Les cours aux horaires identiques sont placés côte à côte avec une alerte claire." },
      { title: "Confidentialité Totale", desc: "Vos cours et salles restent enregistrés localement sur votre appareil." }
    ],
    sec2Badge: "ORGANISATION DU TEMPS",
    sec2Title: "La Fin des « Temps Morts » : Optimisez vos Journées de Cours",
    sec2P1: "Les pauses isolées d'une heure ou deux entre les cours empêchent toute concentration profonde et finissent en distraction.",
    sec2P2: "En regroupant vos séances de cours, vous dégagez de grandes plages libres continues l'après-midi pour vos révisions ou vos activités.",
    secPlanningBadge: "INSCRIPTIONS UNIVERSITAIRES • STRATÉGIE",
    secPlanningTitle: "Stratégie d'Inscription et Organisation de l'Emploi du Temps Universitaire",
    secPlanningSubtitle: "Conseils pratiques pour réussir son inscription pédagogique et éviter les cours qui se chevauchent.",
    planningPillars: [
      {
        title: "Priorité aux Matières Obligatoires (Majeures)",
        desc: "Identifiez les cours magistraux et travaux dirigés obligatoires avant d'ajouter vos options. Ayez toujours 2 choix de secours en cas de groupes complets."
      },
      {
        title: "Temps de Déplacement Inter-Amphis",
        desc: "Mesurez la distance réelle entre vos différents bâtiments universitaires. Évitez d'enchaîner deux cours consécutifs sans au moins 15 minutes de pause pour changer de salle."
      },
      {
        title: "Semaine d'Ajustement des Groupes",
        desc: "Durant les premiers jours de rentrée, des places se libèrent régulièrement dans d'autres groupes. Notre grille visuelle permet d'évaluer instantanément si un nouvel horaire convient."
      }
    ],
    sec3Badge: "TUTORIEL EN 3 MINUTES",
    sec3Title: "Comment Créer son Emploi du Temps en Ligne",
    sec3Subtitle: "Un processus fluide et rapide pour préparer votre semestre.",
    steps: [
      { num: "01", title: "Ajoutez le Cours", desc: "Ouvrez le Studio (/app) et saisissez l'intitulé de la matière et la salle." },
      { num: "02", title: "Cochez les Jours", desc: "Sélectionnez les jours [ L ] [ M ] [ M ] [ J ] [ V ] en un seul clic." },
      { num: "03", title: "Ajustez les Horaires", desc: "Le système contrôle automatiquement la cohérence des créneaux." },
      { num: "04", title: "Exportez", desc: "Téléchargez le fichier .ICS pour votre agenda ou imprimez une version PDF." }
    ],
    sec4Badge: "MODÈLES GRATUITS",
    sec4Title: "Modèles d'Emploi du Temps Éditables et Imprimables",
    sec4Subtitle: "Des formats conçus pour tous les besoins scolaires et universitaires.",
    templates: [
      { title: "Modèle PDF Imprimable", desc: "Format épuré noir et blanc prêt à imprimer au format A4 pour votre classeur.", cta: "Créer le PDF" },
      { title: "Feuille de Calcul Excel / Sheets", desc: "Tableau personnalisable avec calcul du volume horaire hebdomadaire.", cta: "Générer le Tableur" },
      { title: "Fond d'Écran Téléphone (PNG)", desc: "Image haute résolution pour avoir vos salles sous les yeux sur l'écran verrouillé.", cta: "Exporter pour Mobile" }
    ],
    tableBadge: "COMPARATIF • CRÉATEURS D'EMPLOI DU TEMPS",
    tableTitle: "Comparatif : Class Schedule Maker vs Méthodes Classiques",
    tableSubtitle: "Découvrez pourquoi les étudiants préfèrent notre générateur interactif aux portails rigides et aux feuilles papier.",
    tableHeaders: {
      col1: "Fonctionnalité",
      col2: "Class Schedule Maker",
      col3: "Portails Étudiants",
      col4: "Tableurs Excel Statiques",
      col5: "Agendas Papier"
    },
    tableRows: [
      { feature: "Prix & Inscription", studio: "100% Gratuit / Sans Compte", portals: "Connexion Obligatoire", excel: "Nécessite Licence Office", paper: "Agenda Payant (15-25€)" },
      { feature: "Détection des Conflits", studio: "Voies Visuelles Parallèles", portals: "Code Erreur Complexe", excel: "Vérification Manuelle", paper: "Ratures au Stylo" },
      { feature: "Suppression Heures Creuses", studio: "Algorithme Intégré", portals: "Aucune Optimisation", excel: "Aucune Optimisation", paper: "Aucune Optimisation" },
      { feature: "Synchronisation Calendrier", studio: "1 Clic (.ICS / Google)", portals: "Rare ou Incompatible", excel: "Nécessite Scripts", paper: "Impossible" },
      { feature: "Bascule 5 Jours / 7 Jours", studio: "Instantanée (5J / 7J)", portals: "Format Imposé", excel: "Redimensionner les Lignes", paper: "Colonnes Fixes" },
      { feature: "Utilisation Mobile & Tactile", studio: "Onglets Tactiles par Jour", portals: "Interface Non Adaptée", excel: "Zoom Lent", paper: "À Transporter Partout" }
    ],
    faqBadge: "QUESTIONS FRÉQUENTES",
    faqTitle: "Foire Aux Questions sur l'Emploi du Temps",
    faqSubtitle: "Toutes les réponses pour réussir votre rentrée et organiser vos cours efficacement.",
    faqs: [
      {
        q: "Qu'est-ce qu'un emploi du temps de cours ?",
        a: "Un emploi du temps est un planning hebdomadaire structuré indiquant les jours, les heures, les salles et les enseignants pour chaque matière suivie durant le semestre universitaire ou l'année scolaire."
      },
      {
        q: "Quel est le meilleur créateur d'emploi du temps en ligne gratuit ?",
        a: "Class Schedule Maker est l'outil recommandé car il est 100% gratuit, sans paywall, sans inscription, sans pop-up, élimine les heures creuses et exporte vers Google Calendar, Apple Calendar et PDF."
      },
      {
        q: "Est-ce réellement gratuit et confidentiel ?",
        a: "Oui, notre outil est entièrement gratuit et ne collecte pas vos données. Tout votre planning est stocké localement dans votre propre navigateur pour une confidentialité absolue."
      },
      {
        q: "Comment ajouter son emploi du temps à Google Calendar ou Apple Calendar ?",
        a: "Cliquez sur 'Export .ICS' dans notre Studio, ouvrez Google Calendar sur ordinateur, allez dans Paramètres > Importer et export et téléversez le fichier pour planifier tout le semestre en une fois."
      },
      {
        q: "Comment optimiser et réduire les heures creuses entre les cours ?",
        a: "Notre algorithme teste les meilleures combinaisons de groupes pour regrouper vos cours par blocs consécutifs le matin, vous libérant ainsi des après-midis entiers pour travailler ou vous reposer."
      },
      {
        q: "Comment fonctionne la détection automatique des chevauchements ?",
        a: "Si vous ajoutez deux cours sur le même créneau horaire, ils sont affichés côte à côte avec une bordure d'alerte pour éviter toute erreur d'inscription pédagogique."
      },
      {
        q: "Où trouver des modèles d'emploi du temps modifiables en PDF et Excel ?",
        a: "Dans notre hub de modèles, vous pouvez générer un PDF prêt à imprimer au format A4, une feuille de calcul compatible Excel et Google Sheets, ou un fond d'écran pour smartphone."
      },
      {
        q: "Puis-je créer un emploi du temps fictif pour tester mes options ?",
        a: "Absolument ! De nombreux étudiants utilisent notre studio comme simulateur avant les inscriptions pédagogiques pour tester différentes combinaisons de TD et d'options."
      }
    ],
    footerCtaTitle: "Créez votre Emploi du Temps en Quelques Clics",
    footerCtaSubtitle: "Rejoignez les étudiants qui optimisent leurs semaines de cours gratuitement.",
    footerCtaBtn: "Ouvrir le Studio Gratuit →"
  },

  de: {
    metaTitle: "Stundenplan Erstellen — Kostenloser Online Stundenplan Maker für Uni & Schule",
    metaDescription: "Erstelle deinen idealen wöchentlichen Stundenplan ohne Überschneidungen und ohne Freistunden. Kostenlos für Studenten und Schüler. Export als PDF & iCal.",
    metaKeywords: "stundenplan erstellen, stundenplan maker, stundenplan kostenlos, uni stundenplan, vorlesungsplan, stundenplan vorlage zum ausdrucken",
    badge: "Kostenlos für Studierende • Kein Login • 100% Lokal im Browser",
    h1: "Erstelle Deinen Idealen Semester-Stundenplan.",
    subtitle: "Plane deine wöchentlichen Vorlesungen mühelos, eliminiere zeitraubende Freistunden und exportiere direkt in deinen Kalender.",
    ctaLaunch: "Stundenplan Studio Starten",
    ctaTemplates: "Druckbare Vorlagen Ansehen",
    previewHeader: "STUNDENPLAN STUDIO • 08:00 – 20:00 UHR",
    previewGridText: "5-Tage und 7-Tage Wochenraster Aktiv",
    sec1Badge: "ÜBERSICHT",
    sec1Title: "Was ist der Stundenplan Maker? Die Moderne Lösung für Studierende",
    sec1P1: "Die Semesterplanung an Universitäten und Schulen ist mit unübersichtlichen Portalen und Excel-Tabellen oft unnötig kompliziert.",
    sec1P2: "Unser Stundenplan Maker bietet eine klare, blitzschnelle visuelle Wochenübersicht. Völlig ohne Accountzwang, ohne Paywalls und mit automatischer Terminkollisionsprüfung.",
    sec1Pillars: [
      { title: "Sofort Loslegen", desc: "Kein Login nötig – trage Vorlesungen und Räume direkt ein." },
      { title: "Kollisionserkennung", desc: "Überschneidende Termine werden nebeneinander mit Warnmarkierung angezeigt." },
      { title: "Volle Datensicherheit", desc: "Deine Daten verbleiben ausschließlich lokal in deinem Browser." }
    ],
    sec2Badge: "ZEITMANAGEMENT",
    sec2Title: "Freistunden Minimieren: Mehr Freizeit durch Kompakte Vorlesungstage",
    sec2P1: "Ungünstige Pausen von 1 bis 2 Stunden zwischen Vorlesungen kosten Konzentration und Zeit auf dem Campus.",
    sec2P2: "Indem du Lehrveranstaltungen blockweise bündelst, gewinnst du zusammenhängende freie Nachmittage für Hausarbeiten, Nebenjobs oder Erholung.",
    secPlanningBadge: "SEMESTERPLANUNG • VORLESUNGSVERZEICHNIS",
    secPlanningTitle: "Strategien für die Universitäts-Anmeldung & Vorlesungsplanung",
    secPlanningSubtitle: "Tipps zur Zusammenstellung von Pflicht- und Wahlpflichtmodulen ohne zeitliche Überschneidungen.",
    planningPillars: [
      {
        title: "Modul-Prioritäten Festlegen",
        desc: "Sichere dir zuerst Plätze in Pflichtvorlesungen und Seminaren mit begrenzter Teilnehmerzahl, bevor du flexible Wahlfächer einplanst."
      },
      {
        title: "Wegezeiten Zwischen Hörsälen Prüfen",
        desc: "Beachte Fußwege zwischen verschiedenen Hochschulinstituten. Plane mindestens 15 Minuten Wechselzeit zwischen zwei aufeinanderfolgenden Veranstaltungen ein."
      },
      {
        title: "Belegungsphasen & Restplatzbörse",
        desc: "In den ersten Vorlesungswochen werden häufig Plätze in Parallelgruppen frei. Mit unserem Studio siehst du sofort, ob eine Alternativgruppe in deinen Wochenplan passt."
      }
    ],
    sec3Badge: "SCHNELLANLEITUNG",
    sec3Title: "In 4 Einfachen Schritten zum Wöchentlichen Stundenplan",
    sec3Subtitle: "Ein intuitiver Ablauf für einen stressfreien Start ins Semester.",
    steps: [
      { num: "01", title: "Veranstaltung Eintragen", desc: "Öffne das Studio (/app) und gib Modulname, Dozent und Hörsaal ein." },
      { num: "02", title: "Tage Auswählen", desc: "Wähle Wochentage [ Mo ] [ Di ] [ Mi ] [ Do ] [ Fr ] mit einem Klick." },
      { num: "03", title: "Kollisionen Prüfen", desc: "Das Tool zeigt terminliche Überschneidungen automatisch an." },
      { num: "04", title: "Exportieren", desc: "Exportiere als .ICS-Datei für Google/Apple Kalender oder als A4-PDF." }
    ],
    sec4Badge: "VORLAGEN ZUM DOWNLOAD",
    sec4Title: "Druckbare & Editierbare Stundenplan-Vorlagen",
    sec4Subtitle: "Verschiedene Formate für Büro, Schreibtisch und Smartphone.",
    templates: [
      { title: "Druckbare PDF-Vorlage", desc: "Kontrastreiches Schwarz-Weiß-Format, perfekt für den Ausdruck auf A4-Papier.", cta: "PDF Erstellen" },
      { title: "Excel- & Tabellen-Vorlage", desc: "Strukturierte Tabellenkalkulation mit automatischer Wochenstunden-Berechnung.", cta: "Tabelle Generieren" },
      { title: "Smartphone-Sperrbildschirm (PNG)", desc: "Hochauflösendes Bild mit Räumen und Zeiten direkt auf dem Sperrbildschirm.", cta: "Bild Exportieren" }
    ],
    tableBadge: "VERGLEICH • STUNDENPLAN SOFTWARE",
    tableTitle: "Vergleich: Class Schedule Maker vs Herkömmliche Methoden",
    tableSubtitle: "Warum Studierende unser browserbasiertes Studio starren Uni-Portalen und Papiertabellen vorziehen.",
    tableHeaders: {
      col1: "Funktion",
      col2: "Class Schedule Maker",
      col3: "Uni-Campus-Portale",
      col4: "Statische Excel-Tabellen",
      col5: "Papier-Kalender"
    },
    tableRows: [
      { feature: "Kosten & Registrierung", studio: "100% Kostenlos / Ohne Account", portals: "Zwangsanmeldung", excel: "Lizenz Erforderlich", paper: "Kostenpflichtig (15-25€)" },
      { feature: "Kollisionserkennung", studio: "Parallele Farbspuren", portals: "Kryptische Fehlermeldung", excel: "Manuelle Kontrolle", paper: "Durchstreichen per Hand" },
      { feature: "Freistunden-Optimierer", studio: "Integrierter Algorithmus", portals: "Keine Optimierung", excel: "Keine Optimierung", paper: "Keine Optimierung" },
      { feature: "Kalender-Synchronisation", studio: "1 Klick (.ICS / Google)", portals: "Selten Verfügbar", excel: "Nur über Skripte", paper: "Nicht Möglich" },
      { feature: "5-Tage / 7-Tage Ansicht", studio: "Sofort Umschaltbar", portals: "Festes Raster", excel: "Zeilen Manuell Ändern", paper: "Feste Spalten" },
      { feature: "Mobile Bedienung", studio: "Touch-Tages-Tabs", portals: "Schlechte Mobilansicht", excel: "Träger Zoom", paper: "Muss Ständig Mitgeführt Werden" }
    ],
    faqBadge: "HÄUFIG GESTELLTE FRAGEN",
    faqTitle: "Häufig Gestellte Fragen zum Stundenplan Maker",
    faqSubtitle: "Alles Wichtige zur Kalender-Synchronisation, Freistunden-Optimierung und kostenlosen Nutzung.",
    faqs: [
      {
        q: "Was ist ein wöchentlicher Stundenplan?",
        a: "Ein Stundenplan ist eine strukturierte Wochenübersicht, die Tage, Uhrzeiten, Hörsäle und Dozenten aller im Semester belegten Lehrveranstaltungen abbildet."
      },
      {
        q: "Was ist der beste kostenlose Online Stundenplan Maker?",
        a: "Class Schedule Maker ist die ideale Wahl für Studierende, da er 100% kostenlos ohne Registrierung funktioniert, Terminüberschneidungen automatisch visualisiert und direkt in Google Kalender oder als druckbare PDF-Datei exportiert."
      },
      {
        q: "Ist der Stundenplan Maker wirklich komplett kostenlos und werbefrei?",
        a: "Ja, alle Funktionen stehen dauerhaft kostenfrei ohne Bezahlschranke und ohne Abo zur Verfügung. Deine Kursdaten werden lokal in deinem Browser gespeichert."
      },
      {
        q: "Wie füge ich meinen Stundenplan zu Google Kalender oder Apple Kalender hinzu?",
        a: "Klicke im Studio auf 'Export .ICS'. Öffne Google Kalender am Computer unter Einstellungen > Importieren und lade die heruntergeladene Datei hoch, um alle Vorlesungen sofort als wöchentliche Serientermine einzutragen."
      },
      {
        q: "Wie hilft der Optimierer beim Vermeiden von Freistunden?",
        a: "Der automatische Optimierer prüft Stundenkombinationen, um Vorlesungen in zusammenhängenden Blöcken am Vormittag zu bündeln, sodass unnötige Wartezeiten auf dem Campus entfallen."
      },
      {
        q: "Wie funktioniert die automatische Kollisionserkennung?",
        a: "Wenn zwei Lehrveranstaltungen zur gleichen Zeit stattfinden, zeigt das System sie nebeneinander mit einer deutlichen Warnmarkierung an, damit du Belegungsfehler rechtzeitig korrigieren kannst."
      },
      {
        q: "Wo finde ich editierbare Stundenplan-Vorlagen als PDF oder Excel?",
        a: "In unserem Vorlagen-Bereich kannst du deinen fertigen Wochenplan als A4-Druck-PDF, als Excel-Tabelle oder als Smartphone-Sperrbildschirm-Grafik exportieren."
      },
      {
        q: "Kann ich den Stundenplaner nutzen, um Probe-Stundenpläne vor der Belegungsfrist zu testen?",
        a: "Ja! Viele Studierende nutzen unser Studio als Testumgebung, um verschiedene Seminar- und Übungskombinationen auszuprobieren, bevor das offizielle Vorlesungsportal öffnet."
      }
    ],
    footerCtaTitle: "Plane Deinen Stundenplan in Wenigen Sekunden",
    footerCtaSubtitle: "Starte organisiert und ohne Terminkonflikte ins neue Semester.",
    footerCtaBtn: "Kostenloses Studio Öffnen →"
  },

  pt: {
    metaTitle: "Criador de Grade Horária — Gerador Gratuito de Horário de Aulas",
    metaDescription: "Crie sua grade horária semanal sem choque de matérias e sem janelas vagas. Gerador gratuito de horários escolares e universitários online. Exporte para Google Calendar e PDF.",
    metaKeywords: "grade horaria, horario de aulas, gerador de horario gratis, grade horaria faculdade, organizador semanal de aulas, modelo grade horaria",
    badge: "Grátis para estudantes • Sem cadastro • 100% Privado no Navegador",
    h1: "Crie sua Grade Horária Ideal para o Semestre.",
    subtitle: "Organize suas aulas semanais facilmente, elimine janelas vazias no campus e exporte diretamente para seu calendário.",
    ctaLaunch: "Abrir Estúdio de Horários",
    ctaTemplates: "Ver Modelos Imprimíveis",
    previewHeader: "ESTÚDIO DE HORÁRIOS • 08:00 – 20:00",
    previewGridText: "Matriz Ativa de 5 e 7 Dias",
    sec1Badge: "VISÃO GERAL",
    sec1Title: "O que é o Criador de Grade Horária? A Solução Ideal para Estudantes",
    sec1P1: "Montar a grade de matérias para o novo semestre na faculdade costuma ser estressante devido aos sistemas lentos das universidades.",
    sec1P2: "Nosso gerador de horários substitui esse processo por uma matriz visual rápida, sem necessidade de login e com detecção automática de choques de horário.",
    sec1Pillars: [
      { title: "Sem Cadastro", desc: "Comece imediatamente sem fornecer e-mail ou dados pessoais." },
      { title: "Detecção de Choques", desc: "Aulas no mesmo horário são colocadas lado a lado com alerta claro." },
      { title: "Privacidade Local", desc: "Suas informações ficam guardadas apenas no navegador do seu dispositivo." }
    ],
    sec2Badge: "PRODUTIVIDADE",
    sec2Title: "Elimine as 'Janelas' Vagas: Aproveite Melhor seu Dia",
    sec2P1: "Intervalos soltos de 2 horas entre aulas quebram o ritmo de estudo e geram cansaço no campus.",
    sec2P2: "Concentrando suas aulas em blocos contínuos pela manhã, você garante tardes inteiras livres para estágios, estudos ou descanso.",
    secPlanningBadge: "MATRÍCULA UNIVERSITÁRIA • PLANEJAMENTO",
    secPlanningTitle: "Estratégia de Matrícula e Planejamento de Grade Universitária",
    secPlanningSubtitle: "Orientações práticas para selecionar matérias obrigatórias, créditos e gerenciar deslocamentos entre salas.",
    planningPillars: [
      {
        title: "Prioridade para Disciplinas Obrigatórias",
        desc: "Garanta vagas nas disciplinas obrigatórias e pré-requisitos antes de escolher matérias eletivas. Mantenha opções alternativas anotadas."
      },
      {
        title: "Distância entre Prédios e Salas",
        desc: "Avalie o tempo de deslocamento entre diferentes blocos da faculdade. Evite aulas seguidas em prédios distantes sem pelo menos 15 minutos de intervalo."
      },
      {
        title: "Ajuste na Semana de Matrícula",
        desc: "Vagas são liberadas com frequência nos primeiros dias de aula. Com nossa grade interativa, você vê imediatamente se uma turma alternativa encaixa na sua rotina."
      }
    ],
    sec3Badge: "PASSO A PASSO",
    sec3Title: "Como Criar sua Grade Horária Semanal Online",
    sec3Subtitle: "Um fluxo prático para organizar todo o semestre.",
    steps: [
      { num: "01", title: "Insira a Disciplina", desc: "Abra o Studio (/app) e informe o código da matéria, créditos e sala." },
      { num: "02", title: "Escolha os Dias", desc: "Marque os dias da semana [ Seg ] [ Ter ] [ Qua ] [ Qui ] [ Sex ] em um clique." },
      { num: "03", title: "Verifique Conflitos", desc: "O sistema detecta automaticamente sobreposições de horários." },
      { num: "04", title: "Exporte", desc: "Baixe o arquivo .ICS para Google Calendar, um wallpaper ou PDF A4." }
    ],
    sec4Badge: "MODELOS GRATUITOS",
    sec4Title: "Modelos de Grade Horária Editáveis e Imprimíveis",
    sec4Subtitle: "Formatos versáteis para imprimir ou usar no celular.",
    templates: [
      { title: "Modelo PDF para Imprimir", desc: "Layout limpo em preto e branco otimizado para folhas A4.", cta: "Criar PDF" },
      { title: "Planilha Excel e Sheets", desc: "Formato em tabela com soma automática de créditos e carga horária.", cta: "Gerar Planilha" },
      { title: "Papel de Parede para Celular (PNG)", desc: "Imagem nítida para visualizar salas e horários diretamente na tela de bloqueio.", cta: "Exportar Imagem" }
    ],
    tableBadge: "COMPARATIVO • SISTEMAS DE HORÁRIOS",
    tableTitle: "Comparação: Class Schedule Maker vs Métodos Tradicionais",
    tableSubtitle: "Veja por que universitários preferem nosso estúdio interativo em vez de portais complicados e anotações em papel.",
    tableHeaders: {
      col1: "Recurso",
      col2: "Class Schedule Maker",
      col3: "Portais Universitários",
      col4: "Planilhas Estáticas",
      col5: "Agendas de Papel"
    },
    tableRows: [
      { feature: "Custo e Cadastro", studio: "100% Gratuito / Sem Conta", portals: "Login Obrigatório", excel: "Exige Licença Office", paper: "Caderno Pago (R$ 30-60)" },
      { feature: "Detecção de Conflitos", studio: "Faixas Visuais Paralelas", portals: "Erro em Texto ao Salvar", excel: "Checagem Manual", paper: "Rascunhos à Mão" },
      { feature: "Otimizador de Janelas", studio: "Algoritmo Integrado", portals: "Sem Otimização", excel: "Sem Otimização", paper: "Sem Otimização" },
      { feature: "Sincronização de Calendário", studio: "1 Clique (.ICS / Google)", portals: "Geralmente Inexistente", excel: "Exige Scripts", paper: "Impossível" },
      { feature: "Alternar 5 Dias / 7 Dias", studio: "Instantâneo (5D / 7D)", portals: "Formato Rígido", excel: "Redimensionar Linhas", paper: "Colunas Fixas" },
      { feature: "Uso no Smartphone", studio: "Abas Touch por Dia", portals: "Interface Não Otimizada", excel: "Navegação Lenta", paper: "Obrigatório Carregar Sempre" }
    ],
    faqBadge: "PERGUNTAS FREQUENTES",
    faqTitle: "Perguntas Frequentes sobre a Grade de Horários",
    faqSubtitle: "Tudo o que você precisa saber sobre exportação de calendários, janelas vagas e uso gratuito.",
    faqs: [
      {
        q: "O que é um horário de aulas ou grade horária?",
        a: "É o cronograma semanal que detalha os dias, horários de início e término, salas e professores de todas as matérias cursadas no semestre letivo."
      },
      {
        q: "Qual é o melhor gerador de grade horária online e gratuito?",
        a: "Class Schedule Maker é amplamente recomendado porque é 100% grátis, não exige criação de conta, destaca conflitos de horário em paralelo e exporta diretamente para o Google Calendar, Apple Calendar e PDF."
      },
      {
        q: "O serviço é realmente gratuito e sem anúncios invasivos?",
        a: "Sim, nossa plataforma é gratuita, não requer cartão de crédito e não cobra assinaturas. Seus dados de horários permanecem armazenados com total segurança no seu próprio navegador."
      },
      {
        q: "Como adicionar meu horário ao Google Calendar ou Apple Calendar?",
        a: "No Studio, clique em 'Export .ICS'. Abra o Google Calendar no computador, acesse Configurações > Importar e exportar e selecione o arquivo baixado para registrar todas as aulas do semestre."
      },
      {
        q: "Como o otimizador ajuda a eliminar janelas vagas entre matérias?",
        a: "O algoritmo testa combinações de turmas para concentrar suas aulas em períodos contínuos, reduzindo horas ociosas e permitindo que você tenha tardes livres para estágios e estudos."
      },
      {
        q: "Como funciona o alerta de matérias no mesmo horário?",
        a: "Caso duas disciplinas sejam cadastradas no mesmo horário, o sistema as posiciona lado a lado com um aviso de sobreposição para evitar erros de matrícula."
      },
      {
        q: "Onde encontro modelos prontos de grade horária para impressão ou Excel?",
        a: "No Hub de Modelos você pode exportar sua grade em PDF de alta nitidez para impressão A4, planilha editável compatível com Excel e Google Sheets ou papel de parede para celular."
      },
      {
        q: "Posso montar grades de teste antes de abrir o período de matrícula da faculdade?",
        a: "Com certeza! É comum usar nosso estúdio como simulador para testar diferentes combinações de professores e turnos antes do sistema acadêmico abrir oficialmente."
      }
    ],
    footerCtaTitle: "Organize sua Grade de Aulas em Poucos Minutos",
    footerCtaSubtitle: "Planeje um semestre sem choques de horário e sem tempo perdido.",
    footerCtaBtn: "Acessar Estúdio de Horários Grátis →"
  },

  ja: {
    metaTitle: "時間割作成ツール — 無料の大学生・学校向け週間時間割ジェネレーター",
    metaDescription: "授業の重複や空きコマをなくす理想の週間時間割を簡単作成。大学生や高校生向けの完全無料オンライン時間割作成ツール。Googleカレンダー連携・PDF出力対応。",
    metaKeywords: "時間割作成, 時間割アプリ, 無料時間割, 大学時間割, 履修登録, 時間割テンプレート印刷, 週間スケジュール",
    badge: "学生向け完全無料 • アカウント不要 • ブラウザ内完結のプライバシー",
    h1: "理想の学期時間割を作成しよう。",
    subtitle: "毎週の授業を直感的に配置。無駄な空きコマをなくし、カレンダーへ直接出力できます。",
    ctaLaunch: "時間割スタジオを起動",
    ctaTemplates: "印刷用テンプレートを見る",
    previewHeader: "時間割スタジオ • 08:00 – 20:00",
    previewGridText: "5日制・7日制マトリクス対応",
    sec1Badge: "サービス概要",
    sec1Title: "時間割作成ツールとは？ スマートな履修計画のためのWebアプリ",
    sec1P1: "新学期の履修登録期間、複雑な学務情報システムやメモ帳を行き来しながら時間割を組むのは大きなストレスです。",
    sec1P2: "Class Schedule Makerは、アカウント作成不要・完全無料でブラウザ上で直感的に時間割を作成できる高機能ツールです。授業の重複も自動で検知します。",
    sec1Pillars: [
      { title: "登録不要ですぐ使える", desc: "メールアドレスやパスワードを入力することなく、今すぐ授業の入力を開始できます。" },
      { title: "重複チェック機能", desc: "同じ時限の重複講義を自動で検知し、見やすく並べてアラートを表示します。" },
      { title: "安心のローカル保存", desc: "入力した科目情報は外部サーバーに送信されず、お使いの端末内にのみ安全に保持されます。" }
    ],
    sec2Badge: "時間活用",
    sec2Title: "無駄な「空きコマ」をなくす：タイムブロッキングの重要性",
    sec2P1: "授業の合間に1〜2時間の中途半端な空きコマがあると、勉強にも休息にも集中できず時間を浪費してしまいがちです。",
    sec2P2: "午前中に授業をまとめて配置することで、午後のまとまった自由時間を確保し、サークル、アルバイト、自己投資に集中できます。",
    secPlanningBadge: "大学履修登録 • 時間割戦略",
    secPlanningTitle: "大学の履修登録を成功させる時間割プランニング戦略",
    secPlanningSubtitle: "必修科目と選択科目を効率よく組み合わせ、移動時間や重複を防ぐための実践的なヒント。",
    planningPillars: [
      {
        title: "必修科目と時間割コードの事前整理",
        desc: "履修登録開始前に必修科目の時間枠を確定し、満員に備えて第2・第3希望の選択科目もリストアップしておきましょう。"
      },
      {
        title: "キャンパス内の教室移動時間の確認",
        desc: "広いキャンパスでは教室間の移動に10分以上かかる場合があります。連続コマの教室位置を事前に確認し、無理のない配置にしましょう。"
      },
      {
        title: "履修変更（追加・修正）期間の活用",
        desc: "学期初めの履修修正期間は定員の空きが出やすい時期です。当ツールのシミュレーションで即座に代替コマを評価できます。"
      }
    ],
    sec3Badge: "クイックガイド",
    sec3Title: "オンラインで週間時間割を作成する4ステップ",
    sec3Subtitle: "直感的な操作で、迷わずスケジュールを組み立てられます。",
    steps: [
      { num: "01", title: "科目情報を入力", desc: "スタジオ（/app）を開き、科目名や教室名を入力します。" },
      { num: "02", title: "曜日を選択", desc: "[ 月 ] [ 火 ] [ 水 ] [ 木 ] [ 金 ] のボタンで該当曜日をワンタップ指定。" },
      { num: "03", title: "重複を確認", desc: "同じ時間の重なりを自動検知してわかりやすく色分け表示。" },
      { num: "04", title: "保存・カレンダー連携", desc: "Googleカレンダー（.ICS）、スマホ壁紙画像、印刷用PDFに出力。" }
    ],
    sec4Badge: "無料テンプレート",
    sec4Title: "編集可能な時間割テンプレート（PDF・Excel）",
    sec4Subtitle: "用途に合わせて選べる多彩な出力フォーマット。",
    templates: [
      { title: "印刷用PDFテンプレート", desc: "A4用紙にぴったり収まるモノクロ印刷用フォーマット。デスクに貼るのに最適です。", cta: "PDFを作成" },
      { title: "Excel・スプレッドシート", desc: "単位数の合計計算などが可能な表計算形式のテンプレートです。", cta: "表形式で作成" },
      { title: "スマホ待ち受け画像（PNG）", desc: "教室番号が一目でわかる、iPhone・Android向けの高画質ロック画面画像。", cta: "待ち受けを出力" }
    ],
    tableBadge: "機能比較 • 時間割ツール",
    tableTitle: "比較：Class Schedule Maker vs 従来の時間割管理手法",
    tableSubtitle: "なぜ多くの学生が、大学ポータルや紙の手帳よりも当スタジオを選ぶのか。",
    tableHeaders: {
      col1: "主な機能",
      col2: "Class Schedule Maker",
      col3: "大学学務ポータル",
      col4: "Excelシート",
      col5: "紙の時間割手帳"
    },
    tableRows: [
      { feature: "利用料 & アカウント", studio: "完全無料 / 登録不要", portals: "ログイン必須", excel: "Officeライセンス必要", paper: "有料手帳 (1,000〜2,000円)" },
      { feature: "コマ重複の自動検知", studio: "視覚的な並列レーン表示", portals: "登録エラー表示のみ", excel: "目視での確認", paper: "手動での書き直し" },
      { feature: "空きコマ最適化", studio: "自動組み合わせ最適化", portals: "最適化機能なし", excel: "最適化機能なし", paper: "最適化機能なし" },
      { feature: "カレンダー連携", studio: "1クリック同期 (.ICS)", portals: "ほぼ未対応", excel: "手動マクロが必要", paper: "不可能" },
      { feature: "5日制 / 7日制切り替え", studio: "即座に切替可能", portals: "固定形式", excel: "行の手動再調整", paper: "曜日列固定" },
      { feature: "スマホでの操作性", studio: "曜日別タッチタブ", portals: "PC画面で操作が困難", excel: "ピンチ操作で重い", paper: "常に持ち歩きが必要" }
    ],
    faqBadge: "よくあるご質問",
    faqTitle: "時間割作成ツールに関するFAQ",
    faqSubtitle: "使い方やカレンダー同期についての疑問にお答えします。",
    faqs: [
      {
        q: "時間割表（クラススケジュール）とは何ですか？",
        a: "時間割表とは、1週間の各曜日に開講される授業のコマ、時限、担当教員、教室を一覧できるように整理した時間管理マトリクスです。"
      },
      {
        q: "一番使いやすい無料のオンライン時間割ツールは？",
        a: "Class Schedule Makerは、登録不要ですぐに使え、授業重複の自動検知や空きコマの最適化、Googleカレンダー連携、PDF出力をすべて無料で提供するおすすめツールです。"
      },
      {
        q: "本当に無料で登録も必要ありませんか？",
        a: "はい、本ツールはすべての機能を完全無料で提供しており、メール登録や課金は一切ありません。入力データもお使いのブラウザ内にのみ保持されます。"
      },
      {
        q: "時間割をGoogleカレンダーやiPhoneに追加する方法は？",
        a: "スタジオ画面で「Export .ICS」をクリックしてファイルをダウンロードし、Googleカレンダーの設定画面から「インポート」を選ぶだけで、学期全体の授業が一括登録されます。"
      },
      {
        q: "無駄な「空きコマ」を減らすにはどうすればいいですか？",
        a: "スタジオの「Auto-Optimize」機能を使うことで、午前中に授業を集中させる最適な組み合わせを自動検証し、午後のまとまった自由時間を確保できます。"
      },
      {
        q: "授業時間の重複はどうやって防止されますか？",
        a: "同じ曜日・時間帯に授業を登録すると、システムが自動的に2つの枠を横並びにして警告枠を表示するため、登録ミスを未然に防げます。"
      },
      {
        q: "印刷用PDFやExcel用の時間割テンプレートはどこで入手できますか？",
        a: "テンプレートハブから、A4印刷に最適な高コントラストPDF、計算式入りExcelテンプレート、スマホ用ロック画面画像をワンクリックで出力できます。"
      },
      {
        q: "本登録前にシミュレーション用の時間割を作成できますか？",
        a: "はい、履修登録開始前のシミュレーション用として自由に科目や時限を入力し、最適な時間割パターンを比較検討できます。"
      }
    ],
    footerCtaTitle: "今すぐ理想の時間割を作成しよう",
    footerCtaSubtitle: "無駄のないスケジュールで、充実した新学期をスタートさせましょう。",
    footerCtaBtn: "無料スタジオを起動する →"
  },

  ko: {
    metaTitle: "시간표 만들기 — 무료 대학생 & 초중고 주간 시간표 작성기",
    metaDescription: "공강 시간을 최소화하고 강의 중복 없는 완벽한 주간 시간표를 만들어보세요. 구글 캘린더 연동 및 PDF 인쇄를 지원하는 100% 무료 온라인 시간표 제작 툴.",
    metaKeywords: "시간표 만들기, 대학생 시간표, 시간표 짜기, 주간 시간표, 에브리타임 대안, 무료 시간표 양식, 학교 시간표",
    badge: "학생 무료 • 회원가입 없음 • 100% 로컬 브라우저 보안",
    h1: "나에게 딱 맞는 이상적인 학기 시간표를 완성하세요.",
    subtitle: "주간 수업을 손쉽게 구성하고, 낭비되는 우주 공강을 없애며, 캘린더로 즉시 내보내세요.",
    ctaLaunch: "시간표 스튜디오 열기",
    ctaTemplates: "인쇄용 시간표 양식 보기",
    previewHeader: "시간표 스튜디오 • 08:00 AM – 08:00 PM",
    previewGridText: "5일제 및 7일제 매트릭스 지원",
    sec1Badge: "툴 소개",
    sec1Title: "시간표 만들기 툴이란? 스마트한 학생들을 위한 시간표 빌더",
    sec1P1: "매 학기 수강 신청 기간마다 복잡한 대학 종합정보시스템과 메모장을 오가며 강의 시간표를 짜는 일은 큰 스트레스입니다.",
    sec1P2: "본 서비스는 로그인 없이 브라우저에서 바로 실행되며, 중복 강의 감지 기능과 공강 시간 최소화 알고리즘을 통해 가장 효율적인 시간표를 시각적으로 완성해 줍니다.",
    sec1Pillars: [
      { title: "회원가입 없이 즉시 사용", desc: "이메일 입력이나 가입 절차 없이 바로 과목과 강의실을 입력할 수 있습니다." },
      { title: "강의 중복 자동 체크", desc: "동일 시간대 강의는 나란히 배치되어 수강 신청 실수를 방지합니다." },
      { title: "완벽한 프라이버시", desc: "입력된 시간표 정보는 외부 서버에 전송되지 않고 브라우저에만 안전하게 보관됩니다." }
    ],
    sec2Badge: "학업 생산성",
    sec2Title: "애매한 공강 시간 없애기: 타임 블로킹의 중요성",
    sec2P1: "수업 사이 1~2시간의 애매한 공강은 공부하기도 쉬기도 어려워 시간을 허비하게 만듭니다.",
    sec2P2: "오전에 강의를 연속해서 듣도록 시간표를 구성하면, 오후 시간을 통째로 확보하여 과제, 스터디, 아르바이트에 집중할 수 있습니다.",
    secPlanningBadge: "수강신청 전략 • 시간표 플래닝",
    secPlanningTitle: "대학 수강 신청 전략 및 효율적인 주간 시간표 플래닝 가이드",
    secPlanningSubtitle: "전공 필수 과목과 교양 과목을 지혜롭게 배치하고 캠퍼스 이동 시간을 줄이는 노하우.",
    planningPillars: [
      {
        title: "학수번호 및 분반 우선순위 지정",
        desc: "수강 신청 개시 전에 전공 필수 과목의 학수번호와 희망 분반을 정리해 두세요. 마감에 대비해 2~3개의 대체 분반도 함께 마련해야 합니다."
      },
      {
        title: "강의동 간 실제 도보 이동 시간 확인",
        desc: "넓은 캠퍼스에서는 공학관에서 인문관까지 이동하는 데 10분 이상 소요될 수 있습니다. 연속 수업의 경우 건물 위치를 미리 체크하세요."
      },
      {
        title: "수강 정정(드랍/추가) 기간 활용",
        desc: "학기 초 정정 기간에는 수강 취소로 빈자리가 자주 발생합니다. 시각적 시간표 매트릭스를 활용하면 대체 과목의 충돌 여부를 즉시 판단할 수 있습니다."
      }
    ],
    sec3Badge: "간단 3단계 가이드",
    sec3Title: "온라인으로 주간 시간표 만드는 방법",
    sec3Subtitle: "누구나 쉽게 따라 할 수 있는 직관적인 구성.",
    steps: [
      { num: "01", title: "과목 정보 입력", desc: "스튜디오(/app)를 열고 과목명, 학점, 강의실을 입력합니다." },
      { num: "02", title: "요일 선택", desc: "[ 월 ] [ 화 ] [ 수 ] [ 목 ] [ 금 ] 버튼을 클릭하여 요일을 지정합니다." },
      { num: "03", title: "시간 중복 확인", desc: "겹치는 수업이 없는지 시각적으로 자동 확인합니다." },
      { num: "04", title: "캘린더 내보내기", desc: "구글 캘린더(.ICS) 파일로 내보내거나 고화질 PDF로 인쇄합니다." }
    ],
    sec4Badge: "무료 양식 다운로드",
    sec4Title: "수정 가능한 시간표 템플릿 (PDF, 엑셀, 배경화면)",
    sec4Subtitle: "다양한 용도에 맞게 선택할 수 있는 출력 형식.",
    templates: [
      { title: "인쇄용 PDF 시간표 양식", desc: "A4 용지 출력에 최적화된 깔끔한 흑백 디자인으로 책상 앞에 붙여놓기 좋습니다.", cta: "PDF 양식 생성" },
      { title: "엑셀 및 스프레드시트 양식", desc: "학점 총합 계산과 서식 편집이 자유로운 표 형식의 템플릿입니다.", cta: "엑셀 표 생성" },
      { title: "스마트폰 잠금화면 (PNG)", desc: "학기 초 강의실을 빠르게 확인할 수 있는 스마트폰 최적화 고화질 이미지.", cta: "배경화면 저장" }
    ],
    tableBadge: "기능 비교 • 시간표 프로그램",
    tableTitle: "비교: Class Schedule Maker vs 기존 시간표 작성 방식",
    tableSubtitle: "학생들이 답답한 대학 포털이나 종이 플래너 대신 본 스튜디오를 선택하는 이유.",
    tableHeaders: {
      col1: "주요 기능",
      col2: "Class Schedule Maker",
      col3: "대학 포털 시스템",
      col4: "정적 엑셀 시트",
      col5: "종이 다이어리"
    },
    tableRows: [
      { feature: "비용 및 가입", studio: "100% 무료 / 가입 불필요", portals: "학번 로그인 필수", excel: "오피스 라이선스 필요", paper: "유료 플래너 (1~2만원)" },
      { feature: "강의 중복 감지", studio: "시각적 병렬 레인 표시", portals: "텍스트 오류 메시지", excel: "직접 눈으로 대조", paper: "볼펜으로 수정" },
      { feature: "공강 시간 최적화", studio: "내장 최적화 알고리즘", portals: "최적화 기능 없음", excel: "최적화 기능 없음", paper: "최적화 기능 없음" },
      { feature: "캘린더 연동", studio: "1클릭 동기화 (.ICS)", portals: "연동 불가 또는 불안정", excel: "매크로 필요", paper: "연동 불가" },
      { feature: "5일제 / 7일제 전환", studio: "원클릭 즉각 전환", portals: "고정된 레이아웃", excel: "수동 행 조절 필요", paper: "요일 칸 고정" },
      { feature: "모바일 터치 편의성", studio: "요일별 터치 탭", portals: "모바일에서 조작 곤란", excel: "확대/축소 번거로움", paper: "항상 휴대해야 함" }
    ],
    faqBadge: "자주 묻는 질문",
    faqTitle: "시간표 제작 관련 자주 묻는 질문",
    faqSubtitle: "캘린더 동기화 및 이용 방법에 대한 안내.",
    faqs: [
      {
        q: "시간표(Class Schedule)란 무엇인가요?",
        a: "학기 동안 수강하는 모든 강의의 요일, 시작 및 종료 시간, 강의실, 담당 교수를 한눈에 파악할 수 있도록 정리한 주간 일정표입니다."
      },
      {
        q: "가장 쓰기 편한 무료 온라인 시간표 제작 도구는 무엇인가요?",
        a: "Class Schedule Maker는 회원가입 없이 브라우저에서 바로 사용 가능하며, 겹치는 강의를 시각적으로 자동 감지하고 구글 캘린더 연동 및 PDF 출력을 지원하는 최적의 무료 도구입니다."
      },
      {
        q: "정말로 모든 기능이 100% 무료인가요?",
        a: "네, 본 서비스는 결제나 유료 구독 유도 없이 100% 무료로 제공됩니다. 입력한 모든 시간표 데이터는 서버에 저장되지 않고 본인 기기에만 안전하게 보관됩니다."
      },
      {
        q: "시간표를 구글 캘린더나 아이폰 캘린더에 연동하는 방법은?",
        a: "스튜디오에서 'Export .ICS' 버튼을 눌러 파일을 다운로드한 뒤, 구글 캘린더 설정 > 가져오기에서 해당 파일을 등록하면 한 학기 수업 일정이 자동으로 캘린더에 등록됩니다."
      },
      {
        q: "애매한 공강 시간을 어떻게 줄일 수 있나요?",
        a: "스튜디오의 'Auto-Optimize' 기능을 실행하면 오전 연속 수업 블록을 자동으로 찾아내어, 버려지는 공강 시간을 없애고 오후 자유 시간을 극대화할 수 있습니다."
      },
      {
        q: "강의 시간이 겹칠 때 중복 체크는 어떻게 이루어지나요?",
        a: "동일한 요일과 시간대에 과목을 추가하면 두 강의가 나란히 분할 표시되며 테두리에 경고 표시가 나타나 수강 신청 오류를 사전에 방지합니다."
      },
      {
        q: "인쇄용 PDF나 엑셀 시간표 양식은 어디서 받나요?",
        a: "템플릿 허브에서 A4 인쇄에 최적화된 고대비 흑백 PDF 양식, 학점 계산이 포함된 엑셀/스프레드시트 서식, 스마트폰 잠금화면용 고화질 이미지를 즉시 생성할 수 있습니다."
      },
      {
        q: "수강 신청 기간 전에 가상 시간표를 미리 짜볼 수 있나요?",
        a: "네! 많은 학생들이 수강 신청 전 여러 분반과 교수님 조합을 비교하기 위한 시뮬레이터로 스튜디오를 활발히 이용하고 있습니다."
      }
    ],
    footerCtaTitle: "지금 바로 나만의 시간표를 만들어보세요",
    footerCtaSubtitle: "공강 시간 걱정 없는 알찬 새 학기를 준비하세요.",
    footerCtaBtn: "무료 시간표 스튜디오 시작 →"
  },

  tl: {
    metaTitle: "Class Schedule Maker — Libreng Weekly Schedule Maker para sa Estudyante",
    metaDescription: "Gumawa ng perpektong iskedyul ng klase nang walang conflict at walang bakanteng oras. Libreng online weekly class schedule maker para sa college at high school.",
    metaKeywords: "iskedyul ng klase, class schedule maker, free class schedule maker, school schedule maker, college class schedule, schedule template tagalog",
    badge: "Libre para sa estudyante • Walang account • 100% Pribado sa Browser",
    h1: "Bumuo ng Iyong Tamang Iskedyul sa Semestre.",
    subtitle: "Madaling i-plano ang iyong lingguhang klase, bawasan ang mga bakanteng oras sa campus, at i-export diretso sa iyong kalendaryo.",
    ctaLaunch: "Buksan ang Schedule Studio",
    ctaTemplates: "Tingnan ang Libreng Templates",
    previewHeader: "SCHEDULE STUDIO • 08:00 AM – 08:00 PM",
    previewGridText: "5-Day at 7-Day Matrix Aktibo",
    sec1Badge: "PANGKALAHATANG IMPORMASYON",
    sec1Title: "Ano ang Class Schedule Maker? Ang Makabagong Solusyon para sa Estudyante",
    sec1P1: "Ang pag-aayos ng iskedyul para sa bagong semestre ay madalas nakakalito dahil sa mabagal na university portals at magugulong spreadsheets.",
    sec1P2: "Ang aming tool ay mabilis, libre, at gumagana direkta sa iyong browser nang hindi humihingi ng login o personal data.",
    sec1Pillars: [
      { title: "Mabilis at Walang Login", desc: "I-type lang ang subject at oras, makikita mo agad ang weekly timetable mo." },
      { title: "Automatic Conflict Warning", desc: "Kung may magkasabay na klase, awtomatikong ipinapakita ang babala." },
      { title: "Pribado sa Browser Mo", desc: "Hindi iniimbak sa internet ang iyong mga klase o kwarto." }
    ],
    sec2Badge: "PRODUCTIVITY NG ESTUDYANTE",
    sec2Title: "Bakit Mahalagang Bawasan ang Bakanteng Oras (Vacant) sa Campus",
    sec2P1: "Ang 2 oras na vacant sa pagitan ng klase ay madalas nasasayang lamang sa pagtambay o pag-commute sa halip na makapag-aral nang maayos.",
    sec2P2: "Tinutulungan ka ng aming optimizer na pagsamahin ang iyong mga klase sa umaga para buo ang iyong hapon para sa trabaho o pahinga.",
    secPlanningBadge: "ENROLLMENT STRATEGY • COLLEGE SCHEDULING",
    secPlanningTitle: "Gabay sa Pagpaplano ng Iskedyul sa Kolehiyo at Estratehiya sa Enrollment",
    secPlanningSubtitle: "Mga praktikal na tip para sa maayos na pagpili ng subject, section, at pag-iwas sa banggaan ng oras.",
    planningPillars: [
      {
        title: "Subject Code at Section Priority",
        desc: "Ihanda ang mga subject code at CRN bago magbukas ang portal ng enrollment. Maghanda rin ng 2 alternatibong section kung sakaling mapuno agad."
      },
      {
        title: "Distansya sa Pagitan ng mga Gusali",
        desc: "Tingnan ang layo ng mga classroom sa campus. Iwasan ang magkasunod na klase sa magkaibang building kung walang sapat na 15 minutong lakaran."
      },
      {
        title: "Adjustment at Add/Drop Period",
        desc: "Sa unang linggo ng klase, marami ang nagpapalit ng section. Gamitin ang visual studio para agad makita kung swak ang bagong oras sa iyong iskedyul."
      }
    ],
    sec3Badge: "MADALING GABAY SA 3 MINUTO",
    sec3Title: "Paano Gumawa ng Weekly Class Schedule Online",
    sec3Subtitle: "Madaling proseso para sa walang-aberyang pagpaplano ng semestre.",
    steps: [
      { num: "01", title: "Ilagay ang Subject", desc: "Buksan ang Studio (/app) at i-type ang Course Code at Pangalan ng Klase." },
      { num: "02", title: "Piliin ang Araw", desc: "I-click ang mga pill tulad ng [ M ] [ W ] [ F ] sa isang pindot lang." },
      { num: "03", title: "I-check ang Oras", desc: "Awtomatikong sinusuri ng tool kung may banggaan sa oras ng klase." },
      { num: "04", title: "I-export ang Iskedyul", desc: "I-download bilang .ICS file para sa Google Calendar o printable PDF." }
    ],
    sec4Badge: "LIBRENG TEMPLATES",
    sec4Title: "Mga Template ng Iskedyul na Pwedeng Baguhin at I-print",
    sec4Subtitle: "Iba't ibang format na akma para sa estudyante.",
    templates: [
      { title: "Printable PDF Template", desc: "Malinis na black and white format na sukat sa A4 o Letter paper para sa binder.", cta: "Gumawa ng PDF" },
      { title: "Excel at Google Sheets Template", desc: "Table format na may awtomatikong total ng units at contact hours.", cta: "Gumawa ng Spreadsheet" },
      { title: "Phone Lock Screen Wallpaper (PNG)", desc: "Malinaw na larawan para laging kita ang room at oras sa lock screen ng cellphone.", cta: "I-save ang Wallpaper" }
    ],
    tableBadge: "PAGKUKUMPARA • SCHEDULE TOOLS",
    tableTitle: "Paghahambing: Class Schedule Maker vs Ibang Pamamaraan",
    tableSubtitle: "Alamin kung bakit mas pinipili ng mga estudyante ang aming interactive studio kaysa mabagal na portals.",
    tableHeaders: {
      col1: "Kakayahan",
      col2: "Class Schedule Maker",
      col3: "University Portals",
      col4: "Static Excel Sheets",
      col5: "Papel na Planner"
    },
    tableRows: [
      { feature: "Presyo at Account", studio: "100% Libre / Walang Account", portals: "Kailangan ng Login", excel: "Kailangan ng Lisensya", paper: "May Bayad (₱150-₱350)" },
      { feature: "Pagtukoy ng Conflict", studio: "Visual Side-by-Side", portals: "Error Message Lang", excel: "Manu-manong Tinitingnan", paper: "Binubura sa Papel" },
      { feature: "Gap Optimizer (Vacant)", studio: "Built-in Algorithm", portals: "Walang Optimizer", excel: "Walang Optimizer", paper: "Walang Optimizer" },
      { feature: "Calendar Sync", studio: "1 Click (.ICS / Google)", portals: "Bihira o Sira", excel: "Kailangan ng Script", paper: "Hindi Pwede" },
      { feature: "5-Day / 7-Day Switch", studio: "Agad na Nalilipat", portals: "Fixed na Format", excel: "Manu-manong Pag-edit", paper: "Naka-print na Kolum" },
      { feature: "Mobile Touch Support", studio: "Araw-araw na Touch Tabs", portals: "Pang-desktop Lang", excel: "Mabagal Mag-zoom", paper: "Dapat Laging Bitbit" }
    ],
    faqBadge: "MGA KARANIWANG TANONG",
    faqTitle: "Mga Madalas Itanong Tungkol sa Class Schedule Maker",
    faqSubtitle: "Lahat ng kailangan mong malaman tungkol sa kalendaryo, templates, at libreng paggamit.",
    faqs: [
      {
        q: "Ano ang isang class schedule o talaan ng klase?",
        a: "Ang class schedule ay lingguhang talaan na nagpapakita ng mga araw, oras, silid-aralan, at propesor para sa lahat ng subject na kinuha sa semestre."
      },
      {
        q: "Ano ang pinakamagandang libreng online class schedule maker?",
        a: "Ang Class Schedule Maker ang pinakamahusay dahil 100% libre ito, walang kailangang account, awtomatikong iniiwasan ang oras ng conflict, at madaling mai-export sa Google Calendar at PDF."
      },
      {
        q: "Talaga bang libre ito at walang bayad?",
        a: "Oo, libre ang lahat ng feature nang walang subscription o bayad. Ang mga impormasyon ng subject mo ay nananatiling ligtas sa iyong sariling browser."
      },
      {
        q: "Paano idagdag ang iskedyul sa Google Calendar o iPhone?",
        a: "Pindutin ang 'Export .ICS' sa Studio. Buksan ang Google Calendar sa kompyuter, pumunta sa Settings > Import & export, at i-upload ang na-download na file para pumasok ang klase para sa buong semestre."
      },
      {
        q: "Paano makakatulong ang optimizer na bawasan ang mahabang vacant?",
        a: "Sinusuri ng aming algorithm ang mga kombinasyon ng section para pagsamahin ang iyong mga klase sa umaga nang walang nakatambak na bakanteng oras."
      },
      {
        q: "Paano gumagana ang awtomatikong pag-detect ng conflict?",
        a: "Kung may dalawang klase na pareho ang oras, ipinapakita ang mga ito nang magkatabi na may kulay na babala upang maiwasan ang maling pag-enroll."
      },
      {
        q: "Saan makakakuha ng libreng printable template sa PDF at Excel?",
        a: "Sa aming Templates Hub, maaari kang mag-export ng malinis na A4 PDF, Excel/Sheets format, o wallpaper image para sa lock screen ng iyong cellphone."
      },
      {
        q: "Maaari ba akong gumawa ng mock o test schedule bago ang enrollment?",
        a: "Oo! Maraming estudyante ang gumagamit ng aming studio bilang simulator bago magbukas ang opisyal na enrollment portal ng paaralan."
      }
    ],
    footerCtaTitle: "Gumawa ng Iyong Iskedyul sa Loob ng Ilang Segundo",
    footerCtaSubtitle: "Makiisa sa libo-libong estudyanteng nagpaplano ng semestre nang libre at walang aberya.",
    footerCtaBtn: "Buksan ang Libreng Studio →"
  }
};
