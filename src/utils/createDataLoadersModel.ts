import { GQLModel } from '../types';
import { unCapitalize } from './capitalize';
import { writeFile } from './writeFile';
import path from 'path';

function betweenMarkers(text: string, begin: string, end: string) {
  if (text) {
    var firstChar = text.indexOf(begin) + begin.length;
    var lastChar = text.indexOf(end);
    var newText = text.substring(firstChar, lastChar);
    return newText;
  }
}

// Extraer el nombre de la relación del atributo
const getRelationName = (attribute: string): string => {
  const regex = /@relation\((name:)?\s?"(.*?)"\)/;
  const match = attribute.match(regex);
  return match ? match[2] : '';
};

// Obtener el campo de relación a partir de los atributos
const getRelationField = (
  attributes: string[],
  relationName: string
): string => {
  const regex = new RegExp(
    `@relation\\((?:name:\s?)?"${relationName}".*?fields:\\[(.*?)\\]`
  );
  for (const attr of attributes) {
    if (attr) {
      const match = attr.match(regex);
      if (match) {
        return match[1];
      }
    }
  }
  return '';
};

const createDataLoaders = async (model: GQLModel, parsedModels: GQLModel[]) => {
  const relatedFields = model.fields.filter((f) => f.isRelatedModel);
  const listTypes: string[] = [];
  const resolverFile = `
    import { default as DataLoader } from 'dataloader';
    import { ${relatedFields
      .map((i) => i.type.charAt(0).toUpperCase() + i.type.slice(1))
      .filter(
        (value: any, index: any, array: any) => array.indexOf(value) === index
      )}, ${model.name}} from '@prisma/client'
    import { getDB } from '@/db';

    // Add base model loader
    const ${unCapitalize(model.name)}Loader = () => 
      async (ids: readonly string[]): Promise<(${
        model.name
      } | undefined)[]> => {
        const db = await getDB();
        const items = await db.${unCapitalize(model.name)}.findMany({
          where: {
            id: { in: [...ids] }
          }
        });
        return ids.map(id => items.find(item => item.id === id));
      };

    ${relatedFields
      .map((rf) => {
        if (rf.isArray) {
          const relatedModel = parsedModels.filter(
            (pm) => pm.name === rf.type
          )[0];
          const relatedModelRelation = relatedModel.fields.filter(
            (fld) => fld.type === model.name
          )[0];

          if (relatedModelRelation.isArray) {
            // many to many
            return `
        // Loader para la relación muchos a muchos
        const ${rf.name}Loader = () =>
        async (ids: readonly string[]): Promise<(${
          rf.type.charAt(0).toUpperCase() + rf.type.slice(1)
        } | undefined)[]> => {
          const db = await getDB()
          const ${rf.name}= await db.${unCapitalize(
              relatedModel.name
            )}.findMany({
                  where: {
                    ${relatedModelRelation.name}: {
                      some: {
                        id: { in: [...ids] }
                      },
                    },
                  },
                  include: {
                    ${relatedModelRelation.name}: {
                        select: {
                            id: true
                        }
                    }
                  }
                });
                return ids.map((id) => {
                  const list: any = []
                  ${rf.name}.find((${rf.name}) => {
                      return ${rf.name}.${
              relatedModelRelation.name
            }.some((i) => {
                              if (i.id === id) {list.push(${rf.name})}
                          });
                      });
                      return list
                    })
                  }
        `;
          } else {
            // one to many
            const attribute = relatedModel.fields
              .filter((f) => f.type === model.name)
              .map((f) => f.attributes[0]);
            const fields = attribute.map((attr) => {
              const regex = /fields:\[(.*?)\]/;
              const match = regex.exec(attr);
              return match && match[1];
            });
            listTypes.push(rf.type.charAt(0).toUpperCase() + rf.type.slice(1));

            const field = getRelationField(
              attribute,
              getRelationName(rf.attributes[0] ?? '')
            );

            const relatedFieldName =
              relatedModel?.fields.find(
                (f) =>
                  field && f.attributes.some((attr) => attr.includes(field))
              )?.name || '';

            return `
            // Loader para la relación uno a muchos
            const ${
              rf.name
            }Loader = () => async (ids: readonly string[]): Promise<(${
              rf.type.charAt(0).toUpperCase() + rf.type.slice(1)
            }[] | undefined)[]> => {
              const db = await getDB()
              const ${rf.name}= await db.${unCapitalize(rf.type)}.findMany({
                        where: {
                            ${
                              relatedFieldName
                                ? relatedFieldName
                                : relatedModel.fields.filter(
                                    (f) => f.type === model.name
                                  )[0].name
                            }: {
                              is: {
                                id: { in: [...ids] },
                              },
                            },
                        },
                    })
                    return ids.map((id)=>{
                      return ${rf.name}.filter(i => i.${
              field ? field : fields[0]
            } == id)
                    })
            }`;
          }
        } else if (
          // many to one
          rf.attributes.length > 0 &&
          rf.attributes[0].includes('fields')
        ) {
          const relatedField = betweenMarkers(
            rf.attributes[0],
            'fields:[',
            ']'
          );
          return `
      // Loader para la relación muchos a uno
        const ${
          rf.name
        }Loader = () => async (ids: readonly string[]): Promise<(${
            rf.type.charAt(0).toUpperCase() + rf.type.slice(1)
          } | undefined)[]> => {
          const db = await getDB()
          const ${rf.name}=  await db.${unCapitalize(rf.type)}.findMany({
                      where: {
                        id: { in: [...ids] },
                      },
                  });
                  return ids.map((id) => {
                    return ${rf.name}.find(${rf.name} => ${rf.name}.id == id)
                  })
                }
        `;
        } else {
          // one to one
          if (rf.attributes.length > 0) {
            const relationName = rf.attributes
              .filter((a) => a.includes('@relation'))[0]
              .split('"')[1];

            const relatedField = model.fields.filter(
              (f) =>
                f.attributes.filter((a) => a.includes(relationName)).length > 0
            )[0];
            const relatedModel = parsedModels.filter(
              (pm) => pm.name === relatedField.type
            )[0];
            const relatedModelRelation = relatedModel.fields.filter(
              (fld) => fld.type === model.name
            )[0];

            const relationFieldName = betweenMarkers(
              relatedModelRelation.attributes
                .filter((a) => a.includes('@relation'))[0]
                .split(',')
                .filter((a) => a.includes('fields'))[0],
              'fields:[',
              ']'
            );
            return `
        // Loader para la relación uno a uno
        const ${
          rf.name
        }Loader = () => async (ids: readonly string[]): Promise<(${
              rf.type.charAt(0).toUpperCase() + rf.type.slice(1)
            } | undefined)[]> => {
          const db = await getDB()
          const ${rf.name}=await db.${unCapitalize(rf.type)}.findMany({
                  where:{
                    ${relationFieldName}:{in:[...ids]}
                  }
                })
                return ids.map((id) => {
                  return ${rf.name}.find(${rf.name} => ${rf.name}.id == id)
                })
              }`;
          } else {
            return `
        const ${
          rf.name
        }Loader = () => async (ids: readonly string[]): Promise<(${
              rf.type.charAt(0).toUpperCase() + rf.type.slice(1)
            } | undefined)[]> => {
          const db = await getDB()
          const ${rf.name}= await db.${unCapitalize(rf.type)}.findMany({
                  where:{
                    ${unCapitalize(model.name)}Id:{in:[...ids]}
                  }
                })
                return ids.map((id) => {
                  return ${rf.name}.find(${rf.name} => ${
              rf.name
            }.${unCapitalize(model.name)}Id == id)
                })
        }`;
          }
        }
      })
      .join('')}

    const ${unCapitalize(model.name)}DataLoader =  {
      // Add base loader to the exported object
      loader: new DataLoader<string, ${model.name} | undefined>(${unCapitalize(
    model.name
  )}Loader()),
      ${relatedFields.map((i) => {
        let typeName = i.type.charAt(0).toUpperCase() + i.type.slice(1);
        const verifyTypo = listTypes.find((i) => i == typeName);
        verifyTypo == typeName ? (typeName = typeName + '[]') : typeName;
        return `
        ${i.name}Loader: new DataLoader <string,${typeName} | undefined>(${i.name}Loader())`;
      })}
    };
    export { ${unCapitalize(model.name)}DataLoader };
  `;

  await writeFile(
    path.join(
      process.cwd(),
      `prisma/generated/models/${model.name.toLowerCase()}/dataLoaders.ts`
    ),
    resolverFile
  );
};
export { createDataLoaders };
