import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import { 
  Users, UserCheck, LogOut, Shield, Database, Sparkles, Lock, Unlock, 
  CheckCircle2, AlertTriangle, CalendarRange, FileText, Bell, ShieldAlert, MapPin
} from 'lucide-react';

export default function Dashboard() {
  const { user, logout, isMockMode, changeRoleSimulated } = useAuth();
  
  // Estado para capturar las respuestas de simulación de cada API de módulo
  const [apiData, setApiData] = useState({});
  const [apiErrors, setApiErrors] = useState({});
  const [loadingModules, setLoadingModules] = useState({});

  // Lista de Módulos Oficiales del Sistema de Guardia (SIGCGOE)
  const modulesList = [
    {
      id: 'guardia_admin',
      title: 'MOD-01: Administración General',
      description: 'Gestión de nomencladores (áreas, departamentos, sedes, cargos), roles y permisos. Sincronización con ASSET y SIGENU.',
      allowedRoles: ['SUPERADMIN'],
      endpoint: 'guardia_admin/dashboard/',
      icon: Database,
      color: 'from-blue-600 to-indigo-600',
    },
    {
      id: 'usuarios',
      title: 'MOD-02: Gestión de Usuarios y Perfiles',
      description: 'Completamiento de datos personales, teléfono, WhatsApp, y consulta individual del cronograma anual de guardia.',
      allowedRoles: ['SUPERADMIN', 'JEFE_SEGURIDAD', 'RESPONSABLE_AREA', 'RESPONSABLE_DEPARTAMENTO', 'TRABAJADOR', 'ESTUDIANTE'],
      endpoint: 'usuarios/dashboard/',
      icon: Users,
      color: 'from-emerald-600 to-teal-600',
    },
    {
      id: 'compromiso_obrero',
      title: 'MOD-03: Compromiso de Guardia Obrera',
      description: 'Flujo de firma de compromiso de guardia activa para trabajadores de la UHO, seleccionando sede y turnos preferidos.',
      allowedRoles: ['SUPERADMIN', 'RESPONSABLE_AREA', 'RESPONSABLE_DEPARTAMENTO', 'TRABAJADOR'],
      endpoint: 'compromiso/obrero/',
      icon: UserCheck,
      color: 'from-indigo-600 to-violet-600',
    },
    {
      id: 'compromiso_estudiantil',
      title: 'MOD-04: Compromiso de Guardia Estudiantil',
      description: 'Flujo específico e independiente para firma de compromiso de estudiantes activos de la UHO con preselecciones por defecto.',
      allowedRoles: ['SUPERADMIN', 'RESPONSABLE_AREA', 'ESTUDIANTE'],
      endpoint: 'compromiso/estudiantil/',
      icon: UserCheck,
      color: 'from-violet-600 to-purple-600',
    },
    {
      id: 'potencial',
      title: 'MOD-05: Potencial de Guardia',
      description: 'Revisión del listado de potencial comprometido por área/departamento, inclusión manual por lote y aprobación irreversible.',
      allowedRoles: ['SUPERADMIN', 'RESPONSABLE_AREA', 'RESPONSABLE_DEPARTAMENTO'],
      endpoint: 'potencial/dashboard/',
      icon: Shield,
      color: 'from-red-600 to-rose-600',
    },
    {
      id: 'distribucion',
      title: 'MOD-06: Distribución de Guardia',
      description: 'Asignación mensual de días a departamentos por parte del Jefe de Seguridad, y asignación de guardias específicos a cada día.',
      allowedRoles: ['SUPERADMIN', 'JEFE_SEGURIDAD', 'RESPONSABLE_AREA', 'RESPONSABLE_DEPARTAMENTO'],
      endpoint: 'distribucion/dashboard/',
      icon: CalendarRange,
      color: 'from-amber-600 to-orange-600',
    },
    {
      id: 'control',
      title: 'MOD-07: Control de Guardia',
      description: 'Registro de asistencia y cumplimiento el día de la guardia con evaluación cualitativa (Bien, Regular, Mal) y observaciones.',
      allowedRoles: ['SUPERADMIN', 'JEFE_SEGURIDAD', 'RESPONSABLE_AREA', 'RESPONSABLE_DEPARTAMENTO'],
      endpoint: 'control/dashboard/',
      icon: ShieldAlert,
      color: 'from-pink-600 to-fuchsia-600',
    },
    {
      id: 'reportes',
      title: 'MOD-08: Reportes y Dashboard',
      description: 'Panel gráfico de métricas e indicadores de cumplimiento, búsqueda global de personas y exportación a PDF y Excel.',
      allowedRoles: ['SUPERADMIN', 'JEFE_SEGURIDAD', 'RESPONSABLE_AREA', 'RESPONSABLE_DEPARTAMENTO'],
      endpoint: 'reportes/dashboard/',
      icon: FileText,
      color: 'from-fuchsia-600 to-pink-600',
    },
    {
      id: 'notificaciones',
      title: 'MOD-09: Notificaciones',
      description: 'Alertas automáticas por correo electrónico y campana interna para recordatorios de guardia y apertura/cierre de periodos.',
      allowedRoles: ['SUPERADMIN', 'JEFE_SEGURIDAD', 'RESPONSABLE_AREA', 'RESPONSABLE_DEPARTAMENTO', 'TRABAJADOR', 'ESTUDIANTE'],
      endpoint: 'notificaciones/dashboard/',
      icon: Bell,
      color: 'from-cyan-600 to-sky-600',
    },
    {
      id: 'api_rest',
      title: 'MOD-10: API REST',
      description: 'Endpoints de consulta segura autenticados mediante JWT y documentados con Swagger/OpenAPI para la UHO.',
      allowedRoles: ['SUPERADMIN', 'JEFE_SEGURIDAD'],
      endpoint: 'docs/',
      icon: Database,
      color: 'from-slate-600 to-slate-700',
    },
  ];

  const handleSimulateApi = async (mod) => {
    // Si el usuario no tiene permisos según el frontend, podemos simular el bloqueo
    const hasPermission = mod.allowedRoles.includes(user.role);
    
    setLoadingModules(prev => ({ ...prev, [mod.id]: true }));
    setApiData(prev => ({ ...prev, [mod.id]: null }));
    setApiErrors(prev => ({ ...prev, [mod.id]: null }));

    // Pequeño retardo visual para simular respuesta de red de servidor
    await new Promise(resolve => setTimeout(resolve, 800));

    if (!hasPermission) {
      setApiErrors(prev => ({ 
        ...prev, 
        [mod.id]: `Acceso Denegado (RBAC): El rol "${user.role}" no tiene permisos para acceder al endpoint /api/${mod.endpoint}` 
      }));
      setLoadingModules(prev => ({ ...prev, [mod.id]: false }));
      return;
    }

    try {
      if (user.isMock) {
        // Simular respuesta del backend en modo offline (Mock)
        let mockResponse = {};
        if (mod.id === 'guardia_admin') {
          mockResponse = {
            modulo: "Administración de Guardia UHO (Simulado)",
            nomencladores: { sedes: 4, areas: 12, departamentos: 34 },
            sincronizacion: { ultimo_asset: "Hoy 08:30 AM", ultimo_sigenu: "Hoy 09:00 AM", estado: "Sincronizado" }
          };
        } else if (mod.id === 'usuarios') {
          mockResponse = {
            modulo: "Perfiles y Usuarios (Simulado)",
            usuario_actual: user.username,
            rol_activo: user.role,
            cronograma: [
              { fecha: "2026-06-15", sede: "Sede Oscar Lucero Moya", tipo: "Nocturna", estado: "Pendiente" },
              { fecha: "2026-07-20", sede: "Sede Oscar Lucero Moya", tipo: "Nocturna", estado: "Pendiente" }
            ]
          };
        } else if (mod.id === 'compromiso_obrero') {
          mockResponse = {
            modulo: "Compromiso Obrero (Simulado)",
            estado_compromiso: "Comprometido",
            preferencia_sede: "Sede Oscar Lucero Moya",
            preferencia_tipo: "Nocturna",
            fecha_registro: "2026-06-02 10:15 AM"
          };
        } else if (mod.id === 'compromiso_estudiantil') {
          mockResponse = {
            modulo: "Compromiso Estudiantil (Simulado)",
            estado_compromiso: "Comprometido",
            preferencia_sede: "Sede Manuel Aguilera",
            preferencia_tipo: "Diurna",
            facultad: user.departamento
          };
        } else if (mod.id === 'potencial') {
          mockResponse = {
            modulo: "Potencial de Área (Simulado)",
            departamento: user.departamento,
            total_potencial: 48,
            comprometidos: 42,
            pendientes: 6,
            estado_aprobacion: "Aprobado (Irreversible)"
          };
        } else if (mod.id === 'distribucion') {
          mockResponse = {
            modulo: "Distribución de Guardias (Simulado)",
            dias_asignados_mes: [5, 12, 19, 26],
            personas_por_dia: {
              "5": ["Roberto Pérez", "Ana Leyva"],
              "12": ["Carlos Gómez", "Luis Martínez"]
            }
          };
        } else if (mod.id === 'control') {
          mockResponse = {
            modulo: "Control Diario (Simulado)",
            guardia_del_dia: "2026-06-02",
            listado: [
              { nombre: "Roberto Pérez", rol: "Obrero", asistio: true, evaluacion: "B" },
              { nombre: "Carlos Gómez", rol: "Estudiante", asistio: true, evaluacion: "B" }
            ],
            registrado_por: "Lic. Ramón Valdés"
          };
        } else if (mod.id === 'reportes') {
          mockResponse = {
            modulo: "Reportes y Dashboard (Simulado)",
            tasa_cumplimiento: "94.8%",
            ausencias_mes: 3,
            guardias_totales_mes: 56,
            alertas: "Sin incidencias graves"
          };
        } else if (mod.id === 'notificaciones') {
          mockResponse = {
            modulo: "Notificaciones de Guardia (Simulado)",
            campana: [
              { id: 1, mensaje: "Recordatorio: Tienes guardia asignada para el 15 de Junio", leido: false },
              { id: 2, mensaje: "El periodo de compromisos estudiantiles ha sido abierto", leido: true }
            ]
          };
        } else if (mod.id === 'api_rest') {
          mockResponse = {
            modulo: "API REST Swagger (Simulado)",
            estado: "Swagger Activo en http://localhost:8000/api/docs/",
            endpoints: [
              "GET /api/guardia_admin/dashboard/",
              "POST /api/compromiso/obrero/",
              "POST /api/compromiso/estudiantil/",
              "GET /api/potencial/dashboard/"
            ]
          };
        }

        setApiData(prev => ({ ...prev, [mod.id]: mockResponse }));
      } else {
        // Llamada API real al Backend Django REST
        const response = await API.get(mod.endpoint);
        setApiData(prev => ({ ...prev, [mod.id]: response.data }));
      }
    } catch (err) {
      setApiErrors(prev => ({ 
        ...prev, 
        [mod.id]: err.response?.data?.detail || "Error al conectar con la API del Backend. Compruebe que Django está corriendo y las migraciones se aplicaron." 
      }));
    } finally {
      setLoadingModules(prev => ({ ...prev, [mod.id]: false }));
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-12">
      {/* HEADER DE LA UNIVERSIDAD */}
      <header className="glass sticky top-0 z-40 border-b border-slate-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-uho to-emerald-800 text-white shadow-lg shadow-uho/10">
              <Sparkles className="h-6 w-6 text-uho-accent" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                SIGCGOE UHO
                <span className="text-xs px-2 py-0.5 rounded-full bg-uho-accent/10 text-uho-accent border border-uho-accent/20">
                  Boilerplate v1.0
                </span>
              </h1>
              <p className="text-xs text-slate-400 font-medium">
                Universidad de Holguín "Oscar Lucero Moya"
              </p>
            </div>
          </div>

          {/* PERFIL DE USUARIO Y SIMULADOR DE ROLES */}
          <div className="flex items-center flex-wrap gap-4">
            {/* RBAC SELECTOR */}
            <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800">
              <Shield className="h-4 w-4 text-uho-accent" />
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Rol Activo:</span>
              <select 
                value={user?.role} 
                onChange={(e) => changeRoleSimulated(e.target.value)}
                className="bg-transparent text-xs text-slate-200 font-bold focus:outline-none cursor-pointer hover:text-uho-accent transition-colors"
              >
                <option value="SUPERADMIN" className="bg-slate-900">SUPERADMIN</option>
                <option value="JEFE_SEGURIDAD" className="bg-slate-900">JEFE SEGURIDAD</option>
                <option value="RESPONSABLE_AREA" className="bg-slate-900">RESP. ÁREA</option>
                <option value="RESPONSABLE_DEPARTAMENTO" className="bg-slate-900">RESP. DEPTO</option>
                <option value="TRABAJADOR" className="bg-slate-900">TRABAJADOR</option>
                <option value="ESTUDIANTE" className="bg-slate-900">ESTUDIANTE</option>
              </select>
            </div>

            {/* USER STATS */}
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-slate-200">{user?.first_name} {user?.last_name}</p>
                <p className="text-[10px] text-slate-500">{user?.departamento}</p>
              </div>
              <button 
                onClick={logout}
                className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-red-950/30 text-slate-400 hover:text-red-400 transition-colors"
                title="Cerrar Sesión"
              >
                <LogOut className="h-4.5 w-4.5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* DASHBOARD CONTAINER */}
      <main className="max-w-7xl mx-auto px-6 mt-8">
        
        {/* BANNER INSTITUCIONAL */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-uho/40 via-emerald-950/20 to-slate-950 border border-slate-800/80 p-8 mb-8">
          <div className="absolute right-0 top-0 h-full w-[350px] opacity-10 pointer-events-none">
            <svg viewBox="0 0 100 100" fill="currentColor" className="text-uho-accent h-full w-full">
              <polygon points="50,15 90,35 90,65 50,85 10,65 10,35" />
            </svg>
          </div>

          <div className="max-w-2xl relative z-10">
            <span className="px-3 py-1 rounded-full bg-emerald-950/60 text-emerald-300 border border-emerald-800/40 text-[11px] font-bold uppercase tracking-wider">
              Tesis Universitaria 2027
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100 mt-4 leading-tight">
              Sistema Integral para la Gestión y Control de la Guardia Obrera y Estudiantil (SIGCGOE)
            </h2>
            <p className="text-slate-400 text-sm mt-3 leading-relaxed">
              Plantilla base institucional de guardia adaptada y unificada. Utilice el selector de roles en la cabecera para simular la seguridad basada en roles (RBAC) y auditar cómo responde cada módulo lógico en caliente.
            </p>

            {isMockMode && (
              <div className="inline-flex items-center gap-2 mt-5 px-3.5 py-1.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-medium">
                <Database className="h-4 w-4" />
                <span>Simulación Local Activada (Offline). No requiere backend activo.</span>
              </div>
            )}
          </div>
        </div>

        {/* METRICAS RAPIDAS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Trabajadores', val: '1,420', desc: 'Obreros Comprometidos', icon: Users, color: 'text-blue-400' },
            { label: 'Estudiantes', val: '3,852', desc: 'Guardia Estudiantil Activa', icon: Users, color: 'text-emerald-400' },
            { label: 'Sedes UHO', val: '4 Sedes', desc: 'Oscar Lucero, Aguilera, etc.', icon: MapPin, color: 'text-amber-400' },
            { label: 'Guardia de Hoy', val: '12 Asignados', desc: 'Control en tiempo real', icon: Shield, color: 'text-cyan-400' },
          ].map((card, idx) => (
            <div key={idx} className="glass-card rounded-2xl p-5 border border-slate-900">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-400">{card.label}</span>
                <card.icon className={`h-5 w-5 ${card.color}`} />
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-100">{card.val}</h3>
              <p className="text-[10px] text-slate-500 mt-1 font-medium">{card.desc}</p>
            </div>
          ))}
        </div>

        {/* SECCION DE MODULOS */}
        <h3 className="text-lg font-bold text-slate-100 mb-6 flex items-center gap-2">
          <Database className="h-5 w-5 text-uho-accent" />
          Módulos de Gestión de la Guardia
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {modulesList.map((mod) => {
            const hasPermission = mod.allowedRoles.includes(user.role);
            const mockResponse = apiData[mod.id];
            const mockError = apiErrors[mod.id];
            const isLoading = loadingModules[mod.id];

            return (
              <div key={mod.id} className="glass-card rounded-3xl p-6 flex flex-col justify-between border border-slate-900/60 overflow-hidden relative">
                {/* Indicador de permiso de Frontend */}
                <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase">
                  {hasPermission ? (
                    <span className="bg-emerald-950/60 text-emerald-400 border border-emerald-800/40 flex items-center gap-1">
                      <Unlock className="h-3 w-3" />
                      Permitido
                    </span>
                  ) : (
                    <span className="bg-red-950/60 text-red-400 border border-red-800/40 flex items-center gap-1">
                      <Lock className="h-3 w-3" />
                      Restringido
                    </span>
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-2.5 rounded-xl bg-gradient-to-br ${mod.color} text-white shadow-md`}>
                      <mod.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-100 text-base">{mod.title}</h4>
                      <span className="text-[9px] text-slate-500 font-semibold uppercase tracking-wider">
                        Ruta: /api/{mod.endpoint}
                      </span>
                    </div>
                  </div>

                  <p className="text-slate-400 text-xs leading-relaxed mb-5">
                    {mod.description}
                  </p>

                  {/* ROLES AUTORIZADOS */}
                  <div className="mb-6">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-2">
                      Roles Autorizados (RBAC):
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {mod.allowedRoles.map((role) => (
                        <span 
                          key={role} 
                          className={`text-[9px] px-2 py-0.5 rounded-md font-semibold border ${
                            role === user.role
                              ? 'bg-uho-accent/15 text-uho-accent border-uho-accent/30 font-bold'
                              : 'bg-slate-900 text-slate-400 border-slate-800'
                          }`}
                        >
                          {role}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* AREA DE SIMULACION Y RESPUESTA DE API */}
                <div className="mt-auto space-y-4">
                  
                  {/* BOTON EJECUTAR */}
                  <button
                    onClick={() => handleSimulateApi(mod)}
                    disabled={isLoading}
                    className={`w-full py-2 px-4 rounded-xl text-xs font-semibold tracking-wide transition-all flex items-center justify-center gap-2 ${
                      hasPermission
                        ? 'bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-200'
                        : 'bg-red-950/20 hover:bg-red-950/40 border border-red-900/30 text-red-300'
                    }`}
                  >
                    {isLoading ? (
                      <div className="h-4 w-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <span>Consultar Módulo</span>
                        {hasPermission ? <Unlock className="h-3.5 w-3.5" /> : <Lock className="h-3.5 w-3.5 text-red-400" />}
                      </>
                    )}
                  </button>

                  {/* RESPUESTA EXITOSA DE LA API */}
                  {mockResponse && (
                    <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-900/40 text-xs animate-fadeIn">
                      <div className="flex items-center gap-2 text-emerald-400 font-bold mb-2">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Respuesta Exitosa (HTTP 200 OK):</span>
                      </div>
                      <pre className="text-[10px] text-slate-300 font-mono overflow-x-auto p-2 bg-slate-950/80 rounded-lg max-h-[150px]">
                        {JSON.stringify(mockResponse, null, 2)}
                      </pre>
                    </div>
                  )}

                  {/* RESPUESTA ERRONEA / BLOQUEADA */}
                  {mockError && (
                    <div className="p-4 rounded-2xl bg-red-950/30 border border-red-900/40 text-xs animate-fadeIn">
                      <div className="flex items-center gap-2 text-red-400 font-bold mb-2">
                        <AlertTriangle className="h-4 w-4" />
                        <span>Fallo de Seguridad (HTTP 403 Forbidden):</span>
                      </div>
                      <p className="text-[10px] text-slate-300 leading-relaxed font-mono">
                        {mockError}
                      </p>
                    </div>
                  )}

                </div>
              </div>
            );
          })}
        </div>

      </main>
    </div>
  );
}
