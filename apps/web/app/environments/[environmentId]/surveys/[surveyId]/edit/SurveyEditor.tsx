"use client";

import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { ErrorComponent } from "@formbricks/ui";
import { useProduct } from "@/lib/products/products";
import { useSurvey } from "@/lib/surveys/surveys";
import type { Survey } from "@formbricks/types/surveys";
import { useEffect, useState } from "react";
import PreviewSurvey from "../../PreviewSurvey";
import AudienceView from "./AudienceView";
import QuestionsAudienceTabs from "./QuestionsAudienceTabs";
import QuestionsView from "./QuestionsView";
import SurveyMenuBar from "./SurveyMenuBar";

interface SurveyEditorProps {
  environmentId: string;
  surveyId: string;
}

export default function SurveyEditor({ environmentId, surveyId }: SurveyEditorProps) {
  const [activeView, setActiveView] = useState<"questions" | "audience">("questions");
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null);
  const [localSurvey, setLocalSurvey] = useState<Survey | null>();

  const { survey, isLoadingSurvey, isErrorSurvey } = useSurvey(environmentId, surveyId);
  const { product, isLoadingProduct, isErrorProduct } = useProduct(environmentId);

  useEffect(() => {
    if (survey) {
      if (!localSurvey) {
        setLocalSurvey(survey);
      }

      if (!activeQuestionId && survey.questions.length > 0) {
        setActiveQuestionId(survey.questions[0].id);
      }
    }
  }, [survey]);

  if (isLoadingSurvey || isLoadingProduct || !localSurvey) {
    return <LoadingSpinner />;
  }

  if (isErrorSurvey || isErrorProduct) {
    return <ErrorComponent />;
  }

  return (
    <div className="flex h-full flex-col">
      <SurveyMenuBar
        setLocalSurvey={setLocalSurvey}
        localSurvey={localSurvey}
        environmentId={environmentId}
        activeId={activeView}
        setActiveId={setActiveView}
      />
      <div className="relative z-0 flex flex-1 overflow-hidden">
        <main className="relative z-0 flex-1 overflow-y-auto focus:outline-none">
          <QuestionsAudienceTabs activeId={activeView} setActiveId={setActiveView} />
          {activeView === "questions" ? (
            <QuestionsView
              localSurvey={localSurvey}
              setLocalSurvey={setLocalSurvey}
              activeQuestionId={activeQuestionId}
              setActiveQuestionId={setActiveQuestionId}
            />
          ) : (
            <AudienceView
              environmentId={environmentId}
              localSurvey={localSurvey}
              setLocalSurvey={setLocalSurvey}
            />
          )}
        </main>
        <aside className="relative hidden h-full flex-1 flex-shrink-0 overflow-hidden border-l border-slate-200 bg-slate-200 shadow-inner md:flex md:flex-col">
          <PreviewSurvey
            activeQuestionId={activeQuestionId}
            questions={localSurvey.questions}
            brandColor={product.brandColor}
          />
        </aside>
      </div>
    </div>
  );
}