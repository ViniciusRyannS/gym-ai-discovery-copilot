type AuthErrorLike = {
  code?: string;
  message?: string;
  status?: number;
};

export type SignUpResultState = "authenticated" | "confirmation_required";

export function getSignUpResultState(session: unknown): SignUpResultState {
  return session ? "authenticated" : "confirmation_required";
}

export function getAuthErrorMessage(error: unknown): string {
  const authError = toAuthError(error);
  const code = authError.code?.toLowerCase();
  const message = authError.message?.toLowerCase() ?? "";

  if (code === "invalid_credentials" || message.includes("invalid login credentials")) {
    return "E-mail ou senha inválidos. Se sua conta é nova, confirme o e-mail antes de entrar.";
  }

  if (code === "email_not_confirmed" || message.includes("email not confirmed")) {
    return "Esta conta ainda não está ativa. Para a demonstração, recrie o usuário após desabilitar a confirmação de e-mail no Supabase.";
  }

  if (code === "signup_confirmation_enabled") {
    return "O Supabase ainda exige confirmação de e-mail. Desabilite “Confirm email” no painel e crie a conta novamente.";
  }

  if (code === "user_already_exists" || message.includes("user already registered")) {
    return "Não foi possível concluir o cadastro. Tente entrar ou reenviar a confirmação.";
  }

  if (code === "over_email_send_rate_limit" || message.includes("rate limit")) {
    return "Muitas tentativas em pouco tempo. Aguarde alguns minutos e tente novamente.";
  }

  if (message.includes("password should be at least")) {
    return "A senha deve ter pelo menos 6 caracteres.";
  }

  if (message.includes("unable to validate email") || message.includes("invalid email")) {
    return "Informe um endereço de e-mail válido.";
  }

  if (message.includes("failed to fetch") || message.includes("network")) {
    return "Não foi possível conectar ao serviço de autenticação. Verifique sua conexão.";
  }

  return "Não foi possível concluir a autenticação. Tente novamente.";
}

function toAuthError(error: unknown): AuthErrorLike {
  if (error && typeof error === "object") {
    return error as AuthErrorLike;
  }

  return { message: typeof error === "string" ? error : undefined };
}
