using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using FootballApp.API.Data;
using FootballApp.API.Dtos;
using FootballApp.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace FootballApp.API.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    [AllowAnonymous]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly SignInManager<User> _signInManager;
        private readonly UserManager<User> _userManager;
        private readonly RoleManager<Role> _roleManager;
        private readonly IMapper _mapper;

        public AuthController(IConfiguration config, UserManager<User> userManager,
         SignInManager<User> signInManager, RoleManager<Role> roleManager, IMapper mapper)
        {
            _mapper = mapper;
            _roleManager = roleManager;
            _userManager = userManager;
            _signInManager = signInManager;
            _config = config;
        }

        // localhost:5000/api/auth/register
        [HttpPost("register")]
        public async Task<IActionResult> Register(UserForRegisterDto userForRegisterDto)
        {
            var userToCreate = _mapper.Map<User>(userForRegisterDto);

            var result = await _userManager.CreateAsync(userToCreate, userForRegisterDto.Password);

            if (result.Succeeded)
            {
                await _userManager.AddToRoleAsync(userToCreate, userForRegisterDto.Property);
                return CreatedAtRoute("GetUser", new {controller = "Members", id = userToCreate.Id}, _mapper.Map<MemberForDetailedDto>(userToCreate));
                // return StatusCode(201);
            }

            return BadRequest(result.Errors);

            // var createdUser = await _repo.Register(userToCreate, userForRegisterDto.Password);


        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(UserForLoginDto userForLoginDto)
        {
            // retrieve user from Batabase
            // var userFromDb = await _repo.Login(userForLoginDto.Username, userForLoginDto.Password);
            var userFromDb = await _userManager.FindByNameAsync(userForLoginDto.Username);

            var result = await _signInManager.CheckPasswordSignInAsync(userFromDb, userForLoginDto.Password, false);

            var user = _mapper.Map<MemberForListDto>(userFromDb);

            var roles = await _userManager.GetRolesAsync(userFromDb);

            if(roles.Contains("Team"))
                user.Role = "Team";
            else if(roles.Contains("Player"))
                user.Role = "Player";
            else if(roles.Contains("Admin"))
                user.Role = "Admin";

            if (result.Succeeded)
            {
                return Ok(new
                {
                    token = GenerateJwtToken(userFromDb).Result,
                    user
                });
            }

            return Unauthorized();




        }

        private async Task<string> GenerateJwtToken(User user)
        {
            var claims = new List<Claim> {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.UserName)
            };

            var roles = await _userManager.GetRolesAsync(user);

            foreach (var role in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config.GetSection("AppSettings:Token").Value));

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddDays(1),
                SigningCredentials = creds
            };

            var tokenHandler = new JwtSecurityTokenHandler();

            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }
    }
}