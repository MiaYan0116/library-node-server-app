import usersModel from './users-model.js';

export const findAllUsers = () => usersModel.find();
export const findUserById = (id) => usersModel.findById(id);
export const findUserByUsername = ({username}) => usersModel.findOne({username});
export const findUserByCredentials = (username, password) => usersModel.findOne({ username, password });
export const createUser = (user) => usersModel.create(user);
export const updatedUser = (id, user) => usersModel.updateOne({_id: id}, {$set: user});
export const addCommentToUser = async (userId, comment) => {
    const updatedUser = await usersModel.findOneAndUpdate(
        {_id: userId},
        {$push: {bookComments: comment}},
        {new: true}
    );
    return updatedUser;
}

export const addLikeToUser = async (userId, like) => {
    const updatedUser = await usersModel.findByIdAndUpdate(
        {_id: userId},
        {$push: {likes: like}},
        {new: true}
    );
    return updatedUser;
}

export const addFollowToUser = async(currentUserId, followUserId) => {
    const updatedCurrentUser = await usersModel.findByIdAndUpdate(
        currentUserId,
        { $addToSet: { follows: followUserId } }, // Use $addToSet to avoid duplicate entries
        { new: true }
    );
    const updatedFollowedUser = await usersModel.findByIdAndUpdate(
        followUserId,
        { $addToSet: { followers: currentUserId } },
        { new: true }
    );
    return { updatedCurrentUser, updatedFollowedUser };
}

export const getFollowedUsers = async(currentUserId) => {
    const currentUser = await usersModel.findById(currentUserId);
    if (!currentUser) {
        throw new Error("User not found");
    }
    return currentUser.follows;
}
