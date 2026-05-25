// Flat translations used by all components
const translations = {
  pt: {
    // Nav
    dashboard: 'Dashboard',
    artists:   'Artistas',
    flights:   'Voos',
    transfers: 'Traslados',
    hotels:    'Hospedagem',
    timetable: 'Time Table',
    drivers:   'Motoristas',
    settings:  'Configurações',
    logout:    'Sair',
    collapse:  'Recolher',

    // Auth
    login:      'Entrar',
    email:      'Email',
    password:   'Senha',
    enter:      'Acessar',
    loginError: 'Email ou senha incorretos.',

    // Header
    searchPlaceholder: 'Buscar artista, voo, hotel...',
    alerts:            'Alertas',
    noAlerts:          'Sem alertas no momento.',
    importExcel:       'Importar',
    exportExcel:       'Exportar',
    importing:         'Importando...',
    importSuccess:     'Importação concluída',
    recordsAdded:      'registros adicionados/atualizados',
    conflictsFound:    'Conflitos encontrados',
    conflictsDesc:     'Os itens abaixo diferem da base atual. Deseja aplicar mesmo assim?',
    applyAll:          'Aplicar tudo',
    cancel:            'Cancelar',
    importError:       'Erro na importação',

    // Dashboard
    totalArtists:   'Total Artistas',
    withFlights:    'Com Voos',
    withHotel:      'Com Hotel',
    checksComplete: 'Completos',
    criticalAlerts: 'Alertas Críticos',
    warnings:       'Avisos',

    // Artists
    filters: 'Filtros',

    // AI Chatbot
    aiChatbot: 'Assistente IA',
    clearChat:  'Limpar conversa',

    // Drivers
    addDriver:    'Novo Motorista',
    driverName:   'Nome',
    driverPhone:  'Telefone',
    driverVehicle:'Veículo',
    driverPlate:  'Placa',
    noDrivers:    'Nenhum motorista cadastrado.',

    // Settings
    apiKeyLabel:  'Chave API Anthropic',
    apiKeyDesc:   'Usada pelo chatbot IA. Configure no painel do Netlify como ANTHROPIC_API_KEY.',
    save:         'Salvar',
    saved:        'Salvo!',
    language:     'Idioma',
    dangerZone:   'Zona de Risco',
    resetData:    'Resetar dados locais',
    resetConfirm: 'Tem certeza? Isso apagará todos os dados locais e carregará o estado inicial.',
  },
  en: {
    // Nav
    dashboard: 'Dashboard',
    artists:   'Artists',
    flights:   'Flights',
    transfers: 'Transfers',
    hotels:    'Hotels',
    timetable: 'Time Table',
    drivers:   'Drivers',
    settings:  'Settings',
    logout:    'Log out',
    collapse:  'Collapse',

    // Auth
    login:      'Sign in',
    email:      'Email',
    password:   'Password',
    enter:      'Enter',
    loginError: 'Incorrect email or password.',

    // Header
    searchPlaceholder: 'Search artist, flight, hotel...',
    alerts:            'Alerts',
    noAlerts:          'No alerts at this time.',
    importExcel:       'Import',
    exportExcel:       'Export',
    importing:         'Importing...',
    importSuccess:     'Import complete',
    recordsAdded:      'records added/updated',
    conflictsFound:    'Conflicts found',
    conflictsDesc:     'The items below differ from current data. Apply anyway?',
    applyAll:          'Apply all',
    cancel:            'Cancel',
    importError:       'Import error',

    // Dashboard
    totalArtists:   'Total Artists',
    withFlights:    'With Flights',
    withHotel:      'With Hotel',
    checksComplete: 'Complete',
    criticalAlerts: 'Critical Alerts',
    warnings:       'Warnings',

    // Artists
    filters: 'Filters',

    // AI Chatbot
    aiChatbot: 'AI Assistant',
    clearChat:  'Clear chat',

    // Drivers
    addDriver:    'New Driver',
    driverName:   'Name',
    driverPhone:  'Phone',
    driverVehicle:'Vehicle',
    driverPlate:  'Plate',
    noDrivers:    'No drivers registered.',

    // Settings
    apiKeyLabel:  'Anthropic API Key',
    apiKeyDesc:   'Used by the AI chatbot. Set in Netlify dashboard as ANTHROPIC_API_KEY.',
    save:         'Save',
    saved:        'Saved!',
    language:     'Language',
    dangerZone:   'Danger Zone',
    resetData:    'Reset local data',
    resetConfirm: 'Are you sure? This will erase all local data and load the initial state.',
  },
}

export function useI18n(lang = 'pt') {
  const locale = translations[lang] || translations.pt
  return {
    t: (key) => locale[key] ?? key,
    lang,
  }
}
