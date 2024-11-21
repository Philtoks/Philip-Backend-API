
import jsonUsers from '../user.json' with {type: "json"}; 

const getAllProducts = (req, res) => {
    res.status(200).json(jsonUsers);
}


const createProducts = (req, res) => {
    const user = req.body;
    if(!user){
        return res
            .status(400)
            .json({success:false, message: 'Please provide an id and name'})
    }
    res.status(201).json({success: true, data: [...jsonUsers, user]});
    jsonUsers.push({...user, lastName: 'Carlos'});
}

const updateProducts = (req, res) => {
    const {ID} = req.params;
    const {name} = req.body;
    const person = jsonUsers.find((item) => item.id === Number(ID));
    if(!person){
        return res
            .status(400)
            .json({success:false, message: `Sorry the user id ${ID} doesnt exist`});
    }
    const newPerson = jsonUsers.map((item) => {
        if(item.id ===Number(ID)){
            item.name = name;
        }
        return item;
        })
        res.status(201).json({success: true, data: newPerson});
}
const getOneProduct = (req, res) => {
    
    const userID =  req.params.ID;
    const newUsers = jsonUsers.find((item) => item.id === Number(userID));
    res.status(200).json(newUsers);
}

const deleteProducts = (req, res) => {
    const userID = req.params.ID;
    const person = jsonUsers.find((item) => item.id === Number(userID));
    if(!person){
        return res
            .status(400)
            .json({success:false, message: `Sorry the user id ${userID} doesnt exist`});
    }
    let newProduct = jsonUsers.filter((item) => {
    return item.id !== Number(userID)});
   // jsonUsers = [,...userID];
    res.status(200).json({sucess: true, data: newProduct});
}

export {getAllProducts,  getOneProduct, createProducts, updateProducts, deleteProducts};