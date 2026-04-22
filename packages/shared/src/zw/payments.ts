/**
 * Payment-method metadata.
 *
 * The proposal's Section 7 table is the source of truth. Each method here
 * carries enough information to (a) render a payment selector UI, (b) route
 * the payment to the correct gateway adapter, and (c) decide whether the
 * resulting transaction can be auto-verified or must wait for statement
 * reconciliation.
 */
export type PaymentMethodKey =
  | 'ECOCASH'
  | 'ONEMONEY'
  | 'INNBUCKS'
  | 'ZIPIT'
  | 'BANK_TRANSFER_CBZ'
  | 'BANK_TRANSFER_STANBIC'
  | 'BANK_TRANSFER_ZB'
  | 'BANK_TRANSFER_STEWARD'
  | 'CARD_VISA'
  | 'CARD_MASTERCARD'
  | 'CASH_AT_BURSARY'
  | 'NOSTRO_USD_TRANSFER'
  | 'BANK_SLIP';

export type SettlementSpeed = 'INSTANT' | 'SAME_DAY' | 'ONE_TO_THREE_DAYS' | 'MANUAL';
export type VerificationMode = 'API' | 'STATEMENT_RECON' | 'MANUAL_RECEIPT';

export interface PaymentMethodDefinition {
  readonly key: PaymentMethodKey;
  readonly displayName: string;
  readonly shortName: string;
  readonly category: 'MOBILE_MONEY' | 'BANK' | 'CARD' | 'CASH' | 'FOREIGN';
  readonly settlement: SettlementSpeed;
  readonly verification: VerificationMode;
  readonly supportedCurrencies: readonly ('USD' | 'ZWL' | 'ZWG')[];
}

export const PAYMENT_METHODS: readonly PaymentMethodDefinition[] = [
  { key: 'ECOCASH', displayName: 'EcoCash Mobile Money', shortName: 'EcoCash',
    category: 'MOBILE_MONEY', settlement: 'INSTANT', verification: 'API',
    supportedCurrencies: ['USD', 'ZWG'] },
  { key: 'ONEMONEY', displayName: 'OneMoney Mobile Money', shortName: 'OneMoney',
    category: 'MOBILE_MONEY', settlement: 'INSTANT', verification: 'API',
    supportedCurrencies: ['USD', 'ZWG'] },
  { key: 'INNBUCKS', displayName: 'InnBucks Mobile Money', shortName: 'InnBucks',
    category: 'MOBILE_MONEY', settlement: 'INSTANT', verification: 'API',
    supportedCurrencies: ['USD'] },
  { key: 'ZIPIT', displayName: 'ZIPIT Interbank Transfer', shortName: 'ZIPIT',
    category: 'BANK', settlement: 'INSTANT', verification: 'API',
    supportedCurrencies: ['USD', 'ZWG'] },
  { key: 'BANK_TRANSFER_CBZ', displayName: 'CBZ Bank Transfer', shortName: 'CBZ EFT',
    category: 'BANK', settlement: 'SAME_DAY', verification: 'STATEMENT_RECON',
    supportedCurrencies: ['USD', 'ZWG'] },
  { key: 'BANK_TRANSFER_STANBIC', displayName: 'Stanbic Bank Transfer', shortName: 'Stanbic EFT',
    category: 'BANK', settlement: 'SAME_DAY', verification: 'STATEMENT_RECON',
    supportedCurrencies: ['USD', 'ZWG'] },
  { key: 'BANK_TRANSFER_ZB', displayName: 'ZB Bank Transfer', shortName: 'ZB EFT',
    category: 'BANK', settlement: 'SAME_DAY', verification: 'STATEMENT_RECON',
    supportedCurrencies: ['USD', 'ZWG'] },
  { key: 'BANK_TRANSFER_STEWARD', displayName: 'Steward Bank Transfer', shortName: 'Steward EFT',
    category: 'BANK', settlement: 'SAME_DAY', verification: 'STATEMENT_RECON',
    supportedCurrencies: ['USD', 'ZWG'] },
  { key: 'CARD_VISA', displayName: 'Visa Card', shortName: 'Visa',
    category: 'CARD', settlement: 'INSTANT', verification: 'API',
    supportedCurrencies: ['USD'] },
  { key: 'CARD_MASTERCARD', displayName: 'Mastercard', shortName: 'Mastercard',
    category: 'CARD', settlement: 'INSTANT', verification: 'API',
    supportedCurrencies: ['USD'] },
  { key: 'CASH_AT_BURSARY', displayName: 'Cash at Bursary', shortName: 'Cash',
    category: 'CASH', settlement: 'INSTANT', verification: 'MANUAL_RECEIPT',
    supportedCurrencies: ['USD', 'ZWG'] },
  { key: 'NOSTRO_USD_TRANSFER', displayName: 'Nostro USD Transfer (Foreign)', shortName: 'Nostro',
    category: 'FOREIGN', settlement: 'ONE_TO_THREE_DAYS', verification: 'STATEMENT_RECON',
    supportedCurrencies: ['USD'] },
  { key: 'BANK_SLIP', displayName: 'Upload a bank-deposit slip', shortName: 'Slip',
    category: 'BANK', settlement: 'MANUAL', verification: 'STATEMENT_RECON',
    supportedCurrencies: ['USD', 'ZWG', 'ZWL'] },
];

export function findPaymentMethod(key: PaymentMethodKey): PaymentMethodDefinition | undefined {
  return PAYMENT_METHODS.find((m) => m.key === key);
}
