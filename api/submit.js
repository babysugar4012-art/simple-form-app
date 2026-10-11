import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {
    const { email, answer, consent } = req.body || {};

    if (
      typeof email !== "string" ||
      typeof answer !== "string" ||
      consent !== true
    ) {
      return res.status(400).json({
        error: "Please provide your contact information, answer, and consent."
      });
    }

    const cleanEmail = email.trim();
    const cleanAnswer = answer.trim();

    if (
      !cleanEmail ||
      !cleanAnswer ||
      cleanEmail.length > 254 ||
      cleanAnswer.length > 2000
    ) {
      return res.status(400).json({
        error: "Please check your submitted information."
      });
    }

    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false
        }
      }
    );

    const { error } = await supabase
      .from("form_submissions")
      .insert({
        email: cleanEmail,
        answer: cleanAnswer
      });

    if (error) {
      console.error("Submission insert failed:", error.message);

      return res.status(500).json({
        error: "Unable to save your response. Please try again."
      });
    }

    return res.status(201).json({
      success: true,
      message: "Your response was submitted successfully."
    });
  } catch (error) {
    console.error("Submission error:", error.message);

    return res.status(500).json({
      error: "An unexpected error occurred."
    });
  }
}
