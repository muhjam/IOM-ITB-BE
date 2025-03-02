import api from "@/lib/api-client";
import { RegisterInput } from "@/models/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const registerAPI = async (payload: RegisterInput) => {
  const url = `/employee`;
  const response = await api.post(url, payload);
  return response;
};

export const useRegister = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: RegisterInput) => registerAPI(payload),
  });
};
