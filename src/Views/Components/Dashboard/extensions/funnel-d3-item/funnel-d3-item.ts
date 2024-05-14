import { CustomItemExportInfo, CustomItemViewer, DashboardControl } from 'devexpress-dashboard/common';
import { ICustomItemMetaData } from 'devexpress-dashboard/model/items/custom-item/meta';
import { FormItemTemplates, SaveDashboardExtension, UndoRedoExtension } from 'devexpress-dashboard/designer';
import dxFunnel, { LabelPosition, Properties } from 'devextreme/viz/funnel';
import DataSource from 'devextreme/data/data_source';
import * as Model from 'devexpress-dashboard/model';
import DxFunnel from 'devextreme-vue/funnel';
import dxDashboardControl from 'devexpress-dashboard/integration';
import CustomStore from 'devextreme/data/custom_store';
import domtoimage from 'dom-to-image-more';

// docu: https://github.com/DevExpress-Examples/asp-net-core-dashboard-custom-item-gallery

const FUNNEL_D3_EXTENSION_NAME = 'FunnelD3';

const svgIcon =
	'<?xml version="1.0" encoding="utf-8"?><!-- Generator: Adobe Illustrator 21.0.2, SVG Export Plug-In . SVG Version: 6.00 Build 0)  --><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg version="1.1" id="' +
	FUNNEL_D3_EXTENSION_NAME +
	'" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"	 viewBox="0 0 24 24" style="enable-background:new 0 0 24 24;" xml:space="preserve"><polygon class="dx_green" points="2,1 22,1 16,8 8,8 "/><polygon class="dx_blue" points="8,9 16,9 14,15 10,15 "/><polygon class="dx_red" points="10,16 14,16 13,23 11,23 "/></svg>';

const funnelMeta: ICustomItemMetaData = {
	bindings: [
		{
			propertyName: 'Values',
			dataItemType: 'Measure',
			array: true,
			enableColoring: false,
			enableInteractivity: false,
			displayName: 'Values',
			emptyPlaceholder: 'Set Value',
			selectedPlaceholder: 'Configure Value',
		},
		{
			propertyName: 'Arguments',
			dataItemType: 'Dimension',
			array: true,
			enableColoring: true,
			enableInteractivity: true,
			displayName: 'Arguments',
			emptyPlaceholder: 'Set Argument',
			selectedPlaceholder: 'Configure Argument',
		},
	],
	customProperties: [
		{
			ownerType: Model.CustomItem,
			propertyName: 'IsCurved',
			valueType: 'boolean',
			defaultValue: true,
		},
		{
			ownerType: Model.CustomItem,
			propertyName: 'LabelPosition',
			valueType: 'string',
			defaultValue: 'outside',
		},
		{
			ownerType: Model.CustomItem,
			propertyName: 'LabelAlignmentPosition',
			valueType: 'string',
			defaultValue: 'left',
		},
		{
			ownerType: Model.CustomItem,
			propertyName: 'LabelOverlapping',
			valueType: 'string',
			defaultValue: 'shift',
		},
		{
			ownerType: Model.CustomItem,
			propertyName: 'Inverted',
			valueType: 'boolean',
			defaultValue: false,
		},

		{
			ownerType: Model.CustomItem,
			propertyName: 'SortData',
			valueType: 'boolean',
			defaultValue: true,
		},
	],
	optionsPanelSections: [
		{
			onFieldDataChanged: (e: any) => {},
			title: 'Settings',
			items: [
				{
					dataField: 'IsCurved',
					label: {
						text: 'Curved',
					},
					template: FormItemTemplates.buttonGroup,
					editorOptions: {
						keyExpr: 'value',
						items: [
							{
								value: true,
								text: 'Yes',
							},
							{
								value: false,
								text: 'No',
							},
						],
					},
				},
				{
					dataField: 'Inverted',
					label: {
						text: 'Inverted',
					},
					template: FormItemTemplates.buttonGroup,
					editorOptions: {
						keyExpr: 'value',
						items: [
							{
								value: true,
								text: 'Yes',
							},
							{
								value: false,
								text: 'No',
							},
						],
					},
				},

				{
					dataField: 'SortData',
					label: {
						text: 'Sort data',
					},
					template: FormItemTemplates.buttonGroup,
					editorOptions: {
						keyExpr: 'value',
						items: [
							{
								value: true,
								text: 'Yes',
							},
							{
								value: false,
								text: 'No',
							},
						],
					},
				},
				{
					dataField: 'LabelPosition',
					label: {
						text: 'Label Position',
					},
					template: FormItemTemplates.buttonGroup,
					editorOptions: {
						keyExpr: 'value',
						items: [
							{
								value: 'outside',
								text: 'outside',
							},
							{
								value: 'inside',
								text: 'inside',
							},
							{
								value: 'columns',
								text: 'columns',
							},
						],
					},
				},
				{
					dataField: 'LabelAlignmentPosition',
					label: {
						text: 'Label horizontal alingment',
					},
					template: FormItemTemplates.buttonGroup,
					editorOptions: {
						keyExpr: 'value',
						items: [
							{
								value: 'left',
								text: 'left',
							},
							{
								value: 'right',
								text: 'right',
							},
						],
					},
				},
				{
					dataField: 'LabelOverlapping',
					label: {
						text: 'Label overlapping',
					},
					template: FormItemTemplates.buttonGroup,
					editorOptions: {
						keyExpr: 'value',
						items: [
							{
								value: 'hide',
								text: 'Hide',
							},
							{
								value: 'shift',
								text: 'Shift',
							},
							{
								value: 'none',
								text: 'None',
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
	icon: FUNNEL_D3_EXTENSION_NAME,
	title: 'Funnel D3',
	index: 3,
};

export class FunnelD3ItemExtension {
	name = FUNNEL_D3_EXTENSION_NAME;
	metaData = funnelMeta;
	dashboardControl: dxDashboardControl;

	constructor(dashboardControl: DashboardControl) {
		this.dashboardControl = dashboardControl;
		this.dashboardControl.registerIcon(svgIcon);
		this.name = FUNNEL_D3_EXTENSION_NAME;
		this.metaData = funnelMeta;
	}

	public createViewerItem = (model: any, element: DxFunnel, content: any) => {
		return new FunnelViewer(model, element, content, this.dashboardControl);
	};
}

class FunnelViewer extends CustomItemViewer {
	private dxFunnelWidget?: dxFunnel;
	private dashboardControl: dxDashboardControl;
	private data: any;
	private funnelContainer: any;
	private exportingImage: string | any;

	constructor(model: any, container: any, options: any, dashboardControl: dxDashboardControl) {
		super(model, container, options);
		this.dashboardControl = dashboardControl;
		this.exportingImage = new Image();
		this.dashboardControl.registerIcon(svgIcon);
		this.data = new DataSource({
			store: new CustomStore({
				load: async (loadOptions: any) => {
					let data = Array.from(this.getDataSource());
					return data;
				},
				update: async (key, values) => {
					return Array.from(this.getDataSource());
				},
				byKey: async (key, extraOptions) => {},
			}),
		});
		this.subscribeProperties();
		this.funnelContainer = this.dashboardControl.dashboardContainer();
	}

	destroy(){
		this.dxFunnelWidget?.dispose();
	
	}

	allowExportSingleItem() {
		return true;
	}

	hasArguments() {
		return this.getBindingValue('Arguments').length > 0;
	}

	getExportInfo() {
		return { image: this.exportingImage };
	}

	getFunnelSizeOptions() {
		if (!this.funnelContainer) return {};

		return { width: this.funnelContainer.clientWidth, height: this.funnelContainer.clientHeight };
	}

	subscribeProperties() {
		this.subscribe('IsCurved', (isCurved) => {
			this.dxFunnelWidget?.option('algorithm', isCurved);
		});
		this.subscribe('LabelPosition', (labelPosition) => {
			this.dxFunnelWidget?.option('label.position', labelPosition);
		});
		this.subscribe('LabelAlignmentPosition', (labelAlignmentPosition) => {
			this.dxFunnelWidget?.option('label.horizontalAlignment', labelAlignmentPosition);
		});
		this.subscribe('Inverted', (inverted) => {
			this.dxFunnelWidget?.option('inverted', inverted);
		});
		this.subscribe('SortData', (sortData) => {
			this.dxFunnelWidget?.option('sortData', sortData);
		});
		this.subscribe('LabelOverlapping', (labelOverlapping) => {
			this.dxFunnelWidget?.option('resolveLabelOverlapping', labelOverlapping);
		});
	}

	getDataSource() {
		var bindingValues = this.getBindingValue('Values');
		if (bindingValues.length == 0) return undefined;
		var data = [] as any;
		this.iterateData((dataRow) => {
			var values = dataRow.getValue('Values');
			var valueStr = dataRow.getDisplayText('Values');
			var color = dataRow.getColor('Values');
			var argument = dataRow.getDisplayText('Arguments');
			var bindings = this.getBindingValue('Values');
			for (let i = 0; i < values.length; i++) {
				var labelText = dataRow.getDisplayText('Arguments').join(' - ') + ' - ' + bindings[i].displayName() + ':' + '<br />' + valueStr[i];
				data.push({ data: values[i], text: labelText, color: color[i], valueStr: valueStr[i], argument: argument[i] });
			}
		});
		return data.length > 0 ? data : undefined;
	}

	async _getImageData(e: any): Promise<void> {
		try {
			const container = e.element as HTMLElement;
			let imageFromDom = await domtoimage
				.toPng(container, { bgcolor: '#FFFFFf' })
				.then((dataUrl: any) => {
					return dataUrl;
				})
				.catch((e: any) => console.log(e));

			this.exportingImage = imageFromDom.replace('data:image/png;base64,', '');
		} catch (error) {
			throw new Error('Error generating image data URL');
		}
	}

	override async renderContent(element: any, changeExisting: boolean) {
		let htmlElement = element instanceof HTMLElement ? element : element[0];
		const isDesignerMode = this.dashboardControl.isDesignMode();
		const typePanel = document.querySelectorAll('.dx-field-chooser-toolbar') as any;
		const hiddenMeasure = document.querySelectorAll('.dx-dashboard-section')[5] as HTMLElement;
		const hiddenDimension = document.querySelectorAll('.dx-dashboard-section')[4] as HTMLElement;
		this.canDrillDown = () => true;
		this.canMasterFilter = () => true;
		this.drillDown = (row: any) => {
			return true;
		};
		this.funnelContainer = document.createElement('div');
		this.funnelContainer.style.margin = '20px';
		this.funnelContainer.style.height = 'calc(100% - 40px)';
		htmlElement.appendChild(this.funnelContainer);
		if (isDesignerMode) {
			hiddenMeasure != null ? (hiddenMeasure.style.display = 'none') : '';
			hiddenDimension != null ? (hiddenDimension.style.display = 'none') : '';
		}
		let funnelOptions: Properties = {
			dataSource: this.data,
			valueField: 'data',
			argumentField: 'text',
			colorField: 'color',
			algorithm: this.getPropertyValue('IsCurved') ? 'dynamicSlope' : 'dynamicHeight',
			export: { enabled: false },
			inverted: this.getPropertyValue('Inverted') as boolean,
			sortData: this.getPropertyValue('SortData') as boolean,
			label: {
				visible: true,
				position: this.getPropertyValue('LabelPosition') as LabelPosition,
				horizontalAlignment: this.getPropertyValue('LabelAlignmentPosition') as 'left' | 'right',
				backgroundColor: 'none',
				customizeText: (e: any) => {
					return e.item.data.text;
				},
			},
			hoverEnabled: true,
			redrawOnResize: true,
			item: {
				hoverStyle: {
					hatching: {
						direction: 'right',
						opacity: 0.75,
						step: 6,
						width: 2,
					},
				},
			},
			onInitialized: (e: any) => {},
			onDrawn: async (e: any) => {
				await this._getImageData(e);
			},
			onExporting: (e: any) => {},
			onDisposing: (e: any) => {},
			width: this.getFunnelSizeOptions().width,
			height: this.getFunnelSizeOptions().height,
		};

		if (!changeExisting) {
			while (element.firstChild) element.removeChild(element.firstChild);
			let div = document.createElement('funnel');
			element.appendChild(div);
			this.dxFunnelWidget = new dxFunnel(div, funnelOptions);
		} else {
			this.dxFunnelWidget?.option(funnelOptions);
			this.dxFunnelWidget?._refresh();
		}
	}

	setMasterFilterRecursive(node: any) {
		if (!node) return;
		this.setMasterFilter(node.itemData._customData);
		node.children.forEach((x: any) => this.setMasterFilterRecursive(x));
	}
}
