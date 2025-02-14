const fetch = require('node-fetch');
const initialize_url = 'https://api.chapa.co/v1/transaction/initialize';
const verify_url = 'https://api.chapa.co/v1/transaction/verify/';

/**
 *
 * @param {string} chapaKey
 */
function Chapa(chapaKey) {
  var chapaKey = chapaKey;

  /**
   * 
   * @param {object} initializeInfo customer information and customization
   * @returns {Promise}
   */
  this.initialize = function (initializeInfo) {
    const requiredParams = ['email','amount','first_name','last_name','tx_ref','currency'];
    let missingParams = [];

    missingParams = requiredParams.filter((key)=>!initializeInfo.hasOwnProperty(key))
    if(missingParams.length > 0) {
      throw new Error(`The initializeInfo has ${missingParams.length} missing required paramater '${[...missingParams]}'`)
    }  
    return new Promise((resolve, reject) => {
      fetch(initialize_url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + chapaKey,
        },
        body:JSON.stringify(initializeInfo)
      }).then(async(res)=>{
        if(res.status===200){
          resolve(await res.json())
        }else{
          reject(await res.json())
        }
      }).catch((error)=>{
        reject(error)
      })
    });
  };
  
  
  /**
   * 
   * @param {string} tnxRef 
   * @returns {Promise}
   */
  this.verify = function(tnxRef){
    if(!tnxRef) throw new Error('Transaction refrence is required!')
    return new Promise((resolve,reject)=>{
      fetch(verify_url+tnxRef, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + chapaKey,
        }
      }).then(async(res)=>{
        if(res.status===200){
          resolve(await res.json())
        }else{
          reject(await res.json())
        }
      }).catch((error)=>{
        reject(error)
      })
    })
  }
}

module.exports = Chapa;