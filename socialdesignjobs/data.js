// Social Design Jobs — initial dataset
// Categories color-coded. Coordinates are [lng, lat].
// Job data is illustrative — meant to refresh Wed 20:00 CET.

window.CATEGORIES = {
  studio:    { label: "Social design studio",     color: "#E8B339" },
  lab:       { label: "Public sector lab",        color: "#5BA3D0" },
  civic:     { label: "Civic / gov tech",         color: "#C76B5B" },
  climate:   { label: "Sustainability & climate", color: "#6FA86F" },
  ngo:       { label: "NGO design team",          color: "#B383C9" },
  research:  { label: "Academic research lab",    color: "#D87FA0" },
  consult:   { label: "Impact consultancy",       color: "#E89A6A" },
  community: { label: "Community collective",     color: "#7BB5A8" },
};

window.ORGS = [
  // ── Social design studios ───────────────────────────────────────────────
  { id:"ideo-org", name:"IDEO.org", cat:"studio", city:"San Francisco", country:"USA", coord:[-122.42,37.77], url:"https://ideo.org", blurb:"Design for the world's poorest communities through human-centered design.",
    jobs:[
      { title:"Junior Designer", type:"role", track:"full-time", level:"0-3", location:"San Francisco", remote:"Hybrid", salary:"$72–88k" },
      { title:"Design Research Intern (Summer)", type:"role", track:"intern", level:"0-3", location:"Remote", remote:"Remote" },
      { title:"Equitable Climate Futures (Project)", type:"project", track:"contract", level:"0-3", location:"Nairobi", remote:"On-site", duration:"6 mo" },
    ]},
  { id:"greater-good", name:"Greater Good Studio", cat:"studio", city:"Chicago", country:"USA", coord:[-87.65,41.88], url:"https://greatergoodstudio.com", blurb:"Equity-driven design research for social change.",
    jobs:[
      { title:"Associate Designer", type:"role", track:"full-time", level:"0-3", location:"Chicago", remote:"Hybrid", salary:"$65–78k" },
    ]},
  { id:"thinkplace", name:"ThinkPlace", cat:"studio", city:"Canberra", country:"Australia", coord:[149.13,-35.28], url:"https://thinkplaceglobal.com", blurb:"Strategic design for governments, communities, and humanitarian programs.",
    jobs:[
      { title:"Design Researcher", type:"role", track:"full-time", level:"0-3", location:"Canberra", remote:"Hybrid" },
      { title:"Junior Strategist", type:"role", track:"full-time", level:"0-3", location:"Singapore", remote:"On-site" },
    ]},
  { id:"reboot", name:"Reboot", cat:"studio", city:"New York", country:"USA", coord:[-74.00,40.71], url:"https://reboot.org", blurb:"Inclusive development and accountable governance through design and research.",
    jobs:[
      { title:"Design Research Fellow", type:"project", track:"fellowship", level:"0-3", location:"Remote", remote:"Remote", duration:"12 mo" },
    ]},
  { id:"matter-co", name:"Matter & Co.", cat:"studio", city:"London", country:"UK", coord:[-0.13,51.51], url:"https://matterandco.com", blurb:"Creative agency for purpose-led businesses and movements.",
    jobs:[
      { title:"Junior Brand Designer", type:"role", track:"full-time", level:"0-3", location:"London", remote:"Hybrid", salary:"£32–38k" },
      { title:"Design Intern", type:"role", track:"intern", level:"0-3", location:"London", remote:"Hybrid" },
    ]},
  { id:"daylight", name:"Daylight Design", cat:"studio", city:"Munich", country:"Germany", coord:[11.58,48.14], url:"https://daylightdesign.com", blurb:"Health, climate, and equity through design research.",
    jobs:[
      { title:"Junior Design Researcher", type:"role", track:"full-time", level:"0-3", location:"Munich", remote:"Hybrid" },
    ]},
  { id:"snook", name:"Snook", cat:"studio", city:"Glasgow", country:"UK", coord:[-4.25,55.86], url:"https://wearesnook.com", blurb:"Service design studio improving public services and people's lives.",
    jobs:[
      { title:"Service Designer", type:"role", track:"full-time", level:"0-3", location:"Glasgow", remote:"Hybrid", salary:"£35–42k" },
      { title:"Design Research Assistant", type:"role", track:"intern", level:"0-3", location:"London", remote:"Hybrid" },
    ]},
  { id:"livework", name:"Livework", cat:"studio", city:"Rotterdam", country:"Netherlands", coord:[4.48,51.92], url:"https://liveworkstudio.com", blurb:"Service design pioneers — global studio network.",
    jobs:[
      { title:"Junior Service Designer", type:"role", track:"full-time", level:"0-3", location:"Rotterdam", remote:"Hybrid", salary:"€38–46k", language:"EN/NL" },
    ]},
  { id:"hellon", name:"Hellon", cat:"studio", city:"Helsinki", country:"Finland", coord:[24.94,60.17], url:"https://hellon.com", blurb:"Customer experience and service design.",
    jobs:[
      { title:"Service Design Trainee", type:"role", track:"intern", level:"0-3", location:"Helsinki", remote:"Hybrid", language:"EN/FI" },
    ]},
  { id:"transitiondesign", name:"Studio TILT", cat:"studio", city:"Copenhagen", country:"Denmark", coord:[12.57,55.68], url:"#", blurb:"Designing tools for systems change.",
    jobs:[
      { title:"Junior Systems Designer", type:"role", track:"full-time", level:"0-3", location:"Copenhagen", remote:"Hybrid" },
    ]},

  // ── Public sector / government innovation labs ──────────────────────────
  { id:"policy-lab-uk", name:"Policy Lab UK", cat:"lab", city:"London", country:"UK", coord:[-0.12,51.50], url:"https://openpolicy.blog.gov.uk", blurb:"Cabinet Office unit using design to make better policy.",
    jobs:[
      { title:"Policy Designer (Civil Service)", type:"role", track:"full-time", level:"0-3", location:"London", remote:"Hybrid", salary:"£37–45k" },
    ]},
  { id:"mindlab-legacy", name:"MindLab Legacy Network", cat:"lab", city:"Copenhagen", country:"Denmark", coord:[12.58,55.67], url:"#", blurb:"Successor projects from the original Danish gov innovation lab.",
    jobs:[
      { title:"Public Innovation Project (6mo)", type:"project", track:"contract", level:"0-3", location:"Copenhagen", remote:"On-site", duration:"6 mo" },
    ]},
  { id:"la27e", name:"La 27e Région", cat:"lab", city:"Paris", country:"France", coord:[2.35,48.85], url:"https://la27eregion.fr", blurb:"French public transformation lab — design with regions.",
    jobs:[
      { title:"Stagiaire Designer Public", type:"role", track:"intern", level:"0-3", location:"Paris", remote:"On-site", language:"FR" },
    ]},
  { id:"helsinki-lab", name:"Helsinki Lab", cat:"lab", city:"Helsinki", country:"Finland", coord:[24.95,60.16], url:"#", blurb:"City of Helsinki design and experimentation team.",
    jobs:[
      { title:"Service Designer", type:"role", track:"full-time", level:"0-3", location:"Helsinki", remote:"Hybrid", language:"EN/FI" },
    ]},
  { id:"nyc-civic", name:"NYC Civic Service Design Studio", cat:"lab", city:"New York", country:"USA", coord:[-74.01,40.72], url:"#", blurb:"Mayor's Office design studio — services for New Yorkers.",
    jobs:[
      { title:"Design Fellow", type:"project", track:"fellowship", level:"0-3", location:"New York", remote:"Hybrid", duration:"10 mo" },
    ]},
  { id:"chile-lab", name:"Laboratorio de Gobierno", cat:"lab", city:"Santiago", country:"Chile", coord:[-70.65,-33.45], url:"https://lab.gob.cl", blurb:"Government of Chile innovation lab.",
    jobs:[
      { title:"Diseñador/a de Servicios Jr.", type:"role", track:"full-time", level:"0-3", location:"Santiago", remote:"Hybrid", language:"ES" },
    ]},
  { id:"singapore-osg", name:"Open Government Products", cat:"lab", city:"Singapore", country:"Singapore", coord:[103.82,1.35], url:"https://open.gov.sg", blurb:"Government tech team building public services for Singapore.",
    jobs:[
      { title:"Product Designer (Junior)", type:"role", track:"full-time", level:"0-3", location:"Singapore", remote:"On-site", salary:"S$70–95k" },
    ]},
  { id:"japan-digital", name:"Digital Agency Japan — Design", cat:"lab", city:"Tokyo", country:"Japan", coord:[139.69,35.69], url:"https://digital.go.jp", blurb:"Japan's central digital agency design unit.",
    jobs:[
      { title:"UX Designer (Mid-Career)", type:"role", track:"full-time", level:"0-3", location:"Tokyo", remote:"Hybrid", language:"JP/EN" },
    ]},
  { id:"taiwan-pdis", name:"PDIS (Public Digital Innovation Space)", cat:"lab", city:"Taipei", country:"Taiwan", coord:[121.56,25.03], url:"https://pdis.tw", blurb:"Open-government design and policy team.",
    jobs:[
      { title:"Open Gov Project Researcher", type:"project", track:"contract", level:"0-3", location:"Taipei", remote:"Hybrid", duration:"12 mo", language:"ZH/EN" },
    ]},

  // ── Civic tech / gov tech ───────────────────────────────────────────────
  { id:"code-for-america", name:"Code for America", cat:"civic", city:"Oakland", country:"USA", coord:[-122.27,37.80], url:"https://codeforamerica.org", blurb:"Government can work for the people, by the people, in the digital age.",
    jobs:[
      { title:"Associate Product Designer", type:"role", track:"full-time", level:"0-3", location:"Remote (US)", remote:"Remote", salary:"$78–95k" },
      { title:"Design Fellowship", type:"project", track:"fellowship", level:"0-3", location:"Remote (US)", remote:"Remote", duration:"12 mo" },
    ]},
  { id:"nava", name:"Nava PBC", cat:"civic", city:"Washington", country:"USA", coord:[-77.04,38.91], url:"https://navapbc.com", blurb:"Public benefit corporation simplifying government services.",
    jobs:[
      { title:"Junior Service Designer", type:"role", track:"full-time", level:"0-3", location:"Remote (US)", remote:"Remote", salary:"$80–105k" },
      { title:"Design Apprentice", type:"role", track:"intern", level:"0-3", location:"Remote (US)", remote:"Remote" },
    ]},
  { id:"mysociety", name:"mySociety", cat:"civic", city:"Cambridge", country:"UK", coord:[0.12,52.20], url:"https://mysociety.org", blurb:"Civic tech for democracy, transparency, and climate.",
    jobs:[
      { title:"Junior Designer", type:"role", track:"full-time", level:"0-3", location:"Remote (UK)", remote:"Remote", salary:"£35–42k" },
    ]},
  { id:"codeforjapan", name:"Code for Japan", cat:"civic", city:"Tokyo", country:"Japan", coord:[139.77,35.68], url:"https://code4japan.org", blurb:"Civic tech community building tools with citizens.",
    jobs:[
      { title:"Civic Tech Project Member", type:"project", track:"contract", level:"0-3", location:"Tokyo", remote:"Remote", duration:"6 mo", language:"JP" },
    ]},
  { id:"datactivist", name:"Datactivist", cat:"civic", city:"Marseille", country:"France", coord:[5.37,43.29], url:"https://datactivist.coop", blurb:"Open data cooperative — making public data useful.",
    jobs:[
      { title:"Stagiaire Designer Data", type:"role", track:"intern", level:"0-3", location:"Marseille", remote:"Hybrid", language:"FR" },
    ]},
  { id:"transitnumerique", name:"État Beta — France Services", cat:"civic", city:"Paris", country:"France", coord:[2.34,48.86], url:"https://beta.gouv.fr", blurb:"Startup d'État — public sector incubator.",
    jobs:[
      { title:"Designer Junior", type:"role", track:"full-time", level:"0-3", location:"Paris", remote:"Hybrid", language:"FR" },
    ]},

  // ── Sustainability & climate design ─────────────────────────────────────
  { id:"sypartners", name:"SYPartners", cat:"climate", city:"New York", country:"USA", coord:[-73.99,40.74], url:"https://sypartners.com", blurb:"Transformation consultancy — climate, equity, leadership.",
    jobs:[
      { title:"Junior Designer", type:"role", track:"full-time", level:"0-3", location:"New York", remote:"Hybrid", salary:"$78–95k" },
    ]},
  { id:"daea", name:"Doughnut Economics Action Lab", cat:"climate", city:"Oxford", country:"UK", coord:[-1.25,51.75], url:"https://doughnuteconomics.org", blurb:"Tools and stories for transformative economic action.",
    jobs:[
      { title:"Visual Designer (Project)", type:"project", track:"contract", level:"0-3", location:"Remote", remote:"Remote", duration:"4 mo" },
    ]},
  { id:"climate-imaginations", name:"Climate Imaginations Lab", cat:"climate", city:"Berlin", country:"Germany", coord:[13.40,52.52], url:"#", blurb:"Speculative design for climate futures.",
    jobs:[
      { title:"Climate Storyteller (Junior)", type:"role", track:"full-time", level:"0-3", location:"Berlin", remote:"Hybrid", language:"EN/DE" },
      { title:"Research Internship", type:"role", track:"intern", level:"0-3", location:"Berlin", remote:"Hybrid" },
    ]},
  { id:"superflux", name:"Superflux", cat:"climate", city:"London", country:"UK", coord:[-0.07,51.52], url:"https://superflux.in", blurb:"Speculative design for uncertain futures.",
    jobs:[
      { title:"Junior Strategic Designer", type:"role", track:"full-time", level:"0-3", location:"London", remote:"Hybrid", salary:"£36–44k" },
    ]},
  { id:"forum-future", name:"Forum for the Future", cat:"climate", city:"London", country:"UK", coord:[-0.10,51.52], url:"https://forumforthefuture.org", blurb:"Sustainability non-profit working towards a regenerative future.",
    jobs:[
      { title:"Junior Change Designer", type:"role", track:"full-time", level:"0-3", location:"London/Mumbai/Singapore", remote:"Hybrid" },
    ]},
  { id:"transitionhub", name:"Transition Hub", cat:"climate", city:"Sydney", country:"Australia", coord:[151.21,-33.87], url:"#", blurb:"Regenerative design education and projects.",
    jobs:[
      { title:"Program Design Intern", type:"role", track:"intern", level:"0-3", location:"Sydney", remote:"Hybrid" },
    ]},

  // ── NGO / non-profit design teams ───────────────────────────────────────
  { id:"unicef-office-of-innovation", name:"UNICEF Office of Innovation", cat:"ngo", city:"Stockholm", country:"Sweden", coord:[18.07,59.33], url:"https://unicef.org/innovation", blurb:"Global innovation portfolio for children's rights.",
    jobs:[
      { title:"Innovation Design Consultant", type:"project", track:"contract", level:"0-3", location:"Remote", remote:"Remote", duration:"6 mo" },
    ]},
  { id:"undp-accelerator-labs", name:"UNDP Accelerator Labs", cat:"ngo", city:"New York", country:"USA", coord:[-73.97,40.75], url:"https://acceleratorlabs.undp.org", blurb:"World's largest learning network on sustainable development.",
    jobs:[
      { title:"Solutions Mapping Analyst", type:"role", track:"full-time", level:"0-3", location:"Various", remote:"Hybrid" },
      { title:"Design Internship", type:"role", track:"intern", level:"0-3", location:"Remote", remote:"Remote" },
    ]},
  { id:"oxfam-design", name:"Oxfam — Design & Communications", cat:"ngo", city:"Nairobi", country:"Kenya", coord:[36.82,-1.29], url:"https://oxfam.org", blurb:"Campaign and program design across Africa.",
    jobs:[
      { title:"Junior Communications Designer", type:"role", track:"full-time", level:"0-3", location:"Nairobi", remote:"Hybrid", language:"EN/SW" },
    ]},
  { id:"brac-design", name:"BRAC Design Studio", cat:"ngo", city:"Dhaka", country:"Bangladesh", coord:[90.41,23.81], url:"https://brac.net", blurb:"World's largest NGO — in-house design for poverty programs.",
    jobs:[
      { title:"Program Designer", type:"role", track:"full-time", level:"0-3", location:"Dhaka", remote:"On-site", language:"EN/BN" },
    ]},
  { id:"crisisaction", name:"Crisis Action Design", cat:"ngo", city:"Brussels", country:"Belgium", coord:[4.35,50.85], url:"#", blurb:"Visual storytelling for human rights advocacy.",
    jobs:[
      { title:"Designer (Entry)", type:"role", track:"full-time", level:"0-3", location:"Brussels", remote:"Hybrid", language:"EN/FR" },
    ]},

  // ── Academic research labs ──────────────────────────────────────────────
  { id:"mit-d-lab", name:"MIT D-Lab", cat:"research", city:"Cambridge", country:"USA", coord:[-71.09,42.36], url:"https://d-lab.mit.edu", blurb:"Development through dialogue, design, and dissemination.",
    jobs:[
      { title:"Research Assistant (Postgrad)", type:"role", track:"full-time", level:"0-3", location:"Cambridge MA", remote:"On-site", salary:"$58–72k" },
      { title:"Field Research Project", type:"project", track:"contract", level:"0-3", location:"Various", remote:"On-site", duration:"6 mo" },
    ]},
  { id:"stanford-dschool", name:"Stanford d.school — K12 Lab", cat:"research", city:"Stanford", country:"USA", coord:[-122.17,37.43], url:"https://dschool.stanford.edu", blurb:"Design thinking research and education programs.",
    jobs:[
      { title:"Program Coordinator", type:"role", track:"full-time", level:"0-3", location:"Stanford", remote:"Hybrid" },
    ]},
  { id:"rca-helen-hamlyn", name:"Helen Hamlyn Centre for Design (RCA)", cat:"research", city:"London", country:"UK", coord:[-0.18,51.50], url:"https://rca.ac.uk/research-innovation/helen-hamlyn-centre", blurb:"Inclusive design research at the Royal College of Art.",
    jobs:[
      { title:"Design Research Associate", type:"project", track:"fellowship", level:"0-3", location:"London", remote:"Hybrid", duration:"12 mo", salary:"£36k" },
    ]},
  { id:"nid-india", name:"National Institute of Design — Social Innovation", cat:"research", city:"Ahmedabad", country:"India", coord:[72.57,23.03], url:"https://nid.edu", blurb:"Public design and rural innovation projects.",
    jobs:[
      { title:"Junior Researcher", type:"role", track:"full-time", level:"0-3", location:"Ahmedabad", remote:"On-site" },
    ]},
  { id:"tudelft-id", name:"TU Delft — Design for Sustainability", cat:"research", city:"Delft", country:"Netherlands", coord:[4.36,52.00], url:"https://tudelft.nl", blurb:"Industrial design engineering — sustainability research.",
    jobs:[
      { title:"PhD Researcher (Design)", type:"project", track:"contract", level:"0-3", location:"Delft", remote:"On-site", duration:"4 yr" },
    ]},
  { id:"keio-sfc", name:"Keio SFC — X-Design", cat:"research", city:"Fujisawa", country:"Japan", coord:[139.45,35.39], url:"#", blurb:"Experience design and social innovation research.",
    jobs:[
      { title:"Research Intern", type:"role", track:"intern", level:"0-3", location:"Fujisawa", remote:"Hybrid", language:"JP/EN" },
    ]},

  // ── Impact consultancies ────────────────────────────────────────────────
  { id:"dalberg-design", name:"Dalberg Design", cat:"consult", city:"Mumbai", country:"India", coord:[72.83,19.08], url:"https://dalberg.com/design", blurb:"Human-centered design for inclusive growth.",
    jobs:[
      { title:"Design Associate", type:"role", track:"full-time", level:"0-3", location:"Mumbai/Nairobi/Dakar", remote:"Hybrid", salary:"₹12–18 LPA" },
      { title:"Design Internship", type:"role", track:"intern", level:"0-3", location:"Various", remote:"Hybrid" },
    ]},
  { id:"futuregov", name:"FutureGov / TPXimpact", cat:"consult", city:"London", country:"UK", coord:[-0.08,51.52], url:"https://tpximpact.com", blurb:"Service design for public sector transformation.",
    jobs:[
      { title:"Junior Service Designer", type:"role", track:"full-time", level:"0-3", location:"London/Manchester", remote:"Hybrid", salary:"£32–40k" },
    ]},
  { id:"pivotal", name:"Pivotal Ventures Design", cat:"consult", city:"Seattle", country:"USA", coord:[-122.33,47.61], url:"#", blurb:"Strategy and design for social impact philanthropy.",
    jobs:[
      { title:"Junior Strategist", type:"role", track:"full-time", level:"0-3", location:"Seattle", remote:"Hybrid" },
    ]},
  { id:"open-society-design", name:"Open Society Foundations — Design", cat:"consult", city:"Berlin", country:"Germany", coord:[13.39,52.50], url:"https://opensocietyfoundations.org", blurb:"Design for justice, rights, and democracy programs.",
    jobs:[
      { title:"Junior Designer", type:"role", track:"full-time", level:"0-3", location:"Berlin", remote:"Hybrid", language:"EN/DE" },
    ]},
  { id:"kairoi", name:"Kairoi", cat:"consult", city:"Sao Paulo", country:"Brazil", coord:[-46.63,-23.55], url:"#", blurb:"Latin American social innovation consultancy.",
    jobs:[
      { title:"Designer Júnior", type:"role", track:"full-time", level:"0-3", location:"São Paulo", remote:"Hybrid", language:"PT/ES" },
    ]},

  // ── Community / participatory collectives ───────────────────────────────
  { id:"the-public-collective", name:"The Public Collective", cat:"community", city:"Amsterdam", country:"Netherlands", coord:[4.90,52.37], url:"#", blurb:"Participatory design with marginalized communities.",
    jobs:[
      { title:"Community Design Researcher", type:"project", track:"contract", level:"0-3", location:"Amsterdam", remote:"Hybrid", duration:"8 mo" },
    ]},
  { id:"detroit-future", name:"Detroit Community Technology Project", cat:"community", city:"Detroit", country:"USA", coord:[-83.05,42.33], url:"https://detroitcommunitytech.org", blurb:"Equitable digital infrastructure for and by communities.",
    jobs:[
      { title:"Community Tech Organizer", type:"role", track:"full-time", level:"0-3", location:"Detroit", remote:"On-site" },
    ]},
  { id:"colectivo-zapata", name:"Colectivo Zapata", cat:"community", city:"Mexico City", country:"Mexico", coord:[-99.13,19.43], url:"#", blurb:"Indigenous design and territorial sovereignty.",
    jobs:[
      { title:"Diseñador/a Comunitario", type:"role", track:"full-time", level:"0-3", location:"CDMX", remote:"On-site", language:"ES" },
    ]},
  { id:"akoaki", name:"Akoaki", cat:"community", city:"Detroit", country:"USA", coord:[-83.07,42.36], url:"#", blurb:"Architecture and design for Black cultural geographies.",
    jobs:[
      { title:"Design Apprentice", type:"role", track:"intern", level:"0-3", location:"Detroit", remote:"On-site" },
    ]},
  { id:"bus-stop-films", name:"Bus Stop Films Design", cat:"community", city:"Sydney", country:"Australia", coord:[151.20,-33.86], url:"#", blurb:"Inclusive media and design with people with disability.",
    jobs:[
      { title:"Junior Designer", type:"role", track:"full-time", level:"0-3", location:"Sydney", remote:"Hybrid" },
    ]},
  { id:"cape-design-collective", name:"Cape Town Design Collective", cat:"community", city:"Cape Town", country:"South Africa", coord:[18.42,-33.92], url:"#", blurb:"African community-led design and entrepreneurship.",
    jobs:[
      { title:"Design Intern", type:"role", track:"intern", level:"0-3", location:"Cape Town", remote:"Hybrid" },
    ]},
];

// Project meta
window.META = {
  lastUpdate: Date.now() - 3 * 3600 * 1000, // 3h ago
  newJobsCount: 12,
  pendingSubmissions: 7,
  nextUpdate: "Wed 20:00 CET",
};
