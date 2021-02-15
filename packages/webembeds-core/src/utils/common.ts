import type { APIResponse } from "../types";

// eslint-disable-next-line import/prefer-default-export
export const apiResponse = ({ data, message, error }: { data: {}, message: "", error: true }): APIResponse => ({
  data: data || null,
  message: message || null,
  error: error || true,
});
