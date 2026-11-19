"use client";

import { UnitPicker } from "./UnitPicker";

export function MenuUnitBar() {
  return (
    <div className="page-x pt-8 sm:pt-10">
      <UnitPicker title="Em qual unidade você vai pedir?" syncUrl className="max-w-3xl" />
      <p className="mt-2 text-sm text-mocha">Na demonstração, as duas unidades usam o mesmo cardápio de exemplo.</p>
    </div>
  );
}
