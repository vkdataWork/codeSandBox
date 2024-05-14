import dxLoadingPanel from 'devextreme/ui/load_panel';
import dxPopup from 'devextreme/ui/popup';
import dxDataGrid from 'devextreme/ui/data_grid';
import dxTreeList from 'devextreme/ui/tree_list';
import dxToast from 'devextreme/ui/toast';
import { useI18n } from 'vue-i18n';

export function setDxDefaults(): void {
    const { t } = useI18n();
    const mobileDevices = [{ deviceType: 'phone' }, { deviceType: 'tablet' }] as any;
    const desktopDevice = { deviceType: 'desktop' } as any;
    const popupSettingsForDesktop = {
        fullScreen: false,
        resizeEnabled: true,
        maxHeight: () => window.innerHeight,
        maxWidth: () => window.innerWidth,
        dragEnabled: true,
    };

    const popupSettingsForMobile = {
        fullScreen: true,
    };

    const popupSettings = {
        showTitle: true,
    };

    dxLoadingPanel.defaultOptions({
        options: {
            showIndicator: true,
            showPane: true,
            closeOnOutsideClick: true,
            shading: true,
            shadingColor: 'rgba(255,255,255,1)',
            position: { my: 'center', at: 'center', of: 'window' },
        },
    });

    // DXPopup
    dxPopup.defaultOptions({
        device: mobileDevices,
        options: popupSettingsForMobile,
    });

    dxPopup.defaultOptions({
        device: desktopDevice,
        options: popupSettingsForDesktop,
    });

    dxPopup.defaultOptions({
        options: popupSettings,
    });

    // DXDataGrid
    dxDataGrid.defaultOptions({
        device: mobileDevices,
        options: {
            editing: {
                popup: popupSettingsForMobile,
            },
        },
    });

    dxDataGrid.defaultOptions({
        device: desktopDevice,
        options: {
            editing: {
                popup: popupSettingsForDesktop,
            },
        },
    });

    dxDataGrid.defaultOptions({
        options: {
            columnResizingMode: 'widget',
            editing: {
                popup: popupSettings,
            },
            filterBuilder: {
                groupOperationDescriptions: {
                    and: 'AND',
                    or: 'OR',
                    notAnd: 'NOT AND',
                    notOr: 'NOT OR',
                },
            },
        },
    });

    // DXTreeList
    dxTreeList.defaultOptions({
        device: mobileDevices,
        options: {
            editing: {
                popup: popupSettingsForMobile,
            },
            filterBuilder: {
                groupOperationDescriptions: {
                    and: 'AND',
                    or: 'OR',
                    notAnd: 'NOT AND',
                    notOr: 'NOT OR',
                },
            },
        },
    });

    dxTreeList.defaultOptions({
        device: desktopDevice,
        options: {
            editing: {
                popup: popupSettingsForDesktop,
            },
        },
    });

    dxTreeList.defaultOptions({
        device: desktopDevice,
        options: {
            columnResizingMode: 'widget',
            editing: {
                popup: popupSettings,
            },
        },
    });

    dxToast.defaultOptions({
        device: mobileDevices,
        options: {
            width: '95%',
            position: {
                at: 'bottom center',
                my: 'bottom center',
                offset: '0 -5',
            },
        },
    });

    dxToast.defaultOptions({
        device: desktopDevice,
        options: {
            width: 300,
            position: {
                at: 'bottom right',
                my: 'bottom right',
                offset: '-20 -20',
            },
        },
    });
}
