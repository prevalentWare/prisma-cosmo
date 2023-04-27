import { GQLModel } from '../types';
import { unCapitalize } from './capitalize';

const generateSchemaObject = (model: GQLModel) => {

  const listNames:string[]=[]
  //TODO: change query id field
  const gqlFields = model.fields.map((field) => {
    const found = field.attributes.find(element => {
      if(  element.includes("@default")){return element }
    })
    if (found && field.name !='id' && field.name !='createdAt'){
      listNames.push(field.name)
    }
    field.gqlType=field.gqlType.replace("DateTime", "AWSDateTime")
    field.gqlType=field.gqlType.replace("Json", "AWSJSON")
    return `${field.name}: ${field.gqlType}`;
  });
  const gqlUpdateFields = model.fields
    .filter(
      (f) =>
        ([
          'String',
          'Float',
          'Int',
          'Boolean',
          'AWSDateTime',
          'AWSJSON',
          'Decimal',
        ].includes(f.gqlType.replace('!', '')) ||
          f.gqlType.replace('!', '').toLowerCase().includes('enum')) &&
        f.name !== 'createdAt' &&
        f.name !== 'updatedAt'
      
    )
    .map((field) => {
      const fld = field.gqlType.replace('!', '');
      return `${field.name}: ${fld}${fld !== 'Json' ? '' : ''}`;
    });
  const gqlModel = `
  #--------------------------${model.name}-----------------------
  type ${model.name}{
    ${gqlFields}
  }
  input ${model.name}CreateInput{
    ${gqlFields.filter((f) => {
      const name = f.split(':')[0];
      const type = f.split(':')[1].trim().replace('!', '');
      const found = listNames.find(element => {
        if(  element.includes(name)){return element }       
      })
      // if(found){
      //   type.replace('!', '')
      // }
      return (
        (type == 'String' ||
          type == 'Int' ||
          type == 'Float' ||
          type == 'Boolean' ||
          type == 'AWSJSON' ||
          type == 'Decimal' ||
          type.toLocaleLowerCase().includes('enum') ||
          type == 'AWSDateTime') &&
          name != 'createdAt' &&
          name != 'updatedAt' &&
          name != found
      );
    })}
  }
  input ${model.name}WhereUniqueInput{
    id:String!
  }
  input ${model.name}UpdateInput{
  ${gqlUpdateFields
    .map((f) => {
      return f.replace('!', '');
    })
    }
  }
  `;
  return { name: model.name, model: gqlModel };
};

export { generateSchemaObject };
