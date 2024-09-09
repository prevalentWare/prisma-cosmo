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
    import { ${relatedFields
      .map((i) => i.type.charAt(0).toUpperCase() + i.type.slice(1))
      .filter(
        (value: any, index: any, array: any) => array.indexOf(value) === index
      )}} from '@prisma/client'
    import { Resolver } from '@/types';
    import { ${model.name}CreateInput, ${model.name}UpdateInput, ${model.name}WhereDeleteInput, ${model.name}WhereUniqueInput } from '../../types.ts';
    import { ${unCapitalize(model.name)}DataLoader } from './dataLoaders';
 
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
                ${rf.name}: async (parent: ${rf.type}, _: null, { db, session }) => {
                    ${unCapitalize(model.name)}DataLoader.${rf.name}Loader.clearAll()
                    return await ${unCapitalize(model.name)}DataLoader.${rf.name}Loader.load(parent.id);
                }
                `
          } else {
            //many to one
            return `
                ${rf.name}: async (parent: ${rf.type}, _: null, { db,session }) => {
                  ${unCapitalize(model.name)}DataLoader.${rf.name}Loader.clearAll()
                  return await ${unCapitalize(model.name)}DataLoader.${rf.name}Loader.load(parent.id);
                }`
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
                ${rf.name}: async (parent: ${rf.type}, _: null, { db, session }) => {
                ${unCapitalize(model.name)}DataLoader.${rf.name}Loader.clearAll()  
                return await ${unCapitalize(model.name)}DataLoader.${rf.name}Loader.load(parent.${relatedField});
                }
                `
          } else {
            return `
                ${rf.name}: async (parent: ${rf.type}, _: null, { db,session }) => {
                  if (parent.${relatedField}) {
                    ${unCapitalize(model.name)}DataLoader.${rf.name}Loader.clearAll()   
                    return await ${unCapitalize(model.name)}DataLoader.${rf.name}Loader.load(parent.${relatedField});

                  }
                  else{
                    return null;
                  }
                }
                `;
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
            return `${rf.name}: async (parent: ${rf.type}, _: null, { db, session }) => {
                  ${unCapitalize(model.name)}DataLoader.${rf.name}Loader.clearAll()   
                  return await ${unCapitalize(model.name)}DataLoader.${rf.name}Loader.load(parent.${relatedField});
                }`;
          } else {
            return `${rf.name}: async (parent: ${rf.type}, _: null, { db,session }) => {
                    ${unCapitalize(model.name)}DataLoader.${rf.name}Loader.clearAll()  
                    return await ${unCapitalize(model.name)}DataLoader.${rf.name}Loader.load(parent.id);
                    }`;
          }
        }
      })
      .join(',')}
    },
    Query: {
        ${unCapitalize(model.name)}s: async (_: null, __: null, { db,session }) => {
         return await db.${unCapitalize(model.name)}.findMany({});
        },
        ${unCapitalize(model.name)}: async (_: null, args: ${model.name}WhereUniqueInput, { db, session }) => {
          return await db.${unCapitalize(model.name)}.findUnique({
              where: {
              id: args.id,
              },
          });
        },
    },
    Mutation:{
      create${model.name}:async (_: null, args: ${model.name}CreateInput, { db,session })=>{
        return await db.${unCapitalize(model.name)}.create({
          data:{...args.data}
        })
      },
      update${model.name}:async (_: null, args: ${model.name}UpdateInput, { db, session })=>{
          return await db.${unCapitalize(model.name)}.update({
            where:{
              id:args.where.id
            },
            data:{...args.data}
          })
      },
      delete${model.name}:async (_: null, args: ${model.name}WhereDeleteInput, { db, session })=>{
          return await db.${unCapitalize(model.name)}.delete({
            where:{
              id:args.where.id
            }
          })
      }
    }
  }
  export { ${unCapitalize(model.name)}Resolvers };
    `;
  await writeFile(
    path.join(
      process.cwd(),
      `prisma/generated/models/${model.name.toLowerCase()}/resolvers.ts`
    ),
    resolverFile
  );

  const generalResolverFile = `  
    import { Resolver } from '@/types';
    import { getSignedUrlForUpload } from '@/utils/getSignedURL';
    import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
    import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

    const generalResolvers: Resolver = {
      Query: {
        getSignedUrlForUpload: async (parent, args) => {
          return await {
            fileName: args.file,
            url: getSignedUrlForUpload(args.file),
          };
        },
        getMultipleSignedUrlsForUpload: async (parent, args) => {
          return await Promise.all(
            args.files.map(async (file: string) => ({
              fileName: file,
              url: await getSignedUrlForUpload(file),
            }))
          );
        },
      },
      Mutation: {},
    };
    export { generalResolvers };
`;

writeFile(
  path.join(process.cwd(), `prisma/generated/models/general/resolvers.ts`),
  generalResolverFile
);
};
export { createResolvers };
