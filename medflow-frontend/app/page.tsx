import { PlanTier } from "@prisma/client";

import { ExamRequestsTable } from "@/components/dashboard/exam-requests-table";
import { prisma } from "@/lib/prisma";
import { resolveAuthorizationLimit } from "@/lib/plans";
import { getSession } from "@/lib/session";

const planLabel: Record<PlanTier, string> = {
	ESSENTIAL: "Essencial",
	PROFESSIONAL: "Profissional",
	ULTIMATE: "Ultimate",
};

export default async function Page() {
	const session = await getSession();

	if (!session) {
		return (
			<main className="mx-auto flex min-h-screen max-w-5xl items-center px-4">
				<p className="text-muted-foreground text-sm">
					Sessão não encontrada. Acesse com cookies de tenant válidos.
				</p>
			</main>
		);
	}

	const [organization, examRequests] = await Promise.all([
		prisma.organization.findUnique({
			where: { id: session.organizationId },
			select: {
				name: true,
				currentPlan: true,
				monthlyAuthorizationLimit: true,
			},
		}),
		prisma.examRequest.findMany({
			where: {
				organizationId: session.organizationId,
			},
			orderBy: {
				createdAt: "desc",
			},
			take: 100,
		}),
	]);

	const now = new Date();
	const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

	const monthlyAuthorizedCount = await prisma.examRequest.count({
		where: {
			organizationId: session.organizationId,
			status: "AUTHORIZED",
			authorizedAt: {
				gte: monthStart,
			},
		},
	});

	const monthlyLimit = organization
		? resolveAuthorizationLimit(
				organization.currentPlan,
				organization.monthlyAuthorizationLimit
			)
		: null;

	return (
		<main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-5 px-4 py-8">
			<header className="space-y-2">
				<h1 className="text-xl font-semibold">MedAuth • Dashboard</h1>
				<p className="text-muted-foreground text-sm">
					Organização: {organization?.name ?? "N/D"} • Plano: {organization ? planLabel[organization.currentPlan] : "N/D"} • Cota mensal: {monthlyLimit ?? "Ilimitado"} • Utilizado: {monthlyAuthorizedCount}
				</p>
			</header>

			<ExamRequestsTable
				data={examRequests.map((request) => ({
					id: request.id,
					patientName: request.patientName,
					patientPhone: request.patientPhone,
					requestingPhysician: request.requestingPhysician,
					protocol: request.protocol,
					status: request.status,
					deliveryStatus: request.deliveryStatus ?? "-",
					createdAt: request.createdAt.toLocaleString("pt-BR"),
				}))}
			/>
		</main>
	);
}