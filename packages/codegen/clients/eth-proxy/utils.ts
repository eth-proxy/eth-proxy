
export function hasComplexInput({ inputs, type }: AbiDefinition): boolean {
  return (
    type === "function" &&
    inputs.length > 1 &&
    (inputs as FunctionParameter[]).every(i => !!i.name)
  );
}
