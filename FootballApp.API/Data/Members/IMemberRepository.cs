using System.Collections.Generic;
using System.Threading.Tasks;
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
         Task<User> GetUser(int id);
         Task<Photo> GetPhoto(int id);
         Task<Photo> GetMainPhotoForUser(int userId);
    }
}