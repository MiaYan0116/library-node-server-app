import * as usersDao from "./users-dao.js";

const UsersController = (app) => {
    const register = async (req, res) => {
        const user = await usersDao.findUserByUsername(req.body.username);
        if(user){
            res.sendStatus(403);
            console.log("duplicated user");
            return;
        }
        const newUser = await usersDao.createUser(req.body);
        req.session["currentUser"] = newUser;
        res.json(newUser);
    }

    const login = async (req, res) => {
        const username = req.body.username;
        const password = req.body.password;
        if(password && username){
            const user = await usersDao.findUserByCredentials(username, password);
            if(!user){
                res.sendStatus(403);
            }else{
                req.session["currentUser"] = user;
                res.json(user);
            }
        }else{
            res.sendStatus(403);
        }
    }

    const logout = (req, res) => {
        req.session.destroy();
        res.sendStatus(200); 
    };

    const ownProfile = (req, res) => {
        const currentUser = req.session["currentUser"];
        if(!currentUser){
            console.log("No found");
            res.sendStatus(404);
            return;
        }
        res.json(currentUser);
    }

    const update = async (req, res) => {
        const currentUser = req.session["currentUser"];
        if(!currentUser){
            res.sendStatus(404);
            return;
        }
        const uid = currentUser._id;
        const newUser = req.body;
        const user = await usersDao.updatedUser(uid, newUser);
        res.json(user);
    }



    
    app.post("/api/users/register", register);
    app.post("/api/users/login", login);
    app.post("/api/users/logout", logout);
    app.post("/api/users/profile", ownProfile);
    app.put("/api/users", update);
};
export default UsersController;