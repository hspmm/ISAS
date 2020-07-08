/* Declare required npm packages */
var https = require('https');
var promise = require('promise');
//var request = require('request-promise');
var fetch = require('node-fetch');

/* Custom Error */
var customError = require('../errors/custom.error');

/* Imprivata Configuration */
// var imprivataConfig = {
//     serverHostName: 'https://172.16.20.83',
//     serverPort: 443,
//     apiPath: '/sso/ProveIDWeb/v14/AuthUser',
//     apiGetModalitiesPath: '/sso/ProveIDWeb/v14/Modalities',
//     apiVersion: '',
//     productCode: 'a47a5227-a83e-4b45-b2dc-353e52145134'
// };

// var httpPostOptions = {
//     host: imprivataConfig.serverHostName,
//     port: imprivataConfig.serverPort,
//     path: imprivataConfig.apiGetModalitiesPath,
//     method: 'GET',
//     headers: {
//         'Accept': 'text/xml',
//         'isx-client': 'name=CHE-1Sample&ip=172.168.1.20',
//         'isx-product': imprivataConfig.productCode
//     }
// };

// var options = {
//     uri: 'https://172.16.20.83:443/sso/ProveIDWeb/v14/Modalities',
//     headers: {
//         'Accept': 'text/xml',
//         'isx-client': 'name=CHE-1Sample&ip=172.168.1.20',
//         'isx-product': imprivataConfig.productCode
//     }
// }

/*
<summary> Helps to validate user credentials with Imprivata Password Based  </summary>
<param name="userDetails"> User Details </param>
<returns> Returns If Valid user, returns User's LDAP Group. Else return error </returns>
*/

async function ValidatePasswordUserCredentials(userDetails,imprivataConfig) {
    try {
        return new promise(
            function (res, rej) {  
                let index=userDetails.Username.indexOf('@');    
                let domainName=userDetails.Username.slice(index+1,userDetails.Username.length); 

                let bodyContent = '<Request><ModalityAuthInput modalityID="PWD"><AuthRequest><PasswordVerificationRequest><UserIdentity><Username>' + userDetails.Username + '</Username><Domain>' + domainName + '</Domain></UserIdentity><Password>' + userDetails.Password + '</Password></PasswordVerificationRequest></AuthRequest></ModalityAuthInput><CreateAuthTicket>true</CreateAuthTicket></Request>'

                //process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

                // SSL Selected
                let isSslSelected = imprivataConfig.IsSslSelected;                 
                // Protocol
                let protocol = (isSslSelected===true)?'https://':'http://';

                fetch(protocol+imprivataConfig.ServerHostName+':'+imprivataConfig.ServerPort+imprivataConfig.ApiPath+imprivataConfig.ApiVersion+'/AuthUser', {
                    method: 'post',
                    body: bodyContent,
                    headers: {
                        'Content-type': 'text/xml',
                        'Accept': 'text/xml',
                        'Content-Lenght': bodyContent.length,
                        'isx-client': 'name=CHE-1Sample&ip=172.168.1.20',
                        'isx-product': imprivataConfig.ProductCode
                    }
                }).then(res => res.text()).then(
                    function (response) {
                        res(response);
                    }
                ).catch(function (error) {
                    rej("Security Provider Connection Failed!!");
                });
            });

    } catch (error) {
        throw new customError.ApplicationError(error);
    }
}

/*
<summary> Helps to validate user credentials with Imprivata Card Based  </summary>
<param name="userDetails"> User Details </param>
<returns> Returns If Valid user, returns User's LDAP Group. Else return error </returns>
*/

async function ValidateCardUserCredentials(cardDetails,imprivataConfig) {
    try {
        return new promise(
            function (res, rej) {

                let bodyContent = '<Request><ModalityAuthInput modalityID="UID"><AuthRequest><UniqueID>' + cardDetails.UniqueId + '</UniqueID></AuthRequest></ModalityAuthInput><CreateAuthTicket>true</CreateAuthTicket><ResourceRequest id="1" method="GET" resource="Password" /></Request>'
                
                //process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

                // SSL Selected
                let isSslSelected = imprivataConfig.IsSslSelected;                 
                // Protocol
                let protocol = (isSslSelected===true)?'https://':'http://';

                fetch(protocol+imprivataConfig.ServerHostName+':'+imprivataConfig.ServerPort+imprivataConfig.ApiPath+imprivataConfig.ApiVersion+'/AuthUser', {
                    method: 'post',
                    body: bodyContent,
                    headers: {
                        'Content-type': 'text/xml',
                        'Accept': 'text/xml',
                        'Content-Lenght': bodyContent.length,
                        'isx-client': 'name=CHE-1Sample&ip=172.168.1.20',
                        'isx-product': imprivataConfig.ProductCode
                    }
                }).then(res => res.text()).then(
                    function (response) {
                        res(response);
                    }
                ).catch(function (error) {
                    rej("Security Provider Connection Failed!!");
                });
            });

    } catch (error) {
        throw new customError.ApplicationError(error);
    }
}


/*
<summary> Helps to get Domain name from Imprivata config  </summary>
<param name="userDetails"> User Details </param>
<returns> Returns if domain available in Imprivata  </returns>
*/

async function GetDomainNameFromImprivata(imprivataConfig) {
    try {
        return new promise(
            function (res, rej) {  
                //process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
                // SSL Selected
                let isSslSelected = imprivataConfig.IsSslSelected;                 
                // Protocol
                let protocol = (isSslSelected===true)?'https://':'http://';
                fetch(protocol+imprivataConfig.ServerHostName+':'+imprivataConfig.ServerPort+imprivataConfig.ApiPath+imprivataConfig.ApiVersion+'/Domains', {
                    method: 'get',
                    headers: {
                        'Content-type': 'text/xml',
                        'Accept': 'text/xml',
                        'isx-client': 'name=CHE-1Sample&ip=172.168.1.20',
                        'isx-product': imprivataConfig.ProductCode
                    }
                }).then(res => res.text()).then(
                    function (response) {
                        res(response);
                    }
                ).catch(function (error) {
                    rej("Security Provider Connection Failed!!");
                });
            });

    } catch (error) {
        throw new customError.ApplicationError(error);
    }
}

/*
<summary> Helps to Validate Imprivata information  </summary>
<param name="imprivataDetails"> Imprivata Details </param>
<returns> Returns validation Success or fail </returns>
*/

async function ValidateImprivataInformation(imprivataDetails) {
    try {
        return new promise(
            function (res, rej) {
                //process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;  

                fetch(imprivataDetails.url+'/Modalities', {
                    method: 'get',
                    headers: {
                        'Accept': 'text/xml',
                        'isx-client': 'name=CHE-1Sample&ip=172.168.1.20',
                        'isx-product': imprivataDetails.productCode
                    },
                    timeout:10000
                }).then(res => res.text()).then(
                    function (response) {
                        res(response);
                    }
                ).catch(function (error) {
                    rej("Security Provider Connection Failed!!");
                });
            });

    } catch (error) {
        throw new customError.ApplicationError(error);
    }
}



module.exports = {
    ValidatePasswordUserCredentials: ValidatePasswordUserCredentials,
    ValidateCardUserCredentials: ValidateCardUserCredentials,
    ValidateImprivataInformation:ValidateImprivataInformation,
    GetDomainNameFromImprivata:GetDomainNameFromImprivata
};