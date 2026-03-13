export type SectionId =
  | "intro"
  | "life"
  | "journey"
  | "craft"
  | "gallery"
  | "legacy";

export interface NavItem {
  id: SectionId;
  label: string;
}

// Timeline milestones (Journey section)
export interface Milestone {
  year: number;
  title: string;
  description: string;
  location?: string;
  type: "birth" | "career" | "award" | "exhibition" | "death";
}

// Gallery pot metadata
export interface GalleryPot {
  id: string;
  title: string;
  year: string;
  technique: string;
  collection: string; // e.g. "Smithsonian Institution"
  dimensions?: string;
  image: string; // path in /public/images/gallery/
}

// Mouse position (0–1 normalized)
export interface MousePosition {
  x: number;
  y: number;
}

// Scroll progress per section (0–1)
export interface ScrollProgress {
  sectionId: SectionId;
  progress: number;
}

// Audio state (Zustand store shape)
export interface AudioState {
  enabled: boolean;
  toggle: () => void;
}

// Loader props
export interface LoaderProps {
  onComplete: () => void;
}

// Section component base props
export interface SectionProps {
  className?: string;
}
