export type SupportedLocale = 'en' | 'es' | 'pt' | 'de' | 'fr' | 'it' | 'ja' | 'ko' | 'tl' | 'fil';

export interface LocaleInfo {
  code: SupportedLocale;
  name: string;
  nativeName: string;
  flag: string;
  ogLocale: string;
}

export const LOCALES: Record<string, LocaleInfo> = {
  en: { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸', ogLocale: 'en_US' },
  es: { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', ogLocale: 'es_ES' },
  pt: { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹', ogLocale: 'pt_BR' },
  de: { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', ogLocale: 'de_DE' },
  fr: { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', ogLocale: 'fr_FR' },
  it: { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹', ogLocale: 'it_IT' },
  ja: { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', ogLocale: 'ja_JP' },
  ko: { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷', ogLocale: 'ko_KR' },
  tl: { code: 'tl', name: 'Filipino', nativeName: 'Filipino (PH)', flag: '🇵🇭', ogLocale: 'fil_PH' },
};

export const SUPPORTED_LOCALES_LIST = Object.values(LOCALES);

export interface TranslationDictionary {
  nav: {
    scheduleStudio: string;
    gapOptimization: string;
    registrationStrategy: string;
    templatesHub: string;
    faq: string;
    launchStudio: string;
    backHome: string;
  };
  hero: {
    badge: string;
    h1: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
  matrix: {
    timeHeader: string;
    studioEngine: string;
    gridActive5D: string;
    gridActive7D: string;
    clickToAdd: string;
    dragToReschedule: string;
  };
  days: {
    short: Record<'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun', string>;
    full: Record<'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun', string>;
  };
  metrics: {
    credits: string;
    idleGaps: string;
    conflicts: string;
    conflictFree: string;
    classesEnrolled: string;
  };
  actions: {
    newClass: string;
    tasks: string;
    autoOptimize: string;
    exportHub: string;
    downloadPng: string;
    exportIcs: string;
    printPdf: string;
    feedback: string;
    themeToggle: string;
    resetSchedule: string;
    clearAll: string;
    toggle5D: string;
    toggle7D: string;
  };
  form: {
    modalAddTitle: string;
    modalEditTitle: string;
    modalSubtitleAdd: string;
    modalSubtitleEdit: string;
    courseCode: string;
    courseCodePlaceholder: string;
    courseTitle: string;
    courseTitlePlaceholder: string;
    credits: string;
    creditHours?: string;
    classDays: string;
    startTime: string;
    endTime: string;
    room: string;
    roomPlaceholder: string;
    cardColor: string;
    saveClass: string;
    updateClass: string;
    duplicateClass: string;
    duplicateToOtherDays?: string;
    deleteClass: string;
    cancel: string;
    errorRequiredCode: string;
    errorRequiredDay: string;
    errorEndTime: string;
  };
  tasks: {
    title: string;
    placeholder: string;
    empty: string;
    addBtn: string;
  };
  feedback: {
    title: string;
    subtitle: string;
    categoryLabel: string;
    categories: string[];
    placeholder: string;
    submitBtn: string;
    thankYou: string;
  };
}

export const TRANSLATIONS: Record<SupportedLocale, TranslationDictionary> = {
  en: {
    nav: {
      scheduleStudio: "Schedule Studio",
      gapOptimization: "Gap Optimization",
      registrationStrategy: "Registration Strategy",
      templatesHub: "Templates Hub",
      faq: "FAQ",
      launchStudio: "Launch Schedule Studio",
      backHome: "Back to Home"
    },
    hero: {
      badge: "Free for students • No account needed • 100% Client-Side Private",
      h1: "Build Your Ideal Semester Schedule.",
      subtitle: "Effortlessly map your weekly classes, eliminate wasted campus gaps, and export directly to your calendar.",
      ctaPrimary: "Launch Schedule Studio",
      ctaSecondary: "View Free Schedule Templates"
    },
    matrix: {
      timeHeader: "TIME",
      studioEngine: "ACADEMIC STUDIO • 08:00 AM – 08:00 PM",
      gridActive5D: "5-Day Weekly Grid Active",
      gridActive7D: "7-Day Weekly Grid Active",
      clickToAdd: "Click to add a class at this time",
      dragToReschedule: "Drag to reschedule or click to edit"
    },
    days: {
      short: { Mon: "Mon", Tue: "Tue", Wed: "Wed", Thu: "Thu", Fri: "Fri", Sat: "Sat", Sun: "Sun" },
      full: { Mon: "Monday", Tue: "Tuesday", Wed: "Wednesday", Thu: "Thursday", Fri: "Friday", Sat: "Saturday", Sun: "Sunday" }
    },
    metrics: {
      credits: "Credits",
      idleGaps: "Idle Gaps",
      conflicts: "Conflict(s)",
      conflictFree: "Conflict-Free",
      classesEnrolled: "Classes Enrolled"
    },
    actions: {
      newClass: "+ New Class",
      tasks: "Tasks / Deadlines",
      autoOptimize: "Auto-Optimize",
      exportHub: "Export Hub",
      downloadPng: "Download PNG",
      exportIcs: "Export .ICS",
      printPdf: "Print PDF",
      feedback: "Feedback & Rating",
      themeToggle: "Toggle Theme",
      resetSchedule: "Reset Schedule",
      clearAll: "Clear All",
      toggle5D: "5D (Mon–Fri)",
      toggle7D: "7D (Full Week)"
    },
    form: {
      modalAddTitle: "Add New Class",
      modalEditTitle: "Edit Class Details",
      modalSubtitleAdd: "Fill in course details to slot into timetable",
      modalSubtitleEdit: "Modify timings or duplicate to other days",
      courseCode: "Course Code",
      courseCodePlaceholder: "e.g. CS 301",
      courseTitle: "Course Title (optional)",
      courseTitlePlaceholder: "e.g. Data Structures & Algorithms",
      credits: "Credits",
      classDays: "Class Days (Select all that apply)",
      startTime: "Start Time",
      endTime: "End Time",
      room: "Room / Location",
      roomPlaceholder: "e.g. Turing Hall 101",
      cardColor: "Card Color",
      saveClass: "+ Add Class to Timetable",
      updateClass: "Save Changes",
      duplicateClass: "Duplicate to Tomorrow",
      deleteClass: "Delete Class",
      cancel: "Cancel",
      errorRequiredCode: "Course code is required (e.g. CS 101).",
      errorRequiredDay: "Please select at least one day for this class.",
      errorEndTime: "End time must be later than start time."
    },
    tasks: {
      title: "Academic Tasks & Deadlines",
      placeholder: "Add homework assignment or exam date...",
      empty: "No deadlines recorded yet.",
      addBtn: "Add Task"
    },
    feedback: {
      title: "Student Feedback & Rating",
      subtitle: "How is your schedule planning experience?",
      categoryLabel: "Category",
      categories: ["Feature Request", "Timetable Bug", "Export Issue", "Other"],
      placeholder: "Share your suggestions or report any bugs...",
      submitBtn: "Submit Feedback",
      thankYou: "Thank you for your feedback!"
    }
  },

  es: {
    nav: {
      scheduleStudio: "Estudio de Horarios",
      gapOptimization: "Optimización de Huecos",
      registrationStrategy: "Estrategia de Matrícula",
      templatesHub: "Plantillas",
      faq: "Preguntas Frecuentes",
      launchStudio: "Iniciar Estudio",
      backHome: "Volver al Inicio"
    },
    hero: {
      badge: "Gratis para estudiantes • Sin registro • 100% Privado en tu Navegador",
      h1: "Crea tu Horario de Clases Ideal.",
      subtitle: "Organiza tus asignaturas semanales, elimina los huecos vacíos en el campus y exporta directamente a tu calendario.",
      ctaPrimary: "Iniciar Estudio de Horarios",
      ctaSecondary: "Ver Plantillas Imprimibles"
    },
    matrix: {
      timeHeader: "HORA",
      studioEngine: "ESTUDIO ACADÉMICO • 08:00 – 20:00",
      gridActive5D: "Cuadrícula de 5 Días Activa",
      gridActive7D: "Cuadrícula de 7 Días Activa",
      clickToAdd: "Haz clic para añadir una clase a esta hora",
      dragToReschedule: "Arrastra para reprogramar o haz clic para editar"
    },
    days: {
      short: { Mon: "Lun", Tue: "Mar", Wed: "Mié", Thu: "Jue", Fri: "Vie", Sat: "Sáb", Sun: "Dom" },
      full: { Mon: "Lunes", Tue: "Martes", Wed: "Miércoles", Thu: "Jueves", Fri: "Viernes", Sat: "Sábado", Sun: "Domingo" }
    },
    metrics: {
      credits: "Créditos",
      idleGaps: "Huecos Libres",
      conflicts: "Conflicto(s)",
      conflictFree: "Sin Conflictos",
      classesEnrolled: "Clases Inscritas"
    },
    actions: {
      newClass: "+ Nueva Clase",
      tasks: "Tareas / Fechas Límite",
      autoOptimize: "Auto-Optimizar",
      exportHub: "Exportar Horario",
      downloadPng: "Descargar Imagen PNG",
      exportIcs: "Exportar a Calendario (.ICS)",
      printPdf: "Imprimir en PDF",
      feedback: "Valoración y Feedback",
      themeToggle: "Cambiar Tema",
      resetSchedule: "Reiniciar Horario",
      clearAll: "Borrar Todo",
      toggle5D: "5 Días (Lun–Vie)",
      toggle7D: "7 Días (Semana Completa)"
    },
    form: {
      modalAddTitle: "Añadir Nueva Clase",
      modalEditTitle: "Modificar Detalles de Clase",
      modalSubtitleAdd: "Introduce los datos del curso para ubicarlo en el horario",
      modalSubtitleEdit: "Cambia las horas o duplica a otros días",
      courseCode: "Código de Asignatura",
      courseCodePlaceholder: "ej. MAT 201",
      courseTitle: "Nombre del Curso (opcional)",
      courseTitlePlaceholder: "ej. Cálculo Diferencial",
      credits: "Créditos",
      classDays: "Días de Clase (selecciona todos los que correspondan)",
      startTime: "Hora de Inicio",
      endTime: "Hora de Fin",
      room: "Aula / Edificio",
      roomPlaceholder: "ej. Aula Magna 102",
      cardColor: "Color de Tarjeta",
      saveClass: "+ Añadir Clase al Horario",
      updateClass: "Guardar Cambios",
      duplicateClass: "Duplicar para Mañana",
      deleteClass: "Eliminar Clase",
      cancel: "Cancelar",
      errorRequiredCode: "El código de asignatura es obligatorio.",
      errorRequiredDay: "Selecciona al menos un día para esta clase.",
      errorEndTime: "La hora de fin debe ser posterior a la de inicio."
    },
    tasks: {
      title: "Tareas y Fechas de Exámenes",
      placeholder: "Añadir tarea, entrega o fecha de examen...",
      empty: "No hay tareas registradas aún.",
      addBtn: "Añadir Tarea"
    },
    feedback: {
      title: "Opinión del Estudiante",
      subtitle: "¿Cómo ha sido tu experiencia organizando tu horario?",
      categoryLabel: "Categoría",
      categories: ["Petición de Función", "Error en el Horario", "Problema al Exportar", "Otro"],
      placeholder: "Comparte tus sugerencias o reporta incidencias...",
      submitBtn: "Enviar Opinión",
      thankYou: "¡Gracias por ayudarnos a mejorar!"
    }
  },

  pt: {
    nav: {
      scheduleStudio: "Estúdio de Horários",
      gapOptimization: "Otimizar Janelas",
      registrationStrategy: "Estratégia de Matrícula",
      templatesHub: "Modelos",
      faq: "Perguntas Frequentes",
      launchStudio: "Abrir Estúdio",
      backHome: "Voltar ao Início"
    },
    hero: {
      badge: "Gratuito para estudantes • Sem cadastro • 100% Privado no Navegador",
      h1: "Crie sua Grade Horária Ideal.",
      subtitle: "Organize suas aulas semanais, elimine janelas vazias no campus e exporte diretamente para o seu calendário.",
      ctaPrimary: "Abrir Estúdio de Horários",
      ctaSecondary: "Ver Modelos de Grade"
    },
    matrix: {
      timeHeader: "HORA",
      studioEngine: "ESTÚDIO ACADÊMICO • 08:00 – 20:00",
      gridActive5D: "Grade de 5 Dias Ativa",
      gridActive7D: "Grade de 7 Dias Ativa",
      clickToAdd: "Clique para adicionar uma aula neste horário",
      dragToReschedule: "Arraste para reagendar ou clique para editar"
    },
    days: {
      short: { Mon: "Seg", Tue: "Ter", Wed: "Qua", Thu: "Qui", Fri: "Sex", Sat: "Sáb", Sun: "Dom" },
      full: { Mon: "Segunda-feira", Tue: "Terça-feira", Wed: "Quarta-feira", Thu: "Quinta-feira", Fri: "Sexta-feira", Sat: "Sábado", Sun: "Domingo" }
    },
    metrics: {
      credits: "Créditos",
      idleGaps: "Janelas Livres",
      conflicts: "Conflito(s)",
      conflictFree: "Sem Conflitos",
      classesEnrolled: "Aulas Cadastradas"
    },
    actions: {
      newClass: "+ Nova Aula",
      tasks: "Tarefas / Prazos",
      autoOptimize: "Auto-Otimizar",
      exportHub: "Exportar Grade",
      downloadPng: "Baixar Imagem PNG",
      exportIcs: "Exportar (.ICS)",
      printPdf: "Imprimir PDF",
      feedback: "Avaliação & Feedback",
      themeToggle: "Alternar Tema",
      resetSchedule: "Reiniciar Grade",
      clearAll: "Limpar Tudo",
      toggle5D: "5 Dias (Seg–Sex)",
      toggle7D: "7 Dias (Semana Toda)"
    },
    form: {
      modalAddTitle: "Adicionar Nova Disciplina",
      modalEditTitle: "Editar Horário da Disciplina",
      modalSubtitleAdd: "Preencha as informações para encaixar na grade horária",
      modalSubtitleEdit: "Modifique os horários ou duplique para outros dias",
      courseCode: "Código da Disciplina",
      courseCodePlaceholder: "ex. MAT 101",
      courseTitle: "Nome da Matéria (opcional)",
      courseTitlePlaceholder: "ex. Cálculo Diferencial e Integral",
      credits: "Créditos",
      classDays: "Dias de Aula (selecione todos os aplicáveis)",
      startTime: "Início",
      endTime: "Término",
      room: "Sala / Bloco",
      roomPlaceholder: "ex. Bloco B - Sala 204",
      cardColor: "Cor do Cartão",
      saveClass: "+ Adicionar à Grade",
      updateClass: "Salvar Alterações",
      duplicateClass: "Duplicar para Amanhã",
      deleteClass: "Excluir Aula",
      cancel: "Cancelar",
      errorRequiredCode: "O código da disciplina é obrigatório.",
      errorRequiredDay: "Selecione pelo menos um dia para esta aula.",
      errorEndTime: "O horário de término deve ser posterior ao início."
    },
    tasks: {
      title: "Tarefas Acadêmicas e Provas",
      placeholder: "Adicionar trabalho ou data de prova...",
      empty: "Nenhum prazo cadastrado ainda.",
      addBtn: "Adicionar Tarefa"
    },
    feedback: {
      title: "Feedback do Estudante",
      subtitle: "Como está sendo sua experiência organizando as aulas?",
      categoryLabel: "Categoria",
      categories: ["Sugestão de Recurso", "Erro na Grade", "Problema ao Exportar", "Outro"],
      placeholder: "Deixe seu comentário ou relate problemas...",
      submitBtn: "Enviar Feedback",
      thankYou: "Obrigado por nos ajudar a melhorar!"
    }
  },

  de: {
    nav: {
      scheduleStudio: "Stundenplan Studio",
      gapOptimization: "Freistunden Minimieren",
      registrationStrategy: "Belegungs-Strategie",
      templatesHub: "Vorlagen",
      faq: "FAQ",
      launchStudio: "Studio Starten",
      backHome: "Zur Startseite"
    },
    hero: {
      badge: "Kostenlos für Studierende • Ohne Login • 100% Datenschutz",
      h1: "Plane Deinen Idealen Semesterplan.",
      subtitle: "Erstelle mühelos deinen Wochenstundenplan, vermeide nervige Freistunden auf dem Campus und synchronisiere direkt mit deinem Kalender.",
      ctaPrimary: "Stundenplan Studio Starten",
      ctaSecondary: "Vorlagen Ansehen"
    },
    matrix: {
      timeHeader: "ZEIT",
      studioEngine: "STUDIEN-STUDIO • 08:00 – 20:00 UHR",
      gridActive5D: "5-Tage-Raster Aktiv",
      gridActive7D: "7-Tage-Raster Aktiv",
      clickToAdd: "Klicken, um Veranstaltung hinzuzufügen",
      dragToReschedule: "Ziehen zum Verschieben oder Klicken zum Bearbeiten"
    },
    days: {
      short: { Mon: "Mo", Tue: "Di", Wed: "Mi", Thu: "Do", Fri: "Fr", Sat: "Sa", Sun: "So" },
      full: { Mon: "Montag", Tue: "Dienstag", Wed: "Mittwoch", Thu: "Donnerstag", Fri: "Freitag", Sat: "Samstag", Sun: "Sonntag" }
    },
    metrics: {
      credits: "ECTS / SWS",
      idleGaps: "Freistunden",
      conflicts: "Konflikt(e)",
      conflictFree: "Konfliktfrei",
      classesEnrolled: "Kurse Eingetragen"
    },
    actions: {
      newClass: "+ Neuer Kurs",
      tasks: "Aufgaben / Fristen",
      autoOptimize: "Auto-Optimieren",
      exportHub: "Export Hub",
      downloadPng: "Als Bild (PNG) Herunterladen",
      exportIcs: "Kalenderdatei (.ICS)",
      printPdf: "PDF Drucken",
      feedback: "Feedback & Bewertung",
      themeToggle: "Design Umschalten",
      resetSchedule: "Plan Zurücksetzen",
      clearAll: "Alles Löschen",
      toggle5D: "5 Tage (Mo–Fr)",
      toggle7D: "7 Tage (Ganze Woche)"
    },
    form: {
      modalAddTitle: "Neue Lehrveranstaltung",
      modalEditTitle: "Veranstaltungsdetails Bearbeiten",
      modalSubtitleAdd: "Trage deine Kurszeiten ein, um den Stundenplan zu füllen",
      modalSubtitleEdit: "Zeiten anpassen oder auf Folgetage duplizieren",
      courseCode: "Modul-Kürzel",
      courseCodePlaceholder: "z.B. INF 101",
      courseTitle: "Name der Vorlesung (optional)",
      courseTitlePlaceholder: "z.B. Algorithmen & Datenstrukturen",
      credits: "ECTS-Punkte",
      classDays: "Wochentage (Mehrfachauswahl möglich)",
      startTime: "Beginn",
      endTime: "Ende",
      room: "Hörsaal / Gebäude",
      roomPlaceholder: "z.B. Hörsaal A, Campus Nord",
      cardColor: "Farbcode",
      saveClass: "+ In Stundenplan Eintragen",
      updateClass: "Änderungen Speichern",
      duplicateClass: "Auf Morgen Duplizieren",
      deleteClass: "Kurs Löschen",
      cancel: "Abbrechen",
      errorRequiredCode: "Modulkürzel ist erforderlich.",
      errorRequiredDay: "Bitte wähle mindestens einen Wochentag aus.",
      errorEndTime: "Das Vorlesungsende muss nach dem Beginn liegen."
    },
    tasks: {
      title: "Abgabefristen & Prüfungen",
      placeholder: "Neue Hausarbeit oder Prüfungstermin eintragen...",
      empty: "Noch keine Fristen eingetragen.",
      addBtn: "Aufgabe Hinzufügen"
    },
    feedback: {
      title: "Studentisches Feedback",
      subtitle: "Wie gefällt dir die Stundenplanerstellung?",
      categoryLabel: "Kategorie",
      categories: ["Funktionswunsch", "Fehler im Stundenplan", "Export-Problem", "Sonstiges"],
      placeholder: "Teile uns deine Vorschläge oder Fehler mit...",
      submitBtn: "Feedback Senden",
      thankYou: "Vielen Dank für deine Rückmeldung!"
    }
  },

  fr: {
    nav: {
      scheduleStudio: "Studio Planning",
      gapOptimization: "Optimiser les Creux",
      registrationStrategy: "Stratégie de Rentrée",
      templatesHub: "Modèles",
      faq: "FAQ",
      launchStudio: "Ouvrir le Studio",
      backHome: "Retour Accueil"
    },
    hero: {
      badge: "Gratuit pour étudiants • Sans compte • 100% Confidentiel",
      h1: "Construisez Votre Emploi du Temps Idéal.",
      subtitle: "Planifiez facilement vos cours hebdomadaires, supprimez les heures creuses inutiles et exportez directement vers votre agenda.",
      ctaPrimary: "Lancer le Studio Planning",
      ctaSecondary: "Voir les Modèles Imprimables"
    },
    matrix: {
      timeHeader: "HEURE",
      studioEngine: "STUDIO ACADÉMIQUE • 08:00 – 20:00",
      gridActive5D: "Semaine de 5 Jours Active",
      gridActive7D: "Semaine de 7 Jours Active",
      clickToAdd: "Cliquez pour ajouter un cours à cette heure",
      dragToReschedule: "Glissez pour déplacer ou cliquez pour modifier"
    },
    days: {
      short: { Mon: "Lun", Tue: "Mar", Wed: "Mer", Thu: "Jeu", Fri: "Ven", Sat: "Sam", Sun: "Dim" },
      full: { Mon: "Lundi", Tue: "Mardi", Wed: "Mercredi", Thu: "Jeudi", Fri: "Vendredi", Sat: "Samedi", Sun: "Dimanche" }
    },
    metrics: {
      credits: "Crédits (ECTS)",
      idleGaps: "Heures Creuses",
      conflicts: "Conflit(s)",
      conflictFree: "Sans Conflit",
      classesEnrolled: "Cours Inscrits"
    },
    actions: {
      newClass: "+ Nouveau Cours",
      tasks: "Devoirs & Examens",
      autoOptimize: "Auto-Optimiser",
      exportHub: "Exporter le Planning",
      downloadPng: "Télécharger en PNG",
      exportIcs: "Exporter (.ICS)",
      printPdf: "Imprimer en PDF",
      feedback: "Avis & Retours",
      themeToggle: "Changer de Thème",
      resetSchedule: "Réinitialiser",
      clearAll: "Tout Effacer",
      toggle5D: "5 Jours (Lun–Ven)",
      toggle7D: "7 Jours (Semaine Entière)"
    },
    form: {
      modalAddTitle: "Ajouter un Cours",
      modalEditTitle: "Modifier le Cours",
      modalSubtitleAdd: "Remplissez les détails pour l'insérer dans votre planning",
      modalSubtitleEdit: "Ajustez les créneaux ou dupliquez sur d'autres jours",
      courseCode: "Code Matière",
      courseCodePlaceholder: "ex. MATH 101",
      courseTitle: "Intitulé du Cours (optionnel)",
      courseTitlePlaceholder: "ex. Analyse Mathématique",
      credits: "Crédits",
      classDays: "Jours de Cours (cochez tous les jours applicables)",
      startTime: "Début",
      endTime: "Fin",
      room: "Salle / Bâtiment",
      roomPlaceholder: "ex. Amphi Richelieu",
      cardColor: "Couleur",
      saveClass: "+ Ajouter à l'Emploi du Temps",
      updateClass: "Enregistrer les Modifications",
      duplicateClass: "Dupliquer à Demain",
      deleteClass: "Supprimer le Cours",
      cancel: "Annuler",
      errorRequiredCode: "Le code du cours est obligatoire.",
      errorRequiredDay: "Veuillez sélectionner au moins un jour.",
      errorEndTime: "L'heure de fin doit être postérieure au début."
    },
    tasks: {
      title: "Échéances et Devoirs Universitaires",
      placeholder: "Ajouter un devoir ou une date de partiel...",
      empty: "Aucune échéance enregistrée pour le moment.",
      addBtn: "Ajouter la Tâche"
    },
    feedback: {
      title: "Avis des Étudiants",
      subtitle: "Comment se déroule la création de votre planning ?",
      categoryLabel: "Catégorie",
      categories: ["Suggestion de Fonction", "Bug d'Affichage", "Problème d'Exportation", "Autre"],
      placeholder: "Vos suggestions ou signalements d'erreurs...",
      submitBtn: "Envoyer l'Avis",
      thankYou: "Merci pour votre contribution !"
    }
  },

  it: {
    nav: {
      scheduleStudio: "Studio Orario",
      gapOptimization: "Ottimizza Ore Buche",
      registrationStrategy: "Strategia d'Iscrizione",
      templatesHub: "Modelli",
      faq: "FAQ",
      launchStudio: "Avvia Studio",
      backHome: "Torna alla Home"
    },
    hero: {
      badge: "Gratuito per studenti • Nessun account • 100% Riservato nel Browser",
      h1: "Crea il Tuo Orario delle Lezioni Ideale.",
      subtitle: "Pianifica facilmente i tuoi corsi settimanali, elimina le ore buche universitarie ed esporta direttamente sul tuo calendario.",
      ctaPrimary: "Avvia Studio Orario",
      ctaSecondary: "Vedi Modelli Stampabili"
    },
    matrix: {
      timeHeader: "ORA",
      studioEngine: "STUDIO ACCADEMICO • 08:00 – 20:00",
      gridActive5D: "Griglia Settimanale a 5 Giorni Attiva",
      gridActive7D: "Griglia Settimanale a 7 Giorni Attiva",
      clickToAdd: "Clicca per inserire una lezione a quest'ora",
      dragToReschedule: "Trascina per riprogrammare o clicca per modificare"
    },
    days: {
      short: { Mon: "Lun", Tue: "Mar", Wed: "Mer", Thu: "Gio", Fri: "Ven", Sat: "Sab", Sun: "Dom" },
      full: { Mon: "Lunedì", Tue: "Martedì", Wed: "Mercoledì", Thu: "Giovedì", Fri: "Venerdì", Sat: "Sabato", Sun: "Domenica" }
    },
    metrics: {
      credits: "CFU / Crediti",
      idleGaps: "Ore Buche",
      conflicts: "Conflitto/i",
      conflictFree: "Senza Conflitti",
      classesEnrolled: "Corsi Inseriti"
    },
    actions: {
      newClass: "+ Nuova Lezione",
      tasks: "Compiti & Esami",
      autoOptimize: "Auto-Ottimizza",
      exportHub: "Hub Esportazione",
      downloadPng: "Scarica Immagine PNG",
      exportIcs: "Esporta (.ICS)",
      printPdf: "Stampa PDF",
      feedback: "Feedback & Valutazione",
      themeToggle: "Cambia Tema",
      resetSchedule: "Reimposta Orario",
      clearAll: "Cancella Tutto",
      toggle5D: "5 Giorni (Lun–Ven)",
      toggle7D: "7 Giorni (Settimana Completa)"
    },
    form: {
      modalAddTitle: "Aggiungi Nuova Lezione",
      modalEditTitle: "Modifica Dettagli Lezione",
      modalSubtitleAdd: "Inserisci i dettagli per posizionarla nell'orario settimanale",
      modalSubtitleEdit: "Modifica gli orari o duplica sui giorni seguenti",
      courseCode: "Codice Insegnamento",
      courseCodePlaceholder: "es. MAT 101",
      courseTitle: "Nome del Corso (opzionale)",
      courseTitlePlaceholder: "es. Analisi Matematica I",
      credits: "Crediti (CFU)",
      classDays: "Giorni di Lezione (seleziona tutti i giorni pertinenti)",
      startTime: "Ora Inizio",
      endTime: "Ora Fine",
      room: "Aula / Plesso",
      roomPlaceholder: "es. Aula Magna, Plesso A",
      cardColor: "Colore Scheda",
      saveClass: "+ Inserisci nell'Orario",
      updateClass: "Salva Modifiche",
      duplicateClass: "Duplica per Domani",
      deleteClass: "Elimina Lezione",
      cancel: "Annulla",
      errorRequiredCode: "Il codice corso è obbligatorio.",
      errorRequiredDay: "Seleziona almeno un giorno di lezione.",
      errorEndTime: "L'ora di fine deve essere successiva a quella di inizio."
    },
    tasks: {
      title: "Scadenze Studio ed Esami",
      placeholder: "Aggiungi una data d'esame o consegna saggio...",
      empty: "Nessuna scadenza memorizzata al momento.",
      addBtn: "Aggiungi Scadenza"
    },
    feedback: {
      title: "Feedback Studentesco",
      subtitle: "Come valuti la pianificazione del tuo orario?",
      categoryLabel: "Categoria",
      categories: ["Nuova Funzionalità", "Errore Orario", "Problema Esportazione", "Altro"],
      placeholder: "Condividi suggerimenti o segnala errori...",
      submitBtn: "Invia Feedback",
      thankYou: "Grazie per il tuo prezioso contributo!"
    }
  },

  ja: {
    nav: {
      scheduleStudio: "時間割スタジオ",
      gapOptimization: "空きコマ解消",
      registrationStrategy: "履修計画ガイド",
      templatesHub: "テンプレート",
      faq: "よくある質問",
      launchStudio: "スタジオを起動",
      backHome: "ホームへ戻る"
    },
    hero: {
      badge: "学生向け完全無料 • アカウント不要 • 端末内ローカル完結",
      h1: "理想の学期時間割を作成しよう。",
      subtitle: "授業スケジュールを直感的に配置し、無駄な空きコマをなくして、GoogleカレンダーやPDFへすぐに出力できます。",
      ctaPrimary: "時間割スタジオを開く",
      ctaSecondary: "印刷用テンプレートを見る"
    },
    matrix: {
      timeHeader: "時間",
      studioEngine: "時間割スタジオ • 08:00 – 20:00",
      gridActive5D: "平日5日制グリッド",
      gridActive7D: "全曜日7日制グリッド",
      clickToAdd: "クリックしてこの時間に講義を追加",
      dragToReschedule: "ドラッグして時間変更・クリックで編集"
    },
    days: {
      short: { Mon: "月", Tue: "火", Wed: "水", Thu: "木", Fri: "金", Sat: "土", Sun: "日" },
      full: { Mon: "月曜日", Tue: "火曜日", Wed: "水曜日", Thu: "木曜日", Fri: "金曜日", Sat: "土曜日", Sun: "日曜日" }
    },
    metrics: {
      credits: "単位数",
      idleGaps: "空きコマ時間",
      conflicts: "重複講義",
      conflictFree: "重複なし",
      classesEnrolled: "登録コマ数"
    },
    actions: {
      newClass: "+ 授業を追加",
      tasks: "課題・締切管理",
      autoOptimize: "自動最適化",
      exportHub: "出力メニュー",
      downloadPng: "画像（PNG）で保存",
      exportIcs: "カレンダー連携 (.ICS)",
      printPdf: "PDF印刷",
      feedback: "フィードバック・評価",
      themeToggle: "テーマ切替",
      resetSchedule: "時間割をリセット",
      clearAll: "すべて消去",
      toggle5D: "平日5日",
      toggle7D: "土日含む7日"
    },
    form: {
      modalAddTitle: "新しい講義を追加",
      modalEditTitle: "講義情報の編集",
      modalSubtitleAdd: "講義名や時間を入力して時間割に配置します",
      modalSubtitleEdit: "時間の変更や別曜日への複製ができます",
      courseCode: "科目コード・略称",
      courseCodePlaceholder: "例: CS101, 線形代数",
      courseTitle: "講義正式名（任意）",
      courseTitlePlaceholder: "例: 計算機科学概論",
      credits: "単位数",
      classDays: "受講曜日（複数選択可）",
      startTime: "開始時刻",
      endTime: "終了時刻",
      room: "教室 / 講義室",
      roomPlaceholder: "例: 2号館 301教室",
      cardColor: "カード色",
      saveClass: "+ 時間割に追加",
      updateClass: "変更を保存",
      duplicateClass: "翌日に複製",
      deleteClass: "講義を削除",
      cancel: "キャンセル",
      errorRequiredCode: "科目名またはコードを入力してください。",
      errorRequiredDay: "受講曜日を1つ以上選択してください。",
      errorEndTime: "終了時刻は開始時刻より後に設定してください。"
    },
    tasks: {
      title: "課題・レポート提出期限",
      placeholder: "レポート課題やテスト日程を入力...",
      empty: "登録された締切はありません。",
      addBtn: "課題を追加"
    },
    feedback: {
      title: "学生フィードバック",
      subtitle: "時間割ツールの使い心地はいかがですか？",
      categoryLabel: "カテゴリ",
      categories: ["機能要望", "時間割の不具合", "出力エラー", "その他"],
      placeholder: "ご意見や不具合報告をご自由にご記入ください...",
      submitBtn: "フィードバックを送信",
      thankYou: "ご協力ありがとうございました！"
    }
  },

  ko: {
    nav: {
      scheduleStudio: "시간표 스튜디오",
      gapOptimization: "공강 시간 최적화",
      registrationStrategy: "수강신청 전략",
      templatesHub: "양식 템플릿",
      faq: "자주 묻는 질문",
      launchStudio: "스튜디오 시작",
      backHome: "홈으로 이동"
    },
    hero: {
      badge: "학생 대상 완전 무료 • 가입 불필요 • 100% 로컬 프라이버시",
      h1: "나만의 이상적인 학기 시간표를 만드세요.",
      subtitle: "주간 강의 일정을 손쉽게 배치하고, 낭비되는 우주 공강을 없애며, 캘린더나 인쇄용 PDF로 바로 내보내세요.",
      ctaPrimary: "시간표 스튜디오 시작",
      ctaSecondary: "무료 시간표 양식 보기"
    },
    matrix: {
      timeHeader: "시간",
      studioEngine: "시간표 스튜디오 • 08:00 – 20:00",
      gridActive5D: "주 5일 시간표 활성",
      gridActive7D: "주 7일 시간표 활성",
      clickToAdd: "클릭하여 이 시간에 강의 추가",
      dragToReschedule: "드래그하여 시간 변경 또는 클릭하여 편집"
    },
    days: {
      short: { Mon: "월", Tue: "화", Wed: "수", Thu: "목", Fri: "금", Sat: "토", Sun: "일" },
      full: { Mon: "월요일", Tue: "화요일", Wed: "수요일", Thu: "목요일", Fri: "금요일", Sat: "토요일", Sun: "일요일" }
    },
    metrics: {
      credits: "학점",
      idleGaps: "공강 시간",
      conflicts: "중복 강의",
      conflictFree: "중복 없음",
      classesEnrolled: "등록된 강의"
    },
    actions: {
      newClass: "+ 새 강의 추가",
      tasks: "과제 및 시험 일정",
      autoOptimize: "공강 자동 최적화",
      exportHub: "내보내기 메뉴",
      downloadPng: "PNG 이미지 다운로드",
      exportIcs: "캘린더 연동 (.ICS)",
      printPdf: "PDF 인쇄",
      feedback: "평가 및 피드백",
      themeToggle: "테마 전환",
      resetSchedule: "시간표 초기화",
      clearAll: "전체 삭제",
      toggle5D: "주 5일 (월–금)",
      toggle7D: "주 7일 (전체 요일)"
    },
    form: {
      modalAddTitle: "새 강의 추가",
      modalEditTitle: "강의 정보 수정",
      modalSubtitleAdd: "강의 시간과 정보를 입력하여 시간표에 등록하세요",
      modalSubtitleEdit: "시간을 변경하거나 다른 요일로 복제할 수 있습니다",
      courseCode: "과목 코드 / 명칭",
      courseCodePlaceholder: "예: CS101, 전산학개론",
      courseTitle: "강의 정식 명칭 (선택)",
      courseTitlePlaceholder: "예: 자료구조 및 알고리즘",
      credits: "학점",
      classDays: "수강 요일 (해당 요일 모두 선택)",
      startTime: "시작 시간",
      endTime: "종료 시간",
      room: "강의실 / 건물",
      roomPlaceholder: "예: 공학관 302호",
      cardColor: "카드 색상",
      saveClass: "+ 시간표에 강의 등록",
      updateClass: "변경사항 저장",
      duplicateClass: "내일로 복제",
      deleteClass: "강의 삭제",
      cancel: "취소",
      errorRequiredCode: "과목명을 입력해 주세요.",
      errorRequiredDay: "수강 요일을 하나 이상 선택해 주세요.",
      errorEndTime: "종료 시간은 시작 시간보다 늦어야 합니다."
    },
    tasks: {
      title: "학업 과제 및 시험 마감일",
      placeholder: "과제 제출일이나 시험 일정을 입력하세요...",
      empty: "등록된 일정이 없습니다.",
      addBtn: "일정 추가"
    },
    feedback: {
      title: "학생 피드백 및 만족도",
      subtitle: "시간표 작성 경험은 어떠셨나요?",
      categoryLabel: "분류",
      categories: ["기능 제안", "시간표 버그", "내보내기 문제", "기타"],
      placeholder: "의견이나 오류 내용을 자유롭게 남겨주세요...",
      submitBtn: "피드백 제출",
      thankYou: "피드백을 남겨주셔서 감사합니다!"
    }
  },

  fil: {
    nav: {
      scheduleStudio: "Schedule Studio",
      gapOptimization: "Bawasan ang Vacant",
      registrationStrategy: "Gabay sa Enrollment",
      templatesHub: "Mga Template",
      faq: "Mga Tanong (FAQ)",
      launchStudio: "Buksan ang Studio",
      backHome: "Bumalik sa Home"
    },
    hero: {
      badge: "Libre para sa mag-aaral • Walang account • 100% Pribado sa Browser",
      h1: "Buuin ang Iyong Ideal na Iskedyul.",
      subtitle: "Madaling ayusin ang iyong mga klase bawat linggo, alisin ang mga sayang na vacant hours, at i-sync direkta sa iyong kalendaryo.",
      ctaPrimary: "Buksan ang Schedule Studio",
      ctaSecondary: "Tingnan ang Libreng Templates"
    },
    matrix: {
      timeHeader: "ORAS",
      studioEngine: "SCHEDULE STUDIO • 08:00 AM – 08:00 PM",
      gridActive5D: "5-Araw na Lingguhang Grid Aktibo",
      gridActive7D: "7-Araw na Lingguhang Grid Aktibo",
      clickToAdd: "I-click para magdagdag ng klase sa oras na ito",
      dragToReschedule: "I-drag para ilipat o i-click para i-edit"
    },
    days: {
      short: { Mon: "Lun", Tue: "Mar", Wed: "Miy", Thu: "Huw", Fri: "Biy", Sat: "Sab", Sun: "Lin" },
      full: { Mon: "Lunes", Tue: "Martes", Wed: "Miyerkules", Thu: "Huwebes", Fri: "Biyernes", Sat: "Sabado", Sun: "Linggo" }
    },
    metrics: {
      credits: "Units",
      idleGaps: "Bakanteng Oras",
      conflicts: "Conflict(s)",
      conflictFree: "Walang Conflict",
      classesEnrolled: "Naka-enroll na Klase"
    },
    actions: {
      newClass: "+ Bagong Klase",
      tasks: "Gawain / Deadlines",
      autoOptimize: "Auto-Optimize",
      exportHub: "Export Menu",
      downloadPng: "I-download bilang PNG",
      exportIcs: "I-export sa Kalendaryo (.ICS)",
      printPdf: "I-print bilang PDF",
      feedback: "Rating & Feedback",
      themeToggle: "Palitan ang Tema",
      resetSchedule: "I-reset ang Iskedyul",
      clearAll: "Burahin Lahat",
      toggle5D: "5 Araw (Lun–Biy)",
      toggle7D: "7 Araw (Buong Linggo)"
    },
    form: {
      modalAddTitle: "Magdagdag ng Bagong Klase",
      modalEditTitle: "Baguhin ang Detalye ng Klase",
      modalSubtitleAdd: "Ilagay ang detalye ng kurso para mai-plot sa schedule",
      modalSubtitleEdit: "Palitan ang oras o kopyahin sa ibang araw",
      courseCode: "Course Code",
      courseCodePlaceholder: "hal. ENG 101",
      courseTitle: "Pangalan ng Klase (opsyonal)",
      courseTitlePlaceholder: "hal. Purposive Communication",
      credits: "Units",
      classDays: "Mga Araw ng Klase (piliin lahat ng angkop)",
      startTime: "Oras ng Simula",
      endTime: "Oras ng Pagtatapos",
      room: "Kuwarto / Gusali",
      roomPlaceholder: "hal. Rm 204, Main Hall",
      cardColor: "Kulay ng Card",
      saveClass: "+ Ilagay sa Iskedyul",
      updateClass: "I-save ang Pagbabago",
      duplicateClass: "Kopyahin Para Bukas",
      deleteClass: "Tanggalin ang Klase",
      cancel: "Kanselahin",
      errorRequiredCode: "Kailangan ang course code.",
      errorRequiredDay: "Pumili ng kahit isang araw para sa klase.",
      errorEndTime: "Dapat mas huli ang oras ng pagtatapos kaysa simula."
    },
    tasks: {
      title: "Mga Gawain at Exam Deadlines",
      placeholder: "Maglagay ng assignment o petsa ng exam...",
      empty: "Wala pang nakatalang gawain.",
      addBtn: "Magdagdag ng Task"
    },
    feedback: {
      title: "Feedback ng Estudyante",
      subtitle: "Kamusta ang iyong karanasan sa pag-iskedyul?",
      categoryLabel: "Kategorya",
      categories: ["Hiling na Feature", "Bug sa Iskedyul", "Problema sa Export", "Iba pa"],
      placeholder: "Ibahagi ang iyong mungkahi o mag-report ng problema...",
      submitBtn: "Ipadala ang Feedback",
      thankYou: "Salamat sa iyong tulong upang mapaganda ang serbisyo!"
    }
  }
};

// Aliases for compatibility
(TRANSLATIONS as any)['tl'] = TRANSLATIONS['fil'];
(TRANSLATIONS as any)['fil'] = TRANSLATIONS['fil'];

export function getTranslations(lang?: string): TranslationDictionary {
  if (!lang) return TRANSLATIONS.en;
  const normalized = lang.toLowerCase();
  return (TRANSLATIONS as any)[normalized] || TRANSLATIONS.en;
}
