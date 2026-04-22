/**
 * Permission resolution — the server-side half of the matrix in @hha/shared.
 *
 * This is the one place route handlers & services call to ask
 * "can this actor do X in this context?". We keep it pure (no DB, no I/O)
 * so it can be unit-tested exhaustively.
 */
import { ForbiddenError } from '@hha/shared/errors';
import { permissionsForRoles, type Permission, type RoleKey } from '@hha/shared/permissions';

export interface AuthContext {
  readonly userId: string;
  readonly schoolId: string;
  readonly roles: readonly RoleKey[];
}

export interface AuthorisationScope {
  readonly schoolId?: string;
  readonly studentId?: string;
  readonly ownerUserId?: string;
  readonly streamId?: string;
  readonly courseOfferingId?: string;
  readonly guardianOfStudentIds?: readonly string[];
  readonly teachesStudentIds?: readonly string[];
  readonly teachesCourseOfferingIds?: readonly string[];
}

/**
 * Returns true iff the actor holds the requested permission and the scoped
 * ownership checks pass. Ownership rules live here in code, not in the DB,
 * so they stay diffable.
 */
export function can(
  actor: AuthContext,
  permission: Permission,
  scope: AuthorisationScope = {},
): boolean {
  if (scope.schoolId && scope.schoolId !== actor.schoolId) return false;

  const granted = permissionsForRoles(actor.roles);
  if (!granted.has(permission)) return false;

  // Apply ownership/scoping rules for the `:owned`, `:taught`, `:guardian`
  // qualifiers. Permissions without those qualifiers are unconditionally
  // granted once the role check passes.
  if (permission.endsWith(':owned')) {
    return (
      scope.ownerUserId === actor.userId ||
      (scope.studentId !== undefined && scope.studentId === actor.userId)
    );
  }

  if (permission.endsWith(':self')) {
    return scope.ownerUserId === actor.userId;
  }

  if (permission.endsWith(':taught')) {
    if (scope.studentId && scope.teachesStudentIds?.includes(scope.studentId)) return true;
    if (
      scope.courseOfferingId &&
      scope.teachesCourseOfferingIds?.includes(scope.courseOfferingId)
    ) {
      return true;
    }
    return false;
  }

  if (permission.endsWith(':guardian')) {
    return (
      scope.studentId !== undefined &&
      scope.guardianOfStudentIds !== undefined &&
      scope.guardianOfStudentIds.includes(scope.studentId)
    );
  }

  if (permission.endsWith(':class')) {
    return scope.streamId !== undefined;
  }

  return true;
}

export function assertCan(
  actor: AuthContext,
  permission: Permission,
  scope: AuthorisationScope = {},
): void {
  if (!can(actor, permission, scope)) {
    throw new ForbiddenError(`Not permitted: ${permission}`, {
      actorRoles: actor.roles,
      permission,
    });
  }
}
