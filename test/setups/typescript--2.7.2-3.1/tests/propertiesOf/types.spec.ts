import 'jest';

import { expectPropertiesMatch } from '../../../../utils/utils.v2';
import { propertiesOf } from 'ts-reflection';

describe('propertiesOf', () => {
  describe('types', () => {
    it('should return correct properties of Promise', () => {
      const expectProperties = ['then', 'catch', Symbol.toStringTag];

      expectPropertiesMatch(propertiesOf<Promise<unknown>>(), expectProperties);
    });

    it('should return correct properties of string', () => {
      const expectedProperties = [
        'toString',
        'charAt',
        'charCodeAt',
        'concat',
        'indexOf',
        'lastIndexOf',
        'localeCompare',
        'match',
        'replace',
        'search',
        'slice',
        'split',
        'substring',
        'toLowerCase',
        'toLocaleLowerCase',
        'toUpperCase',
        'toLocaleUpperCase',
        'trim',
        'length',
        'substr',
        'valueOf',
        'codePointAt',
        'includes',
        'endsWith',
        'normalize',
        'repeat',
        'startsWith',
        'anchor',
        'big',
        'blink',
        'bold',
        'fixed',
        'fontcolor',
        'fontsize',
        'italics',
        'link',
        'small',
        'strike',
        'sub',
        'sup',
        Symbol.iterator,
        'trimLeft',
        'trimRight',
      ];

      expectPropertiesMatch(propertiesOf<string>(), expectedProperties);
      expectPropertiesMatch(propertiesOf<String>(), expectedProperties);
    });

    it('should return correct properties of Array or an empty tuple', () => {
      const expectedProperties = [
        'length',
        'toString',
        'toLocaleString',
        'pop',
        'push',
        'concat',
        'join',
        'reverse',
        'shift',
        'slice',
        'sort',
        'splice',
        'unshift',
        'indexOf',
        'lastIndexOf',
        'every',
        'some',
        'forEach',
        'map',
        'filter',
        'reduce',
        'reduceRight',
        'find',
        'findIndex',
        'fill',
        'copyWithin',
        Symbol.iterator,
        'entries',
        'keys',
        'values',
        Symbol.unscopables,
      ];

      expectPropertiesMatch(propertiesOf<unknown[]>(), expectedProperties);
      expectPropertiesMatch(propertiesOf<Array<unknown>>(), expectedProperties);
      expectPropertiesMatch(propertiesOf<[]>(), expectedProperties);
    });

    it('should return correct properties for non-empty tuple', () => {
      const expectedProperties = [
        'length',
        'toString',
        'toLocaleString',
        'pop',
        'push',
        'concat',
        'join',
        'reverse',
        'shift',
        'slice',
        'sort',
        'splice',
        'unshift',
        'indexOf',
        'lastIndexOf',
        'every',
        'some',
        'forEach',
        'map',
        'filter',
        'reduce',
        'reduceRight',
        'find',
        'findIndex',
        'fill',
        'copyWithin',
        Symbol.iterator,
        'entries',
        'keys',
        'values',
        Symbol.unscopables,
        '0',
        '1',
        '2',
      ];

      expectPropertiesMatch(propertiesOf<[number, boolean, string]>(), expectedProperties);
    });

    it('should return correct properties of ReadonlyArray', () => {
      const expectedProperties = [
        'length',
        'toString',
        'toLocaleString',
        'concat',
        'join',
        'slice',
        'indexOf',
        'lastIndexOf',
        'every',
        'some',
        'forEach',
        'map',
        'filter',
        'reduce',
        'reduceRight',
        'find',
        'findIndex',
        Symbol.iterator,
        'entries',
        'keys',
        'values',
      ];

      expectPropertiesMatch(propertiesOf<ReadonlyArray<unknown>>(), expectedProperties);
    });
  });
});
