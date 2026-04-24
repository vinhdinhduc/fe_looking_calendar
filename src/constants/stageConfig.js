import { FaDroplet, FaWheatAwn } from "react-icons/fa6";
import { GiSpade } from "react-icons/gi";
import { LuLeaf, LuPackage, LuShieldCheck, LuSprout } from "react-icons/lu";

export const STAGE_CONFIG = {
  lam_dat: {
    color: "#7C3AED",
    bg: "#F3E8FF",
    label: "Làm đất",
    icon: GiSpade,
  },
  gieo_trong: {
    color: "#16A34A",
    bg: "#DCFCE7",
    label: "Gieo trồng",
    icon: LuSprout,
  },
  cham_soc: {
    color: "#2563EB",
    bg: "#DBEAFE",
    label: "Chăm sóc",
    icon: FaDroplet,
  },
  phong_tru: {
    color: "#DC2626",
    bg: "#FEE2E2",
    label: "Phòng trừ",
    icon: LuShieldCheck,
  },
  thu_hoach: {
    color: "#EA580C",
    bg: "#FFEDD5",
    label: "Thu hoạch",
    icon: FaWheatAwn,
  },
  bao_quan: {
    color: "#4B5563",
    bg: "#F3F4F6",
    label: "Bảo quản",
    icon: LuPackage,
  },
};

const DEFAULT_STAGE = {
  color: "#6B7280",
  bg: "#F3F4F6",
  label: "Giai đoạn khác",
  icon: LuLeaf,
};

const ALIAS_STAGE_TYPE = {
  planting: "gieo_trong",
  caring: "cham_soc",
  harvesting: "thu_hoach",
  gieo_hat: "gieo_trong",
};

const normalizeText = (value = "") =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

export const normalizeStageType = (stageType) => {
  if (!stageType) return null;
  const normalized = String(stageType).trim().toLowerCase();
  return ALIAS_STAGE_TYPE[normalized] || normalized;
};

export const detectStageTypeFromText = (text = "") => {
  const normalized = normalizeText(text);
  if (!normalized) return null;

  if (
    normalized.includes("lam dat") ||
    normalized.includes("xu ly dat") ||
    normalized.includes("cay dat")
  )
    return "lam_dat";
  if (
    normalized.includes("gieo") ||
    normalized.includes("xuong giong") ||
    normalized.includes("uom")
  )
    return "gieo_trong";
  if (
    normalized.includes("cham soc") ||
    normalized.includes("bon phan") ||
    normalized.includes("tuoi")
  )
    return "cham_soc";
  if (
    normalized.includes("phong tru") ||
    normalized.includes("sau") ||
    normalized.includes("benh")
  )
    return "phong_tru";
  if (normalized.includes("thu hoach") || normalized.includes("thu hai"))
    return "thu_hoach";
  if (normalized.includes("bao quan") || normalized.includes("ton tru"))
    return "bao_quan";

  return null;
};

export const getStageDisplay = ({ stageType, stageName } = {}) => {
  const normalizedType = normalizeStageType(stageType);
  if (normalizedType && STAGE_CONFIG[normalizedType]) {
    return { ...STAGE_CONFIG[normalizedType], stageType: normalizedType };
  }

  const detectedType = detectStageTypeFromText(stageName);
  if (detectedType && STAGE_CONFIG[detectedType]) {
    return { ...STAGE_CONFIG[detectedType], stageType: detectedType };
  }

  return {
    ...DEFAULT_STAGE,
    label: stageName || DEFAULT_STAGE.label,
    stageType: null,
  };
};

export const STAGE_LEGEND_KEYS = [
  "lam_dat",
  "gieo_trong",
  "cham_soc",
  "phong_tru",
  "thu_hoach",
  "bao_quan",
];

export const STAGE_TYPE_OPTIONS = [
  { value: "lam_dat", label: "🟣 Làm đất" },
  { value: "gieo_trong", label: "🟢 Gieo trồng" },
  { value: "cham_soc", label: "🔵 Chăm sóc" },
  { value: "phong_tru", label: "🔴 Phòng trừ sâu bệnh" },
  { value: "thu_hoach", label: "🟠 Thu hoạch" },
  { value: "bao_quan", label: "⚫ Bảo quản" },
];
