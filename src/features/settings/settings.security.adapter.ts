import { MOCK_SECURITY_SETTINGS } from "./data/settings.security.data";
import { securitySettingsSchema } from "./schemas/settings.security.schema";
import type {
  SecuritySettingsAdapter,
  SecuritySettingsSnapshot,
} from "./settings.security.types";

export function createMockSecuritySettingsAdapter(
  initial: SecuritySettingsSnapshot = MOCK_SECURITY_SETTINGS,
): SecuritySettingsAdapter {
  let snapshot = structuredClone(initial);
  const authorize = () => {
    if (!snapshot.canManage)
      throw new Error(
        "You do not have permission to change security settings.",
      );
  };
  return {
    cacheKey: "security-settings-preview",
    async load() {
      return structuredClone(snapshot);
    },
    async save(settings) {
      authorize();
      snapshot = {
        ...snapshot,
        settings: structuredClone(securitySettingsSchema.parse(settings)),
      };
      return structuredClone(snapshot);
    },
    async revokeSession(id) {
      authorize();
      const session = snapshot.sessions.find((item) => item.id === id);
      if (!session) throw new Error("Session is no longer available.");
      if (session.status === "Current")
        throw new Error(
          "The current session cannot be revoked from this action.",
        );
      snapshot = {
        ...snapshot,
        sessions: snapshot.sessions.filter((item) => item.id !== id),
      };
      return structuredClone(snapshot);
    },
    async signOutOthers() {
      authorize();
      snapshot = {
        ...snapshot,
        sessions: snapshot.sessions.filter((item) => item.status === "Current"),
      };
      return structuredClone(snapshot);
    },
  };
}
export const mockSecuritySettingsAdapter = createMockSecuritySettingsAdapter();
