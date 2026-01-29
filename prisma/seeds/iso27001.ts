
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding ISO 27001...');

    // 1. Crear Framework
    const iso27001 = await prisma.framework.create({
        data: {
            name: "ISO/IEC 27001:2022",
            description: "Estándar internacional para la gestión de seguridad de la información."
        }
    });

    console.log(`Creado Framework: ${iso27001.name}`);

    // 2. Crear Requisitos (Selección de Anexo A para demostración)
    // Definimos algunos controles clave de la norma
    const requirements = [
        { code: "5.1", description: "Políticas para la seguridad de la información" },
        { code: "5.7", description: "Inteligencia de amenazas" },
        { code: "5.15", description: "Control de acceso" },
        { code: "5.17", description: "Información de autenticación" },
        { code: "6.1", description: "Selección de personal" },
        { code: "8.8", description: "Gestión de vulnerabilidades técnicas" },
        { code: "8.10", description: "Borrado de información" },
        { code: "8.12", description: "Prevención de fuga de datos" },
        { code: "8.25", description: "Ciclo de vida de desarrollo seguro" }
    ];

    for (const req of requirements) {
        await prisma.requirement.create({
            data: {
                frameworkId: iso27001.id,
                code: req.code,
                description: req.description
            }
        });
    }

    console.log(`✅ ${requirements.length} requisitos creados para ISO 27001`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
