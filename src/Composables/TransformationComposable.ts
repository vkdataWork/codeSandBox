import {TransformationTemplateTypeEnum} from "@/Types/TransformationTemplate/TransformationTemplateTypeEnum";
import {Language} from "@/Views/Commons/codeMirror_languages/LanguagesEnum";

export default function getIdeLanguage(transformationType: TransformationTemplateTypeEnum): Language {
    switch (transformationType) {
        case TransformationTemplateTypeEnum.Unspecified:
            return Language.Empty;
        case TransformationTemplateTypeEnum.R:
            return Language.R;
        case TransformationTemplateTypeEnum.PsSql:
            return Language.PSQL;
        case TransformationTemplateTypeEnum.Python:
            return Language.Python;
        default:
            throw new Error(`Unknown transformation type ${transformationType}`);
    }
}