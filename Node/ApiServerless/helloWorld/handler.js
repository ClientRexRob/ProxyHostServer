'use strict';


const { Lambda } = require('aws-sdk');
var AWS = require("aws-sdk");
const { MessageChannel,receiveMessageOnPort } = require('worker_threads');
const {port1,port3001 } = new MessageChannel();

const lambda = new Lambda({
  apiVersion:'2015-03-31',
  endpoint: process.env.SOME_VARIABLE
  ?'http://localhost:3002'
  :'https://lambda.us-east-1.amazonaws.com',
})
const establishConnection = (url,connectionId)=>
new Promise((resolve,reject) =>{
  let apigatewaymanagementapi = new AWS.ApiGatewayManagementApi({
    apiVersion: '2018-11-29',
    endpoint: url
  })
  apigatewaymanagementapi 
},
 (err, data)=>{
  if(err){
    console.log('err is',err);
    reject(err);
  }
  resolve(data);
});

const sendMessageToClient = (url,connectionId,payload)=> 
new Promise((resolve,reject) => {
  let apigatewaymanagementapi = new AWS.ApiGatewayManagementApi({
    apiVersion: '2018-11-29',
    endpoint: url
  });
  apigatewaymanagementapi.postToConnection({
    ConnectionId: connectionId,
    Data: JSON.stringify(payload),
  },
  (err, data)=>{
    if(err){
      console.log('err is',err);
      reject(err);
    }
    resolve(data);
  })
});
module.exports.connectionHandler = async (event,target)=>{
target.identity = 
target = {data:target.identity};
console.log(target);
}
module.exports.disconnectHandler = async (event,context) =>{

}

module.exports.defaultHandler = async (event,payload) =>{
  payload = {data:event.body};
  const domain = event.requestContext.domainName;
  const stage = event.requestContext.stage;
  const connectionId = event.requestContext.connectionId;
  const callbackUrlForAWS = (`http://${domain}:3001`);
  const msg = await sendMessageToClient(callbackUrlForAWS,connectionId,payload);
  return{
    statsCode:200,
    message: payload
  }
}
module.exports.helloHandler = async (event,payload) =>{
  //const body = JSON.stringify(event,null,2);
  //const response= await lambda.invoke(body).promise();
  payload= JSON.stringify({data:event.body});
  console.log(payload);
  return{
    statusCode:200,
    data:payload
  };
};
module.exports.helloPost = async(event, context)=>{
    context = {
      FunctionName: "helloPost",//'helloworld-dev-hello',
      InvocationType: 'RequestResponse',
      Payload: JSON.stringify({data:event.body}),
  };
   await lambda.invoke(context).promise();
};
module.exports.hello = async (event,context)=> {
    //console.log("Hello World");
    //return {"Hello":"World"};
    
    context = {
    FunctionName: "hello",//'helloworld-dev-hello',
    InvocationType: 'RequestResponse',
    Payload: JSON.stringify({data:event.body}),
  }
  const response = await lambda.invoke(context).promise();
  return response;
  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  //return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
