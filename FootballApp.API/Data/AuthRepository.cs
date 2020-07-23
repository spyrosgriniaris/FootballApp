using System.Threading.Tasks;
using FootballApp.API.Models;
using Microsoft.EntityFrameworkCore;

namespace FootballApp.API.Data
{
    public class AuthRepository : IAuthRepository
    {
        private readonly DataContext _context;

        public AuthRepository(DataContext context)
        {
            _context = context;
        }


//=================== Login methods ================================================================
        public async Task<User> Login(string username, string password)
        {
            var user = await _context.Users.FirstOrDefaultAsync(x => x.UserName == username);

             if(user == null){
                return null;
            }



            // if(!VerifyPasswordHash(password, user.PasswordHash, user.PasswordSalt)){
            //     return null;
            // }

            return user;
        }

        private bool VerifyPasswordHash(string password, byte[] passwordHash, byte[] passwordSalt)
        {
            using (var hmac = new System.Security.Cryptography.HMACSHA512(passwordSalt))
            {
                var computedHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
                for(int i = 0; i < computedHash.Length; i++){
                    if(computedHash[i] != passwordHash[i]) return false;
                }
            }
            return true;
        }
//====================== End of Login methods ======================================================




// ====================== Register methods ========================================================
        public async Task<User> Register(User user, string password)
        {
            byte[] passwordHash, passwordSalt;
            // out passes a reference
            // if these variables change value in another function, they also change values here
            CreatePasswordHash(password, out passwordHash, out passwordSalt);

            // user.PasswordHash = passwordHash;
            // user.PasswordSalt = passwordSalt;

            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();

            return user;
        }

        private void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            //everything inside using will be disposed after
            using (var hmac = new System.Security.Cryptography.HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }
        }

        public async Task<bool> UserExists(string username)
        {
            if(await _context.Users.AnyAsync(x => x.UserName == username)){
                return true;
            }

            return false;
        }

//============================= End of register methods ===================================================
    }
}