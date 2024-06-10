export function ConvertKeysToLowerFirstLetter(obj: any): any {
    if (typeof obj === 'object' && obj !== null) {
        if (Array.isArray(obj)) {
            return obj.map(item => ConvertKeysToLowerFirstLetter(item));
        } else {
            const newObj = {} as any;
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    const newKey = key[0].toLowerCase() + key.slice(1);
                    newObj[newKey] = ConvertKeysToLowerFirstLetter(obj[key]);
                }
            }
            return newObj;
        }
    } else {
        return obj;
    }
}