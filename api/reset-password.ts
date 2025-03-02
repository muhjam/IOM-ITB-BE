import api from "@/lib/api-client";
import { useMutation } from "@tanstack/react-query";

interface ResetPasswordProps {
  password: string;
  token: string;
}

export const resetPasswordAPI = async (payload: ResetPasswordProps) => {
  const url = `/employee/reset`;
  const response = await api.post(url, payload);
  return response;
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: async (payload: ResetPasswordProps) => resetPasswordAPI(payload),
  });
};
