import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { createClient } from "@/lib/supabase/server";
import { RoadmapDocument } from "@/lib/pdf/RoadmapDocument";
import type { GeneratedPlanRow, PathwayStepRow } from "@/lib/types/database";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ planId: string }> }
) {
  const { planId } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { data: plan } = await supabase
    .from("generated_plans")
    .select("*")
    .eq("id", planId)
    .single<GeneratedPlanRow>();

  if (!plan) {
    return NextResponse.json({ error: "Plan not found" }, { status: 404 });
  }

  const stepCodes = plan.steps.map((s) => s.step_code);
  const { data: pathwaySteps } = await supabase
    .from("pathway_steps")
    .select("*")
    .in("code", stepCodes)
    .returns<PathwayStepRow[]>();

  const stepsByCode = new Map((pathwaySteps ?? []).map((s) => [s.code, s]));

  const buffer = await renderToBuffer(
    <RoadmapDocument plan={plan} stepsByCode={stepsByCode} />
  );

  await supabase
    .from("generated_plans")
    .update({ pdf_generated_at: new Date().toISOString() })
    .eq("id", plan.id);

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="uk-dental-career-plan-${plan.id}.pdf"`,
    },
  });
}
