import axiosInstance from "../utils/axiosInstance";

export const contactService = {
  submit: async (payload) => {
    const res = await axiosInstance.post("/contact", payload);
    return res.data;
  },
};
