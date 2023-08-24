
import { unCapitalize } from './capitalize';
import path from 'path';
import { writeFile } from './writeFile';



const createSessionConfig = async (gqlModels: any,parsedModels:any ) => {
  const list:any=[]
  parsedModels.flatMap((model:any)=>{
    const relatedFields = model.fields.filter((f:any) => {
      if(f.isRelatedModel) return f.name
    }).flatMap((i:any)=>{
      list.push(i.name)
      return i.name});
  })
  const unique = list.filter((value:any, index:any, array:any) => array.indexOf(value) === index);
    const baseFile = `  
  export const sessionConfig = {
    
    Parent:[
      ${unique.map((i:string)=>{
        return  ` { name: '${i}', roles: ['Admin'], isPublic: false } `
      })}
    ],
 Mutation:[ 
    ${gqlModels?.map((model: any) => `
    // ${model.name}
    { name: 'create${model.name}', roles: ['Admin'], isPublic: false },
    { name: 'update${model.name}', roles: ['Admin'], isPublic: false },
    { name: 'upsert${model.name}', roles: ['Admin'], isPublic: false },
    { name: 'delete${model.name}', roles: ['Admin'], isPublic: false }
  `)}
  
],


Query:[
    ${gqlModels?.map((model: any) => `
    // ${model.name}
    { name: '${unCapitalize(model.name)}s', roles: ['Admin'], isPublic: false },
    { name: '${unCapitalize(model.name)}', roles: ['Admin'], isPublic: false }
`)}
    ]
}
  `;
    await writeFile(
        path.join(process.cwd(), `prisma/generated/aws/sessionConfig/sessionConfig.ts`),
        baseFile
    );
};

export { createSessionConfig };
