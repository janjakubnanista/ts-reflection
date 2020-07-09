import { PropertyDescriptor, PropertyFlag, PropertyName, PropertyQuery } from '../types';

/**
 * Data structure for checking PropertyDescriptor flags against PropertyQuery
 *
 * @Internal
 */
interface PropertyFilter {
  readonly include: PropertyFlag;
  readonly exclude: PropertyFlag;
}

/**
 * If createPropertiesOf gets called without any arguments
 * it returns all the public properties
 */
const defaultPropertyQuery: PropertyQuery = { public: true };

const getPropertyName = (property: PropertyDescriptor): PropertyName => property.name;

/**
 * Helper function that converts a PropertyQuery into a PropertyFilter
 *
 * -  include field will be a bitwise OR of all the properties
 *    of query that are truthy.
 *
 * -  exclude field will be a bitwise OR of all the properties
 *    that are strictly false
 *
 * @param query {PropertyQuery}
 * @returns PropertyFilter
 */
const getPropertyFilter = (query: PropertyQuery): PropertyFilter => ({
  include:
    (query.public ? PropertyFlag.PUBLIC : 0) |
    (query.protected ? PropertyFlag.PROTECTED : 0) |
    (query.private ? PropertyFlag.PRIVATE : 0) |
    (query.readonly ? PropertyFlag.READONLY : 0) |
    (query.optional ? PropertyFlag.OPTIONAL : 0),
  exclude:
    (query.public === false ? PropertyFlag.PUBLIC : 0) |
    (query.protected === false ? PropertyFlag.PROTECTED : 0) |
    (query.private === false ? PropertyFlag.PRIVATE : 0) |
    (query.readonly === false ? PropertyFlag.READONLY : 0) |
    (query.optional === false ? PropertyFlag.OPTIONAL : 0),
});

const getFilterFunction = (filters: PropertyFilter[]) => (property: PropertyDescriptor): boolean => {
  for (let i = 0; i < filters.length; i++) {
    const { include, exclude } = filters[i];

    // Given a PropertyFlag bit mask under test, let's call it I
    // And a probe PropertyFlag T coming from the include of PropertyFilter
    //
    // 1. I matches T (I has all non-zero bits of T) if I & T === T
    //    (Or equivalently if (I ^ T) & T is zero)
    //
    // 2. I is excluded by T if I & T is not zero
    //
    // If the property flags match the include pattern and are not excluded
    // by the exclusion pattern then the property matches a filter and we can return true
    if ((property.flags & include) === include && !(property.flags & exclude)) return true;
  }

  // If none of the filters matched we return false
  return false;
};

export const createPropertiesOf = (properties: PropertyDescriptor[]) => (
  query: PropertyQuery = defaultPropertyQuery,
  ...additionalQueries: PropertyQuery[]
): PropertyName[] => {
  const queries: PropertyQuery[] = [query, ...additionalQueries];
  const filters: PropertyFilter[] = queries.map(getPropertyFilter);

  return properties.filter(getFilterFunction(filters)).map(getPropertyName);
};
