import {
  InterfaceDeclarationStructure,
  MethodSignatureStructure,
  ParameterDeclarationStructure
} from "ts-simple-ast";
import { map } from "ramda";
import { hasComplexInput } from "./utils";
import {
  toOutputName,
  toInputName,
  solidityToJsOutputType,
  solidityToJsInputType,
} from "../../lib";

export function getContractInterface({
  contract_name,
  abi
}: TruffleJson): InterfaceDeclarationStructure {
  const functions = abi.filter(({ type }) => type === "function");
  const getInputName = toInputName(contract_name);
  return {
    name: contract_name,
    methods: map(getMethod(contract_name), functions)
  };
}

const getMethod = (contractName: string) => (
  fun: FunctionDescription
): MethodSignatureStructure => {
  return {
    name: fun.name,
    parameters: [
      ...getParams(contractName, fun),
      {
        name: "options",
        hasQuestionToken: true,
        type: "TransactionOptions"
      }
    ],
    returnType: getReturnType(contractName, fun)
  };
};

const getReturnType = (contractName: string, fun: FunctionDescription) => {
  if (fun.constant) {
    const param =
      fun.outputs.length > 1
        ? toOutputName(contractName)(fun.name)
        : solidityToJsOutputType(fun.outputs[0].type);
    return `CallResult<${param}>`;
  }
  return `TransactionResult<ContractsEvents>`;
};

const getParams = (
  contractName: string,
  fun: FunctionDescription
): ParameterDeclarationStructure[] => {
  if (fun.inputs.length === 0) {
    return [];
  }
  const externalInputInterface = hasComplexInput(fun);
  if (externalInputInterface) {
    return [
      {
        name: "input",
        type: toInputName(contractName)(fun.name)
      }
    ];
  } else {
    return fun.inputs.map(getParam);
  }
};

function getParam(
  abi: FunctionParameter,
  index: number
): ParameterDeclarationStructure {
  return {
    name: abi.name || "anonymous" + index,
    type: solidityToJsInputType(abi.type)
  };
}
