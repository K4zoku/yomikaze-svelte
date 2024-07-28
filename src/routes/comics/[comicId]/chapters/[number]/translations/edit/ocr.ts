export interface TranslatedText {
    originalText: string;
    [key: string]: string;
}

export interface TextColor {
    fg: number[];
    bg: number[];
}

export interface OCRBox {
    text: TranslatedText;
    minX: number,
    minY: number,
    maxX: number,
    maxY: number,
    textColor: TextColor,
    language: string,
    background: number[] | null,
}

export interface OCRPage {
    details: OCRBox[];
    img: string | null;
}