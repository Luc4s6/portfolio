/* ==========================================================================
   PORTFOLIO LOGIC & REACTIVITY (VUE 3 CDN) - LUCAS ORTIZ
   ========================================================================== */

const { createApp, ref, computed, onMounted, nextTick } = Vue;

// CONFIGURACIÓN: Obtén tu clave gratuita en https://web3forms.com/ y colócala aquí.
// Si no se coloca una clave válida, el formulario usará automáticamente un fallback a 'mailto:'.
const WEB3FORMS_ACCESS_KEY = '36e2dd70-db76-4aaf-92ce-642496c5c104';

createApp({
    setup() {
        // --- 1. STATE VARIABLES ---
        const currentMode = ref('hybrid');
        const isScrolled = ref(false);
        const isMobileMenuOpen = ref(false);
        const showBackToTop = ref(false);

        // Sandbox Tabs
        const sandboxTab = ref('console');
        const consoleSubTab = ref('terminal');
        const gasSubTab = ref('asistencia');
        const gasTerminalLines = ref(['# Consola GAS limpia. Presiona "Ejecutar" para iniciar la simulación.']);
        const gasTerminalRunning = ref(false);

        // Terminal Simulation State
        const terminalLines = ref(['# Consola limpia. Presiona "Ejecutar Script" para iniciar.']);
        const terminalRunning = ref(false);
        const copiedCode = ref(false);

        // Dashboard Interactive State
        const activeFilter = ref('all');
        const dashboardUpdating = ref(false);

        // Dynamic Modal State
        const activeProject = ref(null);
        let previousActiveElement = null;

        // Contact Form State
        const formData = ref({ name: '', email: '', subject: '', message: '' });
        const formSending = ref(false);
        const formStatus = ref({ message: '', type: '' });

        // --- 2. STRUCTURED DATA ---

        // Projects List (Case Studies)
        const projects = [
            {
                id: 'seguimiento',
                category: 'data',
                badgeText: 'Datos & SQL',
                icon: 'fa-solid fa-magnifying-glass-chart',
                title: 'Sistema de Seguimiento Operativo',
                shortDesc: 'Sistema diseñado para centralizar y monitorear indicadores de gestión. Cuenta con una sólida base de datos relacional y tableros automatizados para la toma de decisiones.',
                tags: ['SQL Server', 'Python', 'Excel', 'Automatización'],
                role: 'Desarrollador de Datos & Automatizador',
                context: 'Proyecto Particular (Privado)',
                techList: 'SQL / T-SQL, Python, Excel Integrado',
                challenge: 'El cliente realizaba el seguimiento de sus incidentes y llamadas de soporte de forma manual o dispersa en múltiples planillas, provocando desvíos en el tiempo de resolución y dificultades para consolidar métricas unificadas.',
                solution: 'Diseñé un esquema de base de datos relacional para centralizar todas las llamadas, alertas e incidentes históricos. Luego implementé un flujo que captura datos de diversas fuentes y los unifica mediante consultas optimizadas (SQL/T-SQL), disponibilizándolos para generar reportes automatizados.',
                diagram: {
                    title: 'Arquitectura de Flujo de Datos',
                    nodes: [
                        { label: 'Fuentes Soporte', highlight: false },
                        { label: 'Querys SQL & DB', highlight: true },
                        { label: 'Reportes Auto', highlight: false }
                    ]
                },
                bullets: [
                    '<strong>Centralización del 100%</strong> de los incidentes en un único repositorio relacional.',
                    'Reducción del tiempo de consolidación mensual de <strong>8 horas a 5 minutos</strong>.',
                    'Optimización de consultas SQL capaz de procesar miles de registros en milisegundos.'
                ]
            },
            {
                id: 'turnero',
                category: 'dev',
                badgeText: 'Desarrollo Web',
                icon: 'fa-regular fa-calendar-check',
                title: 'Turnero Inteligente & Agenda',
                shortDesc: 'Aplicación web responsive para la gestión de turnos y agendas comerciales. Optimiza la experiencia del cliente y la organización del personal en tiempo real.',
                tags: ['Vue.js', 'JavaScript', 'Node.js', 'API REST'],
                role: 'Desarrollador Full-Stack (Freelance)',
                context: 'Solución Comercial Particular',
                techList: 'Vue.js, JavaScript, Node.js, REST API',
                challenge: 'Un comercio local necesitaba un sistema ágil y sin complicaciones para permitir que sus clientes reserven turnos en línea, evitando el cuello de botella telefónico y las superposiciones horarias del personal.',
                solution: 'Desarrollé una SPA (Single Page Application) responsiva usando Vue.js. La interfaz de usuario es altamente intuitiva y está adaptada para dispositivos móviles. Cuenta con validación de horarios disponibles del lado del cliente, y una API de comunicación asíncrona para guardar y actualizar las reservas en tiempo real de forma segura.',
                diagram: {
                    title: 'Arquitectura del Sistema de Turnos',
                    nodes: [
                        { label: 'Cliente (Vue.js)', highlight: true },
                        { label: 'API Node.js', highlight: false },
                        { label: 'Módulo Validación', highlight: true }
                    ]
                },
                bullets: [
                    '<strong>Interfaz reactiva</strong> de carga ultra-rápida construida con arquitectura de componentes.',
                    'Reducción del <strong>70% en llamadas entrantes</strong> para reservas.',
                    'Cero incidencias por turnos duplicados gracias a validaciones basadas en intervalos dinámicos.'
                ]
            },
            {
                id: 'organizador',
                category: 'dev',
                badgeText: 'Scripting & APIs',
                icon: 'fa-solid fa-gears',
                title: 'Organizador y Automatizador de Flujos',
                shortDesc: 'Suite de scripts programados en Python y Google Apps Script que integran múltiples APIs externas para eliminar tareas manuales y optimizar el flujo diario.',
                tags: ['Python', 'Google Apps Script', 'APIs', 'JSON'],
                role: 'Desarrollador de Backend & Integrador',
                context: 'Proyecto Particular Especial',
                techList: 'Python, Google Apps Script, REST Webhooks',
                challenge: 'El equipo perdía valiosas horas diarias sincronizando datos entre correos electrónicos de clientes, planillas de cálculo de control y sistemas de mensajería para asignar tareas y realizar el seguimiento de pedidos.',
                solution: 'Diseñé una red de integraciones ligeras pero potentes. Utilizando Google Apps Script (GAS) para interceptar correos de entrada específicos, automatizar la creación de filas en planillas maestras, y despachar alertas a canales operativos de mensajería por webhooks. Adicionalmente, programé un script en Python que realiza tareas periódicas de limpieza, validación de estructura de datos JSON y generación de alertas por correo.',
                diagram: {
                    title: 'Flujo de Integración de Servicios',
                    nodes: [
                        { label: 'Correo Entrada', highlight: false },
                        { label: 'Trigger GAS', highlight: true },
                        { label: 'API / Webhook', highlight: false },
                        { label: 'Limpiador Python', highlight: true }
                    ]
                },
                bullets: [
                    '<strong>Ahorro de 12 horas semanales</strong> en tareas administrativas repetitivas.',
                    'Eliminación de errores de carga manual de datos en un 100%.',
                    'Notificaciones instantáneas enviadas a los coordinadores al detectar un caso crítico.'
                ]
            },
            {
                id: 'dashboard',
                category: 'data',
                badgeText: 'BI & Analítica',
                icon: 'fa-solid fa-chart-line',
                title: 'Tableros de Control de Rendimiento',
                shortDesc: 'Modelado avanzado de datos y creación de reportes estratégicos (BI) enfocados en optimizar la conversión, auditar SLAs comerciales y corregir desvíos.',
                tags: ['Power BI', 'SQL Server', 'ETL', 'Data Analytics'],
                role: 'Auxiliar de Analista LOB',
                context: 'Gestión en Apex América',
                techList: 'Power BI, DAX, SQL Server, Excel Avanzado',
                challenge: 'La línea de negocio carecía de visualizaciones centralizadas para monitorear las métricas estratégicas clave en tiempo real, lo que impedía que los coordinadores identifiquen desvíos en SLAs de atención a clientes y métricas de conversión comercial a tiempo.',
                solution: 'Modelé bases de datos operativas mediante procesos ETL (Extracción, Transformación y Carga) para unificar la información. Creé medidas complejas en DAX para calcular porcentajes de cumplimiento dinámicos y diseñé un conjunto de tableros ejecutivos interactivos en Power BI.',
                bullets: [
                    'Dashboard interactivo utilizado diariamente por coordinadores para monitorear el desempeño operativo.',
                    'Reducción del <strong>15% en desvíos de objetivos mensuales</strong> gracias a la visualización proactiva.',
                    'Diseño premium enfocado en lectura ejecutiva rápida y cómoda navegación de indicadores.'
                ]
            },
            {
                id: 'asistencia',
                category: 'dev',
                badgeText: 'GAS & APIs',
                icon: 'fa-solid fa-fingerprint',
                title: 'Sistema de Control de Asistencia',
                shortDesc: 'Aplicación GAS completa para controlar ingresos y egresos de profesionales mediante un reloj biométrico HK-T320, con dashboards por rol y envío automático de recordatorios.',
                tags: ['Google Apps Script', 'Hikvision API', 'Google Sheets', 'HTML/CSS'],
                role: 'Desarrollador GAS Full-Stack',
                context: 'Centro de Día (Proyecto Particular)',
                techList: 'Google Apps Script, Hikvision API, Google Sheets API, HTML Templates',
                challenge: 'Un centro de día necesitaba controlar el ingreso puntual de sus profesionales. El proceso era manual (planilla en papel), generaba registros incompletos y no permitía auditar ausencias ni llegadas tarde de forma sistemática.',
                solution: 'Desarrollé una aplicación web completa en Google Apps Script que se conecta a un reloj biométrico HK-T320 mediante la API de Hikvision. El sistema captura las fichadas del dispositivo, las procesa automáticamente para identificar la primera entrada y la última salida de cada profesional, y las compara contra sus horarios asignados. Incluye dashboards diferenciados por rol (admin/profesional), gestión de justificaciones con workflow de aprobación, y envío automático de recordatorios por email.',
                diagram: {
                    title: 'Arquitectura del Sistema de Asistencia',
                    nodes: [
                        { label: 'Reloj HK-T320', highlight: false },
                        { label: 'Hikvision API', highlight: true },
                        { label: 'GAS Backend', highlight: true },
                        { label: 'Google Sheets', highlight: false },
                        { label: 'Dashboard Web', highlight: true }
                    ]
                },
                bullets: [
                    '<strong>Eliminación del 100%</strong> de los registros manuales en papel.',
                    'Detección automática de llegadas tarde y ausencias con <strong>tolerancia configurable</strong>.',
                    'Reducción del tiempo de auditoría mensual de <strong>6 horas a 3 minutos</strong>.',
                    'Envío automático de recordatorios por email el día 27 de cada mes con faltas pendientes de justificar.'
                ]
            },
            {
                id: 'organizador-gas',
                category: 'dev',
                badgeText: 'GAS & Vue.js',
                icon: 'fa-solid fa-table-columns',
                title: 'Organizador Institucional Multi-Módulo',
                shortDesc: 'Plataforma SPA premium desarrollada con Vue.js sobre GAS que centraliza calendario, concurrentes, profesionales, reuniones de gabinete, altas/admisiones y acceso a Drive.',
                tags: ['Vue.js', 'Google Apps Script', 'Google Drive API', 'Sheets'],
                role: 'Desarrollador Full-Stack & Arquitecto',
                context: 'Gestión Institucional (Proyecto Particular)',
                techList: 'Vue.js (CDN), Google Apps Script, Google Sheets, Google Drive API',
                challenge: 'La institución gestionaba toda su operativa diaria en múltiples planillas Excel y carpetas dispersas en Drive. No existía un sistema unificado para consultar el calendario, registrar reuniones de gabinete, dar seguimiento a altas de pacientes ni acceder rápidamente a legajos de profesionales.',
                solution: 'Diseñé una SPA modular con Vue.js que corre sobre Google Apps Script. La arquitectura usa llamadas RPC (google.script.run) para leer/escribir en Google Sheets como base de datos, con fallback a LocalStorage para desarrollo local. Incluye 10+ módulos: Calendario Anual, Concurrentes, Profesionales, Altas/Admisiones, Gabinete, Coordinación, Habilitaciones, y un sistema de archivos que permite navegar carpetas de Drive sin salir de la aplicación.',
                diagram: {
                    title: 'Arquitectura SPA sobre GAS',
                    nodes: [
                        { label: 'Vue.js SPA', highlight: true },
                        { label: 'RPC (google.script.run)', highlight: false },
                        { label: 'Code.gs', highlight: true },
                        { label: 'Google Sheets', highlight: false },
                        { label: 'Google Drive', highlight: true }
                    ]
                },
                bullets: [
                    '<strong>10+ módulos funcionales</strong> integrados en una única interfaz web.',
                    'Compilador personalizado (build-gas.js) que empaqueta JS/CSS en Base64 para GAS.',
                    'Acceso directo a legajos y carpetas de Drive <strong>sin salir de la aplicación</strong>.',
                    'Reducción del 80% del tiempo administrativo diario para coordinación.'
                ]
            },
            {
                id: 'wsp-masivo',
                category: 'dev',
                badgeText: 'Automatización',
                icon: 'fa-brands fa-whatsapp',
                title: 'Automatización de Envíos Masivos (WhatsApp)',
                shortDesc: 'Sistema de envío masivo de mensajes personalizados por WhatsApp Web usando Selenium, con control de lotes, personalización por variables dinámicas y logging de estados.',
                tags: ['Python', 'Selenium', 'WhatsApp Web', 'Google Sheets'],
                role: 'Desarrollador de Automatización',
                context: 'Herramienta Interna (Proyecto Particular)',
                techList: 'Python, Selenium WebDriver, Google Sheets API, WhatsApp Web',
                challenge: 'Se necesitaba enviar cientos de mensajes personalizados por WhatsApp (notificaciones, recordatorios, comunicados) de forma masiva pero simulando comportamiento humano para evitar bloqueos de la plataforma.',
                solution: 'Desarrollé un sistema en Python con Selenium que automatiza agentes de WhatsApp Web. El script lee una planilla de Google Sheets con los destinatarios y variables dinámicas (nombre, monto, fecha), personaliza cada mensaje, y los despacha en lotes controlados con delays aleatorios que replican el comportamiento humano. Incluye logging de estado por contacto y reintentos automáticos ante fallos de envío.',
                diagram: {
                    title: 'Pipeline de Envío Masivo',
                    nodes: [
                        { label: 'Google Sheets', highlight: false },
                        { label: 'Python Script', highlight: true },
                        { label: 'Selenium Agent', highlight: true },
                        { label: 'WhatsApp Web', highlight: false },
                        { label: 'Log de Envíos', highlight: false }
                    ]
                },
                bullets: [
                    'Envío de <strong>500+ mensajes personalizados</strong> en una sola ejecución.',
                    'Delays aleatorios y rotación de agentes para <strong>emular comportamiento humano</strong>.',
                    'Tasa de entrega del <strong>98%</strong> sin bloqueos de la plataforma.',
                    'Proceso que tomaba 4+ horas manualmente reducido a <strong>20 minutos automatizados</strong>.'
                ]
            }
        ];

        // Experience List
        const experience = [
            {
                id: 'freelance',
                category: 'dev',
                date: '2025 - Presente',
                title: 'Desarrollador de Software Freelance',
                org: 'Trabajos Particulares',
                desc: 'Diseño, desarrollo y despliegue de soluciones a medida. Programación de scripts y automatizaciones en JS (Vue.js) y Python. Integración de bases de datos y APIs externas para optimizar flujos de trabajo operativos.'
            },
            {
                id: 'lob',
                category: 'data',
                date: '2025 - Presente',
                title: 'Auxiliar de Analista LOB (Línea de Negocio)',
                org: 'Apex América (Claro Corporativo)',
                desc: 'Optimización de métricas de negocio para la toma de decisiones estratégicas. Diseño, modelado y mantenimiento de tableros de control avanzados y reportes de rendimiento operativo para clientes corporativos de telecomunicaciones.'
            },
            {
                id: 'soporte',
                category: 'tech',
                date: '2023 - Presente',
                title: 'Soporte Técnico (Cloud y Móvil)',
                org: 'Apex América (Claro Corporativo)',
                desc: 'Resolución de incidencias complejas en plataformas cloud y líneas móviles corporativas. Diagnóstico de fallos técnicos, escalados avanzados y atención a clientes empresariales.'
            }
        ];

        // Education List
        const education = [
            {
                id: 'utn',
                date: '2021 - Presente',
                title: 'Ingeniería en Sistemas de Información',
                org: 'Universidad Tecnológica Nacional (UTN)',
                desc: 'Cursando materias avanzadas sobre bases de datos relacionales, estructuras de datos, arquitectura de redes, ingeniería de requisitos, metodologías de desarrollo y administración de recursos de TI.'
            },
            {
                id: 'sanjose',
                date: '2015 - 2020',
                title: 'Bachillerato en Agro y Ambiente',
                org: 'Instituto San José Artesano',
                desc: 'Formación secundaria orientada al cuidado del ambiente, administración rural básica y resolución de problemas metodológicos prácticos.'
            }
        ];

        // Mock BI Dashboard Dataset
        const dashboardDataset = {
            all: {
                kpis: { conv: '4.8%', ef: '94.2%', sla: '98.7%' },
                trends: { conv: '<i class="fa-solid fa-arrow-trend-up"></i> +0.6%', ef: '<i class="fa-solid fa-arrow-trend-up"></i> +1.2%', sla: '<i class="fa-solid fa-arrow-trend-down"></i> -0.1%' },
                bars: [{ h: 80 }, { h: 100 }, { h: 60 }, { h: 110 }, { h: 85 }],
                pie: 'conic-gradient(#ffffff 0% 45%, #71717a 45% 80%, #27272a 80% 100%)',
                title: 'Rendimiento Semanal (Volumen de Operaciones)',
                percentages: { api: '45', gas: '35', manual: '20' }
            },
            api: {
                kpis: { conv: '5.6%', ef: '96.8%', sla: '99.1%' },
                trends: { conv: '<i class="fa-solid fa-arrow-trend-up"></i> +1.1%', ef: '<i class="fa-solid fa-arrow-trend-up"></i> +1.8%', sla: '<i class="fa-solid fa-arrow-trend-up"></i> +0.3%' },
                bars: [{ h: 55 }, { h: 65 }, { h: 40 }, { h: 85 }, { h: 60 }],
                pie: 'conic-gradient(#ffffff 0% 100%)',
                title: 'Volumen Semanal - Canal API Web (Dato Filtrado)',
                percentages: { api: '100', gas: '0', manual: '0' }
            },
            gas: {
                kpis: { conv: '3.9%', ef: '91.2%', sla: '97.8%' },
                trends: { conv: '<i class="fa-solid fa-arrow-trend-down"></i> -0.3%', ef: '<i class="fa-solid fa-arrow-trend-down"></i> -0.5%', sla: '<i class="fa-solid fa-arrow-trend-down"></i> -0.4%' },
                bars: [{ h: 30 }, { h: 45 }, { h: 25 }, { h: 50 }, { h: 35 }],
                pie: 'conic-gradient(#71717a 0% 100%)',
                title: 'Volumen Semanal - Canal Integración GAS (Dato Filtrado)',
                percentages: { api: '0', gas: '100', manual: '0' }
            }
        };

        // Store original dashboard base values for non-accumulative refresh
        const dashboardBaseValues = JSON.parse(JSON.stringify(dashboardDataset));

        // --- 3. COMPUTED PROPERTIES (REACTIVE UI TEXTS) ---

        const badgeText = computed(() => {
            if (currentMode.value === 'hybrid') return 'Disponible para nuevos desafíos';
            if (currentMode.value === 'dev') return 'Enfoque: Frontend, Backend e Integraciones';
            if (currentMode.value === 'data') return 'Enfoque: SQL, BI, Automatizaciones y Estrategia';
            return '';
        });

        const descriptionText = computed(() => {
            if (currentMode.value === 'hybrid') return 'Estudiante de Ingeniería en Sistemas especializado en el desarrollo de soluciones a medida, integraciones de sistemas y optimización de métricas de negocio. Conecto el código con los datos para generar valor real.';
            if (currentMode.value === 'dev') return 'Estudiante de Ingeniería en Sistemas de Información. Especializado en desarrollo full-stack moderno (Vue.js), integraciones complejas de APIs, scripting con Python y automatización de flujos de trabajo operativos.';
            if (currentMode.value === 'data') return 'Estudiante de Ingeniería en Sistemas. Especializado en el análisis operativo, modelado de datos en SQL, automatizaciones inteligentes con Python/GAS y diseño de tableros avanzados en Power BI para la toma de decisiones estratégicas.';
            return '';
        });

        const focusDetail = computed(() => {
            if (currentMode.value === 'hybrid') return 'Desarrollo & Analítica';
            if (currentMode.value === 'dev') return 'Desarrollo Web & Integraciones';
            if (currentMode.value === 'data') return 'Arquitectura de Datos & BI';
            return '';
        });

        const aboutInfoTitle = computed(() => {
            if (currentMode.value === 'hybrid') return 'Ingeniería + Código + Datos';
            if (currentMode.value === 'dev') return 'Ingeniería en Sistemas & Programación';
            if (currentMode.value === 'data') return 'Ingeniería en Sistemas & Analítica de Negocio';
            return '';
        });

        const aboutText = computed(() => {
            if (currentMode.value === 'hybrid') return 'Actualmente curso Ingeniería en Sistemas de Información en la Universidad Tecnológica Nacional (UTN). Mi enfoque combina la rigurosidad técnica del desarrollo de software con la visión estratégica del análisis de datos. Desarrollo aplicaciones web robustas, programo automatizaciones que optimizan el día a día operativo y modelo datos para convertirlos en tableros interactivos que guían las decisiones del negocio.';
            if (currentMode.value === 'dev') return 'Actualmente curso Ingeniería en Sistemas de Información en la Universidad Tecnológica Nacional (UTN). Me apasiona resolver problemas complejos mediante el desarrollo de software limpio y escalable. Cuento con experiencia sólida desarrollando en el ecosistema de JavaScript (Vue.js, Node) y automatizando procesos repetitivos utilizando scripts en Python y Google Apps Script. Me especializo en la integración fluida de APIs, bases de datos y plataformas de hardware.';
            if (currentMode.value === 'data') return 'Actualmente curso Ingeniería en Sistemas de Información en la Universidad Tecnológica Nacional (UTN). Me especializo en transformar datos crudos en información accionable para la toma de decisiones. Cuento con experiencia modelando bases de datos SQL (Oracle, T-SQL), optimizando métricas operativas y desarrollando tableros de control avanzados en Power BI y Excel. Busco aportar eficiencia operativa y anticipar desvíos a través de análisis cuantitativo detallado.';
            return '';
        });

        const sandboxTitle = computed(() => {
            if (currentMode.value === 'hybrid') return 'Laboratorio de Automatización & BI';
            if (currentMode.value === 'dev') return 'Simulador de Consola de Código & Scripting';
            if (currentMode.value === 'data') return 'Dashboard Operativo de Rendimiento';
            return '';
        });

        // Sandbox contextual narrative that explains what the simulation represents
        const sandboxNarrative = computed(() => {
            if (currentMode.value === 'hybrid') return 'Estas herramientas representan una muestra real de mi flujo de trabajo diario: scripts de automatización en Python y Google Apps Script (GAS) que procesan e integran sistemas, junto a paneles interactivos de BI que monitorean métricas operativas.';
            if (currentMode.value === 'dev') return 'Este simulador permite explorar mis desarrollos en Python y Google Apps Script. Muestra scripts reales de automatización (como sincronizaciones a bases de datos relacionales y llamadas a APIs de hardware) junto a simulaciones de ejecución en producción.';
            if (currentMode.value === 'data') return 'Este panel replica los dashboards operativos que diseño en Power BI para la línea de negocio. Los KPIs de conversión, eficiencia y SLA se actualizan en tiempo real y permiten filtrar por canal de ingreso de datos.';
            return '';
        });

        const projectsTitle = computed(() => {
            if (currentMode.value === 'hybrid') return 'Soluciones de Ingeniería y Datos';
            if (currentMode.value === 'dev') return 'Sistemas y Aplicaciones Desarrolladas';
            if (currentMode.value === 'data') return 'Soluciones de Análisis e Integración de Datos';
            return '';
        });

        // Filtered projects list based on current Mode selection
        const filteredProjects = computed(() => {
            if (currentMode.value === 'hybrid') return projects;
            return projects.filter(p => p.category === currentMode.value);
        });

        // Filtered timeline experience items based on current Mode selection
        const filteredExperience = computed(() => {
            if (currentMode.value === 'hybrid') return experience;
            if (currentMode.value === 'dev') return experience.filter(e => e.category !== 'data');
            if (currentMode.value === 'data') return experience.filter(e => e.category !== 'dev');
            return experience;
        });

        // Computed dashboard reactive state based on selected channel filter
        const dashboardState = computed(() => {
            return dashboardDataset[activeFilter.value];
        });

        // --- 4. METHODS ---

        // Set portfolio active mode
        function setMode(mode) {
            currentMode.value = mode;
            localStorage.setItem('lucas-portfolio-mode', mode);

            // Auto switch sandbox tab for relevance
            if (mode === 'dev') {
                sandboxTab.value = 'console';
            } else if (mode === 'data') {
                sandboxTab.value = 'dashboard';
            }

            // Force redraw of skills progress bars
            animateSkillsProgress();

            // Re-observe newly rendered reveal elements after Vue DOM update
            nextTick(() => {
                reObserveRevealElements();
            });
        }

        // Skills progression bar animation helper
        function animateSkillsProgress() {
            const progressBars = document.querySelectorAll('.skill-progress');
            progressBars.forEach(bar => {
                const originalWidth = bar.style.width;
                bar.style.width = '0%';
                setTimeout(() => {
                    bar.style.width = originalWidth;
                }, 100);
            });
        }

        // Terminal Log color selector
        function getLineColor(line) {
            if (line.includes('[SUCCESS]')) return '#ffffff'; // Accent White
            if (line.includes('[SQL]')) return '#a1a1aa'; // Zinc Light Grey
            if (line.includes('[API]') || line.includes('[WEBHOOK]')) return '#d4d4d8'; // Near-white
            if (line.includes('[BI]') || line.includes('[PIPELINE]')) return '#e4e4e7'; // Zinc 200
            if (line.includes('[PROCESSING]')) return '#71717a'; // Zinc Medium Grey
            if (line.includes('[INFO]')) return '#a1a1aa'; // Zinc 400
            if (line.startsWith('#')) return '#52525b'; // Comment Grey
            return '#f4f4f5'; // Zinc White
        }

        // Run Console Script Simulation
        const simulationLines = [
            "# ─── PIPELINE: sync_google_sheets_to_oracle.py ───",
            "[INFO] Cargando variables de entorno desde .env (SHEET_API_URL, DB_DSN)...",
            "[INFO] Estableciendo conexión con Oracle DB (claro.corp:1521/PROD_LOB)...",
            "[SUCCESS] Conexión segura establecida ✓ (usuario: l_ortiz@PROD_LOB)",
            "[API] Enviando request GET a Google Sheets API (endpoint GAS)...",
            "[API] Respuesta recibida: HTTP 200 OK (payload: 14.2 KB, 147 registros)",
            "[SQL] Ejecutando: SELECT COUNT(*) FROM incidents WHERE status = 'PENDING';",
            "[SQL] Resultado: 147 registros pendientes de sincronización.",
            "[PROCESSING] Parseando JSON y validando esquema (id, status, details)...",
            "[PROCESSING] Validación completada: 0 registros corruptos, 147 válidos.",
            "[SQL] INSERT INTO incidents (id, status, details) VALUES (:1, :2, :3) × 147 rows",
            "[SUCCESS] 147 registros insertados correctamente en Oracle DB ✓",
            "[WEBHOOK] Despachando notificación a canal LOB (Slack webhook)...",
            "[SUCCESS] Webhook procesado: HTTP 200 OK ✓",
            "[BI] Trigger: Actualización de dataset Power BI (modelo LOB_Dashboard)...",
            "[SUCCESS] Pipeline completado exitosamente en 3.2s. Próxima corrida: 5 min."
        ];

        function runTerminalSimulation() {
            if (terminalRunning.value) return;
            terminalRunning.value = true;
            terminalLines.value = [];
            let currentLine = 0;

            function printNextLine() {
                if (currentLine < simulationLines.length) {
                    terminalLines.value.push(simulationLines[currentLine]);
                    currentLine++;

                    // Autoscroll terminal
                    nextTick(() => {
                        const terminal = document.querySelector('.terminal-body');
                        if (terminal) terminal.scrollTop = terminal.scrollHeight;
                    });

                    setTimeout(printNextLine, 500);
                } else {
                    terminalRunning.value = false;
                }
            }

            printNextLine();
        }

        function clearTerminal() {
            if (terminalRunning.value) return;
            terminalLines.value = ['# Consola limpia. Presiona "Ejecutar Script" para iniciar.'];
        }

        // --- GAS TERMINAL SIMULATION ---
        const gasSimulationLines = [
            '# ─── EJECUTANDO: sistema_asistencia.gs ───',
            '[GAS] Inicializando SpreadsheetApp... Conectando con "Historial".',
            '[API] GET /ISAPI/AccessControl/AcsEvent → Hikvision HK-T320...',
            '[API] Respuesta: HTTP 200 OK (42 fichadas nuevas detectadas)',
            '[GAS] Procesando fichadas: Filtrando por ID_Empleado...',
            '[SQL] SELECT Horarios WHERE ID = "102" → Lun-Vie: 09:00-18:00',
            '[GAS] María González → Entrada: 09:03 | Salida: 18:15 → ✓ A Tiempo',
            '[GAS] Juan Perez → Entrada: 10:22 | Salida: 15:00 → ⚠ Llegada Tarde',
            '[GAS] Carlos Paz → Sin fichada registrada → ✗ Ausencia',
            '[PROCESS] Generando resumen mensual: 3 ausencias, 5 tardanzas...',
            '[MAIL] Construyendo template HTML para recordatorio...',
            '[MAIL] MailApp.sendEmail() → juan@ejemplo.com → HTTP 200 ✓',
            '[MAIL] MailApp.sendEmail() → carlos@ejemplo.com → HTTP 200 ✓',
            '[GAS] Columna "Estado" actualizada en hoja "Historial".',
            '[SUCCESS] Pipeline completado: 42 fichadas procesadas, 2 emails enviados.'
        ];

        function runGasSimulation() {
            if (gasTerminalRunning.value) return;
            gasTerminalRunning.value = true;
            gasTerminalLines.value = [];
            let i = 0;
            const interval = setInterval(() => {
                if (i < gasSimulationLines.length) {
                    gasTerminalLines.value.push(gasSimulationLines[i]);
                    i++;
                    // Auto-scroll
                    nextTick(() => {
                        const body = document.querySelector('.gas-terminal-body');
                        if (body) body.scrollTop = body.scrollHeight;
                    });
                } else {
                    clearInterval(interval);
                    gasTerminalRunning.value = false;
                }
            }, 320);
        }

        function clearGasTerminal() {
            if (gasTerminalRunning.value) return;
            gasTerminalLines.value = ['# Consola GAS limpia. Presiona "Ejecutar" para iniciar la simulación.'];
        }

        function getGasLineColor(line) {
            if (line.includes('[SUCCESS]')) return '#ffffff';
            if (line.includes('[MAIL]')) return '#d4d4d8';
            if (line.includes('[API]')) return '#d4d4d8';
            if (line.includes('[SQL]')) return '#a1a1aa';
            if (line.includes('[GAS]') && line.includes('✓')) return '#f4f4f5';
            if (line.includes('[GAS]') && line.includes('⚠')) return '#a1a1aa';
            if (line.includes('[GAS]') && line.includes('✗')) return '#71717a';
            if (line.includes('[GAS]')) return '#e4e4e7';
            if (line.includes('[PROCESS]')) return '#71717a';
            if (line.startsWith('#')) return '#52525b';
            return '#f4f4f5';
        }

        // GAS Code Snippets (sanitized from real production code)
        const gasCodeSnippets = {
            asistencia: {
                filename: 'apiDashboard.gs',
                code: `function getDashboardData(userId, monthStr, yearStr) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheetAsistencia = ss.getSheetByName('Historial');
  const sheetHorarios   = ss.getSheetByName('Horarios');

  // 1. Obtener horario asignado del profesional
  const dataH = sheetHorarios.getDataRange().getValues();
  let horario = { 1: null, 2: null, 3: null, 4: null, 5: null };
  for (let i = 1; i < dataH.length; i++) {
    if (String(dataH[i][0]) === String(userId)) {
      for (let d = 1; d <= 5; d++) {
        horario[d] = {
          ent: formatTimeStr(dataH[i][d * 2 - 1]),
          sal: formatTimeStr(dataH[i][d * 2])
        };
      }
      break;
    }
  }

  // 2. Obtener fichadas del reloj biométrico
  const dataA = sheetAsistencia.getDataRange().getValues();
  const fichadasMap = {};
  for (let i = 1; i < dataA.length; i++) {
    if (String(dataA[i][0]) === String(userId)) {
      let fecha = Utilities.formatDate(dataA[i][2],
        Session.getScriptTimeZone(), "dd/MM/yyyy");
      let hora = Utilities.formatDate(dataA[i][3],
        Session.getScriptTimeZone(), "HH:mm");
      if (!fichadasMap[fecha]) {
        fichadasMap[fecha] = { entrada: hora, salida: "---" };
      } else if (parseMins(hora) - parseMins(fichadasMap[fecha].entrada) >= 30) {
        fichadasMap[fecha].salida = hora;
      }
    }
  }
  // 3. Cruzar fichadas con horarios → calcular estado
  return { success: true, data: { horario, fichadasMap } };
}`
            },
            mails: {
                filename: 'apiMails.gs',
                code: `function sendReminderEmail(profId, monthStr, yearStr) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheetUsuarios = ss.getSheetByName('Usuarios');
  const dataU = sheetUsuarios.getDataRange().getValues();
  let correo = "", nombre = "";

  for (let i = 1; i < dataU.length; i++) {
    if (String(dataU[i][0]) === String(profId)) {
      nombre = String(dataU[i][1]);
      correo = String(dataU[i][6]);
      break;
    }
  }

  // Obtener faltas sin justificar del mes
  const dashData = getDashboardData(profId, monthStr, yearStr);
  const faltasPorJustificar = [];
  dashData.data.registros.forEach(r => {
    if (r.estado === 'Ausencia' || r.estado === 'Llegada Tarde') {
      if (!r.observaciones || r.observaciones.includes('Rechazada'))
        faltasPorJustificar.push(r.fecha + ": " + r.estado);
    }
  });

  if (faltasPorJustificar.length === 0) return;

  // Construir y enviar email con plantilla
  const asunto = "Justificaciones Pendientes - " + mesNombre;
  let mensaje = "Hola " + nombre + ",\\n\\n";
  mensaje += "Tienes faltas pendientes:\\n";
  mensaje += faltasPorJustificar.join("\\n");

  MailApp.sendEmail(correo, asunto, mensaje);
  return { success: true, message: "Enviado a " + correo };
}

function setupMonthlyTrigger() {
  ScriptApp.newTrigger('sendMonthlyReminders')
    .timeBased().onMonthDay(27).atHour(9).create();
}`
            },
            organizador: {
                filename: 'dataService.gs',
                code: `// Capa de datos: RPC a GAS o fallback a LocalStorage
import { Activity, Attendee, Professional } from '../models.js';

export const systemModules = [
  new Module('calendar',     'Calendario Anual',     'calendar',    true),
  new Module('concurrentes', 'Concurrentes',         'users',       true),
  new Module('profesionales','Profesionales',        'contact',     true),
  new Module('altas',        'Altas y Admisiones',   'user-plus',   true),
  new Module('admin',        'Organizador Admin',    'briefcase',   true),
  new Module('seguimientos', 'Gabinete',             'users',       true),
  new Module('coordinacion', 'Coordinación (Drive)',  'folder-open', true),
  new Module('habilitaciones','Documentación',       'shield-check',true),
];

// Cargar actividades desde Google Sheets via RPC
export function loadActivities() {
  return new Promise((resolve) => {
    if (window.google?.script) {
      google.script.run
        .withSuccessHandler(rows => {
          resolve(rows.map(r => new Activity(
            r[0], r[1], r[2], r[3], r[4], r[5], r[6], r[7]
          ))));
        })
        .withFailureHandler(() => resolve(loadLocal('activities')))
        .getActivities();
    } else {
      resolve(loadLocal('activities'));
    }
  });
}`
            }
        };

        const activeGasSnippet = computed(() => {
            return gasCodeSnippets[gasSubTab.value] || gasCodeSnippets.asistencia;
        });

        // Copy active Script (Python or GAS) to Clipboard
        function copySourceCode() {
            let rawCode = '';
            if (sandboxTab.value === 'gas') {
                rawCode = activeGasSnippet.value.code;
            } else {
                rawCode = `
# Sincronización Google Sheets -> Oracle Database
import os
import requests
import cx_Oracle

def sync_google_sheets_to_db():
    sheet_url = os.environ.get("SHEET_API_URL")
    db_dsn = cx_Oracle.makedsn("claro.corp", 1521, service_name="PROD_LOB")
    
    # 1. Petición HTTP a la API de GAS
    response = requests.get(sheet_url)
    data = response.json()
    
    # 2. Ingesta a Base de Datos relacional
    conn = cx_Oracle.connect(user="l_ortiz", password="sec_pass", dsn=db_dsn)
    cursor = conn.cursor()
    
    query = "INSERT INTO incidents (id, status, details) VALUES (:1, :2, :3)"
    for item in data["incidents"]:
        cursor.execute(query, (item["id"], item["status"], item["details"]))
        
    conn.commit()
    cursor.close()
    conn.close()

sync_google_sheets_to_db()
`.trim();
            }

            navigator.clipboard.writeText(rawCode).then(() => {
                copiedCode.value = true;
                setTimeout(() => {
                    copiedCode.value = false;
                }, 2000);
            });
        }

        // Dashboard Filter Tabs
        function setDashboardFilter(filter) {
            activeFilter.value = filter;
        }

        // Dashboard Metrics Randomizer (variation always from original base values)
        function refreshDashboard() {
            if (dashboardUpdating.value) return;
            dashboardUpdating.value = true;

            setTimeout(() => {
                const base = dashboardBaseValues[activeFilter.value];
                const active = dashboardDataset[activeFilter.value];
                const baseConv = parseFloat(base.kpis.conv);
                const baseEf = parseFloat(base.kpis.ef);

                // Apply minor random variations from BASE values (never accumulative)
                active.kpis.conv = `${(baseConv + (Math.random() - 0.5) * 0.8).toFixed(1)}%`;
                active.kpis.ef = `${(baseEf + (Math.random() - 0.5) * 2.0).toFixed(1)}%`;

                active.bars = base.bars.map(bar => {
                    const variance = Math.floor((Math.random() - 0.5) * 20);
                    return { h: Math.max(30, Math.min(120, bar.h + variance)) };
                });

                dashboardUpdating.value = false;
            }, 800);
        }

        // --- 8. ACCESSIBILITY MODALS LOGIC ---

        function openModal(project) {
            activeProject.value = project;
            previousActiveElement = document.activeElement;

            // Trapping focus needs element rendering
            nextTick(() => {
                const modal = document.querySelector('.modal-overlay');
                if (modal) {
                    modal.focus();
                    modal.addEventListener('keydown', trapFocus);
                }
            });
        }

        function closeModal() {
            const modal = document.querySelector('.modal-overlay');
            if (modal) {
                modal.removeEventListener('keydown', trapFocus);
            }
            activeProject.value = null;

            if (previousActiveElement) {
                previousActiveElement.focus();
            }
        }

        function trapFocus(e) {
            if (e.key !== 'Tab') return;

            const modal = this;
            const focusables = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            if (focusables.length === 0) return;

            const first = focusables[0];
            const last = focusables[focusables.length - 1];

            if (e.shiftKey) {
                if (document.activeElement === first) {
                    last.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === last) {
                    first.focus();
                    e.preventDefault();
                }
            }
        }

        // --- 9. CONTACT FORM LOGIC (API with mailto fallback) ---

        async function submitContactForm() {
            const { name, email, subject, message } = formData.value;
            formSending.value = true;
            formStatus.value = { message: '', type: '' };

            const runMailtoFallback = (reason) => {
                const body = `Hola Lucas,\n\nMi nombre es ${name} (${email}).\n\n${message}\n\n— Enviado desde tu portafolio web.`;
                const mailtoUrl = `mailto:lucasortiz0602@gmail.com?subject=${encodeURIComponent(subject || 'Contacto desde Portafolio')}&body=${encodeURIComponent(body)}`;
                window.open(mailtoUrl, '_self');
                formStatus.value = {
                    message: `${reason}. Se abrió tu cliente de correo para enviar el mensaje.`,
                    type: 'success'
                };
                formData.value = { name: '', email: '', subject: '', message: '' };
                formSending.value = false;
                setTimeout(() => {
                    formStatus.value = { message: '', type: '' };
                }, 8000);
            };

            if (!WEB3FORMS_ACCESS_KEY || WEB3FORMS_ACCESS_KEY === 'YOUR_ACCESS_KEY_HERE') {
                runMailtoFallback('Formulario en modo offline');
                return;
            }

            try {
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        access_key: WEB3FORMS_ACCESS_KEY,
                        name: name,
                        email: email,
                        subject: subject || 'Contacto desde Portafolio',
                        message: message,
                        from_name: 'Portafolio Web - ' + name
                    })
                });

                const result = await response.json();
                if (result.success) {
                    formStatus.value = {
                        message: '¡Mensaje enviado con éxito directamente a Lucas! Gracias por escribir.',
                        type: 'success'
                    };
                    formData.value = { name: '', email: '', subject: '', message: '' };
                } else {
                    throw new Error(result.message || 'Error en respuesta de la API');
                }
            } catch (error) {
                console.warn('Error al enviar por API, usando fallback:', error);
                runMailtoFallback('Error al conectar con el servidor');
            } finally {
                formSending.value = false;
                setTimeout(() => {
                    if (formStatus.value.message && !formStatus.value.message.includes('cliente de correo')) {
                        formStatus.value = { message: '', type: '' };
                    }
                }, 6000);
            }
        }

        // Scroll to top handler
        function scrollToTop() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        // --- REVEAL OBSERVER UTILITY ---
        let revealObserver = null;

        function createRevealObserver() {
            if (!('IntersectionObserver' in window)) return null;
            return new IntersectionObserver((entries, obs) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('reveal-visible');
                        obs.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
        }

        // Re-observe any new or not-yet-revealed elements (called after mode switch)
        function reObserveRevealElements() {
            const elements = document.querySelectorAll('.reveal-element:not(.reveal-visible)');
            if (revealObserver) {
                elements.forEach(el => revealObserver.observe(el));
            } else {
                elements.forEach(el => el.classList.add('reveal-visible'));
            }
        }

        // --- 10. LIFECYCLE HOOKS ---
        onMounted(() => {
            // Navbar scroll listener + back-to-top visibility
            window.addEventListener('scroll', () => {
                isScrolled.value = window.scrollY > 50;
                showBackToTop.value = window.scrollY > 400;
            });

            // Close mobile menu when clicking escape
            window.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && isMobileMenuOpen.value) {
                    isMobileMenuOpen.value = false;
                }
            });

            // Intersection Observer for Scroll Reveal
            revealObserver = createRevealObserver();
            const revealElements = document.querySelectorAll('.reveal-element');
            if (revealObserver) {
                revealElements.forEach(el => revealObserver.observe(el));
            } else {
                revealElements.forEach(el => el.classList.add('reveal-visible'));
            }

            // Keyboard listener for Escape key to close modals
            window.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && activeProject.value !== null) {
                    closeModal();
                }
            });

            // Read Mode parameters from URL
            const urlParams = new URLSearchParams(window.location.search);
            const queryMode = urlParams.get('mode');
            if (queryMode && ['hybrid', 'dev', 'data'].includes(queryMode)) {
                setMode(queryMode);
            } else {
                const savedMode = localStorage.getItem('lucas-portfolio-mode');
                if (savedMode && ['hybrid', 'dev', 'data'].includes(savedMode)) {
                    setMode(savedMode);
                }
            }
        });

        // Return Vue properties/methods
        return {
            currentMode,
            isScrolled,
            isMobileMenuOpen,
            showBackToTop,
            sandboxTab,
            consoleSubTab,
            terminalLines,
            terminalRunning,
            copiedCode,
            activeFilter,
            dashboardUpdating,
            activeProject,
            formData,
            formSending,
            formStatus,
            badgeText,
            descriptionText,
            focusDetail,
            aboutInfoTitle,
            aboutText,
            sandboxTitle,
            sandboxNarrative,
            projectsTitle,
            filteredProjects,
            filteredExperience,
            education,
            dashboardState,
            setMode,
            getLineColor,
            runTerminalSimulation,
            clearTerminal,
            copySourceCode,
            setDashboardFilter,
            refreshDashboard,
            openModal,
            closeModal,
            submitContactForm,
            scrollToTop,
            gasSubTab,
            gasTerminalLines,
            gasTerminalRunning,
            activeGasSnippet,
            gasCodeSnippets,
            runGasSimulation,
            clearGasTerminal,
            getGasLineColor
        };
    }
}).mount('#app');
