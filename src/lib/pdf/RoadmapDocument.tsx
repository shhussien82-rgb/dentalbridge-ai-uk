import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { GeneratedPlanRow, PathwayStepRow } from "@/lib/types/database";

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 11, fontFamily: "Helvetica" },
  title: { fontSize: 18, fontFamily: "Helvetica-Bold", marginBottom: 4 },
  subtitle: { fontSize: 10, color: "#666", marginBottom: 16 },
  sectionHeading: { fontSize: 13, fontFamily: "Helvetica-Bold", marginTop: 16, marginBottom: 6 },
  paragraph: { marginBottom: 8, lineHeight: 1.4 },
  gapItem: { marginBottom: 3 },
  stepBlock: { marginBottom: 12, paddingBottom: 10, borderBottom: "1pt solid #ddd" },
  stepTitle: { fontSize: 12, fontFamily: "Helvetica-Bold", marginBottom: 3 },
  stepMeta: { fontSize: 9, color: "#666", marginTop: 3 },
  footer: { marginTop: 24, fontSize: 8, color: "#888", lineHeight: 1.4 },
});

interface Props {
  plan: GeneratedPlanRow;
  stepsByCode: Map<string, PathwayStepRow>;
}

export function RoadmapDocument({ plan, stepsByCode }: Props) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Your UK Dental Career Plan</Text>
        <Text style={styles.subtitle}>
          Generated {new Date(plan.generated_at).toLocaleDateString("en-GB")} ·
          DentalBridge AI UK
        </Text>

        <Text style={styles.sectionHeading}>Where you stand</Text>
        <Text style={styles.paragraph}>{plan.status_summary}</Text>

        {plan.gaps.length > 0 && (
          <>
            <Text style={styles.sectionHeading}>Key gaps</Text>
            {plan.gaps.map((gap) => (
              <Text key={gap} style={styles.gapItem}>
                • {gap}
              </Text>
            ))}
          </>
        )}

        {plan.estimated_timeline_weeks_min != null && (
          <Text style={styles.paragraph}>
            Estimated timeline: {plan.estimated_timeline_weeks_min}–
            {plan.estimated_timeline_weeks_max} weeks (steps shown sequentially;
            some can run in parallel in practice)
          </Text>
        )}

        <Text style={styles.sectionHeading}>Your step-by-step plan</Text>
        {plan.steps.map((s, i) => {
          const step = stepsByCode.get(s.step_code);
          return (
            <View key={s.step_code} style={styles.stepBlock}>
              <Text style={styles.stepTitle}>
                {i + 1}. {step?.title ?? s.step_code}
              </Text>
              <Text style={styles.paragraph}>{s.narrative}</Text>
              {step && (
                <Text style={styles.stepMeta}>
                  Typical duration: {step.typical_duration_weeks_min}–
                  {step.typical_duration_weeks_max} weeks
                  {!step.sme_reviewed && " · not yet SME-verified"}
                </Text>
              )}
            </View>
          );
        })}

        <Text style={styles.footer}>
          This plan is generated from a structured knowledge base and AI
          narration. It is informational and does not replace official GDC,
          UKVI, or NHS guidance — always verify current requirements directly
          with those bodies before making decisions.
        </Text>
      </Page>
    </Document>
  );
}
