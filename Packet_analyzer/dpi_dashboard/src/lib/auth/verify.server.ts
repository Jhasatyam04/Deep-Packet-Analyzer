import { getRequest } from "@tanstack/react-start/server";
import { gateIdentityEnabled } from "./gate-identity.server";
import { auth, authConfigured } from "./server";

export const requireUserId = async (req?: any) => "fake";
export const getVerifiedSession = async () => null;
