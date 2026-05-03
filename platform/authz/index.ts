// Central authorization primitive
// Every gated read/write in the app goes through policy.can()

export type Action =
  | "read"
  | "create"
  | "update"
  | "delete"
  | "approve"
  | "reject"
  | "grant_access"
  | "revoke_access";

export type ResourceType =
  | "listing"
  | "financial_submission"
  | "document"
  | "inquiry"
  | "access_grant"
  | "message"
  | "valuation_run"
  | "user";

export interface AuthUser {
  id: string;
  role: "owner" | "investor" | "advisor" | "admin";
}

export interface Resource {
  type: ResourceType;
  id: string;
  ownerId?: string;
}

type PolicyFn = (user: AuthUser, resource: Resource) => boolean | Promise<boolean>;

const policies = new Map<string, PolicyFn>();

export function registerPolicy(
  resourceType: ResourceType,
  action: Action,
  fn: PolicyFn
) {
  policies.set(`${resourceType}:${action}`, fn);
}

export async function can(
  user: AuthUser,
  action: Action,
  resource: Resource
): Promise<boolean> {
  // Admins can do everything
  if (user.role === "admin") return true;

  const policy = policies.get(`${resource.type}:${action}`);
  if (!policy) return false; // default deny

  return policy(user, resource);
}
