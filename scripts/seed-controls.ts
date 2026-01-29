import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Seed: Starting multi-framework controls population...');

    const frameworks = [
        // ISO 27001:2022
        {
            framework: 'ISO 27001:2022',
            controls: [
                { code: 'A.5.1', name: 'Políticas para la seguridad de la información', category: 'Organizacional', description: 'Conjunto de directrices para la gestión de la seguridad.' },
                { code: 'A.5.7', name: 'Inteligencia de amenazas', category: 'Organizacional', description: 'Recopilación y análisis de información sobre amenazas.' },
                { code: 'A.6.1', name: 'Cribado (Screening)', category: 'Personas', description: 'Verificaciones de antecedentes para empleados.' },
                { code: 'A.7.1', name: 'Perímetros físicos de seguridad', category: 'Físico', description: 'Protección de áreas que contienen información sensible.' },
                { code: 'A.8.1', name: 'Dispositivos de usuario final', category: 'Tecnológico', description: 'Protección de la información en dispositivos móviles y estaciones.' },
                { code: 'A.8.9', name: 'Gestión de la configuración', category: 'Tecnológico', description: 'Establecimiento y mantenimiento de configuraciones base.' },
            ]
        },
        // NIST CSF 2.0
        {
            framework: 'NIST CSF 2.0',
            controls: [
                { code: 'GV.OC-01', name: 'Misión y Objetivos Organizacionales', category: 'GOVERN', description: 'La misión y estrategia se entienden y se reflejan en la gestión de riesgos.' },
                { code: 'ID.AM-01', name: 'Inventario de Activos Físicos', category: 'IDENTIFY', description: 'Los sistemas y activos físicos se inventarían y gestionan.' },
                { code: 'PR.AC-01', name: 'Gestión de Identidades', category: 'PROTECT', description: 'Acceso a activos físicos y lógicos limitado a usuarios autorizados.' },
                { code: 'DE.CM-01', name: 'Monitoreo Continuo', category: 'DETECT', description: 'La red se monitorea para detectar eventos de ciberseguridad.' },
                { code: 'RS.RP-01', name: 'Planificación de Respuesta', category: 'RESPOND', description: 'Los procesos de respuesta se ejecutan durante un incidente.' },
            ]
        },
        // CIS Controls v8
        {
            framework: 'CIS Controls v8',
            controls: [
                { code: 'CIS-01', name: 'Inventario y Control de Activos Empresariales', category: 'Basic', description: 'Gestionar activamente todos los activos de la empresa.' },
                { code: 'CIS-03', name: 'Protección de Datos', category: 'Basic', description: 'Procesos y herramientas para identificar y proteger datos.' },
                { code: 'CIS-05', name: 'Gestión de Cuentas', category: 'Basic', description: 'Uso de herramientas y procesos para gestionar credenciales.' },
                { code: 'CIS-10', name: 'Defensas contra Malware', category: 'Foundational', description: 'Control de la instalación y ejecución de software malicioso.' },
                { code: 'CIS-18', name: 'Pruebas de Penetración', category: 'Organizational', description: 'Validar la eficacia de las defensas mediante ataques simulados.' },
            ]
        }
    ];

    for (const f of frameworks) {
        console.log(`Seeding framework: ${f.framework}...`);
        for (const control of f.controls) {
            await prisma.control.upsert({
                where: { code: control.code },
                update: {
                    framework: f.framework,
                    category: control.category,
                    name: control.name,
                    description: control.description
                },
                create: {
                    code: control.code,
                    name: control.name,
                    description: control.description,
                    framework: f.framework,
                    category: control.category
                }
            });
        }
    }

    console.log('Seed: Multi-framework controls successfully populated.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
