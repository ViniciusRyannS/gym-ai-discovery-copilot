const ACCOUNTS_KEY = "gymai.demo.accounts.v1";
const SESSION_KEY = "gymai.demo.session.v1";

export const DEMO_EMAIL = "teste@email.com";
export const DEMO_PASSWORD = "teste123456";

export type DemoSession = {
  email: string;
  displayName: string;
  signedInAt: string;
  mode: "demo";
};

type DemoAccount = {
  email: string;
  displayName: string;
  passwordHash: string;
  createdAt: string;
};

function canUseStorage() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

function readAccounts(): DemoAccount[] {
  if (!canUseStorage()) return [];
  try {
    return JSON.parse(localStorage.getItem(ACCOUNTS_KEY) ?? "[]") as DemoAccount[];
  } catch {
    return [];
  }
}

function writeAccounts(accounts: DemoAccount[]) {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

async function hashPassword(password: string) {
  const bytes = new TextEncoder().encode(password);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function ensureDefaultAccount() {
  const accounts = readAccounts();
  if (accounts.some((account) => account.email === DEMO_EMAIL)) return;
  accounts.push({
    email: DEMO_EMAIL,
    displayName: "Visitante Gym.AI",
    passwordHash: await hashPassword(DEMO_PASSWORD),
    createdAt: new Date().toISOString(),
  });
  writeAccounts(accounts);
}

function saveSession(account: DemoAccount): DemoSession {
  const session: DemoSession = {
    email: account.email,
    displayName: account.displayName,
    signedInAt: new Date().toISOString(),
    mode: "demo",
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  window.dispatchEvent(new Event("gymai-demo-session"));
  return session;
}

export function getDemoSession(): DemoSession | null {
  if (!canUseStorage()) return null;
  try {
    const session = JSON.parse(localStorage.getItem(SESSION_KEY) ?? "null") as DemoSession | null;
    return session?.mode === "demo" && session.email ? session : null;
  } catch {
    return null;
  }
}

export async function demoSignIn(email: string, password: string) {
  if (!canUseStorage()) throw new Error("O armazenamento local não está disponível.");
  await ensureDefaultAccount();
  const normalizedEmail = email.trim().toLowerCase();
  const account = readAccounts().find((item) => item.email === normalizedEmail);
  if (!account || account.passwordHash !== (await hashPassword(password))) {
    throw new Error("E-mail ou senha fictícios inválidos.");
  }
  return saveSession(account);
}

export async function demoSignUp(input: { email: string; password: string; displayName: string }) {
  if (!canUseStorage()) throw new Error("O armazenamento local não está disponível.");
  await ensureDefaultAccount();
  const normalizedEmail = input.email.trim().toLowerCase();
  const accounts = readAccounts();
  if (accounts.some((account) => account.email === normalizedEmail)) {
    throw new Error("Esta conta fictícia já existe neste navegador.");
  }
  const account: DemoAccount = {
    email: normalizedEmail,
    displayName: input.displayName.trim() || normalizedEmail.split("@")[0],
    passwordHash: await hashPassword(input.password),
    createdAt: new Date().toISOString(),
  };
  accounts.push(account);
  writeAccounts(accounts);
  return saveSession(account);
}

export function demoSignOut() {
  if (!canUseStorage()) return;
  localStorage.removeItem(SESSION_KEY);
  window.dispatchEvent(new Event("gymai-demo-session"));
}
