import ComparisonPage from "@/components/ComparisonPage";

export default async function DynamicComparisonPage({ params }: { params: { id: string } }) {
  // Espera o valor de params.id ser carregado
  const { id } = params;

  return <ComparisonPage id={id} />;
}
