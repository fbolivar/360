const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Seeding data...');

    // Create Users
    const admin = await prisma.user.upsert({
        where: { email: 'admin@pnn.gov.co' },
        update: {},
        create: {
            email: 'admin@pnn.gov.co',
            fullName: 'Fernando Bolívar',
            role: 'ADMIN_TIC',
        },
    });

    const analista = await prisma.user.upsert({
        where: { email: 'analista@pnn.gov.co' },
        update: {},
        create: {
            email: 'analista@pnn.gov.co',
            fullName: 'Ana Lizarazo',
            role: 'ANALISTA_SOC',
        },
    });

    // Create Controls (Library)
    const controlsData = [
        { code: 'A.5.1', name: 'Políticas de Seguridad de la Información', framework: 'ISO27001' },
        { code: 'A.8.1', name: 'Inventario de Activos', framework: 'ISO27001' },
        { code: 'A.9.2', name: 'Gestión de Acceso de Usuario', framework: 'ISO27001' },
        { code: 'A.12.6', name: 'Gestión de Vulnerabilidades Técnicas', framework: 'ISO27001' },
    ];

    for (const c of controlsData) {
        await prisma.control.upsert({
            where: { code: c.code },
            update: {},
            create: c,
        });
    }

    // Create Assets
    const assets = [
        {
            name: 'Sistema de Monitoreo PNN Chingaza',
            type: 'SERVIDOR',
            criticality: 5,
            confidentiality: 4,
            integrity: 5,
            availability: 5,
            classification: 'USO_INTERNO',
            location: 'PNN Chingaza',
            ownerId: admin.id,
        },
        {
            name: 'Base de Datos SIG Ambiental',
            type: 'APLICATIVO',
            criticality: 5,
            confidentiality: 5,
            integrity: 5,
            availability: 4,
            classification: 'RESTRINGIDA',
            location: 'Nivel Central',
            ownerId: admin.id,
        },
        {
            name: 'Red de Radiocomunicaciones HF Territorial Pacífico',
            type: 'RED',
            criticality: 4,
            confidentiality: 3,
            integrity: 4,
            availability: 5,
            classification: 'USO_INTERNO',
            location: 'Buenaventura - Pacífico',
            ownerId: analista.id,
        },
        {
            name: 'Estación Hidrometeorológica PNN Puracé',
            type: 'ESTACION',
            criticality: 3,
            confidentiality: 2,
            integrity: 5,
            availability: 4,
            classification: 'PUBLICA',
            location: 'PNN Puracé',
            ownerId: analista.id,
        },
    ];

    for (const a of assets) {
        const asset = await prisma.asset.create({ data: a });

        // Add some vulnerabilities
        await prisma.vulnerability.create({
            data: {
                description: 'Vulnerabilidad crítica en kernel de Linux - CVE-2024-XXXX',
                severity: 9.8,
                status: 'ABIERTA',
                assetId: asset.id,
            }
        });

        if (asset.criticality === 5) {
            await prisma.incident.create({
                data: {
                    title: 'Intento de acceso no autorizado detectado',
                    description: 'Múltiples intentos de fuerza bruta desde IP extranjera',
                    severity: 'ALTA',
                    assetId: asset.id,
                }
            });
        }
    }

    console.log('Seeding complete!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
