var express = require('express');
var csv = require("fast-csv");
var router = express.Router();
var fs = require('fs');

var mongoose = require('mongoose');

var Agent = mongoose.model('Agents');
var User = mongoose.model('Users');
var UserAccount = mongoose.model('UserAccounts');
var PolicyCarrier = mongoose.model('PolicyCarriers');
var PolicyCategory = mongoose.model('PolicyCategorys');
var PolicyInfo = mongoose.model('PolicyInfos');

var csvfile = __dirname + "/../public/files/sample.csv";
var stream = fs.createReadStream(csvfile);


/* GET home page. */
router.get('/', function(req, res, next) {

    res.render('index', { title: 'InsuredMines|Assignments' });

}).get('/import', function(req, res, next) {

    var  agents  = []
    var csvStream = csv()
        .on("data", function(data){
         
         var item = new Agent({
              name: data[0]
         });
          var userInfo = new User({
              firstname: data[16],
              Dob: data[23],
              address: data[20],
              phoneNumber: data[19],
              state: data[21],
              email: data[14],
              userType: data[1],
          });
          var userAccount = new UserAccount({
              AccountName: data[13]
          });
          var policyCarrier = new PolicyCarrier({
              company_name: data[8]
          });
           var policyCategory = new PolicyCategory({
               policyCategory: data[9]
           });

           var policyinfo = new PolicyInfo({
               PolicyStartDate:data[10],
               PolicyEndDate:data[11],
               PolicyMode:data[2],
               PolicyNumber:data[4],
               PolicyType:data[7]
           });
          item.save(function(error){
            console.log(item);
              if(error){
                   throw error;
              }
          }); 

           userInfo.save(function (error) {
               console.log(userInfo);
               if (error) {
                   throw error;
               }
           });
            userAccount.save(function (error) {
                console.log(userAccount);
                if (error) {
                    throw error;
                }
            });
             policyCarrier.save(function (error) {
                 console.log(policyCarrier);
                 if (error) {
                     throw error;
                 }
             });
              policyCategory.save(function (error) {
                  console.log(policyCategory);
                  if (error) {
                      throw error;
                  }
              });

              policyinfo.save(function (error) {
                  console.log(policyinfo);
                  if (error) {
                      throw error;
                  }
              });

    }).on("end", function(){

    });
  
    stream.pipe(csvStream);
    res.json({success : "Data imported successfully.", status : 200});
     
  }).get('/fetchdata', function(req, res, next) {

    var arr = [];
    var query = Agent.find({});
    query.exec(function (err, agent) {
        if (err) return handleError(err);
        arr[0] = agent;
    });
    var query2 = User.find({});
    query2.exec(function (err, user) {
        if (err) return handleError(err);
         arr[1]=user;
         
      
    });


    var query3 = UserAccount.find({});
    query3.exec(function (err, UserAccount) {
        if (err) return handleError(err);
        arr[2] = UserAccount;
    });

    var query4 = PolicyCarrier.find({});
    query4.exec(function (err, PolicyCarrier) {
        if (err) return handleError(err);
         arr[3] = PolicyCarrier;
});


var query6 = PolicyInfo.find({});
query6.exec(function (err, PolicyInfo) {
    if (err) return handleError(err);
    arr[4] = PolicyInfo;
    console.log(PolicyInfo);
});

    
    var query5 = PolicyCategory.find({});
    query5.exec(function (err, PolicyCategory) {
        if (err) return handleError(err);
         arr[5] = PolicyCategory;
        console.log(arr);
        res.json({
            data: arr
        });
    });
    console.log(arr);
    
  
}).get('/addpolicyinfo', function (req, res) {
    console.log('add');
    res.render('AddpolicyInfo');

}).post('/addpolicyinfodata', function (req, res) {

    var obj = JSON.stringify(req.body);

    var jsonObj = JSON.parse(obj);
    var policyinfo = new PolicyInfo({
        PolicyStartDate: jsonObj.PolicyStartDate,
        PolicyEndDate: jsonObj.PolicyEndDate,
        PolicyNumber: jsonObj.PolicyNumber,
        PolicyMode: jsonObj.PolicyMode,
        PolicyType : jsonObj.PolicyType,
        users: [{
            _id: new mongoose.Types.ObjectId()
        }],
        category: [{
            _id: new mongoose.Types.ObjectId()
        }]
        ,
        carrier: [{
            _id: new mongoose.Types.ObjectId()
        }]
    
        
    });

    console.log(policyinfo);
    

    policyinfo.save(function (error) {
        console.log(policyinfo);
        if (error) {
            throw error;
        }
    });
    

});
module.exports = router;
