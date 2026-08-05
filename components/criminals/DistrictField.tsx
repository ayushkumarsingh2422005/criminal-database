"use client";

import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import {
  districtSelectOptions,
  OTHER_DISTRICT_VALUE,
} from "@/lib/jharkhand-districts";

export function DistrictField({
  label,
  name,
  districtSelect,
  districtCustom,
  onDistrictSelectChange,
  onDistrictCustomChange,
  emptyLabel,
  required,
}: {
  label: string;
  name?: string;
  districtSelect: string;
  districtCustom: string;
  onDistrictSelectChange: (value: string) => void;
  onDistrictCustomChange: (value: string) => void;
  emptyLabel?: string;
  required?: boolean;
}) {
  const options = districtSelectOptions(emptyLabel);

  return (
    <section className="contents">
      <Select
        label={label}
        name={name ? `${name}Select` : undefined}
        value={districtSelect}
        onChange={(e) => onDistrictSelectChange(e.target.value)}
        options={options}
        required={required && districtSelect !== OTHER_DISTRICT_VALUE}
      />
      {districtSelect === OTHER_DISTRICT_VALUE ? (
        <Input
          label="District name / जिला का नाम"
          name={name ? `${name}Custom` : undefined}
          value={districtCustom}
          onChange={(e) => onDistrictCustomChange(e.target.value)}
          placeholder="e.g. Patna, Kolkata"
          required={required}
        />
      ) : null}
    </section>
  );
}
