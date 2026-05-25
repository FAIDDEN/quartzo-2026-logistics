// Seed data extracted from LOG_QUARTZO_2026.xlsx
// Excel date serials: 46175=02/06, 46176=03/06, 46177=04/06, 46178=05/06, 46179=06/06, 46180=07/06, 46181=08/06

export const HOTELS = [
  { id: 'h1', name: 'BAGUA',             address: 'São Jorge - GO', phone: '' },
  { id: 'h2', name: 'CAMINHO CACHOEIRA', address: 'São Jorge - GO', phone: '' },
  { id: 'h3', name: 'BAMBU BRASIL',      address: 'São Jorge - GO', phone: '' },
]

export const INITIAL_HOTEL_ROOMS = [
  // BAGUA
  { id:'r01', hotel:'BAGUA', room:'01', category:'BANG - JOÃO DE BARRO', checkIn:'2026-06-04', checkOut:'2026-06-05', guest:'Steffen Berkahn (Dixon)', artistRef:'Dixon', phone:'', status:'', notes:'', modifiedInApp:false },
  { id:'r01b',hotel:'BAGUA', room:'01', category:'BANG - JOÃO DE BARRO', checkIn:'2026-06-05', checkOut:'2026-06-06', guest:'Damian Lazarus', artistRef:'Damian Lazarus', phone:'', status:'', notes:'', modifiedInApp:false },
  { id:'r01c',hotel:'BAGUA', room:'01', category:'BANG - JOÃO DE BARRO', checkIn:'2026-06-06', checkOut:'2026-06-07', guest:'Artista Bedouin 1', artistRef:'Bedouin', phone:'', status:'', notes:'', modifiedInApp:false },
  { id:'r02', hotel:'BAGUA', room:'02', category:'BANG - YAYÁ', checkIn:'2026-06-04', checkOut:'2026-06-05', guest:'Max Styler', artistRef:'Max Styler', phone:'', status:'', notes:'', modifiedInApp:false },
  { id:'r02b',hotel:'BAGUA', room:'02', category:'BANG - YAYÁ', checkIn:'2026-06-05', checkOut:'2026-06-06', guest:'Ezequiel Arias', artistRef:'Ezequiel Arias', phone:'', status:'', notes:'', modifiedInApp:false },
  { id:'r02c',hotel:'BAGUA', room:'02', category:'BANG - YAYÁ', checkIn:'2026-06-06', checkOut:'2026-06-07', guest:'Artista Bedouin 2', artistRef:'Bedouin', phone:'', status:'', notes:'', modifiedInApp:false },
  { id:'r03', hotel:'BAGUA', room:'03', category:'CABANA ZAZU', checkIn:'2026-06-03', checkOut:'2026-06-05', guest:'Saraga', artistRef:'Saraga', phone:'', status:'', notes:'', modifiedInApp:false },
  { id:'r03b',hotel:'BAGUA', room:'03', category:'CABANA ZAZU', checkIn:'2026-06-05', checkOut:'2026-06-06', guest:'Omri Guetta', artistRef:'Omri', phone:'', status:'', notes:'', modifiedInApp:false },
  { id:'r03c',hotel:'BAGUA', room:'03', category:'CABANA ZAZU', checkIn:'2026-06-06', checkOut:'2026-06-07', guest:'Brynjar Heimisson (Tripolism)', artistRef:'Tripolism', phone:'', status:'', notes:'', modifiedInApp:false },
  { id:'r04', hotel:'BAGUA', room:'04', category:'CABANA ZAZU', checkIn:'2026-06-04', checkOut:'2026-06-05', guest:'Maria Beistain Berti (Manager Dixon)', artistRef:'Dixon', phone:'', status:'', notes:'', modifiedInApp:false },
  { id:'r04b',hotel:'BAGUA', room:'04', category:'CABANA ZAZU', checkIn:'2026-06-05', checkOut:'2026-06-06', guest:'Liav Rafael Shalom (Rafael)', artistRef:'Rafael', phone:'', status:'', notes:'', modifiedInApp:false },
  { id:'r04c',hotel:'BAGUA', room:'04', category:'CABANA ZAZU', checkIn:'2026-06-06', checkOut:'2026-06-07', guest:'Frederik Thorngaard (Tripolism)', artistRef:'Tripolism', phone:'', status:'', notes:'', modifiedInApp:false },
  { id:'r05', hotel:'BAGUA', room:'05', category:'CABANA ZAZU', checkIn:'2026-06-04', checkOut:'2026-06-05', guest:'TM Max Styler', artistRef:'Max Styler', phone:'', status:'', notes:'', modifiedInApp:false },
  { id:'r05b',hotel:'BAGUA', room:'05', category:'CABANA ZAZU', checkIn:'2026-06-05', checkOut:'2026-06-06', guest:'Convidado Damian Lazarus', artistRef:'Damian Lazarus', phone:'', status:'', notes:'', modifiedInApp:false },
  { id:'r05c',hotel:'BAGUA', room:'05', category:'CABANA ZAZU', checkIn:'2026-06-06', checkOut:'2026-06-07', guest:'Rasmus Vendelbjerg (Tripolism)', artistRef:'Tripolism', phone:'', status:'', notes:'', modifiedInApp:false },
  // CAMINHO CACHOEIRA
  { id:'r06', hotel:'CAMINHO CACHOEIRA', room:'06', category:'BANG SUPERIOR', checkIn:'2026-06-03', checkOut:'2026-06-05', guest:'Pedro Henrique Mendes + Rafaella (Goodtimes)', artistRef:'Goodtimes', phone:'', status:'', notes:'Ele paga primeira noite', modifiedInApp:false },
  { id:'r06b',hotel:'CAMINHO CACHOEIRA', room:'06', category:'BANG SUPERIOR', checkIn:'2026-06-05', checkOut:'2026-06-06', guest:'Artista Ruback 1', artistRef:'Ruback', phone:'', status:'', notes:'', modifiedInApp:false },
  { id:'r06c',hotel:'CAMINHO CACHOEIRA', room:'06', category:'BANG SUPERIOR', checkIn:'2026-06-06', checkOut:'2026-06-07', guest:'TM Bedouin', artistRef:'Bedouin', phone:'', status:'', notes:'', modifiedInApp:false },
  { id:'r07', hotel:'CAMINHO CACHOEIRA', room:'07', category:'BANG SUPERIOR', checkIn:'2026-06-04', checkOut:'2026-06-05', guest:'Eliana Iwasa (Eli Iwasa)', artistRef:'Eli Iwasa', phone:'', status:'', notes:'', modifiedInApp:false },
  { id:'r07b',hotel:'CAMINHO CACHOEIRA', room:'07', category:'BANG SUPERIOR', checkIn:'2026-06-05', checkOut:'2026-06-06', guest:'Artista Ruback 2', artistRef:'Ruback', phone:'', status:'', notes:'', modifiedInApp:false },
  { id:'r07c',hotel:'CAMINHO CACHOEIRA', room:'07', category:'BANG SUPERIOR', checkIn:'2026-06-06', checkOut:'2026-06-08', guest:'Dylan Syben (Dilby)', artistRef:'Dilby', phone:'', status:'', notes:'', modifiedInApp:false },
  { id:'r08', hotel:'CAMINHO CACHOEIRA', room:'08', category:'BANG TÉRREO',   checkIn:'2026-06-04', checkOut:'2026-06-05', guest:'Ratier', artistRef:'Ratier', phone:'', status:'', notes:'', modifiedInApp:false },
  { id:'r08b',hotel:'CAMINHO CACHOEIRA', room:'08', category:'BANG TÉRREO',   checkIn:'2026-06-05', checkOut:'2026-06-06', guest:'Wellington Lopes (TM Omri & Rafael)', artistRef:'Omri/Rafael', phone:'', status:'', notes:'', modifiedInApp:false },
  { id:'r08c',hotel:'CAMINHO CACHOEIRA', room:'08', category:'BANG TÉRREO',   checkIn:'2026-06-06', checkOut:'2026-06-07', guest:'Victor Westermann (TM Tripolism)', artistRef:'Tripolism', phone:'', status:'', notes:'', modifiedInApp:false },
  { id:'r09', hotel:'CAMINHO CACHOEIRA', room:'09', category:'SUITE',         checkIn:'2026-06-04', checkOut:'2026-06-05', guest:'TM Goodtimes', artistRef:'Goodtimes', phone:'', status:'', notes:'', modifiedInApp:false },
  { id:'r09b',hotel:'CAMINHO CACHOEIRA', room:'09', category:'SUITE',         checkIn:'2026-06-05', checkOut:'2026-06-06', guest:'TM Ruback', artistRef:'Ruback', phone:'', status:'', notes:'', modifiedInApp:false },
  { id:'r09c',hotel:'CAMINHO CACHOEIRA', room:'09', category:'SUITE',         checkIn:'2026-06-06', checkOut:'2026-06-08', guest:'TM Dilby', artistRef:'Dilby', phone:'', status:'', notes:'', modifiedInApp:false },
  { id:'r10', hotel:'CAMINHO CACHOEIRA', room:'10', category:'SUITE',         checkIn:'2026-06-04', checkOut:'2026-06-05', guest:'Equipe Max Styler', artistRef:'Max Styler', phone:'', status:'', notes:'', modifiedInApp:false },
  { id:'r10b',hotel:'CAMINHO CACHOEIRA', room:'10', category:'SUITE',         checkIn:'2026-06-05', checkOut:'2026-06-06', guest:'TM Ezequiel Arias', artistRef:'Ezequiel Arias', phone:'', status:'', notes:'', modifiedInApp:false },
  { id:'r10c',hotel:'CAMINHO CACHOEIRA', room:'10', category:'SUITE',         checkIn:'2026-06-06', checkOut:'2026-06-07', guest:'Henrique Gonçalves (Unfazed)', artistRef:'Unfazed', phone:'', status:'', notes:'', modifiedInApp:false },
  { id:'r11', hotel:'CAMINHO CACHOEIRA', room:'11', category:'SUITE',         checkIn:'2026-06-04', checkOut:'2026-06-05', guest:'Equipe Max Styler', artistRef:'Max Styler', phone:'', status:'', notes:'', modifiedInApp:false },
  { id:'r11b',hotel:'CAMINHO CACHOEIRA', room:'11', category:'SUITE',         checkIn:'2026-06-06', checkOut:'2026-06-07', guest:'Rafael', artistRef:'Rafael', phone:'', status:'', notes:'', modifiedInApp:false },
  { id:'r14', hotel:'CAMINHO CACHOEIRA', room:'14', category:'SUITE',         checkIn:'2026-06-03', checkOut:'2026-06-07', guest:'Paulo Jardim (PN)', artistRef:'PN', phone:'', status:'', notes:'', modifiedInApp:false },
  // BAMBU BRASIL
  { id:'r16', hotel:'BAMBU BRASIL', room:'16', category:'LUXO', checkIn:'2026-06-03', checkOut:'2026-06-09', guest:'Cintra (TM Local)', artistRef:'TM Local', phone:'', status:'', notes:'', modifiedInApp:false },
  { id:'r17', hotel:'BAMBU BRASIL', room:'17', category:'LUXO', checkIn:'2026-06-03', checkOut:'2026-06-07', guest:'Denise (AS)', artistRef:'AS', phone:'', status:'', notes:'', modifiedInApp:false },
  { id:'r18', hotel:'BAMBU BRASIL', room:'18', category:'LUXO', checkIn:'2026-06-03', checkOut:'2026-06-05', guest:'Rodrigo Domingues (Afterclapp) + Mariana Moretti', artistRef:'Afterclapp', phone:'', status:'', notes:'', modifiedInApp:false },
]

const makeChecks = () => ({
  flightInConfirmed:false, airportPickup:false, hotelCheckin:false,
  transferToVenue:false, setPlayed:false, transferFromVenue:false,
  hotelCheckout:false, airportDropoff:false, flightOutConfirmed:false,
})

export const INITIAL_ARTISTS = [
  // ─────────────────────────────────────────────────
  // DIXON
  {
    id:'a-dixon', name:'Dixon', fullName:'Steffen Berkahn', role:'artista',
    nationality:'DE', languages:['German','English'], isInternational:true,
    accommodationType:'hotel',
    hotel:{ name:'BAGUA', room:'01', category:'BANG - JOÃO DE BARRO', checkIn:'2026-06-04', checkOut:'2026-06-05' },
    sets:[{ id:'s1', day:'2026-06-04', dayLabel:'AMETISTA', stage:'MAINSTAGE', startTime:'22:00', endTime:'00:00', logisticsType:'H+T', checked:false }],
    flightsIn:[], flightsOut:[],
    transfersIn:[], transfersOut:[],
    contact:{ name:'Maria Beistain Berti (Manager)', phone:'' },
    checks: makeChecks(), incidents:[], notes:'Dixon + Manager + TM. Voos PENDENTES.',
    modifiedInApp:false, modifiedAt:null,
  },
  // MAX STYLER
  {
    id:'a-maxstyler', name:'Max Styler', fullName:'Max', role:'artista',
    nationality:'US', languages:['English','Spanish'], isInternational:true,
    accommodationType:'hotel',
    hotel:{ name:'BAGUA', room:'02', category:'BANG - YAYÁ', checkIn:'2026-06-04', checkOut:'2026-06-05' },
    sets:[{ id:'s2', day:'2026-06-04', dayLabel:'AMETISTA', stage:'MAINSTAGE', startTime:'00:00', endTime:'02:00', logisticsType:'H+T (van)', checked:false }],
    flightsIn:[{
      id:'fi-max', date:'2026-06-04', departureTime:'09:40', airline:'INTERNACIONAL', flightNumber:'IB 6578',
      origin:'GRU', destination:'BSB', arrivalTime:'11:25', status:'CONFIRMADO',
      passenger:'Max (Artista Max Styler)', isInternational:true, direction:'in', modifiedInApp:false,
    }],
    flightsOut:[{
      id:'fo-max', date:'2026-06-05', departureTime:'16:45', airline:'LATAM', flightNumber:'LA 3011',
      origin:'BSB', destination:'CGH', arrivalTime:'18:30', status:'CONFIRMADO',
      passenger:'Max, Daniel, Clayton, Justin, Rafael, Joane (Max Styler)', isInternational:false, direction:'out', modifiedInApp:false,
    }],
    transfersIn:[], transfersOut:[],
    contact:{ name:'Equipe Max Styler', phone:'' },
    checks: makeChecks(), incidents:[], notes:'Vai de van — equipe grande (Daniel, Justin, Joane, Rafael, Clayton).',
    modifiedInApp:false, modifiedAt:null,
  },
  // SARAGA
  {
    id:'a-saraga', name:'Saraga', fullName:'Saraga', role:'artista',
    nationality:'IL', languages:['Hebrew','English'], isInternational:true,
    accommodationType:'hotel',
    hotel:{ name:'BAGUA', room:'03', category:'CABANA ZAZU', checkIn:'2026-06-03', checkOut:'2026-06-05' },
    sets:[{ id:'s3', day:'2026-06-04', dayLabel:'AMETISTA', stage:'MAINSTAGE', startTime:'20:00', endTime:'22:00', logisticsType:'H+T', checked:false }],
    flightsIn:[], // PENDENTE
    flightsOut:[{
      id:'fo-saraga', date:'2026-06-05', departureTime:'18:15', airline:'INTERNACIONAL', flightNumber:'TP 58',
      origin:'BSB', destination:'LIS', arrivalTime:'+1 07:25', status:'CONFIRMADO',
      passenger:'Saraga (Artista)', isInternational:true, direction:'out', modifiedInApp:false,
    }],
    transfersIn:[], transfersOut:[],
    contact:{ name:'Wesley Ferreira (TM)', phone:'' },
    checks: makeChecks(), incidents:[], notes:'Voo chegada PENDENTE. TM: Wesley Ferreira.',
    modifiedInApp:false, modifiedAt:null,
  },
  // DAMIAN LAZARUS
  {
    id:'a-damianlazarus', name:'Damian Lazarus', fullName:'Damian Lazarus', role:'artista',
    nationality:'GB', languages:['English'], isInternational:true,
    accommodationType:'hotel',
    hotel:{ name:'BAGUA', room:'01', category:'BANG - JOÃO DE BARRO', checkIn:'2026-06-05', checkOut:'2026-06-06' },
    sets:[{ id:'s4', day:'2026-06-05', dayLabel:'JADE', stage:'MAINSTAGE', startTime:'22:00', endTime:'00:00', logisticsType:'H+T', checked:false }],
    flightsIn:[{
      id:'fi-damian', date:'2026-06-05', departureTime:'08:55', airline:'', flightNumber:'',
      origin:'GRU', destination:'BSB', arrivalTime:'10:40', status:'CONFIRMADO',
      passenger:'Damian Lazarus (Artista)', isInternational:false, direction:'in', modifiedInApp:false,
    }],
    flightsOut:[], // PENDENTE
    transfersIn:[], transfersOut:[],
    contact:{ name:'', phone:'' },
    checks: makeChecks(), incidents:[], notes:'Voo volta PENDENTE. Verificar cia aérea chegada.',
    modifiedInApp:false, modifiedAt:null,
  },
  // ELI IWASA
  {
    id:'a-eliwasa', name:'Eli Iwasa', fullName:'Eliana Iwasa', role:'artista',
    nationality:'BR', languages:['Portuguese','English'], isInternational:false,
    accommodationType:'hotel',
    hotel:{ name:'CAMINHO CACHOEIRA', room:'07', category:'BANG SUPERIOR', checkIn:'2026-06-04', checkOut:'2026-06-05' },
    sets:[{ id:'s5', day:'2026-06-04', dayLabel:'AMETISTA', stage:'ALQUIMIA', startTime:'00:00', endTime:'02:00', logisticsType:'H+T', checked:false }],
    flightsIn:[{
      id:'fi-eli', date:'2026-06-04', departureTime:'11:45', airline:'LATAM', flightNumber:'LA 3281',
      origin:'VCP', destination:'BSB', arrivalTime:'13:20', status:'CONFIRMADO',
      passenger:'Eliana Iwasa (Artista Eli Iwasa)', isInternational:false, direction:'in', modifiedInApp:false,
    }],
    flightsOut:[{
      id:'fo-eli', date:'2026-06-05', departureTime:'12:25', airline:'LATAM', flightNumber:'LA 3264',
      origin:'BSB', destination:'GRU', arrivalTime:'14:10', status:'CONFIRMADO',
      passenger:'Eliana Iwasa (Artista Eli Iwasa)', isInternational:false, direction:'out', modifiedInApp:false,
    }],
    transfersIn:[], transfersOut:[],
    contact:{ name:'Eli Iwasa (Direto)', phone:'' },
    checks: makeChecks(), incidents:[], notes:'',
    modifiedInApp:false, modifiedAt:null,
  },
  // GOODTIMES / ILLUSIONIZE
  {
    id:'a-goodtimes', name:'GoodTimes', fullName:'Pedro Henrique Mendes', role:'artista',
    nationality:'BR', languages:['Portuguese'], isInternational:false,
    accommodationType:'hotel',
    hotel:{ name:'CAMINHO CACHOEIRA', room:'06', category:'BANG SUPERIOR', checkIn:'2026-06-03', checkOut:'2026-06-05' },
    sets:[{ id:'s6', day:'2026-06-04', dayLabel:'AMETISTA', stage:'ALQUIMIA', startTime:'21:00', endTime:'22:30', logisticsType:'H+T', checked:false }],
    flightsIn:[{
      id:'fi-gt', date:'2026-06-02', departureTime:'07:55', airline:'AZUL', flightNumber:'AD 4702',
      origin:'VCP', destination:'BSB', arrivalTime:'09:30', status:'CONFIRMADO',
      passenger:'Pedro Henrique Mendes e Rafaella Cancellier Ghisi (Artista Goodtimes + Namorada)',
      isInternational:false, direction:'in', modifiedInApp:false,
    }],
    flightsOut:[{
      id:'fo-gt', date:'2026-06-05', departureTime:'12:45', airline:'LATAM', flightNumber:'LA 3017',
      origin:'BSB', destination:'CGH', arrivalTime:'14:30', status:'CONFIRMADO',
      passenger:'Pedro Henrique, Rafaella, Pedro e Lucas (Artista, Namorada e Equipe Goodtimes)',
      isInternational:false, direction:'out', modifiedInApp:false,
    }],
    transfersIn:[], transfersOut:[],
    contact:{ name:'Pedro Henrique (Direto)', phone:'' },
    checks: makeChecks(), incidents:[], notes:'Equipe: Rafaella (namorada), Lucas Tavares, Pedro Pini. Hotel quarto 06 - Pedro paga 1ª diária.',
    modifiedInApp:false, modifiedAt:null,
  },
  // GOSPEL (Gaspar Muniz)
  {
    id:'a-gasparmuniz', name:'Gaspar Muniz', fullName:'Gaspar Muniz', role:'artista',
    nationality:'AR', languages:['Spanish','English'], isInternational:true,
    accommodationType:'hotel',
    hotel:{ name:'BAGUA', room:'', category:'', checkIn:'2026-06-04', checkOut:'2026-06-05' },
    sets:[{ id:'s7', day:'2026-06-04', dayLabel:'AMETISTA', stage:'BÉSAME', startTime:'00:00', endTime:'02:00', logisticsType:'H alto+T', checked:false }],
    flightsIn:[{
      id:'fi-gaspar', date:'2026-06-04', departureTime:'09:25', airline:'AZUL', flightNumber:'AD 6414',
      origin:'CGH', destination:'BSB', arrivalTime:'11:15', status:'CONFIRMADO',
      passenger:'Gaspar Muniz (Gospel)', isInternational:false, direction:'in', modifiedInApp:false,
    }],
    flightsOut:[{
      id:'fo-gaspar', date:'2026-06-06', departureTime:'17:40', airline:'LATAM', flightNumber:'LA 3009',
      origin:'BSB', destination:'CGH', arrivalTime:'19:25', status:'CONFIRMADO',
      passenger:'Gaspar Muniz (Gospel)', isInternational:false, direction:'out', modifiedInApp:false,
    }],
    transfersIn:[], transfersOut:[],
    contact:{ name:'Gospel (Equipe)', phone:'' },
    checks: makeChecks(), incidents:[], notes:'Equipe Gospel: Jeffrey Matthew Connors + James Mich Huddleston (voos internacionais separados).',
    modifiedInApp:false, modifiedAt:null,
  },
  // RUBACK
  {
    id:'a-ruback', name:'Ruback', fullName:'Lucas, Marcos e Caio', role:'artista',
    nationality:'BR', languages:['Portuguese'], isInternational:false,
    accommodationType:'hotel',
    hotel:{ name:'CAMINHO CACHOEIRA', room:'06', category:'BANG SUPERIOR', checkIn:'2026-06-05', checkOut:'2026-06-06' },
    sets:[{ id:'s8', day:'2026-06-05', dayLabel:'JADE', stage:'ALQUIMIA', startTime:'22:30', endTime:'00:00', logisticsType:'H+T', checked:false }],
    flightsIn:[{
      id:'fi-ruback', date:'2026-06-05', departureTime:'05:20', airline:'GOL', flightNumber:'G3 1749',
      origin:'FLN', destination:'BSB', arrivalTime:'07:35', status:'CONFIRMADO',
      passenger:'Lucas, Marcos e Caio (Artistas Ruback + TM)', isInternational:false, direction:'in', modifiedInApp:false,
    }],
    flightsOut:[{
      id:'fo-ruback', date:'2026-06-06', departureTime:'09:55', airline:'LATAM', flightNumber:'LA 3001',
      origin:'BSB', destination:'CGH', arrivalTime:'11:40', status:'CONFIRMADO',
      passenger:'Lucas, Marcos e Caio (Artistas Ruback + Tour Manager)', isInternational:false, direction:'out', modifiedInApp:false,
    }],
    transfersIn:[], transfersOut:[],
    contact:{ name:'Ruback (TM)', phone:'' },
    checks: makeChecks(), incidents:[], notes:'Trio: Lucas, Marcos e Caio.',
    modifiedInApp:false, modifiedAt:null,
  },
  // DILBY
  {
    id:'a-dilby', name:'Dilby', fullName:'Dylan Syben', role:'artista',
    nationality:'NL', languages:['Dutch','English'], isInternational:true,
    accommodationType:'hotel',
    hotel:{ name:'CAMINHO CACHOEIRA', room:'07', category:'BANG SUPERIOR', checkIn:'2026-06-06', checkOut:'2026-06-08' },
    sets:[{ id:'s9', day:'2026-06-06', dayLabel:'ÁGATA', stage:'ALQUIMIA', startTime:'02:30', endTime:'04:00', logisticsType:'H+T', checked:false }],
    flightsIn:[{
      id:'fi-dilby', date:'2026-06-05', departureTime:'12:25', airline:'LATAM', flightNumber:'LA 3265',
      origin:'GRU', destination:'BSB', arrivalTime:'14:05', status:'CONFIRMADO',
      passenger:'Dylan Syben (Artista Dilby)', isInternational:false, direction:'in', modifiedInApp:false,
    }],
    flightsOut:[{
      id:'fo-dilby', date:'2026-06-08', departureTime:'12:25', airline:'LATAM', flightNumber:'LA 3264',
      origin:'BSB', destination:'GRU', arrivalTime:'14:10', status:'CONFIRMADO',
      passenger:'Dylan Syben (Artista Dilby)', isInternational:false, direction:'out', modifiedInApp:false,
    }],
    transfersIn:[], transfersOut:[],
    contact:{ name:'Dilby (TM)', phone:'' },
    checks: makeChecks(), incidents:[], notes:'',
    modifiedInApp:false, modifiedAt:null,
  },
  // BEDOUIN
  {
    id:'a-bedouin', name:'Bedouin', fullName:'Rami Abousabe e Tamer Malki', role:'artista',
    nationality:'US', languages:['English','Arabic'], isInternational:true,
    accommodationType:'hotel',
    hotel:{ name:'BAGUA', room:'01-02', category:'BANG', checkIn:'2026-06-06', checkOut:'2026-06-07' },
    sets:[{ id:'s10', day:'2026-06-06', dayLabel:'ÁGATA', stage:'MAINSTAGE', startTime:'02:00', endTime:'04:00', logisticsType:'H+T', checked:false }],
    flightsIn:[{
      id:'fi-bedouin', date:'2026-06-06', departureTime:'15:50', airline:'', flightNumber:'',
      origin:'GRU', destination:'BSB', arrivalTime:'17:30', status:'CONFIRMADO',
      passenger:'Rami Abousabe e Tamer Malki (Bedouin)', isInternational:false, direction:'in', modifiedInApp:false,
    }],
    flightsOut:[
      { id:'fo-bedouin1', date:'2026-06-07', departureTime:'12:25', airline:'', flightNumber:'', origin:'BSB', destination:'GRU', arrivalTime:'14:10', status:'CONFIRMADO', passenger:'Rami Abousabe (Bedouin)', isInternational:false, direction:'out', modifiedInApp:false },
      { id:'fo-bedouin2', date:'2026-06-07', departureTime:'19:10', airline:'', flightNumber:'', origin:'BSB', destination:'GRU', arrivalTime:'20:55', status:'CONFIRMADO', passenger:'Tamer Malki (Bedouin)', isInternational:false, direction:'out', modifiedInApp:false },
    ],
    transfersIn:[], transfersOut:[],
    contact:{ name:'TM Bedouin', phone:'' },
    checks: makeChecks(), incidents:[], notes:'Dois integrantes com voos de saída diferentes. Verificar cia aérea.',
    modifiedInApp:false, modifiedAt:null,
  },
  // TRIPOLISM
  {
    id:'a-tripolism', name:'Tripolism', fullName:'Heimisson, Thorngaard, Vendelbjerg', role:'artista',
    nationality:'IS', languages:['Icelandic','English'], isInternational:true,
    accommodationType:'hotel',
    hotel:{ name:'BAGUA', room:'03-04-05', category:'CABANA ZAZU', checkIn:'2026-06-06', checkOut:'2026-06-07' },
    sets:[{ id:'s11', day:'2026-06-06', dayLabel:'ÁGATA', stage:'MAINSTAGE', startTime:'04:00', endTime:'06:00', logisticsType:'H+T', checked:false }],
    flightsIn:[{
      id:'fi-trip', date:'2026-06-06', departureTime:'12:25', airline:'LATAM', flightNumber:'LA 3265',
      origin:'GRU', destination:'BSB', arrivalTime:'14:05', status:'CONFIRMADO',
      passenger:'Heimisson, Thorngaard, Vendelbjerg e Victor (Artistas Tripolism + TM)', isInternational:false, direction:'in', modifiedInApp:false,
    }],
    flightsOut:[{
      id:'fo-trip', date:'2026-06-07', departureTime:'15:00', airline:'LATAM', flightNumber:'LA 3528',
      origin:'BSB', destination:'GRU', arrivalTime:'16:50', status:'CONFIRMADO',
      passenger:'Heimisson, Thorngaard, Vendelbjerg e Victor (Artistas Tripolism + TM)', isInternational:false, direction:'out', modifiedInApp:false,
    }],
    transfersIn:[], transfersOut:[],
    contact:{ name:'Victor Westermann (TM)', phone:'' },
    checks: makeChecks(), incidents:[], notes:'Trio islandês. TM: Victor Westermann.',
    modifiedInApp:false, modifiedAt:null,
  },
  // OMRI GUETTA
  {
    id:'a-omri', name:'Omri Guetta', fullName:'Omri Guetta', role:'artista',
    nationality:'IL', languages:['Hebrew','English'], isInternational:true,
    accommodationType:'hotel',
    hotel:{ name:'BAGUA', room:'03', category:'CABANA ZAZU', checkIn:'2026-06-05', checkOut:'2026-06-06' },
    sets:[{ id:'s12', day:'2026-06-05', dayLabel:'JADE', stage:'MAINSTAGE', startTime:'00:00', endTime:'02:00', logisticsType:'H+T', checked:false }],
    flightsIn:[], flightsOut:[],
    transfersIn:[], transfersOut:[],
    contact:{ name:'Wellington Lopes (TM)', phone:'' },
    checks: makeChecks(), incidents:[], notes:'OMRI b2b Rafael. Voos PENDENTES.',
    modifiedInApp:false, modifiedAt:null,
  },
  // RAFAEL (Liav Rafael Shalom)
  {
    id:'a-rafael', name:'Rafael (Lasso)', fullName:'Liav Rafael Shalom', role:'artista',
    nationality:'IL', languages:['Hebrew','English'], isInternational:true,
    accommodationType:'hotel',
    hotel:{ name:'BAGUA', room:'04', category:'CABANA ZAZU', checkIn:'2026-06-05', checkOut:'2026-06-06' },
    sets:[{ id:'s13', day:'2026-06-05', dayLabel:'JADE', stage:'MAINSTAGE', startTime:'00:00', endTime:'02:00', logisticsType:'H+T', checked:false }],
    flightsIn:[], flightsOut:[],
    transfersIn:[], transfersOut:[],
    contact:{ name:'Wellington Lopes (TM Omri+Rafael)', phone:'' },
    checks: makeChecks(), incidents:[], notes:'OMRI b2b Rafael. TM compartilhado com Omri.',
    modifiedInApp:false, modifiedAt:null,
  },
  // UNFAZED
  {
    id:'a-unfazed', name:'Unfazed', fullName:'Henrique Gonçalves', role:'artista',
    nationality:'BR', languages:['Portuguese','English'], isInternational:false,
    accommodationType:'hotel',
    hotel:{ name:'CAMINHO CACHOEIRA', room:'10', category:'SUITE', checkIn:'2026-06-06', checkOut:'2026-06-07' },
    sets:[{ id:'s14', day:'2026-06-06', dayLabel:'ÁGATA', stage:'MAINSTAGE', startTime:'00:00', endTime:'02:00', logisticsType:'H+T', checked:false }],
    flightsIn:[{
      id:'fi-unfazed', date:'2026-06-06', departureTime:'11:45', airline:'LATAM', flightNumber:'LA 3281',
      origin:'VCP', destination:'BSB', arrivalTime:'13:20', status:'CONFIRMADO',
      passenger:'Henrique Gonçalves (Artista Unfazed)', isInternational:false, direction:'in', modifiedInApp:false,
    }],
    flightsOut:[{
      id:'fo-unfazed', date:'2026-06-07', departureTime:'14:25', airline:'LATAM', flightNumber:'LA 3322',
      origin:'BSB', destination:'VCP', arrivalTime:'16:00', status:'CONFIRMADO',
      passenger:'Henrique Gonçalves (Artista Unfazed)', isInternational:false, direction:'out', modifiedInApp:false,
    }],
    transfersIn:[], transfersOut:[],
    contact:{ name:'Unfazed (Direto)', phone:'' },
    checks: makeChecks(), incidents:[], notes:'',
    modifiedInApp:false, modifiedAt:null,
  },
  // EZEQUIEL ARIAS
  {
    id:'a-ezequielarias', name:'Ezequiel Arias', fullName:'Ezequiel Arias', role:'artista',
    nationality:'AR', languages:['Spanish','English'], isInternational:true,
    accommodationType:'hotel',
    hotel:{ name:'BAGUA', room:'02', category:'BANG - YAYÁ', checkIn:'2026-06-05', checkOut:'2026-06-06' },
    sets:[{ id:'s15', day:'2026-06-05', dayLabel:'JADE', stage:'MAINSTAGE', startTime:'20:00', endTime:'22:00', logisticsType:'H+T', checked:false }],
    flightsIn:[], flightsOut:[],
    transfersIn:[], transfersOut:[],
    contact:{ name:'Leandro Ruiz (TM)', phone:'' },
    checks: makeChecks(), incidents:[], notes:'Voos PENDENTES. Dar buyout para Razzy = 2 dias Bambu Brasil.',
    modifiedInApp:false, modifiedAt:null,
  },
  // AFTERCLAPP
  {
    id:'a-afterclapp', name:'Afterclapp', fullName:'Rodrigo Domingues Vellutini', role:'artista',
    nationality:'BR', languages:['Portuguese'], isInternational:false,
    accommodationType:'hotel',
    hotel:{ name:'BAMBU BRASIL', room:'18', category:'LUXO', checkIn:'2026-06-03', checkOut:'2026-06-05' },
    sets:[
      { id:'s16a', day:'2026-06-03', dayLabel:'WELCOME', stage:'WELCOME', startTime:'', endTime:'', logisticsType:'H', checked:false },
      { id:'s16b', day:'2026-06-04', dayLabel:'AMETISTA', stage:'BÉSAME', startTime:'18:00', endTime:'19:30', logisticsType:'H', checked:false },
    ],
    flightsIn:[], flightsOut:[],
    transfersIn:[], transfersOut:[],
    contact:{ name:'Afterclapp (Direto)', phone:'' },
    checks: makeChecks(), incidents:[], notes:'+ Mariana Moretti Losso (namorada). Toca Welcome e Bésame.',
    modifiedInApp:false, modifiedAt:null,
  },
  // RATIER
  {
    id:'a-ratier', name:'Ratier', fullName:'Ratier', role:'artista',
    nationality:'BR', languages:['Portuguese'], isInternational:false,
    accommodationType:'hotel',
    hotel:{ name:'CAMINHO CACHOEIRA', room:'08', category:'BANG TÉRREO', checkIn:'2026-06-04', checkOut:'2026-06-05' },
    sets:[{ id:'s17', day:'2026-06-04', dayLabel:'AMETISTA', stage:'ALQUIMIA', startTime:'22:30', endTime:'00:00', logisticsType:'T INTERNO', checked:false }],
    flightsIn:[], flightsOut:[],
    transfersIn:[], transfersOut:[],
    contact:{ name:'Ratier (Direto)', phone:'' },
    checks: makeChecks(), incidents:[], notes:'Transfer interno apenas.',
    modifiedInApp:false, modifiedAt:null,
  },
  // ELJEFFRE
  {
    id:'a-eljeffre', name:'ELJEFFRE', fullName:'ELJEFFRE', role:'artista',
    nationality:'BR', languages:['Portuguese'], isInternational:false,
    accommodationType:'proprio',
    hotel:null,
    sets:[{ id:'s18', day:'2026-06-04', dayLabel:'AMETISTA', stage:'BÉSAME', startTime:'22:30', endTime:'00:00', logisticsType:'H alto+T', checked:false }],
    flightsIn:[], flightsOut:[],
    transfersIn:[], transfersOut:[],
    contact:{ name:'ELJEFFRE (Direto)', phone:'' },
    checks: makeChecks(), incidents:[], notes:'Hotel Alto.',
    modifiedInApp:false, modifiedAt:null,
  },
  // MONOBASE
  {
    id:'a-monobase', name:'Monobase', fullName:'Monobase', role:'artista',
    nationality:'BR', languages:['Portuguese'], isInternational:false,
    accommodationType:'proprio',
    hotel:null,
    sets:[{ id:'s19', day:'2026-06-04', dayLabel:'AMETISTA', stage:'BÉSAME', startTime:'00:00', endTime:'02:00', logisticsType:'H alto+T', checked:false }],
    flightsIn:[], flightsOut:[],
    transfersIn:[], transfersOut:[],
    contact:{ name:'Monobase (Direto)', phone:'' },
    checks: makeChecks(), incidents:[], notes:'',
    modifiedInApp:false, modifiedAt:null,
  },
  // BHASKAR
  {
    id:'a-bhaskar', name:'Bhaskar', fullName:'Bhaskar', role:'artista',
    nationality:'BR', languages:['Portuguese'], isInternational:false,
    accommodationType:'proprio',
    hotel:null,
    sets:[
      { id:'s20a', day:'2026-06-06', dayLabel:'ÁGATA', stage:'ALQUIMIA', startTime:'04:00', endTime:'06:00', logisticsType:'C', checked:false },
      { id:'s20b', day:'2026-06-06', dayLabel:'AFTER', stage:'AFTER', startTime:'03:30', endTime:'05:00', logisticsType:'C', checked:false },
    ],
    flightsIn:[], flightsOut:[], transfersIn:[], transfersOut:[],
    contact:{ name:'Bhaskar (Direto)', phone:'' },
    checks: makeChecks(), incidents:[], notes:'Toca ÁGATA Alquimia e After.',
    modifiedInApp:false, modifiedAt:null,
  },
  // LOCAL ARTISTS (cachê - sem logística própria)
  ...['Gabriel Brasil','Kant','Solarce Brothers','Bauhouse','Yumi Project','Hoo','Luke & Alvarez','Curol',
    'Aidden','Rod Brito','Greggio','Ashibah','Ekanta','Mojjo','Locmotion','Camila Jun','Simo Not Simon',
    'From House to Disco','Analu','Malu','Kaala Shaw','Sonnero','Gate79','Doozie',
    'Swarup','Tonaco'].map((name, i) => ({
    id:`a-local-${i}`, name, fullName:name, role:'artista',
    nationality:'BR', languages:['Portuguese'], isInternational:false,
    accommodationType:'proprio', hotel:null,
    sets:[{ id:`sl-${i}`, day:'2026-06-04', dayLabel:'AMETISTA', stage:'', startTime:'', endTime:'', logisticsType:'C', checked:false }],
    flightsIn:[], flightsOut:[], transfersIn:[], transfersOut:[],
    contact:{ name:'', phone:'' },
    checks: makeChecks(), incidents:[], notes:'Artista local / cachê. Sem logística contratada.',
    modifiedInApp:false, modifiedAt:null,
  })),
]

// Pre-populate local artists with correct set info
const localSetData = {
  'Gabriel Brasil': { day:'2026-06-04', stage:'ALQUIMIA', startTime:'18:00', logisticsType:'C' },
  'Kant':           { day:'2026-06-04', stage:'ALQUIMIA', startTime:'19:30', logisticsType:'C' },
  'Solarce Brothers':{ day:'2026-06-04', stage:'BÉSAME', startTime:'21:00', logisticsType:'C' },
  'Bauhouse':       { day:'2026-06-04', stage:'BÉSAME', startTime:'19:30', logisticsType:'C' },
  'Yumi Project':   { day:'2026-06-04', stage:'MAINSTAGE', startTime:'16:00', logisticsType:'C' },
  'Hoo':            { day:'2026-06-04', stage:'MAINSTAGE', startTime:'18:00', logisticsType:'C' },
  'Luke & Alvarez': { day:'2026-06-05', stage:'MAINSTAGE', startTime:'16:00', logisticsType:'C' },
  'Curol':          { day:'2026-06-05', stage:'MAINSTAGE', startTime:'18:00', logisticsType:'T' },
  'Aidden':         { day:'2026-06-06', stage:'MAINSTAGE', startTime:'22:00', logisticsType:'C' },
  'Rod Brito':      { day:'2026-06-05', stage:'ALQUIMIA', startTime:'18:00', logisticsType:'T INTERNO' },
  'Greggio':        { day:'2026-06-05', stage:'ALQUIMIA', startTime:'19:30', logisticsType:'C' },
  'Ashibah':        { day:'2026-06-05', stage:'ALQUIMIA', startTime:'21:00', logisticsType:'C' },
  'Ekanta':         { day:'2026-06-05', stage:'ALQUIMIA', startTime:'02:00', logisticsType:'BUY OUT' },
  'Mojjo':          { day:'2026-06-05', stage:'BÉSAME', startTime:'18:00', logisticsType:'C' },
  'Locmotion':      { day:'2026-06-05', stage:'BÉSAME', startTime:'19:30', logisticsType:'C' },
  'Camila Jun':     { day:'2026-06-05', stage:'BÉSAME', startTime:'21:00', logisticsType:'T INTERNO' },
  'Simo Not Simon': { day:'2026-06-05', stage:'BÉSAME', startTime:'22:30', logisticsType:'C' },
  'From House to Disco':{ day:'2026-06-06', stage:'BÉSAME', startTime:'22:00', logisticsType:'T INTERNO' },
  'Analu':          { day:'2026-06-06', stage:'BÉSAME', startTime:'00:00', logisticsType:'C' },
  'Malu':           { day:'2026-06-06', stage:'BÉSAME', startTime:'02:00', logisticsType:'C' },
  'Kaala Shaw':     { day:'2026-06-06', stage:'BÉSAME', startTime:'04:00', logisticsType:'C' },
  'Sonnero':        { day:'2026-06-06', stage:'ALQUIMIA', startTime:'22:00', logisticsType:'C' },
  'Gate79':         { day:'2026-06-06', stage:'ALQUIMIA', startTime:'23:30', logisticsType:'C' },
  'Doozie':         { day:'2026-06-06', stage:'ALQUIMIA', startTime:'01:00', logisticsType:'C' },
  'Swarup':         { day:'2026-06-06', stage:'AFTER', startTime:'02:00', logisticsType:'BUY OUT' },
  'Tonaco':         { day:'2026-06-06', stage:'MAINSTAGE', startTime:'22:00', logisticsType:'C' },
}

const dayLabelMap = {
  '2026-06-03':'WELCOME','2026-06-04':'AMETISTA','2026-06-05':'JADE','2026-06-06':'ÁGATA/AFTER',
}

INITIAL_ARTISTS.forEach(a => {
  if (localSetData[a.name] && a.sets?.[0]) {
    const d = localSetData[a.name]
    a.sets[0].day = d.day
    a.sets[0].dayLabel = dayLabelMap[d.day] || d.day
    a.sets[0].stage = d.stage
    a.sets[0].startTime = d.startTime
    a.sets[0].logisticsType = d.logisticsType
  }
})

export const INITIAL_DRIVERS = []

export const INITIAL_TRANSFERS_AERO   = []
export const INITIAL_TRANSFERS_INTERNO = []

export const DEFAULT_USERS = [
  { id:'u1', name:'Admin', email:'admin@quartzo.com', password:'quartzo2026', role:'admin' },
  { id:'u2', name:'Motorista', email:'motorista@quartzo.com', password:'motor2026', role:'readonly' },
]
