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

export interface Achievement {
    id?: string;
    title: string;
    issuer: string;
    achievedAt: string;
    description: string;
    proofUrl: string;
    proofPublicId: string;
    status: string;
    order: string;
    createdAt: string;
    updatedAt: string;
}

export interface Certification {
    id?: string;
    title: string;
    issuer: string;
    issueDate: string;
    expiryDate: string;
    credentialId: string;
    credentialUrl: string;
    status: string;
    order: string;
    createdAt: string;
    updatedAt: string;
}

export interface ContactUsRequest {
    name: string;
    email: string;
    message: string;
    phone: string;
    profileId: string | null;
}

export interface Education {
    id?: string;
    institution: string;
    degree: string;
    fieldOfStudy: string;
    startYear: string;
    endYear: string;
    description: string;
    location: string;
    grade: string;
}

export interface SkillDropdown {
    id: string;
    logoName: string;
    logoUrl: string;
}

export interface ExperienceResponse {
  id?: string;
  companyName: string;
  jobTitle: string;
  location: string;
  startDate: string;
  endDate?: string | null;
  employmentStatus: string;
  description: string;
  skills: SkillDropdown[];
}

export interface SkillResponse {
    id: string;
    logoId: string;
    logoName: string;
    logoUrl: string;
    category: string;
    level: string;
}

export interface SocialLinkResponse {
    id: string;
    platform: string;
    url: string;
    order: string;
    status: string;
    createdAt: string;
    updatedAt: string;
}

export interface Testimonial {
    id?: string;
    name: string;
    message: string;
    role: string;
    company: string;
    imageId: string;
    imageUrl: string;
    linkedInUrl: string;
    status: string;
    order: string;
    createdAt: string;
    updatedAt: string;
}