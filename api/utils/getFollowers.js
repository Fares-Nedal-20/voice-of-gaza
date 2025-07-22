import User from "./../models/user.model.js";

export const getFollowers = async (userId) => {
  const user = await User.findById(userId).populate(
    "followers",
    "username email"
  );

  return user.followers;
};
