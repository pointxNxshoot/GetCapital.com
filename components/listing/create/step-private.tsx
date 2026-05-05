"use client";

import type { ListingDraft } from "./wizard";
import { WizardTextarea, WizardSelect, WizardStepHeading, WizardActions } from "./form-fields";

type Props = {
  draft: ListingDraft;
  updateDraft: (updates: Partial<ListingDraft>) => void;
  onNext: () => void;
  onBack: () => void;
};

export function StepPrivate({ draft, updateDraft, onNext, onBack }: Props) {
  return (
    <div>
      <WizardStepHeading
        title="Private details"
        description="This information is only visible to approved buyers. Be candid — it builds trust."
      />

      <div className="space-y-8">
        <WizardTextarea
          label="Detailed description"
          value={draft.description_private}
          onChange={(e) => updateDraft({ description_private: e.target.value })}
          placeholder="The full story — operations, customers, competitive position, growth opportunities, risks. This is what serious buyers read."
          rows={6}
          helperText="Comprehensive detail helps qualified buyers move faster."
        />

        <WizardTextarea
          label="Reason for sale"
          value={draft.reason_for_sale}
          onChange={(e) => updateDraft({ reason_for_sale: e.target.value })}
          placeholder="e.g. Relocating to Melbourne, retiring, pursuing a new venture"
          rows={2}
          optional
        />

        <WizardTextarea
          label="What's included in the sale"
          value={draft.inclusions}
          onChange={(e) => updateDraft({ inclusions: e.target.value })}
          placeholder="e.g. All equipment, existing inventory, lease assignment, customer database, brand/IP, training period"
          rows={3}
          optional
        />

        <WizardSelect
          label="Deal structure preference"
          value={draft.deal_structure}
          onChange={(e) => updateDraft({ deal_structure: e.target.value })}
          optional
        >
          <option value="">No preference</option>
          <option value="asset_sale">Asset sale</option>
          <option value="share_sale">Share sale</option>
          <option value="flexible">Flexible</option>
        </WizardSelect>
      </div>

      <WizardActions onBack={onBack} onNext={onNext} />
    </div>
  );
}
