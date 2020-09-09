using System.Threading.Tasks;
using FootballApp.API.Helpers;
using FootballApp.API.Models;

namespace FootballApp.API.Data.Members
{
    public interface ITeamRepository
    {
        void Add<T>(T entity) where T: class;
         void Delete<T>(T entity) where T: class;
         Task<bool> SaveAll();
         Task<PagedList<RosterPlayers>> GetRosterPlayers(TeamParams teamParams, int teamId);
         Task<RosterPlayers> GetRosterPlayer(int id);
    }
}