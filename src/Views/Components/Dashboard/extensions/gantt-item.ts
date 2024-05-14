import { ICustomItemExtension, CustomItemViewer, DashboardControl } from 'devexpress-dashboard/common';
import { ICustomItemMetaData } from 'devexpress-dashboard/model/items/custom-item/meta';
import dxGantt from 'devextreme/ui/gantt';
import DxGantt from 'devextreme-vue/gantt';
import notify from 'devextreme/ui/notify';
import dxCheckBox from 'devextreme/ui/check_box';

const GANTT_EXTENSION_NAME = 'GanttItem';

const svgIcon =
  `<?xml version="1.0" encoding="utf-8"?>
    <svg version="1.1" id="` +
  GANTT_EXTENSION_NAME +
  `" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 24 24" style="enable-background:new 0 0 24 24;" xml:space="preserve">
        <path class="dx-dashboard-contrast-icon" d="M23,2c0-0.6-0.4-1-1-1H2C1.4,1,1,1.4,1,2v20c0,0.6,0.4,1,1,1h20c0.6,0,1-0.4,1-1 V2z M21,21H3V3h18V21z"/>
        <path class="dx-dashboard-accent-icon" d="M12,9H5V5h7V9z M19,10H9v4h10V10z M15,15H7v4h8V15z"/>
    </svg>`;

const ganttItemMeta: ICustomItemMetaData = {
  bindings: [
    {
      propertyName: 'ID',
      dataItemType: 'Dimension',
      displayName: 'ID',
      array: false,
      enableInteractivity: true,
      emptyPlaceholder: 'Set ID',
      selectedPlaceholder: 'Configure ID',
    },
    {
      propertyName: 'ParentID',
      dataItemType: 'Dimension',
      displayName: 'Parent ID',
      array: false,
      enableInteractivity: true,
      emptyPlaceholder: 'Set Parent ID',
      selectedPlaceholder: 'Configure Parent ID',
    },
    {
      propertyName: 'Text',
      dataItemType: 'Dimension',
      displayName: 'Text',
      array: false,
      enableInteractivity: true,
      emptyPlaceholder: 'Set Text',
      selectedPlaceholder: 'Configure Text',
    },
    {
      propertyName: 'StartDate',
      dataItemType: 'Dimension',
      displayName: 'Start Date',
      array: false,
      enableInteractivity: true,
      emptyPlaceholder: 'Set Start Date',
      selectedPlaceholder: 'Configure Start Date',
    },
    {
      propertyName: 'FinishDate',
      dataItemType: 'Dimension',
      displayName: 'Finish Date',
      array: false,
      enableInteractivity: true,
      emptyPlaceholder: 'Set Finish Date',
      selectedPlaceholder: 'Configure Finish Date',
    },
  ],
  interactivity: {
    filter: true,
  },
  icon: GANTT_EXTENSION_NAME,
  title: 'Gantt Chart',
};

export class GanttItemExtension implements ICustomItemExtension {
  name = GANTT_EXTENSION_NAME;
  metaData = ganttItemMeta;
  dashboardControl: DashboardControl;

  constructor(dashboardControl: any) {
    dashboardControl.registerIcon(svgIcon);
    this.dashboardControl = dashboardControl;
  }

  public createViewerItem = (model: any, element: DxGantt, content: any) => {
    return new GanttItemViewer(model, element, content, this.dashboardControl);
  };
}

export class GanttItemViewer extends CustomItemViewer {
  dxGanttWidget?: dxGantt;
  private dashboardControl: DashboardControl;
  private gantContainer: any;
  private exportingImage: any;

  constructor(model: any, container: any, options: any, dashboardControl: DashboardControl) {
    super(model, container, options);
    this.dashboardControl = dashboardControl;
    this.exportingImage = null;
    this.gantContainer = this.dashboardControl.dashboardContainer();
  }

/* allowExportSingleItem() {
    return true;
  }*/

  _getDataSource() {
    let data: any[] = [];
    let datesValid: boolean = true;

    this.iterateData(function (dataRow) {
      data.push({
        id: dataRow.getValue('ID')[0],
        parentId: dataRow.getValue('ParentID')[0] ?? -1,
        title: dataRow.getValue('Text')[0],
        start: dataRow.getValue('StartDate')[0] as Date,
        end: dataRow.getValue('FinishDate')[0] as Date,
        clientDataRow: dataRow,
      });

      let currentItem = data[data.length - 1];

      if ((currentItem.start && !(currentItem.start instanceof Date)) || (currentItem.end && !(currentItem.end instanceof Date))) datesValid = false;
    });

    if (!datesValid) {
      notify("Gantt: 'Start Date' or 'Finish Date' is not a Date object.", 'warning', 3000);
      return [];
    }
    return data;
  }

  _getDxGanttWidgetSettings() {
    return {
      rootValue: -1,
      showRowLines: true,
      tasks: {
        dataSource: this._getDataSource(),
        keyExpr: 'id',
        parentIdExpr: 'parentId',
      },
      columns: [
        {
          dataField: 'title',
          caption: 'Subject',
          width: 300,
        },
        {
          dataField: 'start',
          caption: 'Start Date',
        },
        {
          dataField: 'end',
          caption: 'End Date',
        },
      ],

      onTaskClick: (e: any) => {
        let tasks = e.component.option('tasks.dataSource');
        let clickedTask = tasks.filter((item: any) => item.id === e.key)[0];

        this.setMasterFilter(clickedTask.clientDataRow);
      },
      taskListWidth: 300,
      firstDayOfWeek: 1,
      scaleTypeRange: {
        min: 'hours',
        max: 'years',
      },
      allowSelectAll: true,
      endDateRange: new Date(2030, 12, 31),
      /*  toolbar: {
        items: [
          {
            widget: 'dxButton',
            cssClass: 'dx-remove-custom-button',
            options: {
              icon: 'clearformat',
              onClick: () => {},
            },
          },
          {
            widget: 'dxButton',
            location: 'after',
            cssClass: 'dx-refresh-custom-button',
            options: {
              icon: 'upload',
              onClick: () => {},
            },
          },
        ],
      },*/
    };
  }

  override renderContent(element: HTMLElement, changeExisting: boolean, afterRenderCallback?: any) {
    if (!changeExisting) {
      while (element.firstChild) element.removeChild(element.firstChild);
      this.dxGanttWidget = new dxGantt(element, <any>this._getDxGanttWidgetSettings());
    } else {
      this.dxGanttWidget?.option(<any>this._getDxGanttWidgetSettings());
    }
  }

  override setSelection(values: Array<Array<any>>): void {
    super.setSelection(values);

    let tasks: any = this.dxGanttWidget?.option('tasks.dataSource');
    tasks.forEach((item: any) => {
      if (this.isSelected(item.clientDataRow)) this.dxGanttWidget?.option('selectedRowKey', item.id);
    });
  }

  override clearSelection(): void {
    super.clearSelection();
    this.dxGanttWidget?.option('selectedRowKey', null);
  }

  override setSize(width: number, height: number): void {
    super.setSize(width, height);
    this.dxGanttWidget?.repaint();
  }

  getExportInfo() {
    return {
      image: this.exportingImage,
    };
  }

  getImageBase64() {
    var canvas = document.createElement('canvas');
    canvas.width = this.gantContainer.clientWidth;
    canvas.height = this.gantContainer.clientHeight;
    canvas.getContext('2d')!.drawImage(this.exportingImage, 0, 0);
    return canvas.toDataURL().replace('data:image/png;base64,', '');
  }

  convertSVGtoPNG(svgString: string, width: number, height: number) {
    return new Promise(function (resolve, reject) {
      try {
        const blob = new Blob([svgString], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);

        var image = new Image();
        var canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        image.onload = () => {
          canvas.getContext('2d')!.drawImage(image, 0, 0);
          URL.revokeObjectURL(url); // Uvolní objekt URL pro ušetření paměti
          resolve(canvas.toDataURL().replace('data:image/png;base64,', ''));
        };
        image.src = url;
      } catch (err) {
        reject('Failed to convert SVG to PNG: ' + err);
      }
    });
  }
}
