export default async function handler(req, res) {
  // Accept POST requests only.
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  // Parse and validate the survey submission.
  const { email, answer, consent } = req.body || {};

  if (
    typeof email !== "string" ||
    typeof answer !== "string" ||
    consent !== true
  ) {
    return res.status(400).json({
      error: "Please provide valid survey details and consent."
    });
  }

  const cleanEmail = email.trim();
  const cleanAnswer = answer.trim();

  if (
    cleanEmail.length < 3 ||
    cleanEmail.length > 254 ||
    cleanAnswer.length < 1 ||
    cleanAnswer.length > 1000
  ) {
    return res.status(400).json({
      error: "The submitted information is invalid."
    });
  }

  // Confirm the backend is configured.
  if (
    !process.env.SUPABASE_URL ||
    !process.env.SUPABASE_SERVICE_ROLE_KEY
  ) {
    console.error("Supabase environment variables are missing.");

    return res.status(500).json({
      error: "The submission service is not configured."
    });
  }

  // Database insertion will be added once the survey's
  // storage and access rules are configured.
  return res.status(501).json({
    error: "Database storage has not been configured yet."
  });
}
