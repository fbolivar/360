# Modelo de Auditoría y Control

## 1. Trazabilidad Inmutable
Todas las acciones críticas dentro de la plataforma CyberRisk 360 se registran en la tabla `audit_logs`. Cada entrada contiene:
- `user_id`: Identificación del responsable.
- `action`: Descripción técnica de la acción (e.g., UPDATE_ASSET, APPROVE_RISK).
- `details`: Snapshot en formato JSON del estado anterior y nuevo.

## 2. Separación de Funciones (RBAC)
- **AUDITOR_INTERNO**: Tiene acceso a los logs de auditoría pero no puede modificar activos ni riesgos.
- **ADMIN_TIC**: No puede borrar ni modificar entradas en la tabla de auditoría.

## 3. Gestión de Evidencias
Cada mitigación de vulnerabilidad o control evaluado requiere el adjunto de una evidencia (link o referencia) para soportar auditorías externas de la Contraloría o el Ministerio TIC.
