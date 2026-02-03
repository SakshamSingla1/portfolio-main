export interface ColorShade {
    colorName: string;
    colorCode: string;
}

export interface ColorGroup {
    groupName: string;
    colorShades: ColorShade[];
}

export interface ColorPalette {
    colorGroups: ColorGroup[];
}

export interface ColorTheme {
    id?: string;
    themeName: string;
    palette: ColorPalette;
    createdAt?: string | null;
    updatedAt?: string | null;
    updatedBy?: string | null;
}

export interface AuthenticatedUserType {
    id: string;
    email: string;
    token: string;
    createdAt: string;
    updatedAt: string;
    updatedBy: string;
}