const fs = require('fs');
const basePath = process.argv[2];

(async ()=>{
    var shapes01 = await fs.readFileSync(path.join(__dirname,`../autotest005/${basePath}/shapes01.svg`, 'utf-8'));
    var shapes02 = await fs.readFileSync(path.join(__dirname,`../autotest005/${basePath}/shapes02.svg`, 'utf-8'));

    try{
        shapes01 === shapes02
        process.exit(0)
    } catch(error){
        console.log({error})
        process.exit(1)
    }
})
