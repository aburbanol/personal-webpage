/* ===================================================================
 * Luther 1.0.0 - Main JS
 *
 * ------------------------------------------------------------------- */

(function(html) {

    "use strict";

    const translations = {
        es: {
            "nav.intro": "Intro",
            "nav.about": "Perfil",
            "nav.works": "Proyectos",
            "nav.contact": "Contacto",
            "intro.tagline": "Artista – Investigador – Productor en nuevos medios y XR",
            "intro.title": "Andrés Burbano <br> diseña relatos inmersivos,<br> experiencias XR con impacto <br> y plataformas digitales <br> al servicio de las comunidades.",
            "intro.profile": "Perfil",
            "about.title": "Sobre mí",
            "about.paragraph": "Director, productor y tecnólogo creativo que teje arte digital, tecnologías XR y justicia social. Fundador de CANVAR y cofundador de MAIX y XRCol, lidero proyectos inmersivos que visibilizan relatos subrepresentados. Miembro de Sundance Institute: Art of Practice, Unity for Humanity y XR LATAM, acompaño a artistas y comunidades en la creación de experiencias interactivas, memorias y con compromiso social.",
            "about.button": "Colaboremos",
            "expertise.title": "Expertise",
            "expertise.item1": "Dirección artística y producción XR",
            "expertise.item2": "Tecnología creativa y prototipado inmersivo",
            "expertise.item3": "Desarrollo de plataformas web y multimodales",
            "expertise.item4": "Mentoría, jurado y acompañamiento transmédia",
            "expertise.item5": "Investigación aplicada y curaduría de arte digital",
            "expertise.item6": "Liderazgo comunitario internacional",
            "experience.title": "Experiencia",
            "exp.sexilio.title": "Sexilio",
            "exp.sexilio.meta": "Director técnico, tecnólogo creativo y productor",
            "exp.sexilio.time": "2025",
            "exp.sexilio.desc": "Diseño y producción de una experiencia VR sobre la migración de mujeres trans latinoamericanas hacia París. Gestión técnica, narrativa inmersiva y financiación CNC en Francia.",
            "exp.hawaf.title": "HAWAF Immersive Experience",
            "exp.hawaf.meta": "Productor VR",
            "exp.hawaf.time": "2024 – 2025",
            "exp.hawaf.desc": "Producción de instalaciones VR interactivas (Meta Quest 3) para el Palais de Tokyo y el museo itinerante ArtExplorer. Integración de audio espacial Wwise y escenografía interactiva de 200 m².",
            "exp.mcledger.title": "MCLedger",
            "exp.mcledger.meta": "Director técnico – plataformas web sostenibles",
            "exp.mcledger.time": "2020 – 2025",
            "exp.mcledger.desc": "Dirección de productos digitales (My Modal Lite, GESCOIN, BEL AMI, BACIDF) para transporte multimodal bajo en carbono. Arquitectura backend Node.js, CI/CD en la nube y equipos SCRUM.",
            "exp.xrmaix.title": "XR LATAM & MAIX",
            "exp.xrmaix.meta": "Mentor, jurado y acompañamiento comunitario",
            "exp.xrmaix.time": "2021 – 2025",
            "exp.xrmaix.desc": "Mentoría de proyectos XR transmédia ganadores, gestión del Artizen Community Fund y jurado de las becas XR LATAM e ICANH. Estrategia de distribución, patrocinio y visibilidad internacional.",
            "exp.shopline.title": "Shopline Electronic",
            "exp.shopline.meta": "Director de estudios informáticos",
            "exp.shopline.time": "2013 – 2020",
            "exp.shopline.desc": "Gestión de equipos para un ecosistema IoT de conteo (2D/3D, LoRAWAN), portales web BI y flota de dispositivos inteligentes. Despliegues en la nube, seguridad y formación técnica.",
            "education.title": "Educación",
            "edu.phd.title": "Doctorado en Imagen 3D y Sistemas Embebidos",
            "edu.phd.meta": "Université Paris-Saclay (Paris Sud)",
            "edu.phd.time": "2018",
            "edu.phd.desc": "Investigación sobre seguimiento humano con cámaras 3D distribuidas y sistemas embebidos. Becas CIFRE (ANRT) y Colfuturo.",
            "edu.master.title": "Máster en Ingeniería de Sistemas de Información y Redes",
            "edu.master.meta": "ECE Paris École d'Ingénieurs",
            "edu.master.time": "2013",
            "edu.master.desc": "Especialización en sistemas de información, redes y fabricación global (UCI Irvine, 2012).",
            "edu.engineer.title": "Ingeniero de sistemas de información",
            "edu.engineer.meta": "ECI Escuela Colombiana de Ingeniería J. Garavito",
            "edu.engineer.time": "2008",
            "edu.engineer.desc": "Formación en ingeniería de sistemas con orientación a software y gestión de proyectos tecnológicos.",
            "works.title": "Proyectos recientes",
            "works.subtitle": "Selección de proyectos XR y transmédia desarrollados en Europa y América Latina.",
            "work.sexilio.cat": "VR social",
            "work.sexilio.title": "Sexilio.",
            "work.hawaf.cat": "Instalación VR",
            "work.hawaf.title": "HAWAF – Palais de Tokyo.",
            "work.paramo.cat": "XR ambiental",
            "work.paramo.title": "Paramoverso.",
            "work.nuages.cat": "AR",
            "work.nuages.title": "Atelier de Nuages.",
            "work.barra.cat": "VR documental",
            "work.barra.title": "Afuera.",
            "work.colombia.cat": "360° y AR",
            "work.colombia.title": "Colombia Resiste 360.",
            "modal.sexilio.title": "Sexilio",
            "modal.sexilio.desc": "Experiencia VR inmersiva que narra el recorrido de mujeres trans migrantes de América Latina hacia París. Dirección técnica, producción y financiación CNC para una narrativa sensible sobre migración, identidad y violencia sistémica.",
            "modal.sexilio.cat1": "VR social",
            "modal.sexilio.cat2": "Producción",
            "modal.sexilio.cta": "Conversar sobre el proyecto",
            "modal.hawaf.title": "HAWAF – Palais de Tokyo",
            "modal.hawaf.desc": "Instalación VR interactiva con 6 grados de libertad para Meta Quest 3 con audio espacial Wwise. Presentada en el Palais de Tokyo y en el museo itinerante ArtExplorer con selección de obras en tiempo real.",
            "modal.hawaf.cat1": "Instalación VR",
            "modal.hawaf.cat2": "Audio espacial",
            "modal.hawaf.cta": "Saber más",
            "modal.paramo.title": "Paramoverso",
            "modal.paramo.desc": "Plataforma XR multiusuario para la conservación de los páramos colombianos. Desarrollo multiplataforma (escritorio, móvil, VR) con tutoría de equipo y coproducción en narrativas y técnica.",
            "modal.paramo.cat1": "XR ambiental",
            "modal.paramo.cat2": "Multiplataforma",
            "modal.paramo.cta": "Descubrir Paramoverso",
            "modal.nuages.title": "Atelier de Nuages",
            "modal.nuages.desc": "Experiencia de realidad aumentada encargada por el Institut du Monde Arabe en París. Complemento digital a una pintura colaborativa de Gaza, con curaduría interactiva y capas narrativas situadas.",
            "modal.nuages.cat1": "AR",
            "modal.nuages.cat2": "Curaduría interactiva",
            "modal.nuages.cta": "Colaborar en curaduría",
            "modal.barra.title": "Afuera",
            "modal.barra.desc": "Experiencia VR documental centrada en la memoria de trabajadoras sexuales trans en Colombia. Ganadora de Unity for Humanity e IDFA DocLab Forum, ofrece un espacio inmersivo de reflexión y defensa.",
            "modal.barra.cat1": "Experiencia VR",
            "modal.barra.cat2": "Impacto social",
            "modal.barra.cta": "Hablar del impacto",
            "modal.colombia.title": "Colombia Resiste 360",
            "modal.colombia.desc": "Obra inmersiva que mezcla video 360° y realidad aumentada para documentar las manifestaciones colombianas de 2021. Experiencia móvil y AR que visibiliza las voces de la diáspora.",
            "modal.colombia.cat1": "360° y AR",
            "modal.colombia.cat2": "Documental",
            "modal.colombia.cta": "Ver la demo",
            "testimonial.artizen.name": "Artizen Community Fund",
            "testimonial.artizen.role": "Mentoría y curadurías XR",
            "testimonial.artizen.quote": "« Andrés conecta a los artistas latinoamericanos con los recursos necesarios para prototipar rápido, manteniendo la tecnología al servicio de los relatos. »",
            "testimonial.unity.name": "Unity for Humanity",
            "testimonial.unity.role": "Comunidad XR con impacto",
            "testimonial.unity.quote": "« Su enfoque mezcla rigor técnico y sensibilidad social: cada prototipo se vuelve un espacio seguro donde los usuarios son escuchados y valorados. »",
            "testimonial.xrlatam.name": "XR LATAM",
            "testimonial.xrlatam.role": "Red de creadores XR",
            "testimonial.xrlatam.quote": "« Gracias a su mentoría, nuestros ganadores estructuran estrategias de distribución y refuerzan el impacto cultural de sus experiencias inmersivas. »",
            "testimonial.sundance.name": "Sundance Institute: Art of Practice",
            "testimonial.sundance.role": "Fellow",
            "testimonial.sundance.quote": "« Andrés desarrolla experiencias que tienden puentes entre memoria, arte y tecnología, colocando a la comunidad en el centro de cada decisión creativa. »",
            "contact.title": "Contacto",
            "contact.subtitle": "¿Tienes un proyecto inmersivo, una residencia o una idea para prototipar? Hablemos de XR, narrativas interactivas y plataformas sostenibles.",
            "contact.direct": "Contacto directo",
            "contact.networks": "Redes y colectivos",
            "contact.cta": "Escribir a Andrés.",
            "footer.copyright": "© Copyright Andrés Burbano",
            "footer.design": "Design by <a href=\"https://www.styleshout.com/\">StyleShout</a> – Adaptado por Andrés"
        },
        en: {
            "nav.intro": "Intro",
            "nav.about": "About",
            "nav.works": "Works",
            "nav.contact": "Contact",
            "intro.tagline": "Artist – Researcher – Producer in new media & XR",
            "intro.title": "Andres Burbano <br> crafts immersive stories,<br> impact-driven XR experiences <br> and digital platforms <br> for communities.",
            "intro.profile": "Profile",
            "about.title": "About",
            "about.paragraph": "Director, producer and creative technologist weaving digital art, XR technologies and social justice. Founder of CANVAR and co-founder of MAIX and XRCol, I lead immersive projects that spotlight underrepresented narratives. As a Sundance Institute: Art of Practice fellow and member of Unity for Humanity and XR LATAM, I guide artists and communities in creating interactive, memory-driven and socially engaged experiences.",
            "about.button": "Collaborate",
            "expertise.title": "Expertise",
            "expertise.item1": "Art direction & XR production",
            "expertise.item2": "Creative technology & immersive prototyping",
            "expertise.item3": "Web & multimodal platform development",
            "expertise.item4": "Mentorship, juries and Transmedia support",
            "expertise.item5": "Applied research and digital art curation",
            "expertise.item6": "International community leadership",
            "experience.title": "Experience",
            "exp.sexilio.title": "Sexilio",
            "exp.sexilio.meta": "Technical director, creative technologist & producer",
            "exp.sexilio.time": "2025",
            "exp.sexilio.desc": "Design and production of a VR experience on the migration journey of trans women from Latin America to Paris. Technical leadership, immersive storytelling and CNC funding.",
            "exp.hawaf.title": "HAWAF Immersive Experience",
            "exp.hawaf.meta": "VR Producer",
            "exp.hawaf.time": "2024 – 2025",
            "exp.hawaf.desc": "Production of interactive VR installations (Meta Quest 3) for Palais de Tokyo and the traveling ArtExplorer museum. Wwise spatial audio integration and 200 m² interactive scenography.",
            "exp.mcledger.title": "MCLedger",
            "exp.mcledger.meta": "CTO – sustainable web platforms",
            "exp.mcledger.time": "2020 – 2025",
            "exp.mcledger.desc": "Led digital products (My Modal Lite, GESCOIN, BEL AMI, BACIDF) for low-carbon multimodal transport. Backend Node.js architecture, cloud CI/CD and SCRUM teams.",
            "exp.xrmaix.title": "XR LATAM & MAIX",
            "exp.xrmaix.meta": "Mentor, jury & community support",
            "exp.xrmaix.time": "2021 – 2025",
            "exp.xrmaix.desc": "Mentored award-winning Transmedia XR projects, managed the Artizen Community Fund and served on XR LATAM and ICANH juries. Distribution strategy, sponsorship and international visibility.",
            "exp.shopline.title": "Shopline Electronic",
            "exp.shopline.meta": "Head of IT studies",
            "exp.shopline.time": "2013 – 2020",
            "exp.shopline.desc": "Managed teams for an IoT counting ecosystem (2D/3D, LoRAWAN), BI web portals and fleets of smart devices. Cloud deployments, security and technical training.",
            "education.title": "Education",
            "edu.phd.title": "PhD in 3D Imaging and Embedded Systems",
            "edu.phd.meta": "Université Paris-Saclay (Paris Sud)",
            "edu.phd.time": "2018",
            "edu.phd.desc": "Research on human tracking using distributed 3D cameras and embedded systems. CIFRE (ANRT) and Colfuturo fellowships.",
            "edu.master.title": "Master in Information Systems Engineering and Networks",
            "edu.master.meta": "ECE Paris École d'Ingénieurs",
            "edu.master.time": "2013",
            "edu.master.desc": "Specialization in information systems, networks and global fabrication (UCI Irvine, 2012).",
            "edu.engineer.title": "Software engineer",
            "edu.engineer.meta": "ECI Colombian School of Engineering J. Garavito",
            "edu.engineer.time": "2008",
            "edu.engineer.desc": "Engineering training focused on software and technological project management.",
            "works.title": "Recent Works",
            "works.subtitle": "Selection of XR and Transmedia projects delivered in Europe and Latin America.",
            "work.sexilio.cat": "Social VR",
            "work.sexilio.title": "Sexilio.",
            "work.hawaf.cat": "VR installation",
            "work.hawaf.title": "HAWAF – Palais de Tokyo.",
            "work.paramo.cat": "Environmental XR",
            "work.paramo.title": "Paramoverso.",
            "work.nuages.cat": "AR",
            "work.nuages.title": "Atelier de Nuages.",
            "work.barra.cat": "Documentary VR",
            "work.barra.title": "Off-Site.",
            "work.colombia.cat": "360° & AR",
            "work.colombia.title": "Colombia Resiste 360.",
            "modal.sexilio.title": "Sexilio",
            "modal.sexilio.desc": "Immersive VR experience portraying the journey of trans migrant women from Latin America to Paris. Technical direction, production and CNC funding for a sensitive story on migration, identity and systemic violence.",
            "modal.sexilio.cat1": "Social VR",
            "modal.sexilio.cat2": "Production",
            "modal.sexilio.cta": "Discuss the project",
            "modal.hawaf.title": "HAWAF – Palais de Tokyo",
            "modal.hawaf.desc": "Interactive VR installation with six degrees of freedom for Meta Quest 3 and Wwise spatial audio. Presented at Palais de Tokyo and the ArtExplorer museum boat with real-time artwork selection.",
            "modal.hawaf.cat1": "VR installation",
            "modal.hawaf.cat2": "Spatial audio",
            "modal.hawaf.cta": "Learn more",
            "modal.paramo.title": "Paramoverso",
            "modal.paramo.desc": "Multi-user XR platform for conserving Colombian páramos. Cross-platform development (desktop, mobile, VR) with team mentorship and co-production on technical and narrative arcs.",
            "modal.paramo.cat1": "Environmental XR",
            "modal.paramo.cat2": "Multiplatform",
            "modal.paramo.cta": "Explore Paramoverso",
            "modal.nuages.title": "Atelier de Nuages",
            "modal.nuages.desc": "Augmented reality experience commissioned by the Institut du Monde Arabe in Paris. Digital complement to a collaborative Gazan painting, offering interactive curation and situated storytelling.",
            "modal.nuages.cat1": "AR",
            "modal.nuages.cat2": "Interactive curation",
            "modal.nuages.cta": "Curate together",
            "modal.barra.title": "Off-Site",
            "modal.barra.desc": "Documentary VR experience centered on the memory of trans sex workers in Colombia. Unity for Humanity and IDFA DocLab Forum winner, offering an immersive space for reflection and advocacy.",
            "modal.barra.cat1": "Documentary VR",
            "modal.barra.cat2": "Social impact",
            "modal.barra.cta": "Talk impact",
            "modal.colombia.title": "Colombia Resiste 360",
            "modal.colombia.desc": "Immersive piece blending 360° video and AR to document Colombia's 2021 protests. Mobile and AR experience amplifying diaspora voices.",
            "modal.colombia.cat1": "360° & AR",
            "modal.colombia.cat2": "Documentary",
            "modal.colombia.cta": "See the demo",
            "testimonial.artizen.name": "Artizen Community Fund",
            "testimonial.artizen.role": "Mentorship & XR curations",
            "testimonial.artizen.quote": "“Andrés connects Latin American artists with the resources to prototype quickly while keeping technology in service of their stories.”",
            "testimonial.unity.name": "Unity for Humanity",
            "testimonial.unity.role": "Impact XR community",
            "testimonial.unity.quote": "“His approach blends technical rigor and social sensitivity: every prototype becomes a safe space where users are heard and valued.”",
            "testimonial.xrlatam.name": "XR LATAM",
            "testimonial.xrlatam.role": "XR creators network",
            "testimonial.xrlatam.quote": "“With his mentorship, our grantees structure their distribution strategies and strengthen the cultural impact of their immersive works.”",
            "testimonial.sundance.name": "Sundance Institute: Art of Practice",
            "testimonial.sundance.role": "Fellow",
            "testimonial.sundance.quote": "“Andrés builds experiences that bridge memory, art and technology, placing community at the heart of every creative decision.”",
            "contact.title": "Get In Touch",
            "contact.subtitle": "Have an immersive project, residency or idea to prototype? Let's talk XR, interactive storytelling and sustainable platforms.",
            "contact.direct": "Direct contact",
            "contact.networks": "Networks & collectives",
            "contact.cta": "Write to Andrés.",
            "footer.copyright": "© Copyright Andrés Burbano",
            "footer.design": "Design by <a href=\"https://www.styleshout.com/\">StyleShout</a> – Adapted by Andrés"
        },
        fr: {
            "nav.intro": "Intro",
            "nav.about": "Profil",
            "nav.works": "Projets",
            "nav.contact": "Contact",
            "intro.tagline": "Artiste – Chercheur – Producteur en nouveaux médias & XR",
            "intro.title": "Andrés Burbano <br> conçoit des récits immersifs, <br> des expériences XR engagées <br> et des plateformes numériques <br> au service des communautés.",
            "intro.profile": "Profil",
            "about.title": "À propos",
            "about.paragraph": "Directeur, producteur et technologue créatif, je tisse art numérique, technologies XR et justice sociale. Fondateur de CANVAR et co-fondateur de MAIX et XRCol, je pilote des projets immersifs qui mettent en lumière des récits sous-représentés. Membre du Sundance Institute : Art of Practice, Unity for Humanity et XR LATAM, j'accompagne artistes et communautés dans la création d'expériences interactives mémorielles et engagées.",
            "about.button": "Collaborer",
            "expertise.title": "Expertise",
            "expertise.item1": "Direction artistique & production XR",
            "expertise.item2": "Technologie créative & prototypage immersif",
            "expertise.item3": "Développement de plateformes web & multimodales",
            "expertise.item4": "Mentorat, jury et accompagnement de projets Transmedia",
            "expertise.item5": "Recherche appliquée et curation d'art numérique",
            "expertise.item6": "Leadership communautaire international",
            "experience.title": "Expérience",
            "exp.sexilio.title": "Sexilio",
            "exp.sexilio.meta": "Directeur technique, technologue créatif & producteur",
            "exp.sexilio.time": "2025",
            "exp.sexilio.desc": "Conception et production d'une expérience VR sur la migration des femmes trans d'Amérique latine vers Paris. Gestion technique, narration immersive et financement auprès du CNC français.",
            "exp.hawaf.title": "HAWAF Immersive Experience",
            "exp.hawaf.meta": "Producteur VR",
            "exp.hawaf.time": "2024 – 2025",
            "exp.hawaf.desc": "Production d'installations VR interactives (Meta Quest 3) pour le Palais de Tokyo et le musée itinérant ArtExplorer. Intégration audio spatiale Wwise et scénographie interactive de 200 m².",
            "exp.mcledger.title": "MCLedger",
            "exp.mcledger.meta": "Directeur technique – plateformes web durables",
            "exp.mcledger.time": "2020 – 2025",
            "exp.mcledger.desc": "Direction de produits numériques (My Modal Lite, GESCOIN, BEL AMI, BACIDF) pour le transport multimodal bas carbone. Architecture backend Node.js, CI/CD cloud et équipes SCRUM.",
            "exp.xrmaix.title": "XR LATAM & MAIX",
            "exp.xrmaix.meta": "Mentor, jury & accompagnement communautaire",
            "exp.xrmaix.time": "2021 – 2025",
            "exp.xrmaix.desc": "Tutorat de projets Transmedia XR lauréats, gestion du Artizen Community Fund et jury des bourses XR LATAM et ICANH. Stratégie de distribution, parrainage et visibilité internationale.",
            "exp.shopline.title": "Shopline Electronic",
            "exp.shopline.meta": "Directeur d'études informatique",
            "exp.shopline.time": "2013 – 2020",
            "exp.shopline.desc": "Management d'équipes pour un écosystème IoT de comptage (2D/3D, LoRAWAN), portails web BI et flotte d'appareils intelligents. Déploiements cloud, sécurité et formation technique.",
            "education.title": "Éducation",
            "edu.phd.title": "Doctorat en Imagerie 3D et Systèmes Embarqués",
            "edu.phd.meta": "Université Paris-Saclay (Paris Sud)",
            "edu.phd.time": "2018",
            "edu.phd.desc": "Recherche sur le suivi humain par caméras 3D distribuées et systèmes embarqués. Bourse CIFRE (ANRT) et Colfuturo.",
            "edu.master.title": "Master Ingénierie des Systèmes d'Information et Réseaux",
            "edu.master.meta": "ECE Paris École d'Ingénieurs",
            "edu.master.time": "2013",
            "edu.master.desc": "Spécialisation en systèmes d'information, réseaux et fabrication mondiale (UCI Irvine, 2012).",
            "edu.engineer.title": "Ingénieur des systèmes d'information",
            "edu.engineer.meta": "ECI École colombienne d'ingénierie J. Garavito",
            "edu.engineer.time": "2008",
            "edu.engineer.desc": "Formation en ingénierie des systèmes avec orientation logicielle et gestion de projets technologiques.",
            "works.title": "Projets récents",
            "works.subtitle": "Sélection de projets XR et transmédia portés en Europe et en Amérique latine.",
            "work.sexilio.cat": "VR sociale",
            "work.sexilio.title": "Sexilio.",
            "work.hawaf.cat": "Installation VR",
            "work.hawaf.title": "HAWAF – Palais de Tokyo.",
            "work.paramo.cat": "XR environnementale",
            "work.paramo.title": "Paramoverso.",
            "work.nuages.cat": "AR",
            "work.nuages.title": "Atelier de Nuages.",
            "work.barra.cat": "VR documentaire",
            "work.barra.title": "Off-Site.",
            "work.colombia.cat": "360° & AR",
            "work.colombia.title": "Colombia Resiste 360.",
            "modal.sexilio.title": "Sexilio",
            "modal.sexilio.desc": "Expérience VR immersive retraçant le parcours des femmes trans migrantes d'Amérique latine vers Paris. Direction technique, production et financement CNC pour une narration sensible sur la migration, l'identité et la violence systémique.",
            "modal.sexilio.cat1": "VR sociale",
            "modal.sexilio.cat2": "Production",
            "modal.sexilio.cta": "Échanger sur le projet",
            "modal.hawaf.title": "HAWAF – Palais de Tokyo",
            "modal.hawaf.desc": "Installation VR interactive à 6 degrés de liberté pour Meta Quest 3 avec audio spatialisé Wwise. Présentée au Palais de Tokyo et sur le musée itinérant ArtExplorer avec sélection d'œuvres en temps réel.",
            "modal.hawaf.cat1": "Installation VR",
            "modal.hawaf.cat2": "Audio spatial",
            "modal.hawaf.cta": "En savoir plus",
            "modal.paramo.title": "Paramoverso",
            "modal.paramo.desc": "Plateforme multi-utilisateur XR pour la conservation des páramos colombiens. Développement multiplateforme (desktop, mobile, VR) avec tutorat d'équipe et coproducteur sur les volets techniques et narratifs.",
            "modal.paramo.cat1": "XR environnementale",
            "modal.paramo.cat2": "Multiplateforme",
            "modal.paramo.cta": "Découvrir Paramoverso",
            "modal.nuages.title": "Atelier de Nuages",
            "modal.nuages.desc": "Expérience en réalité augmentée commandée par l'Institut du Monde Arabe à Paris. Complément numérique à une peinture collaborative gazaouie, offrant une curation interactive et des couches narratives situées.",
            "modal.nuages.cat1": "AR",
            "modal.nuages.cat2": "Curation interactive",
            "modal.nuages.cta": "Collaborer sur une curation",
            "modal.barra.title": "Off-Site",
            "modal.barra.desc": "Expérience VR documentaire centrée sur la mémoire de travailleuses du sexe transgenres en Colombie. Lauréat Unity for Humanity et IDFA DocLab Forum, offrant un espace immersif de réflexion et de plaidoyer.",
            "modal.barra.cat1": "Expérience VR",
            "modal.barra.cat2": "Impact social",
            "modal.barra.cta": "Parler de l'impact",
            "modal.colombia.title": "Colombia Resiste 360",
            "modal.colombia.desc": "Œuvre immersive mêlant vidéo 360° et réalité augmentée pour documenter les manifestations colombiennes de 2021. Expérience mobile et AR donnant visibilité aux voix de la diaspora.",
            "modal.colombia.cat1": "360° & AR",
            "modal.colombia.cat2": "Documentaire",
            "modal.colombia.cta": "Voir la démo",
            "testimonial.artizen.name": "Artizen Community Fund",
            "testimonial.artizen.role": "Mentorat & Curations XR",
            "testimonial.artizen.quote": "« Andrés relie les artistes latino-américains aux ressources nécessaires pour prototyper rapidement, tout en gardant la technologie au service des récits. »",
            "testimonial.unity.name": "Unity for Humanity",
            "testimonial.unity.role": "Communauté XR à impact",
            "testimonial.unity.quote": "« Son approche mêle rigueur technique et sensibilité sociale : chaque prototype devient un espace sûr où les utilisateurs sont écoutés et mis en valeur. »",
            "testimonial.xrlatam.name": "XR LATAM",
            "testimonial.xrlatam.role": "Réseau de créateurs XR",
            "testimonial.xrlatam.quote": "« Grâce à son mentorat, nos lauréats structurent leurs stratégies de distribution et renforcent l'impact culturel de leurs expériences immersives. »",
            "testimonial.sundance.name": "Sundance Institute : Art of Practice",
            "testimonial.sundance.role": "Fellow",
            "testimonial.sundance.quote": "« Andrés développe des expériences qui créent des ponts entre mémoire, art et technologie, en plaçant la communauté au cœur de chaque décision créative. »",
            "contact.title": "Contact",
            "contact.subtitle": "Vous avez un projet immersif, une résidence ou une idée à prototyper ? Parlons XR, narration interactive et plateformes durables.",
            "contact.direct": "Contact direct",
            "contact.networks": "Réseaux & collectifs",
            "contact.cta": "Écrire à Andrés.",
            "footer.copyright": "© Copyright Andrés Burbano",
            "footer.design": "Design by <a href=\"https://www.styleshout.com/\">StyleShout</a> – Adapté par Andrés"
        }
    };

    html.className = html.className.replace(/\bno-js\b/g, '') + ' js ';



   /* Animations
    * -------------------------------------------------- */
    const tl = anime.timeline( {
        easing: 'easeInOutCubic',
        duration: 800,
        autoplay: false
    })
    .add({
        targets: '#loader',
        opacity: 0,
        duration: 1000,
        begin: function(anim) {
            window.scrollTo(0, 0);
        }
    })
    .add({
        targets: '#preloader',
        opacity: 0,
        complete: function(anim) {
            document.querySelector("#preloader").style.visibility = "hidden";
            document.querySelector("#preloader").style.display = "none";
        }
    })
    .add({
        targets: '.s-header',
        translateY: [-100, 0],
        opacity: [0, 1]
    }, '-=200')
    .add({
        targets: [ '.s-intro .text-pretitle', '.s-intro .text-huge-title'],
        translateX: [100, 0],
        opacity: [0, 1],
        delay: anime.stagger(400)
    })
    .add({
        targets: '.circles span',
        keyframes: [
            {opacity: [0, .3]},
            {opacity: [.3, .1], delay: anime.stagger(100, {direction: 'reverse'})}
        ],
        delay: anime.stagger(100, {direction: 'reverse'})
    })
    .add({
        targets: '.intro-social li',
        translateX: [-50, 0],
        opacity: [0, 1],
        delay: anime.stagger(100, {direction: 'reverse'})
    })
    .add({
        targets: '.intro-scrolldown',
        translateY: [100, 0],
        opacity: [0, 1]
    }, '-=800');



   /* Preloader
    * -------------------------------------------------- */
    const ssPreloader = function() {

        const preloader = document.querySelector('#preloader');
        if (!preloader) return;
        
        window.addEventListener('load', function() {
            document.querySelector('html').classList.remove('ss-preload');
            document.querySelector('html').classList.add('ss-loaded');

            document.querySelectorAll('.ss-animated').forEach(function(item){
                item.classList.remove('ss-animated');
            });

            tl.play();
        });

        // force page scroll position to top at page refresh
        // window.addEventListener('beforeunload' , function () {
        //     // window.scrollTo(0, 0);
        // });

    }; // end ssPreloader


   /* Mobile Menu
    * ---------------------------------------------------- */ 
    const ssMobileMenu = function() {

        const toggleButton = document.querySelector('.mobile-menu-toggle');
        const mainNavWrap = document.querySelector('.main-nav-wrap');
        const siteBody = document.querySelector("body");

        if (!(toggleButton && mainNavWrap)) return;

        toggleButton.addEventListener('click', function(event) {
            event.preventDefault();
            toggleButton.classList.toggle('is-clicked');
            siteBody.classList.toggle('menu-is-open');
        });

        mainNavWrap.querySelectorAll('.main-nav a').forEach(function(link) {
            link.addEventListener("click", function(event) {

                // at 800px and below
                if (window.matchMedia('(max-width: 800px)').matches) {
                    toggleButton.classList.toggle('is-clicked');
                    siteBody.classList.toggle('menu-is-open');
                }
            });
        });

        window.addEventListener('resize', function() {

            // above 800px
            if (window.matchMedia('(min-width: 801px)').matches) {
                if (siteBody.classList.contains('menu-is-open')) siteBody.classList.remove('menu-is-open');
                if (toggleButton.classList.contains("is-clicked")) toggleButton.classList.remove("is-clicked");
            }
        });

    }; // end ssMobileMenu


   /* Highlight active menu link on pagescroll
    * ------------------------------------------------------ */
    const ssScrollSpy = function() {

        const sections = document.querySelectorAll(".target-section");

        // Add an event listener listening for scroll
        window.addEventListener("scroll", navHighlight);

        function navHighlight() {
        
            // Get current scroll position
            let scrollY = window.pageYOffset;
        
            // Loop through sections to get height(including padding and border), 
            // top and ID values for each
            sections.forEach(function(current) {
                const sectionHeight = current.offsetHeight;
                const sectionTop = current.offsetTop - 50;
                const sectionId = current.getAttribute("id");
            
               /* If our current scroll position enters the space where current section 
                * on screen is, add .current class to parent element(li) of the thecorresponding 
                * navigation link, else remove it. To know which link is active, we use 
                * sectionId variable we are getting while looping through sections as 
                * an selector
                */
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    document.querySelector(".main-nav a[href*=" + sectionId + "]").parentNode.classList.add("current");
                } else {
                    document.querySelector(".main-nav a[href*=" + sectionId + "]").parentNode.classList.remove("current");
                }
            });
        }

    }; // end ssScrollSpy


   /* Animate elements if in viewport
    * ------------------------------------------------------ */
    const ssViewAnimate = function() {

        const blocks = document.querySelectorAll("[data-animate-block]");

        window.addEventListener("scroll", viewportAnimation);

        function viewportAnimation() {

            let scrollY = window.pageYOffset;

            blocks.forEach(function(current) {

                const viewportHeight = window.innerHeight;
                const triggerTop = (current.offsetTop + (viewportHeight * .2)) - viewportHeight;
                const blockHeight = current.offsetHeight;
                const blockSpace = triggerTop + blockHeight;
                const inView = scrollY > triggerTop && scrollY <= blockSpace;
                const isAnimated = current.classList.contains("ss-animated");

                if (inView && (!isAnimated)) {
                    anime({
                        targets: current.querySelectorAll("[data-animate-el]"),
                        opacity: [0, 1],
                        translateY: [100, 0],
                        delay: anime.stagger(400, {start: 200}),
                        duration: 800,
                        easing: 'easeInOutCubic',
                        begin: function(anim) {
                            current.classList.add("ss-animated");
                        }
                    });
                }
            });
        }

    }; // end ssViewAnimate


   /* Swiper
    * ------------------------------------------------------ */ 
    const ssSwiper = function() {

        const mySwiper = new Swiper('.swiper-container', {

            slidesPerView: 1,
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            breakpoints: {
                // when window width is > 400px
                401: {
                    slidesPerView: 1,
                    spaceBetween: 20
                },
                // when window width is > 800px
                801: {
                    slidesPerView: 2,
                    spaceBetween: 32
                },
                // when window width is > 1200px
                1201: {
                    slidesPerView: 2,
                    spaceBetween: 80
                }
            }
         });

    }; // end ssSwiper


   /* Lightbox
    * ------------------------------------------------------ */
    const ssLightbox = function() {

        const folioLinks = document.querySelectorAll('.folio-list__item-link');
        const modals = [];

        folioLinks.forEach(function(link) {
            let modalbox = link.getAttribute('href');
            let instance = basicLightbox.create(
                document.querySelector(modalbox),
                {
                    onShow: function(instance) {
                        //detect Escape key press
                        document.addEventListener("keydown", function(event) {
                            event = event || window.event;
                            if (event.keyCode === 27) {
                                instance.close();
                            }
                        });
                    }
                }
            )
            modals.push(instance);
        });

        folioLinks.forEach(function(link, index) {
            link.addEventListener("click", function(event) {
                event.preventDefault();
                modals[index].show();
            });
        });

    };  // end ssLightbox


   /* Alert boxes
    * ------------------------------------------------------ */
   const ssAlertBoxes = function() {

        const boxes = document.querySelectorAll('.alert-box');
  
        boxes.forEach(function(box){

            box.addEventListener('click', function(event) {
                if (event.target.matches(".alert-box__close")) {
                    event.stopPropagation();
                    event.target.parentElement.classList.add("hideit");

                    setTimeout(function(){
                        box.style.display = "none";
                    }, 500)
                }    
            });

        })

   }; // end ssAlertBoxes


   /* Language Switcher
    * ------------------------------------------------------ */
    const ssLanguageSwitcher = function() {
        const select = document.querySelector('.lang-select');
        if (!select) return;

        const applyTranslations = function(lang) {
            const dictionary = translations[lang] || translations.en;
            document.documentElement.setAttribute('lang', lang);

            document.querySelectorAll('[data-i18n]').forEach(function(el) {
                const key = el.dataset.i18n;
                const value = dictionary[key];
                if (!value) return;

                if (el.dataset.i18nType === 'html') {
                    el.innerHTML = value;
                } else {
                    el.textContent = value;
                }
            });
        };

        const storedLang = localStorage.getItem('preferred-lang');
        const initialLang = translations[storedLang] ? storedLang : 'en';

        select.value = initialLang;
        applyTranslations(initialLang);

        select.addEventListener('change', function(event) {
            const lang = event.target.value;
            if (!translations[lang]) return;

            localStorage.setItem('preferred-lang', lang);
            applyTranslations(lang);
        });
    }; // end ssLanguageSwitcher


   /* Smoothscroll
    * ------------------------------------------------------ */
    const ssMoveTo = function(){

        const easeFunctions = {
            easeInQuad: function (t, b, c, d) {
                t /= d;
                return c * t * t + b;
            },
            easeOutQuad: function (t, b, c, d) {
                t /= d;
                return -c * t* (t - 2) + b;
            },
            easeInOutQuad: function (t, b, c, d) {
                t /= d/2;
                if (t < 1) return c/2*t*t + b;
                t--;
                return -c/2 * (t*(t-2) - 1) + b;
            },
            easeInOutCubic: function (t, b, c, d) {
                t /= d/2;
                if (t < 1) return c/2*t*t*t + b;
                t -= 2;
                return c/2*(t*t*t + 2) + b;
            }
        }

        const triggers = document.querySelectorAll('.smoothscroll');
        
        const moveTo = new MoveTo({
            tolerance: 0,
            duration: 1200,
            easing: 'easeInOutCubic',
            container: window
        }, easeFunctions);

        triggers.forEach(function(trigger) {
            moveTo.registerTrigger(trigger);
        });

    }; // end ssMoveTo


   /* Initialize
    * ------------------------------------------------------ */
    (function ssInit() {

        ssPreloader();
        ssMobileMenu();
        ssScrollSpy();
        ssViewAnimate();
        ssSwiper();
        ssLightbox();
        ssAlertBoxes();
        ssMoveTo();
        ssLanguageSwitcher();

    })();

})(document.documentElement);