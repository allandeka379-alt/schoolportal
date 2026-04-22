import { describe, expect, it } from 'vitest';

import { can, type AuthContext } from './permissions';

function ctx(partial: Partial<AuthContext>): AuthContext {
  return {
    userId: 'user-1',
    schoolId: 'school-1',
    roles: [],
    ...partial,
  };
}

describe('can()', () => {
  it('a student can read their own report', () => {
    const student = ctx({ userId: 'u-s', roles: ['STUDENT'] });
    expect(can(student, 'report:read:owned', { ownerUserId: 'u-s' })).toBe(true);
  });

  it("a student cannot read another student's report", () => {
    const student = ctx({ userId: 'u-s', roles: ['STUDENT'] });
    expect(can(student, 'report:read:owned', { ownerUserId: 'u-other' })).toBe(false);
  });

  it('a teacher can read the record of a student they teach', () => {
    const teacher = ctx({ userId: 'u-t', roles: ['TEACHER'] });
    expect(
      can(teacher, 'student:record:read:taught', {
        studentId: 's-1',
        teachesStudentIds: ['s-1', 's-2'],
      }),
    ).toBe(true);
  });

  it('a teacher cannot read the record of a student they do not teach', () => {
    const teacher = ctx({ userId: 'u-t', roles: ['TEACHER'] });
    expect(
      can(teacher, 'student:record:read:taught', {
        studentId: 's-3',
        teachesStudentIds: ['s-1', 's-2'],
      }),
    ).toBe(false);
  });

  it('a guardian can read fees for their children only', () => {
    const guardian = ctx({ userId: 'u-g', roles: ['GUARDIAN'] });
    expect(
      can(guardian, 'fees:invoice:read:guardian', {
        studentId: 's-1',
        guardianOfStudentIds: ['s-1'],
      }),
    ).toBe(true);
    expect(
      can(guardian, 'fees:invoice:read:guardian', {
        studentId: 's-9',
        guardianOfStudentIds: ['s-1'],
      }),
    ).toBe(false);
  });

  it('a bursar can read all fees without ownership scoping', () => {
    const bursar = ctx({ userId: 'u-b', roles: ['BURSAR'] });
    expect(can(bursar, 'fees:invoice:read:all')).toBe(true);
  });

  it('cross-tenant requests are rejected', () => {
    const head = ctx({ userId: 'u-h', schoolId: 'school-1', roles: ['HEAD_TEACHER'] });
    expect(can(head, 'student:record:read:all', { schoolId: 'school-2' })).toBe(false);
  });

  it('only the head can approve a report at the head stage', () => {
    const formTeacher = ctx({ roles: ['FORM_TEACHER'] });
    const head = ctx({ roles: ['HEAD_TEACHER'] });
    expect(can(formTeacher, 'report:approve:head')).toBe(false);
    expect(can(head, 'report:approve:head')).toBe(true);
  });
});
