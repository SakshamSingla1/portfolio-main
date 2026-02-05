import type { ColorTheme } from "./types";

export const replaceUrlParams = (url: string, params: Record<string, any>) => {
  let result = url;
  for (const [key, value] of Object.entries(params)) {
    result = result.replace(`:${key}`, value);
  }
  return result;
};

export const getColor = (theme: ColorTheme | null,colorName: string) => {
    if(!theme?.palette?.colorGroups) return "";
    for( const group of theme.palette.colorGroups){
        for(const shade of group.colorShades){
            if(shade.colorName === colorName) return shade.colorCode;
        }
    }
    return "";
}

export const sanitizeHtml = (html: string) => {
    return html.replace(/<[^>]*>/g, "");
}

export const toTitleCase = (value?: string | null) => {
  if (!value) return "—";

  return value
    .toLowerCase()
    .split("_")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};
