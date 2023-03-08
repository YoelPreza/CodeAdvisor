const firebase = require("../db/db");
const { getUserData, getAdvisorData } = require("../handlers/filtersData");
const { User } = require("../models/Users");
const firestore = firebase.firestore();
///////////////////--Data--\\\\\\\\\\\\\\\\\\\\\\\\\
const dataTechSkills = [
    'JS', 'PY', 'Java', 'Ruby', 'CSS', 'PHP', 'C++', 'C#', 'C', 'HTML'
]
const dataCountries = [
    'Argentina', 'Bolivia', 'Brazil', 'Canada', 'Colombia', 'Chile', 'Mexico', 'Paraguay', 'Peru', 'U.S.A.', 'U.K.',
]

///////////////////--Users--\\\\\\\\\\\\\\\\\\\\\\\\\
const getUsers = async (req, res, next) => {
    try {
        const fire =  await firestore.collection(`/User`)
        const data = await fire.get();
        let yo = []
        data.forEach((x) =>{
            const user = new User(
                x.id, 
                x.data().NickName,
                x.data().Img, 
                x.data().Firstname, 
                x.data().Lastname, 
                x.data().About
            )

            if(x.data().status === true) yo.push(user)
        })
        res.status(200).send(yo)
    } catch (error) {
        res.status(404).send(error.message)
    }
}

///////////////////--User--\\\\\\\\\\\\\\\\\\\\\\\\\
const getUser = async (req, res, next) => {
    console.log("get_User");

    const Uid = req.params.Uid
    let user = false
    let advisor = false
    try {
        const fireUser      = await firestore.collection("User").doc(Uid);
        const fireAdvisor   = await firestore.collection("Advisors").doc(Uid);
        const dataUser      = await fireUser.get();
        const dataAdvisor   = await fireAdvisor.get();
        if(dataAdvisor.exists) advisor = dataAdvisor.data()
        if(!dataUser.exists) res.status(404).send(`User with id: ${Uid}. Does not exist`)
        else {
            user = dataUser.data()
            res.status(200).send({user, advisor})
        }
    } catch (error) {
        res.status(404).send(error.message)
    }
}
const addUser = async (req, res, next) => {
    console.log("add_User");

    const Uid = req.body.Uid;
    const user = {
        status      : true,
        NickName    : req.body.NickName     ,
        Img         : req.body.Img          ||"https://firebasestorage.googleapis.com/v0/b/pf-beta-ang31.appspot.com/o/descarga.jfif?alt=media&token=f56c1b89-0d71-4348-8036-f92b06883be1",
        Firstname   : req.body.Firstname    ,
        Lastname    : req.body.Lastname     || " ",
        About       : req.body.About        || " "
    }
    if (!req.body.Uid || req.body.Uid.length < 1)             res.status(400).send(`User no login`);
    else if(!req.body.NickName ||user.NickName.length < 1)    res.status(400).send(`NickName empty`);
    else if(!req.body.Firstname ||user.Firstname.length < 1)  res.status(400).send(`Firstname empty`);
    else {
        try {
            await firestore.collection('User').doc(Uid).set(user);
            res.send(`User: ${user.NickName}. Succefull`);
        } catch (error) {
            res.status(400).send(error.message);
        } 
    }
}
const updateUser = async (req, res, next) => {
    const Uid = req.params.Uid;
    const data = req.body;
    if(req.body.NickName.length < 1)        res.status(400).send(`NickName empty`);
    else if(req.body.Firstname.length < 1)  res.status(400).send(`Firstname empty`);
    else {
        try {
            const user =  await firestore.collection('User').doc(Uid);
            await user.update(data);
            res.send(`User has been modified`);        
        } catch (error) {
            res.status(400).send(error.message);
        }
    }
}

///////////////////--User-Advisor--\\\\\\\\\\\\\\\\\\\\\\\\\
const addUserAdvisors = async (req, res, next) => {
    console.log("add_User_Advisors");

    const Uid    = req.params.Uid
    const data   = req.body;
    const dataUser = await getUserData(Uid)
    const answer = await getAdvisorData(Uid)

    console.log(data);
    if ( true/*answer === "Advisor available"*/) {
        console.log(answer);

        if(!req.body.Specialty)         res.status(400).send("error: Specialty empty")
        else if(!req.body.TechSkills)   res.status(400).send("error: TechSkills empty")
        else if(!req.body.Language)     res.status(400).send("error: Language empty")
        else if(!req.body.Price)        res.status(400).send("error: Price empty")
        else if(!req.body.Residence)    res.status(400).send("error: Residence empty")
        else{
            let residence = false
            let ts = 0
            let tsl = req.body.TechSkills.length
            dataTechSkills.map(x => {
                req.body.TechSkills.map(z => {
                    if(z === x) ts++
                })
            })
            dataCountries.map(x => {
                if(x === req.body.Residence) residence = true
            })
            if(ts != tsl) res.status(404).send("error: invalid TechSkills")
            else if(residence === false)res.status(400).send("error: Residence invalid ")
            else if(req.body.Specialty != "Advisor" && req.body.Specialty != "Freelance")res.status(400).send("error: Specialty invalid ")
            else if(req.body.Language != "English" && req.body.Language != "Spanish")res.status(400).send("error: Language invalid ")
            else{
                try {
                    const advisor = {
                        NickName:   dataUser.data().NickName,
                        Firstname:  dataUser.data().Firstname,
                        Lastname:   dataUser.data().Lastname,
                        Img:        dataUser.data().Img,
                        About:      req.body.About || " empty ",
                        TechSkills: req.body.TechSkills,
                        Specialty:  [req.body.Specialty],
                        Language:   [req.body.Language],
                        Price:      req.body.Price,
                        Residence:  req.body.Residence
                    }
                    const autor =  await firestore.collection('User').doc(Uid);
                    await autor.update({statusAdvisor: true});
                    await firestore.collection("Advisors").add(data);
                    console.log(advisor);
                    res.send(`Advisor ${dataUser.data().NickName} Successfuly`);
                } catch (error) {
                    res.status(400).send(error.message);
                }  
            }
            
        }
    } else {
        res.status(404).send(answer)
    }
};
const updatUserAdvisors = async (req, res, next) => {
    console.log("update_User_Advisors");
    const Uid = req.params.Uid;
    const data = req.body;
    try {
        const advisor =  await firestore.collection('Advisors').doc(Uid);
        await advisor.update(data);
        res.send("Advisors updated successfuly");
    } catch (error) {
        res.status(400).send(error.message);
    }
};
const addaa = async () => {
    const data = req.body;
    try {
        await firestore.collection('Advisors').add(data);
        res.send('Advisors añadido');
    } catch (error) {
        res.status(400).send(error.message);
    }
}
module.exports = {
    getUsers,

    getUser,
    addUser,
    updateUser,

    addUserAdvisors,
    updatUserAdvisors,
    addaa
}
