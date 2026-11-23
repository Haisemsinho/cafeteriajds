"use client";

import { UnitPicker } from "./UnitPicker";

export function MenuUnitBar({ note }: { note: string }) {
  return (
    <div className="page-x pt-6 sm:pt-8">
      <UnitPicker title="Em qual unidade você vai pedir?" syncUrl compact className="max-w-xl" />
      <p className="mt-2 max-w-xl text-sm text-mocha">{note}</p>
    </div>
  );
}
