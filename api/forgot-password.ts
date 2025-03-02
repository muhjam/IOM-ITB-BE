import api from "@/lib/api-client";
import { ForgotPasswordInput } from "@/models/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const forgotPasswordAPI = async (payload: ForgotPasswordInput) => {
  const url = `/employee/request-reset`;
  const response = await api.post(url, payload);
  return response;
};

export const useForgotPassword = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: ForgotPasswordInput) => forgotPasswordAPI(payload),
  });
};
