import {refreshTheme} from 'devextreme/viz/themes';
import themes from "devextreme/ui/themes";

export default {
    applyTheme(theme: any | undefined) {
        themes.current(theme);
        refreshTheme();
    }
}