import {custom} from 'devextreme/ui/dialog';
import i18n from "@/Plugins/I18n";

export enum YesNoCancelEnum {
    Yes = 'Yes',
    No = 'No',
    Cancel = 'Cancel',
}

export default class DialogFactory {
    static CreateConfirmationDialogue(message: string, trueText: string, falseText: string, titleText: string = ''): any {
        return custom({
            messageHtml: message,
            showTitle: titleText !== '',
            title: titleText,
            dragEnabled: true,
            buttons: [{
                text: trueText,
                onClick: () => true,
            }, {
                text: falseText,
                onClick: () => false,
            }],
        });
    }

    static CreateYesNoDialogue(message: string, titleText: string = '', showCancel: boolean = true): any {
        const buttons = [{
            text: i18n.global.t('Yes'),
            onClick: () => YesNoCancelEnum.Yes,
        }, {
            text: i18n.global.t('No'),
            onClick: () => YesNoCancelEnum.No,
        }];

        if (showCancel) {
            buttons.push({
                text: i18n.global.t('Cancel'),
                onClick: () => YesNoCancelEnum.Cancel,
            });
        }

        return custom({
            messageHtml: message,
            showTitle: titleText !== '',
            title: titleText,
            dragEnabled: true,
            buttons: buttons,
        });
    }

    static CreateAlertDialogue(message: string, titleText: string = ''): any {
        return custom({
            messageHtml: message,
            showTitle: titleText !== '',
            title: titleText,
            dragEnabled: true,
            buttons: [{
                text: 'OK',
            }],
        });
    }

    static CreateLeavingDialogue(message: string, trueText: string, falseText: string, cancelText:string,titleText: string = ''): any {
        return custom({
            messageHtml: message,
            showTitle: titleText !== '',
            title: titleText,
            dragEnabled: true,
            buttons: [{
                text: trueText,
                onClick: () => true,
            }, {
                text: falseText,
                onClick: () => false,
            },{
                text: cancelText,
                onClick: () => null,
            }],
        });
    }

}