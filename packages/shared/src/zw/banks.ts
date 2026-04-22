/**
 * The banks the portal knows about — with the attributes needed by the
 * bank-slip OCR and reconciliation engines.
 *
 * `slipSignature` is a short set of strings that, when present on an uploaded
 * slip, strongly indicate which bank it came from. The parser uses these as
 * a first pass before running bank-specific templates.
 */
export interface BankDefinition {
  readonly code: string;
  readonly displayName: string;
  readonly swift?: string;
  readonly slipSignature: readonly string[];
  readonly supportsInstantEft: boolean;
  readonly supportsNostro: boolean;
}

export const BANKS: readonly BankDefinition[] = [
  {
    code: 'CBZ',
    displayName: 'CBZ Bank',
    swift: 'COBZZWHA',
    slipSignature: ['CBZ', 'Commercial Bank of Zimbabwe'],
    supportsInstantEft: true,
    supportsNostro: true,
  },
  {
    code: 'STANBIC',
    displayName: 'Stanbic Bank',
    swift: 'SBICZWHX',
    slipSignature: ['Stanbic', 'Standard Bank'],
    supportsInstantEft: true,
    supportsNostro: true,
  },
  {
    code: 'ZB',
    displayName: 'ZB Bank',
    swift: 'ZIBLZWHA',
    slipSignature: ['ZB Bank', 'ZB Financial'],
    supportsInstantEft: true,
    supportsNostro: true,
  },
  {
    code: 'STEWARD',
    displayName: 'Steward Bank',
    swift: 'STBHZWHX',
    slipSignature: ['Steward Bank'],
    supportsInstantEft: true,
    supportsNostro: false,
  },
  {
    code: 'FBC',
    displayName: 'FBC Bank',
    swift: 'FBCPZWHA',
    slipSignature: ['FBC', 'First Banking Corporation'],
    supportsInstantEft: true,
    supportsNostro: true,
  },
  {
    code: 'NMB',
    displayName: 'NMB Bank',
    swift: 'NMBLZWHA',
    slipSignature: ['NMB', 'National Merchant Bank'],
    supportsInstantEft: true,
    supportsNostro: true,
  },
  {
    code: 'NEDBANK',
    displayName: 'Nedbank Zimbabwe',
    swift: 'MBCAZWHX',
    slipSignature: ['Nedbank', 'MBCA'],
    supportsInstantEft: true,
    supportsNostro: true,
  },
  {
    code: 'CABS',
    displayName: 'CABS',
    swift: 'BUSHZWHA',
    slipSignature: ['CABS', 'Central Africa Building Society'],
    supportsInstantEft: true,
    supportsNostro: false,
  },
] as const;

export type BankCode = (typeof BANKS)[number]['code'];

export function findBankByCode(code: string): BankDefinition | undefined {
  return BANKS.find((b) => b.code === code.toUpperCase());
}

export function detectBankFromText(text: string): BankDefinition | undefined {
  const upper = text.toUpperCase();
  let best: BankDefinition | undefined;
  let bestScore = 0;
  for (const bank of BANKS) {
    for (const sig of bank.slipSignature) {
      if (upper.includes(sig.toUpperCase())) {
        const score = sig.length;
        if (score > bestScore) {
          best = bank;
          bestScore = score;
        }
      }
    }
  }
  return best;
}
