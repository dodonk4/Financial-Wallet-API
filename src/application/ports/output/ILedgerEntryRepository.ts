import { LedgerEntry } from "../../../domain/entities/LedgerEntry";

export interface ILedgerEntryRepository{
    create(ledgerEntry: LedgerEntry): Promise<LedgerEntry>
}