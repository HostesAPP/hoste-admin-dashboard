import { MOCK_ACCESS_SNAPSHOT } from "./data/settings.access.data";
import type { AccessAdapter, AccessSnapshot } from "./settings.access.types";

// Only this mock adapter simulates server-owned transitions. Replace it with
// API calls and map responses to AccessSnapshot when contracts are confirmed.
export function createMockAccessAdapter(
  initialSnapshot: AccessSnapshot = MOCK_ACCESS_SNAPSHOT,
): AccessAdapter {
  let snapshot = structuredClone(initialSnapshot);
  return {
    cacheKey: "mock-preview",
    load: async () => structuredClone(snapshot),
    execute: async (input) => {
      const command = structuredClone(input);
      if (!snapshot.canManage)
        throw new Error("You do not have permission to manage access.");
      const next = structuredClone(snapshot);
      if (command.type === "settings") next.settings = command.values;
      if (command.type === "invite" || command.type === "create") {
        if (
          next.admins.some(
            (admin) =>
              admin.email.toLowerCase() === command.email.toLowerCase(),
          )
        )
          throw new Error("An administrator with this email already exists.");
        const role = next.roles.find((item) => item.id === command.roleId);
        if (!role) throw new Error("Select an available role.");
        next.admins.push({
          id: `preview-${crypto.randomUUID()}`,
          name: command.name,
          email: command.email,
          roleId: role.id,
          status: command.type === "invite" ? "Invited" : "Active",
          permissions:
            command.type === "create" ? command.permissions : role.permissions,
        });
        // The temporary password is intentionally not retained by the mock store.
      }
      if (command.type === "role") {
        const index = next.roles.findIndex(
          (role) => role.id === command.role.id,
        );
        if (index < 0) next.roles.push(command.role);
        else next.roles[index] = command.role;
      }
      if (
        command.type === "admin-role" ||
        command.type === "permissions" ||
        command.type === "remove-admin" ||
        command.type === "resend-invite"
      ) {
        const admin = next.admins.find((item) => item.id === command.id);
        if (!admin)
          throw new Error("Administrator not found. Reload and try again.");
        if (command.type === "resend-invite" && admin.status !== "Invited")
          throw new Error("This invitation is no longer pending.");
        if (command.type === "remove-admin")
          next.admins = next.admins.filter((item) => item.id !== command.id);
        if (command.type === "permissions")
          admin.permissions = command.permissions;
        if (command.type === "admin-role") {
          const role = next.roles.find((item) => item.id === command.roleId);
          if (!role) throw new Error("Role not found.");
          admin.roleId = role.id;
          admin.permissions = role.permissions;
        }
      }
      if (command.type === "account") {
        const account = next.accounts.find((item) => item.id === command.id);
        if (!account) throw new Error("Account not found.");
        if (command.status === "Suspended" && !command.reason?.trim())
          throw new Error("A suspension reason is required.");
        if (account.status !== command.status) {
          const populationId =
            account.classification === "Customer"
              ? "customers"
              : account.classification === "Hosté"
                ? "hosts"
                : null;
          const population = next.populations.find(
            (item) => item.id === populationId,
          );
          if (population) {
            if (account.status === "Active") population.active -= 1;
            if (account.status === "Suspended") population.suspended -= 1;
            if (command.status === "Active") population.active += 1;
            if (command.status === "Suspended") population.suspended += 1;
          }
          next.accountTotals[account.status] -= 1;
          next.accountTotals[command.status] += 1;
          account.status = command.status;
        }
      }
      snapshot = next;
      return structuredClone(snapshot);
    },
  };
}

export const mockAccessAdapter = createMockAccessAdapter();
