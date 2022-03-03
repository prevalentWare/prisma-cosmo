import { parseField } from './parseField';

const parseModel = (model: string) => {
  const name = Array.from(model.matchAll(/model (.*) {/g))[0][1];
  const data = model.match(/\{([^{}]+)\}/g);
  const fields = data ? data[0].replace('{',"").replace("}","").split('\n') : [];
  const parsedFields = fields
    .map((field) => {
      return parseField(field);
    })
    .filter((el) => el.type);
  return {
    name: name,
    fields: parsedFields,
  };
};

export { parseModel };
