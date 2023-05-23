import { unitInPx } from "../constants/game";
import { ISpriteMapDimensions } from "../contracts/spriteMapLookup";

export const setCssVarOnBody = (varName: string, varValue: string) => {
    const root: any = document.querySelector(':root');
    if (root == null) return;
    root.style.setProperty(varName, varValue);
}

export const updateCustomStyleTag = (tagName: string, cssContent: string) => {
    const head = document.head || document.getElementsByTagName('head')[0];

    if (head == null) return;

    const exitingScriptTag = [...head.childNodes].find((cn: any) => cn.id === tagName);
    if (exitingScriptTag != null) {
        exitingScriptTag.remove();
    }

    const styleElem: any = document.createElement('style');

    styleElem.type = 'text/css';
    styleElem.id = tagName;
    if (styleElem.styleSheet) {
        // This is required for IE8 and below.
        styleElem.styleSheet.cssText = cssContent;
    } else {
        styleElem.appendChild(document.createTextNode(cssContent));
    }

    head.appendChild(styleElem);
}

export const cutImageFromOtherImage = (
    imgSrc: string,
    onImageLoad: (image: HTMLImageElement) => void,
) => {
    var image = new Image();
    image.onload = () => {
        onImageLoad(image);
    };
    image.src = imgSrc;
}

export const createCanvasToCutImage = (
    image: HTMLImageElement,
    spriteDimensions: ISpriteMapDimensions,
): string | undefined => {
    const canvas = document.createElement('canvas');
    canvas.width = spriteDimensions.width * unitInPx;
    canvas.height = spriteDimensions.height * unitInPx;
    const context = canvas.getContext('2d');

    if (context == null) return;
    context.drawImage(image,
        spriteDimensions.x,
        spriteDimensions.y,
        spriteDimensions.width * unitInPx,
        spriteDimensions.height * unitInPx,
        0, 0,
        canvas.width,
        canvas.height,
    );
    return canvas.toDataURL();
}

export const preventDefault = (e: any) => e?.preventDefault?.();
export const noContextMenu = (e: any) => e?.preventDefault?.();