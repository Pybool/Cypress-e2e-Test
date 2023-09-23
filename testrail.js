var btoa = require('btoa');
const axios = require('axios');
const rateLimit = require('axios-rate-limit');
const path = require('path')
const fs = require('fs')
const yargs = require('yargs')

const argv = yargs
  .option('init',{
    describe:'Initilize Exporter',
    type:'boolean',
    default:false
  })
  .argv;
require('dotenv').config()
const envFIle=process.env
const options = {
  username: envFIle.TESTRAIL_USERNAME,
  password: envFIle.TESTRAIL_PASSWORD,
  url: envFIle.TESTRAIL_URL
}
const projectId = envFIle.TESTRAIL_PROJECTID
const testrailPlan = envFIle.TESTRAIL_PLAN
const suiteId = envFIle.TESTRAIL_SUITEID
const TEST_STEP_DIR_PATH = envFIle.TEST_STEP_DIR_PATH
const auth = btoa(options.username + ":" + options.password);
const opt = { headers: { "Authorization": `Basic ${auth}` } };
var topDir = []
var sectionsList = []

async function createTestRun() {
   await getsectionsList()
  //  let response = await axios.get(`${options.url}/index.php?/api/v2/get_plans/${projectId}`,opt)
  //  console.log(response.data)
    const response = await axios.post(
      `${options.url}/index.php?/api/v2/add_plan_entry/${testrailPlan}`,
      {
        suite_id: suiteId,
        name: `Daily Test Run Res 2 Frontend- ${new Date().toLocaleDateString()}`,
        include_all: true,
      },
      {
        auth: {
            username: options.username,
            password: options.password,
        },
      },
    );
    return response.data.runs[0].id;
    
  }

  async function getsectionsList(){
    sectionsList = []
    var res=await axios.get(`${options.url}/index.php?/api/v2/get_sections/${projectId}&suite_id=${suiteId}`,opt);
        for(let i=0; i< res.data.sections.length;i++){
          sectionsList.push(res.data.sections[i])
        }      
        return
  }

  function getsectionsListpromise(){
    return new Promise(async(resolve,reject)=>{
      const sectionList = []
      var res=await axios.get(`${options.url}/index.php?/api/v2/get_sections/${projectId}&suite_id=${suiteId}`,opt);
          res.data.sections.forEach((section)=>{
              sectionList.push(section)
          })        
          resolve(sectionList)
    })
  }

  function getSectionObject(arr,name){
    return arr.find((section) => section.name == name)
  }
  const extractSectionId = ((_case,exists=false)=>{
    if(exists){
      
    }
    else{
      const section = getSectionObject(sectionsList,_case.title.split(" ")[1])
      //Split by space to get environment Format: On "env" ...
      return section.id
    }
  })
  async function createCaseAndPublishResult(test,runId){
    // test[0].elements returns an array of Scenarios, get the first in array and extract environment
    console.log(test)
    await getsectionsList()
    if(test.length > 0){
      const testEnvironment = test[0].uri.replaceAll("."," ")
    const section = getSectionObject(sectionsList,testEnvironment)
 
    if(section==undefined){
      //Create a new section if it doesn't already exist
        var response = await axios.post(
          `${options.url}/index.php?/api/v2/add_section/${projectId}`,{"suite_id":suiteId,"name":testEnvironment},opt
        );
        await getsectionsList() //Update sections list
        var response = await axios.get(
          `${options.url}/index.php?/api/v2/get_cases/${projectId}&suite_id=${suiteId}&section_id=${section.id}`,opt
        );
      
    }

    else{
      
      var response = await axios.get(
        `${options.url}/index.php?/api/v2/get_cases/${projectId}&suite_id=${suiteId}&section_id=${section.id}`,opt
      );
    }

    
    let genratedCase=generateEachCase(test)
    // console.log("Generated case ----> ", genratedCase)
    var cases
 
    for(i=0;i<genratedCase.length;i++){
      
      while(1){
        cases=response.data.cases.filter(function(v){
          return v.title===genratedCase[i][0].title ;
        })

        if(cases.length>0 || response.data._links.next==null){
          break;
          
        }else{
          response = await axios.get(
            `${options.url}/index.php?${response.data._links.next}`,opt
          );
        }
      }
      if(cases.length > 0){
        await axios.post(`${options.url}/index.php?/api/v2/update_case/${cases[0].id}`,genratedCase[i][0],opt)
        await publishTestRun(cases[0].id,genratedCase[i][1],runId)
        
      }
      else{
        try{
          // console.log("Adding cases ----> ", section.id)
          let resp = await axios.post(`${options.url}/index.php?/api/v2/add_case/${section.id}`,genratedCase[i][0],opt)
          await publishTestRun(resp.data.id,genratedCase[i][1],runId)
          
          
          
        }
        catch(err){
          
        }
      }
    
      
      
    }
    }
    
    
  }
  function generateEachCase(test){
    let cases=[];
    var i=0;
    if (test.length > 0){
      test[0].elements.forEach(element=>{
        let steps=[];
        let duration=0;
        let status=true;
        element.steps.forEach(step=>{
          let additional_info=step.result.status;
          duration+=step.result.duration
          if(step.result.status=="failed" || step.result.status =="pending"){
            status=false
            additional_info=additional_info + "=>"+step?.result?.error_message
          } 
          if(step.name!=""){
            steps.push({
              "content":step.keyword+" "+step.name,
              "expected":additional_info,
              "additional_info":additional_info,
              "refs":""
            })
          }
        })
        i++;
        cases.push([{
          "title": element.name+i,
          "type_id": 1,
          "priority_id": 3,
          //"estimate": parseInt(duration/60000000).toString()+"m",
          "refs": "",
          "template_id": 2,
          "custom_steps_separated": steps
        },status])
      })
    }
    
    return cases;
  }
  async function publishTestRun(caseIds,statusId,runId) {
    var statId
    if(statusId){
      statId=1;
    }else{
      statId=5;
    }
     try{
      await axios.post(
        `${options.url}/index.php?/api/v2/add_results_for_cases/${runId}`,
        {
          "results": [
            {
              "case_id": caseIds,
              "status_id": statId,
              "comment": "",
              "defects": ""
        
            }
          ]
        },opt 
      );  
    }catch(e){
      throw new Error("Unable to add run cast to testrail"+runId)
    }
     
    
  } 
  exports.cleanDirectory=()=>{
    let resultDir="cypress/cucumber-json/";
    fs.readdirSync(resultDir).forEach(v=>fs.rmSync(resultDir+v))
  }
  const exportTest=   async (createDirs)=>{
    console.log(`[TEST EXPORTER :] ${new Date().toLocaleDateString()}: Starting Export`)
    let resultDir="cypress/cucumber-json/"
    let allFiles=[]
    if(fs.existsSync(resultDir)){
      allFiles=fs.readdirSync(resultDir)
          let runId=await createTestRun();
          for(const file of allFiles){ 
            try{
              if(file.includes('cucumber.json')){
    
              let file_location=JSON.parse(fs.readFileSync(resultDir+file))
               if(createDirs){
               }
               else{
                if (argv.init_) {
                  getPath(file_location)
                  console.log("File location", file_location)
                }
                if (argv.export) {
                  getPath(file_location)
                  console.log("File location", file_location)
                  await createCaseAndPublishResult(file_location,runId)
                }
               }
              }
            }catch(e){
              throw e
            }
            
          }
          
          try{
            
              if(createDirs){
                const topDirs = getTopDirs(allFiles,resultDir)
                if(topDirs.length > 0){
                  createTopDirs()
                }
              
            }
            
            
          }catch(e){
              
            throw e
          }
            
          
          console.log(`[TEST EXPORTER :] ${new Date().toLocaleDateString()}: Exported ${allFiles.length - 1} files`)

      }else{
          throw new Error("No File to export")
      }
    
    
}

function findFile(filePath, fileName){
    
  const files = fs.readdirSync(filePath)

  for(const file of files){
      const currentPath = path.join(filePath,file)
      const stat = fs.statSync(currentPath);
      if(stat.isDirectory()){
          const foundFile = findFile(currentPath,fileName);
          if(foundFile){return foundFile;}
      }
      else if(file === fileName){return currentPath;}
  }
  return null;
}

 function getPath(testcase){
  console.log(testcase)
  const directoryPath = TEST_STEP_DIR_PATH;
  if(testcase[0]?.uri != undefined){
    const filename = testcase[0]?.uri

    const filePath = findFile(directoryPath,filename).split("steps/")[1];


    if (filePath){
        let dirs = filePath.split("/")
        dirs.forEach((folder)=>{
            if(folder.includes(".feature")){
                dirs.push(folder.replaceAll("."," "))
            }
        })
        try{
          createDirectoryTree(dirs)
        }
        catch{}
    }
  }
}

function getTopDirs(allFiles,resultDir){
  allFiles.forEach((file)=>{
    if(file.includes('cucumber.json')){
  
      let testcase=JSON.parse(fs.readFileSync(resultDir+file))
      const directoryPath = TEST_STEP_DIR_PATH;
      if(testcase[0]?.uri != undefined){
        const filename = testcase[0]?.uri
        const filePath = findFile(directoryPath,filename).split("steps/")[1];
        if (filePath){
            let dirs = filePath.split("/")
            dirs.forEach((folder)=>{
                if(folder.includes(".feature")){
                }
                else{
                    topDir.push(folder)
                }
            })
          }
      }
    }
  })
  return topDir
  
}

async function createTopDirs(){

  getsectionsList()
  const set = new Set(topDir);
  topDir = Array.from(set)
  console.log("First level sections ======> ", topDir,sectionsList)
  for(let i = 0 ; i < topDir.length;i++){
    const section = getSectionObject(sectionsList, topDir[i]);
    if(section == undefined){
      let response = await axios.post(
        `${options.url}/index.php?/api/v2/add_section/${projectId}`,
        { "suite_id": suiteId, "name": topDir[i] },
        opt
      );
    }
  }

}


async function createDirectoryTree(paths) {
  
  await getsectionsList()
  let topSectionExists;
  let ids = [];
  const section = getSectionObject(sectionsList, paths[0]);
  let path = paths[0];


  if (section === undefined) {
    if (paths.indexOf(path) === 0) {
      topSectionExists = false;
    }

    if (topSectionExists === false) {
      
      let parent_id;

      for (let i = 0; i < paths.length; i++) {
        const _path = paths[i];
        let response;

        if (i === 0) {
          let response = await axios.post(
            `${options.url}/index.php?/api/v2/add_section/${projectId}`,
            { "suite_id": suiteId, "name": _path },
            opt
          );
          parent_id = response.data.id;
          ids.push(parent_id);

        } else {
          if(getSectionObject(sectionsList, _path)==undefined){
            response = await axios.post(
              `${options.url}/index.php?/api/v2/add_section/${projectId}`,
              { "suite_id": suiteId, "name": _path, "parent_id": parent_id },
              opt
            );
            parent_id = response.data.id;
            ids.push(parent_id);
          }
          
        }

        await getsectionsList();
     
      }
      await getsectionsList()
    }
  } else {
    await getsectionsList()
    if(section.parent_id == null){
      ids.push(section.id)
    }
    if (section.parent_id == null) {
      // Do something with the existing section
      for (let i = 1; i < paths.length; i++) {
        const _path = paths[i];
        let response;

        if(getSectionObject(sectionsList, _path)==undefined){
          response = await axios.post(
            `${options.url}/index.php?/api/v2/add_section/${projectId}`,
            { "suite_id": suiteId, "name": _path, "parent_id": ids[ids.length - 1] },
            opt
          );

          const parent_id = response.data.id;
          ids.push(parent_id);
          await getsectionsList();
        }
      }
      await getsectionsList()
    }
  }
}

async function deleteSections(){
  await getsectionsList()
  sectionsList.forEach(async(section)=>{
    response = await axios.post(
      `${options.url}/index.php?/api/v2/delete_section/${section.id}`,
      { },
      opt
    );
  })
}
console.log(argv)
try{
  
  if (argv.delete) {
    deleteSections()
  }

  if (argv.init) {
    exportTest(true)
  }

  if (argv.export || argv.init_) {
    exportTest(false)
  }
}
catch{}