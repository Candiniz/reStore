import ComparisonPage from "@/components/ComparisonPage";

export default async function DynamicComparisonPage({ params }: { params: Promise<{ id: string }> }) {
  // Aguarde o resultado de params
  const { id } = await params;

  return <ComparisonPage id={id} />;
}
