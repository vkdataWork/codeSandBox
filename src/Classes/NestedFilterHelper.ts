import _ from 'lodash';
import moment from "moment";

export default class NestedFilterFactory {
    static searchInNestedColumn(value: any, selectedFilterOperation: string, column: string, columnType: string, dataArrayField: string, lookupDataSource?: { value: string, display: string }[], nestedDataField?: string): any {
        if (selectedFilterOperation === null) {
            selectedFilterOperation = 'contains';
            
            if (lookupDataSource !== undefined) {
                value = value.toLowerCase();
                return [function(data:any) {
                    for (const item of data[dataArrayField]) {
                        let i = item;

                        if (nestedDataField !== undefined) {
                            i = i[nestedDataField];
                        }

                        i = i[column];
                        
                        const v = lookupDataSource.find(x => x.value === i);
                        if (v && v.display.toString()?.toLowerCase()?.indexOf(value) >= 0) {
                            return true;
                        }   
                    }      
        
                    return false;
                }, "=", true];
            }
        }
    
        switch (columnType)
        { 
            case 'string': 
            {                
                value = value?.toString().toLowerCase();                  
                switch (selectedFilterOperation) {
                    case 'contains':
                    case 'notcontains':
                        return [(data:any) => data[dataArrayField].map((x:any) => x[column]) , selectedFilterOperation, value];
                    case '=':      
                    case '<>': 
                    case 'anyof': 
                    case 'noneof': 
                        return [(data:any) => { 
                        return data[dataArrayField].some((x:any) => x[column]?.toString().toLowerCase() == value)
                        }, selectedFilterOperation, true];
                    case 'isblank': 
                    case 'isnotblank': 
                        return [(data:any) => data[dataArrayField].some((x:any) => _.isEmpty(x[column])) ? undefined : 'value', selectedFilterOperation];
                    // Fce startsWith není podporovaná v IE11
                    case 'startswith': 
                        return [(data:any) => {
                            const v = data[dataArrayField].find((x:any) => x[column]?.toString().toLowerCase().startsWith(value));
                            return v === undefined ? undefined : v[column];
                        },  selectedFilterOperation, value];
                    // Fce endsWith není podporovaná v IE11
                    case 'endswith': 
                        return [(data:any) => {
                            const v = data[dataArrayField].find((x:any) => x[column]?.toString().toLowerCase().endsWith(value));
                            return v === undefined ? undefined : v[column];
                        },  selectedFilterOperation, value]; 
                }
            }

            // Todo between  
            case 'number':
            {
                  switch (selectedFilterOperation) {
                    case '=':      
                    case '<>': 
                    case 'anyof': 
                    case 'noneof':
                        return [(data:any) => { return data[dataArrayField].some((x:any) => x[column] == value) }, selectedFilterOperation, true];
                    case '<': 
                        return [(data:any) => data[dataArrayField].some((x:any) => x[column] < value) ? -1 : 1, selectedFilterOperation, 0];
                    case '>': 
                        return [(data:any) => data[dataArrayField].some((x:any) => x[column] > value) ? 1 : -1, selectedFilterOperation, 0];
                    case '<=': 
                        return [(data:any) => data[dataArrayField].some((x:any) => x[column] <= value) ? -1 : 1, selectedFilterOperation, 0];
                    case '>=': 
                        return [(data:any) => data[dataArrayField].some((x:any) => x[column] >= value) ? 1 : -1, selectedFilterOperation, 0];
                    case 'isblank': 
                    case 'isnotblank': 
                        return [(data:any) => data[dataArrayField].some((x:any) => _.isEmpty(x[column])) ? undefined : 'value', selectedFilterOperation];

                }
            }

            // Todo between - moment má between, jen je potřeba zjistit jak funguje to rozmezí datumů
            case 'date':
            {
                switch (selectedFilterOperation) {
                    case '=':
                        return [(data:any) => {
                            try {
                                return data[dataArrayField].some((x:any) => moment(x[column]).isSame(moment(value), 'date'));
                            } catch {
                                return false;
                            }
                        }, selectedFilterOperation, true];
                    case '<>':
                        return [(data:any) => {
                            try {
                                return data[dataArrayField].some((x:any) => moment(x[column]).isSame(moment(value),'date'));
                            } catch {
                                return true;
                            }
                        }, selectedFilterOperation, true];
                    case '<':
                        return [(data:any) => {
                            try {
                                return data[dataArrayField].some((x:any) => moment(x[column]).isBefore(moment(value),'date')) ? -1 : 1;
                            } catch {
                                return 1;
                            }
                        }, selectedFilterOperation, 0];
                    case '>':
                        return [(data:any) => {
                            try {
                                return data[dataArrayField].some((x:any) => moment(x[column]).isAfter(moment(value),'date')) ? 1 : -1;
                            } catch {
                                return -1;
                            }
                        }, selectedFilterOperation, 0];
                    case '<=':
                        return [(data:any) => {
                            try {
                                return data[dataArrayField].some((x:any) => moment(x[column]).isSameOrBefore(moment(value),'date')) ? -1 : 1;
                            } catch {
                                return 1;
                            }
                        }, selectedFilterOperation, 0];
                    case '>=':
                        return [(data:any) => {
                            try {
                                return data[dataArrayField].some((x:any) => moment(x[column]).isSameOrAfter(moment(value),'date')) ? 1 : -1;
                            } catch {
                                return -1;
                            }
                        }, selectedFilterOperation, 0];
                }
            }


            // Todo DateTime (asi stejný jako date), boolean, object
        }
    }

    static highlightMasterSearchText(value: any, propertyName: any, type: any, filterType: any, ignore: boolean): any {
        if (filterType === 'search' && !ignore) {
            return [function(data:any) { return true; }, '=', true];
        } else {
            if (_.isEmpty(type)) {
                return [function(data:any) { return data[propertyName]; }, 'contains', value]
            } else {
                return [function(data:any) { return data[propertyName]; }, type, value]
            }
        }
    }
}