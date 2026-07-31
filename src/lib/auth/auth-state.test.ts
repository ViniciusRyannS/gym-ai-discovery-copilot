import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { getAuthErrorMessage, getSignUpResultState } from "./auth-state.ts";

describe("getSignUpResultState", () => {
  it("returns authenticated when signup creates a session", () => {
    assert.equal(getSignUpResultState({ access_token: "token" }), "authenticated");
  });

  it("requires confirmation when signup does not create a session", () => {
    assert.equal(getSignUpResultState(null), "confirmation_required");
  });
});

describe("getAuthErrorMessage", () => {
  it("explains invalid credentials without exposing backend details", () => {
    assert.equal(
      getAuthErrorMessage({ message: "Invalid login credentials" }),
      "E-mail ou senha inválidos. Se sua conta é nova, confirme o e-mail antes de entrar.",
    );
  });

  it("explains an unconfirmed email", () => {
    assert.equal(
      getAuthErrorMessage({ code: "email_not_confirmed" }),
      "Esta conta ainda não está ativa. Para a demonstração, recrie o usuário após desabilitar a confirmação de e-mail no Supabase.",
    );
  });

  it("explains when the remote signup policy is still incorrect", () => {
    assert.equal(
      getAuthErrorMessage({ code: "signup_confirmation_enabled" }),
      "O Supabase ainda exige confirmação de e-mail. Desabilite “Confirm email” no painel e crie a conta novamente.",
    );
  });

  it("explains email rate limiting", () => {
    assert.equal(
      getAuthErrorMessage({ code: "over_email_send_rate_limit" }),
      "Muitas tentativas em pouco tempo. Aguarde alguns minutos e tente novamente.",
    );
  });

  it("explains network failures", () => {
    assert.equal(
      getAuthErrorMessage(new Error("Failed to fetch")),
      "Não foi possível conectar ao serviço de autenticação. Verifique sua conexão.",
    );
  });

  it("uses a safe fallback for unknown errors", () => {
    assert.equal(
      getAuthErrorMessage({ message: "Unexpected provider response" }),
      "Não foi possível concluir a autenticação. Tente novamente.",
    );
  });
});
