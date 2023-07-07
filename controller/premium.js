const User = require('../models/user');
const Expense = require('../models/expense');
const sequelize = require('../util/database');
//const e = require('express');
const getUserLeaderBoard = async (req, res) => {
    console.log('inside a premum controller')
    try{
        const leaderboardofusers = await User.findAll({
            attributes: ['id', 'name',[sequelize.fn('sum', sequelize.col('expenses.expense')), 'total_cost'] ],
            include: [
                {
                    model: Expense,
                    attributes: []
                }
            ],
            group:['user.id'],
            order:[['totalExpenses', 'DESC']]

        })
       console.log(JSON.stringify(leaderboardofusers+'xcvbnm,'))

        res.status(200).json(leaderboardofusers)

} catch (err){
    console.log(err)
    res.status(500).json(err)
}
}

module.exports = {
    getUserLeaderBoard
}








// const getUserLeaderBoard = async (req, res) => {
//     try{
//         const leaderboardofusers = await User.findAll({
         
//             order:[['totalExpenses', 'DESC']]

//         })
       
//         res.status(200).json(leaderboardofusers)
    
// } catch (err){
//     console.log(err)
//     res.status(500).json(err)
// }
// }

// module.exports = {
//     getUserLeaderBoard
// }