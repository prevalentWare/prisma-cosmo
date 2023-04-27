import { GQLModel } from '../types';
import { unCapitalize } from './capitalize';
import { writeFile } from './writeFile';
import path from 'path';

function betweenMarkers(text: string, begin: string, end: string) {
  var firstChar = text.indexOf(begin) + begin.length;
  var lastChar = text.indexOf(end);
  var newText = text.substring(firstChar, lastChar);
  return newText;
}

const createResolvers = async (model: GQLModel, parsedModels: GQLModel[]) => {
  const relatedFields = model.fields.filter((f) => f.isRelatedModel);
  const resolverFile = `
  import { Resolver } from '../../types';
  import { ${unCapitalize(model.name)}DataLoader } from './dataLoaders'
  
    const ${unCapitalize(model.name)}Resolvers: Resolver = {
    ${model.name}: {
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
                return `
                ${rf.name}: async (parent, args, { db }) => {
                return await ${unCapitalize(model.name)}DataLoader(db).${rf.name}Loader.load(parent.id);
                }
                `
                // return `${rf.name}: async (parent, args, { db }) => {
                //   return await db.${unCapitalize(
                //     relatedModel.name
                //   )}.findMany({
                //     where: {
                //       ${relatedModelRelation.name}: {
                //         some: {
                //           id: {
                //             equals: parent.id,
                //           },
                //         },
                //       },
                //     },
                //   });
                // }`;
              } else {
                //many to one
                return `
                ${rf.name}: async (parent, args, { db }) => {
                return await ${unCapitalize(model.name)}DataLoader(db).${rf.name}Loader.load(parent.id);
                }`
                // return `${rf.name}: async (parent, args, { db }) => {
                //   return await db.${unCapitalize(rf.type)}.findMany({
                //   where: {
                //       ${
                //         relatedModel.fields.filter(
                //           (f) => f.type === model.name
                //         )[0].name
                //       }: {
                //         is: {
                //           id: {
                //             equals: parent.id,
                //           },
                //         },
                //       },
                //     },
                //   })
                // }`;
              }
            } else if (
              //one to many
              rf.attributes.length > 0 &&
              rf.attributes[0].includes('fields')
            ) {
              const relatedField = betweenMarkers(
                rf.attributes[0],
                'fields:[',
                ']'
              );
              if (rf.required) {
                return `
                ${rf.name}: async (parent, args, { db }) => {
                return await ${unCapitalize(model.name)}DataLoader(db).${rf.name}Loader.load(parent.${relatedField});
                }
                `
                // ${rf.name}: async (parent, args, { db }) => {
                // return await db.${unCapitalize(rf.type)}.findUnique({
                //     where: {
                //     id: parent.${relatedField},
                //     },
                // });
                // }
                // `;
              } else {
                return `
                ${rf.name}: async (parent, args, { db }) => {
                  if (parent.${relatedField}) {
                    return await ${unCapitalize(model.name)}DataLoader(db).${rf.name}Loader.load(parent.${relatedField});
                  }
                  else{
                    return null;
                  }
                }
                `;
                // return `
                // ${rf.name}: async (parent, args, { db }) => {
                //   if (parent.${relatedField}) {
                //     return await db.${unCapitalize(rf.type)}.findUnique({
                //         where: {
                //         id: parent.${relatedField},
                //         },
                //     });
                //   }
                //   else{
                //     return null;
                //   }
                // }
                // `;
              }
            } else {
              //one to one
              if (rf.attributes.length > 0) {
                const relationName = rf.attributes
                  .filter((a) => a.includes('@relation'))[0]
                  .split('"')[1];

                const relatedField = model.fields.filter(
                  (f) =>
                    f.attributes.filter((a) => a.includes(relationName))
                      .length > 0
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
                return `${rf.name}: async (parent, args, { db }) => {
                  return await ${unCapitalize(model.name)}DataLoader(db).${rf.name}Loader.load(parent.${relatedField});
                }`;
              } else {
                return `${rf.name}: async (parent, args, { db }) => {
                  return await ${unCapitalize(model.name)}DataLoader(db).${rf.name}Loader.load(parent.id);
                }`;
              }
            }
          })
          .join(',')}
    },
    Query: {
        ${unCapitalize(model.name)}s: async (parent, args, { db }) => {
        return await db.${unCapitalize(model.name)}.findMany({});
        },
        ${unCapitalize(model.name)}: async (parent, args, { db }) => {
        return await db.${unCapitalize(model.name)}.findUnique({
            where: {
            id: args.id,
            },
        });
        },
    },
    Mutation:{
      create${model.name}:async (parent, args, { db })=>{
        return await db.${unCapitalize(model.name)}.create({
          data:{...args.data, ${model.fields
            .filter(
              (rf) =>
                rf.type === 'DateTime' &&
                rf.name !== 'createdAt' &&
                rf.name !== 'updatedAt'
            )
            .map(
              (el) => `${el.name}: new Date(args.data.${el.name}).toISOString()`
            )
            .join(',')} }
        })
      },
      update${model.name}:async (parent, args, { db })=>{
        return await db.${unCapitalize(model.name)}.update({
          where:{
            id:args.where.id
          },
          data:{...args.data, ${model.fields
            .filter(
              (rf) =>
                rf.type === 'DateTime' &&
                rf.name !== 'createdAt' &&
                rf.name !== 'updatedAt'
            )
            .map(
              (el) =>
                `...(args.data.${el.name} && {${el.name}: new Date(args.data.${el.name}).toISOString()})`
            )
            .join(',')}}
        })
      },
      upsert${model.name}:async (parent, args, { db })=>{
        return await db.${unCapitalize(model.name)}.upsert({
          where:{
            id:args.where.id
          },
          create:{...args.data, ${model.fields
              .filter(
                (rf) =>
                  rf.type === 'DateTime' &&
                  rf.name !== 'createdAt' &&
                  rf.name !== 'updatedAt'
              )
              .map(
                (el) => `${el.name}: new Date(args.data.${el.name}).toISOString()`
              )
              .join(',')}
          },
          update: {...args.data, ${model.fields
              .filter(
                (rf) =>
                  rf.type === 'DateTime' &&
                  rf.name !== 'createdAt' &&
                  rf.name !== 'updatedAt'
              )
              .map(
                (el) =>
                  `...(args.data.${el.name} && {${el.name}: new Date(args.data.${el.name}).toISOString()})`
              )
              .join(',')}
          }    
        })
      },
    
      delete${model.name}:async (parent, args, { db })=>{
        return await db.${unCapitalize(model.name)}.delete({
          where:{
            id:args.where.id
          }
        })
      },
    }
    }
    export { ${unCapitalize(model.name)}Resolvers };
    `;
  await writeFile(
    path.join(
      process.cwd(),
      `prisma/generated/aws/models/${model.name.toLowerCase()}/resolvers.ts`
    ),
    resolverFile
  );
};
export { createResolvers };
