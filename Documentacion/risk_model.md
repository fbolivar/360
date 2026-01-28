# Modelo de Riesgo Ambiental PNN

Este documento describe la metodología técnica y misional para el cálculo de riesgo en la plataforma **CyberRisk 360**.

## 1. Riesgo Inherente (Ri)

$Ri = P \times I$

- **Impacto (I)**: Se calcula promediando la Criticidad del Activo (C) y sus dimensiones de seguridad (CIA).
  - $I = (C + Confidencialidad + Integridad + Disponibilidad) / 4$
- **Probabilidad (P)**: Determinada por el volumen de fallos y eventos previos.
  - $P_{vulns} = \min(Aberturas \times 0.5, 5)$
  - $P_{incid} = \min(Incidentes \times 1.5, 5)$
  - $P = \max((P_{vulns} + P_{incid}) / 2, 1)$

## 2. Riesgo Residual (Rr)

$Rr = Ri \times (1 - E)$

- **Efectividad (E)**: Es el promedio de la efectividad declarada en los controles aplicados al activo.
  - $E = \sum(Efectividad_c) / n_{controles}$

## 3. Matriz de Severidad
- **0.0 - 1.5**: Bajo (Verde)
- **1.6 - 3.5**: Medio (Amarillo)
- **3.6 - 4.5**: Alto (Naranja)
- **4.6 - 5.0**: Crítico (Rojo)
