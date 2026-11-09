import React from 'react';
import { CloseIcon, ShieldIcon, LockIcon, FileTextIcon } from './Icons';

export const TermsOfServiceModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
      <div className="bg-[#0F141F] border border-[#1E293B] max-w-2xl w-full p-6 max-h-[85vh] flex flex-col rounded-[2px]">
        <div className="flex items-center justify-between pb-4 border-b border-[#1E293B]">
          <div className="flex items-center gap-2">
            <FileTextIcon className="w-4 h-4 text-accent" />
            <h2 className="font-serif text-lg font-semibold text-ink">Terms of Service</h2>
          </div>
          <button onClick={onClose} className="p-1 text-ink-muted hover:text-ink">
            <CloseIcon className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-y-auto py-4 space-y-4 text-xs font-mono text-ink-secondary leading-relaxed pr-2">
          <p className="font-semibold text-ink">Effective Date: November 1, 2026</p>
          
          <div>
            <h4 className="font-semibold text-ink uppercase text-[11px] mb-1">1. Scope of Service</h4>
            <p>
              DisputeMind AI provides automated dispute defense representation and evidence assembly software for PayPal merchants. 
              The software interfaces with the PayPal Disputes REST API to transmit evidence compiled from the merchant's authorized records.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-ink uppercase text-[11px] mb-1">2. Merchant Authorization</h4>
            <p>
              By configuring PayPal Sandbox or production credentials, the merchant authorizes DisputeMind AI to read dispute notices 
              and submit evidence packages under PayPal Merchant Protection guidelines on behalf of the registered entity.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-ink uppercase text-[11px] mb-1">3. Accuracy of Retained Evidence</h4>
            <p>
              The merchant is solely responsible for maintaining truthful, accurate shipping telemetry, delivery signatures, and customer communication archives. 
              DisputeMind AI does not fabricate records and operates strictly on factual data retrieved from integrated merchant datastores.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-ink uppercase text-[11px] mb-1">4. Adjudication Outcomes</h4>
            <p>
              Final chargeback decisions rest solely with PayPal and the relevant card-issuing financial institutions. 
              DisputeMind AI automates legal defense preparation but does not guarantee the outcome of contested chargebacks.
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-[#1E293B] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-accent text-white font-mono text-xs hover:bg-accent-navy rounded-[2px]"
          >
            ACKNOWLEDGE & CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};

export const PrivacyPolicyModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
      <div className="bg-[#0F141F] border border-[#1E293B] max-w-2xl w-full p-6 max-h-[85vh] flex flex-col rounded-[2px]">
        <div className="flex items-center justify-between pb-4 border-b border-[#1E293B]">
          <div className="flex items-center gap-2">
            <LockIcon className="w-4 h-4 text-accent" />
            <h2 className="font-serif text-lg font-semibold text-ink">Privacy & Data Governance Policy</h2>
          </div>
          <button onClick={onClose} className="p-1 text-ink-muted hover:text-ink">
            <CloseIcon className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-y-auto py-4 space-y-4 text-xs font-mono text-ink-secondary leading-relaxed pr-2">
          <p className="font-semibold text-ink">Last Revised: November 1, 2026</p>

          <div>
            <h4 className="font-semibold text-ink uppercase text-[11px] mb-1">1. Data Minimization</h4>
            <p>
              DisputeMind AI processes only the transaction identifier, dispute reason, tracking number, carrier delivery status, 
              and relevant customer support transcripts strictly required to substantiate PayPal Merchant Protection eligibility.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-ink uppercase text-[11px] mb-1">2. Multi-Tenant Cryptographic Boundaries</h4>
            <p>
              All merchant datasets are isolated using row-level tenant keys (merchant_id). Cross-tenant queries are blocked at the ORM layer, 
              and all API endpoints enforce JWT session validation with automatic rejection of unauthorized access attempts.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-ink uppercase text-[11px] mb-1">3. AI Processing Pipeline</h4>
            <p>
              Dispute synthesis prompts transmitted to Google Gemini are stateless and scoped strictly to the contested transaction context. 
              Customer personal data is not retained by third-party model providers for model training.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-ink uppercase text-[11px] mb-1">4. Secret & Key Security</h4>
            <p>
              PayPal API credentials and access tokens are cached in volatile memory with automated expiration. 
              No unhashed passwords or raw private keys are stored in version control or unencrypted files.
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-[#1E293B] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-accent text-white font-mono text-xs hover:bg-accent-navy rounded-[2px]"
          >
            CONFIRM & CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};

export const AboutUsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
      <div className="bg-[#0F141F] border border-[#1E293B] max-w-2xl w-full p-6 max-h-[85vh] flex flex-col rounded-[2px]">
        <div className="flex items-center justify-between pb-4 border-b border-[#1E293B]">
          <div className="flex items-center gap-2">
            <ShieldIcon className="w-4 h-4 text-accent" />
            <h2 className="font-serif text-lg font-semibold text-ink">Adjudication Architecture & Methodology</h2>
          </div>
          <button onClick={onClose} className="p-1 text-ink-muted hover:text-ink">
            <CloseIcon className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-y-auto py-4 space-y-4 text-xs font-mono text-ink-secondary leading-relaxed pr-2">
          <div>
            <h4 className="font-semibold text-ink uppercase text-[11px] mb-1">The Enterprise Chargeback Problem</h4>
            <p>
              In modern e-commerce, manual dispute handling takes an average of 45 minutes of staff labor per claim, costing between $15 and $45 per dispute. 
              As a result, merchants frequently surrender legitimate disputes under $100 because the manual overhead exceeds the recovery value.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-ink uppercase text-[11px] mb-1">The Autonomous Defense Sequence</h4>
            <p>
              DisputeMind AI replaces manual investigation with an event-driven RAG architecture:
            </p>
            <div className="bg-[#141B28] p-3 border border-[#1E293B] space-y-1.5 my-2">
              <div>1. PayPal fires CUSTOMER.DISPUTE.CREATED webhook to the FastAPI backend.</div>
              <div>2. The dispute orchestrator queries Elastic by transaction ID to retrieve shipping telemetry and CRM chat logs.</div>
              <div>3. Google Gemini synthesizes an evidence statement adhering to PayPal Merchant Protection requirements.</div>
              <div>4. Evidence is transmitted directly via POST /v1/customer/disputes/{'{id}'}/provide-evidence.</div>
              <div>5. The merchant ledger updates synchronously in under 10 seconds.</div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-ink uppercase text-[11px] mb-1">Technology Specifications</h4>
            <p>
              Built with Python FastAPI, SQLite (WAL mode), Google Gemini 2.0 Flash, Elastic, AG Grid, and deployed on Render. 
              All operations operate strictly within the PayPal Sandbox environment for the hackathon.
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-[#1E293B] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-accent text-white font-mono text-xs hover:bg-accent-navy rounded-[2px]"
          >
            DISMISS
          </button>
        </div>
      </div>
    </div>
  );
};
