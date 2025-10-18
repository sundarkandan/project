const bct=require('bcrypt')
async function disp(){
    const ch=await bct.hash('merit',10)
    console.log(ch)
}
disp()