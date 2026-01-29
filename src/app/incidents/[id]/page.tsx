import { getIncidentById } from "@/features/incidents/services/incidentService";
import { IncidentDetails } from "@/features/incidents/components/IncidentDetails";
import { notFound } from "next/navigation";

interface Props {
    params: Promise<{ id: string }>;
}

export default async function IncidentPage({ params }: Props) {
    const { id } = await params;
    const incident = await getIncidentById(id);

    if (!incident) {
        notFound();
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-10">
            <IncidentDetails incident={incident} />
        </div>
    );
}
