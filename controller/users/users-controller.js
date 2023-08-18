import * as usersDao from "./users-dao.js";



const UsersController = (app) => {
    const register = async (req, res) => {
        const user = await usersDao.findUserByUsername({username: req.body.username});
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
            } else if (user.isBanned) {
                res.status(403).json({ message: "You are banned from logging in." });
            } else{
                const loginTimeDate = new Date();
                const month = loginTimeDate.getMonth() + 1; 
                const day = loginTimeDate.getDate();
                user.loginTime = month * 100 + day;;
                await user.save();
                req.session["currentUser"] = user;
                res.json(req.session["currentUser"]);
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
        const profile = {
            username: currentUser.username,
            fisrtname: currentUser.fisrtname,
            lastname: currentUser.lastname,
            email: currentUser.email,
            password: currentUser.password,
            follows: currentUser.follows,
            followers: currentUser.followers,
        }
        res.json(profile);
    }

    const ownLikes = (req, res) => {
        const currentUser = req.session["currentUser"];
        if(!currentUser){
            console.log("No found");
            res.sendStatus(404);
            return;
        }
        const likeAndComments = {
            likes: currentUser.likes,
            bookComments: currentUser.bookComments
        }
        res.json(likeAndComments);
    }

    const otherProfile = async (req, res) => {
        const userId = req.params.uid;
        const user = await usersDao.findUserById(userId);
        const otherProfile = {
            username: user.username,
            follows: user.follows,
            followers: user.followers,
            likes: user.likes,
            comments: user.bookComments
        }
        res.json(otherProfile);
    }

    const update = async (req, res) => {
        req.session["currentUser"] = req.body;
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

    const addFollowToUser = async (req, res) => {
        const currentUserId = req.session["currentUser"]._id; // Assuming you have the current user's ID in the session
        const followUserId = req.params.followUserId; // Assuming you can get the ID of the user to be followed from the URL
        const { updatedCurrentUser, updatedFollowedUser } = await usersDao.addFollowToUser(currentUserId, followUserId);
        res.json({ updatedCurrentUser, updatedFollowedUser });
    };

    const adminBanOtherUsers = async(req, res) => {
        const admin = req.session["currentUser"];
        if(!admin || !admin.isAdmin){
            res.sendStatus(403);
            return;
        }
        const userId = req.params.uid;
        const isBanned = req.body.isBanned;
        const userUpdated = await usersDao.findUserById(userId);
        if(!userUpdated){
            res.sendStatus(404);
            return;
        }
        userUpdated.isBanned = isBanned;
        await userUpdated.save();
        res.json(userUpdated);
    }

    const homePage = async (req, res) => {
        const currentUser = req.session["currentUser"];
        let likesCommentsData;
        if (currentUser) {
            // Get likes and comments of followed users
            const followedUsers = currentUser.follows;
            const promises = followedUsers.map(async userId => {
                const user = await usersDao.findUserById(userId);
                return {
                    username: user.username,
                    likes: user.likes,
                    comments: user.bookComments
                };
            });
            likesCommentsData = await Promise.all(promises);
        } else {
            // Get likes and comments of all users
            const allUsers = await usersDao.findAllUsers();
            const promises = allUsers.map(async user => {
                return {
                    username: user.username,
                    likes: user.likes,
                    comments: user.bookComments
                };
            });
            likesCommentsData = await Promise.all(promises);
        }
        // Render the home page template with appropriate data
        res.json(likesCommentsData); // Use your template engine or res.json()
    }

    const findAllUsers = async(req, res) => {
        const users = await usersDao.findAllUsers();
        users.sort((userA, userB) => userB.loginTime - userA.loginTime);
        res.json(users);
    }

    const findFollowsAndFollowers = async (req, res) => {
        const currentUser = req.session["currentUser"];
        const user = await usersDao.findById(currentUser._id).populate('follows followers').exec();
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const follows = user.follows;       
        const followers = user.followers;   
        res.status(200).json({ follows, followers });
    }
    
    app.post("/api/users/register", register);
    app.post("/api/users/login", login);
    app.post("/api/users/logout", logout);
    app.get("/api/users/profile", ownProfile);
    app.get("/api/users/profile/likes", ownLikes);
    app.get("/api/users/profile/:uid", otherProfile);
    app.put("/api/users", update);
    app.post("/api/users/follow/:followUserId", addFollowToUser);
    app.put("/api/users/:uid/ban", adminBanOtherUsers);
    app.get("/api/home", homePage);
    app.get("/api/users", findAllUsers);
    app.get("api/users/profile/follows", findFollowsAndFollowers);
    
};
export default UsersController;