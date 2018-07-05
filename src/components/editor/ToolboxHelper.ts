import {BlockToolbox} from '@/content/Lesson';

export function makeToolboxXML(toolbox: BlockToolbox, allowVariables: boolean, allowFunctions: boolean) {
    let data = `<xml version="1.0">`;
    for (const key of Object.keys(toolbox)) {
        data += `<category name="${key}">`;
        for (const block of toolbox[key]) {
            data += `<block type="${block}"></block>`;
        }
        data += `</category>`;
    }
    if (allowVariables) {
        data += `<category name="Variables" custom="VARIABLE">`
            + `<button text="New Variable" callbackKey="newVariable"></button>`
            + `</category>`;
    }
    if (allowFunctions) {
        data += `<category name="Functions" custom="PROCEDURE"></category>`;
    }
    return data + "</xml>";
}
