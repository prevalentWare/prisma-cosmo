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
  import { checkSession } from "../../auth/checkSession";
  
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
                ${rf.name}: async (parent, args, { db, session }) => {
                  const check = await checkSession( {session,resolverName:"${rf.name}",resolverType:"Parent"})
                  if (check?.auth) {
                    ${unCapitalize(model.name)}DataLoader.${rf.name}Loader.clearAll()
                    return await ${unCapitalize(model.name)}DataLoader.${rf.name}Loader.load(parent.id);
                  }  
                  return null;
                }
                `
              } else {
                //many to one
                return `
                ${rf.name}: async (parent, args, { db,session }) => {
                const check = await checkSession( {session,resolverName:"${rf.name}",resolverType:"Parent"})
                if (check?.auth) {
                ${unCapitalize(model.name)}DataLoader.${rf.name}Loader.clearAll()
                return await ${unCapitalize(model.name)}DataLoader.${rf.name}Loader.load(parent.id);
                }  
                return null;
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
                ${rf.name}: async (parent, args, { db, session }) => {
                const check = await checkSession( {session,resolverName:"${rf.name}",resolverType:"Parent"})
                if (check?.auth) {
                ${unCapitalize(model.name)}DataLoader.${rf.name}Loader.clearAll()  
                return await ${unCapitalize(model.name)}DataLoader.${rf.name}Loader.load(parent.${relatedField});
                }  
                return null;
                }
                `
              } else {
                return `
                ${rf.name}: async (parent, args, { db,session }) => {
                  if (parent.${relatedField}) {
                    const check = await checkSession( {session,resolverName:"${rf.name}",resolverType:"Parent"})
                    if (check?.auth) {
                    ${unCapitalize(model.name)}DataLoader.${rf.name}Loader.clearAll()   
                    return await ${unCapitalize(model.name)}DataLoader.${rf.name}Loader.load(parent.${relatedField});
                    }
                    return null;
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
                return `${rf.name}: async (parent, args, { db, session }) => {
                  const check = await checkSession( {session,resolverName:"${rf.name}",resolverType:"Parent"})
                  if (check?.auth) {
                  ${unCapitalize(model.name)}DataLoader.${rf.name}Loader.clearAll()   
                  return await ${unCapitalize(model.name)}DataLoader.${rf.name}Loader.load(parent.${relatedField});
                  }
                  return null
                }`;
              } else {
                return `${rf.name}: async (parent, args, { db,session }) => {
                  const check = await checkSession( {session,resolverName:"${rf.name}",resolverType:"Parent"})
                  if (check?.auth) {
                  ${unCapitalize(model.name)}DataLoader.${rf.name}Loader.clearAll()  
                  return await ${unCapitalize(model.name)}DataLoader.${rf.name}Loader.load(parent.id);
                  }
                  return null
                }`;
              }
            }
          })
          .join(',')}
    },
    Query: {
        ${unCapitalize(model.name)}s: async (parent, args, { db,session }) => {
        const check = await checkSession( {session,resolverName:"${unCapitalize(model.name)}s",resolverType:"Query"})
        if (check?.auth) {
         return await db.${unCapitalize(model.name)}.findMany({});
        }
        return Error(check?.error);
        },
        ${unCapitalize(model.name)}: async (parent, args, { db, session }) => {
        const check = await checkSession( {session,resolverName:"${unCapitalize(model.name)}",resolverType:"Query"})
        if (check?.auth) {
          return await db.${unCapitalize(model.name)}.findUnique({
              where: {
              id: args.id,
              },
          });
        }
        return Error(check?.error);
        },
    },
    Mutation:{
      create${model.name}:async (parent, args, { db,session })=>{
        const check = await checkSession( {session,resolverName:"create${model.name}",resolverType:"Mutation"})
        if (check?.auth) {
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
      }
      return Error(check?.error);

      },
      update${model.name}:async (parent, args, { db, session })=>{
        const check = await checkSession( {session,resolverName:"update${model.name}",resolverType:"Mutation"})
        if (check?.auth) {
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
        }
        return Error(check?.error);  
      },
      upsert${model.name}:async (parent, args, { db,session })=>{
        const check = await checkSession( {session,resolverName:"upsert${model.name}",resolverType:"Mutation"})
        if (check?.auth) {
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
      }
      return Error(check?.error); 
      },
    
      delete${model.name}:async (parent, args, { db, session })=>{
        const check = await checkSession( {session,resolverName:"delete${model.name}",resolverType:"Mutation"})
        if (check?.auth) {
          return await db.${unCapitalize(model.name)}.delete({
            where:{
              id:args.where.id
            }
          })
        }
        return Error(check?.error);

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
