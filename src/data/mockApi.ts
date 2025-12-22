import { baseDatasetDetail, datasetDetails } from "@/lib/seedData";

function jitterTrend(arr: number[]) {
  return arr.map((v, i) => (i % 6 === 0 ? v - 1 : i % 7 === 0 ? v + 1 : v));
}

function synthesizeFromBase(id: string) {
  const [domain, schema, dataset] = id.split("-");
  return {
    ...baseDatasetDetail,
    domain,
    schema,
    dataset,
    description: `Auto-generated detail for ${dataset} in ${domain}/${schema}.`,
    trustScoreTrend30d: jitterTrend(baseDatasetDetail.trustScoreTrend30d),
    pipelineRuns: baseDatasetDetail.pipelineRuns.map((r, i) =>
      i === 1
        ? { ...r, runId: `${dataset}-FIX-01`, issue: "Auto schema alignment", fix: "Added missing column(s)" }
        : { ...r, runId: `${dataset}-RUN-${String(i + 1).padStart(2, "0")}` }
    )
  };
}

export async function fetchDatasetDetail(id: string) {
  // simulate latency
  await new Promise((r) => setTimeout(r, 250));
  return datasetDetails[id] ?? synthesizeFromBase(id);
}