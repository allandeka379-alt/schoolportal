/**
 * Permission matrix.
 *
 * We intentionally do *not* store permissions in the database. Roles are
 * data; the *capabilities* those roles grant are code — reviewed, versioned,
 * diffable. This avoids the common SMS-pattern bug where a "permission" row
 * in the database quietly grants someone something the code never expected.
 *
 * Callers ask `can(user, 'fees:invoice:write', { schoolId, studentId })` and
 * the resolver decides. The resolver itself lives in @hha/auth to keep it
 * out of the client bundle.
 */
export type RoleKey =
  | 'HEAD_TEACHER'
  | 'DEPUTY_HEAD'
  | 'BURSAR'
  | 'SECRETARY'
  | 'TEACHER'
  | 'FORM_TEACHER'
  | 'HEAD_OF_DEPARTMENT'
  | 'COUNSELLOR'
  | 'LIBRARIAN'
  | 'IT_ADMIN'
  | 'SUPER_ADMIN'
  | 'STUDENT'
  | 'GUARDIAN'
  | 'ALUMNI';

/**
 * A permission is a colon-separated triple: `resource:subresource:action`.
 * We keep the list small and enumerable so the grant matrix stays auditable.
 */
export type Permission =
  // Identity / users
  | 'user:profile:read:self'
  | 'user:profile:write:self'
  | 'user:list:read'
  | 'user:create'
  | 'user:deactivate'
  // Students
  | 'student:record:read:owned'
  | 'student:record:read:taught'
  | 'student:record:read:all'
  | 'student:record:write'
  // Academics
  | 'assignment:create'
  | 'assignment:read:taught'
  | 'assignment:read:enrolled'
  | 'assignment:read:guardian'
  | 'submission:write:own'
  | 'submission:mark'
  | 'gradebook:write'
  | 'gradebook:read:owned'
  | 'gradebook:read:guardian'
  | 'report:write'
  | 'report:approve:form-teacher'
  | 'report:approve:head'
  | 'report:read:owned'
  | 'report:read:guardian'
  // Attendance
  | 'attendance:write'
  | 'attendance:read:class'
  | 'attendance:read:owned'
  | 'attendance:read:guardian'
  // Resources
  | 'resource:write'
  | 'resource:read'
  // Fees
  | 'fees:invoice:read:owned'
  | 'fees:invoice:read:guardian'
  | 'fees:invoice:read:all'
  | 'fees:invoice:write'
  | 'fees:payment:initiate:self'
  | 'fees:payment:initiate:guardian'
  | 'fees:payment:verify'
  | 'fees:slip:upload'
  | 'fees:slip:review'
  | 'fees:ledger:read'
  | 'fees:ledger:write'
  // Communications
  | 'announcement:publish:school'
  | 'announcement:publish:form'
  | 'announcement:publish:stream'
  | 'announcement:publish:subject'
  | 'message:send:teacher-student'
  | 'message:send:teacher-guardian'
  | 'message:send:staff'
  // Admin
  | 'admin:user-management'
  | 'admin:roles'
  | 'admin:audit:read'
  | 'admin:calendar:write'
  | 'admin:school-settings'
  | 'admin:backup';

/**
 * Declarative grant table. Keep this file the single source of truth: every
 * new capability is added here, not scattered across route decorators.
 */
export const ROLE_GRANTS: Readonly<Record<RoleKey, readonly Permission[]>> = {
  SUPER_ADMIN: [
    'admin:user-management',
    'admin:roles',
    'admin:audit:read',
    'admin:calendar:write',
    'admin:school-settings',
    'admin:backup',
  ],

  IT_ADMIN: [
    'admin:user-management',
    'admin:audit:read',
    'admin:school-settings',
    'user:list:read',
    'user:create',
    'user:deactivate',
  ],

  HEAD_TEACHER: [
    'student:record:read:all',
    'report:approve:head',
    'admin:calendar:write',
    'admin:audit:read',
    'announcement:publish:school',
    'fees:ledger:read',
    'user:list:read',
  ],

  DEPUTY_HEAD: [
    'student:record:read:all',
    'announcement:publish:school',
    'announcement:publish:form',
    'fees:ledger:read',
  ],

  BURSAR: [
    'fees:invoice:read:all',
    'fees:invoice:write',
    'fees:payment:verify',
    'fees:slip:review',
    'fees:ledger:read',
    'fees:ledger:write',
    'announcement:publish:school',
  ],

  SECRETARY: [
    'user:list:read',
    'user:create',
    'announcement:publish:school',
    'announcement:publish:form',
  ],

  HEAD_OF_DEPARTMENT: [
    'assignment:create',
    'assignment:read:taught',
    'submission:mark',
    'gradebook:write',
    'report:write',
    'announcement:publish:subject',
  ],

  FORM_TEACHER: [
    'student:record:read:taught',
    'assignment:create',
    'assignment:read:taught',
    'attendance:write',
    'attendance:read:class',
    'report:write',
    'report:approve:form-teacher',
    'message:send:teacher-student',
    'message:send:teacher-guardian',
    'announcement:publish:stream',
    'announcement:publish:form',
  ],

  TEACHER: [
    'student:record:read:taught',
    'assignment:create',
    'assignment:read:taught',
    'submission:mark',
    'attendance:write',
    'attendance:read:class',
    'gradebook:write',
    'gradebook:read:owned',
    'report:write',
    'resource:write',
    'resource:read',
    'message:send:teacher-student',
    'message:send:teacher-guardian',
    'announcement:publish:subject',
    'announcement:publish:stream',
  ],

  COUNSELLOR: [
    'student:record:read:all',
    'message:send:staff',
  ],

  LIBRARIAN: [
    'resource:write',
    'resource:read',
  ],

  STUDENT: [
    'user:profile:read:self',
    'user:profile:write:self',
    'student:record:read:owned',
    'assignment:read:enrolled',
    'submission:write:own',
    'gradebook:read:owned',
    'report:read:owned',
    'attendance:read:owned',
    'fees:invoice:read:owned',
    'fees:payment:initiate:self',
    'fees:slip:upload',
    'resource:read',
  ],

  GUARDIAN: [
    'user:profile:read:self',
    'user:profile:write:self',
    'student:record:read:owned',
    'assignment:read:guardian',
    'gradebook:read:guardian',
    'report:read:guardian',
    'attendance:read:guardian',
    'fees:invoice:read:guardian',
    'fees:payment:initiate:guardian',
    'fees:slip:upload',
  ],

  ALUMNI: [
    'user:profile:read:self',
    'user:profile:write:self',
  ],
};

/** Flatten a user's roles into the union of their permissions. */
export function permissionsForRoles(roles: readonly RoleKey[]): Set<Permission> {
  const out = new Set<Permission>();
  for (const role of roles) {
    for (const perm of ROLE_GRANTS[role]) out.add(perm);
  }
  return out;
}
