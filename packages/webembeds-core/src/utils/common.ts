type APIResponse = {
  error?: boolean | true,
  data?: {} | null,
  message?: null
};

exports.apiResponse = ({ data, message, error }: { data: {}, message: "", error: true }): APIResponse => ({
  data: data || null,
  message: message || null,
  error: error || true,
});
