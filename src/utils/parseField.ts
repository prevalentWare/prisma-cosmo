import { PrismaField } from '../types';

const typeMapping = (field: PrismaField) => {
  let mappedType = field.type;
  let isRelatedModel = true;
  if (field.type) {
    if (field.isId) {
      mappedType = 'ID';
    }
    if (field.isArray) {
      mappedType = `[${mappedType}]`;
    }
    if (!field.isArray && field.required) {
      mappedType = `${mappedType}!`;
    }
    if (
      [
        'String',
        'Float',
        'Int',
        'BigInt',
        'DateTime',
        'Boolean',
        'Json',
        'Decimal',
        'Bytes',
      ].includes(field.type) ||
      field.type.toLowerCase().includes('enum')
    ) {
      isRelatedModel = false;
    }
  }
  return { ...field, gqlType: mappedType, isRelatedModel };
};

const parseField = (field: string) => {
  let [name, type, ...attributes] = field
    .trim()
    .replace(/\t/g, '')
    .replace(/:\s/g, ':')
    .replace(/,\s/g, ',')
    .replace(/\s+/g, ' ')
    .split(' ');

  const finalType = type?.replace('?', '').replace('[', '').replace(']', '');

  return typeMapping({
    name,
    type: finalType,
    required: !type?.includes('?') ?? false,
    isArray: type?.includes('['),
    isId: attributes.includes('@id'),
    isUnique: attributes.includes('@unique'),
    isMoney: attributes.includes('@Money'),
    gqlType: '',
    isRelatedModel: false,
    attributes: attributes,
  });
};

export { parseField };
