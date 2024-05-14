import { CustomItemViewer, DashboardControl } from 'devexpress-dashboard/common';
import { ICustomItemMetaData } from 'devexpress-dashboard/model/items/custom-item/meta';
import { FormItemTemplates, SaveDashboardExtension, UndoRedoExtension } from 'devexpress-dashboard/designer';
import dxScheduler, { FirstDayOfWeek, Properties, ViewType } from 'devextreme/ui/scheduler';
import DxScheduler from 'devextreme-vue/scheduler';
import DataSource from 'devextreme/data/data_source';
import * as Model from 'devexpress-dashboard/model';
import dxDashboardControl from 'devexpress-dashboard/integration';
import CustomStore from 'devextreme/data/custom_store';
import notify from 'devextreme/ui/notify';
import { exportDataGrid } from 'devextreme/pdf_exporter';

// docu: https://github.com/DevExpress-Examples/asp-net-core-dashboard-custom-item-gallery

const SCHEDULER_EXTENSION_NAME = 'Scheduler';

const svgIcon =
	`<?xml version="1.0" encoding="utf-8"?>
        <svg version="1.1" id="` +
	SCHEDULER_EXTENSION_NAME +
	`"xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M152 24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H64C28.7 64 0 92.7 0 128v16 48V448c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V192 144 128c0-35.3-28.7-64-64-64H344V24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H152V24zM48 192h80v56H48V192zm0 104h80v64H48V296zm128 0h96v64H176V296zm144 0h80v64H320V296zm80-48H320V192h80v56zm0 160v40c0 8.8-7.2 16-16 16H320V408h80zm-128 0v56H176V408h96zm-144 0v56H64c-8.8 0-16-7.2-16-16V408h80zM272 248H176V192h96v56z"/></svg>`;

const schedulerMeta: ICustomItemMetaData = {
	bindings: [
		{
			propertyName: 'ID',
			dataItemType: 'Dimension',
			displayName: 'ID',
			array: false,
			enableInteractivity: false,
			emptyPlaceholder: 'Set ID',
			selectedPlaceholder: 'Configure ID',
		},
		{
			propertyName: 'Text',
			dataItemType: 'Dimension',
			displayName: 'Text',
			array: false,
			enableInteractivity: false,
			emptyPlaceholder: 'Set Text',
			selectedPlaceholder: 'Configure Text',
		},
		{
			propertyName: 'Description',
			dataItemType: 'Dimension',
			displayName: 'Description',
			array: false,
			enableInteractivity: false,
			emptyPlaceholder: 'Set Description',
			selectedPlaceholder: 'Configure Description',
		},
		{
			propertyName: 'StartDate',
			dataItemType: 'Dimension',
			displayName: 'Start Date',
			array: false,
			enableInteractivity: false,
			emptyPlaceholder: 'Set Start',
			selectedPlaceholder: 'Configure Start Date',
		},
		{
			propertyName: 'EndDate',
			dataItemType: 'Dimension',
			displayName: 'Finish Date',
			array: false,
			enableInteractivity: false,
			emptyPlaceholder: 'Set Finish',
			selectedPlaceholder: 'Configure Finish Date',
		},
	],
	customProperties: [
		{
			ownerType: Model.CustomItem,
			propertyName: 'CellDuration',
			valueType: 'number',
			defaultValue: 30,
		},
		{
			ownerType: Model.CustomItem,
			propertyName: 'StartDayHour',
			valueType: 'number',
			defaultValue: 6,
		},
		{
			ownerType: Model.CustomItem,
			propertyName: 'EndDayHour',
			valueType: 'number',
			defaultValue: 15,
		},
		{
			ownerType: Model.CustomItem,
			propertyName: 'FirstDayOfWeek',
			valueType: 'number',
			defaultValue: 1,
		},
		{
			ownerType: Model.CustomItem,
			propertyName: 'CurrentView',
			valueType: 'string',
			defaultValue: 'day',
		},
	],
	optionsPanelSections: [
		{
			onFieldDataChanged: (e: any) => {},
			title: 'Custom options',
			items: [
				{
					dataField: 'CellDuration',
					editorType: 'dxNumberBox',
					label: { text: 'Cell duration' },
					editorOptions: { min: 1, max: 60, step: 1 },
				},
				{
					dataField: 'StartDayHour',
					editorType: 'dxNumberBox',
					label: { text: 'Start day hour' },
					editorOptions: { min: 1, max: 24, step: 1 },
				},
				{
					dataField: 'EndDayHour',
					editorType: 'dxNumberBox',
					label: { text: 'End day hour' },
					editorOptions: { min: 1, max: 24, step: 1 },
				},
				{
					dataField: 'FirstDayOfWeek',
					label: {
						text: 'First day of week',
					},
					template: FormItemTemplates.buttonGroup,
					editorOptions: {
						keyExpr: 'value',
						items: [
							{
								value: 0,
								text: 'Sunday',
							},
							{
								value: 1,
								text: 'Monday',
							},
							{
								value: 6,
								text: 'Saturday',
							},
						],
					},
				},
				{
					dataField: 'CurrentView',
					label: {
						text: 'Current view',
					},
					template: FormItemTemplates.buttonGroup,
					editorOptions: {
						keyExpr: 'value',
						items: [
							{
								value: 'day',
								text: 'Day',
							},
							{
								value: 'week',
								text: 'Week',
							},
							{
								value: 'month',
								text: 'Month',
							},
							{
								value: 'agenda',
								text: 'Agenda',
							},
						],
					},
				},
			],
		},
	],

	interactivity: {
		drillDown: true,
		filter: true,
	},
	icon: SCHEDULER_EXTENSION_NAME,
	title: 'Scheduler',
	index: 3,
};

export class SchedulerExtension {
	name = SCHEDULER_EXTENSION_NAME;
	metaData = schedulerMeta;
	dashboardControl: dxDashboardControl;

	constructor(dashboardControl: DashboardControl) {
		this.dashboardControl = dashboardControl;
		this.dashboardControl.registerIcon(svgIcon);
		this.name = SCHEDULER_EXTENSION_NAME;
		this.metaData = schedulerMeta;
	}

	public createViewerItem = (model: any, element: DxScheduler, content: any) => {
		return new SchedulerViewer(model, element, content, this.dashboardControl);
	};
}

class SchedulerViewer extends CustomItemViewer {
	private dxSchedulerWidget?: dxScheduler;
	private dashboardControl: dxDashboardControl;
	private data: any;
	private schedulerContainer: any;
	private exportingImage: string | any;

	constructor(model: any, container: any, options: any, dashboardControl: dxDashboardControl) {
		super(model, container, options);
		this.dashboardControl = dashboardControl;
		this.exportingImage = new Image();
		this.dashboardControl.registerIcon(svgIcon);
		this.data = new DataSource({
			store: new CustomStore({
				load: async (loadOptions: any) => {
					let data = this.getDataSource();
					return data;
				},
				update: async (key, values) => {
					return this.getDataSource();
				},
				byKey: async (key, extraOptions) => {},
			}),
		});
		this.subscribeProperties();
		this.schedulerContainer = this.dashboardControl.dashboardContainer();
	}

	destroy() {
		this.dxSchedulerWidget?.dispose();
	}

	/* allowExportSingleItem() {
    return true;
  }*/

	hasArguments() {
		return this.getBindingValue('Arguments').length > 0;
	}

	getExportInfo() {
		return {
			image: this.getImageBase64(),
		};
	}

	getImageBase64() {
		var canvas = document.createElement('canvas');
		canvas.width = this.schedulerContainer.clientWidth;
		canvas.height = this.schedulerContainer.clientHeight;
		canvas.getContext('2d')!.drawImage(this.exportingImage, 0, 0);
		return canvas.toDataURL().replace('data:image/png;base64,', '');
	}

	convertSVGtoPNG(svgString: string, width: number, height: number) {
		return new Promise(function (resolve, reject) {
			try {
				const encodedData = 'data:image/svg+xml;base64,' + window.btoa(decodeURIComponent(encodeURIComponent(svgString)));
				var image = new Image();
				var canvas = document.createElement('canvas');
				canvas.width = width;
				canvas.height = height;
				image.onload = () => {
					canvas.getContext('2d')?.drawImage(image, 0, 0);
					resolve(canvas.toDataURL().replace('data:image/png;base64,', ''));
				};
				image.src = encodedData;
			} catch (err) {
				reject('Failed to convert SVG to PNG: ' + err);
			}
		});
	}

	getSchedulerSizeOptions() {
		if (!this.schedulerContainer) return {};

		return { width: this.schedulerContainer.clientWidth, height: this.schedulerContainer.clientHeight };
	}

	subscribeProperties() {
		this.subscribe('CellDuration', (cellDuration) => {
			this.dxSchedulerWidget?.option('cellDuration', cellDuration);
		});
		this.subscribe('StartDayHour', (startDayHour) => {
			this.dxSchedulerWidget?.option('startDayHour', startDayHour);
		});
		this.subscribe('EndDayHour', (endDayHour) => {
			this.dxSchedulerWidget?.option('endDayHour', endDayHour);
		});
		this.subscribe('FirstDayOfWeek', (firstDayOfWeek) => {
			this.dxSchedulerWidget?.option('firstDayOfWeek', firstDayOfWeek);
		});
		this.subscribe('CurrentView', (currentView) => {
			this.dxSchedulerWidget?.option('currentView', currentView);
		});
	}

	getDataSource() {
		let data: any[] = [];
		let datesValid: boolean = true;

		this.iterateData(function (dataRow) {
			data.push({
				id: dataRow.getValue('ID')[0],
				parentId: dataRow.getValue('ParentID')[0] ?? -1,
				title: dataRow.getValue('Text')[0],
				description: dataRow.getValue('Description')[0] || '',
				start: dataRow.getValue('StartDate')[0] as Date,
				end: dataRow.getValue('EndDate')[0] as Date,
				allDay: dataRow.getValue('AllDay')[0] || '',
				clientDataRow: dataRow,
			});

			let currentItem = data[data.length - 1];

			if ((currentItem.start && !(currentItem.start instanceof Date)) || (currentItem.end && !(currentItem.end instanceof Date)))
				datesValid = false;
		});

		if (!datesValid) {
			notify("Gantt: 'Start Date' or 'Finish Date' is not a Date object.", 'warning', 3000);
			return [];
		}
		return data.length > 0 ? data : undefined;
	}

	updateExportingImage() {
		const svg = this.schedulerContainer.firstElementChild;
		const str = new XMLSerializer().serializeToString(svg),
			encodedData = 'data:image/svg+xml;base64,' + window.btoa(decodeURIComponent(encodeURIComponent(str)));
		this.exportingImage.src = encodedData;
	}

	override async renderContent(element: any, changeExisting: boolean) {
		let htmlElement = element instanceof HTMLElement ? element : element[0];
		const isDesignerMode = this.dashboardControl.isDesignMode();

		this.canDrillDown = () => true;
		this.canMasterFilter = () => true;
		this.drillDown = (row: any) => {
			return true;
		};
		this.schedulerContainer = document.createElement('div');
		this.schedulerContainer.style.margin = '20px';
		this.schedulerContainer.style.height = 'calc(100% - 40px)';
		htmlElement.appendChild(this.schedulerContainer);
		let schedulerOptions: Properties = {
			dataSource: this.data,
			endDateExpr: 'end',
			startDateExpr: 'start',
			textExpr: 'title',
			cellDuration: this.getPropertyValue('CellDuration') as number,
			descriptionExpr: 'description',
			endDayHour: this.getPropertyValue('EndDayHour') as number,
			startDayHour: this.getPropertyValue('StartDayHour') as number,
			firstDayOfWeek: this.getPropertyValue('FirstDayOfWeek') as FirstDayOfWeek,
			indicatorUpdateInterval: (this.getPropertyValue('IndicatorUpdateInterval') as number) * 1000,
			currentView: this.getPropertyValue('CurrentView') as ViewType,
			focusStateEnabled: true,
			shadeUntilCurrentTime: false,
			useDropDownViewSwitcher: true,
			currentDate: new Date(),
			onInitialized: (e: any) => {},
			onDisposing: (e: any) => {},
			width: this.getSchedulerSizeOptions().width,
			height: this.getSchedulerSizeOptions().height,
			editing: {
				allowAdding: false,
				allowDeleting: false,
				allowDragging: false,
				allowResizing: false,
				allowTimeZoneEditing: false,
				allowUpdating: false,
			},
		};

		if (!changeExisting) {
			while (element.firstChild) element.removeChild(element.firstChild);
			let div = document.createElement('funnel');
			element.appendChild(div);
			this.dxSchedulerWidget = new dxScheduler(div, schedulerOptions);
		} else {
			this.dxSchedulerWidget?.option(schedulerOptions);
			this.dxSchedulerWidget?._refresh();
		}
	}

	setMasterFilterRecursive(node: any) {
		if (!node) return;
		this.setMasterFilter(node.itemData._customData);
		node.children.forEach((x: any) => this.setMasterFilterRecursive(x));
	}
}
