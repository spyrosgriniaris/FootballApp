using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using FootballApp.API.Helpers;
using FootballApp.API.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace FootballApp.API.Data.Members
{
   
    public class TeamRepository : ITeamRepository
    {
         private readonly DataContext _context;
        private readonly UserManager<User> _userManager;
        private readonly IMapper _mapper;
        public TeamRepository(DataContext context, UserManager<User> userManager, IMapper mapper)
        {
            _context = context;
            _userManager = userManager;
            _mapper = mapper;
        }
        public void Add<T>(T entity) where T : class
        {
            _context.Add(entity);
        }

        public void Delete<T>(T entity) where T : class
        {
            _context.Remove(entity);
        }


        public async Task<bool> SaveAll()
        {
            return await _context.SaveChangesAsync() > 0;
        }

        
        public async Task<PagedList<RosterPlayers>> GetRosterPlayers(TeamParams teamParams, int teamId)
        {
            var rosterPlayers = _context.RosterPlayers.AsQueryable();

            rosterPlayers = rosterPlayers.Where(r => r.TeamId == teamId);
            
            return await PagedList<RosterPlayers>.CreateAsync(rosterPlayers, teamParams.PageNumber, teamParams.PageSize);
        }

        public async Task<RosterPlayers> GetRosterPlayer(int id) {
            var query = _context.RosterPlayers.AsQueryable();

            var rosterPlayer = await query.FirstOrDefaultAsync(u => u.Id == id);

            return rosterPlayer;
        }
    }
}