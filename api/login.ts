import api from "@/lib/api-client";
import { LoginInput } from "@/models/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const loginAPI = async (payload: LoginInput) => {
  const url = `/employee/login`;
  const response = await api.post(url, payload);
  return response;
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: LoginInput) => loginAPI(payload),
  });
};
