import { auto } from './auto.schema';
import { home } from './home.schema';
import { commercial } from './commercial.schema';

export const HawksoftSchema = {
    auto: auto,
    home: home,
    commercial: commercial
}

export const group = async(lob: string) => {
    if (lob === 'auto') {
        const keyGroups = [];
        for (const item of auto) {
            if (!keyGroups.some(kg => kg.type === item.parentGroup)) {
                keyGroups.push({
                    type: item.parentGroup,
                    keys: [
                        { 
                            key: item.referenceId,
                            label: item.element
                        }
                    ]
                })
            } else {
                const index = keyGroups.findIndex(kg => kg.type === item.parentGroup);
                if (index > -1) {
                    keyGroups[index].keys.push({
                        key: item.referenceId,
                        label: item.element
                    });
                }
            }
        }
        return keyGroups;
    } else if (lob === 'home') {
        const keyGroups = [];
        for (const item of home) {
            if (!keyGroups.some(kg => kg.type === item.parentGroup)) {
                keyGroups.push({
                    type: item.parentGroup,
                    keys: [
                        { 
                            key: item.referenceId,
                            label: item.element
                        }
                    ]
                })
            } else {
                const index = keyGroups.findIndex(kg => kg.type === item.parentGroup);
                if (index > -1) {
                    keyGroups[index].keys.push({
                        key: item.referenceId,
                        label: item.element
                    });
                }
            }
        }
        return keyGroups;
    } else if (lob === 'commercial') {
        const keyGroups = [];
        for (const item of commercial) {
            if (!keyGroups.some(kg => kg.type === item.parentGroup)) {
                keyGroups.push({
                    type: item.parentGroup,
                    keys: [
                        { 
                            key: item.referenceId,
                            label: item.element
                        }
                    ]
                })
            } else {
                const index = keyGroups.findIndex(kg => kg.type === item.parentGroup);
                if (index > -1) {
                    keyGroups[index].keys.push({
                        key: item.referenceId,
                        label: item.element
                    });
                }
            }
        }
        return keyGroups;
    } else {
        return [];
    }
}