// import { GQLModel } from '../types';
// import { unCapitalize } from './capitalize';
// import { writeFile } from './writeFile';
// import path from 'path';

// function betweenMarkers(text: string, begin: string, end: string) {
//   var firstChar = text.indexOf(begin) + begin.length;
//   var lastChar = text.indexOf(end);
//   var newText = text.substring(firstChar, lastChar);
//   return newText;
// }

// const createResolvers = async (model: GQLModel, parsedModels: GQLModel[]) => {
//   const relatedFields = model.fields.filter((f) => f.isRelatedModel);
//   const resolverFile = `
//   import { Resolver } from '../types';

//     const ${model.name}: Resolver = {
//     ${model.name}: {
//         ${relatedFields
//           .map((rf) => {
//             if (rf.isArray) {
//               const relatedModel = parsedModels.filter(
//                 (pm) => pm.name === rf.type
//               )[0];
//               const relatedModelRelation = relatedModel.fields.filter(
//                 (fld) => fld.type === model.name
//               )[0];
//               if (relatedModelRelation.isArray) {
//                 return `${rf.name}: async ({ source, db }) => {
//                   return await db.${unCapitalize(
//                     relatedModel.name
//                   )}.findMany({
//                     where: {
//                       ${relatedModelRelation.name}: {
//                         some: {
//                           id: {
//                             equals: source.id,
//                           },
//                         },
//                       },
//                     },
//                   });
//                 }`;
//               } else {
//                 //many to one
//                 return `${rf.name}: async ({ source, db }) => {
//                   return await db.${unCapitalize(rf.type)}.findMany({
//                   where: {
//                       ${
//                         relatedModel.fields.filter(
//                           (f) => f.type === model.name
//                         )[0].name
//                       }: {
//                         is: {
//                           id: {
//                             equals: source.id,
//                           },
//                         },
//                       },
//                     },
//                   })
//                 }`;
//               }
//             } else if (
//               //one to many
//               rf.attributes.length > 0 &&
//               rf.attributes[0].includes('fields')
//             ) {
//               const relatedField = betweenMarkers(
//                 rf.attributes[0],
//                 'fields:[',
//                 ']'
//               );
//               if (rf.required) {
//                 return `
//                 ${rf.name}: async ({ source, db }) => {
//                 return await db.${unCapitalize(rf.type)}.findUnique({
//                     where: {
//                     id: source.${relatedField},
//                     },
//                 });
//                 }
//                 `;
//               } else {
//                 return `
//                 ${rf.name}: async ({ source, db }) => {
//                   if (parent.${relatedField}) {
//                     return await db.${unCapitalize(rf.type)}.findUnique({
//                         where: {
//                         id: source.${relatedField},
//                         },
//                     });
//                   }
//                   else{
//                     return null;
//                   }
//                 }
//                 `;
//               }
//             } else {
//               //one to one
//               if (rf.attributes.length > 0) {
//                 const relationName = rf.attributes
//                   .filter((a) => a.includes('@relation'))[0]
//                   .split('"')[1];

//                 const relatedField = model.fields.filter(
//                   (f) =>
//                     f.attributes.filter((a) => a.includes(relationName))
//                       .length > 0
//                 )[0];
//                 const relatedModel = parsedModels.filter(
//                   (pm) => pm.name === relatedField.type
//                 )[0];
//                 const relatedModelRelation = relatedModel.fields.filter(
//                   (fld) => fld.type === model.name
//                 )[0];

//                 const relationFieldName = betweenMarkers(
//                   relatedModelRelation.attributes
//                     .filter((a) => a.includes('@relation'))[0]
//                     .split(',')
//                     .filter((a) => a.includes('fields'))[0],
//                   'fields:[',
//                   ']'
//                 );
//                 return `${rf.name}: async ({ source, db }) => {
//                   return await db.${unCapitalize(rf.type)}.findUnique({
//                     where:{
//                       ${relationFieldName}:source.id
//                     }
//                   })
//                 }`;
//               } else {
//                 return `${rf.name}: async ({ source, db }) => {
//                   return await db.${unCapitalize(rf.type)}.findUnique({
//                     where:{
//                       ${unCapitalize(model.name)}Id:source.id
//                     }
//                   })
//                 }`;
//               }
//             }
//           })
//           .join(',')}
//     },
//     Query: {
//         ${unCapitalize(model.name)}s: async ({db}) => {
//         return await db.${unCapitalize(model.name)}.findMany({});
//         },
//         ${unCapitalize(model.name)}: async ({ args, db }) => {
//         return await db.${unCapitalize(model.name)}.findUnique({
//             where: {
//             id: args.id,
//             },
//         });
//         },
//     },
//     Mutation:{
//       create${model.name}:async ({ args, db })=>{
//         return await db.${unCapitalize(model.name)}.create({
//           data:{...args.data, ${model.fields
//             .filter(
//               (rf) =>
//                 rf.type === 'DateTime' &&
//                 rf.name !== 'createdAt' &&
//                 rf.name !== 'updatedAt'
//             )
//             .map(
//               (el) => `${el.name}: new Date(args.data.${el.name}).toISOString()`
//             )
//             .join(',')} }
//         })
//       },
//       update${model.name}:async ({ args, db })=>{
//         return await db.${unCapitalize(model.name)}.update({
//           where:{
//             id:args.where.id
//           },
//           data:{...args.data, ${model.fields
//             .filter(
//               (rf) =>
//                 rf.type === 'DateTime' &&
//                 rf.name !== 'createdAt' &&
//                 rf.name !== 'updatedAt'
//             )
//             .map(
//               (el) =>
//                 `...(args.data.${el.name} && {${el.name}: new Date(args.data.${el.name}).toISOString()})`
//             )
//             .join(',')}}
//         })
//       },
//       delete${model.name}:async ({ args, db })=>{
//         return await db.${unCapitalize(model.name)}.delete({
//           where:{
//             id:args.where.id
//           }
//         })
//       },
//     }
//     },

//     export { ${model.name}Resolvers };

//     `;
//   await writeFile(
//     path.join(
//       process.cwd(),
//       `prisma/generated/graphql/${model.name.toLowerCase()}/resolvers.ts`
//     ),
//     resolverFile
//   );
// };

// export { createResolvers };
