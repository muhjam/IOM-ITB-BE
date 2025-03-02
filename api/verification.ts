import api from "@/lib/api-client";
import { ResendEmailInput } from "@/models/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { forgotPasswordAPI } from "./forgot-password";

export const resendEmailAPI = async (payload: ResendEmailInput) => {
  const url = `/employee/request-email`;
  const response = await api.post(url, payload);
  return response;
};

export const useResendEmail = () => {
  const pathName = usePathname();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: ResendEmailInput) => '/forget-password/verification' === pathName ? forgotPasswordAPI(payload) : resendEmailAPI(payload),
  });
};
