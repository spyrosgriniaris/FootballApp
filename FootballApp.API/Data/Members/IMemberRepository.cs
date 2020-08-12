using System.Collections.Generic;
using System.Threading.Tasks;
using FootballApp.API.Dtos;
using FootballApp.API.Helpers;
using FootballApp.API.Models;

namespace FootballApp.API.Data
{
    public interface IMemberRepository
    {
         void Add<T>(T entity) where T: class;
         void Delete<T>(T entity) where T: class;
         Task<bool> SaveAll();
        //  Task<IEnumerable<User>> GetUsers();
        Task<PagedList<User>> GetUsers(UserParams userParams);
        Task<PagedList<User>> GetUsersForLikes(LikesParams likesParams);
         Task<User> GetUser(int id, bool isCurrentUser);
         Task<Photo> GetPhoto(int id);
         Task<Photo> GetMainPhotoForUser(int userId);
         Task<Like> GetLike(int userId, int recipientId);
         Task<MembersForSearchDto> SearchUsers(string searchWord);
         Task<IEnumerable<int>> GetUserLikes(int id, bool likers);
         Task<User> GetUserWithPositions(int userId);
    }
}