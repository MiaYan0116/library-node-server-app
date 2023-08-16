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