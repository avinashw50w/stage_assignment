import { MovieModel, IMovieModel } from "./movie";
import { UserModel, IUserModel } from "./user";
import { TVShowModel, ITVShowModel } from "./tvShow";
import { UserListModel, IUserListModel } from "./userList";

export const Movies: IMovieModel = MovieModel;
export const Users: IUserModel = UserModel;
export const TVShows: ITVShowModel = TVShowModel;
export const UserList: IUserListModel = UserListModel;
