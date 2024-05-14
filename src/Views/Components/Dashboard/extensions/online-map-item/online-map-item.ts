import * as Model from 'devexpress-dashboard/model';
import { FormItemTemplates } from 'devexpress-dashboard/designer';
import { ICustomItemExtension, CustomItemViewer } from 'devexpress-dashboard/common';
import { ICustomItemMetaData } from 'devexpress-dashboard/model/items/custom-item/meta';
import dxMap from 'devextreme/ui/map';
import store from '@/Plugins/Store';
import dxDashboardControl from 'devexpress-dashboard/integration';
import domtoimage from 'dom-to-image-more';
import { env } from '@/envProvider';

const ONLINE_MAP_EXTENSION_NAME = 'OnlineMap';
let PROVIDER = 'bing';

const svgIcon =
	`<svg version="1.1" id="` +
	ONLINE_MAP_EXTENSION_NAME +
	`" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
        viewBox="0 0 24 24" style="enable-background:new 0 0 24 24;" xml:space="preserve">
    <path class="dx_darkgray" d="M12,1C8.1,1,5,4.1,5,8c0,3.9,3,10,7,15c4-5,7-11.1,7-15C19,4.1,15.9,1,12,1z M12,12c-2.2,0-4-1.8-4-4
        c0-2.2,1.8-4,4-4s4,1.8,4,4C16,10.2,14.2,12,12,12z"/>
    <circle class="dx_red" cx="12" cy="8" r="2"/>
    </svg>`;

const onlineMapMeta: ICustomItemMetaData = {
	bindings: [
		{
			propertyName: 'Latitude',
			dataItemType: 'Dimension',
			array: false,
			enableInteractivity: true,
			displayName: 'Latitude',
			emptyPlaceholder: 'Set Latitude',
			selectedPlaceholder: 'Configure Latitude',
			constraints: {
				allowedTypes: ['Integer', 'Float', 'Double', 'Decimal'],
			},
		},
		{
			propertyName: 'Longitude',
			dataItemType: 'Dimension',
			array: false,
			enableInteractivity: true,
			displayName: 'Longitude',
			emptyPlaceholder: 'Set Longitude',
			selectedPlaceholder: 'Configure Longitude',
			constraints: {
				allowedTypes: ['Integer', 'Float', 'Double', 'Decimal'],
			},
		},
	],
	customProperties: [
		{
			ownerType: Model.CustomItem,
			propertyName: 'Provider',
			valueType: 'string',
			defaultValue: PROVIDER == 'google' ? 'Google' : 'Bing',
		},
		{
			ownerType: Model.CustomItem,
			propertyName: 'Type',
			valueType: 'string',
			defaultValue: 'RoadMap',
		},
		{
			ownerType: Model.CustomItem,
			propertyName: 'DisplayMode',
			valueType: 'string',
			defaultValue: 'Markers',
		},
	],
	optionsPanelSections: [
		{
			title: 'Custom Options',
			items: [
				{
					dataField: 'Provider',
					template: FormItemTemplates.buttonGroup,
					editorOptions: {
						items: [{ text: 'Google' }, { text: 'Bing' }],
						value: 'google',
					},
				},
				{
					dataField: 'Type',
					template: FormItemTemplates.buttonGroup,
					editorOptions: {
						items: [{ text: 'RoadMap' }, { text: 'Satellite' }, { text: 'Hybrid' }],
					},
				},
				{
					dataField: 'DisplayMode',
					template: FormItemTemplates.buttonGroup,
					editorOptions: {
						keyExpr: 'value',
						items: [
							{
								value: 'Markers',
								text: 'Markers',
							},
							{
								value: 'Routes',
								text: 'Routes',
							},
							{
								value: 'MarkersAndRoutes',
								text: 'All',
							},
						],
					},
				},
			],
		},
	],
	interactivity: {
		filter: true,
		drillDown: false,
	},
	icon: ONLINE_MAP_EXTENSION_NAME,
	title: 'Online Map',
};

export class OnlineMapItemExtension implements ICustomItemExtension {
	name = ONLINE_MAP_EXTENSION_NAME;
	metaData = onlineMapMeta;
	dashboardControl: dxDashboardControl;

	constructor(dashboardControl: any) {
		this.dashboardControl = dashboardControl;
		this.dashboardControl.registerIcon(svgIcon);
	}

	public createViewerItem = (model: any, element: any, content: any) => {
		return new OnlineMapItem(model, element, content, this.dashboardControl);
	};
}

export class OnlineMapItem extends CustomItemViewer {
	private mapViewer?: any;
	private dashboardControl: dxDashboardControl;
	private OnlineMapContainer: any;
	private exportingImage: string | any;

	constructor(model: any, container: any, options: any, dashboardControl: dxDashboardControl) {
		super(model, container, options);
		this.dashboardControl = dashboardControl;
		this.OnlineMapContainer = this.dashboardControl.dashboardContainer();
		this.exportingImage = new Image();
	}

	destroy() {
		if (this.mapViewer) {
			this.mapViewer.dispose();
		}
	}

	/*	allowExportSingleItem() {
		return true;
	}*/

	getExportInfo() {
		return { image: this.exportingImage };
	}

	async _getImageData(): Promise<void> {
		try {
			const container = document.querySelector('.dx-dashboard-item') as HTMLElement;
			let imageFromDom = await domtoimage
				.toPng(container, { bgcolor: '#FFFFFF' })
				.then((dataUrl: any) => {
					return dataUrl;
				})
				.catch((e: any) => console.log(e));

			this.exportingImage = imageFromDom.replace('data:image/png;base64,', '');
		} catch (error) {
			throw new Error('Error generating image data URL');
		}
	}

	override setSize(width: number, height: number): void {
		super.setSize(width, height);
		let contentWidth = this.contentWidth(),
			contentHeight = this.contentHeight();
		this.mapViewer.option('width', contentWidth);
		this.mapViewer.option('height', contentHeight);
	}

	override setSelection(values: Array<Array<any>>): void {
		super.setSelection(values);
		this._updateSelection();
	}

	override clearSelection(): void {
		super.clearSelection();
		this._updateSelection();
	}

	override async renderContent(element: HTMLElement, changeExisting: boolean, afterRenderCallback?: any) {
		let markers: any[] = [],
			routes: any[] = [],
			mode = this.getPropertyValue('DisplayMode'),
			showMarkers = mode === 'Markers' || mode === 'MarkersAndRoutes' || this.canMasterFilter(),
			showRoutes = mode === 'Routes' || mode === 'MarkersAndRoutes';

		if (this.getBindingValue('Latitude').length > 0 && this.getBindingValue('Longitude').length > 0) {
			this.iterateData((row) => {
				let latitude = row.getValue('Latitude')[0];
				let longitude = row.getValue('Longitude')[0];
				if (latitude && longitude) {
					if (showMarkers) {
						markers.push({
							location: { lat: latitude, lng: longitude },
							iconSrc: this.isSelected(row)
								? 'https://js.devexpress.com/Demos/WidgetsGallery/JSDemos/images/maps/map-marker.png'
								: null,
							onClick: (args: any) => {
								this._onClick(row);
							},
							tag: row,
						});
					}
					if (showRoutes) {
						routes.push([latitude, longitude]);
					}
				}
			});
		}

		let autoAdjust = markers.length > 1 || routes.length > 1,
			options = <any>{
				provider: (<string>this.getPropertyValue('Provider')).toLowerCase(),
				type: (<string>this.getPropertyValue('Type')).toLowerCase(),
				controls: true,
				zoom: autoAdjust ? 1000 : 1,
				autoAdjust: autoAdjust,
				width: this.contentWidth(),
				height: this.contentHeight(),
				onDrawn: () => {
					if (this.allowExportSingleItem()) {
						this._getImageData();
					}
				},
				// Use the template below to authenticate the application within the required map provider.
				apiKey: {
					bing: env('API_BING_KEY') || '',
					google: env('API_GOGLE_KEY') || '',
				},

				markers: markers,
				routes:
					routes.length > 0
						? [
								{
									weight: 6,
									color: 'blue',
									opacity: 0.5,
									mode: '',
									locations: routes,
								},
						  ]
						: [],
			};
		if (changeExisting && this.mapViewer) {
			try {
				this.mapViewer.option(options);
			} catch (e) {
				console.log(e);
			}
		} else {
			try {
				this.mapViewer = new dxMap(element, options);
			} catch (e) {
				console.log(e);
			}
		}
	}

	private _onClick(row: any) {
		this.setMasterFilter(row);
		this._updateSelection();
	}

	private _updateSelection() {
		let markers = this.mapViewer.option('markers');
		markers.forEach((marker: any) => {
			marker.iconSrc = this.isSelected(marker.tag) ? 'https://js.devexpress.com/Demos/WidgetsGallery/JSDemos/images/maps/map-marker.png' : null;
		});
		this.mapViewer.option('autoAdjust', false);
		this.mapViewer.option('markers', markers);
	}
}
