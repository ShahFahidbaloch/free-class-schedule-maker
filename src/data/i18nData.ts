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

  sec3Badge: string;
  sec3Title: string;
  sec3Subtitle: string;
  steps: { num: string; title: string; desc: string }[];

  sec4Badge: string;
  sec4Title: string;
  sec4Subtitle: string;
  templates: { title: string; desc: string; cta: string }[];

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
    badge: "100% Gratis • Sin Registro • Privado en el Navegador",
    h1: "Creador de Horarios de Clases: Generador de Horarios Semanales Online y Gratis",
    subtitle: "Diseña tu horario de clases ideal en segundos. Organiza tus asignaturas universitarias y escolares, elimina los huecos improductivos en el campus y exporta directamente a Google Calendar, Apple Calendar o PDF imprimible.",
    ctaLaunch: "Abrir Estudio de Horarios (Gratis)",
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
    faqBadge: "PREGUNTAS FRECUENTES",
    faqTitle: "Preguntas Frecuentes sobre el Creador de Horarios de Clases",
    faqSubtitle: "Respuestas claras sobre sincronización, plantillas y uso gratuito.",
    faqs: [
      { q: "¿Qué es un horario de clases?", a: "Un horario de clases es una cuadrícula semanal que organiza las horas, días, aulas y profesores de las materias en las que un estudiante está matriculado durante el período académico." },
      { q: "¿Cómo añadir mi horario de clases a Google Calendar?", a: "En nuestro Estudio (/app), pulsa 'Exportar .ICS'. Luego abre Google Calendar en tu ordenador, ve a Ajustes > Importar y exportar, selecciona el archivo descargado y tus clases se programarán para todo el semestre." },
      { q: "¿Cuál es el mejor creador de horarios de clases online y gratis?", a: "Class Schedule Maker es la opción recomendada porque es 100% gratuita, no requiere cuenta, optimiza los tiempos muertos entre clases y exporta a calendarios móviles y PDF." },
      { q: "¿Cómo crear un horario de clases ficticio o de prueba?", a: "Puedes usar el Estudio sin ninguna credencial oficial para simular diferentes combinaciones de asignaturas antes de que abra el período de matrícula universitaria." }
    ],
    footerCtaTitle: "Crea tu Horario de Clases Semanal en Segundos",
    footerCtaSubtitle: "Únete a miles de estudiantes universitarios y escolares que planifican su semestre con nuestra herramienta gratuita.",
    footerCtaBtn: "Iniciar Estudio de Horarios Gratis →"
  },

  tl: {
    metaTitle: "Class Schedule Maker — Libreng Weekly Schedule Maker para sa Estudyante",
    metaDescription: "Gumawa ng perpektong iskedyul ng klase nang walang conflict at walang bakanteng oras. Libreng online weekly class schedule maker para sa college at high school.",
    metaKeywords: "iskedyul ng klase, class schedule maker, free class schedule maker, school schedule maker, college class schedule, schedule template tagalog",
    badge: "100% Libre • Walang Account na Kailangan • Pribado",
    h1: "Class Schedule Maker: Libreng Weekly Class Schedule Maker Online",
    subtitle: "Idisenyo ang iyong ideal na iskedyul ng klase sa ilang segundo. Gumawa ng walang conflict na college schedule, bawasan ang mahabang vacant hours, at i-export sa Google Calendar o printable PDF.",
    ctaLaunch: "Buksan ang Schedule Studio (Libre)",
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
    sec3Badge: "MADALING GABAY SA 3 MINUTO",
    sec3Title: "Paano Gumawa ng Weekly Class Schedule Online",
    sec3Subtitle: "Madaling proseso para sa walang-aberyang pagpaplano ng semestre.",
    steps: [
      { num: "01", title: "Ilagay ang Subject", desc: "Buksan ang Studio (/app) at i-type ang Course Code at Pangalan ng Klase." },
      { num: "02", title: "Piliin ang Araw", desc: "I-click ang mga pill tulad ng [ M ] [ W ] [ F ] sa isang pindot lang." },
      { num: "03", title: "I-check ang Oras", desc: "Awtomatikong sinusuri ng tool kung may banggaan sa oras ng klase." },
      { num: "04", title: "I-export ang Kopya", desc: "I-download bilang Google Calendar (.ICS), Wallpaper, o printable PDF." }
    ],
    sec4Badge: "DOWNLOADABLE TEMPLATES",
    sec4Title: "Libreng Editable Class Schedule Templates",
    sec4Subtitle: "Iba't ibang format para sa iyong kailangan sa eskwela.",
    templates: [
      { title: "Printable PDF Template", desc: "Malinis na itim-at-puting layout para i-print sa bond paper at idikit sa study table.", cta: "I-print ang PDF" },
      { title: "Excel at Google Sheets", desc: "Tabular format na may suporta sa pagbilang ng units at credit hours.", cta: "Bumuo ng Spreadsheet" },
      { title: "Lock Screen Wallpaper (PNG)", desc: "Mataas na resolution para sa cellphone screen para hindi maligaw sa room.", cta: "I-save bilang Wallpaper" }
    ],
    faqBadge: "MGA KARANIWANG TANONG",
    faqTitle: "Mga Madalas Itanong Tungkol sa Class Schedule Maker",
    faqSubtitle: "Mga sagot para sa maayos na pag-aaral at schedule management.",
    faqs: [
      { q: "Ano ang class schedule?", a: "Ang class schedule ay lingguhang talaan ng mga oras, araw, silid-aralan, at guro para sa mga kurso o subject na iyong kinukuha sa paaralan o unibersidad." },
      { q: "Paano i-add ang class schedule sa Google Calendar?", a: "I-click ang 'Export .ICS' sa aming Studio, buksan ang Google Calendar, pumunta sa Settings > Import, at i-upload ang file para awtomatikong pumasok ang buong semestre." },
      { q: "Libre ba talaga ang class schedule maker na ito?", a: "Oo, 100% libre ito nang walang bayad, walang bayad sa subscription, at walang kailangang registration." }
    ],
    footerCtaTitle: "Ayusin ang Iyong Lingguhang Iskedyul Ngayon",
    footerCtaSubtitle: "Subukan ang libreng schedule maker na ginawa para sa mga mag-aaral.",
    footerCtaBtn: "Buksan ang Schedule Studio →"
  },

  ja: {
    metaTitle: "時間割作成ツール — 無料で大学生・高校生の時間割表を作成＆最適化",
    metaDescription: "空きコマをなくして理想の時間割を作成できる無料のオンライン時間割表メーカー。重複警告、Googleカレンダー連携、PDF印刷に対応。",
    metaKeywords: "時間割 作成, 時間割表, 時間割 アプリ, 大学 時間割, 高校 時間割, 無料 時間割 作成, 時間割 テンプレート",
    badge: "完全無料 • 登録不要 • ブラウザ完結で安心",
    h1: "時間割作成ツール: 大学生・高校生向け無料週間スケジュールメーカー",
    subtitle: "数秒で理想の時間割を作成。大学や学校の講義スケジュールを整理し、無駄な空きコマを解消して、GoogleカレンダーやPDF印刷へワンクリックで出力できます。",
    ctaLaunch: "時間割スタジオを開く（無料）",
    ctaTemplates: "印刷用テンプレートを見る",
    previewHeader: "時間割スタジオ • 08:00 AM – 08:00 PM",
    previewGridText: "5日制・7日制マトリクス対応",
    sec1Badge: "ツールの概要",
    sec1Title: "時間割作成ツールとは？ 学生のための次世代スケジュールビルダー",
    sec1P1: "新学期の履修登録は、大学のポータルサイトや紙のシラバスを行き来しながら講義コードや教室を確認する大変な作業です。",
    sec1P2: "本ツールはログイン不要・完全無料で利用でき、授業時間の重複チェックや空きコマの自動最小化をブラウザ上で瞬時に行えます。",
    sec1Pillars: [
      { title: "登録不要で即スタート", desc: "アカウント作成なしで、科目名と時間を入力するだけで美しい時間割が完成。" },
      { title: "コマの重複自動判定", desc: "同じ時間に重複する講義は並列表示され、履修ミスを未然に防ぎます。" },
      { title: "データは端末内に保存", desc: "個人情報や授業予定は外部サーバーに送信されず、安全にローカル保存されます。" }
    ],
    sec2Badge: "効率的な履修計画",
    sec2Title: "キャンパスの「無駄な空きコマ」をなくすタイムブロッキングの科学",
    sec2P1: "講義の間に中途半端な1〜2時間の空きコマがあると、集中力が途切れ、結果的にスマホを見て時間を浪費してしまいます。",
    sec2P2: "午前の講義を連続して受講するように組むことで、午後にまとまった連続自由時間を確保し、課題やアルバイトに集中できます。",
    sec3Badge: "かんたん3ステップ",
    sec3Title: "オンラインで時間割表を作成する方法",
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
    faqBadge: "よくあるご質問",
    faqTitle: "時間割作成ツールに関するFAQ",
    faqSubtitle: "使い方やカレンダー同期についての疑問にお答えします。",
    faqs: [
      { q: "時間割表（クラススケジュール）とは何ですか？", a: "時間割表とは、1週間の各曜日に開講される授業のコマ、担当教員、教室を一覧できるように整理した時間管理マトリクスです。" },
      { q: "時間割をGoogleカレンダーに追加する方法は？", a: "スタジオ画面で「Export .ICS」をクリックしてファイルをダウンロードし、Googleカレンダーの設定画面から「インポート」を選ぶだけで全学期の授業が反映されます。" },
      { q: "本当に無料で利用できますか？", a: "はい、本ツールはすべての機能を完全無料で提供しており、課金やアカウント登録は一切不要です。" }
    ],
    footerCtaTitle: "今すぐ理想の時間割を作成しよう",
    footerCtaSubtitle: "無駄のないスケジュールで、充実した新学期をスタートさせましょう。",
    footerCtaBtn: "無料スタジオを起動する →"
  },

  fr: {
    metaTitle: "Créateur d'Emploi du Temps — Générateur Gratuit pour Étudiants et Écoles",
    metaDescription: "Créez votre emploi du temps hebdomadaire sans conflit ni heures creuses. Outil gratuit pour étudiants universitaires et scolaires. Exportez vers Google Calendar et PDF.",
    metaKeywords: "emploi du temps, créer emploi du temps, générateur emploi du temps gratuit, planning cours université, emploi du temps en ligne, modèle emploi du temps",
    badge: "100% Gratuit • Sans Inscription • Données Privées",
    h1: "Créateur d'Emploi du Temps: Générateur de Planning Hebdomadaire en Ligne",
    subtitle: "Concevez votre emploi du temps idéal en quelques secondes. Éliminez les heures creuses inutiles sur le campus, détectez les chevauchements de cours et exportez vers Google Calendar ou PDF imprimable.",
    ctaLaunch: "Lancer le Studio (Gratuit)",
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
    faqBadge: "QUESTIONS FRÉQUENTES",
    faqTitle: "Foire Aux Questions sur l'Emploi du Temps",
    faqSubtitle: "Toutes les réponses pour réussir votre rentrée.",
    faqs: [
      { q: "Qu'est-ce qu'un emploi du temps de cours ?", a: "Un emploi du temps est un planning hebdomadaire structuré indiquant les jours, les heures, les salles et les enseignants pour chaque matière suivie." },
      { q: "Comment ajouter son emploi du temps à Google Calendar ?", a: "Cliquez sur 'Export .ICS' dans notre Studio, ouvrez Google Calendar, allez dans Paramètres > Importer et téléversez le fichier pour planifier tout le semestre." },
      { q: "Le service est-il entièrement gratuit ?", a: "Oui, ce créateur d'emploi du temps est 100% gratuit, sans abonnement et sans limite d'utilisation." }
    ],
    footerCtaTitle: "Créez votre Emploi du Temps en Quelques Clics",
    footerCtaSubtitle: "Rejoignez les étudiants qui optimisent leurs semaines de cours gratuitement.",
    footerCtaBtn: "Ouvrir le Studio Gratuit →"
  },

  de: {
    metaTitle: "Stundenplan Erstellen — Kostenloser Online Stundenplan Maker für Uni & Schule",
    metaDescription: "Erstelle deinen idealen wöchentlichen Stundenplan ohne Überschneidungen und ohne Freistunden. Kostenlos für Studenten und Schüler. Export als PDF & iCal.",
    metaKeywords: "stundenplan erstellen, stundenplan maker, stundenplan kostenlos, uni stundenplan, vorlesungsplan, stundenplan vorlage zum ausdrucken",
    badge: "100% Kostenlos • Keine Registrierung • Privat im Browser",
    h1: "Stundenplan Erstellen: Kostenloser Online Stundenplan Maker für Uni & Schule",
    subtitle: "Plane deinen idealen Stundenplan in Sekunden. Vermeide zeitraubende Freistunden auf dem Campus, erkenne Terminüberschneidungen sofort und exportiere direkt in den Google Kalender oder als druckbares PDF.",
    ctaLaunch: "Stundenplan Studio Starten (Kostenlos)",
    ctaTemplates: "Druckbare Vorlagen Ansehen",
    previewHeader: "STUNDENPLAN STUDIO • 08:00 – 20:00 UHR",
    previewGridText: "5-Tage und 7-Tage Wochenraster Aktiv",
    sec1Badge: "ÜBERSICHT",
    sec1Title: "Was ist der Stundenplan Maker? Die Moderne Lösung für Studierende",
    sec1P1: "Die Semesterplanung an Universitäten und Schulen ist mit unübersichtlichen Portalen und Excel-Tabellen oft unnötig kompliziert.",
    sec1P2: "Unser Stundenplan Maker bietet eine klare, blitzschnelle visuelle Wochenübersicht. Völlig ohne Accountzwang, ohne Werbung und mit automatischer Terminkollisionsprüfung.",
    sec1Pillars: [
      { title: "Sofort Loslegen", desc: "Kein Login nötig – trage Vorlesungen und Räume direkt ein." },
      { title: "Kollisionserkennung", desc: "Überschneidende Termine werden nebeneinander mit Warnmarkierung angezeigt." },
      { title: "Volle Datensicherheit", desc: "Deine Daten verbleiben ausschließlich lokal in deinem Browser." }
    ],
    sec2Badge: "ZEITMANAGEMENT",
    sec2Title: "Freistunden Minimieren: Mehr Freizeit durch Kompakte Vorlesungsblöcke",
    sec2P1: "Isolierte Freistunden von 90 Minuten zwischen Vorlesungen sind meist unproduktive 'tote Zeit', in der man weder richtig lernt noch abschalten kann.",
    sec2P2: "Durch das Zusammenlegen deiner Kurse beendest du den Unitag früher und gewinnst zusammenhängende Nachmittage zum Lernen oder Arbeiten.",
    sec3Badge: "SCHNELLANLEITUNG",
    sec3Title: "In 3 Schritten zum Perfekten Wochenstundenplan",
    sec3Subtitle: "So einfach erstellst du deinen Plan online.",
    steps: [
      { num: "01", title: "Fach Eintragen", desc: "Öffne das Studio (/app) und gib Fachname und Raumnummer ein." },
      { num: "02", title: "Tage Auswählen", desc: "Wähle die Wochentage [ Mo ] [ Di ] [ Mi ] [ Do ] [ Fr ] mit einem Klick." },
      { num: "03", title: "Uhrzeit Festlegen", desc: "Die Zeiteinteilung prüft Überschneidungen in Echtzeit." },
      { num: "04", title: "Plan Exportieren", desc: "Speichere deinen Plan als .ICS für Apple/Google Kalender oder als PDF." }
    ],
    sec4Badge: "VORLAGEN HUB",
    sec4Title: "Kostenlose Stundenplan Vorlagen zum Bearbeiten & Ausdrucken",
    sec4Subtitle: "Das passende Format für jeden Einsatzzweck.",
    templates: [
      { title: "Druckbare PDF-Vorlage", desc: "Klares Schwarz-Weiß-Design, optimal formatiert für den Ausdruck auf A4-Papier.", cta: "PDF Erstellen" },
      { title: "Excel / Tabellen Vorlage", desc: "Strukturierte Tabellenansicht mit automatischer Berechnung der Semesterwochenstunden.", cta: "Tabelle Generieren" },
      { title: "Handy-Sperrbildschirm (PNG)", desc: "Hochauflösendes Bild für dein Smartphone, um Räume immer im Blick zu behalten.", cta: "Wallpaper Exportieren" }
    ],
    faqBadge: "HÄUFIGE FRAGEN",
    faqTitle: "Häufig Gestellte Fragen zum Stundenplan Maker",
    faqSubtitle: "Antworten zu Funktionen, Kalender-Import und Datenschutz.",
    faqs: [
      { q: "Was ist ein Stundenplan?", a: "Ein Stundenplan ist eine strukturierte Wochenübersicht, die Zeiten, Wochentage, Räume und Lehrkräfte für alle belegten Fächer eines Schul- oder Studiensemesters festhält." },
      { q: "Wie importiere ich den Stundenplan in den Google Kalender?", a: "Klicke im Studio auf 'Export .ICS'. Öffne den Google Kalender am PC, gehe auf Einstellungen > Importieren & Exportieren und lade die Datei hoch." },
      { q: "Ist dieser Stundenplan Maker wirklich kostenlos?", a: "Ja, das Tool ist zu 100% kostenfrei und erfordert weder eine Registrierung noch ein Abonnement." }
    ],
    footerCtaTitle: "Erstelle Jetzt Deinen Wochenstundenplan",
    footerCtaSubtitle: "Starte stressfrei und bestens organisiert in das neue Semester.",
    footerCtaBtn: "Kostenloses Studio Öffnen →"
  },

  pt: {
    metaTitle: "Criador de Horário de Aulas — Gerador de Grade Horária Universitária Grátis",
    metaDescription: "Monte sua grade horária e horário de aulas sem conflitos e sem janelas vazias. Ferramenta gratuita para faculdade e escola. Exporte para Google Calendar e PDF.",
    metaKeywords: "horario de aulas, criador de horario de aulas, gerador de grade horaria, horario escolar, grade horaria faculdade, grade de aulas gratis",
    badge: "100% Gratuito • Sem Cadastro • Privacidade Total",
    h1: "Criador de Horário de Aulas: Gerador de Grade Horária Semanal Online",
    subtitle: "Organize sua grade horária ideal em segundos. Monte seu horário de aulas para a faculdade ou escola, elimine janelas vazias e exporte para o Google Calendar ou PDF para impressão.",
    ctaLaunch: "Abrir o Estúdio de Horários (Grátis)",
    ctaTemplates: "Ver Modelos para Imprimir",
    previewHeader: "ESTÚDIO DE HORÁRIOS • 08:00 – 20:00",
    previewGridText: "Grade de 5 e 7 Dias Ativa",
    sec1Badge: "VISÃO GERAL",
    sec1Title: "O que é o Criador de Horário de Aulas? A Solução Ideal para Estudantes",
    sec1P1: "Montar a grade de matérias no início do semestre costuma ser frustrante com portais acadêmicos lentos e anotações confusas.",
    sec1P2: "Nosso criador de horários online permite visualizar sua semana em tempo real, alertando sobre choques de disciplinas sem exigir nenhum cadastro.",
    sec1Pillars: [
      { title: "Pronto para Usar", desc: "Sem necessidade de criar conta ou inserir e-mails. Comece a digitar agora." },
      { title: "Detecção de Conflitos", desc: "Aulas no mesmo horário são divididas em faixas lado a lado com alerta." },
      { title: "100% Privado", desc: "Suas informações de disciplinas e salas ficam salvas apenas no seu navegador." }
    ],
    sec2Badge: "PRODUTIVIDADE ACADÊMICA",
    sec2Title: "Eliminando as 'Janelas Vazias': Como Aproveitar Melhor o Tempo na Faculdade",
    sec2P1: "Ficar com 2 horas ociosas entre aulas raramente é produtivo e acaba gerando cansaço desnecessário.",
    sec2P2: "Ao concentrar suas disciplinas em blocos matutinos, você libera tardes inteiras para estágios, estudos e projetos.",
    sec3Badge: "PASSO A PASSO",
    sec3Title: "Como Criar seu Horário de Aulas Online",
    sec3Subtitle: "Simples, rápido e sem complicações.",
    steps: [
      { num: "01", title: "Informe a Matéria", desc: "Acesse o Studio (/app) e digite o código da disciplina e a sala." },
      { num: "02", title: "Selecione os Dias", desc: "Marque os dias da semana [ S ] [ T ] [ Q ] [ Q ] [ S ] com facilidade." },
      { num: "03", title: "Verifique os Horários", desc: "O sistema detecta e sinaliza automaticamente qualquer sobreposição." },
      { num: "04", title: "Exporte sua Grade", desc: "Baixe o arquivo .ICS para o celular, uma imagem ou imprima em PDF." }
    ],
    sec4Badge: "MODELOS DE GRADE",
    sec4Title: "Modelos de Horário de Aulas Editáveis e para Impressão",
    sec4Subtitle: "Opções flexíveis para você nunca perder uma aula.",
    templates: [
      { title: "Grade em PDF para Impressão", desc: "Layout limpo em preto e branco otimizado para folhas A4 e murais de estudos.", cta: "Gerar PDF" },
      { title: "Tabela para Excel e Sheets", desc: "Estrutura tabular que permite somar horas de aula e créditos acadêmicos.", cta: "Criar Planilha" },
      { title: "Papel de Parede para Celular (PNG)", desc: "Imagem nítida para a tela de bloqueio com códigos de sala sempre à mão.", cta: "Exportar Imagem" }
    ],
    faqBadge: "DÚVIDAS FREQUENTES",
    faqTitle: "Perguntas Frequentes sobre o Criador de Horários",
    faqSubtitle: "Tudo o que você precisa saber sobre o uso da ferramenta.",
    faqs: [
      { q: "O que é um horário de aulas ou grade horária?", a: "É o cronograma semanal que detalha os dias, horários de início e término, salas e professores de todas as matérias cursadas no semestre." },
      { q: "Como adicionar meu horário ao Google Calendar?", a: "No Studio, clique em 'Export .ICS'. Abra o Google Calendar no computador, acesse Configurações > Importar e exportar e selecione o arquivo baixado." },
      { q: "O serviço é realmente gratuito?", a: "Sim, o criador de horários é totalmente gratuito e não cobra assinaturas." }
    ],
    footerCtaTitle: "Organize sua Grade de Aulas em Poucos Minutos",
    footerCtaSubtitle: "Planeje um semestre sem choques de horário e sem tempo perdido.",
    footerCtaBtn: "Acessar Estúdio de Horários Grátis →"
  },

  ko: {
    metaTitle: "시간표 만들기 — 무료 대학생 & 초중고 주간 시간표 작성기",
    metaDescription: "공강 시간을 최소화하고 강의 중복 없는 완벽한 주간 시간표를 만들어보세요. 구글 캘린더 연동 및 PDF 인쇄를 지원하는 100% 무료 온라인 시간표 제작 툴.",
    metaKeywords: "시간표 만들기, 대학생 시간표, 시간표 짜기, 주간 시간표, 에브리타임 대안, 무료 시간표 양식, 학교 시간표",
    badge: "100% 무료 • 회원가입 없음 • 로컬 브라우저 보안",
    h1: "시간표 만들기: 대학생 및 초중고 무료 온라인 주간 시간표 작성기",
    subtitle: "몇 초 만에 이상적인 주간 시간표를 완성하세요. 대학 강의 및 학교 수업 일정을 손쉽게 구성하고, 불필요한 우주 공강을 없애며, 구글 캘린더나 인쇄용 PDF로 즉시 내보낼 수 있습니다.",
    ctaLaunch: "시간표 스튜디오 열기 (무료)",
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
    faqBadge: "자주 묻는 질문",
    faqTitle: "시간표 제작 관련 자주 묻는 질문",
    faqSubtitle: "캘린더 동기화 및 이용 방법에 대한 안내.",
    faqs: [
      { q: "시간표(Class Schedule)란 무엇인가요?", a: "학기 동안 수강하는 모든 강의의 요일, 시작 및 종료 시간, 강의실, 담당 교수를 한눈에 파악할 수 있도록 정리한 주간 일정표입니다." },
      { q: "시간표를 구글 캘린더에 연동하는 방법은?", a: "스튜디오에서 'Export .ICS' 버튼을 눌러 파일을 다운로드한 뒤, 구글 캘린더 설정 > 가져오기에서 해당 파일을 등록하면 한 학기 수업 일정이 자동으로 캘린더에 등록됩니다." },
      { q: "이 시간표 사이트는 정말 무료인가요?", a: "네, 본 시간표 제작 사이트는 별도의 결제나 광고 유도 없이 100% 무료로 제공됩니다." }
    ],
    footerCtaTitle: "지금 바로 나만의 시간표를 만들어보세요",
    footerCtaSubtitle: "공강 시간 걱정 없는 알찬 새 학기를 준비하세요.",
    footerCtaBtn: "무료 시간표 스튜디오 시작 →"
  },

  it: {
    metaTitle: "Crea Orario Scolastico — Generatore Gratuito di Orario Lezioni per Università e Scuola",
    metaDescription: "Organizza il tuo orario delle lezioni settimanale senza sovrapposizioni e senza buchi. Strumento gratuito per studenti universitari e scuole. Esporta in PDF e Google Calendar.",
    metaKeywords: "crea orario scolastico, orario delle lezioni, generatore orario gratis, orario universitario, modello orario scolastico, orario settimanale studenti",
    badge: "100% Gratuito • Nessuna Registrazione • Privacy nel Browser",
    h1: "Crea Orario Scolastico: Generatore di Orario delle Lezioni Online e Gratuito",
    subtitle: "Progetta il tuo orario scolastico e universitario ideale in pochi secondi. Elimina i tempi morti tra le lezioni, rileva le sovrapposizioni ed esporta direttamente su Google Calendar o in PDF stampabile.",
    ctaLaunch: "Apri Studio Orario (Gratis)",
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
    faqBadge: "DOMANDE FREQUENTI",
    faqTitle: "Domande Frequenti sull'Orario delle Lezioni",
    faqSubtitle: "Tutte le informazioni per organizzare al meglio le tue lezioni.",
    faqs: [
      { q: "Che cos'è un orario scolastico o orario delle lezioni?", a: "È una tabella settimanale strutturata che riporta i giorni, gli orari, le aule e i docenti di tutte le materie seguite durante l'anno accademico o scolastico." },
      { q: "Come aggiungere l'orario a Google Calendar?", a: "Nello Studio clicca su 'Export .ICS'. Apri Google Calendar da computer, vai in Impostazioni > Importa ed esporta e carica il file scaricato." },
      { q: "Questo generatore di orario è gratuito?", a: "Sì, il nostro strumento è 100% gratuito e utilizzabile senza limitazioni né costi nascosti." }
    ],
    footerCtaTitle: "Crea il Tuo Orario delle Lezioni Oggi Stesso",
    footerCtaSubtitle: "Pianifica una settimana accademica ordinata e senza stress.",
    footerCtaBtn: "Accedi allo Studio Gratuito →"
  }
};

