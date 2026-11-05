// Configuracion y esquemas para las 20 entidades del sistema FleetOps
export const ENTITY_CATEGORIES = [
  { id: 'mantenimiento', title: 'Mantenimiento & Costos' },
  { id: 'flota', title: 'Flota & Unidades' },
  { id: 'logistica', title: 'Logistica & Rutas' },
  { id: 'seguridad', title: 'Seguridad & Polizas' },
  { id: 'neumaticos', title: 'Neumaticos' },
  { id: 'operaciones', title: 'Operaciones & Seguridad Vial' }
];

export const ENTITIES = {
  // 1. ORDENES DE MANTENIMIENTO
  'ordenes-mantenimiento': {
    key: 'ordenes-mantenimiento',
    singular: 'Orden de Mantenimiento',
    plural: 'Ordenes de Mantenimiento',
    category: 'mantenimiento',
    endpoint: '/api/ordenes-mantenimiento',
    description: 'Control de servicios preventivos y correctivos en talleres externos para evitar vehiculos fuera de servicio.',
    fields: [
      { name: 'vehiculo_id', label: 'Vehiculo (Placa)', type: 'select', required: true, refEntity: 'vehiculos', refValue: 'id', refLabel: 'placa' },
      { name: 'taller_id', label: 'Taller / Proveedor', type: 'select', required: true, refEntity: 'talleres-proveedores', refValue: 'id', refLabel: 'nombre_comercial' },
      { name: 'tipo_mantenimiento', label: 'Tipo Mantenimiento', type: 'select', required: true, options: ['preventivo', 'correctivo'] },
      { name: 'estado', label: 'Estado', type: 'select', required: true, options: ['abierta', 'en_proceso', 'completada', 'cancelada'], defaultValue: 'abierta' },
      { name: 'fecha_apertura', label: 'Fecha Apertura', type: 'date', required: true },
      { name: 'fecha_cierre', label: 'Fecha Cierre', type: 'date' },
      { name: 'km_registro', label: 'Kilometraje Registrado', type: 'number', required: true },
      { name: 'costo_mano_obra', label: 'Costo Mano de Obra ($)', type: 'number', required: true, defaultValue: 0 },
      { name: 'costo_total', label: 'Costo Total Acumulado ($)', type: 'number', defaultValue: 0 },
      { name: 'descripcion_problema', label: 'Descripcion del Diagnostico / Problema', type: 'textarea', fullWidth: true }
    ],
    tableColumns: [
      { key: 'id', label: 'ID' },
      { key: 'vehiculo', label: 'Vehiculo', render: (row) => row.vehiculo ? row.vehiculo.placa : `#${row.vehiculo_id}` },
      { key: 'taller', label: 'Taller', render: (row) => row.taller ? row.taller.nombre_comercial : `#${row.taller_id}` },
      { key: 'tipo_mantenimiento', label: 'Tipo', badge: true },
      { key: 'costo_total', label: 'Costo Total', render: (row) => `$${Number(row.costo_total || 0).toLocaleString()}` },
      { key: 'fecha_apertura', label: 'Apertura' },
      { key: 'estado', label: 'Estado', badge: true }
    ]
  },

  // 2. DETALLE REPUESTOS ORDEN
  'detalles-repuestos-orden': {
    key: 'detalles-repuestos-orden',
    singular: 'Detalle de Repuesto en Orden',
    plural: 'Detalle de Repuestos',
    category: 'mantenimiento',
    endpoint: '/api/detalles-repuestos-orden',
    description: 'Relacion M:N que asocia repuestos en ordenes con calculo de costo automatico.',
    fields: [
      { name: 'orden_id', label: 'Orden de Mantenimiento', type: 'select', required: true, refEntity: 'ordenes-mantenimiento', refValue: 'id', refLabel: 'id', formatLabel: (o) => `Orden #${o.id} (${o.tipo_mantenimiento})` },
      { name: 'repuesto_id', label: 'Repuesto del Catalogo', type: 'select', required: true, refEntity: 'catalogo-repuestos', refValue: 'id', refLabel: 'nombre', formatLabel: (r) => `${r.codigo_parte} - ${r.nombre} ($${r.precio_referencia})` },
      { name: 'cantidad', label: 'Cantidad Utilizada', type: 'number', required: true, defaultValue: 1 },
      { name: 'precio_unitario', label: 'Precio Unitario ($)', type: 'number', required: true, defaultValue: 0 },
      { name: 'subtotal', label: 'Subtotal ($)', type: 'number', defaultValue: 0 }
    ],
    tableColumns: [
      { key: 'id', label: 'ID' },
      { key: 'orden', label: 'Orden', render: (row) => `Orden #${row.orden_id}` },
      { key: 'repuesto', label: 'Repuesto', render: (row) => row.repuesto ? `${row.repuesto.codigo_parte} - ${row.repuesto.nombre}` : `#${row.repuesto_id}` },
      { key: 'cantidad', label: 'Cantidad' },
      { key: 'precio_unitario', label: 'Precio Unit.', render: (row) => `$${Number(row.precio_unitario || 0).toLocaleString()}` },
      { key: 'subtotal', label: 'Subtotal', render: (row) => `$${Number(row.subtotal || 0).toLocaleString()}` }
    ]
  },

  // 3. CATALOGO DE REPUESTOS
  'catalogo-repuestos': {
    key: 'catalogo-repuestos',
    singular: 'Repuesto de Catalogo',
    plural: 'Catalogo de Repuestos',
    category: 'mantenimiento',
    endpoint: '/api/catalogo-repuestos',
    description: 'Registro de piezas, refacciones y precios referenciales para evitar sobrecostos en reparaciones mecanicas.',
    fields: [
      { name: 'codigo_parte', label: 'Codigo de Parte Unico', type: 'text', required: true },
      { name: 'nombre', label: 'Nombre del Repuesto', type: 'text', required: true },
      { name: 'categoria_repuesto', label: 'Categoria (Filtros, Frenos, Motor...)', type: 'text' },
      { name: 'precio_referencia', label: 'Precio Referencial ($)', type: 'number', required: true, defaultValue: 0 },
      { name: 'stock_almacen', label: 'Stock en Almacen', type: 'number', required: true, defaultValue: 0 }
    ],
    tableColumns: [
      { key: 'id', label: 'ID' },
      { key: 'codigo_parte', label: 'Codigo', badge: true },
      { key: 'nombre', label: 'Nombre' },
      { key: 'categoria_repuesto', label: 'Categoria' },
      { key: 'precio_referencia', label: 'Precio Ref.', render: (row) => `$${Number(row.precio_referencia || 0).toLocaleString()}` },
      { key: 'stock_almacen', label: 'Stock' }
    ]
  },

  // 4. TALLERES Y PROVEEDORES
  'talleres-proveedores': {
    key: 'talleres-proveedores',
    singular: 'Taller Proveedor',
    plural: 'Talleres y Proveedores',
    category: 'mantenimiento',
    endpoint: '/api/talleres-proveedores',
    description: 'Red de talleres mecanicos externos certificados que atienden la flota comercial.',
    fields: [
      { name: 'cedula_juridica', label: 'Cedula Juridica / RUC', type: 'text', required: true },
      { name: 'nombre_comercial', label: 'Nombre Comercial', type: 'text', required: true },
      { name: 'especialidad', label: 'Especialidad (Frenos, Motor, Electrico, General)', type: 'text' },
      { name: 'telefono', label: 'Telefono', type: 'text' },
      { name: 'correo', label: 'Correo Electronico', type: 'text' },
      { name: 'direccion', label: 'Direccion del Taller', type: 'text', fullWidth: true }
    ],
    tableColumns: [
      { key: 'id', label: 'ID' },
      { key: 'cedula_juridica', label: 'Cedula Juridica' },
      { key: 'nombre_comercial', label: 'Taller' },
      { key: 'especialidad', label: 'Especialidad', badge: true },
      { key: 'telefono', label: 'Telefono' },
      { key: 'correo', label: 'Correo' }
    ]
  },

  // 5. VEHICULOS
  'vehiculos': {
    key: 'vehiculos',
    singular: 'Vehiculo',
    plural: 'Unidades Vehiculares',
    category: 'flota',
    endpoint: '/api/vehiculos',
    description: 'Centralizacion de unidades comerciales, kilometraje actual, base asignada y estado operativo.',
    fields: [
      { name: 'placa', label: 'Numero de Placa', type: 'text', required: true },
      { name: 'categoria_id', label: 'Categoria de Vehiculo', type: 'select', required: true, refEntity: 'categorias-vehiculo', refValue: 'id', refLabel: 'nombre' },
      { name: 'sucursal_id', label: 'Sucursal / Base Operativa', type: 'select', required: true, refEntity: 'sucursales', refValue: 'id', refLabel: 'nombre' },
      { name: 'conductor_id', label: 'Conductor Habitual (Opcional)', type: 'select', refEntity: 'conductores', refValue: 'id', refLabel: 'nombre_completo' },
      { name: 'marca', label: 'Marca', type: 'text', required: true },
      { name: 'modelo', label: 'Modelo', type: 'text', required: true },
      { name: 'anio', label: 'Anio de Fabricacion', type: 'number', required: true },
      { name: 'kilometraje_actual', label: 'Kilometraje Actual (km)', type: 'number', required: true, defaultValue: 0 },
      { name: 'numero_chasis_vin', label: 'Numero de Chasis / VIN', type: 'text', required: true },
      { name: 'estado', label: 'Estado Operativo', type: 'select', required: true, options: ['operativo', 'en_mantenimiento', 'fuera_de_servicio'], defaultValue: 'operativo' }
    ],
    tableColumns: [
      { key: 'id', label: 'ID' },
      { key: 'placa', label: 'Placa', badge: true },
      { key: 'marca_modelo', label: 'Unidad', render: (row) => `${row.marca} ${row.modelo} (${row.anio})` },
      { key: 'categoria', label: 'Categoria', render: (row) => row.categoria ? row.categoria.nombre : '-' },
      { key: 'sucursal', label: 'Base Operativa', render: (row) => row.sucursal ? row.sucursal.nombre : '-' },
      { key: 'kilometraje_actual', label: 'Kilometraje', render: (row) => `${Number(row.kilometraje_actual || 0).toLocaleString()} km` },
      { key: 'estado', label: 'Estado', badge: true }
    ]
  },

  // 6. CATEGORIAS DE VEHICULO
  'categorias-vehiculo': {
    key: 'categorias-vehiculo',
    singular: 'Categoria de Vehiculo',
    plural: 'Categorias de Vehiculo',
    category: 'flota',
    endpoint: '/api/categorias-vehiculo',
    description: 'Clasificacion de unidades (pesado, liviano, refrigerado), tipo de licencia y umbral de mantenimiento preventivo.',
    fields: [
      { name: 'nombre', label: 'Nombre de Categoria', type: 'text', required: true },
      { name: 'requiere_licencia_tipo', label: 'Licencia Requerida (B1, B2, C2, etc.)', type: 'text', required: true },
      { name: 'intervalo_km_mantenimiento', label: 'Intervalo Preventivo (km)', type: 'number', required: true, defaultValue: 5000 }
    ],
    tableColumns: [
      { key: 'id', label: 'ID' },
      { key: 'nombre', label: 'Categoria' },
      { key: 'requiere_licencia_tipo', label: 'Licencia Requerida', badge: true },
      { key: 'intervalo_km_mantenimiento', label: 'Intervalo Preventivo', render: (row) => `Cada ${Number(row.intervalo_km_mantenimiento || 0).toLocaleString()} km` }
    ]
  },

  // 7. SUCURSALES
  'sucursales': {
    key: 'sucursales',
    singular: 'Sucursal',
    plural: 'Bases y Sucursales',
    category: 'flota',
    endpoint: '/api/sucursales',
    description: 'Sedes y bases logisticas que albergan unidades, originan rutas y emplean conductores.',
    fields: [
      { name: 'nombre', label: 'Nombre de Sucursal', type: 'text', required: true },
      { name: 'codigo', label: 'Codigo Unico', type: 'text', required: true },
      { name: 'ciudad', label: 'Ciudad / Region', type: 'text' },
      { name: 'telefono', label: 'Telefono', type: 'text' },
      { name: 'direccion', label: 'Direccion Completa', type: 'text', fullWidth: true }
    ],
    tableColumns: [
      { key: 'id', label: 'ID' },
      { key: 'codigo', label: 'Codigo', badge: true },
      { key: 'nombre', label: 'Nombre' },
      { key: 'ciudad', label: 'Ciudad' },
      { key: 'telefono', label: 'Telefono' },
      { key: 'direccion', label: 'Direccion' }
    ]
  },

  // 8. CONDUCTORES
  'conductores': {
    key: 'conductores',
    singular: 'Conductor',
    plural: 'Conductores',
    category: 'flota',
    endpoint: '/api/conductores',
    description: 'Gestion de personal operativo, licencias, vigencias y base asignada.',
    fields: [
      { name: 'sucursal_id', label: 'Sucursal / Base', type: 'select', required: true, refEntity: 'sucursales', refValue: 'id', refLabel: 'nombre' },
      { name: 'cedula', label: 'Cedula / Identificacion', type: 'text', required: true },
      { name: 'nombre_completo', label: 'Nombre Completo', type: 'text', required: true },
      { name: 'licencia_tipo', label: 'Tipo de Licencia', type: 'text', required: true },
      { name: 'licencia_vencimiento', label: 'Vencimiento de Licencia', type: 'date', required: true },
      { name: 'estado', label: 'Estado', type: 'select', required: true, options: ['activo', 'inactivo', 'suspendido'], defaultValue: 'activo' },
      { name: 'telefono', label: 'Telefono', type: 'text' },
      { name: 'correo', label: 'Correo Electronico', type: 'text' }
    ],
    tableColumns: [
      { key: 'id', label: 'ID' },
      { key: 'cedula', label: 'Cedula' },
      { key: 'nombre_completo', label: 'Conductor' },
      { key: 'licencia_tipo', label: 'Licencia', badge: true },
      { key: 'licencia_vencimiento', label: 'Vencimiento' },
      { key: 'sucursal', label: 'Base', render: (row) => row.sucursal ? row.sucursal.nombre : '-' },
      { key: 'estado', label: 'Estado', badge: true }
    ]
  },

  // 9. RUTAS
  'rutas': {
    key: 'rutas',
    singular: 'Ruta',
    plural: 'Rutas de Transporte',
    category: 'logistica',
    endpoint: '/api/rutas',
    description: 'Trazados de transporte comercial con distancias y duraciones estimadas.',
    fields: [
      { name: 'sucursal_origen_id', label: 'Sucursal de Origen', type: 'select', required: true, refEntity: 'sucursales', refValue: 'id', refLabel: 'nombre' },
      { name: 'nombre_ruta', label: 'Nombre de la Ruta', type: 'text', required: true },
      { name: 'destino', label: 'Destino', type: 'text', required: true },
      { name: 'distancia_estimada_km', label: 'Distancia Estimada (km)', type: 'number', required: true, defaultValue: 0 },
      { name: 'duracion_estimada_horas', label: 'Duracion Estimada (horas)', type: 'number', required: true, defaultValue: 0 }
    ],
    tableColumns: [
      { key: 'id', label: 'ID' },
      { key: 'nombre_ruta', label: 'Nombre Ruta' },
      { key: 'sucursal_origen', label: 'Origen', render: (row) => row.sucursal_origen ? row.sucursal_origen.nombre : '-' },
      { key: 'destino', label: 'Destino' },
      { key: 'distancia_estimada_km', label: 'Distancia', render: (row) => `${Number(row.distancia_estimada_km || 0)} km` },
      { key: 'duracion_estimada_horas', label: 'Duracion', render: (row) => `${Number(row.duracion_estimada_horas || 0)} hrs` }
    ]
  },

  // 10. ASIGNACIONES DE VIAJE
  'asignaciones-viaje': {
    key: 'asignaciones-viaje',
    singular: 'Asignacion de Viaje',
    plural: 'Asignaciones de Viaje',
    category: 'logistica',
    endpoint: '/api/asignaciones-viaje',
    description: 'Relacion ternaria M:N que vincula Vehiculo, Conductor y Ruta con odometro y trazabilidad.',
    fields: [
      { name: 'vehiculo_id', label: 'Vehiculo', type: 'select', required: true, refEntity: 'vehiculos', refValue: 'id', refLabel: 'placa' },
      { name: 'conductor_id', label: 'Conductor', type: 'select', required: true, refEntity: 'conductores', refValue: 'id', refLabel: 'nombre_completo' },
      { name: 'ruta_id', label: 'Ruta Asignada', type: 'select', required: true, refEntity: 'rutas', refValue: 'id', refLabel: 'nombre_ruta' },
      { name: 'estado', label: 'Estado del Viaje', type: 'select', required: true, options: ['en_curso', 'completado', 'cancelado'], defaultValue: 'en_curso' },
      { name: 'fecha_salida', label: 'Fecha y Hora de Salida', type: 'datetime-local', required: true },
      { name: 'fecha_retorno', label: 'Fecha y Hora de Retorno', type: 'datetime-local' },
      { name: 'km_inicial', label: 'Kilometraje Inicial (Odometro)', type: 'number', required: true },
      { name: 'km_final', label: 'Kilometraje Final', type: 'number' }
    ],
    tableColumns: [
      { key: 'id', label: 'ID' },
      { key: 'vehiculo', label: 'Vehiculo', render: (row) => row.vehiculo ? row.vehiculo.placa : `#${row.vehiculo_id}` },
      { key: 'conductor', label: 'Conductor', render: (row) => row.conductor ? row.conductor.nombre_completo : `#${row.conductor_id}` },
      { key: 'ruta', label: 'Ruta', render: (row) => row.ruta ? row.ruta.nombre_ruta : `#${row.ruta_id}` },
      { key: 'fecha_salida', label: 'Salida', render: (row) => row.fecha_salida ? new Date(row.fecha_salida).toLocaleString() : '-' },
      { key: 'km_inicial', label: 'Km Inicial', render: (row) => `${Number(row.km_inicial || 0).toLocaleString()} km` },
      { key: 'estado', label: 'Estado', badge: true }
    ]
  },

  // 11. POLIZAS DE SEGURO
  'polizas-seguro': {
    key: 'polizas-seguro',
    singular: 'Poliza de Seguro',
    plural: 'Polizas de Seguro',
    category: 'seguridad',
    endpoint: '/api/polizas-seguro',
    description: 'Garantia y proteccion de unidades vehiculares, cobertura economica y control de vencimientos.',
    fields: [
      { name: 'vehiculo_id', label: 'Vehiculo Asegurado', type: 'select', required: true, refEntity: 'vehiculos', refValue: 'id', refLabel: 'placa' },
      { name: 'aseguradora', label: 'Aseguradora', type: 'text', required: true },
      { name: 'numero_poliza', label: 'Numero de Poliza Unico', type: 'text', required: true },
      { name: 'cobertura', label: 'Tipo de Cobertura (Total, Terceros, Carga)', type: 'text', required: true },
      { name: 'monto_cobertura', label: 'Monto de Cobertura ($)', type: 'number', required: true, defaultValue: 0 },
      { name: 'estado', label: 'Estado de la Poliza', type: 'select', required: true, options: ['vigente', 'vencida', 'cancelada'], defaultValue: 'vigente' },
      { name: 'fecha_inicio', label: 'Fecha de Emision', type: 'date', required: true },
      { name: 'fecha_vencimiento', label: 'Fecha de Vencimiento', type: 'date', required: true }
    ],
    tableColumns: [
      { key: 'id', label: 'ID' },
      { key: 'numero_poliza', label: 'Poliza', badge: true },
      { key: 'vehiculo', label: 'Vehiculo', render: (row) => row.vehiculo ? row.vehiculo.placa : `#${row.vehiculo_id}` },
      { key: 'aseguradora', label: 'Aseguradora' },
      { key: 'monto_cobertura', label: 'Monto Cobertura', render: (row) => `$${Number(row.monto_cobertura || 0).toLocaleString()}` },
      { key: 'fecha_vencimiento', label: 'Vencimiento' },
      { key: 'estado', label: 'Estado', badge: true }
    ]
  },

  // ============================================================
  // 9 ENTIDADES NUEVAS
  // ============================================================

  // 12. INVENTARIO DE NEUMATICOS
  'inventario-neumaticos': {
    key: 'inventario-neumaticos',
    singular: 'Neumatico',
    plural: 'Inventario de Neumaticos',
    category: 'neumaticos',
    endpoint: '/api/inventario-neumaticos',
    description: 'Registro y control de existencias de neumaticos: codigo, marca, medida y estado actual en almacen.',
    fields: [
      { name: 'codigo_serie', label: 'Codigo / Serie', type: 'text', required: true },
      { name: 'marca', label: 'Marca (Bridgestone, Michelin...)', type: 'text', required: true },
      { name: 'medida', label: 'Medida (ej: 295/80R22.5)', type: 'text', required: true },
      { name: 'estado', label: 'Estado', type: 'select', required: true, options: ['nuevo', 'en_uso', 'reencauchado', 'descartado'], defaultValue: 'nuevo' },
      { name: 'profundidad_banda_mm', label: 'Profundidad de Banda (mm)', type: 'number', defaultValue: 0 },
      { name: 'fecha_compra', label: 'Fecha de Compra', type: 'date' },
      { name: 'costo_compra', label: 'Costo de Compra ($)', type: 'number', defaultValue: 0 }
    ],
    tableColumns: [
      { key: 'id', label: 'ID' },
      { key: 'codigo_serie', label: 'Codigo / Serie', badge: true },
      { key: 'marca', label: 'Marca' },
      { key: 'medida', label: 'Medida' },
      { key: 'profundidad_banda_mm', label: 'Banda (mm)' },
      { key: 'costo_compra', label: 'Costo', render: (row) => `$${Number(row.costo_compra || 0).toLocaleString()}` },
      { key: 'estado', label: 'Estado', badge: true }
    ]
  },

  // 13. CERTIFICACIONES Y LICENCIAS
  'certificaciones-licencias': {
    key: 'certificaciones-licencias',
    singular: 'Certificacion / Licencia',
    plural: 'Certificaciones y Licencias',
    category: 'operaciones',
    endpoint: '/api/certificaciones-licencias',
    description: 'Control de certificaciones tecnicas, licencias especiales y documentos normativos de conductores.',
    fields: [
      { name: 'conductor_id', label: 'Conductor', type: 'select', required: true, refEntity: 'conductores', refValue: 'id', refLabel: 'nombre_completo' },
      { name: 'tipo_certificacion', label: 'Tipo de Certificacion', type: 'text', required: true },
      { name: 'numero_certificado', label: 'Numero de Certificado', type: 'text', required: true },
      { name: 'entidad_emisora', label: 'Entidad Emisora', type: 'text' },
      { name: 'fecha_emision', label: 'Fecha de Emision', type: 'date', required: true },
      { name: 'fecha_vencimiento', label: 'Fecha de Vencimiento', type: 'date' },
      { name: 'estado', label: 'Estado', type: 'select', required: true, options: ['vigente', 'vencida', 'suspendida'], defaultValue: 'vigente' }
    ],
    tableColumns: [
      { key: 'id', label: 'ID' },
      { key: 'conductor', label: 'Conductor', render: (row) => row.conductor ? row.conductor.nombre_completo : `#${row.conductor_id}` },
      { key: 'tipo_certificacion', label: 'Tipo', badge: true },
      { key: 'numero_certificado', label: 'Certificado' },
      { key: 'entidad_emisora', label: 'Entidad' },
      { key: 'fecha_vencimiento', label: 'Vencimiento' },
      { key: 'estado', label: 'Estado', badge: true }
    ]
  },

  // 14. INSPECCIONES PRE-VIAJE
  'inspecciones-pre-viaje': {
    key: 'inspecciones-pre-viaje',
    singular: 'Inspeccion Pre-Viaje',
    plural: 'Inspecciones Pre-Viaje',
    category: 'operaciones',
    endpoint: '/api/inspecciones-pre-viaje',
    description: 'Checklist obligatorio de condicion del vehiculo antes de cada viaje para garantizar seguridad vial.',
    fields: [
      { name: 'vehiculo_id', label: 'Vehiculo', type: 'select', required: true, refEntity: 'vehiculos', refValue: 'id', refLabel: 'placa' },
      { name: 'conductor_id', label: 'Conductor', type: 'select', required: true, refEntity: 'conductores', refValue: 'id', refLabel: 'nombre_completo' },
      { name: 'fecha_inspeccion', label: 'Fecha de Inspeccion', type: 'date', required: true },
      { name: 'nivel_aceite_ok', label: 'Nivel de Aceite OK', type: 'select', required: true, options: ['true', 'false'], defaultValue: 'true' },
      { name: 'frenos_ok', label: 'Frenos OK', type: 'select', required: true, options: ['true', 'false'], defaultValue: 'true' },
      { name: 'luces_ok', label: 'Luces OK', type: 'select', required: true, options: ['true', 'false'], defaultValue: 'true' },
      { name: 'neumaticos_ok', label: 'Neumaticos OK', type: 'select', required: true, options: ['true', 'false'], defaultValue: 'true' },
      { name: 'resultado', label: 'Resultado General', type: 'select', required: true, options: ['apto', 'no_apto', 'condicional'], defaultValue: 'apto' },
      { name: 'observaciones', label: 'Observaciones', type: 'textarea', fullWidth: true }
    ],
    tableColumns: [
      { key: 'id', label: 'ID' },
      { key: 'vehiculo', label: 'Vehiculo', render: (row) => row.vehiculo ? row.vehiculo.placa : `#${row.vehiculo_id}` },
      { key: 'conductor', label: 'Conductor', render: (row) => row.conductor ? row.conductor.nombre_completo : `#${row.conductor_id}` },
      { key: 'fecha_inspeccion', label: 'Fecha' },
      { key: 'frenos_ok', label: 'Frenos', render: (row) => row.frenos_ok ? 'OK' : 'FALLA' },
      { key: 'neumaticos_ok', label: 'Neumaticos', render: (row) => row.neumaticos_ok ? 'OK' : 'FALLA' },
      { key: 'resultado', label: 'Resultado', badge: true }
    ]
  },

  // 15. BITACORA ESTADO DEL VEHICULO
  'bitacora-estado-vehiculo': {
    key: 'bitacora-estado-vehiculo',
    singular: 'Registro de Bitacora',
    plural: 'Bitacora Estado Vehiculo',
    category: 'operaciones',
    endpoint: '/api/bitacora-estado-vehiculo',
    description: 'Historial cronologico de cambios de estado operativo de cada unidad para auditoria y trazabilidad.',
    fields: [
      { name: 'vehiculo_id', label: 'Vehiculo', type: 'select', required: true, refEntity: 'vehiculos', refValue: 'id', refLabel: 'placa' },
      { name: 'fecha_cambio', label: 'Fecha del Cambio', type: 'date', required: true },
      { name: 'estado_anterior', label: 'Estado Anterior', type: 'select', required: true, options: ['operativo', 'en_mantenimiento', 'fuera_de_servicio'] },
      { name: 'estado_nuevo', label: 'Estado Nuevo', type: 'select', required: true, options: ['operativo', 'en_mantenimiento', 'fuera_de_servicio'] },
      { name: 'motivo', label: 'Motivo del Cambio', type: 'textarea', fullWidth: true }
    ],
    tableColumns: [
      { key: 'id', label: 'ID' },
      { key: 'vehiculo', label: 'Vehiculo', render: (row) => row.vehiculo ? row.vehiculo.placa : `#${row.vehiculo_id}` },
      { key: 'fecha_cambio', label: 'Fecha' },
      { key: 'estado_anterior', label: 'Anterior', badge: true },
      { key: 'estado_nuevo', label: 'Nuevo', badge: true },
      { key: 'motivo', label: 'Motivo', render: (row) => row.motivo ? row.motivo.substring(0, 60) + (row.motivo.length > 60 ? '...' : '') : '-' }
    ]
  },

  // 16. CARGAS DE COMBUSTIBLE
  'cargas-combustible': {
    key: 'cargas-combustible',
    singular: 'Carga de Combustible',
    plural: 'Cargas de Combustible',
    category: 'operaciones',
    endpoint: '/api/cargas-combustible',
    description: 'Registro sistematico de cada carga de combustible por unidad para control de consumo y costo operativo.',
    fields: [
      { name: 'vehiculo_id', label: 'Vehiculo', type: 'select', required: true, refEntity: 'vehiculos', refValue: 'id', refLabel: 'placa' },
      { name: 'fecha_carga', label: 'Fecha de Carga', type: 'date', required: true },
      { name: 'litros', label: 'Litros Cargados', type: 'number', required: true, defaultValue: 0 },
      { name: 'costo_total', label: 'Costo Total ($)', type: 'number', required: true, defaultValue: 0 },
      { name: 'km_odometro', label: 'Kilometraje al Momento (Odometro)', type: 'number', required: true },
      { name: 'tipo_combustible', label: 'Tipo de Combustible', type: 'select', required: true, options: ['diesel', 'gasolina', 'GLP', 'electrico'], defaultValue: 'diesel' },
      { name: 'estacion_servicio', label: 'Estacion de Servicio', type: 'text' }
    ],
    tableColumns: [
      { key: 'id', label: 'ID' },
      { key: 'vehiculo', label: 'Vehiculo', render: (row) => row.vehiculo ? row.vehiculo.placa : `#${row.vehiculo_id}` },
      { key: 'fecha_carga', label: 'Fecha' },
      { key: 'tipo_combustible', label: 'Combustible', badge: true },
      { key: 'litros', label: 'Litros', render: (row) => `${Number(row.litros || 0)} L` },
      { key: 'costo_total', label: 'Costo', render: (row) => `$${Number(row.costo_total || 0).toLocaleString()}` },
      { key: 'km_odometro', label: 'Odometro', render: (row) => `${Number(row.km_odometro || 0).toLocaleString()} km` }
    ]
  },

  // 17. SINIESTROS Y ACCIDENTES
  'siniestros-accidentes': {
    key: 'siniestros-accidentes',
    singular: 'Siniestro / Accidente',
    plural: 'Siniestros y Accidentes',
    category: 'seguridad',
    endpoint: '/api/siniestros-accidentes',
    description: 'Registro de incidentes viales, danos materiales, heridos y estado de cada siniestro para gestion de seguros.',
    fields: [
      { name: 'vehiculo_id', label: 'Vehiculo Involucrado', type: 'select', required: true, refEntity: 'vehiculos', refValue: 'id', refLabel: 'placa' },
      { name: 'conductor_id', label: 'Conductor al Mando', type: 'select', required: true, refEntity: 'conductores', refValue: 'id', refLabel: 'nombre_completo' },
      { name: 'fecha_siniestro', label: 'Fecha del Siniestro', type: 'date', required: true },
      { name: 'lugar', label: 'Lugar / Ubicacion del Hecho', type: 'text', required: true },
      { name: 'descripcion', label: 'Descripcion del Siniestro', type: 'textarea', fullWidth: true, required: true },
      { name: 'monto_danos', label: 'Monto de Danos Estimado ($)', type: 'number', defaultValue: 0 },
      { name: 'fecha_denuncia', label: 'Fecha de Denuncia Formal', type: 'date' },
      { name: 'estado', label: 'Estado del Siniestro', type: 'select', required: true, options: ['abierto', 'en_investigacion', 'cerrado'], defaultValue: 'abierto' }
    ],
    tableColumns: [
      { key: 'id', label: 'ID' },
      { key: 'vehiculo', label: 'Vehiculo', render: (row) => row.vehiculo ? row.vehiculo.placa : `#${row.vehiculo_id}` },
      { key: 'conductor', label: 'Conductor', render: (row) => row.conductor ? row.conductor.nombre_completo : `#${row.conductor_id}` },
      { key: 'fecha_siniestro', label: 'Fecha' },
      { key: 'lugar', label: 'Lugar' },
      { key: 'monto_danos', label: 'Danos ($)', render: (row) => `$${Number(row.monto_danos || 0).toLocaleString()}` },
      { key: 'estado', label: 'Estado', badge: true }
    ]
  },

  // 18. SANCIONES Y MULTAS
  'sanciones-multas': {
    key: 'sanciones-multas',
    singular: 'Sancion / Multa',
    plural: 'Sanciones y Multas',
    category: 'operaciones',
    endpoint: '/api/sanciones-multas',
    description: 'Control de infracciones de transito y sanciones administrativas imputadas a conductores o unidades.',
    fields: [
      { name: 'vehiculo_id', label: 'Vehiculo', type: 'select', required: true, refEntity: 'vehiculos', refValue: 'id', refLabel: 'placa' },
      { name: 'conductor_id', label: 'Conductor', type: 'select', refEntity: 'conductores', refValue: 'id', refLabel: 'nombre_completo' },
      { name: 'fecha_infraccion', label: 'Fecha de Infraccion', type: 'date', required: true },
      { name: 'tipo_infraccion', label: 'Tipo de Infraccion', type: 'text', required: true },
      { name: 'lugar_evento', label: 'Lugar del Evento', type: 'text' },
      { name: 'monto_multa', label: 'Monto de Multa ($)', type: 'number', defaultValue: 0 },
      { name: 'fecha_pago', label: 'Fecha de Pago', type: 'date' },
      { name: 'monto_descuento_pagado', label: 'Monto Pagado con Descuento ($)', type: 'number', defaultValue: 0 },
      { name: 'estado_pago', label: 'Estado de Pago', type: 'select', required: true, options: ['pendiente', 'pagado', 'impugnado'], defaultValue: 'pendiente' }
    ],
    tableColumns: [
      { key: 'id', label: 'ID' },
      { key: 'vehiculo', label: 'Vehiculo', render: (row) => row.vehiculo ? row.vehiculo.placa : `#${row.vehiculo_id}` },
      { key: 'conductor', label: 'Conductor', render: (row) => row.conductor ? row.conductor.nombre_completo : `#${row.conductor_id}` },
      { key: 'fecha_infraccion', label: 'Fecha' },
      { key: 'tipo_infraccion', label: 'Infraccion', badge: true },
      { key: 'monto_multa', label: 'Multa ($)', render: (row) => `$${Number(row.monto_multa || 0).toLocaleString()}` },
      { key: 'estado_pago', label: 'Estado', badge: true }
    ]
  },

  // 19. MONTAJE DE NEUMATICOS (tabla intermedia M:N vehiculos <-> inventario_neumaticos)
  'montaje-neumaticos': {
    key: 'montaje-neumaticos',
    singular: 'Montaje de Neumatico',
    plural: 'Montaje de Neumaticos',
    category: 'neumaticos',
    endpoint: '/api/montaje-neumaticos',
    description: 'Relacion M:N entre vehiculos e inventario de neumaticos: historial de montajes, posicion de eje y desmonte.',
    fields: [
      { name: 'vehiculo_id', label: 'Vehiculo', type: 'select', required: true, refEntity: 'vehiculos', refValue: 'id', refLabel: 'placa' },
      { name: 'neumatico_id', label: 'Neumatico (Codigo/Serie)', type: 'select', required: true, refEntity: 'inventario-neumaticos', refValue: 'id', refLabel: 'codigo_serie', formatLabel: (n) => `${n.codigo_serie} - ${n.marca} ${n.medida}` },
      { name: 'posicion_eje', label: 'Posicion en Eje (ej: Delantera Izq.)', type: 'text', required: true },
      { name: 'fecha_instalacion', label: 'Fecha de Instalacion', type: 'date', required: true },
      { name: 'km_instalacion', label: 'Km Odometro al Instalar', type: 'number', defaultValue: 0 },
      { name: 'fecha_desmonte', label: 'Fecha de Desmonte (si aplica)', type: 'date' },
      { name: 'km_desmonte', label: 'Km Odometro al Desmontar', type: 'number' }
    ],
    tableColumns: [
      { key: 'id', label: 'ID' },
      { key: 'vehiculo', label: 'Vehiculo', render: (row) => row.vehiculo ? row.vehiculo.placa : `#${row.vehiculo_id}` },
      { key: 'neumatico', label: 'Neumatico', render: (row) => row.neumatico ? `${row.neumatico.codigo_serie} ${row.neumatico.medida}` : `#${row.neumatico_id}` },
      { key: 'posicion_eje', label: 'Posicion Eje', badge: true },
      { key: 'fecha_instalacion', label: 'Instalacion' },
      { key: 'km_instalacion', label: 'Km Montaje', render: (row) => `${Number(row.km_instalacion || 0).toLocaleString()} km` },
      { key: 'fecha_desmonte', label: 'Desmonte', render: (row) => row.fecha_desmonte || '-' }
    ]
  },

  // 20. RECLAMACIONES DE SEGURO (tabla intermedia M:N siniestros <-> polizas)
  'reclamaciones-seguro': {
    key: 'reclamaciones-seguro',
    singular: 'Reclamacion de Seguro',
    plural: 'Reclamaciones de Seguro',
    category: 'seguridad',
    endpoint: '/api/reclamaciones-seguro',
    description: 'Relacion M:N entre siniestros y polizas de seguro: gestion de reclamaciones, deducibles e indemnizaciones.',
    fields: [
      { name: 'siniestro_id', label: 'Siniestro / Accidente', type: 'select', required: true, refEntity: 'siniestros-accidentes', refValue: 'id', refLabel: 'id', formatLabel: (s) => `Siniestro #${s.id} - ${s.lugar || ''}` },
      { name: 'poliza_id', label: 'Poliza de Seguro', type: 'select', required: true, refEntity: 'polizas-seguro', refValue: 'id', refLabel: 'numero_poliza', formatLabel: (p) => `${p.numero_poliza} (${p.aseguradora})` },
      { name: 'numero_reclamo', label: 'Numero de Reclamo Unico', type: 'text', required: true },
      { name: 'monto_reclamado', label: 'Monto Reclamado ($)', type: 'number', defaultValue: 0 },
      { name: 'monto_deducible_pagado', label: 'Deducible Pagado ($)', type: 'number', defaultValue: 0 },
      { name: 'estado_reclamo', label: 'Estado del Reclamo', type: 'select', required: true, options: ['en_proceso', 'aprobado', 'rechazado', 'pagado'], defaultValue: 'en_proceso' }
    ],
    tableColumns: [
      { key: 'id', label: 'ID' },
      { key: 'numero_reclamo', label: 'N. Reclamo', badge: true },
      { key: 'siniestro', label: 'Siniestro', render: (row) => `Siniestro #${row.siniestro_id}` },
      { key: 'poliza', label: 'Poliza', render: (row) => row.poliza ? row.poliza.numero_poliza : `#${row.poliza_id}` },
      { key: 'monto_reclamado', label: 'Reclamado ($)', render: (row) => `$${Number(row.monto_reclamado || 0).toLocaleString()}` },
      { key: 'monto_deducible_pagado', label: 'Deducible ($)', render: (row) => `$${Number(row.monto_deducible_pagado || 0).toLocaleString()}` },
      { key: 'estado_reclamo', label: 'Estado', badge: true }
    ]
  }
};
