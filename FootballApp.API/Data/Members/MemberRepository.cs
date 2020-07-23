using System.Collections.Generic;
using System.Threading.Tasks;
using FootballApp.API.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace FootballApp.API.Data.Members
{
    public class MemberRepository : IMemberRepository
    {
        private readonly DataContext _context;
        private readonly UserManager<User> _userManager;
        public MemberRepository(DataContext context, UserManager<User> userManager)
        {
            _context = context;
            _userManager = userManager;
        }
        public void Add<T>(T entity) where T : class
        {
            _context.Add(entity);
        }

        public void Delete<T>(T entity) where T : class
        {
            _context.Remove(entity);
        }

        public async Task<User> GetUser(int id)
        {
            var user = await _userManager.FindByIdAsync(id.ToString());

            return user;
        }

        public async Task<IEnumerable<User>> GetUsers()
        {
            var users = await _userManager.Users.Include(p => p.Photos).ToListAsync();

            return users;
        }

        public async Task<bool> SaveAll()
        {
            return await _context.SaveChangesAsync() > 0;
        }
    }
}