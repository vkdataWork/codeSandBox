import {WorkflowStepTypeEnum} from "@/Types/Workflow/WorkflowStepTypeEnum";
import i18n from "@/Plugins/I18n";

export function GetStepTypeLabel(stepType: WorkflowStepTypeEnum): string {
    const t = i18n.global.t;

    switch (stepType) {
        case WorkflowStepTypeEnum.StartStep:
            return t('Workflow.StartStep');
        case WorkflowStepTypeEnum.EndStep:
            return t('Workflow.EndStep');
        case WorkflowStepTypeEnum.TestManualStep:
            return t('Workflow.TestManualStep');
        case WorkflowStepTypeEnum.TestStep:
            return t('Workflow.TestStep');
        case WorkflowStepTypeEnum.TestFailStep:
            return t('Workflow.TestFailStep');
        case WorkflowStepTypeEnum.Transformation:
            return t('Workflow.Transformation');
        default:
            return '';
    }
}