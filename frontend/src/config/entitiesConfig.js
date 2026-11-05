// Configuración y esquemas para las 11 entidades del sistema FleetOps
export const ENTITY_CATEGORIES = [
  { id: 'mantenimiento', title: 'Mantenimiento & Costos' },
  { id: 'flota', title: 'Flota & Unidades' },
  { id: 'logistica', title: 'Logística & Rutas' },
  { id: 'seguridad', title: 'Seguridad & Pólizas' }
];

export const ENTITIES = {
  // 1. ORDENES DE MANTENIMIENTO
  'ordenes-mantenimiento': {
    key: 'ordenes-mantenimiento',
    singular: 'Orden de Mantenimiento',
    plural: 'Órdenes de Mantenimiento',
    category: 'mantenimiento',
    endpoint: '/api/ordenes-mantenimiento',
    description: 'Control de servicios preventivos y correctivos en talleres externos para evitar vehículos fuera de servicio.',
    fields: [
      { name: 'vehiculo_id', label: 'Vehículo (Placa)', type: 'select', required: true, refEntity: 'vehiculos', refValue: 'id', refLabel: 'placa' },
      { name: 'taller_id', label: 'Taller / Proveedor', type: 'select', required: true, refEntity: 'talleres-proveedores', refValue: 'id', refLabel: 'nombre_comercial' },
      { name: 'tipo_mantenimiento', label: 'Tipo Mantenimiento', type: 'select', required: true, options: ['preventivo', 'correctivo'] },
      { name: 'estado', label: 'Estado', type: 'select', required: true, options: ['abierta', 'en_proceso', 'completada', 'cancelada'], defaultValue: 'abierta' },
      { name: 'fecha_apertura', label: 'Fecha Apertura', type: 'date', required: true },
      { name: 'fecha_cierre', label: 'Fecha Cierre', type: 'date' },
      { name: 'km_registro', label: 'Kilometraje Registrado', type: 'number', required: true },
      { name: 'costo_mano_obra', label: 'Costo Mano de Obra ($)', type: 'number', required: true, defaultValue: 0 },
      { name: 'costo_total', label: 'Costo Total Acumulado ($)', type: 'number', defaultValue: 0 },
      { name: 'descripcion_problema', label: 'Descripción del Diagnóstico / Problema', type: 'textarea', fullWidth: true }
    ],
    tableColumns: [
      { key: 'id', label: 'ID' },
      { key: 'vehiculo', label: 'Vehículo', render: (row) => row.vehiculo ? row.vehiculo.placa : `#${row.vehiculo_id}` },
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
    description: 'Relación Muchos a Muchos: Asocia repuestos suministrados en órdenes con cálculo de costo automático.',
    fields: [
      { name: 'orden_id', label: 'Orden de Mantenimiento', type: 'select', required: true, refEntity: 'ordenes-mantenimiento', refValue: 'id', refLabel: 'id', formatLabel: (o) => `Orden #${o.id} (${o.tipo_mantenimiento})` },
      { name: 'repuesto_id', label: 'Repuesto del Catálogo', type: 'select', required: true, refEntity: 'catalogo-repuestos', refValue: 'id', refLabel: 'nombre', formatLabel: (r) => `${r.codigo_parte} - ${r.nombre} ($${r.precio_referencia})` },
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
    singular: 'Repuesto de Catálogo',
    plural: 'Catálogo de Repuestos',
    category: 'mantenimiento',
    endpoint: '/api/catalogo-repuestos',
    description: 'Registro de piezas, refacciones y precios referenciales para evitar sobrecostos en reparaciones mecánicas.',
    fields: [
      { name: 'codigo_parte', label: 'Código de Parte Único', type: 'text', required: true },
      { name: 'nombre', label: 'Nombre del Repuesto', type: 'text', required: true },
      { name: 'categoria_repuesto', label: 'Categoría (Filtros, Frenos, Motor...)', type: 'text' },
      { name: 'precio_referencia', label: 'Precio Referencial ($)', type: 'number', required: true, defaultValue: 0 },
      { name: 'stock_almacen', label: 'Stock en Almacén', type: 'number', required: true, defaultValue: 0 }
    ],
    tableColumns: [
      { key: 'id', label: 'ID' },
      { key: 'codigo_parte', label: 'Código', badge: true },
      { key: 'nombre', label: 'Nombre' },
      { key: 'categoria_repuesto', label: 'Categoría' },
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
    description: 'Red de talleres mecánicos externos certificados que atienden la flota comercial.',
    fields: [
      { name: 'cedula_juridica', label: 'Cédula Jurídica / RUC', type: 'text', required: true },
      { name: 'nombre_comercial', label: 'Nombre Comercial', type: 'text', required: true },
      { name: 'especialidad', label: 'Especialidad (Frenos, Motor, Eléctrico, General)', type: 'text' },
      { name: 'telefono', label: 'Teléfono', type: 'text' },
      { name: 'correo', label: 'Correo Electrónico', type: 'text' },
      { name: 'direccion', label: 'Dirección del Taller', type: 'text', fullWidth: true }
    ],
    tableColumns: [
      { key: 'id', label: 'ID' },
      { key: 'cedula_juridica', label: 'Cédula Jurídica' },
      { key: 'nombre_comercial', label: 'Taller' },
      { key: 'especialidad', label: 'Especialidad', badge: true },
      { key: 'telefono', label: 'Teléfono' },
      { key: 'correo', label: 'Correo' }
    ]
  },

  // 5. VEHICULOS
  'vehiculos': {
    key: 'vehiculos',
    singular: 'Vehículo',
    plural: 'Unidades Vehiculares',
    category: 'flota',
    endpoint: '/api/vehiculos',
    description: 'Centralización de unidades comerciales, kilometraje actual, base asignada y estado operativo.',
    fields: [
      { name: 'placa', label: 'Número de Placa', type: 'text', required: true },
      { name: 'categoria_id', label: 'Categoría de Vehículo', type: 'select', required: true, refEntity: 'categorias-vehiculo', refValue: 'id', refLabel: 'nombre' },
      { name: 'sucursal_id', label: 'Sucursal / Base Operativa', type: 'select', required: true, refEntity: 'sucursales', refValue: 'id', refLabel: 'nombre' },
      { name: 'conductor_id', label: 'Conductor Habitual (Opcional)', type: 'select', refEntity: 'conductores', refValue: 'id', refLabel: 'nombre_completo' },
      { name: 'marca', label: 'Marca', type: 'text', required: true },
      { name: 'modelo', label: 'Modelo', type: 'text', required: true },
      { name: 'anio', label: 'Año de Fabricación', type: 'number', required: true },
      { name: 'kilometraje_actual', label: 'Kilometraje Actual (km)', type: 'number', required: true, defaultValue: 0 },
      { name: 'numero_chasis_vin', label: 'Número de Chasis / VIN', type: 'text', required: true },
      { name: 'estado', label: 'Estado Operativo', type: 'select', required: true, options: ['operativo', 'en_mantenimiento', 'fuera_de_servicio'], defaultValue: 'operativo' }
    ],
    tableColumns: [
      { key: 'id', label: 'ID' },
      { key: 'placa', label: 'Placa', badge: true },
      { key: 'marca_modelo', label: 'Unidad', render: (row) => `${row.marca} ${row.modelo} (${row.anio})` },
      { key: 'categoria', label: 'Categoría', render: (row) => row.categoria ? row.categoria.nombre : '-' },
      { key: 'sucursal', label: 'Base Operativa', render: (row) => row.sucursal ? row.sucursal.nombre : '-' },
      { key: 'kilometraje_actual', label: 'Kilometraje', render: (row) => `${Number(row.kilometraje_actual || 0).toLocaleString()} km` },
      { key: 'estado', label: 'Estado', badge: true }
    ]
  },

  // 6. CATEGORIAS DE VEHICULO
  'categorias-vehiculo': {
    key: 'categorias-vehiculo',
    singular: 'Categoría de Vehículo',
    plural: 'Categorías de Vehículo',
    category: 'flota',
    endpoint: '/api/categorias-vehiculo',
    description: 'Clasificación de unidades (pesado, liviano, refrigerado), tipo de licencia y umbral de mantenimiento preventivo.',
    fields: [
      { name: 'nombre', label: 'Nombre de Categoría', type: 'text', required: true },
      { name: 'requiere_licencia_tipo', label: 'Licencia Requerida (B1, B2, C2, etc.)', type: 'text', required: true },
      { name: 'intervalo_km_mantenimiento', label: 'Intervalo Preventivo (km)', type: 'number', required: true, defaultValue: 5000 }
    ],
    tableColumns: [
      { key: 'id', label: 'ID' },
      { key: 'nombre', label: 'Categoría' },
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
    description: 'Sedes y bases logísticas que albergan unidades, originan rutas y emplean conductores.',
    fields: [
      { name: 'nombre', label: 'Nombre de Sucursal', type: 'text', required: true },
      { name: 'codigo', label: 'Código Único', type: 'text', required: true },
      { name: 'ciudad', label: 'Ciudad / Región', type: 'text' },
      { name: 'telefono', label: 'Teléfono', type: 'text' },
      { name: 'direccion', label: 'Dirección Completa', type: 'text', fullWidth: true }
    ],
    tableColumns: [
      { key: 'id', label: 'ID' },
      { key: 'codigo', label: 'Código', badge: true },
      { key: 'nombre', label: 'Nombre' },
      { key: 'ciudad', label: 'Ciudad' },
      { key: 'telefono', label: 'Teléfono' },
      { key: 'direccion', label: 'Dirección' }
    ]
  },

  // 8. CONDUCTORES
  'conductores': {
    key: 'conductores',
    singular: 'Conductor',
    plural: 'Conductores',
    category: 'flota',
    endpoint: '/api/conductores',
    description: 'Gestión de personal operativo, licencias, vigencias y base asignada.',
    fields: [
      { name: 'sucursal_id', label: 'Sucursal / Base', type: 'select', required: true, refEntity: 'sucursales', refValue: 'id', refLabel: 'nombre' },
      { name: 'cedula', label: 'Cédula / Identificación', type: 'text', required: true },
      { name: 'nombre_completo', label: 'Nombre Completo', type: 'text', required: true },
      { name: 'licencia_tipo', label: 'Tipo de Licencia', type: 'text', required: true },
      { name: 'licencia_vencimiento', label: 'Vencimiento de Licencia', type: 'date', required: true },
      { name: 'estado', label: 'Estado', type: 'select', required: true, options: ['activo', 'inactivo', 'suspendido'], defaultValue: 'activo' },
      { name: 'telefono', label: 'Teléfono', type: 'text' },
      { name: 'correo', label: 'Correo Electrónico', type: 'text' }
    ],
    tableColumns: [
      { key: 'id', label: 'ID' },
      { key: 'cedula', label: 'Cédula' },
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
      { name: 'duracion_estimada_horas', label: 'Duración Estimada (horas)', type: 'number', required: true, defaultValue: 0 }
    ],
    tableColumns: [
      { key: 'id', label: 'ID' },
      { key: 'nombre_ruta', label: 'Nombre Ruta' },
      { key: 'sucursal_origen', label: 'Origen', render: (row) => row.sucursal_origen ? row.sucursal_origen.nombre : '-' },
      { key: 'destino', label: 'Destino' },
      { key: 'distancia_estimada_km', label: 'Distancia', render: (row) => `${Number(row.distancia_estimada_km || 0)} km` },
      { key: 'duracion_estimada_horas', label: 'Duración', render: (row) => `${Number(row.duracion_estimada_horas || 0)} hrs` }
    ]
  },

  // 10. ASIGNACIONES DE VIAJE
  'asignaciones-viaje': {
    key: 'asignaciones-viaje',
    singular: 'Asignación de Viaje',
    plural: 'Asignaciones de Viaje',
    category: 'logistica',
    endpoint: '/api/asignaciones-viaje',
    description: 'Relación ternaria/M:N que vincula Vehículo, Conductor y Ruta con odómetro y trazabilidad.',
    fields: [
      { name: 'vehiculo_id', label: 'Vehículo', type: 'select', required: true, refEntity: 'vehiculos', refValue: 'id', refLabel: 'placa' },
      { name: 'conductor_id', label: 'Conductor', type: 'select', required: true, refEntity: 'conductores', refValue: 'id', refLabel: 'nombre_completo' },
      { name: 'ruta_id', label: 'Ruta Asignada', type: 'select', required: true, refEntity: 'rutas', refValue: 'id', refLabel: 'nombre_ruta' },
      { name: 'estado', label: 'Estado del Viaje', type: 'select', required: true, options: ['en_curso', 'completado', 'cancelado'], defaultValue: 'en_curso' },
      { name: 'fecha_salida', label: 'Fecha y Hora de Salida', type: 'datetime-local', required: true },
      { name: 'fecha_retorno', label: 'Fecha y Hora de Retorno', type: 'datetime-local' },
      { name: 'km_inicial', label: 'Kilometraje Inicial (Odómetro)', type: 'number', required: true },
      { name: 'km_final', label: 'Kilometraje Final', type: 'number' }
    ],
    tableColumns: [
      { key: 'id', label: 'ID' },
      { key: 'vehiculo', label: 'Vehículo', render: (row) => row.vehiculo ? row.vehiculo.placa : `#${row.vehiculo_id}` },
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
    singular: 'Póliza de Seguro',
    plural: 'Pólizas de Seguro',
    category: 'seguridad',
    endpoint: '/api/polizas-seguro',
    description: 'Garantía y protección de unidades vehiculares, cobertura económica y control de vencimientos.',
    fields: [
      { name: 'vehiculo_id', label: 'Vehículo Asegurado', type: 'select', required: true, refEntity: 'vehiculos', refValue: 'id', refLabel: 'placa' },
      { name: 'aseguradora', label: 'Aseguradora', type: 'text', required: true },
      { name: 'numero_poliza', label: 'Número de Póliza Único', type: 'text', required: true },
      { name: 'cobertura', label: 'Tipo de Cobertura (Total, Terceros, Carga)', type: 'text', required: true },
      { name: 'monto_cobertura', label: 'Monto de Cobertura ($)', type: 'number', required: true, defaultValue: 0 },
      { name: 'estado', label: 'Estado de la Póliza', type: 'select', required: true, options: ['vigente', 'vencida', 'cancelada'], defaultValue: 'vigente' },
      { name: 'fecha_inicio', label: 'Fecha de Emisión', type: 'date', required: true },
      { name: 'fecha_vencimiento', label: 'Fecha de Vencimiento', type: 'date', required: true }
    ],
    tableColumns: [
      { key: 'id', label: 'ID' },
      { key: 'numero_poliza', label: 'Póliza', badge: true },
      { key: 'vehiculo', label: 'Vehículo', render: (row) => row.vehiculo ? row.vehiculo.placa : `#${row.vehiculo_id}` },
      { key: 'aseguradora', label: 'Aseguradora' },
      { key: 'monto_cobertura', label: 'Monto Cobertura', render: (row) => `$${Number(row.monto_cobertura || 0).toLocaleString()}` },
      { key: 'fecha_vencimiento', label: 'Vencimiento' },
      { key: 'estado', label: 'Estado', badge: true }
    ]
  }
};

