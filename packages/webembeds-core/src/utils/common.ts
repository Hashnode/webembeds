type APIReponse = {
  error?: boolean | true,
  data?: {} | null,
  message?: null
};

exports.apiResponse = ({ data, message, error}): APIReponse => ({
  data: data || null,
  message: message || null,
  error: error || true,
});
