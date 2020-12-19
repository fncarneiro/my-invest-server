const investments = require('../models/investments')

module.exports = app => {
    app.get('/investments', function (req, res) {

        fs.readFile('data/investment.json', 'utf8', function (err, data) {
            if (err) {
                return console.log("Error reading file.");
            } else {                       
                res.send(data)
            }
        })
    })

    app.post('/investments', function (req, res) {
        const investment = req.body;
        investments.createInvestment(investment);
        res.send('Post Investment.');        
    })

    app.delete('/investment', function (req, res) {
        rewrite(req); 
        res.send(true);  
    })
    
    function rewrite(data) {
        //JsonData = JSON.stringify(data);
        JsonData = 'DELETED'
        fs.writeFile('data/investment.json', JsonData, function (err) {
            if (err) {
                return console.log("Error writing file.");
            }
        })
    }
}
