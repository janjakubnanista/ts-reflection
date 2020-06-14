import { ObjectTypeDescriptor, TypeName } from '../types';
import {
  createIsNotNullOrUndefined,
  createIsNotPrimitive,
  createLogicalAndChain,
  createLogicalOrChain,
  createValueCheckFunction,
} from './utils';
import ts from 'typescript';

export type CreateObjectPropertyCheck = (typeName: TypeName, value: ts.Expression) => ts.Expression;

// interface      -> everything except for null & undefined
// - Object       -> everything except for null & undefined
// object         -> everything but number, string, boolean, symbol, null, or undefined
// Indexed        -> everything but number, string, boolean, symbol, null, or undefined
// - Record       -> everything but number, string, boolean, symbol, null, or undefined
export const createObjectTypeCheck = (
  value: ts.Expression,
  { properties, numberIndexType, stringIndexType }: ObjectTypeDescriptor,
  createObjectPropertyCheck: CreateObjectPropertyCheck,
): ts.Expression => {
  const propertyChecks = properties.map((property) =>
    createObjectPropertyCheck(property.type, ts.createElementAccess(value, property.accessor)),
  );

  const objectKeys = ts.createCall(ts.createPropertyAccess(ts.createIdentifier('Object'), 'keys'), [], [value]);
  const basicTypeCheck =
    stringIndexType || numberIndexType ? createIsNotPrimitive(value) : createIsNotNullOrUndefined(value);

  const indexPropertyChecks =
    stringIndexType || numberIndexType
      ? [
          ts.createCall(
            ts.createPropertyAccess(objectKeys, 'every'),
            [],
            [
              createValueCheckFunction((key) => {
                const propertyValue = ts.createElementAccess(value, key);
                const numberPropertyCheck = numberIndexType
                  ? createLogicalOrChain(
                      createLogicalAndChain(
                        ts.createCall(
                          ts.createIdentifier('isNaN'),
                          [],
                          [ts.createCall(ts.createIdentifier('parseFloat'), [], [key])],
                        ),
                        ts.createStrictInequality(key, ts.createStringLiteral('NaN')),
                      ),
                      createObjectPropertyCheck(numberIndexType, propertyValue),
                    )
                  : undefined;

                const stringPropertyCheck = stringIndexType
                  ? createObjectPropertyCheck(stringIndexType, propertyValue)
                  : undefined;

                const checks: ts.Expression[] = [numberPropertyCheck, stringPropertyCheck].filter(
                  Boolean,
                ) as ts.Expression[];

                return createLogicalAndChain(...checks);
              }, 'key'),
            ],
          ),
        ]
      : [];

  return createLogicalAndChain(basicTypeCheck, ...propertyChecks, ...indexPropertyChecks);
};
