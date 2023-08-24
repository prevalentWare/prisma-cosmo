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

const createDataLoaders = async (model: GQLModel, parsedModels: GQLModel[]) => {
  const relatedFields = model.fields.filter((f) => f.isRelatedModel);
  const listTypes:string[]=[]
  const resolverFile = `
    import { default as DataLoader } from 'dataloader';
    import { PrismaClient, ${relatedFields.map(i=> i.type.charAt(0).toUpperCase() + i.type.slice(1))}} from '@prisma/client'
    import { getDB } from '../../db';
    
  
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
            //many to many
              const ${rf.name}Loader = () =>
              async (ids: readonly string[]): Promise<(${rf.type.charAt(0).toUpperCase() + rf.type.slice(1)} | undefined)[]> => {
                const db = await getDB()     
                const ${rf.name}= await db.${unCapitalize(relatedModel.name)}.findMany({
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
                            return ${rf.name}.${relatedModelRelation.name}.some((i) => {
                                if (i.id === id) {list.push(${rf.name})}
                            });
                        });
                        return list
                      })
                    }
            `;
          } else {
            //many to one
            // // console.log(relatedModel.fields.filter((f) => f.type === model.name)[0])
            // relatedModel.fields.filter((f) => f.type === model.name).map((i,index)=>{
            //   console.log(i.attributes)
            //   console.log(index)
            // }
            //   )
            const attribute=relatedModel.fields.filter((f) => f.type === model.name)[0].attributes[0]
            const regex = /fields:\[(.*?)\]/;
            const match= regex.exec(attribute);
            let field
            if(match){field = match[1]}
            listTypes.push(rf.type.charAt(0).toUpperCase() + rf.type.slice(1))
            return `
                //many to one
            
                const ${rf.name}Loader = () =>async (ids: readonly string[]): Promise<(${rf.type.charAt(0).toUpperCase() + rf.type.slice(1)}[] | undefined)[]> => {
                  const db = await getDB()      
                  const ${rf.name}= await db.${unCapitalize(rf.type)}.findMany({
                            where: {
                                ${relatedModel.fields.filter((f) => f.type === model.name)[0].name}: {
                                  is: {
                                    id: { in: [...ids] }
                                  },
                                },
                              },
                            })
                            return ids.map((id)=>{
                              return ${rf.name}.filter(i=>i.${field}==id) 
                            })
                        }`;
          } 
          // return ${rf.name}.filter(i=>i.${unCapitalize(relatedModel.fields.filter((f) => f.type === model.name)[0].type)}Id==id) 
        } else if (
          //one to many
          rf.attributes.length > 0 &&
          rf.attributes[0].includes('fields')
        ) {
          const relatedField = betweenMarkers(
            rf.attributes[0],
            'fields:[',']'
          );
          return `
            //one to many
            const ${rf.name}Loader = () => async (ids: readonly string[]): Promise<(${rf.type.charAt(0).toUpperCase() + rf.type.slice(1)} | undefined)[]> => {
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
              'fields:[',']'
            );
            return `
            //one to one
            const ${rf.name}Loader = () => async (ids: readonly string[]): Promise<(${rf.type.charAt(0).toUpperCase() + rf.type.slice(1)} | undefined)[]> => {
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
            //one to one
            const ${rf.name}Loader = () => async (ids: readonly string[]): Promise<(${rf.type.charAt(0).toUpperCase() + rf.type.slice(1)} | undefined)[]> => {
              const db = await getDB()
              const ${rf.name}= await db.${unCapitalize(rf.type)}.findMany({
                      where:{
                        ${unCapitalize(model.name)}Id:{in:[...ids]}
                      }
                    })
                    return ids.map((id) => {
                      return ${rf.name}.find(${rf.name} => ${rf.name}.${unCapitalize(model.name)}Id == id)      
                    })
            }`;
          }
        }
      })
      .join('')}

  const ${unCapitalize(model.name)}DataLoader =  {
    ${relatedFields.map(i=>{
      // console.log(milist)
      // ${milist.find()}
      let typeName=i.type.charAt(0).toUpperCase() + i.type.slice(1)
      const verifyTypo= listTypes.find(i=> i==typeName)
      verifyTypo==typeName?typeName=typeName+'[]':typeName

      return`
       ${i.name}Loader: new DataLoader <string,${typeName} | undefined>(${i.name}Loader())`
    })}
    };    
    export { ${unCapitalize(model.name)}DataLoader };
      `;
  await writeFile(
    path.join(
      process.cwd(),
      `prisma/generated/aws/models/${model.name.toLowerCase()}/dataLoaders.ts`
    ),
    resolverFile
  );
};
export { createDataLoaders };
