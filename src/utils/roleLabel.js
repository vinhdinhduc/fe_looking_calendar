export const getRoleLabel = (role) => {
  if (role === "admin") return "Quản trị viên";
  if (role === "staff") return "Nhân viên";
  return role || "—";
};
