using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using FootballApp.API.Dtos;
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
        private readonly IMapper _mapper;
        public MemberRepository(DataContext context, UserManager<User> userManager, IMapper mapper)
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

            // likes functionality
            if (userParams.Likers)
            {
                var userLikers = await GetUserLikes(userParams.UserId, userParams.Likers);
                users = users.Where(u => userLikers.Contains(u.Id));
            }

            if (userParams.Likees)
            {
                var userLikees = await GetUserLikes(userParams.UserId, userParams.Likers);
                users = users.Where(u => userLikees.Contains(u.Id));
            }
            // end of likes functionality

            // additional filtering area 
            if (userParams.MinAge != 18 || userParams.MaxAge != 99){
                var minDoB = DateTime.Today.AddYears(-userParams.MaxAge - 1);// minDateOfBirth
                var maxDoB = DateTime.Today.AddYears(-userParams.MinAge);

                users = users.Where(u => u.DateOfBirth >= minDoB && u.DateOfBirth <= maxDoB);
            }

            if(!String.IsNullOrEmpty(userParams.SearchWord)) {
                users = users.Where(u => u.NormalizedUserName.Contains(userParams.SearchWord.ToUpper()));
            }
            // end of additional filtering area

            // return users;
            return await PagedList<User>.CreateAsync(users, userParams.PageNumber, userParams.PageSize);
        }

        public async Task<Photo> GetPhoto(int id) {
            var photo = await _context.Photo.FirstOrDefaultAsync(p => p.Id == id);

            return photo;
        }

        public async Task<Photo> GetMainPhotoForUser(int userId) {
            var photo = await _context.Photo.FirstOrDefaultAsync(p => p.isMain);
            return photo;
        }

        public async Task<Like> GetLike(int userId, int recipientId) {
            return await _context.Likes.FirstOrDefaultAsync(u => u.LikerId == userId && u.LikeeId == recipientId);
        }

        private async Task<IEnumerable<int>> GetUserLikes(int id, bool likers){
            var user = await _userManager.Users
                .Include(x => x.Likers)
                .Include(x => x.Likees)
                .FirstOrDefaultAsync(u => u.Id == id);

            if (likers){
                // list of likers of the currently loggedIn user
                return user.Likers.Where(u => u.LikeeId == id).Select(i => i.LikerId);
            }
            else {
                return user.Likees.Where(u => u.LikerId == id).Select(i => i.LikeeId);
            }
        }

        public async Task<MembersForSearchDto> SearchUsers(string searchWord) {
            var users = _userManager.Users.AsQueryable();
            
            if ( !String.IsNullOrEmpty(searchWord)) {
                users = users.Where(u => u.UserName.Contains(searchWord));
            }

            MemberForListDto[] usersToReturn = new MemberForListDto[await users.CountAsync()];
            
            int count = 0;
            foreach(User user in users ) {
                var userToReturn = _mapper.Map<MemberForListDto>(user);
                usersToReturn[count] = (userToReturn);
                count++;
            }

            MembersForSearchDto membersForSearchDto = new MembersForSearchDto {
                TotalCount = await users.CountAsync(),
                IncompleteResults = false,
                Users = usersToReturn.ToList()
            };

            return membersForSearchDto;
        }
    }
}