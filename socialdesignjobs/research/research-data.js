window.RESEARCH_MODE = true;

window.CATEGORIES = {
  "sustain":     { "label": "Sustainability",       "color": "#4BAD7F" },
  "inclusion":   { "label": "Inclusion & Access",   "color": "#5B8DD9" },
  "embodied":    { "label": "Embodied Interaction", "color": "#D4622A" },
  "urban":       { "label": "Urban & Society",      "color": "#8C6BB1" },
  "culture":     { "label": "Culture & Critique",   "color": "#C4943A" },
  "migration":   { "label": "Migration & Place",    "color": "#3AABBC" },
  "postcolonial":{ "label": "Equity & Decolonial",  "color": "#C4545A" },
  "health":      { "label": "Health & Wellbeing",   "color": "#7BAA3C" }
};

window.ORGS = [

  /* ── NORDIC ─────────────────────────────────────────────────────────── */
  {
    "id": "kth-mid",
    "name": "KTH MID — Media Technology and Interaction Design",
    "cat": "embodied",
    "city": "Stockholm", "country": "Sweden",
    "coord": [18.0686, 59.3293],
    "url": "https://www.kth.se/mid",
    "blurb": "MID is Scandinavia's leading hub for somaesthetics and feminist technology design, home to Kristina Höök, Madeline Balaam, and Ylva Fernaeus. The group is known for Research through Design applied to haptics, physical-digital prototyping, and critical computing. Master's thesis supervision is the most accessible entry point — a well-focused cold email to relevant faculty is the recommended first contact.",
    "jobs": [
      { "title": "Master's Thesis Supervision", "type": "project", "track": "fellowship", "level": "0-3", "location": "Stockholm, Sweden", "remote": "On-site", "url": "https://www.kth.se/mid" },
      { "title": "Research Visit / Guest Researcher", "type": "project", "track": "fellowship", "level": "0-3", "location": "Stockholm, Sweden", "remote": "On-site", "url": "https://www.kth.se/mid" }
    ]
  },
  {
    "id": "itu-copenhagen-ixd",
    "name": "ITU Copenhagen — IxD Lab / AIR Lab",
    "cat": "inclusion",
    "city": "Copenhagen", "country": "Denmark",
    "coord": [12.5633, 55.6590],
    "url": "https://itu.dk",
    "blurb": "The IxD and AIR labs at IT University Copenhagen work across embodied interaction, participatory design, and welfare technologies. Doga Buse Cavdir explicitly signals openness to new master's and PhD students in accessibility, disability studies, and musical interaction — one of the clearest public recruitment signals among Nordic HCI labs.",
    "jobs": [
      { "title": "Master's Student — Accessibility / Disability Studies", "type": "project", "track": "fellowship", "level": "0-3", "location": "Copenhagen, Denmark", "remote": "On-site", "url": "https://itu.dk" },
      { "title": "PhD Student — Musical Interaction & Inclusive Design", "type": "project", "track": "fellowship", "level": "0-3", "location": "Copenhagen, Denmark", "remote": "On-site", "url": "https://itu.dk" }
    ]
  },
  {
    "id": "tampere-tauchi",
    "name": "Tampere University — TAUCHI / IHTE / TSI",
    "cat": "inclusion",
    "city": "Tampere", "country": "Finland",
    "coord": [23.7756, 61.4503],
    "url": "https://research.tuni.fi/tauchi",
    "blurb": "TAUCHI and partner groups IHTE and TSI form a large inclusive HCI cluster covering accessibility for older adults and children, multimodal interaction, HCAI, and participatory/speculative design under Kaisa Väänänen, Thomas Olsson, and Jonna Häkkilä. An enquiry email with a CV and single-page research interest statement is the recommended entry for RA and project assistant roles.",
    "jobs": [
      { "title": "Research Assistant — Inclusive HCI", "type": "role", "track": "intern", "level": "0-3", "location": "Tampere, Finland", "remote": "On-site", "url": "https://research.tuni.fi/tauchi" },
      { "title": "Project Assistant — Participatory Design", "type": "project", "track": "contract", "level": "0-3", "location": "Tampere, Finland", "remote": "Hybrid", "url": "https://research.tuni.fi/tauchi" }
    ]
  },
  {
    "id": "su-stir",
    "name": "Stockholm University — STIR",
    "cat": "urban",
    "city": "Stockholm", "country": "Sweden",
    "coord": [18.0585, 59.3640],
    "url": "https://www.su.se/stir",
    "blurb": "STIR (Stockholm Technology and Interaction Research) unites technologists, designers, and social scientists working on HCI, CSCW, XR, accessibility, and civic interaction. The group explicitly states it is 'always happy to discuss possibilities for collaboration', making it one of the highest cold-email success environments in Scandinavia.",
    "jobs": [
      { "title": "Research Collaboration Enquiry", "type": "project", "track": "fellowship", "level": "0-3", "location": "Stockholm, Sweden", "remote": "Hybrid", "url": "https://www.su.se/stir" },
      { "title": "Visiting Master's Researcher", "type": "project", "track": "fellowship", "level": "0-3", "location": "Stockholm, Sweden", "remote": "On-site", "url": "https://www.su.se/stir" }
    ]
  },
  {
    "id": "bristol-dive",
    "name": "University of Bristol — DIVE Lab",
    "cat": "inclusion",
    "city": "Bristol", "country": "UK",
    "coord": [-2.6014, 51.4584],
    "url": "https://www.bristol.ac.uk",
    "blurb": "Led by Oussama Metatla, DIVE Lab specialises in accessibility for blind and visually impaired users, cross-sensory interaction, inclusive VR, and design with older adults and people with dementia. Current projects include cross-sensory social play for preschoolers and dementia exergames, with an established precedent for research visitors.",
    "jobs": [
      { "title": "Visiting Master's Researcher", "type": "project", "track": "fellowship", "level": "0-3", "location": "Bristol, UK", "remote": "On-site", "url": "https://www.bristol.ac.uk" },
      { "title": "Research Assistant — Inclusive VR / Dementia", "type": "role", "track": "intern", "level": "0-3", "location": "Bristol, UK", "remote": "On-site", "url": "https://www.bristol.ac.uk" }
    ]
  },
  {
    "id": "umea-uid",
    "name": "Umeå University — UID + Informatics",
    "cat": "sustain",
    "city": "Umeå", "country": "Sweden",
    "coord": [20.3060, 63.8203],
    "url": "https://www.umu.se/en/school-of-arts-and-media/uid/",
    "blurb": "Umeå Institute of Design combined with the Informatics department brings together researchers across HCAI, participatory methods, digital justice, older adults, health autonomy, and Research through Design. Faculty include Pedro Sanches, Cindy Kohtala, and Johan Redström. The lab has a reputation for being one of the lowest-friction entry points in the Nordic region for RA or thesis positions.",
    "jobs": [
      { "title": "Research Assistant — HCAI / Health", "type": "role", "track": "intern", "level": "0-3", "location": "Umeå, Sweden", "remote": "On-site", "url": "https://www.umu.se/en/school-of-arts-and-media/uid/" },
      { "title": "Master's Thesis Supervision", "type": "project", "track": "fellowship", "level": "0-3", "location": "Umeå, Sweden", "remote": "Hybrid", "url": "https://www.umu.se/en/school-of-arts-and-media/uid/" }
    ]
  },
  {
    "id": "aalto-encore",
    "name": "Aalto University — ENCORE + HCI/Games",
    "cat": "sustain",
    "city": "Espoo", "country": "Finland",
    "coord": [24.8301, 60.1841],
    "url": "https://encore.aalto.fi",
    "blurb": "Aalto offers two complementary entry points: ENCORE (Sampsa Hyysalo) applies co-design and sustainability science to sociotechnical change, while the HCI and Games Group (Perttu Hämäläinen, Robin Welsch, Deepika Yadav) covers accessibility, eHealth, and mental health. Together they are highly active at CHI, ASSETS, and UIST.",
    "jobs": [
      { "title": "Research Assistant — Co-Design / Sustainability", "type": "role", "track": "intern", "level": "0-3", "location": "Espoo, Finland", "remote": "Hybrid", "url": "https://encore.aalto.fi" },
      { "title": "Master's Thesis Supervision — Accessibility / Games", "type": "project", "track": "fellowship", "level": "0-3", "location": "Espoo, Finland", "remote": "On-site", "url": "https://encore.aalto.fi" }
    ]
  },
  {
    "id": "aau-create",
    "name": "Aalborg University — Interaction Lab (CREATE)",
    "cat": "culture",
    "city": "Aalborg", "country": "Denmark",
    "coord": [9.9217, 57.0117],
    "url": "https://www.create.aau.dk",
    "blurb": "The CREATE Interaction Lab combines ethnography, participatory design, and clinical trial methods to work with vulnerable communities including people with dementia, children with dyslexia, and indigenous groups. Its unusual mix of qualitative depth and quantitative effect studies makes it attractive for research bridging fieldwork and health outcomes.",
    "jobs": [
      { "title": "Research Assistant — Healthcare Interaction", "type": "role", "track": "intern", "level": "0-3", "location": "Aalborg, Denmark", "remote": "On-site", "url": "https://www.create.aau.dk" },
      { "title": "Project Position — Participatory Design / Vulnerable Communities", "type": "project", "track": "contract", "level": "0-3", "location": "Aalborg, Denmark", "remote": "On-site", "url": "https://www.create.aau.dk" }
    ]
  },
  {
    "id": "kit-hci-accessibility",
    "name": "KIT — HCI and Accessibility",
    "cat": "inclusion",
    "city": "Karlsruhe", "country": "Germany",
    "coord": [8.4177, 49.0125],
    "url": "https://www.imi.kit.edu/english/HCI_and_Accessibility.php",
    "blurb": "Led by Kathrin Gerling, this group focuses on experiential accessibility through sensor-based wearables, assistive technology, digital games, and VR, with a strong commitment to self-determination for disabled users. The affiliated Real-World Lab Accessibility bridges research and public infrastructure, and thesis topics, RA positions, and study-participation pipelines all offer realistic entry paths.",
    "jobs": [
      { "title": "Master's Thesis — Assistive Technology / VR", "type": "project", "track": "fellowship", "level": "0-3", "location": "Karlsruhe, Germany", "remote": "On-site", "url": "https://www.imi.kit.edu/english/HCI_and_Accessibility.php" },
      { "title": "Research Assistant — Wearables & Accessibility", "type": "role", "track": "intern", "level": "0-3", "location": "Karlsruhe, Germany", "remote": "On-site", "url": "https://www.imi.kit.edu/english/HCI_and_Accessibility.php" }
    ]
  },
  {
    "id": "uib-hci",
    "name": "University of Bergen — HCI Group",
    "cat": "embodied",
    "city": "Bergen", "country": "Norway",
    "coord": [5.3240, 60.3817],
    "url": "https://www.uib.no/en/rg/hci",
    "blurb": "The Bergen HCI Group (Morten Fjeld, Frode Guribye, Barbara Wasson) covers tangible and tabletop computing, distributed interaction, cooperation, learning, health, games, and journalism. A tailored cold email connecting a specific research thread to prior work is the recommended approach, given the group's strong publication record at CHI and CSCW.",
    "jobs": [
      { "title": "Visiting Researcher — Tangible / Tabletop Interaction", "type": "project", "track": "fellowship", "level": "0-3", "location": "Bergen, Norway", "remote": "On-site", "url": "https://www.uib.no/en/rg/hci" }
    ]
  },

  /* ── REST OF UK ──────────────────────────────────────────────────────── */
  {
    "id": "rca-helen-hamlyn",
    "name": "Royal College of Art — Helen Hamlyn Centre",
    "cat": "inclusion",
    "city": "London", "country": "UK",
    "coord": [-0.1764, 51.5007],
    "url": "https://www.rca.ac.uk/research-innovation/research-centres/helen-hamlyn-centre/",
    "blurb": "Europe's longest-running inclusive design research centre, directed by Professor Hua Dong, with over 300 completed projects spanning healthcare environments, ageing, neurodiversity, and public space design. A PhD programme in Ageing, Health and Inclusive Design launched in 2025 is the most structured entry point, alongside design sprint collaborations and visiting researcher proposals.",
    "jobs": [
      { "title": "PhD — Ageing, Health & Inclusive Design", "type": "project", "track": "fellowship", "level": "0-3", "location": "London, UK", "remote": "On-site", "url": "https://www.rca.ac.uk/research-innovation/research-centres/helen-hamlyn-centre/" },
      { "title": "Research Collaboration / Design Sprint", "type": "project", "track": "contract", "level": "0-3", "location": "London, UK", "remote": "Hybrid", "url": "https://www.rca.ac.uk/research-innovation/research-centres/helen-hamlyn-centre/" }
    ]
  },
  {
    "id": "open-lab-newcastle",
    "name": "Newcastle University — Open Lab",
    "cat": "migration",
    "city": "Newcastle", "country": "UK",
    "coord": [-1.6178, 54.9783],
    "url": "https://openlab.ncl.ac.uk/",
    "blurb": "Open Lab is a world-leading HCI and digital social innovation group known for its decade-long Digital Civics CDT (55 PhD graduates) and the pioneering Refugees and HCI initiative co-producing technology with displaced communities. Research spans civic technology, digital health, environmental sustainability, and social justice — always with explicit community partnership. Entry routes include the MSc in HCI, funded PhD positions, and postdoctoral roles through the Centre for Digital Citizens.",
    "jobs": [
      { "title": "PhD — Digital Civics / Community Technology", "type": "project", "track": "fellowship", "level": "0-3", "location": "Newcastle, UK", "remote": "On-site", "url": "https://openlab.ncl.ac.uk/" },
      { "title": "Postdoctoral Researcher — Digital Social Innovation", "type": "role", "track": "full-time", "level": "0-3", "location": "Newcastle, UK", "remote": "Hybrid", "url": "https://openlab.ncl.ac.uk/" }
    ]
  },
  {
    "id": "ual-desis",
    "name": "University of the Arts London — UAL DESIS Lab",
    "cat": "culture",
    "city": "London", "country": "UK",
    "coord": [-0.1068, 51.5214],
    "url": "https://www.arts.ac.uk/research/groups-networks-and-collaborations/ual-desis-lab",
    "blurb": "The UAL DESIS Lab draws researchers from across UAL's six colleges (Central Saint Martins, Chelsea, Camberwell, LCC) to address social innovation through collaborative design research, education, and practice. Enquiries focus on care, urban life, participatory futures, and ecological design, often with community partners in London. The most accessible route is a master's at one of UAL's colleges with a research proposal aligned to active lab themes.",
    "jobs": [
      { "title": "Master's Research — Social Innovation Design", "type": "project", "track": "fellowship", "level": "0-3", "location": "London, UK", "remote": "Hybrid", "url": "https://www.arts.ac.uk/research/groups-networks-and-collaborations/ual-desis-lab" },
      { "title": "Collaborative Research Partnership", "type": "project", "track": "contract", "level": "0-3", "location": "London, UK", "remote": "Hybrid", "url": "https://www.arts.ac.uk/research/groups-networks-and-collaborations/ual-desis-lab" }
    ]
  },

  /* ── SCANDINAVIA (additional) ────────────────────────────────────────── */
  {
    "id": "malmo-medea",
    "name": "Malmö University — Medea / DESIS Lab",
    "cat": "urban",
    "city": "Malmö", "country": "Sweden",
    "coord": [13.0038, 55.6059],
    "url": "https://mau.se/en/research/research-groups/desis-lab/",
    "blurb": "Medea is Malmö University's transdisciplinary research lab operating at the intersection of design, media, and public participation, with a founding commitment to Scandinavian participatory design. Living lab experiments address Malmö's challenges around multicultural communities, housing, migration integration, and urban commons — in direct collaboration with residents and municipalities. Master's and doctoral positions are advertised through Malmö University; the lab welcomes guest researchers with targeted proposals.",
    "jobs": [
      { "title": "Research Assistant — Participatory / Living Lab", "type": "role", "track": "intern", "level": "0-3", "location": "Malmö, Sweden", "remote": "Hybrid", "url": "https://mau.se/en/research/research-groups/desis-lab/" },
      { "title": "PhD — Design for Social Innovation", "type": "project", "track": "fellowship", "level": "0-3", "location": "Malmö, Sweden", "remote": "On-site", "url": "https://mau.se/en/research/research-groups/desis-lab/" }
    ]
  },
  {
    "id": "kolding-desis",
    "name": "Design School Kolding — DESIS Lab",
    "cat": "sustain",
    "city": "Kolding", "country": "Denmark",
    "coord": [9.5018, 55.4921],
    "url": "https://www.designskolen.dk/",
    "blurb": "Design School Kolding DESIS Lab applies design to systemic sustainability challenges — food, textiles, materials, and social infrastructure — working within the school's strong craft and co-design traditions. The lab collaborates with local municipalities and businesses on tangible sustainability transition projects. Programme admission to Kolding's master's programmes is the main entry path; supervised project work and RA positions are available for enrolled students.",
    "jobs": [
      { "title": "Master's Research — Sustainable Design", "type": "project", "track": "fellowship", "level": "0-3", "location": "Kolding, Denmark", "remote": "On-site", "url": "https://www.designskolen.dk/" },
      { "title": "Research Assistant — Materials / Transition Design", "type": "role", "track": "intern", "level": "0-3", "location": "Kolding, Denmark", "remote": "On-site", "url": "https://www.designskolen.dk/" }
    ]
  },
  {
    "id": "lapland-arctic-design",
    "name": "University of Lapland — Arctic Design / DESIS",
    "cat": "postcolonial",
    "city": "Rovaniemi", "country": "Finland",
    "coord": [25.7294, 66.5039],
    "url": "https://www.ulapland.fi/EN/Units/Faculty-of-Art-and-Design",
    "blurb": "The University of Lapland's Faculty of Art and Design, home to the Arctic Design concept and DESIS Lab, develops design research centred on Arctic communities, Sámi indigenous culture, and service design for remote and sparsely populated regions. The lab's work critically challenges design's Western defaults and engages with indigenous knowledge systems and Arctic ecological conditions. The MA and doctoral programmes in design are the primary entry routes; the school actively recruits international students with interest in northern and indigenous design contexts.",
    "jobs": [
      { "title": "Master's Research — Arctic / Indigenous Design", "type": "project", "track": "fellowship", "level": "0-3", "location": "Rovaniemi, Finland", "remote": "Hybrid", "url": "https://www.ulapland.fi/EN/Units/Faculty-of-Art-and-Design" },
      { "title": "Research Visit — Service Design / Remote Communities", "type": "project", "track": "fellowship", "level": "0-3", "location": "Rovaniemi, Finland", "remote": "Hybrid", "url": "https://www.ulapland.fi/EN/Units/Faculty-of-Art-and-Design" }
    ]
  },

  /* ── NETHERLANDS ─────────────────────────────────────────────────────── */
  {
    "id": "tu-delft-dfv",
    "name": "TU Delft — Design for Values / Human-Centred Design",
    "cat": "sustain",
    "city": "Delft", "country": "Netherlands",
    "coord": [4.3566, 51.9988],
    "url": "https://delftdesignforvalues.nl/",
    "blurb": "TU Delft's Design for Values Institute and Human-Centred Design department form one of Europe's most active hubs for responsible innovation, spanning inclusive design, sustainability, ethics in technology, and the Inclusive Design Lab. Research integrates engineering, philosophy, and design to embed values like wellbeing, justice, and autonomy into technology development. Master's thesis positions and PDEng traineeships are common entry points; PhD positions are regularly advertised.",
    "jobs": [
      { "title": "Master's Thesis — Inclusive / Responsible Design", "type": "project", "track": "fellowship", "level": "0-3", "location": "Delft, Netherlands", "remote": "On-site", "url": "https://delftdesignforvalues.nl/" },
      { "title": "PDEng Trainee — Human-Centred Design", "type": "role", "track": "full-time", "level": "0-3", "location": "Delft, Netherlands", "remote": "On-site", "url": "https://delftdesignforvalues.nl/" }
    ]
  },
  {
    "id": "tue-future-everyday",
    "name": "Eindhoven University of Technology — Future Everyday",
    "cat": "health",
    "city": "Eindhoven", "country": "Netherlands",
    "coord": [5.4877, 51.4487],
    "url": "https://www.tue.nl/en/research/research-groups/future-everyday",
    "blurb": "The Future Everyday cluster and Systemic Change group at TU/e explore how technology design can support health, wellbeing, and sustainable living at societal scale, with particular strength in design for dementia, ambient assisted living, and social robots. The 'warm technology' concept — centring dignity and relational quality over clinical efficiency — originated here and has shaped welfare technology design internationally. Thesis positions and RA roles within Design department research projects are the typical entry route.",
    "jobs": [
      { "title": "Master's Thesis — Design for Health / Dementia", "type": "project", "track": "fellowship", "level": "0-3", "location": "Eindhoven, Netherlands", "remote": "On-site", "url": "https://www.tue.nl/en/research/research-groups/future-everyday" },
      { "title": "Research Assistant — Social Robots / Wellbeing", "type": "role", "track": "intern", "level": "0-3", "location": "Eindhoven, Netherlands", "remote": "On-site", "url": "https://www.tue.nl/en/research/research-groups/future-everyday" }
    ]
  },
  {
    "id": "auas-civic-ix",
    "name": "Amsterdam UAS — Civic Interaction Design",
    "cat": "urban",
    "city": "Amsterdam", "country": "Netherlands",
    "coord": [4.9041, 52.3676],
    "url": "https://www.amsterdamuas.com/research/research-groups/civic-interaction-design",
    "blurb": "The Civic Interaction Design Research Group at Amsterdam University of Applied Sciences investigates how interactive systems strengthen democratic participation, civic engagement, and community resilience. Research spans speculative design for energy transitions, participatory urban planning platforms, and interaction design in public space — regularly in partnership with Amsterdam municipality and housing associations. The group welcomes applied research collaborations and offers graduate research internships.",
    "jobs": [
      { "title": "Research Internship — Civic Interaction Design", "type": "role", "track": "intern", "level": "0-3", "location": "Amsterdam, Netherlands", "remote": "Hybrid", "url": "https://www.amsterdamuas.com/research/research-groups/civic-interaction-design" },
      { "title": "Research Collaboration — Urban Participation", "type": "project", "track": "contract", "level": "0-3", "location": "Amsterdam, Netherlands", "remote": "Hybrid", "url": "https://www.amsterdamuas.com/research/research-groups/civic-interaction-design" }
    ]
  },

  /* ── ITALY ───────────────────────────────────────────────────────────── */
  {
    "id": "polimi-desis",
    "name": "Politecnico di Milano — POLIMI DESIS Lab",
    "cat": "sustain",
    "city": "Milan", "country": "Italy",
    "coord": [9.1900, 45.4642],
    "url": "https://www.desis.polimi.it/",
    "blurb": "The founding institution of the global DESIS Network, shaped by Ezio Manzini's work on design-driven social innovation. The lab pursues design-led social change across food systems, urban commons, collaborative services, and distributed economies — working with communities and institutions across Italy and globally. Entry through Politecnico di Milano's Design PhD programme is the primary route; collaborative projects with Italian social enterprises also offer project-based involvement.",
    "jobs": [
      { "title": "PhD — Design for Social Innovation", "type": "project", "track": "fellowship", "level": "0-3", "location": "Milan, Italy", "remote": "On-site", "url": "https://www.desis.polimi.it/" },
      { "title": "Research Visit / Collaborative Studio", "type": "project", "track": "fellowship", "level": "0-3", "location": "Milan, Italy", "remote": "On-site", "url": "https://www.desis.polimi.it/" }
    ]
  },

  /* ── FRANCE ──────────────────────────────────────────────────────────── */
  {
    "id": "ensci-paris",
    "name": "ENSCI — Les Ateliers Paris",
    "cat": "culture",
    "city": "Paris", "country": "France",
    "coord": [2.3522, 48.8566],
    "url": "https://www.ensci.com/",
    "blurb": "ENSCI–Les Ateliers is France's premier industrial and interaction design school, with a strong strand of socially and politically engaged design research. The school's DESIS Lab collaborates with public services, social enterprises, and cultural institutions on critical, service, and territorial design projects. Admission to the ENSCI diploma or post-diploma programme is the primary entry route; research residencies and collaborative studio projects are also available.",
    "jobs": [
      { "title": "Post-Diploma Research Residency", "type": "project", "track": "fellowship", "level": "0-3", "location": "Paris, France", "remote": "On-site", "url": "https://www.ensci.com/" },
      { "title": "Collaborative Studio Project", "type": "project", "track": "contract", "level": "0-3", "location": "Paris, France", "remote": "Hybrid", "url": "https://www.ensci.com/" }
    ]
  },

  /* ── SWITZERLAND ─────────────────────────────────────────────────────── */
  {
    "id": "uzh-zpac",
    "name": "University of Zurich — People and Computing Lab (ZPAC)",
    "cat": "health",
    "city": "Zurich", "country": "Switzerland",
    "coord": [8.5492, 47.3769],
    "url": "https://www.ifi.uzh.ch/en/zpac.html",
    "blurb": "ZPAC works at the intersection of feminist HCI, community-based design, and social justice computing — with current research on gender-based violence support systems, chronic illness documentation, and equitable AI. The lab is committed to community-led practices where it holds responsibility without claiming authority. PhD and postdoctoral positions are advertised through UZH Informatics; the lab has a practice of accepting visiting researchers for semester projects.",
    "jobs": [
      { "title": "PhD — Feminist HCI / Community Design", "type": "project", "track": "fellowship", "level": "0-3", "location": "Zurich, Switzerland", "remote": "On-site", "url": "https://www.ifi.uzh.ch/en/zpac.html" },
      { "title": "Visiting Researcher — Semester Project", "type": "project", "track": "fellowship", "level": "0-3", "location": "Zurich, Switzerland", "remote": "On-site", "url": "https://www.ifi.uzh.ch/en/zpac.html" }
    ]
  },

  /* ── NORTH AMERICA ───────────────────────────────────────────────────── */
  {
    "id": "cmu-transition-design",
    "name": "Carnegie Mellon University — Transition Design Institute",
    "cat": "culture",
    "city": "Pittsburgh", "country": "USA",
    "coord": [-79.9428, 40.4444],
    "url": "https://www.design.cmu.edu/about-our-programs/phd-transition-design",
    "blurb": "The Transition Design Institute, co-founded by Terry Irwin and Gideon Kossoff, is the pioneering doctoral programme applying systems-oriented design to sustainability and equity transitions. PhD students work on 'wicked problems' across food, water, housing, policy, and social movements. The PhD is the central entry point; the Institute also runs international symposia and hosted studios that open paths for researchers at earlier career stages.",
    "jobs": [
      { "title": "PhD — Transition Design", "type": "project", "track": "fellowship", "level": "0-3", "location": "Pittsburgh, USA", "remote": "On-site", "url": "https://www.design.cmu.edu/about-our-programs/phd-transition-design" },
      { "title": "Hosted Studio Participant", "type": "project", "track": "fellowship", "level": "0-3", "location": "Pittsburgh, USA", "remote": "Hybrid", "url": "https://www.design.cmu.edu/about-our-programs/phd-transition-design" }
    ]
  },
  {
    "id": "parsons-desis",
    "name": "Parsons School of Design — DESIS Lab",
    "cat": "urban",
    "city": "New York", "country": "USA",
    "coord": [-74.0007, 40.7356],
    "url": "https://www.newschool.edu/desis/",
    "blurb": "Co-founded by Eduardo Staszowski and Lara Penin, Parsons DESIS Lab is a leading centre for design and social innovation, known for collaborative inquiry with grassroots organisations and underserved communities in New York City — spanning housing justice, public health, and civic infrastructure. The Transdisciplinary Design or Design Strategies master's programmes at Parsons are the primary routes; the lab also hosts collaborative studios and research affiliates.",
    "jobs": [
      { "title": "Master's Research — Transdisciplinary / Social Design", "type": "project", "track": "fellowship", "level": "0-3", "location": "New York, USA", "remote": "Hybrid", "url": "https://www.newschool.edu/desis/" },
      { "title": "Research Affiliate / Collaborative Studio", "type": "project", "track": "contract", "level": "0-3", "location": "New York, USA", "remote": "Hybrid", "url": "https://www.newschool.edu/desis/" }
    ]
  },
  {
    "id": "stamps-desis-umich",
    "name": "University of Michigan — Stamps DESIS Lab",
    "cat": "culture",
    "city": "Ann Arbor", "country": "USA",
    "coord": [-83.7430, 44.9742],
    "url": "https://stamps.umich.edu/",
    "blurb": "The Stamps DESIS Lab at the University of Michigan's Stamps School of Art & Design investigates how design can activate communities around social change, working at the intersections of design, public policy, and civic life in Detroit and beyond. Projects address urban equity, environmental justice, and participatory design with diverse communities. MFA and BFA students in Social Design practice are the primary participants; the lab also engages visiting researchers and community partners.",
    "jobs": [
      { "title": "MFA Research — Social / Civic Design", "type": "project", "track": "fellowship", "level": "0-3", "location": "Ann Arbor, USA", "remote": "Hybrid", "url": "https://stamps.umich.edu/" },
      { "title": "Community Design Project Partner", "type": "project", "track": "contract", "level": "0-3", "location": "Ann Arbor, USA", "remote": "Hybrid", "url": "https://stamps.umich.edu/" }
    ]
  },
  {
    "id": "designmatters-artcenter",
    "name": "Art Center College of Design — Designmatters",
    "cat": "postcolonial",
    "city": "Pasadena", "country": "USA",
    "coord": [-118.1517, 34.1478],
    "url": "https://designmattersatartcenter.org/",
    "blurb": "Designmatters is a humanitarian design lab that has worked for over two decades with UNHCR, UNICEF, and the World Food Programme on projects addressing displacement, poverty, and access to services across Latin America, Africa, and Asia. A founding DESIS Network member, it embeds students in field-based projects and operates a social entrepreneurship incubator. Field-based studio semesters and research fellowships are available alongside the standard Art Center curriculum.",
    "jobs": [
      { "title": "Field Studio — Humanitarian Design", "type": "project", "track": "fellowship", "level": "0-3", "location": "Pasadena, USA", "remote": "Hybrid", "url": "https://designmattersatartcenter.org/" },
      { "title": "Research Fellowship — Global South", "type": "role", "track": "fellowship", "level": "0-3", "location": "Pasadena, USA", "remote": "Hybrid", "url": "https://designmattersatartcenter.org/" }
    ]
  },
  {
    "id": "emily-carr-desis",
    "name": "Emily Carr University — DESIS Lab",
    "cat": "culture",
    "city": "Vancouver", "country": "Canada",
    "coord": [-123.1207, 49.2698],
    "url": "https://www.ecuad.ca/",
    "blurb": "Emily Carr University of Art + Design's DESIS Lab explores design as a vehicle for social and environmental transformation, with research in creative placemaking, social innovation in Indigenous contexts, and community-centred service design. The lab's work in British Columbia intersects with questions of land, reconciliation, and ecological care. The MFA and MDes programmes at Emily Carr provide the primary routes; the lab actively collaborates with community organisations in Metro Vancouver.",
    "jobs": [
      { "title": "MFA / MDes Research — Community Design", "type": "project", "track": "fellowship", "level": "0-3", "location": "Vancouver, Canada", "remote": "Hybrid", "url": "https://www.ecuad.ca/" },
      { "title": "Community Research Partner", "type": "project", "track": "contract", "level": "0-3", "location": "Vancouver, Canada", "remote": "Hybrid", "url": "https://www.ecuad.ca/" }
    ]
  },

  /* ── EAST ASIA ───────────────────────────────────────────────────────── */
  {
    "id": "tongji-desis",
    "name": "Tongji University — DESIS Lab (College of Design & Innovation)",
    "cat": "sustain",
    "city": "Shanghai", "country": "China",
    "coord": [121.5010, 31.2862],
    "url": "https://tjdi.tongji.edu.cn/about.do?ID=72&lang=_en",
    "blurb": "One of China's most influential social design research groups, known for the NICE2035 Living Lab — a design-driven social innovation initiative in Shanghai's Siping neighbourhood addressing rural-urban interaction, community infrastructure, and urban resilience. The lab uses design activism to address sustainability transitions and has trained generations of Chinese social design researchers. International visiting research exchanges with European partner schools are available alongside the College's master's and PhD programmes.",
    "jobs": [
      { "title": "PhD — Design-Driven Social Innovation", "type": "project", "track": "fellowship", "level": "0-3", "location": "Shanghai, China", "remote": "On-site", "url": "https://tjdi.tongji.edu.cn/about.do?ID=72&lang=_en" },
      { "title": "International Visiting Researcher", "type": "project", "track": "fellowship", "level": "0-3", "location": "Shanghai, China", "remote": "On-site", "url": "https://tjdi.tongji.edu.cn/about.do?ID=72&lang=_en" }
    ]
  },
  {
    "id": "tsinghua-art-design",
    "name": "Tsinghua University — Academy of Arts & Design",
    "cat": "culture",
    "city": "Beijing", "country": "China",
    "coord": [116.3283, 40.0094],
    "url": "https://www.tsinghua.edu.cn/en/Research/AcademyofArtsDesign.htm",
    "blurb": "Tsinghua's Academy of Arts and Design maintains one of China's strongest design research cultures, with faculty working across speculative design, public design, craft and material culture, and design history. Research engages with Chinese cultural heritage, contemporary social change, and international design discourse, with active participation at international conferences. The master's and doctoral programmes in Design are the main entry route; joint studios with European and American partner institutions create additional paths.",
    "jobs": [
      { "title": "Master's Research — Speculative / Public Design", "type": "project", "track": "fellowship", "level": "0-3", "location": "Beijing, China", "remote": "On-site", "url": "https://www.tsinghua.edu.cn/en/Research/AcademyofArtsDesign.htm" },
      { "title": "International Exchange Research", "type": "project", "track": "fellowship", "level": "0-3", "location": "Beijing, China", "remote": "On-site", "url": "https://www.tsinghua.edu.cn/en/Research/AcademyofArtsDesign.htm" }
    ]
  },
  {
    "id": "yonsei-desis",
    "name": "Yonsei University — DESIS Lab",
    "cat": "urban",
    "city": "Seoul", "country": "South Korea",
    "coord": [126.9353, 37.5651],
    "url": "https://desisnetwork.org/",
    "blurb": "The Yonsei DESIS Lab, based in the Department of Communication Design, explores design's role in civic life, urban community, and social innovation in the Korean context. Research addresses ageing society, multicultural communities, participatory urban development, and public service design. The lab is embedded in Yonsei's design graduate programmes and welcomes visiting researchers from DESIS Network partner institutions.",
    "jobs": [
      { "title": "Graduate Research — Civic / Community Design", "type": "project", "track": "fellowship", "level": "0-3", "location": "Seoul, South Korea", "remote": "On-site", "url": "https://desisnetwork.org/" },
      { "title": "Visiting Researcher — DESIS Exchange", "type": "project", "track": "fellowship", "level": "0-3", "location": "Seoul, South Korea", "remote": "On-site", "url": "https://desisnetwork.org/" }
    ]
  },
  {
    "id": "keio-kmd",
    "name": "Keio University — Graduate School of Media Design",
    "cat": "embodied",
    "city": "Fujisawa", "country": "Japan",
    "coord": [139.4830, 35.3351],
    "url": "https://www.kmd.keio.ac.jp/",
    "blurb": "Keio University's Graduate School of Media Design (KMD) develops 'media innovators' combining interaction design, data-driven systems, and societal impact at the Shonan Fujisawa Campus. Intensive cross-disciplinary studios partner with government, industry, and civil society. International applicants are actively recruited and the school maintains a strong English-language research culture; the graduate programme is the primary entry path.",
    "jobs": [
      { "title": "Master's / PhD — Media Design", "type": "project", "track": "fellowship", "level": "0-3", "location": "Fujisawa, Japan", "remote": "On-site", "url": "https://www.kmd.keio.ac.jp/" },
      { "title": "Research Visit — Design & Social Impact Studio", "type": "project", "track": "fellowship", "level": "0-3", "location": "Fujisawa, Japan", "remote": "On-site", "url": "https://www.kmd.keio.ac.jp/" }
    ]
  },
  {
    "id": "hkdi-desis",
    "name": "Hong Kong Design Institute — DESIS Lab",
    "cat": "culture",
    "city": "Hong Kong", "country": "China",
    "coord": [114.2076, 22.3193],
    "url": "https://hkdi.edu.hk/",
    "blurb": "The HKDI DESIS Lab works on projects addressing urban sustainability, community wellbeing, and social cohesion in Hong Kong's dense urban environment. Research spans public space design, social enterprise support, and design's role in cultural preservation and cross-generational communities. The lab is open to collaboration with NGOs and community organisations; the higher diploma and associate degree programmes provide the student context for lab projects.",
    "jobs": [
      { "title": "Community Design Project — Urban Wellbeing", "type": "project", "track": "fellowship", "level": "0-3", "location": "Hong Kong", "remote": "On-site", "url": "https://hkdi.edu.hk/" },
      { "title": "Research Collaboration — Cultural Preservation", "type": "project", "track": "contract", "level": "0-3", "location": "Hong Kong", "remote": "Hybrid", "url": "https://hkdi.edu.hk/" }
    ]
  },

  /* ── SOUTH / SOUTHEAST ASIA ──────────────────────────────────────────── */
  {
    "id": "nus-sdl",
    "name": "National University of Singapore — Service Design Lab",
    "cat": "health",
    "city": "Singapore", "country": "Singapore",
    "coord": [103.7739, 1.2966],
    "url": "https://cde.nus.edu.sg/did/research/sdl/",
    "blurb": "The Service Design Lab at NUS Division of Industrial Design pursues human-centred service innovation for healthcare, public administration, and urban mobility, working on collaborative projects with Singapore's public sector and regional governments. Research addresses healthcare access, elder care, and civic digital services in Southeast Asian contexts. Graduate and doctoral students in NUS Design are the primary participants; industry collaboration pathways are also available.",
    "jobs": [
      { "title": "Graduate Research — Healthcare Service Design", "type": "project", "track": "fellowship", "level": "0-3", "location": "Singapore", "remote": "On-site", "url": "https://cde.nus.edu.sg/did/research/sdl/" },
      { "title": "Industry Collaborative Project", "type": "project", "track": "contract", "level": "0-3", "location": "Singapore", "remote": "Hybrid", "url": "https://cde.nus.edu.sg/did/research/sdl/" }
    ]
  },
  {
    "id": "idc-iit-bombay",
    "name": "IIT Bombay — IDC School of Design",
    "cat": "inclusion",
    "city": "Mumbai", "country": "India",
    "coord": [72.9133, 19.0762],
    "url": "https://www.idc.iitb.ac.in/",
    "blurb": "IDC School of Design at IIT Bombay is India's leading design research school and pioneer of HCI education in South Asia, with research in interaction design, accessibility, rural and vernacular technology, and inclusive innovation. Faculty-led research groups work with NGOs, government, and communities on participatory and equity-oriented design projects. The postgraduate M.Des. programme is the primary entry route; PhD positions and project-based research assistantships are also available.",
    "jobs": [
      { "title": "M.Des. Research — Interaction / Inclusive Design", "type": "project", "track": "fellowship", "level": "0-3", "location": "Mumbai, India", "remote": "On-site", "url": "https://www.idc.iitb.ac.in/" },
      { "title": "Research Assistant — HCI / Accessibility", "type": "role", "track": "intern", "level": "0-3", "location": "Mumbai, India", "remote": "On-site", "url": "https://www.idc.iitb.ac.in/" }
    ]
  },
  {
    "id": "nid-desis",
    "name": "National Institute of Design — NID DESIS Lab",
    "cat": "postcolonial",
    "city": "Ahmedabad", "country": "India",
    "coord": [72.5714, 23.0225],
    "url": "https://www.nid.edu/",
    "blurb": "The founding institution of design education in India, NID's DESIS Lab explores design's capacity to address India's social, ecological, and economic transitions. Research engages with artisan communities, agricultural innovation, public health, and grassroots social enterprise — often through field-based participatory methods in collaboration with NGOs and cooperatives. The NID M.Des. programmes are the main entry path; the DESIS Lab also hosts collaborative research projects with international partners.",
    "jobs": [
      { "title": "M.Des. Research — Craft / Rural Design", "type": "project", "track": "fellowship", "level": "0-3", "location": "Ahmedabad, India", "remote": "On-site", "url": "https://www.nid.edu/" },
      { "title": "Research Visit — Social Innovation / Artisan Communities", "type": "project", "track": "fellowship", "level": "0-3", "location": "Ahmedabad, India", "remote": "On-site", "url": "https://www.nid.edu/" }
    ]
  },
  {
    "id": "srishti-manipal",
    "name": "Srishti Manipal Institute — Design Research",
    "cat": "postcolonial",
    "city": "Bangalore", "country": "India",
    "coord": [77.5946, 12.9716],
    "url": "https://srishti.ac.in/",
    "blurb": "Srishti Manipal Institute is one of India's most internationally connected design schools, known for critical and speculative approaches, feminist pedagogy, and design research at the intersection of technology and social equity. Faculty have led pioneering work in frugal design, design for the majority, and decolonising design education in the Global South. Admission to the MFA or MDes programmes is the most direct route; the school also hosts visiting researcher positions and collaborative research projects.",
    "jobs": [
      { "title": "MFA / MDes — Critical / Speculative Design", "type": "project", "track": "fellowship", "level": "0-3", "location": "Bangalore, India", "remote": "On-site", "url": "https://srishti.ac.in/" },
      { "title": "Visiting Researcher — Decolonial Design", "type": "project", "track": "fellowship", "level": "0-3", "location": "Bangalore, India", "remote": "Hybrid", "url": "https://srishti.ac.in/" }
    ]
  },

  /* ── AUSTRALIA ───────────────────────────────────────────────────────── */
  {
    "id": "usyd-civic-social",
    "name": "University of Sydney — Civic and Social Design Group",
    "cat": "urban",
    "city": "Sydney", "country": "Australia",
    "coord": [151.1956, -33.8867],
    "url": "https://design.sydney.edu.au/research-2/civic-and-social-design/",
    "blurb": "Led by Dr. Yaron Meron, the Civic and Social Design Research Group investigates how design shapes equitable, inclusive, and participatory futures across health, justice, education, and technology. Methods include design anthropology, service design, and speculative approaches, often in collaboration with community organisations and justice institutions in Sydney. PhD research positions and graduate-level engagement are the primary routes.",
    "jobs": [
      { "title": "PhD Research — Civic / Social Design", "type": "project", "track": "fellowship", "level": "0-3", "location": "Sydney, Australia", "remote": "On-site", "url": "https://design.sydney.edu.au/research-2/civic-and-social-design/" },
      { "title": "Research Assistant — Community Design", "type": "role", "track": "intern", "level": "0-3", "location": "Sydney, Australia", "remote": "Hybrid", "url": "https://design.sydney.edu.au/research-2/civic-and-social-design/" }
    ]
  },
  {
    "id": "rmit-placelabcur",
    "name": "RMIT University — PlaceLab / Centre for Urban Research",
    "cat": "urban",
    "city": "Melbourne", "country": "Australia",
    "coord": [144.9631, -37.8136],
    "url": "https://cur.org.au/",
    "blurb": "RMIT's Centre for Urban Research and its field studio PlaceLab conduct action research into more just, sustainable, and liveable cities, embedding researchers directly in Melbourne communities to address housing equity, social infrastructure, and creative economies. The Social Equity Research Centre provides an additional platform for multidisciplinary work at the design-justice intersection. PhD and research master's programmes at RMIT provide entry points; PlaceLab also invites community partners and NGOs into collaborative studios.",
    "jobs": [
      { "title": "PhD — Urban Design / Housing Justice", "type": "project", "track": "fellowship", "level": "0-3", "location": "Melbourne, Australia", "remote": "On-site", "url": "https://cur.org.au/" },
      { "title": "Community Research Collaborator", "type": "project", "track": "contract", "level": "0-3", "location": "Melbourne, Australia", "remote": "Hybrid", "url": "https://cur.org.au/" }
    ]
  },

  /* ── LATIN AMERICA ───────────────────────────────────────────────────── */
  {
    "id": "ufpe-imaginario",
    "name": "Federal University of Pernambuco — O Imaginário DESIS Lab",
    "cat": "postcolonial",
    "city": "Recife", "country": "Brazil",
    "coord": [-34.9495, -8.0576],
    "url": "https://www.ufpe.br/",
    "blurb": "One of Brazil's most active centres for participatory and social design, O Imaginário DESIS Lab explores design's role in health communication, cultural heritage, political participation, and grassroots entrepreneurship in Brazil's Northeast. The lab develops projects with communities facing socioeconomic exclusion within the rich design culture of Recife's creative economy. Admission to UFPE's Design graduate programmes is the primary path; the lab also recruits student volunteers and community co-researchers.",
    "jobs": [
      { "title": "Graduate Research — Participatory Design / Culture", "type": "project", "track": "fellowship", "level": "0-3", "location": "Recife, Brazil", "remote": "On-site", "url": "https://www.ufpe.br/" },
      { "title": "Community Co-Researcher", "type": "project", "track": "contract", "level": "0-3", "location": "Recife, Brazil", "remote": "Hybrid", "url": "https://www.ufpe.br/" }
    ]
  },
  {
    "id": "puc-public-innovation",
    "name": "Pontificia Universidad Católica de Chile — Public Innovation Lab",
    "cat": "urban",
    "city": "Santiago", "country": "Chile",
    "coord": [-70.6515, -33.4378],
    "url": "https://www.uc.cl/",
    "blurb": "The Public Innovation Lab at PUC Chile applies design thinking, service design, and strategic design to public sector challenges including housing policy, healthcare equity, and participatory urban development in Santiago. The lab works closely with Chilean government ministries and municipalities and has generated influential policy design frameworks. Courses in PUC's Design programmes are the main student-facing entry point; the lab also offers fellowships and project internships for recent graduates.",
    "jobs": [
      { "title": "Design Fellowship — Public Sector Innovation", "type": "role", "track": "fellowship", "level": "0-3", "location": "Santiago, Chile", "remote": "Hybrid", "url": "https://www.uc.cl/" },
      { "title": "Project Internship — Urban / Health Policy", "type": "role", "track": "intern", "level": "0-3", "location": "Santiago, Chile", "remote": "Hybrid", "url": "https://www.uc.cl/" }
    ]
  },
  {
    "id": "uninorte-desis-caribe",
    "name": "Universidad del Norte — DESIS Lab Caribe",
    "cat": "migration",
    "city": "Barranquilla", "country": "Colombia",
    "coord": [-74.8226, 10.9685],
    "url": "https://www.uninorte.edu.co/",
    "blurb": "DESIS Lab Caribe applies design to the challenges of a coastal Caribbean city marked by migration, displacement, and economic informality — exploring how design can support displaced communities, cultural identity, and social cohesion. The lab operates within the Colombian Caribbean's distinctive cultural context and collaborates with local NGOs working with Afro-Colombian and Venezuelan migrant communities. The lab is open to visiting researcher proposals from partner institutions; undergraduate and graduate design students are the primary participants.",
    "jobs": [
      { "title": "Research Visit — Migration & Community Design", "type": "project", "track": "fellowship", "level": "0-3", "location": "Barranquilla, Colombia", "remote": "Hybrid", "url": "https://www.uninorte.edu.co/" },
      { "title": "Graduate Research — Displacement / Social Cohesion", "type": "project", "track": "fellowship", "level": "0-3", "location": "Barranquilla, Colombia", "remote": "On-site", "url": "https://www.uninorte.edu.co/" }
    ]
  },

  /* ── AFRICA ──────────────────────────────────────────────────────────── */
  {
    "id": "knust-desis",
    "name": "KNUST — DESIS Lab (Kumasi)",
    "cat": "postcolonial",
    "city": "Kumasi", "country": "Ghana",
    "coord": [-1.6234, 6.7069],
    "url": "https://desisnetwork.org/desis_labs/kumasi-ghana/",
    "blurb": "The foremost design for social innovation lab in West Africa, KNUST DESIS Lab has conducted landmark community projects addressing sanitation, maker space development, and youth employment in Kumasi's informal settlements. The Zongo Caravan of Hope and 5-Star Street projects demonstrate a bottom-up co-design approach with community members. Students in KNUST's Communication Design programme are the core participants; the lab also engages international design exchange students and visiting researchers.",
    "jobs": [
      { "title": "Exchange Researcher — Community Design", "type": "project", "track": "fellowship", "level": "0-3", "location": "Kumasi, Ghana", "remote": "On-site", "url": "https://desisnetwork.org/desis_labs/kumasi-ghana/" },
      { "title": "Graduate Research — Social Innovation / Sanitation", "type": "project", "track": "fellowship", "level": "0-3", "location": "Kumasi, Ghana", "remote": "On-site", "url": "https://desisnetwork.org/desis_labs/kumasi-ghana/" }
    ]
  },
  {
    "id": "design-society-jhb",
    "name": "Design Society Development — DESIS Lab Johannesburg",
    "cat": "postcolonial",
    "city": "Johannesburg", "country": "South Africa",
    "coord": [28.0473, -26.2041],
    "url": "https://desisnetwork.org/",
    "blurb": "The DESIS Lab in Johannesburg focuses on design's role in addressing South Africa's deeply unequal urban landscape, with projects in public health, education, social housing, and informal economy support. The lab connects design practice to social transformation within Johannesburg's rich history of civic activism. Open to collaborative research proposals and student placements from DESIS Network partner universities.",
    "jobs": [
      { "title": "Research Collaboration — Design & Social Equity", "type": "project", "track": "fellowship", "level": "0-3", "location": "Johannesburg, South Africa", "remote": "Hybrid", "url": "https://desisnetwork.org/" },
      { "title": "Community Design Project Partner", "type": "project", "track": "contract", "level": "0-3", "location": "Johannesburg, South Africa", "remote": "On-site", "url": "https://desisnetwork.org/" }
    ]
  }
];

window.META = {
  lastUpdate: new Date().toISOString(),
  newJobsCount: 42,
  pendingSubmissions: 0,
  nextUpdate: "Curated manually"
};
