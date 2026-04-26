import { useState } from "react";
import { useAuthContext } from "../../../context/AuthContext";
import { useToast } from "../../../context/ToastContext";
import { authService } from "../services/authService";

const useAuth = () => {
  const { login, logout, user, isAuthenticated, isAdmin, loading } =
    useAuthContext();
  const toast = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  const handleLogin = async (username, password, rememberMe = true) => {
    setSubmitting(true);
    setFormError(null);
    try {
      await login(username, password, rememberMe);
      toast.success("Đăng nhập thành công!");
      return true;
    } catch (err) {
      const msg =
        err?.response?.data?.message || err?.message || "Đăng nhập thất bại";
      setFormError(msg);
      toast.error(msg);
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const handleForgotPassword = async (email) => {
    setSubmitting(true);
    setFormError(null);
    try {
      const res = await authService.forgotPassword(email);
      const msg =
        res?.message ||
        "Nếu email tồn tại, liên kết đặt lại mật khẩu đã được gửi.";
      toast.success(msg);
      return { ok: true, message: msg };
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Không thể gửi yêu cầu quên mật khẩu";
      setFormError(msg);
      toast.error(msg);
      return { ok: false, message: msg };
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetPassword = async (token, newPassword, confirmPassword) => {
    setSubmitting(true);
    setFormError(null);
    try {
      const res = await authService.resetPassword(
        token,
        newPassword,
        confirmPassword,
      );
      const msg = res?.message || "Đặt lại mật khẩu thành công";
      toast.success(msg);
      return { ok: true, message: msg };
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Không thể đặt lại mật khẩu";
      setFormError(msg);
      toast.error(msg);
      return { ok: false, message: msg };
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    toast.info("Đã đăng xuất");
  };

  return {
    user,
    isAuthenticated,
    isAdmin,
    loading,
    submitting,
    formError,
    handleLogin,
    handleLogout,
    handleForgotPassword,
    handleResetPassword,
  };
};

export default useAuth;
