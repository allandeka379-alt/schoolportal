/**
 * Development seed.
 *
 * This creates a minimal, opinionated HHA seed so `pnpm db:seed` produces a
 * portal you can actually click around. It is NOT representative production
 * data — it should never run against a prod database.
 *
 * Coverage:
 *   - One School ("Harare Heritage Academy") with crest, motto, supported locales.
 *   - Academic year 2026 with three terms.
 *   - Six forms, two streams per form, four houses (Heritage, Savanna, Msasa, Granite).
 *   - A roster of subjects aligned to ZIMSEC O/A-Level offerings.
 *   - Roles matching the RoleKey enum.
 *   - Test accounts for every role with a known password.
 *   - A handful of assignments, submissions, a fees structure, and one invoice.
 *   - A school bank account at CBZ to anchor slip-reconciliation tests.
 */
import { randomUUID } from 'node:crypto';
import { argon2id, hash as argonHash } from './argon-shim';
import {
  AnnouncementChannel,
  AnnouncementPriority,
  BoardingStatus,
  Currency,
  Gender,
  InvoiceStatus,
  Locale,
  PrismaClient,
  RoleKey,
  UserStatus,
} from '../../generated/client';

const prisma = new PrismaClient();

const DEFAULT_PASSWORD = 'HHA!Portal2026';

async function hashPassword(password: string): Promise<string> {
  return argonHash(password, { type: argon2id });
}

async function upsertRoles() {
  const roles: Array<{ key: RoleKey; name: string; description: string }> = [
    { key: 'HEAD_TEACHER', name: 'Head Teacher', description: 'Final approver on reports and policy.' },
    { key: 'DEPUTY_HEAD', name: 'Deputy Head', description: 'Oversees operations and discipline.' },
    { key: 'BURSAR', name: 'Bursar', description: 'Fees, invoices, reconciliation, receipts.' },
    { key: 'SECRETARY', name: 'Secretary', description: 'Admissions, circulars, front-office workflows.' },
    { key: 'TEACHER', name: 'Teacher', description: 'Subject teacher — assignments, marking, attendance.' },
    { key: 'FORM_TEACHER', name: 'Form Teacher', description: 'Pastoral lead for a stream; signs reports.' },
    { key: 'HEAD_OF_DEPARTMENT', name: 'Head of Department', description: 'Departmental oversight.' },
    { key: 'COUNSELLOR', name: 'Counsellor', description: 'Well-being and the Quiet Room.' },
    { key: 'LIBRARIAN', name: 'Librarian', description: 'Curates the digital library.' },
    { key: 'IT_ADMIN', name: 'IT Administrator', description: 'System configuration and user management.' },
    { key: 'SUPER_ADMIN', name: 'Super Administrator', description: 'Break-glass access.' },
    { key: 'STUDENT', name: 'Student', description: 'Enrolled learner.' },
    { key: 'GUARDIAN', name: 'Guardian', description: 'Parent or registered guardian of a student.' },
    { key: 'ALUMNI', name: 'Alumni', description: 'Past pupil.' },
  ];

  for (const r of roles) {
    await prisma.role.upsert({
      where: { key: r.key },
      update: { name: r.name, description: r.description },
      create: { key: r.key, name: r.name, description: r.description },
    });
  }
}

async function seedSchool() {
  const slug = 'harare-heritage-academy';
  const school = await prisma.school.upsert({
    where: { slug },
    update: {},
    create: {
      slug,
      legalName: 'Harare Heritage Academy',
      shortName: 'HHA',
      motto: 'Discipline, Care, Heritage',
      city: 'Harare',
      province: 'Harare',
      country: 'ZW',
      email: 'office@hha.ac.zw',
      phone: '+263 242 000 000',
      timezone: 'Africa/Harare',
      defaultLocale: Locale.EN,
      supportedLocales: [Locale.EN, Locale.SN, Locale.ND],
    },
  });

  return school;
}

async function seedAcademicStructure(schoolId: string) {
  const year = await prisma.academicYear.upsert({
    where: { schoolId_label: { schoolId, label: '2026' } },
    update: { isCurrent: true },
    create: {
      schoolId,
      label: '2026',
      startsOn: new Date('2026-01-13'),
      endsOn: new Date('2026-12-04'),
      isCurrent: true,
    },
  });

  const terms = [
    { ordinal: 1, label: 'Term 1', startsOn: '2026-01-13', endsOn: '2026-04-10', reportReleaseDate: '2026-04-15' },
    { ordinal: 2, label: 'Term 2', startsOn: '2026-05-05', endsOn: '2026-08-07', reportReleaseDate: '2026-08-12' },
    { ordinal: 3, label: 'Term 3', startsOn: '2026-09-08', endsOn: '2026-12-04', reportReleaseDate: '2026-12-08' },
  ] as const;

  for (const t of terms) {
    await prisma.term.upsert({
      where: { academicYearId_ordinal: { academicYearId: year.id, ordinal: t.ordinal } },
      update: {},
      create: {
        academicYearId: year.id,
        ordinal: t.ordinal,
        label: t.label,
        startsOn: new Date(t.startsOn),
        endsOn: new Date(t.endsOn),
        reportReleaseDate: new Date(t.reportReleaseDate),
      },
    });
  }

  const forms: Array<{ level: number; label: string }> = [
    { level: 1, label: 'Form 1' },
    { level: 2, label: 'Form 2' },
    { level: 3, label: 'Form 3' },
    { level: 4, label: 'Form 4' },
    { level: 5, label: 'Lower 6' },
    { level: 6, label: 'Upper 6' },
  ];

  for (const f of forms) {
    const form = await prisma.form.upsert({
      where: { schoolId_level_label: { schoolId, level: f.level, label: f.label } },
      update: {},
      create: { schoolId, level: f.level, label: f.label },
    });
    for (const code of ['Blue', 'Green']) {
      await prisma.stream.upsert({
        where: { formId_code: { formId: form.id, code } },
        update: {},
        create: { formId: form.id, code, capacity: 30 },
      });
    }
  }

  const houses = ['Heritage', 'Savanna', 'Msasa', 'Granite'];
  for (const name of houses) {
    await prisma.house.upsert({
      where: { schoolId_name: { schoolId, name } },
      update: {},
      create: { schoolId, name },
    });
  }
}

async function seedSubjects(schoolId: string) {
  const subjects = [
    { code: 'MATH', name: 'Mathematics', zimsecCode: '4004' },
    { code: 'ENGL', name: 'English Language', zimsecCode: '1122' },
    { code: 'SHON', name: 'Shona', zimsecCode: '3159' },
    { code: 'NDEB', name: 'Ndebele', zimsecCode: '3160' },
    { code: 'CHEM', name: 'Chemistry', zimsecCode: '4007' },
    { code: 'PHYS', name: 'Physics', zimsecCode: '4008' },
    { code: 'BIO', name: 'Biology', zimsecCode: '4025' },
    { code: 'HIST', name: 'History', zimsecCode: '2167' },
    { code: 'GEOG', name: 'Geography', zimsecCode: '2217' },
    { code: 'ACCT', name: 'Principles of Accounts', zimsecCode: '7107' },
  ];

  for (const s of subjects) {
    await prisma.subject.upsert({
      where: { schoolId_code: { schoolId, code: s.code } },
      update: {},
      create: { schoolId, ...s },
    });
  }
}

async function seedFeeStructure(schoolId: string) {
  const year = await prisma.academicYear.findFirstOrThrow({
    where: { schoolId, isCurrent: true },
  });
  const form3 = await prisma.form.findFirstOrThrow({
    where: { schoolId, level: 3 },
  });

  const feeStructure = await prisma.feeStructure.create({
    data: {
      schoolId,
      academicYearId: year.id,
      formId: form3.id,
      boardingStatus: BoardingStatus.DAY,
      currency: Currency.USD,
      totalAmount: '1650.00',
      siblingDiscountPercent: '5.00',
      components: {
        create: [
          { label: 'Tuition', amount: '1200.00', displayOrder: 1 },
          { label: 'Development Levy', amount: '200.00', displayOrder: 2 },
          { label: 'ICT Levy', amount: '100.00', displayOrder: 3 },
          { label: 'Sports Levy', amount: '100.00', displayOrder: 4 },
          { label: 'Books & Stationery', amount: '50.00', displayOrder: 5 },
        ],
      },
    },
  });

  return feeStructure;
}

async function seedPeople(schoolId: string) {
  const passwordHash = await hashPassword(DEFAULT_PASSWORD);

  async function makeUser(params: {
    firstName: string;
    lastName: string;
    email: string;
    roleKey: RoleKey;
  }) {
    const user = await prisma.user.upsert({
      where: { schoolId_email: { schoolId, email: params.email } },
      update: {},
      create: {
        schoolId,
        email: params.email,
        firstName: params.firstName,
        lastName: params.lastName,
        status: UserStatus.ACTIVE,
        emailVerifiedAt: new Date(),
        credentials: {
          create: { passwordHash },
        },
      },
    });
    const role = await prisma.role.findUniqueOrThrow({ where: { key: params.roleKey } });
    await prisma.roleMembership.upsert({
      where: {
        userId_roleId_scopeType_scopeId: {
          userId: user.id,
          roleId: role.id,
          scopeType: 'SCHOOL',
          scopeId: null as unknown as string,
        },
      },
      update: {},
      create: { userId: user.id, roleId: role.id },
    });
    return user;
  }

  const head = await makeUser({
    firstName: 'Tendai',
    lastName: 'Makoni',
    email: 'head@hha.ac.zw',
    roleKey: 'HEAD_TEACHER',
  });

  const bursar = await makeUser({
    firstName: 'Rutendo',
    lastName: 'Chideme',
    email: 'bursar@hha.ac.zw',
    roleKey: 'BURSAR',
  });

  const teacher = await makeUser({
    firstName: 'Miriam',
    lastName: 'Dziva',
    email: 'teacher@hha.ac.zw',
    roleKey: 'TEACHER',
  });

  const student = await makeUser({
    firstName: 'Farai',
    lastName: 'Moyo',
    email: 'student@hha.ac.zw',
    roleKey: 'STUDENT',
  });

  const guardian = await makeUser({
    firstName: 'Sekai',
    lastName: 'Moyo',
    email: 'parent@hha.ac.zw',
    roleKey: 'GUARDIAN',
  });

  await prisma.staffProfile.upsert({
    where: { userId: head.id },
    update: {},
    create: {
      userId: head.id,
      schoolId,
      staffNo: 'HHA-STAFF-0001',
      position: 'Head Teacher',
      hiredOn: new Date('2010-01-10'),
      isHeadTeacher: true,
    },
  });

  await prisma.staffProfile.upsert({
    where: { userId: bursar.id },
    update: {},
    create: {
      userId: bursar.id,
      schoolId,
      staffNo: 'HHA-STAFF-0002',
      position: 'Bursar',
      hiredOn: new Date('2015-03-02'),
      isBursar: true,
    },
  });

  await prisma.staffProfile.upsert({
    where: { userId: teacher.id },
    update: {},
    create: {
      userId: teacher.id,
      schoolId,
      staffNo: 'HHA-STAFF-0003',
      position: 'Senior Teacher — Mathematics',
      department: 'Sciences',
      hiredOn: new Date('2018-01-15'),
    },
  });

  const studentProfile = await prisma.student.upsert({
    where: { userId: student.id },
    update: {},
    create: {
      userId: student.id,
      schoolId,
      admissionNo: 'HHA-2023-0042',
      dateOfBirth: new Date('2010-06-14'),
      gender: Gender.MALE,
      nationality: 'ZW',
      admittedOn: new Date('2023-01-15'),
    },
  });

  const guardianProfile = await prisma.guardianProfile.upsert({
    where: { userId: guardian.id },
    update: {},
    create: {
      userId: guardian.id,
      schoolId,
      occupation: 'Engineer',
    },
  });

  await prisma.studentGuardian.upsert({
    where: { studentId_guardianId: { studentId: studentProfile.id, guardianId: guardianProfile.id } },
    update: {},
    create: {
      studentId: studentProfile.id,
      guardianId: guardianProfile.id,
      relationship: 'MOTHER',
      isPrimary: true,
      isEmergencyContact: true,
    },
  });

  return { head, teacher, bursar, student, guardian, studentProfile };
}

async function seedAnnouncement(schoolId: string, authorId: string) {
  const exists = await prisma.announcement.findFirst({
    where: { schoolId, title: 'Welcome to the HHA Portal' },
  });
  if (exists) return;

  await prisma.announcement.create({
    data: {
      schoolId,
      authorId,
      channel: AnnouncementChannel.SCHOOL_WIDE,
      title: 'Welcome to the HHA Portal',
      bodyMarkdown:
        '# Welcome\n\nThis portal brings every academic, administrative, and financial interaction into one place. If you have questions, speak to your form teacher.',
      priority: AnnouncementPriority.NORMAL,
      publishedAt: new Date(),
    },
  });
}

async function seedBankAccount(schoolId: string) {
  await prisma.schoolBankAccount.upsert({
    where: {
      schoolId_bank_accountNumber: {
        schoolId,
        bank: 'CBZ',
        accountNumber: '01234567890',
      },
    },
    update: {},
    create: {
      schoolId,
      bank: 'CBZ',
      accountName: 'Harare Heritage Academy',
      accountNumber: '01234567890',
      branchName: 'Nelson Mandela',
      branchCode: '04100',
      currency: Currency.USD,
    },
  });
}

async function seedSampleInvoice(studentId: string) {
  const term = await prisma.term.findFirstOrThrow({
    where: { academicYear: { isCurrent: true }, ordinal: 1 },
  });
  const existing = await prisma.invoice.findFirst({ where: { studentId, termId: term.id } });
  if (existing) return;

  await prisma.invoice.create({
    data: {
      studentId,
      termId: term.id,
      invoiceNumber: `INV-2026-T1-${randomUUID().slice(0, 8).toUpperCase()}`,
      currency: Currency.USD,
      subtotalAmount: '1650.00',
      totalAmount: '1650.00',
      balance: '1650.00',
      dueDate: new Date('2026-02-01'),
      status: InvoiceStatus.ISSUED,
      lineItems: {
        create: [
          { label: 'Term 1 Tuition', amount: '1200.00', displayOrder: 1 },
          { label: 'Term 1 Development Levy', amount: '200.00', displayOrder: 2 },
          { label: 'Term 1 ICT Levy', amount: '100.00', displayOrder: 3 },
          { label: 'Term 1 Sports Levy', amount: '100.00', displayOrder: 4 },
          { label: 'Term 1 Books & Stationery', amount: '50.00', displayOrder: 5 },
        ],
      },
    },
  });
}

async function main() {
  console.info('[seed] upserting roles');
  await upsertRoles();

  console.info('[seed] upserting school');
  const school = await seedSchool();

  console.info('[seed] seeding academic structure');
  await seedAcademicStructure(school.id);

  console.info('[seed] seeding subjects');
  await seedSubjects(school.id);

  console.info('[seed] seeding people');
  const people = await seedPeople(school.id);

  console.info('[seed] seeding fee structure');
  await seedFeeStructure(school.id);

  console.info('[seed] seeding sample invoice');
  await seedSampleInvoice(people.studentProfile.id);

  console.info('[seed] seeding bank account');
  await seedBankAccount(school.id);

  console.info('[seed] seeding announcement');
  await seedAnnouncement(school.id, people.head.id);

  console.info('[seed] done');
  console.info('');
  console.info('  Test accounts (password: %s)', DEFAULT_PASSWORD);
  console.info('    head@hha.ac.zw      — Head Teacher');
  console.info('    bursar@hha.ac.zw    — Bursar');
  console.info('    teacher@hha.ac.zw   — Teacher (Maths)');
  console.info('    student@hha.ac.zw   — Student');
  console.info('    parent@hha.ac.zw    — Parent');
  console.info('');
}

main()
  .catch((err: unknown) => {
    console.error('[seed] failed', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
