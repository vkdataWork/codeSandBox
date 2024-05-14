export type WizardToolbarButtonType = {
    identifier: string;
    type: 'button';
    title: string;
    icon: string;
    disabled?: boolean;
    onClick: (pageNumber: number) => Promise<void>;
    activeOnPages?: string[] | null;
    hint: string;
}