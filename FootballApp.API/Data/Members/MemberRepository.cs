using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FootballApp.API.Helpers;
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
            var user = await _userManager.Users.Include(p => p.Photos).FirstOrDefaultAsync(u => u.Id == id);
            // var user = await _userManager.FindByIdAsync(id.ToString());
            return user;
        }

        public async Task<PagedList<User>> GetUsers(UserParams userParams)
        {
            // querable is for filtering
            var users = _userManager.Users.Include(p => p.Photos).AsQueryable();

            // filtering not to show logged in user's profile
            users = users.Where(u => u.Id != userParams.UserId);

            users = users.Where(u => u.Gender == userParams.Gender);

            // additional filtering area 
            if (userParams.MinAge != 18 || userParams.MaxAge != 99){
                var minDoB = DateTime.Today.AddYears(-userParams.MaxAge - 1);// minDateOfBirth
                var maxDoB = DateTime.Today.AddYears(-userParams.MinAge);

                users = users.Where(u => u.DateOfBirth >= minDoB && u.DateOfBirth <= maxDoB);
            }
            // end of additional filtering area

            // return users;
            return await PagedList<User>.CreateAsync(users, userParams.PageNumber, userParams.PageSize);
        }

        public async Task<bool> SaveAll()
        {
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<Photo> GetPhoto(int id) {
            var photo = await _context.Photo.FirstOrDefaultAsync(p => p.Id == id);

            return photo;
        }

        public async Task<Photo> GetMainPhotoForUser(int userId) {
            var photo = await _context.Photo.FirstOrDefaultAsync(p => p.isMain);
            return photo;
        }
    }
}